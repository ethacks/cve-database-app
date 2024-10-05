let currentEditIndex = null;

// Sample initial CVE records
const cveRecords = [
  { cveId: 'CVE-2021-12345', severity: 'High', cvss: 9.8, affectedPackages: 'pkg1, pkg2', cweId: 'CWE-89' },
  { cveId: 'CVE-2022-23456', severity: 'Medium', cvss: 5.6, affectedPackages: 'pkg3', cweId: 'CWE-79' },
  { cveId: 'CVE-2023-34567', severity: 'Low', cvss: 3.2, affectedPackages: 'pkg4', cweId: 'CWE-22' },
  { cveId: 'CVE-2024-45678', severity: 'Critical', cvss: 9.9, affectedPackages: 'pkg5', cweId: 'CWE-20' },
];

// Function to render the CVE table
function renderTable() {
  const tableBody = document.getElementById('cveTableBody');
  tableBody.innerHTML = ''; // Clear existing rows

  cveRecords.forEach((record, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${record.cveId}</td>
      <td>${record.severity}</td>
      <td>${record.cvss}</td>
      <td>${record.affectedPackages}</td>
      <td>${record.cweId}</td>
      <td>
        <button class="edit-button" onclick="editRecord(${index})">Edit</button>
        <button class="delete-button" onclick="deleteRecord(${index})">Delete</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

// Open the modal dialog
function openModal() {
  document.getElementById('cveModal').style.display = 'flex';
  document.getElementById('modalTitle').textContent = 'Add CVE Record'; // Reset title for adding
}

// Close the modal dialog
function closeModal() {
  document.getElementById('cveModal').style.display = 'none';
}

// Add or Edit Record
document.getElementById('cveForm').addEventListener('submit', function (e) {
  e.preventDefault();
  
  const newRecord = {
    cveId: document.getElementById('cveId').value,
    severity: document.getElementById('severity').value,
    cvss: parseFloat(document.getElementById('cvss').value),
    affectedPackages: document.getElementById('affectedPackages').value,
    cweId: document.getElementById('cweId').value
  };

  // Validation check
  if (!newRecord.cveId || !newRecord.severity || isNaN(newRecord.cvss)) {
    alert('Please fill in all the required fields.');
    return;
  }

  if (currentEditIndex !== null) {
    cveRecords[currentEditIndex] = newRecord; // Update existing record
  } else {
    cveRecords.push(newRecord); // Add new record
  }

  renderTable();
  closeModal();
});

// Edit Record
function editRecord(index) {
  currentEditIndex = index; // Set the index of the record being edited
  const record = cveRecords[index];

  // Populate the modal fields with the existing record data
  document.getElementById('cveId').value = record.cveId;
  document.getElementById('severity').value = record.severity;
  document.getElementById('cvss').value = record.cvss;
  document.getElementById('affectedPackages').value = record.affectedPackages;
  document.getElementById('cweId').value = record.cweId;

  document.getElementById('modalTitle').textContent = 'Edit CVE Record'; // Set the title of the modal
  openModal(); // Open the modal dialog
}

// Delete Record
function deleteRecord(index) {
  if (confirm('Are you sure you want to delete this record?')) {
    cveRecords.splice(index, 1);
    renderTable();
  }
}

// Sort the table by column index
function sortTable(columnIndex) {
  const table = document.getElementById('cveTable');
  const rows = Array.from(table.rows).slice(1);
  const direction = table.rows[0].cells[columnIndex].getAttribute('data-direction') || 'asc';

  // Define a mapping for severity levels
  const severityOrder = {
    'Low': 1,
    'Medium': 2,
    'High': 3,
    'Critical': 4 // Include Critical in the order
  };

  rows.sort((a, b) => {
    let aVal = a.cells[columnIndex].innerText;
    let bVal = b.cells[columnIndex].innerText;

    // If sorting by Severity, use the severity order
    if (columnIndex === 1) { // Severity column
      aVal = severityOrder[aVal] || 0; // Default to 0 if severity is unknown
      bVal = severityOrder[bVal] || 0;
    } else {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }

    if (direction === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  rows.forEach(row => table.appendChild(row)); // Append sorted rows back to the table
  table.rows[0].cells[columnIndex].setAttribute('data-direction', direction === 'asc' ? 'desc' : 'asc');
}

// Filter the table based on input selection
function filterTable() {
  const cveId = document.getElementById('filterCveId').value.toLowerCase();
  const severity = document.getElementById('filterSeverity').value.toLowerCase();
  const cvss = document.getElementById('filterCvss').value;
  const packages = document.getElementById('filterPackages').value.toLowerCase();
  const cweId = document.getElementById('filterCweId').value.toLowerCase();

  const tableBody = document.getElementById('cveTableBody');
  const rows = Array.from(tableBody.rows);

  rows.forEach(row => {
    const matches = (
      row.cells[0].innerText.toLowerCase().includes(cveId) &&
      row.cells[1].innerText.toLowerCase().includes(severity) &&
      (cvss ? row.cells[2].innerText.includes(cvss) : true) &&
      row.cells[3].innerText.toLowerCase().includes(packages) &&
      row.cells[4].innerText.toLowerCase().includes(cweId)
    );
    row.style.display = matches ? '' : 'none';
  });
}

// Initial render
renderTable();
