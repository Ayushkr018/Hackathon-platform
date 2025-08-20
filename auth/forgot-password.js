let currentStep = 1;
        let userEmail = '';
        let verificationCode = '';
        let resendTimer = null;
        let resendCountdown = 0;

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

        // Step navigation
        function goToStep(step) {
            // Hide current step
            document.getElementById(`step${currentStep}`).classList.remove('active');
            document.querySelector(`[data-step="${currentStep}"]`).classList.remove('active');
            
            if (currentStep < step) {
                document.querySelector(`[data-step="${currentStep}"]`).classList.add('completed');
            }
            
            currentStep = step;
            
            // Show new step
            document.getElementById(`step${currentStep}`).classList.add('active');
            document.querySelector(`[data-step="${currentStep}"]`).classList.add('active');
        }

        // Email validation
        function isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }

        // Handle email submit
        async function handleEmailSubmit(event) {
            event.preventDefault();
            
            const emailInput = document.getElementById('email');
            const submitBtn = document.getElementById('emailSubmitBtn');
            const email = emailInput.value.trim();
            
            if (!email) {
                showMessage('Please enter your email address.');
                return;
            }
            
            if (!isValidEmail(email)) {
                showMessage('Please enter a valid email address.');
                return;
            }
            
            // Show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="btn-loading"></span>Sending Code...';
            
            try {
                // Simulate API call
                await simulateEmailVerification(email);
                
                userEmail = email;
                document.getElementById('emailDisplay').textContent = email;
                
                showMessage('Verification code sent successfully!', 'success');
                
                setTimeout(() => {
                    goToStep(2);
                    startResendTimer();
                }, 1500);
                
            } catch (error) {
                showMessage(error.message || 'Failed to send verification code. Please try again.');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Send Verification Code <i class="fas fa-paper-plane" style="margin-left: 0.5rem;"></i>';
            }
        }

        // Simulate email verification
        function simulateEmailVerification(email) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    // Generate random 6-digit code
                    verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
                    console.log('Verification code:', verificationCode); // For demo purposes
                    
                    if (email === 'invalid@example.com') {
                        reject(new Error('Email address not found.'));
                    } else {
                        resolve({ success: true });
                    }
                }, 1000);
            });
        }

        // Code input handling
        function setupCodeInputs() {
            const codeInputs = document.querySelectorAll('.code-input');
            
            codeInputs.forEach((input, index) => {
                input.addEventListener('input', function(e) {
                    const value = e.target.value;
                    
                    if (value.length === 1) {
                        this.classList.add('filled');
                        
                        // Move to next input
                        if (index < codeInputs.length - 1) {
                            codeInputs[index + 1].focus();
                        }
                    } else {
                        this.classList.remove('filled');
                    }
                    
                    // Only allow numbers
                    if (!/^\d$/.test(value) && value !== '') {
                        e.target.value = '';
                        this.classList.remove('filled');
                    }
                });
                
                input.addEventListener('keydown', function(e) {
                    // Handle backspace
                    if (e.key === 'Backspace' && !this.value && index > 0) {
                        codeInputs[index - 1].focus();
                        codeInputs[index - 1].value = '';
                        codeInputs[index - 1].classList.remove('filled');
                    }
                    
                    // Handle paste
                    if (e.key === 'v' && (e.ctrlKey || e.metaKey)) {
                        e.preventDefault();
                        navigator.clipboard.readText().then(text => {
                            const digits = text.replace(/\D/g, '').slice(0, 6);
                            digits.split('').forEach((digit, i) => {
                                if (codeInputs[i]) {
                                    codeInputs[i].value = digit;
                                    codeInputs[i].classList.add('filled');
                                }
                            });
                            if (digits.length === 6) {
                                codeInputs[5].focus();
                            }
                        });
                    }
                });
            });
        }

        // Get entered code
        function getEnteredCode() {
            const codeInputs = document.querySelectorAll('.code-input');
            return Array.from(codeInputs).map(input => input.value).join('');
        }

        // Handle code submit
        async function handleCodeSubmit(event) {
            event.preventDefault();
            
            const submitBtn = document.getElementById('codeSubmitBtn');
            const enteredCode = getEnteredCode();
            
            if (enteredCode.length !== 6) {
                showMessage('Please enter the complete 6-digit verification code.');
                return;
            }
            
            // Show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="btn-loading"></span>Verifying...';
            
            try {
                // Simulate API call
                await simulateCodeVerification(enteredCode);
                
                showMessage('Code verified successfully!', 'success');
                
                setTimeout(() => {
                    goToStep(3);
                }, 1500);
                
            } catch (error) {
                showMessage(error.message || 'Invalid verification code. Please try again.');
                
                // Clear code inputs
                document.querySelectorAll('.code-input').forEach(input => {
                    input.value = '';
                    input.classList.remove('filled');
                });
                
                document.querySelector('.code-input').focus();
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Verify Code <i class="fas fa-check" style="margin-left: 0.5rem;"></i>';
            }
        }

        // Simulate code verification
        function simulateCodeVerification(enteredCode) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    if (enteredCode === verificationCode || enteredCode === '123456') { // Demo code
                        resolve({ success: true });
                    } else {
                        reject(new Error('Invalid verification code.'));
                    }
                }, 1000);
            });
        }

        // Start resend timer
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

        // Handle resend
        async function handleResend() {
            const resendBtn = document.getElementById('resendBtn');
            
            resendBtn.disabled = true;
            resendBtn.textContent = 'Sending...';
            
            try {
                await simulateEmailVerification(userEmail);
                showMessage('New verification code sent!', 'success');
                startResendTimer();
            } catch (error) {
                showMessage('Failed to resend code. Please try again.');
                resendBtn.disabled = false;
                resendBtn.textContent = 'Resend Code';
            }
        }

        // Go back to email step
        function goBackToEmail() {
            if (resendTimer) {
                clearInterval(resendTimer);
            }
            
            // Clear code inputs
            document.querySelectorAll('.code-input').forEach(input => {
                input.value = '';
                input.classList.remove('filled');
            });
            
            // Reset step indicators
            document.querySelector('[data-step="2"]').classList.remove('completed');
            
            goToStep(1);
        }

        // Password toggle
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
            
            if (password.length >= 8) strength++;
            if (password.length >= 12) strength++;
            if (/[a-z]/.test(password)) strength++;
            if (/[A-Z]/.test(password)) strength++;
            if (/[0-9]/.test(password)) strength++;
            if (/[^a-zA-Z0-9]/.test(password)) strength++;
            
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

        // Update password strength
        function updatePasswordStrength() {
            const passwordInput = document.getElementById('newPassword');
            const password = passwordInput.value;
            const { strength, text } = checkPasswordStrength(password);
            
            const bars = document.querySelectorAll('.strength-bar');
            const strengthText = document.getElementById('strengthText');
            
            bars.forEach(bar => bar.className = 'strength-bar');
            
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
        }

        // Handle password submit
        async function handlePasswordSubmit(event) {
            event.preventDefault();
            
            const submitBtn = document.getElementById('passwordSubmitBtn');
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            if (!newPassword || !confirmPassword) {
                showMessage('Please fill in both password fields.');
                return;
            }
            
            if (newPassword.length < 8) {
                showMessage('Password must be at least 8 characters long.');
                return;
            }
            
            if (newPassword !== confirmPassword) {
                showMessage('Passwords do not match.');
                return;
            }
            
            // Show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="btn-loading"></span>Resetting Password...';
            
            try {
                // Simulate API call
                await simulatePasswordReset(newPassword);
                
                showMessage('Password reset successfully!', 'success');
                
                setTimeout(() => {
                    goToStep(4);
                }, 1500);
                
            } catch (error) {
                showMessage(error.message || 'Failed to reset password. Please try again.');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Reset Password <i class="fas fa-shield-alt" style="margin-left: 0.5rem;"></i>';
            }
        }

        // Simulate password reset
        function simulatePasswordReset(password) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    if (password === 'weakpass') {
                        reject(new Error('Password is too weak. Please choose a stronger password.'));
                    } else {
                        resolve({ success: true });
                    }
                }, 1000);
            });
        }

        // Initialize page
        document.addEventListener('DOMContentLoaded', () => {
            setupCodeInputs();
            
            // Password strength checker
            const passwordInput = document.getElementById('newPassword');
            if (passwordInput) {
                passwordInput.addEventListener('input', updatePasswordStrength);
            }
            
            // Real-time password confirmation
            const confirmPasswordInput = document.getElementById('confirmPassword');
            if (confirmPasswordInput) {
                confirmPasswordInput.addEventListener('input', function() {
                    const password = document.getElementById('newPassword').value;
                    const confirmPassword = this.value;
                    
                    if (confirmPassword && password !== confirmPassword) {
                        this.style.borderColor = 'var(--danger)';
                    } else {
                        this.style.borderColor = 'var(--input-border)';
                    }
                });
            }
            
            // Focus on email input
            document.getElementById('email').focus();
            
            // Demo info
            console.log('Demo verification code: 123456');
        });