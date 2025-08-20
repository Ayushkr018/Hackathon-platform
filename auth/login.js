// --- Configuration ---
const API_BASE_URL = 'http://localhost:5000';

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    setupEventListeners();
    handleOAuthCallback(); // Check for token from social login
    document.getElementById('email').focus();
});

// --- Event Listeners Setup ---
function setupEventListeners() {
    // Form submission
    document.getElementById('loginForm').addEventListener('submit', handleLogin);

    // Real-time validation
    document.getElementById('email').addEventListener('input', validateEmailInput);
    document.getElementById('password').addEventListener('input', validatePasswordInput);
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
}


// --- Core Functions ---

/**
 * Handles the main login form submission.
 * @param {Event} event - The form submission event.
 */
async function handleLogin(event) {
    event.preventDefault();
    
    const submitBtn = document.getElementById('submitBtn');
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // --- Frontend Validation ---
    if (!email || !password) {
        return showMessage('Please provide both email and password.');
    }

    // Show loading state
    setLoadingState(submitBtn, true);
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            // Handle server-side errors (e.g., incorrect password)
            throw new Error(data.message || 'Login failed.');
        }

        // --- Success ---
        showMessage('Login successful! Redirecting...', 'success');
        
        // Save the token and user info
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        
        // Redirect to the appropriate dashboard
        setTimeout(() => {
            const dashboardUrl = getDashboardUrl(data.data.user.role);
            handlePageTransition({ preventDefault: () => {} }, dashboardUrl);
        }, 1500);
        
    } catch (error) {
        showMessage(error.message);
    } finally {
        // Reset button state
        setLoadingState(submitBtn, false);
    }
}

/**
 * Handles social media login clicks.
 * @param {string} provider - The social provider ('google' or 'github').
 */
function handleSocialLogin(provider) {
    // Redirect to the backend's OAuth endpoint
    window.location.href = `${API_BASE_URL}/api/auth/${provider}`;
}

/**
 * Checks for a JWT in the URL after an OAuth redirect and logs the user in.
 */
async function handleOAuthCallback() {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
        showMessage('Authentication successful! Please wait...', 'success');
        localStorage.setItem('token', token);

        // Fetch user profile to get role and other details
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();

            if (!response.ok) throw new Error('Could not fetch user profile.');

            const user = data.data.user;
            localStorage.setItem('user', JSON.stringify(user));

            // Redirect to dashboard
            const dashboardUrl = getDashboardUrl(user.role);
            window.location.href = dashboardUrl;

        } catch (error) {
            showMessage('Failed to retrieve your profile. Please try logging in again.');
            // Clean up URL
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }
}


// --- UI & Utility Functions ---

function setLoadingState(button, isLoading) {
    button.disabled = isLoading;
    if (isLoading) {
        button.innerHTML = '<span class="btn-loading"></span>Signing In...';
    } else {
        button.innerHTML = 'Sign In';
    }
}

function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

function handlePageTransition(event, url) {
    event.preventDefault();
    const transition = document.getElementById('pageTransition');
    transition.classList.add('active');
    setTimeout(() => { window.location.href = url; }, 600);
}

function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleIcon = document.getElementById('passwordToggleIcon');
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        toggleIcon.classList.replace('fa-eye-slash', 'fa-eye');
    }
}

function showMessage(message, type = 'error') {
    const errorElement = document.getElementById('errorMessage');
    const successElement = document.getElementById('successMessage');
    
    errorElement.classList.remove('show');
    successElement.classList.remove('show');
    
    const element = type === 'error' ? errorElement : successElement;
    element.textContent = message;
    element.classList.add('show');
    
    setTimeout(() => element.classList.remove('show'), 5000);
}

function getDashboardUrl(role) {
    switch (role) {
        case 'organizer': return '../organizer/dashboard.html';
        case 'judge': return '../judge/dashboard.html';
        case 'participant':
        default: return '../participant/dashboard.html';
    }
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateEmailInput() {
    this.style.borderColor = (this.value && !isValidEmail(this.value)) ? 'var(--danger)' : 'var(--input-border)';
}

function validatePasswordInput() {
    this.style.borderColor = (this.value && this.value.length < 6) ? 'var(--danger)' : 'var(--input-border)';
}

function handleKeyboardShortcuts(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        document.getElementById('loginForm').dispatchEvent(new Event('submit'));
    }
}

// Make functions globally accessible from HTML onclick attributes
window.handlePageTransition = handlePageTransition;
window.togglePassword = togglePassword;
window.handleSocialLogin = handleSocialLogin;
