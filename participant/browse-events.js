// Advanced JavaScript for better UX and interactions
        class EventBrowser {
            constructor() {
                this.currentView = 'grid';
                this.activeFilters = {
                    category: '',
                    duration: '',
                    prize: '',
                    difficulty: '',
                    technologies: []
                };
                this.init();
            }

            init() {
                this.initializeTheme();
                this.initializeUser();
                this.setupEventListeners();
                this.setupSearch();
            }

            initializeTheme() {
                const savedTheme = localStorage.getItem('theme') || 'dark';
                document.documentElement.setAttribute('data-theme', savedTheme);
                
                const themeToggle = document.getElementById('themeToggle');
                const themeIcon = themeToggle.querySelector('i');
                themeIcon.className = savedTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
            }

            initializeUser() {
                const userSession = localStorage.getItem('userSession');
                if (userSession) {
                    const session = JSON.parse(userSession);
                    const firstName = session.firstName || session.email.split('@')[0];
                    
                    document.getElementById('userName').textContent = session.firstName ? 
                        `${session.firstName} ${session.lastName || ''}`.trim() : 
                        firstName;
                    
                    const initials = session.firstName && session.lastName ? 
                        `${session.firstName}${session.lastName[0]}` : 
                        firstName.slice(0, 2).toUpperCase();
                    document.getElementById('userAvatar').textContent = initials;
                }
            }

            setupEventListeners() {
                // Theme toggle
                document.getElementById('themeToggle').addEventListener('click', () => {
                    this.toggleTheme();
                });

                // Sidebar toggle
                const sidebar = document.getElementById('sidebar');
                const sidebarToggle = document.getElementById('sidebarToggle');

                sidebarToggle.addEventListener('click', () => {
                    if (window.innerWidth <= 1024) {
                        sidebar.classList.toggle('open');
                    } else {
                        sidebar.classList.toggle('collapsed');
                    }
                });

                // Close mobile sidebar when clicking outside
                document.addEventListener('click', (e) => {
                    if (window.innerWidth <= 1024 && 
                        !sidebar.contains(e.target) && 
                        !sidebarToggle.contains(e.target) &&
                        sidebar.classList.contains('open')) {
                        sidebar.classList.remove('open');
                    }
                });

                // Handle window resize
                window.addEventListener('resize', () => {
                    if (window.innerWidth > 1024) {
                        sidebar.classList.remove('open');
                    }
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

            setupSearch() {
                const searchInput = document.getElementById('searchInput');
                let searchTimeout;

                searchInput.addEventListener('input', (e) => {
                    clearTimeout(searchTimeout);
                    searchTimeout = setTimeout(() => {
                        this.performSearch(e.target.value);
                    }, 300);
                });
            }

            performSearch(query) {
                console.log('Searching for:', query);
                this.showLoading();
                
                // Simulate search delay
                setTimeout(() => {
                    this.hideLoading();
                    if (query.length > 0) {
                        this.filterEventsBySearch(query);
                    } else {
                        this.showAllEvents();
                    }
                }, 500);
            }

            filterEventsBySearch(query) {
                const matchingEvents = Math.floor(Math.random() * 5) + 1;
                this.updateEventsCount(matchingEvents);
                
                if (matchingEvents === 0) {
                    this.showEmptyState();
                }
            }

            showAllEvents() {
                this.hideEmptyState();
                this.updateEventsCount(6);
            }

            applyFilters() {
                this.activeFilters.category = document.getElementById('categoryFilter').value;
                this.activeFilters.duration = document.getElementById('durationFilter').value;
                this.activeFilters.prize = document.getElementById('prizeFilter').value;
                this.activeFilters.difficulty = document.getElementById('difficultyFilter').value;
                
                console.log('Applying filters:', this.activeFilters);
                
                this.showLoading();
                
                setTimeout(() => {
                    this.hideLoading();
                    this.filterEvents();
                }, 300);
            }

            toggleTechFilter(element) {
                const tech = element.dataset.tech;
                
                if (element.classList.contains('active')) {
                    element.classList.remove('active');
                    this.activeFilters.technologies = this.activeFilters.technologies.filter(t => t !== tech);
                } else {
                    element.classList.add('active');
                    this.activeFilters.technologies.push(tech);
                }
                
                this.applyFilters();
            }

            clearAllFilters() {
                // Reset filter values
                document.getElementById('categoryFilter').value = '';
                document.getElementById('durationFilter').value = '';
                document.getElementById('prizeFilter').value = '';
                document.getElementById('difficultyFilter').value = '';
                
                // Reset tech filters
                document.querySelectorAll('.filter-tag').forEach(tag => {
                    tag.classList.remove('active');
                });
                
                // Reset search
                document.getElementById('searchInput').value = '';
                
                // Reset active filters
                this.activeFilters = {
                    category: '',
                    duration: '',
                    prize: '',
                    difficulty: '',
                    technologies: []
                };
                
                this.showAllEvents();
            }

            filterEvents() {
                const hasFilters = this.activeFilters.category || this.activeFilters.duration || 
                                 this.activeFilters.prize || this.activeFilters.difficulty || 
                                 this.activeFilters.technologies.length > 0;
                
                if (hasFilters) {
                    this.updateEventsCount(Math.floor(Math.random() * 4) + 2);
                } else {
                    this.updateEventsCount(6);
                }
            }

            toggleView(view) {
                this.currentView = view;
                
                // Update button states
                document.querySelectorAll('.view-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                document.querySelector(`[data-view="${view}"]`).classList.add('active');
                
                // Toggle views
                const eventsGrid = document.getElementById('eventsGrid');
                const eventsList = document.getElementById('eventsList');
                
                if (view === 'grid') {
                    eventsGrid.classList.add('active');
                    eventsGrid.style.display = 'grid';
                    eventsList.classList.remove('active');
                    eventsList.style.display = 'none';
                } else {
                    eventsGrid.classList.remove('active');
                    eventsGrid.style.display = 'none';
                    eventsList.classList.add('active');
                    eventsList.style.display = 'flex';
                    
                    this.generateListView();
                }
            }

            generateListView() {
                const eventsList = document.getElementById('eventsList');
                eventsList.innerHTML = `
                    <div class="event-card-list">
                        <div class="list-banner"></div>
                        <div class="list-content">
                            <div class="list-header">
                                <div>
                                    <h3 class="list-title">Web3 Innovation Challenge 2025</h3>
                                    <div class="list-meta">
                                        <span><i class="fas fa-calendar"></i> Mar 15-17, 2025</span>
                                        <span><i class="fas fa-users"></i> 2,456 participants</span>
                                        <span><i class="fas fa-trophy"></i> $75K prizes</span>
                                    </div>
                                </div>
                                <div class="event-status status-open">Open</div>
                            </div>
                            <div class="list-actions">
                                <div class="list-tags">
                                    <span class="event-tag">Solidity</span>
                                    <span class="event-tag">React</span>
                                    <span class="event-tag">IPFS</span>
                                </div>
                                <div class="list-buttons">
                                    <button class="btn btn-primary btn-small" onclick="registerForEvent('web3-innovation-2025')">Register</button>
                                    <button class="btn btn-secondary btn-small" onclick="viewEventDetails('web3-innovation-2025')">Details</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="event-card-list">
                        <div class="list-banner"></div>
                        <div class="list-content">
                            <div class="list-header">
                                <div>
                                    <h3 class="list-title">AI Healthcare Hackathon</h3>
                                    <div class="list-meta">
                                        <span><i class="fas fa-calendar"></i> Apr 5-7, 2025</span>
                                        <span><i class="fas fa-users"></i> 1,834 participants</span>
                                        <span><i class="fas fa-trophy"></i> $50K prizes</span>
                                    </div>
                                </div>
                                <div class="event-status status-open">Open</div>
                            </div>
                            <div class="list-actions">
                                <div class="list-tags">
                                    <span class="event-tag">TensorFlow</span>
                                    <span class="event-tag">Python</span>
                                    <span class="event-tag">PyTorch</span>
                                </div>
                                <div class="list-buttons">
                                    <button class="btn btn-primary btn-small" onclick="registerForEvent('ai-healthcare-2025')">Register</button>
                                    <button class="btn btn-secondary btn-small" onclick="viewEventDetails('ai-healthcare-2025')">Details</button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }

            registerForEvent(eventId) {
                const button = event.target;
                const originalText = button.innerHTML;
                
                button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Registering...';
                button.disabled = true;
                
                // Simulate registration
                setTimeout(() => {
                    button.innerHTML = '<i class="fas fa-check"></i> Registered!';
                    button.style.background = 'var(--gradient-success)';
                    
                    this.showToast('Successfully registered for the hackathon!', 'success');
                    
                    setTimeout(() => {
                        button.innerHTML = originalText;
                        button.disabled = false;
                        button.style.background = 'var(--gradient-primary)';
                    }, 2000);
                }, 1500);
            }

            viewEventDetails(eventId) {
                console.log('Viewing details for:', eventId);
                window.location.href = `event-details.html?id=${eventId}`;
            }

            showLoading() {
                document.getElementById('eventsLoading').style.display = 'grid';
                document.getElementById('eventsGrid').style.display = 'none';
                document.getElementById('eventsList').style.display = 'none';
            }

            hideLoading() {
                document.getElementById('eventsLoading').style.display = 'none';
                if (this.currentView === 'grid') {
                    document.getElementById('eventsGrid').style.display = 'grid';
                } else {
                    document.getElementById('eventsList').style.display = 'flex';
                }
            }

            showEmptyState() {
                document.getElementById('eventsGrid').style.display = 'none';
                document.getElementById('eventsList').style.display = 'none';
                document.getElementById('emptyState').style.display = 'block';
            }

            hideEmptyState() {
                document.getElementById('emptyState').style.display = 'none';
            }

            updateEventsCount(count) {
                document.getElementById('eventsCount').textContent = `(${count} events found)`;
            }

            showToast(message, type = 'success') {
                const toast = document.createElement('div');
                toast.className = 'toast';
                toast.style.cssText = `
                    position: fixed;
                    top: 2rem;
                    right: 2rem;
                    background: var(--gradient-${type});
                    color: white;
                    padding: 1rem 1.5rem;
                    border-radius: 12px;
                    box-shadow: var(--shadow-lg);
                    z-index: 10000;
                    animation: slideIn 0.3s ease-out;
                `;
                toast.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
                
                document.body.appendChild(toast);
                
                setTimeout(() => {
                    toast.remove();
                }, 3000);
            }
        }

        // Create global instance
        let eventBrowser;

        // Global functions for onclick handlers
        function applyFilters() {
            eventBrowser.applyFilters();
        }

        function toggleTechFilter(element) {
            eventBrowser.toggleTechFilter(element);
        }

        function clearAllFilters() {
            eventBrowser.clearAllFilters();
        }

        function toggleView(view) {
            eventBrowser.toggleView(view);
        }

        function registerForEvent(eventId) {
            eventBrowser.registerForEvent(eventId);
        }

        function viewEventDetails(eventId) {
            eventBrowser.viewEventDetails(eventId);
        }

        function logout() {
            if (confirm('Are you sure you want to logout?')) {
                localStorage.removeItem('userSession');
                window.location.href = '../auth/login.html';
            }
        }

        // Initialize the application
        document.addEventListener('DOMContentLoaded', () => {
            eventBrowser = new EventBrowser();
            
            // Add loading animation to register buttons
            document.querySelectorAll('.btn-primary').forEach(btn => {
                btn.addEventListener('click', function(e) {
                    if (this.textContent.includes('Register')) {
                        e.preventDefault();
                        const eventId = this.getAttribute('onclick')?.match(/'([^']+)'/)?.[1] || 'unknown';
                        eventBrowser.registerForEvent(eventId);
                    }
                });
            });
        });

        // Add slide in animation keyframes
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
