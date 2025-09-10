// Step 2: OTP Verification Script
let otpTimer = null;
let userData = {};

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    loadUserData();
    initializeOTPInputs();
    setupEventListeners();
    startOTPTimer();
});

// Load user data from sessionStorage
function loadUserData() {
    const storedUserData = sessionStorage.getItem('userData');
    const verificationEmail = sessionStorage.getItem('verificationEmail');
    
    if (storedUserData && verificationEmail) {
        userData = JSON.parse(storedUserData);
        document.getElementById('emailDisplay').textContent = verificationEmail;
    } else {
        // If no data, redirect back to step 1
        window.location.href = 'step1-details.html';
    }
}

// OTP Input Management
function initializeOTPInputs() {
    const otpInputs = document.querySelectorAll('.otp-input');
    
    otpInputs.forEach((input, index) => {
        input.addEventListener('input', (e) => {
            if (e.target.value.length === 1) {
                if (index < otpInputs.length - 1) {
                    otpInputs[index + 1].focus();
                }
            }
        });
        
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !e.target.value && index > 0) {
                otpInputs[index - 1].focus();
            }
        });
        
        input.addEventListener('paste', (e) => {
            e.preventDefault();
            const pastedData = e.clipboardData.getData('text').slice(0, 6);
            const digits = pastedData.split('');
            
            digits.forEach((digit, i) => {
                if (i < otpInputs.length && /^\d$/.test(digit)) {
                    otpInputs[i].value = digit;
                }
            });
            
            const lastFilledIndex = Math.min(digits.length, otpInputs.length) - 1;
            if (lastFilledIndex >= 0) {
                otpInputs[lastFilledIndex].focus();
            }
        });
    });
}

// Event Listeners
function setupEventListeners() {
    document.getElementById('otpForm').addEventListener('submit', handleOTPSubmit);
    document.getElementById('resendOtp').addEventListener('click', resendOTP);
}

// Handle OTP Verification
async function handleOTPSubmit(e) {
    e.preventDefault();
    
    const otpInputs = document.querySelectorAll('.otp-input');
    const otp = Array.from(otpInputs).map(input => input.value).join('');
    
    if (otp.length !== 6) {
        document.getElementById('otpError').textContent = 'Please enter all 6 digits';
        return;
    }
    
    await verifyOTP(otp);
}

// Verify OTP
async function verifyOTP(otp) {
    showLoading('Verifying code...');
    
    try {
        // Simulate API call - Replace with actual API call
        await simulateAPICall();
        
        // Create user profile
        await createUserProfile();
        
        // Redirect to scheduling step
        window.location.href = 'step3-schedule.html';
        
    } catch (error) {
        console.error('Error verifying OTP:', error);
        document.getElementById('otpError').textContent = 'Invalid code. Please try again.';
    } finally {
        hideLoading();
    }
}

// Create User Profile
async function createUserProfile() {
    showLoading('Creating your profile...');
    
    try {
        // Simulate API call - Replace with actual API call
        await simulateAPICall();
        
        // Add profile ID to user data
        userData.profileId = 'USER_' + Date.now(); // Simulated user ID
        
        // Update stored user data
        sessionStorage.setItem('userData', JSON.stringify(userData));
        
    } catch (error) {
        console.error('Error creating profile:', error);
        throw error;
    }
}

// OTP Timer
function startOTPTimer() {
    let seconds = 60;
    const timerElement = document.getElementById('resendTimer');
    const resendButton = document.getElementById('resendOtp');
    
    resendButton.disabled = true;
    
    otpTimer = setInterval(() => {
        seconds--;
        timerElement.textContent = `Resend available in ${seconds}s`;
        
        if (seconds <= 0) {
            clearInterval(otpTimer);
            timerElement.textContent = '';
            resendButton.disabled = false;
        }
    }, 1000);
}

// Resend OTP
async function resendOTP() {
    const otpInputs = document.querySelectorAll('.otp-input');
    otpInputs.forEach(input => input.value = '');
    otpInputs[0].focus();
    
    const verificationEmail = sessionStorage.getItem('verificationEmail');
    await sendOTP(verificationEmail);
    startOTPTimer();
}

// Send OTP
async function sendOTP(email) {
    showLoading('Sending verification code...');
    
    try {
        // Simulate API call - Replace with actual API call
        await simulateAPICall();
        
    } catch (error) {
        console.error('Error sending OTP:', error);
        alert('Failed to send verification code. Please try again.');
    } finally {
        hideLoading();
    }
}

// Go back to previous step
function goBack() {
    window.location.href = 'step1-details.html';
}

// Loading State
function showLoading(text = 'Processing...') {
    document.getElementById('loadingText').textContent = text;
    document.getElementById('loadingOverlay').classList.remove('hidden');
}

function hideLoading() {
    document.getElementById('loadingOverlay').classList.add('hidden');
}

// Utility: Simulate API Call
function simulateAPICall(delay = 1500) {
    return new Promise(resolve => setTimeout(resolve, delay));
}