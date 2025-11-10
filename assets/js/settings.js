// ===========================
// SETTINGS TAB NAVIGATION
// ===========================
function showSettingsTab(tabName) {
    // Remove active class from all panels and menu items
    document.querySelectorAll('.settings-panel').forEach(panel => {
        panel.classList.remove('active');
    });
    document.querySelectorAll('.settings-menu-item').forEach(item => {
        item.classList.remove('active');
    });

    // Add active class to selected panel and menu item
    document.getElementById(tabName + '-panel').classList.add('active');
    event.currentTarget.classList.add('active');

    // Prevent default anchor behavior
    event.preventDefault();
}

// ===========================
// PROFILE PHOTO MANAGEMENT
// ===========================
function handlePhotoUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('profile-image').src = e.target.result;
            showNotification('Profile photo updated successfully!', 'success');
        };
        reader.readAsDataURL(file);
    }
}

function removePhoto() {
    if (confirm('Are you sure you want to remove your profile photo?')) {
        document.getElementById('profile-image').src = 'images/gps-icon.png';
        showNotification('Profile photo removed', 'info');
    }
}

// ===========================
// THEME MANAGEMENT
// ===========================
function changeTheme() {
    const theme = document.getElementById('theme-selector').value;
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    showNotification(`Theme changed to ${theme} mode`, 'success');
}

// ===========================
// LANGUAGE MANAGEMENT
// ===========================
function changeLanguage() {
    const language = document.getElementById('language-selector').value;
    localStorage.setItem('language', language);
    showNotification(`Language changed. Page will reload...`, 'info');
    setTimeout(() => {
        location.reload();
    }, 1500);
}

// ===========================
// VOICE CONTROL
// ===========================
let voiceRecognition = null;

function toggleVoiceControl() {
    const isEnabled = document.getElementById('voice-toggle').checked;

    if (isEnabled) {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            voiceRecognition = new SpeechRecognition();
            voiceRecognition.continuous = true;
            voiceRecognition.interimResults = false;

            voiceRecognition.onresult = function(event) {
                const command = event.results[event.results.length - 1][0].transcript.toLowerCase();
                handleVoiceCommand(command);
            };

            showNotification('Voice control enabled', 'success');
        } else {
            alert('Voice recognition is not supported in your browser');
            document.getElementById('voice-toggle').checked = false;
        }
    } else {
        if (voiceRecognition) {
            voiceRecognition.stop();
            voiceRecognition = null;
        }
        showNotification('Voice control disabled', 'info');
    }
}

function testVoiceCommand() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();

        showNotification('Listening... Say a command!', 'info');

        recognition.onresult = function(event) {
            const command = event.results[0][0].transcript;
            showNotification(`You said: "${command}"`, 'success');
            handleVoiceCommand(command.toLowerCase());
        };

        recognition.onerror = function(event) {
            showNotification('Voice recognition error', 'error');
        };

        recognition.start();
    } else {
        alert('Voice recognition is not supported in your browser');
    }
}

function handleVoiceCommand(command) {
    console.log('Voice command:', command);

    if (command.includes('show dashboard') || command.includes('open dashboard')) {
        window.location.href = 'dashboard.html';
    } else if (command.includes('show devices')) {
        window.location.href = 'devices.html';
    } else if (command.includes('track') || command.includes('locate')) {
        window.location.href = 'dashboard.html';
    } else if (command.includes('alert') || command.includes('notification')) {
        window.location.href = 'alerts.html';
    } else if (command.includes('history')) {
        window.location.href = 'history.html';
    } else if (command.includes('help')) {
        toggleChat();
    }
}

// ===========================
// API KEY MANAGEMENT
// ===========================
function copyApiKey(keyId) {
    const keyElement = document.getElementById(keyId);
    const tempInput = document.createElement('input');
    tempInput.value = keyElement.textContent;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);

    showNotification('API key copied to clipboard', 'success');
}

function generateApiKey() {
    if (confirm('Generate a new API key? This cannot be undone.')) {
        const newKey = 'sk_live_' + generateRandomString(32);
        showNotification('New API key generated successfully', 'success');
        console.log('New API Key:', newKey);
    }
}

function generateRandomString(length) {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// ===========================
// WEBHOOK MANAGEMENT
// ===========================
function addWebhook() {
    const url = prompt('Enter webhook URL:');
    if (url) {
        showNotification('Webhook added successfully', 'success');
    }
}

// ===========================
// PAYMENT METHOD MANAGEMENT
// ===========================
function editPaymentMethod() {
    alert('Edit payment method form will open here');
}

function addPaymentMethod() {
    alert('Add payment method form will open here');
}

// ===========================
// DATA EXPORT
// ===========================
function exportData(format) {
    showNotification(`Exporting data as ${format.toUpperCase()}...`, 'info');

    setTimeout(() => {
        // Simulate export
        const link = document.createElement('a');
        link.download = `trackpro-export-${Date.now()}.${format}`;
        link.href = '#';
        link.click();

        showNotification(`Data exported successfully as ${format.toUpperCase()}`, 'success');
    }, 2000);
}

// ===========================
// DANGER ZONE ACTIONS
// ===========================
function deleteHistory() {
    const confirmation = prompt('Type "DELETE" to confirm deletion of all history:');
    if (confirmation === 'DELETE') {
        showNotification('All history data has been deleted', 'warning');
    }
}

function deleteAccount() {
    const confirmation = prompt('Type "DELETE MY ACCOUNT" to permanently delete your account:');
    if (confirmation === 'DELETE MY ACCOUNT') {
        alert('Account deletion initiated. You will receive a confirmation email.');
        // Redirect to homepage after 3 seconds
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 3000);
    }
}

// ===========================
// NOTIFICATION SYSTEM
// ===========================
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;

    // Add to page
    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// ===========================
// FORM SUBMISSION HANDLERS
// ===========================
document.addEventListener('DOMContentLoaded', () => {
    // Handle all form submissions in settings
    document.querySelectorAll('.settings-form').forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            showNotification('Settings saved successfully', 'success');
        });
    });

    // Load saved preferences
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.getElementById('theme-selector').value = savedTheme;
        document.body.setAttribute('data-theme', savedTheme);
    }

    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
        document.getElementById('language-selector').value = savedLanguage;
    }
});
