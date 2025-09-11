// State management
let userData = {};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadUserData();
    displayConfirmationDetails();
    setupEventListeners();
});

// Navigation functions
function goToLanding() {
    window.location.href = 'onboarding.html';
}

// Load user data from previous steps
function loadUserData() {
    const storedData = sessionStorage.getItem('userData');
    if (storedData) {
        userData = JSON.parse(storedData);
        console.log('Final user data:', userData);
    } else {
        // If no user data, redirect back to step 1
        alert('Please complete the onboarding process first.');
        window.location.href = 'step1-details.html';
    }
}

// Display confirmation details
function displayConfirmationDetails() {
    // Display appointment details
    if (userData.appointment) {
        document.getElementById('appointmentDateTime').textContent = userData.appointment.formatted;
        document.getElementById('appointmentNutritionist').textContent = userData.appointment.nutritionist;
    }
    
    // Generate and display deep link
    generateDeepLink();
}

// Setup event listeners
function setupEventListeners() {
    document.getElementById('downloadAppBtn').addEventListener('click', handleAppDownload);
}

// Generate deep link (prototype)
function generateDeepLink() {
    // Generate a mock deep link based on user data
    const userId = generateUserId();
    const deepLink = `lillia://app/dashboard?userId=${userId}&token=${generateToken()}`;
    
    document.getElementById('deepLinkUrl').textContent = deepLink;
    
    // Store deep link for copying
    window.currentDeepLink = deepLink;
}

function generateUserId() {
    // Generate a simple user ID based on email and current time
    const email = userData.email || 'user@example.com';
    const timestamp = Date.now();
    return btoa(email + timestamp).slice(0, 12);
}

function generateToken() {
    // Generate a mock authentication token
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Copy deep link to clipboard
function copyDeepLink() {
    const deepLinkText = document.getElementById('deepLinkUrl').textContent;
    
    navigator.clipboard.writeText(deepLinkText).then(() => {
        // Show feedback
        const copyBtn = document.querySelector('.copy-btn');
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        copyBtn.style.background = '#4CAF50';
        
        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.style.background = '';
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy to clipboard:', err);
        
        // Fallback: select the text
        const deepLinkElement = document.getElementById('deepLinkUrl');
        const range = document.createRange();
        range.selectNode(deepLinkElement);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
        
        alert('Deep link selected. Press Ctrl+C to copy.');
    });
}

// Handle app download
function handleAppDownload() {
    // Detect platform and provide appropriate download link
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    
    let downloadUrl;
    if (/android/i.test(userAgent)) {
        downloadUrl = 'https://play.google.com/store/apps/details?id=com.lillia.health';
    } else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        downloadUrl = 'https://apps.apple.com/app/lillia-health/id123456789';
    } else {
        // Default to play store for web users
        downloadUrl = 'https://play.google.com/store/apps/details?id=com.lillia.health';
    }
    
    // Open download link
    window.open(downloadUrl, '_blank');
    
    // Log analytics event
    console.log('App download initiated', {
        platform: /android/i.test(userAgent) ? 'Android' : 'iOS',
        userId: userData.email,
        timestamp: new Date().toISOString()
    });
}

// Analytics and completion tracking
function trackOnboardingCompletion() {
    const completionData = {
        userId: userData.email,
        completedAt: new Date().toISOString(),
        userDetails: {
            fullName: userData.fullName,
            email: userData.email,
            phone: userData.mobileNumber,
            bmi: userData.bmi,
            hasHba1c: !!userData.hba1c
        },
        appointment: userData.appointment,
        source: 'web_onboarding'
    };
    
    console.log('Onboarding completed:', completionData);
    
    // In a real app, this would send data to analytics service
    // analytics.track('onboarding_completed', completionData);
}

// Auto-trigger completion tracking when page loads
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(trackOnboardingCompletion, 1000);
});

// Make functions available globally
window.goToLanding = goToLanding;
window.copyDeepLink = copyDeepLink;