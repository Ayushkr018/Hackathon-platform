
        // ADVANCED JAVASCRIPT - EVENTS MANAGEMENT SYSTEM
        class AssignedEvents {
            constructor() {
                this.events = [];
                this.filteredEvents = [];
                this.isMobile = window.innerWidth <= 1024;
                this.currentUser = {
                    name: 'Dr. Jane Smith',
                    initials: 'JS',
                    role: 'Senior Judge',
                    id: 'judge_001'
                };
                this.init();
            }

            init() {
                this.initializeTheme();
                this.setupEventListeners();
                this.loadEventsData();
                this.renderEvents();
                this.initializeUser();
                this.handleResize();
            }

            initializeTheme() {
                const savedTheme = localStorage.getItem('theme') || 'dark';
                document.documentElement.setAttribute('data-theme', savedTheme);
                const themeToggle = document.getElementById('themeToggle');
                const themeIcon = themeToggle.querySelector('i');
                themeIcon.className = savedTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
            }

            initializeUser() {
                const userSession = localStorage.getItem('judgeSession');
                if (userSession) {
                    const session = JSON.parse(userSession);
                    this.currentUser.name = session.name || this.currentUser.name;
                    this.currentUser.initials = session.initials || this.currentUser.initials;
                }
                document.getElementById('userName').textContent = this.currentUser.name;
                document.getElementById('userAvatar').textContent = this.currentUser.initials;
            }

            setupEventListeners() {
                document.getElementById('sidebarToggle').addEventListener('click', () => this.toggleSidebar());
                document.getElementById('themeToggle').addEventListener('click', () => this.toggleTheme());
                document.getElementById('mobileOverlay').addEventListener('click', () => this.closeMobileSidebar());
                window.addEventListener('resize', () => this.handleResize());
                window.addEventListener('orientationchange', () => setTimeout(() => this.handleResize(), 100));
                
                // Filters
                document.getElementById('statusFilter').addEventListener('change', () => this.filterEvents());
                document.getElementById('categoryFilter').addEventListener('change', () => this.filterEvents());
                
                // Search
                const searchInput = document.getElementById('searchInput');
                let searchTimeout;
                searchInput.addEventListener('input', (e) => {
                    clearTimeout(searchTimeout);
                    searchTimeout = setTimeout(() => this.searchEvents(e.target.value), 300);
                });

                this.setupTouchGestures();
            }

            setupTouchGestures() {
                let startX;
                document.addEventListener('touchstart', (e) => startX = e.touches[0].clientX);
                document.addEventListener('touchend', (e) => {
                    if (!startX) return;
                    const endX = e.changedTouches.clientX;
                    const diffX = startX - endX;
                    if (Math.abs(diffX) > 50) {
                        if (diffX > 0) this.closeMobileSidebar();
                        else if (this.isMobile) this.openMobileSidebar();
                    }
                    startX = null;
                });
            }

            handleResize() {
                this.isMobile = window.innerWidth <= 1024;
                if (!this.isMobile) this.closeMobileSidebar();
            }

            toggleSidebar() {
                const sidebar = document.getElementById('sidebar');
                if (this.isMobile) {
                    sidebar.classList.toggle('open');
                    this.toggleMobileOverlay();
                } else {
                    sidebar.classList.toggle('collapsed');
                }
            }

            openMobileSidebar() {
                if (this.isMobile) {
                    document.getElementById('sidebar').classList.add('open');
                    this.showMobileOverlay();
                }
            }

            closeMobileSidebar() {
                document.getElementById('sidebar').classList.remove('open');
                this.hideMobileOverlay();
            }

            toggleMobileOverlay() {
                document.getElementById('mobileOverlay').classList.toggle('active');
            }

            showMobileOverlay() {
                document.getElementById('mobileOverlay').classList.add('active');
            }

            hideMobileOverlay() {
                document.getElementById('mobileOverlay').classList.remove('active');
            }

            toggleTheme() {
                const html = document.documentElement;
                const currentTheme = html.getAttribute('data-theme');
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                html.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
                const themeIcon = document.getElementById('themeToggle').querySelector('i');
                themeIcon.className = newTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
                this.showToast(`Theme changed to ${newTheme} mode`, 'success');
            }

            loadEventsData() {
                const storedEvents = localStorage.getItem('judgeEvents');
                if (storedEvents) {
                    this.events = JSON.parse(storedEvents);
                } else {
                    this.events = this.getMockEvents();
                    this.saveEvents();
                }
                this.filteredEvents = [...this.events];
            }

            getMockEvents() {
                const now = Date.now();
                return [
                    {
                        id: 1,
                        title: 'Web3 Challenge 2025',
                        organizer: 'Blockchain Foundation',
                        status: 'live',
                        category: 'web3',
                        startDate: now - 86400000,
                        endDate: now + 86400000,
                        participants: 324,
                        projects: 67,
                        evaluated: 23,
                        description: 'Build the future of decentralized applications with cutting-edge Web3 technologies. Focus on DeFi, NFTs, and blockchain innovation.',
                        prize: '$50,000',
                        location: 'Virtual',
                        difficulty: 'Advanced'
                    },
                    {
                        id: 2,
                        title: 'AI for Good Hackathon',
                        organizer: 'Tech for Humanity',
                        status: 'upcoming',
                        category: 'ai',
                        startDate: now + 604800000,
                        endDate: now + 777600000,
                        participants: 256,
                        projects: 0,
                        evaluated: 0,
                        description: 'Harness artificial intelligence to solve real-world problems in healthcare, education, and sustainability.',
                        prize: '$30,000',
                        location: 'San Francisco, CA',
                        difficulty: 'Intermediate'
                    },
                    {
                        id: 3,
                        title: 'Mobile Innovation Sprint',
                        organizer: 'AppDev Collective',
                        status: 'completed',
                        category: 'mobile',
                        startDate: now - 1209600000,
                        endDate: now - 1036800000,
                        participants: 267,
                        projects: 89,
                        evaluated: 89,
                        description: 'Create groundbreaking mobile applications that push the boundaries of user experience and functionality.',
                        prize: '$25,000',
                        location: 'New York, NY',
                        difficulty: 'Beginner'
                    }
                ];
            }

            saveEvents() {
                localStorage.setItem('judgeEvents', JSON.stringify(this.events));
            }

            filterEvents() {
                const statusFilter = document.getElementById('statusFilter').value;
                const categoryFilter = document.getElementById('categoryFilter').value;
                const searchTerm = document.getElementById('searchInput').value.toLowerCase();

                this.filteredEvents = this.events.filter(event => {
                    const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
                    const matchesCategory = categoryFilter === 'all' || event.category === categoryFilter;
                    const matchesSearch = !searchTerm || 
                        event.title.toLowerCase().includes(searchTerm) ||
                        event.organizer.toLowerCase().includes(searchTerm) ||
                        event.description.toLowerCase().includes(searchTerm);
                    
                    return matchesStatus && matchesCategory && matchesSearch;
                });

                this.renderEvents();
            }

            searchEvents(searchTerm) {
                this.filterEvents();
            }

            renderEvents() {
                const container = document.getElementById('eventsGrid');
                container.innerHTML = '';

                if (this.filteredEvents.length === 0) {
                    container.innerHTML = `
                        <div class="empty-state">
                            <div class="empty-icon"><i class="fas fa-calendar-times"></i></div>
                            <h3 class="empty-title">No events found</h3>
                            <p class="empty-description">
                                Try adjusting your filters or search terms to find the events you're looking for.
                            </p>
                            <button class="btn btn-primary" onclick="clearFilters()">
                                <i class="fas fa-refresh"></i>Clear Filters
                            </button>
                        </div>
                    `;
                    return;
                }

                this.filteredEvents.forEach(event => {
                    const eventCard = document.createElement('div');
                    eventCard.className = 'event-card';
                    eventCard.onclick = () => this.openEventDetails(event.id);

                    eventCard.innerHTML = `
                        <div class="event-status ${event.status}">${event.status}</div>
                        <div class="event-header">
                            <div class="event-icon">
                                <i class="fas ${this.getEventIcon(event.category)}"></i>
                            </div>
                            <div class="event-details">
                                <h3 class="event-title">${event.title}</h3>
                                <div class="event-organizer">${event.organizer}</div>
                                <div class="event-meta">
                                    <span><i class="fas fa-calendar"></i> ${this.formatDate(event.startDate)} - ${this.formatDate(event.endDate)}</span>
                                    <span><i class="fas fa-map-marker-alt"></i> ${event.location}</span>
                                    <span><i class="fas fa-trophy"></i> ${event.prize}</span>
                                </div>
                            </div>
                        </div>
                        <p class="event-description">${event.description}</p>
                        <div class="event-stats">
                            <div class="stat-item">
                                <span class="stat-number">${event.participants}</span>
                                <span class="stat-label">Participants</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-number">${event.projects}</span>
                                <span class="stat-label">Projects</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-number">${event.evaluated}</span>
                                <span class="stat-label">Evaluated</span>
                            </div>
                        </div>
                        <div class="event-actions">
                            ${this.getEventActions(event)}
                        </div>
                    `;

                    container.appendChild(eventCard);
                });
            }

            getEventIcon(category) {
                const icons = {
                    web3: 'fa-cube',
                    ai: 'fa-brain',
                    mobile: 'fa-mobile-alt',
                    iot: 'fa-microchip',
                    fintech: 'fa-coins'
                };
                return icons[category] || 'fa-calendar';
            }

            getEventActions(event) {
                switch (event.status) {
                    case 'live':
                        return `
                            <button class="btn btn-success" onclick="startEvaluating(${event.id})">
                                <i class="fas fa-play"></i>Start Evaluating
                            </button>
                            <button class="btn btn-secondary" onclick="viewProjects(${event.id})">
                                <i class="fas fa-eye"></i>View Projects
                            </button>
                        `;
                    case 'upcoming':
                        return `
                            <button class="btn btn-primary" onclick="viewEventDetails(${event.id})">
                                <i class="fas fa-info-circle"></i>Event Details
                            </button>
                            <button class="btn btn-secondary" onclick="setReminder(${event.id})">
                                <i class="fas fa-bell"></i>Set Reminder
                            </button>
                        `;
                    case 'completed':
                        return `
                            <button class="btn btn-primary" onclick="viewResults(${event.id})">
                                <i class="fas fa-trophy"></i>View Results
                            </button>
                            <button class="btn btn-secondary" onclick="downloadReport(${event.id})">
                                <i class="fas fa-download"></i>Download Report
                            </button>
                        `;
                    default:
                        return `
                            <button class="btn btn-primary" onclick="viewEventDetails(${event.id})">
                                <i class="fas fa-info-circle"></i>View Details
                            </button>
                        `;
                }
            }

            formatDate(timestamp) {
                const date = new Date(timestamp);
                return date.toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                });
            }

            openEventDetails(eventId) {
                this.showToast(`Loading details for event ${eventId}...`, 'info');
                // In real implementation, would open event details modal or navigate to details page
            }

            showToast(message, type = 'success') {
                const existingToast = document.querySelector('.toast');
                if (existingToast) existingToast.remove();
                
                const toast = document.createElement('div');
                toast.className = `toast ${type}`;
                toast.style.cssText = `
                    position: fixed; top: 2rem; right: 2rem; padding: 1rem 1.5rem;
                    border-radius: 12px; color: white; font-weight: 500; z-index: 10001;
                    animation: slideInToast 0.3s ease-out; max-width: 350px;
                    box-shadow: var(--shadow-lg); background: var(--gradient-${type});
                `;
                
                if (window.innerWidth <= 768) {
                    toast.style.top = '1rem'; toast.style.right = '1rem';
                    toast.style.left = '1rem'; toast.style.maxWidth = 'none';
                }
                
                toast.innerHTML = `
                    <i class="fas ${this.getToastIcon(type)}"></i>
                    <span style="margin-left: 0.5rem;">${message}</span>
                `;
                
                document.body.appendChild(toast);
                setTimeout(() => { if (toast.parentNode) toast.remove(); }, 4000);
            }

            getToastIcon(type) {
                switch (type) {
                    case 'success': return 'fa-check-circle';
                    case 'error': return 'fa-exclamation-circle';
                    case 'info': return 'fa-info-circle';
                    case 'warning': return 'fa-exclamation-triangle';
                    default: return 'fa-check-circle';
                }
            }
        }

        // Global instance and functions
        let assignedEvents;

        function startEvaluating(eventId) {
            assignedEvents.showToast('Starting evaluation process...', 'info');
            setTimeout(() => window.location.href = 'evaluation.html', 1000);
        }

        function viewProjects(eventId) {
            assignedEvents.showToast('Loading project gallery...', 'info');
            setTimeout(() => window.location.href = 'project-gallery.html', 1000);
        }

        function viewEventDetails(eventId) {
            assignedEvents.showToast('Loading event details...', 'info');
        }

        function setReminder(eventId) {
            assignedEvents.showToast('Reminder set successfully!', 'success');
        }

        function viewResults(eventId) {
            assignedEvents.showToast('Loading event results...', 'info');
        }

        function downloadReport(eventId) {
            assignedEvents.showToast('Preparing report download...', 'info');
        }

        function clearFilters() {
            document.getElementById('statusFilter').value = 'all';
            document.getElementById('categoryFilter').value = 'all';
            document.getElementById('searchInput').value = '';
            assignedEvents.filterEvents();
            assignedEvents.showToast('Filters cleared!', 'success');
        }

        function backToDashboard() {
            window.location.href = 'dashboard.html';
        }

        // Initialize
        document.addEventListener('DOMContentLoaded', () => {
            assignedEvents = new AssignedEvents();
            
            // Animate cards on load
            setTimeout(() => {
                document.querySelectorAll('.event-card').forEach((card, index) => {
                    setTimeout(() => {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 100);
                    }, index * 100);
                });
            }, 500);

            // Performance optimization for mobile
            if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                document.body.classList.add('mobile-device');
                const style = document.createElement('style');
                style.textContent = `.mobile-device * { animation-duration: 0.1s !important; transition-duration: 0.1s !important; }`;
                document.head.appendChild(style);
            }
        });

        // Add animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInToast {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @media (max-width: 768px) {
                @keyframes slideInToast {
                    from { transform: translateY(-100%); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            }
            .event-card { transition: var(--transition) !important; }
            @media (hover: hover) and (pointer: fine) {
                .event-card:hover { transform: translateY(-8px) !important; }
            }
            *:focus-visible { outline: 2px solid var(--primary) !important; outline-offset: 2px !important; }
        `;
        document.head.appendChild(style);

