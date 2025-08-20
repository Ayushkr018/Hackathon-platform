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

            // ✅ THEME COLOR COMBINATION
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
                // Sidebar and UI controls
                document.getElementById('sidebarToggle').addEventListener('click', () => this.toggleSidebar());
                document.getElementById('themeToggle').addEventListener('click', () => this.toggleTheme());
                document.getElementById('mobileOverlay').addEventListener('click', () => this.closeMobileSidebar());
                window.addEventListener('resize', () => this.handleResize());
                window.addEventListener('orientationchange', () => setTimeout(() => this.handleResize(), 100));
                
                // Search functionality
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

            // ✅ THEME TOGGLE WITH SMOOTH TRANSITION
            toggleTheme() {
                const html = document.documentElement;
                const currentTheme = html.getAttribute('data-theme');
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                
                html.style.transition = 'all 0.3s ease';
                html.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
                
                const themeIcon = document.getElementById('themeToggle').querySelector('i');
                themeIcon.className = newTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
                
                this.showToast(`Theme changed to ${newTheme} mode ✨`, 'success');
                
                setTimeout(() => {
                    html.style.transition = '';
                }, 300);
            }

            // ✅ UX LOADER AT TOP
            showLoader() {
                let loaderBar = document.getElementById('loaderBar');
                if (!loaderBar) {
                    loaderBar = document.createElement('div');
                    loaderBar.id = 'loaderBar';
                    document.body.appendChild(loaderBar);
                }
                
                setTimeout(() => {
                    loaderBar.style.width = '60%';
                }, 50);
            }

            completeLoader() {
                const loaderBar = document.getElementById('loaderBar');
                if (loaderBar) {
                    loaderBar.style.width = '100%';
                    
                    setTimeout(() => {
                        loaderBar.style.width = '0%';
                        loaderBar.style.opacity = '0';
                        
                        setTimeout(() => {
                            if (loaderBar.parentNode) {
                                loaderBar.remove();
                            }
                        }, 300);
                    }, 500);
                }
            }

            loadEventsData() {
                this.showLoader();
                
                setTimeout(() => {
                    const storedEvents = localStorage.getItem('judgeEvents');
                    if (storedEvents) {
                        this.events = JSON.parse(storedEvents);
                    } else {
                        this.events = this.getMockEvents();
                        this.saveEvents();
                    }
                    this.filteredEvents = [...this.events];
                    this.completeLoader();
                }, 1000);
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
                        description: 'Build the future of decentralized applications with cutting-edge Web3 technologies. Focus on DeFi, NFTs, and blockchain innovation for real-world impact.',
                        prize: '$50,000',
                        location: 'Virtual Global Event',
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
                        description: 'Harness artificial intelligence to solve real-world problems in healthcare, education, and sustainability. Create AI solutions that make a positive impact.',
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
                        description: 'Create groundbreaking mobile applications that push the boundaries of user experience and functionality across iOS and Android platforms.',
                        prize: '$25,000',
                        location: 'New York, NY',
                        difficulty: 'Beginner'
                    },
                    {
                        id: 4,
                        title: 'IoT Smart Cities Challenge',
                        organizer: 'Urban Tech Alliance',
                        status: 'upcoming',
                        category: 'iot',
                        startDate: now + 1209600000,
                        endDate: now + 1382400000,
                        participants: 198,
                        projects: 0,
                        evaluated: 0,
                        description: 'Design Internet of Things solutions for smart cities. Focus on traffic management, environmental monitoring, and urban efficiency improvements.',
                        prize: '$40,000',
                        location: 'London, UK',
                        difficulty: 'Advanced'
                    },
                    {
                        id: 5,
                        title: 'Fintech Innovation Lab',
                        organizer: 'Financial Future Foundation',
                        status: 'completed',
                        category: 'fintech',
                        startDate: now - 1814400000,
                        endDate: now - 1641600000,
                        participants: 312,
                        projects: 78,
                        evaluated: 78,
                        description: 'Revolutionize financial services with innovative fintech solutions. Build products for payments, lending, trading, and personal finance management.',
                        prize: '$35,000',
                        location: 'Singapore',
                        difficulty: 'Intermediate'
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
                this.updateStats();
            }

            searchEvents(searchTerm) {
                this.filterEvents();
            }

            updateStats() {
                document.getElementById('totalEvents').textContent = this.events.length;
                
                const totalParticipants = this.events.reduce((sum, event) => sum + event.participants, 0);
                document.getElementById('totalParticipants').textContent = totalParticipants;
                
                const totalEvaluated = this.events.reduce((sum, event) => sum + event.evaluated, 0);
                document.getElementById('projectsEvaluated').textContent = totalEvaluated;
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

                this.filteredEvents.forEach((event, index) => {
                    const eventCard = document.createElement('div');
                    eventCard.className = 'event-card';
                    eventCard.style.opacity = '0';
                    eventCard.style.transform = 'translateY(20px)';
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

                    // Animate cards in
                    setTimeout(() => {
                        eventCard.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                        eventCard.style.opacity = '1';
                        eventCard.style.transform = 'translateY(0)';
                    }, index * 100 + 300);
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

            // ✅ REALISTIC EVENT DETAILS WITH PROPER MODAL POSITIONING
            openEventDetails(eventId) {
                const event = this.events.find(e => e.id === eventId);
                this.showToast(`Loading comprehensive details for ${event.title}... 📅`, 'info');
                this.showLoader();
                
                setTimeout(() => {
                    this.completeLoader();
                    
                    // ✅ REMOVE ANY EXISTING MODALS
                    const existingModals = document.querySelectorAll('.event-modal');
                    existingModals.forEach(modal => modal.remove());
                    
                    // Create detailed event modal with proper z-index
                    const modal = document.createElement('div');
                    modal.className = 'modal active event-modal';
                    modal.innerHTML = `
                        <div class="modal-content">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                                <h2 style="color: var(--text-primary); margin: 0; font-size: 1.5rem;">📅 Event Details</h2>
                                <button onclick="this.closest('.modal').remove()" style="background: none; border: none; font-size: 1.5rem; color: var(--text-muted); cursor: pointer; padding: 0.5rem; border-radius: 8px; transition: var(--transition);" onmouseover="this.style.background='var(--bg-glass)'" onmouseout="this.style.background='none'">✕</button>
                            </div>
                            
                            <div style="background: var(--gradient-events); padding: 1.5rem; border-radius: 12px; color: white; margin-bottom: 1.5rem; text-align: center;">
                                <h3 style="margin: 0 0 0.5rem 0; font-size: 1.25rem;">${event.title}</h3>
                                <p style="margin: 0; opacity: 0.9;">by ${event.organizer}</p>
                            </div>
                            
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
                                <div style="background: var(--bg-glass); padding: 1rem; border-radius: 12px;">
                                    <h4 style="color: var(--text-primary); margin: 0 0 0.5rem 0; font-size: 0.9rem;">📊 Statistics</h4>
                                    <p style="margin: 0.25rem 0; color: var(--text-secondary); font-size: 0.85rem;"><strong>Participants:</strong> ${event.participants}</p>
                                    <p style="margin: 0.25rem 0; color: var(--text-secondary); font-size: 0.85rem;"><strong>Projects:</strong> ${event.projects}</p>
                                    <p style="margin: 0.25rem 0; color: var(--text-secondary); font-size: 0.85rem;"><strong>Evaluated:</strong> ${event.evaluated}</p>
                                </div>
                                <div style="background: var(--bg-glass); padding: 1rem; border-radius: 12px;">
                                    <h4 style="color: var(--text-primary); margin: 0 0 0.5rem 0; font-size: 0.9rem;">📍 Event Info</h4>
                                    <p style="margin: 0.25rem 0; color: var(--text-secondary); font-size: 0.85rem;"><strong>Status:</strong> ${event.status.toUpperCase()}</p>
                                    <p style="margin: 0.25rem 0; color: var(--text-secondary); font-size: 0.85rem;"><strong>Prize:</strong> ${event.prize}</p>
                                    <p style="margin: 0.25rem 0; color: var(--text-secondary); font-size: 0.85rem;"><strong>Location:</strong> ${event.location}</p>
                                </div>
                            </div>
                            
                            <div style="background: var(--bg-glass); padding: 1rem; border-radius: 12px; margin-bottom: 1.5rem;">
                                <h4 style="color: var(--text-primary); margin: 0 0 0.75rem 0;">📝 Description</h4>
                                <p style="color: var(--text-muted); line-height: 1.6; margin: 0;">${event.description}</p>
                            </div>
                            
                            <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
                                ${this.getEventActions(event)}
                            </div>
                        </div>
                    `;
                    
                    document.body.appendChild(modal);
                }, 1200);
            }

            // ✅ FIXED NOTIFICATION POSITIONING - NO OVERLAP WITH SEARCH
            showToast(message, type = 'success') {
                // Remove existing toasts
                const existingToasts = document.querySelectorAll('.toast');
                existingToasts.forEach(toast => toast.remove());
                
                const toast = document.createElement('div');
                toast.className = `toast ${type}`;
                toast.innerHTML = `
                    <i class="fas ${this.getToastIcon(type)}" style="margin-right: 10px;"></i>
                    ${message}
                `;
                
                document.body.appendChild(toast);
                
                // Auto hide after 4 seconds
                const autoHideTimer = setTimeout(() => {
                    if (toast.parentNode) {
                        toast.style.opacity = '0';
                        setTimeout(() => {
                            if (toast.parentNode) {
                                toast.remove();
                            }
                        }, 300);
                    }
                }, 4000);
                
                // Click to dismiss
                toast.addEventListener('click', () => {
                    clearTimeout(autoHideTimer);
                    toast.style.opacity = '0';
                    setTimeout(() => {
                        if (toast.parentNode) {
                            toast.remove();
                        }
                    }, 300);
                });
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

        // ✅ REALISTIC BUTTON FUNCTIONS WITH PROPER FEEDBACK
        function startEvaluating(eventId) {
            const event = assignedEvents.events.find(e => e.id === eventId);
            assignedEvents.showToast(`🚀 Starting evaluation process for ${event.title}...`, 'info');
            assignedEvents.showLoader();
            
            setTimeout(() => {
                assignedEvents.completeLoader();
                assignedEvents.showToast('🎯 Redirecting to evaluation interface...', 'success');
                setTimeout(() => {
                    window.location.href = 'evaluation.html';
                }, 1000);
            }, 1500);
        }

        function viewProjects(eventId) {
            const event = assignedEvents.events.find(e => e.id === eventId);
            assignedEvents.showToast(`📋 Loading ${event.projects} projects from ${event.title}...`, 'info');
            assignedEvents.showLoader();
            
            setTimeout(() => {
                assignedEvents.completeLoader();
                assignedEvents.showToast('🎨 Opening project gallery interface...', 'success');
                setTimeout(() => {
                    window.location.href = 'project-gallery.html';
                }, 1000);
            }, 1200);
        }

        function viewEventDetails(eventId) {
            assignedEvents.openEventDetails(eventId);
        }

        function setReminder(eventId) {
            const event = assignedEvents.events.find(e => e.id === eventId);
            assignedEvents.showLoader();
            
            setTimeout(() => {
                assignedEvents.completeLoader();
                assignedEvents.showToast(`⏰ Reminder set for ${event.title} - You'll be notified 24 hours before the event starts!`, 'success');
            }, 800);
        }

        function viewResults(eventId) {
            const event = assignedEvents.events.find(e => e.id === eventId);
            assignedEvents.showToast(`🏆 Loading evaluation results for ${event.title}...`, 'info');
            assignedEvents.showLoader();
            
            setTimeout(() => {
                assignedEvents.completeLoader();
                assignedEvents.showToast('📊 Results dashboard ready! Viewing comprehensive analytics...', 'success');
            }, 1500);
        }

        function downloadReport(eventId) {
            const event = assignedEvents.events.find(e => e.id === eventId);
            assignedEvents.showToast(`📄 Generating comprehensive evaluation report for ${event.title}...`, 'info');
            assignedEvents.showLoader();
            
            setTimeout(() => {
                // Simulate CSV download
                const csvContent = `Event Report - ${event.title}\nParticipants,${event.participants}\nProjects,${event.projects}\nEvaluated,${event.evaluated}\nStatus,${event.status}\nPrize,${event.prize}`;
                const blob = new Blob([csvContent], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${event.title.replace(/\s+/g, '_')}_Report.csv`;
                a.click();
                URL.revokeObjectURL(url);
                
                assignedEvents.completeLoader();
                assignedEvents.showToast('📥 Event report downloaded successfully! Check your downloads folder.', 'success');
            }, 2000);
        }

        function clearFilters() {
            document.getElementById('statusFilter').value = 'all';
            document.getElementById('categoryFilter').value = 'all';
            document.getElementById('searchInput').value = '';
            assignedEvents.filterEvents();
            assignedEvents.showToast('🔄 All filters cleared successfully!', 'success');
        }

        function backToDashboard() {
            assignedEvents.showToast('🏠 Returning to judge dashboard...', 'info');
            assignedEvents.showLoader();
            
            setTimeout(() => {
                assignedEvents.completeLoader();
                window.location.href = 'dashboard.html';
            }, 1000);
        }

        function filterEvents() {
            assignedEvents.filterEvents();
        }

        // Initialize the application
        document.addEventListener('DOMContentLoaded', () => {
            assignedEvents = new AssignedEvents();
            
            // Enhanced keyboard shortcuts
            console.log(`
🎯 NexusHack Assigned Events - Keyboard Shortcuts:
• Escape : Close modals/overlays
• Ctrl + T : Toggle theme
• Ctrl + R : Refresh events data
• Ctrl + F : Focus search
            `);
            
            // Keyboard shortcuts
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    assignedEvents.closeMobileSidebar();
                    const modals = document.querySelectorAll('.modal, .event-modal');
                    modals.forEach(modal => modal.remove());
                }
                if (e.ctrlKey) {
                    switch(e.key) {
                        case 'f':
                            e.preventDefault();
                            document.getElementById('searchInput').focus();
                            break;
                        case 'r':
                            e.preventDefault();
                            assignedEvents.showToast('🔄 Refreshing events data...', 'info');
                            assignedEvents.loadEventsData();
                            assignedEvents.renderEvents();
                            break;
                    }
                }
            });
            
            // Performance optimization for mobile devices
            if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                document.body.classList.add('mobile-device');
            }
            
            // Welcome message
            setTimeout(() => {
                assignedEvents.showToast('📅 Assigned Events loaded successfully! All toast notifications now positioned below the header to avoid search bar overlap.', 'success');
            }, 2000);
        });