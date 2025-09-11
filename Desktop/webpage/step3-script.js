// State management
let userData = {};
let selectedTimeSlot = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadUserData();
    loadNutritionistCalendar();
    setupConfirmBookingListener();
});

// Navigation functions
function goToStep2() {
    window.location.href = 'step2-verification.html';
}

function goToStep4() {
    window.location.href = 'step4-confirmation.html';
}

// Load user data from previous step
function loadUserData() {
    const storedData = sessionStorage.getItem('userData');
    if (storedData) {
        userData = JSON.parse(storedData);
        console.log('Loaded user data:', userData);
    } else {
        // If no user data, redirect back to step 1
        alert('Please complete the previous steps first.');
        window.location.href = 'step1-details.html';
    }
}

// Setup confirm booking listener
function setupConfirmBookingListener() {
    const confirmBtn = document.getElementById('confirmBooking');
    if (confirmBtn) {
        confirmBtn.addEventListener('click', handleBookingConfirmation);
        console.log('Confirm booking listener attached');
    }
}

// Load nutritionist calendar (prototype)
async function loadNutritionistCalendar() {
    showLoading('Loading available slots...');
    
    try {
        await simulateAPICall();
        
        // Generate calendar for next 7 days with sample slots
        const calendarContainer = document.getElementById('calendarContainer');
        calendarContainer.innerHTML = generateCalendarHTML();
        
        // Add event listeners to time slots
        document.querySelectorAll('.time-slot').forEach(slot => {
            slot.addEventListener('click', function() {
                selectTimeSlot(this);
            });
        });
        
    } catch (error) {
        console.error('Error loading calendar:', error);
        alert('Failed to load available time slots. Please refresh the page.');
    } finally {
        hideLoading();
    }
}

function generateCalendarHTML() {
    const today = new Date();
    const days = [];
    
    // Generate next 7 days
    for (let i = 1; i <= 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        const dayNum = date.getDate();
        const month = date.toLocaleDateString('en-US', { month: 'short' });
        
        // Generate sample time slots (avoiding weekends for demo)
        const isWeekend = date.getDay() === 0 || date.getDay() === 6;
        const timeSlots = isWeekend ? [] : [
            '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM'
        ].filter(() => Math.random() > 0.3); // Randomly show some as unavailable
        
        days.push({
            date: date.toISOString().split('T')[0],
            dayName,
            dayNum,
            month,
            timeSlots
        });
    }
    
    return `
        <div class="calendar-grid">
            ${days.map(day => `
                <div class="calendar-day">
                    <div class="day-header">
                        <div class="day-name">${day.dayName}</div>
                        <div class="day-date">${day.dayNum} ${day.month}</div>
                    </div>
                    <div class="time-slots">
                        ${day.timeSlots.length > 0 ? 
                            day.timeSlots.map(time => `
                                <button class="time-slot" data-date="${day.date}" data-time="${time}">
                                    ${time}
                                </button>
                            `).join('') : 
                            '<div class="no-slots">No available slots</div>'
                        }
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function selectTimeSlot(slotElement) {
    // Remove selection from other slots
    document.querySelectorAll('.time-slot').forEach(slot => {
        slot.classList.remove('selected');
    });
    
    // Select current slot
    slotElement.classList.add('selected');
    
    // Store selected slot data
    selectedTimeSlot = {
        date: slotElement.dataset.date,
        time: slotElement.dataset.time,
        formatted: formatSlotDisplay(slotElement.dataset.date, slotElement.dataset.time)
    };
    
    // Show selected slot
    const container = document.getElementById('selectedSlotContainer');
    const display = document.getElementById('selectedSlotDisplay');
    
    display.textContent = selectedTimeSlot.formatted;
    container.classList.remove('hidden');
    
    // Enable confirm button
    document.getElementById('confirmBooking').disabled = false;
    
    console.log('Selected time slot:', selectedTimeSlot);
}

function formatSlotDisplay(date, time) {
    const dateObj = new Date(date);
    const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
    const monthDay = dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
    
    return `${dayName}, ${monthDay} at ${time}`;
}

// Handle booking confirmation
async function handleBookingConfirmation() {
    if (!selectedTimeSlot) {
        alert('Please select a time slot first.');
        return;
    }
    
    showLoading('Confirming your booking...');
    
    try {
        await simulateAPICall();
        
        // Update user data with appointment info
        userData.appointment = {
            date: selectedTimeSlot.date,
            time: selectedTimeSlot.time,
            formatted: selectedTimeSlot.formatted,
            nutritionist: 'Dr. Sarah Johnson',
            type: 'Free Consultation (15 minutes)'
        };
        
        // Store updated data
        sessionStorage.setItem('userData', JSON.stringify(userData));
        
        console.log('Booking confirmed:', userData.appointment);
        
        // Redirect to step 4
        window.location.href = 'step4-confirmation.html';
        
    } catch (error) {
        console.error('Error confirming booking:', error);
        alert('Failed to confirm booking. Please try again.');
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
window.goToStep2 = goToStep2;
window.goToStep4 = goToStep4;