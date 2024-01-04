// Simulate a delay (e.g., loading resources) before displaying the main content
setTimeout(function () {
    // Hide splash screen
    document.getElementById('splash-container').style.display = 'none';

    // Show main content
    document.getElementById('main-content').style.display = 'block';
}, 3000); // Adjust the delay time (in milliseconds) as needed
