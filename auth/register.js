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
    document.querySelectorAll('.role-card').forEach(card => {
        card.addEventListener('click', function() {
            document.querySelectorAll('.role-card').forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');
            selectedRole = this.dataset.role;
        });
    });
    document.getElementById('registerForm').addEventListener('submit', handleRegister);
    document.getElementById('password').addEventListener('input', updatePasswordStrengthUI);
    document.getElementById('email').addEventListener('input', validateEmailInput);
    document.getElementById('confirmPassword').addEventListener('input', validatePasswordMatch);
    document.addEventListener('keydown', handleKeyboardNavigation);
}


// --- Core Functions ---

async function handleRegister(event) {
    event.preventDefault();
    if (!selectedRole) return showMessage('Please select your role.');
    
    const submitBtn = document.getElementById('submitBtn');
    const formData = new FormData(event.target);
    
    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    const name = `${firstName} ${lastName}`;
    const email = formData.get('email');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    
    if (!firstName || !lastName || !email || !password || !confirmPassword) return showMessage('Please fill in all required fields.');
    if (password !== confirmPassword) return showMessage('Passwords do not match.');
    if (!formData.get('terms')) return showMessage('Please agree to the Terms of Service and Privacy Policy.');

    setLoadingState(submitBtn, true);
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, role: selectedRole }),
        });

        const data = await response.json();

        // --- DEBUGGING ---
        console.log('--- REGISTRATION ATTEMPT ---');
        console.log('Server Status:', response.status);
        console.log('Server Response:', data);
        // --- END DEBUGGING ---

        if (!response.ok) throw new Error(data.message || 'Registration failed.');
        
        if (!data.data || !data.data.user) {
            console.error('CRITICAL: User data is missing from the server response!');
            return showMessage('Registration succeeded, but failed to retrieve user profile.');
        }

        const user = data.data.user;
        
        // --- DEBUGGING ---
        console.log('User Object Received:', user);
        console.log('User Role:', user.role);
        // --- END DEBUGGING ---

        showMessage('Account created successfully! Redirecting...', 'success');
        
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

function handleSocialRegister(provider) {
    if (!selectedRole) return showMessage('Please select your role first.');
    window.location.href = `${API_BASE_URL}/api/auth/${provider}`;
}


// --- UI & Utility Functions (No changes below this line) ---

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

window.handlePageTransition = handlePageTransition;
window.nextStep = nextStep;
window.prevStep = prevStep;
window.togglePassword = togglePassword;
window.handleSocialRegister = handleSocialRegister;
