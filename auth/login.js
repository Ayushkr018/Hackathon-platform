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

        // Password toggle functionality
        function togglePassword() {
            const passwordInput = document.getElementById('password');
            const toggleIcon = document.getElementById('passwordToggleIcon');
            
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

        // Social login handler
        async function handleSocialLogin(provider) {
            showMessage(`Redirecting to ${provider.charAt(0).toUpperCase() + provider.slice(1)}...`, 'success');
            
            // Simulate social login process
            setTimeout(() => {
                // In a real app, this would redirect to OAuth provider
                const roleParam = new URLSearchParams(window.location.search).get('role');
                const dashboardUrl = getDashboardUrl(roleParam || 'participant');
                handlePageTransition({ preventDefault: () => {} }, dashboardUrl);
            }, 1500);
        }

        // Form submission handler
        async function handleLogin(event) {
            event.preventDefault();
            
            const submitBtn = document.getElementById('submitBtn');
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const remember = document.getElementById('remember').checked;
            
            // Basic validation
            if (!email || !password) {
                showMessage('Please fill in all required fields.');
                return;
            }
            
            if (!isValidEmail(email)) {
                showMessage('Please enter a valid email address.');
                return;
            }
            
            if (password.length < 6) {
                showMessage('Password must be at least 6 characters long.');
                return;
            }
            
            // Show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="btn-loading"></span>Signing In...';
            
            try {
                // Simulate API call
                await simulateLogin(email, password, remember);
                
                showMessage('Login successful! Redirecting...', 'success');
                
                // Simulate successful login
                setTimeout(() => {
                    // Get role from URL params or use default
                    const urlParams = new URLSearchParams(window.location.search);
                    const role = urlParams.get('role') || 'participant';
                    
                    // Store user session
                    localStorage.setItem('userSession', JSON.stringify({
                        email: email,
                        role: role,
                        loginTime: new Date().toISOString(),
                        remember: remember
                    }));
                    
                    // Redirect to appropriate dashboard
                    const dashboardUrl = getDashboardUrl(role);
                    handlePageTransition({ preventDefault: () => {} }, dashboardUrl);
                }, 1500);
                
            } catch (error) {
                showMessage(error.message || 'Login failed. Please try again.');
            } finally {
                // Reset button state
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Sign In';
            }
        }

        // Simulate login API call
        function simulateLogin(email, password, remember) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    // Simulate different responses based on email
                    if (email === 'demo@nexushack.com' && password === 'demo123') {
                        resolve({ success: true, role: 'participant' });
                    } else if (email.includes('admin')) {
                        resolve({ success: true, role: 'organizer' });
                    } else if (email.includes('judge')) {
                        resolve({ success: true, role: 'judge' });
                    } else if (password.length < 6) {
                        reject(new Error('Password must be at least 6 characters long.'));
                    } else {
                        // For demo purposes, accept any valid email/password combo
                        resolve({ success: true, role: 'participant' });
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

        // Auto-fill demo credentials (for development)
        function fillDemoCredentials() {
            document.getElementById('email').value = 'demo@nexushack.com';
            document.getElementById('password').value = 'demo123';
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + Enter to submit form
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                document.getElementById('loginForm').dispatchEvent(new Event('submit'));
            }
            
            // Alt + D to fill demo credentials (development only)
            if (e.altKey && e.key === 'd') {
                fillDemoCredentials();
            }
        });

        // Form validation on input
        document.getElementById('email').addEventListener('input', function() {
            const email = this.value;
            if (email && !isValidEmail(email)) {
                this.style.borderColor = 'var(--danger)';
            } else {
                this.style.borderColor = 'var(--input-border)';
            }
        });

        document.getElementById('password').addEventListener('input', function() {
            const password = this.value;
            if (password && password.length < 6) {
                this.style.borderColor = 'var(--danger)';
            } else {
                this.style.borderColor = 'var(--input-border)';
            }
        });

        // Initialize page
        document.addEventListener('DOMContentLoaded', () => {
            // Check if user is already logged in
            const userSession = localStorage.getItem('userSession');
            if (userSession) {
                const session = JSON.parse(userSession);
                const loginTime = new Date(session.loginTime);
                const now = new Date();
                const timeDiff = now - loginTime;
                
                // If logged in within last 24 hours and remember is true, redirect
                if (session.remember && timeDiff < 24 * 60 * 60 * 1000) {
                    const dashboardUrl = getDashboardUrl(session.role);
                    window.location.href = dashboardUrl;
                    return;
                }
            }
            
            // Focus on email input
            document.getElementById('email').focus();
            
            // Show demo credentials hint in console
            console.log('Demo credentials: demo@nexushack.com / demo123');
            console.log('Use Alt+D to auto-fill demo credentials');
        });