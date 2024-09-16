// Store student numbers and their entry dates
let studentEntries = {};

// Helper function to remove entries older than 365 days
function filterOldEntries(entries) {
    const today = new Date();
    return entries.filter(entryDate => {
        const diffTime = Math.abs(today - new Date(entryDate));
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 365; // Keep entries within 365 days
    });
}

// Function to submit student number
document.getElementById('studentForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const studentNumber = document.getElementById('studentNumber').value.trim();
    if (!studentNumber) {
        alert("Please enter a student number.");
        return;
    }

    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

    // Check if the student number already exists in the entries
    if (!studentEntries[studentNumber]) {
        studentEntries[studentNumber] = [];
    }

    // Add today's date to the student's entries
    studentEntries[studentNumber].push(today);

    // Filter out old entries older than 365 days
    studentEntries[studentNumber] = filterOldEntries(studentEntries[studentNumber]);

    // Display how many times the student number has been entered in the past 365 days
    document.getElementById('result').innerHTML = `Student ${studentNumber} has been entered ${studentEntries[studentNumber].length} times in the last 365 days.`;

    // Clear the input field
    document.getElementById('studentNumber').value = '';
});

// Function to download the report in Excel format
document.getElementById('reportButton').addEventListener('click', function() {
    const reportData = [];

    // Prepare data for each student
    for (let studentNumber in studentEntries) {
        reportData.push({
            studentNumber: studentNumber,
            count: studentEntries[studentNumber].length,
            dates: studentEntries[studentNumber].join(', ')
        });
    }

    // Convert data to CSV format
    let csvContent = "Student Number,Count,Dates\n";
    reportData.forEach(entry => {
        csvContent += `${entry.studentNumber},${entry.count},"${entry.dates}"\n`;
    });

    // Create a Blob and download it as a CSV file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'student_report.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
});
