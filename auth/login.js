// --- Configuration ---
const API_BASE_URL = 'http://localhost:5000';

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    setupEventListeners();
    handleOAuthCallback();
    document.getElementById('email').focus();
});

// --- Event Listeners Setup ---
function setupEventListeners() {
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('email').addEventListener('input', validateEmailInput);
    document.getElementById('password').addEventListener('input', validatePasswordInput);
    document.addEventListener('keydown', handleKeyboardShortcuts);
}


// --- Core Functions ---

async function handleLogin(event) {
    event.preventDefault();
    
    const submitBtn = document.getElementById('submitBtn');
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    if (!email || !password) return showMessage('Please provide both email and password.');

    setLoadingState(submitBtn, true);
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        // --- DEBUGGING ---
        console.log('--- LOGIN ATTEMPT ---');
        console.log('Server Status:', response.status);
        console.log('Server Response:', data);
        // --- END DEBUGGING ---

        if (!response.ok) throw new Error(data.message || 'Login failed.');
        
        if (!data.data || !data.data.user) {
            console.error('CRITICAL: User data is missing from the server response!');
            return showMessage('Login succeeded, but failed to retrieve user profile.');
        }

        const user = data.data.user;

        // --- DEBUGGING ---
        console.log('User Object Received:', user);
        console.log('User Role:', user.role);
        // --- END DEBUGGING ---

        showMessage('Login successful! Redirecting...', 'success');
        
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(user));
        
        setTimeout(() => {
            const dashboardUrl = getDashboardUrl(user.role);

            // --- DEBUGGING ---
            console.log('Redirecting to URL:', dashboardUrl);
            // --- END DEBUGGING ---

            if (!dashboardUrl) {
                console.error(`CRITICAL: Could not determine dashboard URL for role: "${user.role}"`);
                return showMessage('Could not find your dashboard. Please contact support.');
            }
            handlePageTransition({ preventDefault: () => {} }, dashboardUrl);
        }, 1500);
        
    } catch (error) {
        showMessage(error.message);
    } finally {
        setLoadingState(submitBtn, false);
    }
}

function handleSocialLogin(provider) {
    window.location.href = `${API_BASE_URL}/api/auth/${provider}`;
}

async function handleOAuthCallback() {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
        showMessage('Authentication successful! Please wait...', 'success');
        localStorage.setItem('token', token);

        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();

            if (!response.ok) throw new Error('Could not fetch user profile.');

            const user = data.data.user;
            localStorage.setItem('user', JSON.stringify(user));

            const dashboardUrl = getDashboardUrl(user.role);
            window.location.href = dashboardUrl;

        } catch (error) {
            showMessage('Failed to retrieve your profile. Please try logging in again.');
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }
}


// --- UI & Utility Functions (No changes below this line) ---

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

window.handlePageTransition = handlePageTransition;
window.togglePassword = togglePassword;
window.handleSocialLogin = handleSocialLogin;