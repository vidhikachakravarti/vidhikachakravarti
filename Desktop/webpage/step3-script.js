// Step 3: Schedule Appointment Script
let selectedTimeSlot = null;
let userData = {};

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    loadUserData();
    loadNutritionistCalendar();
    setupEventListeners();
});

// Load user data from sessionStorage
function loadUserData() {
    const storedUserData = sessionStorage.getItem('userData');
    
    if (storedUserData) {
        userData = JSON.parse(storedUserData);
    } else {
        // If no data, redirect back to step 1
        window.location.href = 'step1-details.html';
    }
}

// Event Listeners
function setupEventListeners() {
    const confirmBtn = document.getElementById('confirmBooking');
    if (confirmBtn) {
        confirmBtn.addEventListener('click', handleBookingConfirmation);
    }
}

// Load Nutritionist Calendar
async function loadNutritionistCalendar() {
    try {
        // Get assigned nutritionist info
        const nutritionist = await getAssignedNutritionist();
        
        // Update UI with nutritionist info
        document.getElementById('nutritionistName').textContent = nutritionist.name;
        
        // Initialize Google Calendar
        initializeGoogleCalendar(nutritionist.calendarId);
        
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
        calendarId: 'prototype-calendar@example.com'
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

// Handle Booking Confirmation
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
        
        // Store appointment and deep link data for final step
        const confirmationData = {
            appointment: appointment,
            deepLink: deepLink
        };
        sessionStorage.setItem('confirmationData', JSON.stringify(confirmationData));
        
        // Redirect to confirmation step
        window.location.href = 'step4-confirmation.html';
        
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

// Go back to previous step
function goBack() {
    window.location.href = 'step2-verification.html';
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