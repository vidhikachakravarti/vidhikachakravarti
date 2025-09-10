// Step 1: User Details Script
let selectedProgram = null;
let userData = {};

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    loadSelectedProgram();
    initializeFormValidation();
    setupEventListeners();
});

// Load selected program from sessionStorage
function loadSelectedProgram() {
    const storedProgram = sessionStorage.getItem('selectedProgram');
    if (storedProgram) {
        selectedProgram = JSON.parse(storedProgram);
        updateSelectedProgramSummary();
    } else {
        // If no program selected, redirect back to program selection
        window.location.href = 'onboarding.html';
    }
}

// Update selected program summary
function updateSelectedProgramSummary() {
    const summaryElement = document.getElementById('selectedProgramSummary');
    summaryElement.innerHTML = `
        <h3>Selected Program: ${selectedProgram.name}</h3>
        <p>3 months program - <span class="price">${selectedProgram.price}</span> (Regular: ${selectedProgram.originalPrice})</p>
    `;
    
    // Show/hide HbA1c field based on program type with smooth transition
    const hba1cGroup = document.getElementById('hba1c-group');
    const isDiabetesProgram = selectedProgram.id.includes('diabetes');
    
    if (isDiabetesProgram) {
        hba1cGroup.style.display = 'block';
        // Add class for smooth show animation
        setTimeout(() => {
            hba1cGroup.classList.add('show');
        }, 10);
    } else {
        hba1cGroup.classList.remove('show');
        // Hide after transition
        setTimeout(() => {
            hba1cGroup.style.display = 'none';
        }, 300);
        // Clear the value if hidden
        document.getElementById('hba1c').value = '';
    }
}

// Form Validation
function initializeFormValidation() {
    const form = document.getElementById('userDetailsForm');
    const inputs = form.querySelectorAll('input[required]');
    
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => clearError(input));
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
    } else if (field.type === 'email' && !isValidEmail(field.value)) {
        isValid = false;
        errorMessage = 'Please enter a valid email address';
    } else if (field.type === 'tel' && !isValidPhone(field.value)) {
        isValid = false;
        errorMessage = 'Please enter a valid phone number';
    } else if (field.type === 'number') {
        const value = parseFloat(field.value);
        const min = parseFloat(field.min);
        const max = parseFloat(field.max);
        
        if (isNaN(value) || (min && value < min) || (max && value > max)) {
            isValid = false;
            errorMessage = `Please enter a value between ${min} and ${max}`;
        }
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

// Event Listeners
function setupEventListeners() {
    // Form submission is handled in initializeFormValidation
}

// Handle form submission
async function handleDetailsSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const inputs = form.querySelectorAll('input[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    if (!isValid) return;
    
    // Collect user data
    userData = {
        fullName: document.getElementById('fullName').value,
        mobileNumber: document.getElementById('mobileNumber').value,
        email: document.getElementById('email').value,
        hba1c: document.getElementById('hba1c').value || null,
        height: document.getElementById('height').value,
        weight: document.getElementById('weight').value
    };
    
    // Store user data for next step
    sessionStorage.setItem('userData', JSON.stringify(userData));
    
    // Send OTP
    await sendOTP(userData.email);
}

// Send OTP
async function sendOTP(email) {
    showLoading('Sending verification code...');
    
    try {
        // Simulate API call - Replace with actual API call
        await simulateAPICall();
        
        // Store email for verification step
        sessionStorage.setItem('verificationEmail', email);
        
        // Redirect to verification step
        window.location.href = 'step2-verification.html';
        
    } catch (error) {
        console.error('Error sending OTP:', error);
        alert('Failed to send verification code. Please try again.');
    } finally {
        hideLoading();
    }
}

// Go back to program selection
function goBack() {
    window.location.href = 'onboarding.html';
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