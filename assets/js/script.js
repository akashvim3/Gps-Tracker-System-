// ===========================
// GLOBAL VARIABLES
// ===========================
let map;
let markers = [];

// ===========================
// NAVBAR FUNCTIONALITY
// ===========================
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!hamburger?.contains(e.target) && !navMenu?.contains(e.target)) {
        navMenu?.classList.remove('active');
    }
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
});

// ===========================
// MODAL FUNCTIONS
// ===========================
function openLoginModal() {
    const modal = document.getElementById('login-modal');
    if (modal) {
        modal.classList.add('active');
    }
}

function closeLoginModal() {
    const modal = document.getElementById('login-modal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function openSignupModal() {
    const modal = document.getElementById('signup-modal');
    if (modal) {
        modal.classList.add('active');
    }
}

function closeSignupModal() {
    const modal = document.getElementById('signup-modal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function openAddDeviceModal() {
    const modal = document.getElementById('add-device-modal');
    if (modal) {
        modal.classList.add('active');
    }
}

function closeAddDeviceModal() {
    const modal = document.getElementById('add-device-modal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function openCreateAlertModal() {
    const modal = document.getElementById('create-alert-modal');
    if (modal) {
        modal.classList.add('active');
    }
}

function closeCreateAlertModal() {
    const modal = document.getElementById('create-alert-modal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
    }
});

// ===========================
// DEMO FUNCTIONS
// ===========================
function playDemo() {
    alert('Demo video will play here. Connect to your video player!');
}

// ===========================
// DEVICE FUNCTIONS
// ===========================
function selectDevice(deviceId) {
    // Remove active class from all devices
    document.querySelectorAll('.device-item').forEach(item => {
        item.classList.remove('active');
    });

    // Add active class to selected device
    event.currentTarget.classList.add('active');

    console.log('Selected device:', deviceId);
    // Update map and info based on selected device
}

function trackDevice(deviceId) {
    console.log('Tracking device:', deviceId);
    window.location.href = 'dashboard.html?device=' + deviceId;
}

function editDevice(deviceId) {
    console.log('Editing device:', deviceId);
    alert('Edit device form will open here');
}

function deleteDevice(deviceId) {
    if (confirm('Are you sure you want to delete this device?')) {
        console.log('Deleting device:', deviceId);
        alert('Device deleted successfully');
    }
}

// ===========================
// FILTER FUNCTIONS
// ===========================
function applyFilters() {
    const device = document.getElementById('history-device')?.value;
    const startDate = document.getElementById('start-date')?.value;
    const endDate = document.getElementById('end-date')?.value;

    console.log('Applying filters:', { device, startDate, endDate });
    alert('Filters applied! Loading history data...');
}

function exportHistory() {
    console.log('Exporting history data');
    alert('History data exported as CSV');
}

function viewRoute(tripId) {
    console.log('Viewing route:', tripId);
    alert('Route playback will start here');
}

// ===========================
// ALERT FUNCTIONS
// ===========================
function markAllRead() {
    document.querySelectorAll('.alert-item.unread').forEach(item => {
        item.classList.remove('unread');
    });
    alert('All alerts marked as read');
}

function viewAlertDetails(alertId) {
    console.log('Viewing alert:', alertId);
    alert('Alert details will be displayed here');
}

// ===========================
// CONTACT FORM
// ===========================
function submitContactForm(e) {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    e.target.reset();
}

// ===========================
// SEARCH FUNCTIONALITY
// ===========================
const deviceSearch = document.getElementById('device-search');
if (deviceSearch) {
    deviceSearch.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        document.querySelectorAll('.device-card').forEach(card => {
            const deviceName = card.querySelector('h3')?.textContent.toLowerCase();
            if (deviceName && deviceName.includes(searchTerm)) {
                card.style.display = 'block';
            } else if (!card.classList.contains('add-device')) {
                card.style.display = 'none';
            }
        });
    });
}

// ===========================
// SMOOTH SCROLLING
// ===========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// ===========================
// ANIMATION ON SCROLL
// ===========================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.feature-card, .step, .pricing-card, .testimonial-card, .device-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
});

// ===========================
// INITIALIZE ON PAGE LOAD
// ===========================
document.addEventListener('DOMContentLoaded', () => {
    console.log('TrackPro GPS Tracking System Initialized');

    // Set current date inputs to today
    const today = new Date().toISOString().split('T')[0];
    const startDate = document.getElementById('start-date');
    const endDate = document.getElementById('end-date');

    if (startDate) startDate.value = today;
    if (endDate) endDate.value = today;
});
