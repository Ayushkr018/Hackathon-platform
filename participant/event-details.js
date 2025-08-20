   class EventDetailsManager {
            constructor() {
                this.eventDate = new Date('2025-03-15T18:00:00');
                this.countdownInterval = null;
                
                this.init();
            }

            init() {
                this.initializeTheme();
                this.setupEventListeners();
                this.startCountdown();
                this.setupFormListeners();
            }

            initializeTheme() {
                const savedTheme = localStorage.getItem('theme') || 'dark';
                document.documentElement.setAttribute('data-theme', savedTheme);
                
                const themeToggle = document.getElementById('themeToggle');
                const themeIcon = themeToggle.querySelector('i');
                themeIcon.className = savedTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
            }

            setupEventListeners() {
                // Theme toggle
                document.getElementById('themeToggle').addEventListener('click', () => {
                    this.toggleTheme();
                });

                // Close modals when clicking outside
                document.addEventListener('click', (e) => {
                    if (e.target.classList.contains('modal-overlay')) {
                        this.closeAllModals();
                    }
                });

                // ESC key to close modals
                document.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape') {
                        this.closeAllModals();
                    }
                });

                // Smooth scrolling for anchor links
                document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                    anchor.addEventListener('click', (e) => {
                        e.preventDefault();
                        const target = document.querySelector(anchor.getAttribute('href'));
                        if (target) {
                            target.scrollIntoView({
                                behavior: 'smooth',
                                block: 'start'
                            });
                        }
                    });
                });
            }

            setupFormListeners() {
                // Registration Form
                const registrationForm = document.getElementById('registrationForm');
                registrationForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.handleRegistration(e);
                });
            }

            toggleTheme() {
                const html = document.documentElement;
                const currentTheme = html.getAttribute('data-theme');
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                
                html.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
                
                const themeIcon = document.getElementById('themeToggle').querySelector('i');
                themeIcon.className = newTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
            }

            // Countdown Timer
            startCountdown() {
                this.updateCountdown();
                this.countdownInterval = setInterval(() => {
                    this.updateCountdown();
                }, 1000);
            }

            updateCountdown() {
                const now = new Date().getTime();
                const distance = this.eventDate.getTime() - now;

                if (distance < 0) {
                    clearInterval(this.countdownInterval);
                    document.getElementById('countdown').innerHTML = `
                        <div class="countdown-item">
                            <div class="countdown-number">🚀</div>
                            <div class="countdown-label">Event Started!</div>
                        </div>
                    `;
                    return;
                }

                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);

                document.getElementById('days').textContent = days.toString().padStart(2, '0');
                document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
                document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
                document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
            }

            // Registration Functions
            openRegistrationModal() {
                const modal = document.getElementById('registrationModal');
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }

            closeRegistrationModal() {
                const modal = document.getElementById('registrationModal');
                modal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }

            closeAllModals() {
                this.closeRegistrationModal();
            }

            handleRegistration(event) {
                const formData = new FormData(event.target);
                const registrationData = Object.fromEntries(formData);
                
                // Validate required fields
                const requiredFields = ['name', 'email', 'experience', 'team-status'];
                const missingFields = requiredFields.filter(field => !formData.get(field));
                
                if (missingFields.length > 0) {
                    this.showToast('Please fill in all required fields!', 'error');
                    return;
                }
                
                const submitBtn = event.target.querySelector('.btn-submit');
                const originalText = submitBtn.innerHTML;
                
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Registering...';
                submitBtn.disabled = true;
                
                // Simulate registration process
                setTimeout(() => {
                    this.showToast('Registration successful! Welcome to Web3 Innovation Challenge 2025! 🎉', 'success');
                    this.closeRegistrationModal();
                    
                    // Reset form
                    event.target.reset();
                    
                    // Reset button
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    
                    // In real implementation, would send data to server
                    console.log('Registration data:', registrationData);
                    
                    // Show next steps
                    setTimeout(() => {
                        this.showToast('Check your email for next steps and Discord invite!', 'info');
                    }, 3000);
                }, 3000);
            }

            // Utility Functions
            scrollToSection(sectionId) {
                const section = document.getElementById(sectionId);
                if (section) {
                    section.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }

            shareEvent() {
                const shareUrl = window.location.href;
                const shareText = `🚀 Join me at the Web3 Innovation Challenge 2025! 72 hours of building the future of blockchain with $50K in prizes. Register now!`;
                
                if (navigator.share) {
                    navigator.share({
                        title: 'Web3 Innovation Challenge 2025',
                        text: shareText,
                        url: shareUrl
                    });
                } else if (navigator.clipboard) {
                    navigator.clipboard.writeText(shareText + '\n' + shareUrl).then(() => {
                        this.showToast('Event link copied to clipboard!', 'success');
                    });
                } else {
                    this.showToast('Share functionality not supported', 'error');
                }
            }

            joinDiscord() {
                this.showToast('Redirecting to Discord community...', 'info');
                
                setTimeout(() => {
                    // In real implementation, would redirect to actual Discord invite
                    console.log('Redirect to Discord: https://discord.gg/web3challenge2025');
                    this.showToast('Discord invite sent! Check your messages.', 'success');
                }, 2000);
            }

            downloadGuide() {
                const button = event.target;
                const originalContent = button.innerHTML;
                
                button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Downloading...';
                button.disabled = true;
                
                setTimeout(() => {
                    this.showToast('Hackathon guide downloaded successfully!', 'success');
                    
                    // Reset button
                    button.innerHTML = originalContent;
                    button.disabled = false;
                    
                    // In real implementation, would trigger actual download
                    console.log('Download: Web3_Challenge_2025_Guide.pdf');
                }, 2500);
            }

            showToast(message, type = 'success') {
                // Remove any existing toasts
                const existingToast = document.querySelector('.toast');
                if (existingToast) {
                    existingToast.remove();
                }
                
                const toast = document.createElement('div');
                toast.className = `toast ${type}`;
                toast.style.cssText = `
                    position: fixed;
                    top: 2rem;
                    right: 2rem;
                    padding: 1rem 1.5rem;
                    border-radius: 12px;
                    color: white;
                    font-weight: 500;
                    z-index: 10001;
                    animation: slideInToast 0.3s ease-out;
                    max-width: 400px;
                    box-shadow: var(--shadow-lg);
                    background: var(--gradient-${type});
                `;
                toast.innerHTML = `
                    <i class="fas ${this.getToastIcon(type)}"></i>
                    <span style="margin-left: 0.5rem;">${message}</span>
                `;
                
                document.body.appendChild(toast);
                
                // Auto remove after 5 seconds
                setTimeout(() => {
                    if (toast.parentNode) {
                        toast.remove();
                    }
                }, 5000);
            }

            getToastIcon(type) {
                switch (type) {
                    case 'success': return 'fa-check-circle';
                    case 'error': return 'fa-exclamation-circle';
                    case 'info': return 'fa-info-circle';
                    default: return 'fa-check-circle';
                }
            }
        }

        // Global instance and functions for onclick handlers
        let eventManager;

        function openRegistrationModal() {
            eventManager.openRegistrationModal();
        }

        function closeRegistrationModal() {
            eventManager.closeRegistrationModal();
        }

        function scrollToSection(sectionId) {
            eventManager.scrollToSection(sectionId);
        }

        function shareEvent() {
            eventManager.shareEvent();
        }

        function joinDiscord() {
            eventManager.joinDiscord();
        }

        function downloadGuide() {
            eventManager.downloadGuide();
        }

        // Initialize the application
        document.addEventListener('DOMContentLoaded', () => {
            eventManager = new EventDetailsManager();
            
            // Animate cards on page load
            setTimeout(() => {
                document.querySelectorAll('.card').forEach((card, index) => {
                    setTimeout(() => {
                        card.style.transform = 'translateY(-4px)';
                        setTimeout(() => {
                            card.style.transform = 'translateY(0)';
                        }, 200);
                    }, index * 100);
                });
            }, 1000);
        });

        // Add animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInToast {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);