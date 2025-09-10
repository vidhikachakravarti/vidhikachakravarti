// Step 4: Confirmation Script
let userData = {};
let confirmationData = {};

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    loadConfirmationData();
    setupEventListeners();
    updateConfirmationDetails();
});

// Load confirmation data from sessionStorage
function loadConfirmationData() {
    const storedUserData = sessionStorage.getItem('userData');
    const storedConfirmationData = sessionStorage.getItem('confirmationData');
    
    if (storedUserData && storedConfirmationData) {
        userData = JSON.parse(storedUserData);
        confirmationData = JSON.parse(storedConfirmationData);
    } else {
        // If no data, redirect back to step 1
        window.location.href = 'step1-details.html';
    }
}

// Event Listeners
function setupEventListeners() {
    document.getElementById('downloadAppBtn').addEventListener('click', handleAppDownload);
}

// Update Confirmation Details
function updateConfirmationDetails() {
    const appointment = confirmationData.appointment;
    const deepLink = confirmationData.deepLink;
    
    const date = new Date(appointment.dateTime);
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    
    document.getElementById('appointmentDateTime').textContent = 
        date.toLocaleDateString('en-US', options);
    document.getElementById('appointmentNutritionist').textContent = 
        appointment.nutritionist;
    document.getElementById('deepLinkUrl').textContent = deepLink;
}

// Handle App Download
function handleAppDownload() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const deepLink = confirmationData.deepLink;
    
    // Detect platform
    const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
    const isAndroid = /android/i.test(userAgent);
    
    // App store URLs (Prototype)
    const appStoreUrl = 'https://apps.apple.com/app/example-health-app';
    const playStoreUrl = 'https://play.google.com/store/apps/details?id=com.example.health';
    
    if (isIOS) {
        // Try deep link first, then fall back to App Store
        window.location.href = deepLink;
        setTimeout(() => {
            window.location.href = appStoreUrl;
        }, 2500);
    } else if (isAndroid) {
        // Try deep link first, then fall back to Play Store
        window.location.href = deepLink;
        setTimeout(() => {
            window.location.href = playStoreUrl;
        }, 2500);
    } else {
        // Desktop: Show QR code or options
        alert('Please download our app on your mobile device using the deep link provided.');
    }
}

// Copy Deep Link
function copyDeepLink() {
    const deepLinkText = document.getElementById('deepLinkUrl').textContent;
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(deepLinkText).then(() => {
            const button = event.target;
            const originalText = button.textContent;
            button.textContent = 'Copied!';
            button.style.background = 'var(--color-success)';
            
            setTimeout(() => {
                button.textContent = originalText;
                button.style.background = '';
            }, 2000);
        });
    } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = deepLinkText;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('Link copied to clipboard!');
    }
}

// Clear session data (optional - for completion)
function clearSessionData() {
    sessionStorage.removeItem('selectedProgram');
    sessionStorage.removeItem('userData');
    sessionStorage.removeItem('verificationEmail');
    sessionStorage.removeItem('confirmationData');
}

// Make function available globally for onclick handler
window.copyDeepLink = copyDeepLink;