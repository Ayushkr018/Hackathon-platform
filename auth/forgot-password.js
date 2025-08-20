// --- Configuration ---
const API_BASE_URL = 'http://localhost:5000';

// --- Global State ---
let currentStep = 1;
let userEmail = ''; // We'll store the user's email to use in the final step

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    setupEventListeners();
    document.getElementById('email').focus();
});

// --- Event Listeners Setup ---
function setupEventListeners() {
    document.querySelector('#step1 form').addEventListener('submit', handleEmailSubmit);
    document.querySelector('#step2 form').addEventListener('submit', handleCodeSubmit);
    document.querySelector('#step3 form').addEventListener('submit', handlePasswordSubmit);
    document.getElementById('newPassword').addEventListener('input', updatePasswordStrengthUI);
    setupCodeInputs();
}

// --- Core Functions ---

/**
 * Step 1: User submits their email to get a reset code.
 */
async function handleEmailSubmit(event) {
    event.preventDefault();
    const submitBtn = document.getElementById('emailSubmitBtn');
    const email = document.getElementById('email').value.trim();

    if (!isValidEmail(email)) {
        return showMessage('Please enter a valid email address.');
    }

    setLoadingState(submitBtn, true, 'Sending Code...');
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/forgotpassword`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });
        const data = await response.json();

        if (!response.ok) throw new Error(data.message);

        userEmail = email; // Store the email
        document.getElementById('emailDisplay').textContent = email;
        showMessage(data.message, 'success');
        
        setTimeout(() => {
            goToStep(2);
            startResendTimer();
        }, 1500);

    } catch (error) {
        showMessage(error.message || 'Failed to send code. Please try again.');
    } finally {
        setLoadingState(submitBtn, false, 'Send Verification Code');
    }
}

/**
 * Step 2: User submits the code. We just move to the next step on the frontend.
 * The backend will verify the code and the new password together in the final step.
 */
function handleCodeSubmit(event) {
    event.preventDefault();
    const enteredCode = getEnteredCode();
    if (enteredCode.length !== 6) {
        return showMessage('Please enter the complete 6-digit code.');
    }
    // If the code looks right, just proceed to the next step
    goToStep(3);
}

/**
 * Step 3: User submits the code and their new password to the backend.
 */
async function handlePasswordSubmit(event) {
    event.preventDefault();
    const submitBtn = document.getElementById('passwordSubmitBtn');
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const code = getEnteredCode();

    if (newPassword !== confirmPassword) {
        return showMessage('Passwords do not match.');
    }
    if (newPassword.length < 6) {
        return showMessage('Password must be at least 6 characters long.');
    }

    setLoadingState(submitBtn, true, 'Resetting Password...');

    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/resetpassword`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: userEmail,
                code: code,
                password: newPassword
            }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message);

        showMessage('Password reset successfully!', 'success');
        setTimeout(() => goToStep(4), 1500);

    } catch (error) {
        showMessage(error.message || 'Failed to reset password. Please try again.');
    } finally {
        setLoadingState(submitBtn, false, 'Reset Password');
    }
}


// --- UI & Utility Functions ---

function setLoadingState(button, isLoading, loadingText) {
    button.disabled = isLoading;
    if (isLoading) {
        button.innerHTML = `<span class="btn-loading"></span>${loadingText}`;
    } else {
        // Restore original text by finding the button's default text
        const defaultText = button.id === 'emailSubmitBtn' ? 'Send Verification Code' :
                            button.id === 'codeSubmitBtn' ? 'Verify Code' : 'Reset Password';
        button.innerHTML = defaultText; // Simplified restoration
    }
}

function goToStep(step) {
    document.getElementById(`step${currentStep}`).classList.remove('active');
    document.querySelector(`[data-step="${currentStep}"]`).classList.remove('active');
    if (step > currentStep) {
        document.querySelector(`[data-step="${currentStep}"]`).classList.add('completed');
    }
    currentStep = step;
    document.getElementById(`step${currentStep}`).classList.add('active');
    document.querySelector(`[data-step="${currentStep}"]`).classList.add('active');
}

function getEnteredCode() {
    return Array.from(document.querySelectorAll('.code-input')).map(input => input.value).join('');
}

// All other utility functions (showMessage, initializeTheme, etc.) remain the same...

let resendTimer = null;
let resendCountdown = 0;

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

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function setupCodeInputs() {
    const codeInputs = document.querySelectorAll('.code-input');
    codeInputs.forEach((input, index) => {
        input.addEventListener('input', (e) => {
            if (e.target.value.length === 1 && index < codeInputs.length - 1) {
                codeInputs[index + 1].focus();
            }
        });
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !e.target.value && index > 0) {
                codeInputs[index - 1].focus();
            }
        });
    });
}

function startResendTimer() {
    const resendBtn = document.getElementById('resendBtn');
    const countdown = document.getElementById('countdown');
    resendCountdown = 60;
    resendBtn.disabled = true;
    resendBtn.style.display = 'none';
    countdown.style.display = 'block';
    resendTimer = setInterval(() => {
        resendCountdown--;
        countdown.textContent = `Resend code in ${resendCountdown}s`;
        if (resendCountdown <= 0) {
            clearInterval(resendTimer);
            resendBtn.disabled = false;
            resendBtn.style.display = 'inline-block';
            countdown.style.display = 'none';
        }
    }, 1000);
}

async function handleResend() {
    const resendBtn = document.getElementById('resendBtn');
    resendBtn.disabled = true;
    resendBtn.textContent = 'Sending...';
    try {
        await fetch(`${API_BASE_URL}/api/auth/forgotpassword`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: userEmail }),
        });
        showMessage('New verification code sent!', 'success');
        startResendTimer();
    } catch (error) {
        showMessage('Failed to resend code.');
    } finally {
        resendBtn.textContent = 'Resend Code';
    }
}

function goBackToEmail() {
    goToStep(1);
}

function togglePassword(fieldId) {
    const passwordInput = document.getElementById(fieldId);
    const toggleIcon = document.getElementById(fieldId + 'ToggleIcon');
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        toggleIcon.classList.replace('fa-eye-slash', 'fa-eye');
    }
}

function updatePasswordStrengthUI() {
    const password = this.value;
    const strength = checkPasswordStrength(password);
    const bars = document.querySelectorAll('#step3 .strength-bar');
    const strengthText = document.getElementById('strengthText');
    
    bars.forEach(bar => bar.className = 'strength-bar');
    
    for (let i = 0; i < strength.level; i++) {
        bars[i].classList.add(strength.className);
    }
    strengthText.textContent = `Password strength: ${strength.text}`;
}

function checkPasswordStrength(password) {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    switch (score) {
        case 1: return { level: 1, text: 'Weak', className: 'weak' };
        case 2: return { level: 2, text: 'Medium', className: 'medium' };
        case 3: return { level: 3, text: 'Strong', className: 'strong' };
        case 4: return { level: 4, text: 'Very Strong', className: 'strong' };
        default: return { level: 0, text: 'Very Weak', className: 'weak' };
    }
}

// Make functions globally accessible from HTML
window.handlePageTransition = handlePageTransition;
window.handleEmailSubmit = handleEmailSubmit;
window.handleCodeSubmit = handleCodeSubmit;
window.handlePasswordSubmit = handlePasswordSubmit;
window.handleResend = handleResend;
window.goBackToEmail = goBackToEmail;
window.togglePassword = togglePassword;
