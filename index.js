// Global variables
let currentTab = 'user';

// Credentials configuration
const credentials = {
    admin: { username: 'admin@2025', password: 'zencoders' },
    user: { username: 'user@2025', password: 'zencoders' }
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize application
function initializeApp() {
    setupTabSwitching();
    setupFormSubmission();
    autoFocusUsername();
    logDemoCredentials();
}

// Tab switching functionality
function setupTabSwitching() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', handleTabSwitch);
    });
}

// Handle tab switching
function handleTabSwitch(event) {
    const btn = event.target;
    
    // Update active tab
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentTab = btn.dataset.tab;
    
    // Update form based on current tab
    updateFormForTab();
    
    // Clear form and alerts
    clearForm();
    hideAlert();
}

// Update form elements based on current tab
function updateFormForTab() {
    const usernameInput = document.getElementById('username');
    
    if (currentTab === 'admin') {
        usernameInput.placeholder = 'Admin Username';
    } else {
        usernameInput.placeholder = 'User Username';
    }
}

// Setup form submission
function setupFormSubmission() {
    document.getElementById('loginForm').addEventListener('submit', handleFormSubmission);
}

// Handle form submission
async function handleFormSubmission(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Show loading state
    showLoading();
    
    // Simulate authentication delay
    setTimeout(() => {
        authenticateUser(username, password);
        hideLoading();
    }, 1000);
}

// Authenticate user
function authenticateUser(username, password) {
    const creds = credentials[currentTab];
    
    if (username === creds.username && password === creds.password) {
        handleSuccessfulLogin();
    } else {
        handleFailedLogin();
    }
}

// Handle successful login
function handleSuccessfulLogin() {
    showAlert(`Welcome! Logging in as ${currentTab}...`, 'success');
    
    // Redirect after successful login
    setTimeout(() => {
        if (currentTab === 'admin') {
            showAlert('Redirecting to Admin Dashboard...', 'success');
            window.location.href = 'admin.html';
        } else {
            showAlert('Redirecting to User Portal...', 'success');
            window.location.href = 'user.html';
        }
    }, 1500);
}

// Handle failed login
function handleFailedLogin() {
    showAlert('Invalid credentials. Please try again.', 'error');
}

// Show alert message
function showAlert(message, type) {
    const alert = document.getElementById('alert');
    alert.textContent = message;
    alert.className = `alert ${type}`;
    alert.style.display = 'block';
    
    // Auto-hide error messages after 5 seconds
    if (type === 'error') {
        setTimeout(() => hideAlert(), 5000);
    }
}

// Hide alert message
function hideAlert() {
    document.getElementById('alert').style.display = 'none';
}

// Show loading state
function showLoading() {
    document.querySelector('.btn-text').style.opacity = '0';
    document.getElementById('loading').style.display = 'block';
    document.querySelector('.login-btn').disabled = true;
}

// Hide loading state
function hideLoading() {
    document.querySelector('.btn-text').style.opacity = '1';
    document.getElementById('loading').style.display = 'none';
    document.querySelector('.login-btn').disabled = false;
}

// Clear form inputs
function clearForm() {
    document.getElementById('loginForm').reset();
}

// Auto-focus username field
function autoFocusUsername() {
    document.getElementById('username').focus();
}

// Log demo credentials for development
function logDemoCredentials() {
    console.log('=== Demo Credentials (Remove in Production) ===');
    console.log('Admin Login: admin@2025 / zencoders');
    console.log('User Login: admin@2025 / zencoders');
    console.log('============================================');
}

// Utility function to validate email format (for future use)
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Utility function to validate password strength (for future use)
function validatePasswordStrength(password) {
    return {
        length: password.length >= 8,
        hasUpperCase: /[A-Z]/.test(password),
        hasLowerCase: /[a-z]/.test(password),
        hasNumbers: /\d/.test(password),
        hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
}

// Export functions for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        authenticateUser,
        showAlert,
        hideAlert,
        isValidEmail,
        validatePasswordStrength
    };
}