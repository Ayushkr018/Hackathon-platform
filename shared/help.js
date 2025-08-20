class HelpCenterManager {
            constructor() {
                this.searchData = [
                    { title: "How to create your account", category: "Getting Started", snippet: "Step-by-step guide to creating your NexusHack account and getting started." },
                    { title: "Joining your first hackathon", category: "Hackathons & Events", snippet: "Everything you need to know about participating in your first hackathon." },
                    { title: "Using the AI team finder", category: "Teams & Collaboration", snippet: "Learn how our AI matches you with compatible team members based on skills and interests." },
                    { title: "Project submission guidelines", category: "Hackathons & Events", snippet: "Complete guide to submitting your hackathon project, including requirements and best practices." },
                    { title: "Common platform issues", category: "Technical Support", snippet: "Solutions to frequently encountered technical problems and troubleshooting steps." },
                    { title: "Account settings guide", category: "Account & Settings", snippet: "How to manage your profile, privacy settings, and account preferences." },
                    { title: "Pricing and plans", category: "Billing & Payments", snippet: "Information about NexusHack pricing plans, features, and subscription options." },
                    { title: "Browser compatibility", category: "Technical Support", snippet: "Supported browsers and how to resolve compatibility issues." },
                    { title: "Team management", category: "Teams & Collaboration", snippet: "Best practices for managing your hackathon team and coordinating collaboration." },
                    { title: "Judging criteria", category: "Hackathons & Events", snippet: "Understanding how projects are evaluated and what judges look for." }
                ];
                
                this.init();
            }

            init() {
                this.initializeTheme();
                this.setupEventListeners();
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

                // Search input events
                const searchInput = document.getElementById('helpSearch');
                let searchTimeout;

                searchInput.addEventListener('input', (e) => {
                    clearTimeout(searchTimeout);
                    searchTimeout = setTimeout(() => {
                        this.performHelpSearch(e.target.value);
                    }, 300);
                });

                searchInput.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        this.performHelpSearch(e.target.value);
                    }
                });
            }

            setupFormListeners() {
                // Contact Form
                const contactForm = document.getElementById('contactForm');
                contactForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.handleContactSubmission(e);
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

            // Search Functionality
            performHelpSearch(query) {
                const searchResults = document.getElementById('searchResults');
                const searchResultsList = document.getElementById('searchResultsList');
                const categoriesSection = document.getElementById('categoriesSection');
                
                if (!query.trim()) {
                    searchResults.classList.remove('active');
                    categoriesSection.style.display = 'block';
                    return;
                }
                
                // Filter search data based on query
                const filteredResults = this.searchData.filter(item =>
                    item.title.toLowerCase().includes(query.toLowerCase()) ||
                    item.category.toLowerCase().includes(query.toLowerCase()) ||
                    item.snippet.toLowerCase().includes(query.toLowerCase())
                );
                
                // Display results
                if (filteredResults.length > 0) {
                    searchResultsList.innerHTML = filteredResults.map(result => `
                        <div class="search-result" onclick="showArticle('${result.title.toLowerCase().replace(/\s+/g, '-')}')">
                            <h3 class="result-title">${result.title}</h3>
                            <p class="result-snippet">${result.snippet}</p>
                            <div class="result-category">${result.category}</div>
                        </div>
                    `).join('');
                } else {
                    searchResultsList.innerHTML = `
                        <div class="search-result">
                            <h3 class="result-title">No results found</h3>
                            <p class="result-snippet">
                                We couldn't find any articles matching "${query}". 
                                Try different keywords or <a href="#" onclick="openContactModal()" style="color: var(--primary);">contact support</a> for help.
                            </p>
                        </div>
                    `;
                }
                
                searchResults.classList.add('active');
                categoriesSection.style.display = 'none';
            }

            // FAQ Management
            toggleFAQ(faqItem) {
                const isActive = faqItem.classList.contains('active');
                
                // Close all other FAQ items
                document.querySelectorAll('.faq-item').forEach(item => {
                    item.classList.remove('active');
                });
                
                // Toggle current item
                if (!isActive) {
                    faqItem.classList.add('active');
                }
            }

            // Category and Article Management
            showCategoryArticles(category) {
                this.showToast(`Loading ${category.replace('-', ' ')} articles...`, 'info');
                
                setTimeout(() => {
                    console.log('Show category articles:', category);
                    // In real implementation, would load category-specific articles
                }, 1000);
            }

            showArticle(articleId) {
                this.showToast('Loading article...', 'info');
                
                setTimeout(() => {
                    console.log('Show article:', articleId);
                    // In real implementation, would display full article
                }, 1000);
            }

            // Tutorial Management
            playTutorial(tutorialId) {
                this.showToast('Loading tutorial video...', 'info');
                
                setTimeout(() => {
                    console.log('Play tutorial:', tutorialId);
                    // In real implementation, would open video player modal
                }, 1500);
            }

            // Contact Functions
            openContactModal() {
                const modal = document.getElementById('contactModal');
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }

            closeContactModal() {
                const modal = document.getElementById('contactModal');
                modal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }

            handleContactSubmission(event) {
                const formData = new FormData(event.target);
                const contactData = Object.fromEntries(formData);
                
                const submitBtn = event.target.querySelector('.btn-submit');
                const originalText = submitBtn.innerHTML;
                
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                submitBtn.disabled = true;
                
                setTimeout(() => {
                    this.showToast('Your message has been sent! Our support team will respond within 2 hours.', 'success');
                    this.closeContactModal();
                    
                    // Reset form and button
                    event.target.reset();
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    
                    console.log('Contact submission:', contactData);
                }, 3000);
            }

            // Support Channel Functions
            openLiveChat() {
                this.showToast('Connecting to live chat...', 'info');
                
                setTimeout(() => {
                    console.log('Open live chat');
                    this.showToast('Live chat opened! An agent will be with you shortly.', 'success');
                }, 2000);
            }

            openEmailSupport() {
                this.openContactModal();
            }

            scheduleCall() {
                this.showToast('Opening scheduling system...', 'info');
                
                setTimeout(() => {
                    console.log('Schedule call');
                    this.showToast('Scheduling system opened! Pick a time that works for you.', 'success');
                }, 2000);
            }

            joinDiscord() {
                this.showToast('Redirecting to Discord community...', 'info');
                
                setTimeout(() => {
                    console.log('Join Discord');
                    this.showToast('Welcome to the NexusHack community! 🎉', 'success');
                }, 2500);
            }

            closeAllModals() {
                this.closeContactModal();
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
                
                // Auto remove after 4 seconds
                setTimeout(() => {
                    if (toast.parentNode) {
                        toast.remove();
                    }
                }, 4000);
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
        let helpManager;

        function performHelpSearch(query) {
            helpManager.performHelpSearch(query);
        }

        function toggleFAQ(element) {
            helpManager.toggleFAQ(element);
        }

        function showCategoryArticles(category) {
            helpManager.showCategoryArticles(category);
        }

        function showArticle(articleId) {
            helpManager.showArticle(articleId);
        }

        function playTutorial(tutorialId) {
            helpManager.playTutorial(tutorialId);
        }

        function openContactModal() {
            helpManager.openContactModal();
        }

        function closeContactModal() {
            helpManager.closeContactModal();
        }

        function openLiveChat() {
            helpManager.openLiveChat();
        }

        function openEmailSupport() {
            helpManager.openEmailSupport();
        }

        function scheduleCall() {
            helpManager.scheduleCall();
        }

        function joinDiscord() {
            helpManager.joinDiscord();
        }

        // Initialize the application
        document.addEventListener('DOMContentLoaded', () => {
            helpManager = new HelpCenterManager();
            
            // Animate category cards on page load
            setTimeout(() => {
                document.querySelectorAll('.category-card').forEach((card, index) => {
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