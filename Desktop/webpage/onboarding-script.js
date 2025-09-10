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

// Google Calendar Configuration (Prototype)
const GOOGLE_CALENDAR_CONFIG = {
    calendarId: 'prototype-calendar@example.com',
    apiKey: 'PROTOTYPE_KEY'
};

// State management
let userData = {};
let selectedProgram = null;
let currentStep = 'programs';
let otpTimer = null;
let selectedTimeSlot = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeProgramSelection();
    initializeFormValidation();
    initializeOTPInputs();
    setupEventListeners();
});

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
    document.getElementById('downloadAppBtn').addEventListener('click', handleAppDownload);
    document.getElementById('proceedToOnboarding').addEventListener('click', handleProceedToOnboarding);
}

// Setup confirm booking listener separately when the step becomes active
function setupConfirmBookingListener() {
    const confirmBtn = document.getElementById('confirmBooking');
    if (confirmBtn) {
        confirmBtn.addEventListener('click', handleBookingConfirmation);
        console.log('Confirm booking listener attached');
    }
}

// Step 1: Handle Details Form Submit
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
    
    // Send OTP
    await sendOTP(userData.email);
}

// Send OTP
async function sendOTP(email) {
    showLoading('Sending verification code...');
    
    try {
        // Simulate API call - Replace with actual API call
        await simulateAPICall();
        
        // In production, make actual API call:
        // const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.sendOTP}`, {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ email })
        // });
        
        document.getElementById('emailDisplay').textContent = email;
        goToStep(2);
        startOTPTimer();
        
    } catch (error) {
        console.error('Error sending OTP:', error);
        alert('Failed to send verification code. Please try again.');
    } finally {
        hideLoading();
    }
}

// Step 2: Handle OTP Verification
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
        
        // Load nutritionist calendar
        await loadNutritionistCalendar();
        
        goToStep(3);
        
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
        
        // In production:
        // const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.createProfile}`, {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(userData)
        // });
        
        userData.profileId = 'USER_' + Date.now(); // Simulated user ID
        
    } catch (error) {
        console.error('Error creating profile:', error);
        throw error;
    }
}

// Step 3: Load Nutritionist Calendar
async function loadNutritionistCalendar() {
    try {
        // Get assigned nutritionist info
        const nutritionist = await getAssignedNutritionist();
        
        // Update UI with nutritionist info
        document.getElementById('nutritionistName').textContent = nutritionist.name;
        
        // Initialize Google Calendar
        initializeGoogleCalendar(nutritionist.calendarId);
        
        // Setup confirm booking button listener
        setupConfirmBookingListener();
        
    } catch (error) {
        console.error('Error loading calendar:', error);
    }
}

// Get Assigned Nutritionist
async function getAssignedNutritionist() {
    // Simulate API call - Replace with actual API call
    await simulateAPICall();
    
    // Simulated nutritionist data
    return {
        id: 'NUT_001',
        name: 'Dr. Sarah Johnson',
        calendarId: GOOGLE_CALENDAR_CONFIG.calendarId
    };
}

// Initialize Google Calendar
function initializeGoogleCalendar(calendarId) {
    const calendarContainer = document.getElementById('calendarContainer');
    
    // For prototype: Create a mock calendar interface
    calendarContainer.innerHTML = `
        <div class="mock-calendar">
            <div class="calendar-header">
                <h4>Select your preferred time slot</h4>
                <p>Free Consultation - 30 minutes</p>
            </div>
            <div class="time-slots">
                ${generateTimeSlots()}
            </div>
        </div>
    `;
    
    // Add event listeners to time slots
    const slots = calendarContainer.querySelectorAll('.time-slot');
    slots.forEach(slot => {
        slot.addEventListener('click', function() {
            console.log('Time slot clicked:', this.textContent);
            
            // Remove previous selection
            slots.forEach(s => s.classList.remove('selected'));
            // Add selection to clicked slot
            this.classList.add('selected');
            
            // Update selected time
            selectedTimeSlot = this.dataset.datetime;
            updateSelectedSlot();
            
            // Enable confirm button
            const confirmBtn = document.getElementById('confirmBooking');
            confirmBtn.disabled = false;
            console.log('Confirm button enabled');
        });
    });
}

// Generate mock time slots for the prototype
function generateTimeSlots() {
    const slots = [];
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const times = ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM'];
    
    for (let i = 0; i < 3; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i + 1);
        const dayName = days[date.getDay() - 1] || 'Saturday';
        const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        
        slots.push(`<div class="slot-day">${dayName}, ${dateStr}</div>`);
        slots.push('<div class="slot-times">');
        
        times.forEach((time, index) => {
            const available = Math.random() > 0.2; // More slots available now
            if (available) { // Only show available slots
                const datetime = new Date(date);
                const [hour, period] = time.split(' ');
                const [h, m] = hour.split(':');
                datetime.setHours(period === 'PM' && h !== '12' ? parseInt(h) + 12 : parseInt(h), parseInt(m || 0));
                
                slots.push(`
                    <button class="time-slot" 
                            data-datetime="${datetime.toISOString()}">
                        ${time}
                    </button>
                `);
            }
        });
        
        slots.push('</div>');
    }
    
    return slots.join('');
}

// Update Selected Slot Display
function updateSelectedSlot() {
    if (selectedTimeSlot) {
        const container = document.getElementById('selectedSlotContainer');
        const display = document.getElementById('selectedSlotDisplay');
        
        const date = new Date(selectedTimeSlot);
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        
        display.textContent = date.toLocaleDateString('en-US', options);
        container.classList.remove('hidden');
    }
}

// Step 4: Handle Booking Confirmation
async function handleBookingConfirmation() {
    console.log('Booking confirmation clicked');
    
    if (!selectedTimeSlot) {
        alert('Please select a time slot first.');
        return;
    }
    
    showLoading('Confirming your appointment...');
    
    try {
        // Book appointment
        const appointment = await bookAppointment();
        
        // Send confirmation email
        await sendConfirmationEmail(appointment);
        
        // Generate deep link
        const deepLink = await generateDeepLink();
        
        // Update confirmation UI
        updateConfirmationDetails(appointment, deepLink);
        
        console.log('Redirecting to step 4');
        goToStep(4);
        
    } catch (error) {
        console.error('Error confirming booking:', error);
        alert('Failed to confirm booking. Please try again.');
    } finally {
        hideLoading();
    }
}

// Book Appointment
async function bookAppointment() {
    // Simulate API call - Replace with actual API call
    await simulateAPICall();
    
    return {
        id: 'APT_' + Date.now(),
        dateTime: selectedTimeSlot,
        nutritionist: 'Dr. Sarah Johnson',
        type: 'Free Consultation'
    };
}

// Send Confirmation Email
async function sendConfirmationEmail(appointment) {
    // Simulate API call - Replace with actual API call
    await simulateAPICall();
}

// Generate Deep Link
async function generateDeepLink() {
    // Simulate API call - Replace with actual API call
    await simulateAPICall();
    
    // Generate deep link with user token
    const userToken = btoa(userData.profileId);
    return `yourapp://login?token=${userToken}&source=web_onboarding`;
}

// Update Confirmation Details
function updateConfirmationDetails(appointment, deepLink) {
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
    
    // Store deep link for download button
    userData.deepLink = deepLink;
}

// Handle App Download
function handleAppDownload() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const deepLink = userData.deepLink;
    
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
    
    await sendOTP(userData.email);
}

// Program Selection Functions
function initializeProgramSelection() {
    const programRadios = document.querySelectorAll('input[name="selectedProgram"]');
    const proceedButton = document.getElementById('proceedToOnboarding');
    const expandButtons = document.querySelectorAll('.expand-btn');
    
    // Initialize expand/collapse functionality
    expandButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const programCard = this.closest('.program-card');
            const programDetails = programCard.querySelector('.program-details');
            const expandIcon = this.querySelector('.expand-icon');
            
            // Close other expanded cards
            document.querySelectorAll('.program-details.expanded').forEach(details => {
                if (details !== programDetails) {
                    details.classList.remove('expanded');
                    const otherBtn = details.closest('.program-card').querySelector('.expand-btn');
                    otherBtn.classList.remove('expanded');
                }
            });
            
            // Toggle current card
            const isExpanded = programDetails.classList.contains('expanded');
            if (isExpanded) {
                programDetails.classList.remove('expanded');
                this.classList.remove('expanded');
            } else {
                programDetails.classList.add('expanded');
                this.classList.add('expanded');
            }
        });
    });
    
    // Program selection functionality
    programRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.checked) {
                selectedProgram = {
                    id: this.value,
                    name: getProgramName(this.value),
                    price: getProgramPrice(this.value),
                    originalPrice: getProgramOriginalPrice(this.value)
                };
                proceedButton.disabled = false;
                
                // Add visual feedback to program items
                document.querySelectorAll('.program-item').forEach(item => {
                    item.classList.remove('selected');
                });
                this.closest('.program-item').classList.add('selected');
            }
        });
    });
    
    // Make program main area clickable to expand
    document.querySelectorAll('.program-main').forEach(main => {
        main.addEventListener('click', function() {
            const expandBtn = this.querySelector('.expand-btn');
            if (expandBtn) {
                expandBtn.click();
            }
        });
    });
}

function getProgramName(programId) {
    const programs = {
        'diabetes-light': 'Diabetes Management – Light',
        'diabetes-plus': 'Diabetes Management – Plus',
        'weight-light': 'Weight Management – Light',
        'weight-plus': 'Weight Management – Plus'
    };
    return programs[programId] || 'Unknown Program';
}

function getProgramPrice(programId) {
    const prices = {
        'diabetes-light': '₹999',
        'diabetes-plus': '₹1,999',
        'weight-light': '₹999',
        'weight-plus': '₹1,999'
    };
    return prices[programId] || '₹0';
}

function getProgramOriginalPrice(programId) {
    const prices = {
        'diabetes-light': '₹2,997',
        'diabetes-plus': '₹5,997',
        'weight-light': '₹2,997',
        'weight-plus': '₹5,997'
    };
    return prices[programId] || '₹0';
}

function handleProceedToOnboarding() {
    console.log('handleProceedToOnboarding called');
    console.log('selectedProgram:', selectedProgram);
    
    if (!selectedProgram) {
        alert('Please select a program first.');
        return;
    }
    
    console.log('Hiding program selection...');
    // Hide program selection first
    document.getElementById('programSelection').classList.add('hidden');
    
    console.log('Showing progress bar...');
    // Show progress bar with proper display and remove hidden class
    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
        progressBar.classList.remove('hidden');
        progressBar.style.display = 'flex';
        console.log('Progress bar should now be visible');
    }
    
    // Show selected program summary
    updateSelectedProgramSummary();
    
    console.log('Going to step 1...');
    // Go to step 1 (which will show the form)
    goToStep(1);
}

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

function goToPrograms() {
    // Hide all form steps
    document.querySelectorAll('.form-container').forEach(container => {
        container.classList.add('hidden');
    });
    
    // Hide progress bar and show program selection
    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
        progressBar.style.display = 'none';
        progressBar.classList.add('hidden');
    }
    
    document.getElementById('programSelection').classList.remove('hidden');
    currentStep = 'programs';
}

// Navigation
function goToStep(step) {
    console.log(`goToStep called with step: ${step}`);
    
    // Hide all steps except program selection
    document.querySelectorAll('.form-container').forEach(container => {
        container.classList.add('hidden');
    });
    
    // Show target step
    const targetStep = document.getElementById(`step${step}`);
    if (targetStep) {
        targetStep.classList.remove('hidden');
        console.log(`Step ${step} should now be visible`);
    } else {
        console.error(`Step ${step} element not found!`);
    }
    
    // Update progress bar
    updateProgressBar(step);
    
    currentStep = step;
}

// Update Progress Bar
function updateProgressBar(step) {
    const steps = document.querySelectorAll('.progress-step');
    
    steps.forEach((stepElement, index) => {
        const stepNumber = index + 1;
        
        if (stepNumber < step) {
            stepElement.classList.add('completed');
            stepElement.classList.remove('active');
        } else if (stepNumber === step) {
            stepElement.classList.add('active');
            stepElement.classList.remove('completed');
        } else {
            stepElement.classList.remove('active', 'completed');
        }
    });
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

// Make functions available globally for onclick handlers
window.goToStep = goToStep;
window.goToPrograms = goToPrograms;
window.copyDeepLink = copyDeepLink;

// Add smooth scrolling to program selection
function scrollToProgramSelection() {
    const programSelection = document.getElementById('programSelection');
    if (programSelection) {
        programSelection.scrollIntoView({ behavior: 'smooth' });
    }
}