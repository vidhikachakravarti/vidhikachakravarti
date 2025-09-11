// Configuration
const API_CONFIG = {
    baseUrl: 'https://api.yourdomain.com', // Replace with your API URL
    endpoints: {
        sendOTP: '/auth/send-otp',
        verifyOTP: '/auth/verify-otp',
        createProfile: '/users/create-profile',
        getNutritionist: '/nutritionists/assigned',
        bookAppointment: '/appointments/book',
        generateDeepLink: '/app/deep-link'
    }
};

// State management
let userData = {};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeFormValidation();
    initializeProgramSelection();
});

// Navigation functions
function goToLanding() {
    window.location.href = 'onboarding-hindi.html';
}

function goToStep2() {
    window.location.href = 'step2-hindi.html';
}

// Program Selection Logic
function initializeProgramSelection() {
    const programSelect = document.getElementById('programInterest');
    const conditionalFields = document.getElementById('conditionalFields');
    const hba1cGroup = document.getElementById('hba1c-group');
    const heightField = document.getElementById('height');
    const weightField = document.getElementById('weight');
    
    programSelect.addEventListener('change', function() {
        const selectedProgram = this.value;
        
        if (selectedProgram) {
            // Show conditional fields container
            conditionalFields.classList.remove('hidden');
            conditionalFields.classList.add('show');
            
            // Make height and weight required for all programs
            heightField.required = true;
            weightField.required = true;
            
            if (selectedProgram === 'diabetes') {
                // Show HbA1c field for Diabetes Management
                hba1cGroup.classList.add('show');
                hba1cGroup.style.display = 'block';
            } else {
                // Hide HbA1c field for Weight Management
                hba1cGroup.classList.remove('show');
                hba1cGroup.style.display = 'none';
                // Clear HbA1c value
                document.getElementById('hba1c').value = '';
            }
        } else {
            // Hide conditional fields if no program selected
            conditionalFields.classList.add('hidden');
            conditionalFields.classList.remove('show');
            hba1cGroup.classList.remove('show');
            hba1cGroup.style.display = 'none';
            
            // Remove required attributes
            heightField.required = false;
            weightField.required = false;
            
            // Clear values
            heightField.value = '';
            weightField.value = '';
            document.getElementById('hba1c').value = '';
        }
    });
}

// Form Validation
function initializeFormValidation() {
    const form = document.getElementById('userDetailsForm');
    const inputs = form.querySelectorAll('input[required], select[required]');
    
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => clearError(input));
        if (input.tagName === 'SELECT') {
            input.addEventListener('change', () => clearError(input));
        }
    });
    
    form.addEventListener('submit', handleDetailsSubmit);
}

function validateField(field) {
    const errorElement = field.parentElement.querySelector('.error-message');
    if (!errorElement) return true;
    
    let isValid = true;
    let errorMessage = '';
    
    if (field.required && !field.value.trim()) {
        isValid = false;
        errorMessage = 'This field is required';
    } else if (field.type === 'email' && field.value && !isValidEmail(field.value)) {
        isValid = false;
        errorMessage = 'Please enter a valid email address';
    } else if (field.type === 'tel' && field.value && !isValidPhone(field.value)) {
        isValid = false;
        errorMessage = 'Please enter a valid phone number';
    } else if (field.type === 'number' && field.value) {
        const value = parseFloat(field.value);
        const min = parseFloat(field.min);
        const max = parseFloat(field.max);
        
        if (isNaN(value) || (min && value < min) || (max && value > max)) {
            isValid = false;
            errorMessage = `Please enter a value between ${min} and ${max}`;
        }
    } else if (field.tagName === 'SELECT' && field.required && !field.value) {
        isValid = false;
        errorMessage = 'Please select an option';
    }
    
    errorElement.textContent = errorMessage;
    field.classList.toggle('error', !isValid);
    
    return isValid;
}

function clearError(field) {
    const errorElement = field.parentElement.querySelector('.error-message');
    if (errorElement) {
        errorElement.textContent = '';
    }
    field.classList.remove('error');
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length >= 10;
}

// Step 1: Handle Details Form Submit
async function handleDetailsSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const allFields = form.querySelectorAll('input[required], select[required]');
    let isValid = true;
    
    // Validate all required fields
    allFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    if (!isValid) return;
    
    // Collect user data
    userData = {
        fullName: document.getElementById('fullName').value,
        mobileNumber: document.getElementById('mobileNumber').value,
        email: document.getElementById('email').value,
        programInterest: document.getElementById('programInterest').value,
        height: parseFloat(document.getElementById('height').value),
        weight: parseFloat(document.getElementById('weight').value)
    };
    
    // Add HbA1c only if it's filled (optional field)
    const hba1cValue = document.getElementById('hba1c').value;
    if (hba1cValue) {
        userData.hba1c = parseFloat(hba1cValue);
    }
    
    // Calculate BMI if height and weight are available
    if (userData.height && userData.weight) {
        userData.bmi = (userData.weight / Math.pow(userData.height / 100, 2)).toFixed(1);
    }
    
    // Add program name for display
    userData.programName = userData.programInterest === 'diabetes' ? 'Diabetes Management' : 'Weight Management';
    
    console.log('User data collected:', userData);
    
    showLoading('Sending verification code...');
    
    try {
        // Store user data in sessionStorage for next steps
        sessionStorage.setItem('userData', JSON.stringify(userData));
        
        // Simulate API call
        await simulateAPICall();
        
        // Redirect to step 2
        window.location.href = 'step2-hindi.html';
        
    } catch (error) {
        console.error('Error sending OTP:', error);
        alert('Failed to send verification code. Please try again.');
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

// Navigation function for going back to programs page
function goBack() {
    window.location.href = 'onboarding-hindi.html';
}

function goToPrograms() {
    window.location.href = 'onboarding-hindi.html';
}

// Make functions available globally
window.goToLanding = goToLanding;
window.goToStep2 = goToStep2;
window.goBack = goBack;
window.goToPrograms = goToPrograms;