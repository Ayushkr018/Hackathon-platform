     let currentStep = 1;
        let selectedRole = '';

        // Theme persistence from landing page
        function initializeTheme() {
            const savedTheme = localStorage.getItem('theme') || 'dark';
            document.documentElement.setAttribute('data-theme', savedTheme);
        }

        // Initialize theme on page load
        initializeTheme();

        // Page transition function
        function handlePageTransition(event, url) {
            event.preventDefault();
            const transition = document.getElementById('pageTransition');
            
            transition.classList.add('active');
            
            setTimeout(() => {
                window.location.href = url;
            }, 600);
        }

        // Role selection
        document.querySelectorAll('.role-card').forEach(card => {
            card.addEventListener('click', function() {
                // Remove selected class from all cards
                document.querySelectorAll('.role-card').forEach(c => c.classList.remove('selected'));
                
                // Add selected class to clicked card
                this.classList.add('selected');
                
                // Store selected role
                selectedRole = this.dataset.role;
            });
        });

        // Step navigation
        function nextStep() {
            if (currentStep === 1 && !selectedRole) {
                showMessage('Please select your role to continue.');
                return;
            }
            
            if (currentStep < 3) {
                // Hide current step
                document.getElementById(`step${currentStep}`).classList.remove('active');
                
                // Update step indicator
                document.querySelector(`[data-step="${currentStep}"]`).classList.remove('active');
                document.querySelector(`[data-step="${currentStep}"]`).classList.add('completed');
                
                currentStep++;
                
                // Show next step
                document.getElementById(`step${currentStep}`).classList.add('active');
                document.querySelector(`[data-step="${currentStep}"]`).classList.add('active');
                
                // Scroll to top
                document.querySelector('.register-form-section').scrollTop = 0;
            }
        }

        function prevStep() {
            if (currentStep > 1) {
                // Hide current step
                document.getElementById(`step${currentStep}`).classList.remove('active');
                
                // Update step indicator
                document.querySelector(`[data-step="${currentStep}"]`).classList.remove('active');
                
                currentStep--;
                
                // Show previous step
                document.getElementById(`step${currentStep}`).classList.add('active');
                document.querySelector(`[data-step="${currentStep}"]`).classList.remove('completed');
                document.querySelector(`[data-step="${currentStep}"]`).classList.add('active');
                
                // Scroll to top
                document.querySelector('.register-form-section').scrollTop = 0;
            }
        }

        // Password toggle functionality
        function togglePassword(fieldId) {
            const passwordInput = document.getElementById(fieldId);
            const toggleIcon = document.getElementById(fieldId + 'ToggleIcon');
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                toggleIcon.classList.remove('fa-eye');
                toggleIcon.classList.add('fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                toggleIcon.classList.remove('fa-eye-slash');
                toggleIcon.classList.add('fa-eye');
            }
        }

        // Password strength checker
        function checkPasswordStrength(password) {
            let strength = 0;
            let text = 'Very Weak';
            
            // Length check
            if (password.length >= 8) strength++;
            if (password.length >= 12) strength++;
            
            // Character variety checks
            if (/[a-z]/.test(password)) strength++;
            if (/[A-Z]/.test(password)) strength++;
            if (/[0-9]/.test(password)) strength++;
            if (/[^a-zA-Z0-9]/.test(password)) strength++;
            
            // Determine strength level
            if (strength >= 6) {
                text = 'Very Strong';
            } else if (strength >= 4) {
                text = 'Strong';
            } else if (strength >= 3) {
                text = 'Medium';
            } else if (strength >= 1) {
                text = 'Weak';
            }
            
            return { strength: Math.min(strength, 4), text };
        }

        // Update password strength indicator
        document.getElementById('password').addEventListener('input', function() {
            const password = this.value;
            const { strength, text } = checkPasswordStrength(password);
            
            const bars = document.querySelectorAll('.strength-bar');
            const strengthText = document.getElementById('strengthText');
            
            // Reset all bars
            bars.forEach(bar => {
                bar.className = 'strength-bar';
            });
            
            // Update bars based on strength
            for (let i = 0; i < strength; i++) {
                if (strength <= 1) {
                    bars[i].classList.add('weak');
                } else if (strength <= 2) {
                    bars[i].classList.add('medium');
                } else {
                    bars[i].classList.add('strong');
                }
            }
            
            strengthText.textContent = `Password strength: ${text}`;
        });

        // Show message function
        function showMessage(message, type = 'error') {
            const errorElement = document.getElementById('errorMessage');
            const successElement = document.getElementById('successMessage');
            
            // Hide both messages first
            errorElement.classList.remove('show');
            successElement.classList.remove('show');
            
            if (type === 'error') {
                errorElement.textContent = message;
                errorElement.classList.add('show');
            } else {
                successElement.textContent = message;
                successElement.classList.add('show');
            }
            
            // Auto hide after 5 seconds
            setTimeout(() => {
                errorElement.classList.remove('show');
                successElement.classList.remove('show');
            }, 5000);
        }

        // Social registration handler
        async function handleSocialRegister(provider) {
            if (!selectedRole) {
                showMessage('Please select your role first.');
                return;
            }
            
            showMessage(`Redirecting to ${provider.charAt(0).toUpperCase() + provider.slice(1)}...`, 'success');
            
            // Simulate social registration process
            setTimeout(() => {
                // Store user session with selected role
                localStorage.setItem('userSession', JSON.stringify({
                    email: `user@${provider}.com`,
                    role: selectedRole,
                    provider: provider,
                    loginTime: new Date().toISOString(),
                    remember: true
                }));
                
                // Redirect to appropriate dashboard
                const dashboardUrl = getDashboardUrl(selectedRole);
                handlePageTransition({ preventDefault: () => {} }, dashboardUrl);
            }, 1500);
        }

        // Form submission handler
        async function handleRegister(event) {
            event.preventDefault();
            
            if (!selectedRole) {
                showMessage('Please select your role.');
                return;
            }
            
            const submitBtn = document.getElementById('submitBtn');
            const formData = new FormData(event.target);
            
            // Get form values
            const firstName = formData.get('firstName');
            const lastName = formData.get('lastName');
            const email = formData.get('email');
            const password = formData.get('password');
            const confirmPassword = formData.get('confirmPassword');
            const terms = formData.get('terms');
            
            // Validation
            if (!firstName || !lastName || !email || !password || !confirmPassword) {
                showMessage('Please fill in all required fields.');
                return;
            }
            
            if (!isValidEmail(email)) {
                showMessage('Please enter a valid email address.');
                return;
            }
            
            if (password.length < 8) {
                showMessage('Password must be at least 8 characters long.');
                return;
            }
            
            if (password !== confirmPassword) {
                showMessage('Passwords do not match.');
                return;
            }
            
            if (!terms) {
                showMessage('Please agree to the Terms of Service and Privacy Policy.');
                return;
            }
            
            // Show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="btn-loading"></span>Creating Account...';
            
            try {
                // Simulate API call
                await simulateRegistration(formData);
                
                showMessage('Account created successfully! Redirecting...', 'success');
                
                // Store user session
                localStorage.setItem('userSession', JSON.stringify({
                    email: email,
                    firstName: firstName,
                    lastName: lastName,
                    role: selectedRole,
                    loginTime: new Date().toISOString(),
                    remember: true
                }));
                
                // Redirect to appropriate dashboard after delay
                setTimeout(() => {
                    const dashboardUrl = getDashboardUrl(selectedRole);
                    handlePageTransition({ preventDefault: () => {} }, dashboardUrl);
                }, 1500);
                
            } catch (error) {
                showMessage(error.message || 'Registration failed. Please try again.');
            } finally {
                // Reset button state
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Create Account <i class="fas fa-rocket" style="margin-left: 0.5rem;"></i>';
            }
        }

        // Simulate registration API call
        function simulateRegistration(formData) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    const email = formData.get('email');
                    
                    // Simulate email already exists error
                    if (email === 'admin@nexushack.com') {
                        reject(new Error('An account with this email already exists.'));
                    } else {
                        resolve({ success: true });
                    }
                }, 1000);
            });
        }

        // Get dashboard URL based on role
        function getDashboardUrl(role) {
            switch (role) {
                case 'organizer':
                    return '../organizer/dashboard.html';
                case 'judge':
                    return '../judge/dashboard.html';
                case 'participant':
                default:
                    return '../participant/dashboard.html';
            }
        }

        // Email validation
        function isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }

        // Real-time form validation
        document.getElementById('email').addEventListener('input', function() {
            const email = this.value;
            if (email && !isValidEmail(email)) {
                this.style.borderColor = 'var(--danger)';
            } else {
                this.style.borderColor = 'var(--input-border)';
            }
        });

        document.getElementById('confirmPassword').addEventListener('input', function() {
            const password = document.getElementById('password').value;
            const confirmPassword = this.value;
            
            if (confirmPassword && password !== confirmPassword) {
                this.style.borderColor = 'var(--danger)';
            } else {
                this.style.borderColor = 'var(--input-border)';
            }
        });

        // Initialize page
        document.addEventListener('DOMContentLoaded', () => {
            // Check for role in URL params
            const urlParams = new URLSearchParams(window.location.search);
            const roleParam = urlParams.get('role');
            
            if (roleParam) {
                const roleCard = document.querySelector(`[data-role="${roleParam}"]`);
                if (roleCard) {
                    roleCard.click();
                }
            }
            
            // Focus on first input when step changes
            const observer = new MutationObserver(() => {
                const activeStep = document.querySelector('.form-step.active');
                if (activeStep) {
                    const firstInput = activeStep.querySelector('.form-input');
                    if (firstInput) {
                        setTimeout(() => firstInput.focus(), 100);
                    }
                }
            });
            
            observer.observe(document.querySelector('.register-form'), {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['class']
            });
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                const activeStep = document.querySelector('.form-step.active');
                if (activeStep && activeStep.id !== 'step3') {
                    e.preventDefault();
                    nextStep();
                }
            }
        });