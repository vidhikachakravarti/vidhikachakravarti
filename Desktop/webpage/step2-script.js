// State management
let userData = {};
let otpTimer = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeOTPInputs();
    loadUserData();
    setupEventListeners();
    startOTPTimer();
});

// Navigation functions
function goToStep1() {
    window.location.href = 'step1-details.html';
}

function goToStep3() {
    window.location.href = 'step3-schedule.html';
}

// Load user data from previous step
function loadUserData() {
    const storedData = sessionStorage.getItem('userData');
    if (storedData) {
        userData = JSON.parse(storedData);
        document.getElementById('emailDisplay').textContent = userData.email || 'your email';
    } else {
        // If no user data, redirect back to step 1
        alert('Please complete the previous step first.');
        goToStep1();
    }
}

// Setup event listeners
function setupEventListeners() {
    document.getElementById('otpForm').addEventListener('submit', handleOTPSubmit);
    document.getElementById('resendOtp').addEventListener('click', resendOTP);
}

// OTP Input Management
function initializeOTPInputs() {
    const otpInputs = document.querySelectorAll('.otp-input');
    
    otpInputs.forEach((input, index) => {
        input.addEventListener('input', function(e) {
            // Only allow numbers
            this.value = this.value.replace(/[^0-9]/g, '');
            
            // Auto move to next input
            if (this.value.length === 1 && index < otpInputs.length - 1) {
                otpInputs[index + 1].focus();
            }
            
            // Clear error message when user starts typing
            document.getElementById('otpError').textContent = '';
        });
        
        input.addEventListener('keydown', function(e) {
            // Handle backspace to go to previous input
            if (e.key === 'Backspace' && this.value === '' && index > 0) {
                otpInputs[index - 1].focus();
            }
        });
        
        input.addEventListener('paste', function(e) {
            e.preventDefault();
            const paste = (e.clipboardData || window.clipboardData).getData('text');
            const pasteData = paste.replace(/[^0-9]/g, '').slice(0, 6);
            
            // Fill inputs with pasted data
            for (let i = 0; i < pasteData.length && i < otpInputs.length; i++) {
                otpInputs[i].value = pasteData[i];
            }
            
            // Focus on next empty input or last input
            const nextEmptyIndex = pasteData.length < otpInputs.length ? pasteData.length : otpInputs.length - 1;
            otpInputs[nextEmptyIndex].focus();
        });
    });
}

// OTP Timer
function startOTPTimer() {
    let timeLeft = 60;
    const timerElement = document.getElementById('resendTimer');
    const resendButton = document.getElementById('resendOtp');
    
    resendButton.disabled = true;
    resendButton.style.opacity = '0.5';
    
    otpTimer = setInterval(() => {
        timerElement.textContent = `Resend code in ${timeLeft}s`;
        timeLeft--;
        
        if (timeLeft < 0) {
            clearInterval(otpTimer);
            timerElement.textContent = '';
            resendButton.disabled = false;
            resendButton.style.opacity = '1';
        }
    }, 1000);
}

// Handle OTP form submission
async function handleOTPSubmit(e) {
    e.preventDefault();
    
    const otpInputs = document.querySelectorAll('.otp-input');
    const otp = Array.from(otpInputs).map(input => input.value).join('');
    
    if (otp.length !== 6) {
        document.getElementById('otpError').textContent = 'Please enter all 6 digits';
        return;
    }
    
    showLoading('Verifying code...');
    
    try {
        // Simulate API call
        await simulateAPICall();
        
        // For demo purposes, accept any 6-digit code
        console.log('OTP verified:', otp);
        
        // Update user data
        userData.emailVerified = true;
        userData.otp = otp;
        
        // Store updated data
        sessionStorage.setItem('userData', JSON.stringify(userData));
        
        // Redirect to step 3
        window.location.href = 'step3-schedule.html';
        
    } catch (error) {
        console.error('Error verifying OTP:', error);
        document.getElementById('otpError').textContent = 'Invalid code. Please try again.';
    } finally {
        hideLoading();
    }
}

// Resend OTP
async function resendOTP() {
    showLoading('Resending code...');
    
    try {
        // Simulate API call
        await simulateAPICall(1000);
        
        console.log('OTP resent to:', userData.email);
        
        // Clear OTP inputs
        document.querySelectorAll('.otp-input').forEach(input => {
            input.value = '';
        });
        
        // Focus first input
        document.querySelector('.otp-input').focus();
        
        // Restart timer
        if (otpTimer) {
            clearInterval(otpTimer);
        }
        startOTPTimer();
        
        alert('Verification code resent successfully!');
        
    } catch (error) {
        console.error('Error resending OTP:', error);
        alert('Failed to resend code. Please try again.');
    } finally {
        hideLoading();
    }
}

// Loading functions
function showLoading(text = 'Processing...') {
    document.getElementById('loadingText').textContent = text;
    document.getElementById('loadingOverlay').classList.remove('hidden');
}

function hideLoading() {
    document.getElementById('loadingOverlay').classList.add('hidden');
}

// Utility functions
function simulateAPICall(delay = 1500) {
    return new Promise(resolve => setTimeout(resolve, delay));
}

// Make functions available globally
window.goToStep1 = goToStep1;
window.goToStep3 = goToStep3;