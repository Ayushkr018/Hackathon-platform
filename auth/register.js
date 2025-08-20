// --- Configuration ---
const API_BASE_URL = 'http://localhost:5000';

// --- Global State ---
let currentStep = 1;
let selectedRole = '';

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    setupEventListeners();
    checkUrlForRole();
});

// --- Event Listeners Setup ---
function setupEventListeners() {
    // Role selection
    document.querySelectorAll('.role-card').forEach(card => {
        card.addEventListener('click', function() {
            document.querySelectorAll('.role-card').forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');
            selectedRole = this.dataset.role;
        });
    });

    // Form submission
    document.getElementById('registerForm').addEventListener('submit', handleRegister);

    // Password strength checker
    document.getElementById('password').addEventListener('input', updatePasswordStrengthUI);

    // Real-time validation
    document.getElementById('email').addEventListener('input', validateEmailInput);
    document.getElementById('confirmPassword').addEventListener('input', validatePasswordMatch);
    
    // Keyboard navigation
    document.addEventListener('keydown', handleKeyboardNavigation);
}


// --- Core Functions ---

/**
 * Handles the main registration form submission.
 * @param {Event} event - The form submission event.
 */
async function handleRegister(event) {
    event.preventDefault();
    
    if (!selectedRole) {
        return showMessage('Please select your role.');
    }
    
    const submitBtn = document.getElementById('submitBtn');
    const formData = new FormData(event.target);
    
    // Get and combine form values
    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    const name = `${firstName} ${lastName}`; // Combine for backend
    const email = formData.get('email');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    
    // --- Frontend Validation ---
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
        return showMessage('Please fill in all required fields.');
    }
    if (password !== confirmPassword) {
        return showMessage('Passwords do not match.');
    }
    if (!formData.get('terms')) {
        return showMessage('Please agree to the Terms of Service and Privacy Policy.');
    }

    // Show loading state
    setLoadingState(submitBtn, true);
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name,
                email,
                password,
                role: selectedRole
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            // Handle server-side errors (e.g., email already exists)
            throw new Error(data.message || 'Registration failed.');
        }

        // --- Success ---
        showMessage('Account created successfully! Redirecting...', 'success');
        
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
 * Handles social media registration clicks.
 * @param {string} provider - The social provider ('google' or 'github').
 */
function handleSocialRegister(provider) {
    if (!selectedRole) {
        return showMessage('Please select your role first.');
    }
    // Note: The role isn't sent with the social login request.
    // A more advanced setup might pass it as a 'state' parameter.
    // For now, the backend will assign a default role.
    
    // Redirect to the backend's OAuth endpoint
    window.location.href = `${API_BASE_URL}/api/auth/${provider}`;
}


// --- UI & Utility Functions ---

function setLoadingState(button, isLoading) {
    button.disabled = isLoading;
    if (isLoading) {
        button.innerHTML = '<span class="btn-loading"></span>Creating Account...';
    } else {
        button.innerHTML = 'Create Account <i class="fas fa-rocket" style="margin-left: 0.5rem;"></i>';
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

function nextStep() {
    if (currentStep === 1 && !selectedRole) {
        return showMessage('Please select your role to continue.');
    }
    if (currentStep < 3) {
        updateStepUI(currentStep + 1);
    }
}

function prevStep() {
    if (currentStep > 1) {
        updateStepUI(currentStep - 1);
    }
}

function updateStepUI(newStep) {
    document.getElementById(`step${currentStep}`).classList.remove('active');
    document.querySelector(`[data-step="${currentStep}"]`).classList.remove('active');
    if (newStep > currentStep) {
        document.querySelector(`[data-step="${currentStep}"]`).classList.add('completed');
    } else {
        document.querySelector(`[data-step="${currentStep}"]`).classList.remove('completed');
    }
    
    currentStep = newStep;

    document.getElementById(`step${currentStep}`).classList.add('active');
    document.querySelector(`[data-step="${currentStep}"]`).classList.add('active');
    document.querySelector('.register-form-section').scrollTop = 0;
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
    const bars = document.querySelectorAll('.strength-bar');
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

function validatePasswordMatch() {
    const password = document.getElementById('password').value;
    this.style.borderColor = (this.value && password !== this.value) ? 'var(--danger)' : 'var(--input-border)';
}

function checkUrlForRole() {
    const urlParams = new URLSearchParams(window.location.search);
    const roleParam = urlParams.get('role');
    if (roleParam) {
        const roleCard = document.querySelector(`[data-role="${roleParam}"]`);
        if (roleCard) roleCard.click();
    }
}

function handleKeyboardNavigation(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        const activeStep = document.querySelector('.form-step.active');
        if (activeStep && activeStep.id !== 'step3') {
            e.preventDefault();
            nextStep();
        }
    }
}

// Make functions globally accessible from HTML onclick attributes
window.handlePageTransition = handlePageTransition;
window.nextStep = nextStep;
window.prevStep = prevStep;
window.togglePassword = togglePassword;
window.handleSocialRegister = handleSocialRegister;
