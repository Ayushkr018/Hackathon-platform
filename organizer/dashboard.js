 class ModernOrganizerDashboard {
            constructor() {
                this.eventData = {};
                this.timeline = [];
                this.stats = {};
                this.liveUpdates = true;
                this.isMobile = window.innerWidth <= 1024;
                this.currentUser = { name: 'Alex Chen', initials: 'AC', role: 'Lead Organizer', id: 'org_001' };
                this.currentEvent = {
                    id: 'hackathon_2025_web3',
                    name: 'Web3 Innovation Hackathon 2025',
                    status: 'live',
                    startDate: '2025-03-15',
                    endDate: '2025-03-17'
                };
                this.init();
            }

            init() {
                this.initializeTheme();
                this.setupEventListeners();
                this.loadEventData();
                this.renderTimeline();
                this.startLiveUpdates();
                this.initializeUser();
                this.handleResize();
                this.initializeAnimations();
            }

            initializeTheme() {
                const savedTheme = localStorage.getItem('theme') || 'dark';
                document.documentElement.setAttribute('data-theme', savedTheme);
                const themeToggle = document.getElementById('themeToggle');
                themeToggle.querySelector('i').className = savedTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
            }

            initializeUser() {
                const userSession = localStorage.getItem('modernOrganizerSession');
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
                
                // Live update interval
                setInterval(() => {
                    if (this.liveUpdates) {
                        this.updateLiveStats();
                    }
                }, 10000); // Update every 10 seconds

                this.setupTouchGestures();
            }

            setupTouchGestures() {
                let startX;
                document.addEventListener('touchstart', (e) => startX = e.touches[0].clientX);
                document.addEventListener('touchend', (e) => {
                    if (!startX) return;
                    const endX = e.changedTouches[0].clientX;
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

            loadEventData() {
                // Load live event statistics
                this.stats = {
                    participants: 1247,
                    submissions: 127,
                    judges: 15,
                    liveViewers: 2847,
                    checkedIn: 892,
                    teamsFormed: 312,
                    evaluationsComplete: 89,
                    pendingActions: 23
                };

                // Load timeline events
                this.timeline = [
                    { 
                        time: '09:00', 
                        title: 'Event Kickoff', 
                        description: 'Opening ceremony with 2,847 live viewers. Team formation begins.',
                        type: 'milestone'
                    },
                    { 
                        time: '10:30', 
                        title: 'AI Workshop Live', 
                        description: 'Technical workshop on AI integration with 400+ participants attending.',
                        type: 'activity'
                    },
                    { 
                        time: '12:00', 
                        title: 'Server Alert', 
                        description: 'High traffic detected - auto-scaling activated successfully.',
                        type: 'alert'
                    },
                    { 
                        time: '14:00', 
                        title: 'Hacking Period', 
                        description: 'Official coding period started. 312 teams actively building.',
                        type: 'milestone'
                    },
                    { 
                        time: '16:30', 
                        title: 'First Submissions', 
                        description: '127 projects submitted for initial review. Quality looks excellent.',
                        type: 'activity'
                    },
                    { 
                        time: '18:00', 
                        title: 'Judge Check-in', 
                        description: 'All 15 expert judges confirmed and ready for evaluation phase.',
                        type: 'milestone'
                    }
                ];
            }

            renderTimeline() {
                const container = document.getElementById('timelineList');
                container.innerHTML = '';

                this.timeline.forEach(item => {
                    const timelineDiv = document.createElement('div');
                    timelineDiv.className = `timeline-item ${item.type}`;
                    timelineDiv.innerHTML = `
                        <div class="timeline-time">${item.time}</div>
                        <div class="timeline-content">
                            <div class="timeline-title-item">${item.title}</div>
                            <div class="timeline-description">${item.description}</div>
                        </div>
                    `;
                    container.appendChild(timelineDiv);
                });
            }

            startLiveUpdates() {
                // Simulate live data updates
                setInterval(() => {
                    this.updateLiveStats();
                    this.addRandomTimelineEvent();
                }, 30000); // Update every 30 seconds
            }

            updateLiveStats() {
                // Simulate stat changes
                const changes = {
                    participants: Math.random() > 0.8 ? Math.floor(Math.random() * 3) + 1 : 0,
                    submissions: Math.random() > 0.9 ? Math.floor(Math.random() * 2) + 1 : 0,
                    liveViewers: Math.floor(Math.random() * 100) - 50, // Can go up or down
                    checkedIn: Math.random() > 0.7 ? Math.floor(Math.random() * 5) + 1 : 0,
                    teamsFormed: Math.random() > 0.9 ? Math.floor(Math.random() * 2) + 1 : 0,
                    evaluationsComplete: Math.random() > 0.8 ? Math.floor(Math.random() * 3) + 1 : 0
                };

                Object.entries(changes).forEach(([key, change]) => {
                    if (change !== 0) {
                        this.stats[key] = Math.max(0, this.stats[key] + change);
                        const element = document.getElementById(key === 'participants' ? 'totalParticipants' :
                                                              key === 'submissions' ? 'totalSubmissions' :
                                                              key === 'judges' ? 'totalJudges' :
                                                              key === 'liveViewers' ? 'liveViewers' :
                                                              key);
                        if (element) {
                            element.textContent = this.stats[key].toLocaleString();
                            this.animateStatChange(element);
                        }
                    }
                });
            }

            animateStatChange(element) {
                element.style.transform = 'scale(1.1)';
                element.style.filter = 'brightness(1.2)';
                setTimeout(() => {
                    element.style.transform = 'scale(1)';
                    element.style.filter = 'brightness(1)';
                }, 500);
            }

            addRandomTimelineEvent() {
                const randomEvents = [
                    { type: 'activity', title: 'New Submission', description: 'Fresh project submission received from Team Innovation' },
                    { type: 'milestone', title: 'Milestone Reached', description: '100+ teams have completed initial project setup' },
                    { type: 'activity', title: 'Judge Activity', description: 'Evaluation round completed by expert panel' },
                    { type: 'alert', title: 'System Update', description: 'Platform performance optimized for peak traffic' }
                ];

                if (Math.random() > 0.7) {
                    const newEvent = randomEvents[Math.floor(Math.random() * randomEvents.length)];
                    const now = new Date();
                    newEvent.time = now.toTimeString().slice(0, 5);
                    
                    this.timeline.unshift(newEvent);
                    this.timeline = this.timeline.slice(0, 6); // Keep only 6 latest
                    this.renderTimeline();
                }
            }

            initializeAnimations() {
                // Add entrance animations with delay
                setTimeout(() => {
                    document.querySelectorAll('.stat-card').forEach((card, index) => {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(30px)';
                        setTimeout(() => {
                            card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, index * 150);
                    });
                }, 300);

                setTimeout(() => {
                    document.querySelectorAll('.quick-action').forEach((action, index) => {
                        action.style.opacity = '0';
                        action.style.transform = 'translateX(30px)';
                        setTimeout(() => {
                            action.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                            action.style.opacity = '1';
                            action.style.transform = 'translateX(0)';
                        }, index * 100);
                    });
                }, 800);
            }

            // Navigation Functions
            openParticipants() { window.location.href = 'participant-dashboard.html'; }
            openSubmissions() { window.location.href = 'submission-review.html'; }
            openJudges() { window.location.href = 'judge-management.html'; }
            openLiveControl() { window.location.href = 'live-event-control.html'; }
            
            liveControl() { window.location.href = 'live-event-control.html'; }
            viewAnalytics() { window.location.href = 'analytics.html'; }
            broadcastMessage() { window.location.href = 'messaging-center.html'; }
            viewFullTimeline() { this.showToast('Opening complete event timeline...', 'info'); }

            showNotifications() {
                this.showToast('5 urgent notifications require attention', 'warning');
            }

            openHelp() {
                this.showToast('Opening organizer help center...', 'info');
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
                
                toast.innerHTML = `<i class="fas ${this.getToastIcon(type)}"></i><span style="margin-left: 0.5rem;">${message}</span>`;
                document.body.appendChild(toast);
                setTimeout(() => { if (toast.parentNode) toast.remove(); }, 4000);
            }

            getToastIcon(type) {
                const icons = {
                    success: 'fa-check-circle', error: 'fa-exclamation-circle',
                    info: 'fa-info-circle', warning: 'fa-exclamation-triangle'
                };
                return icons[type] || 'fa-check-circle';
            }
        }

        // Global functions and initialization
        let modernDashboard;

        function openParticipants() { modernDashboard.openParticipants(); }
        function openSubmissions() { modernDashboard.openSubmissions(); }
        function openJudges() { modernDashboard.openJudges(); }
        function openLiveControl() { modernDashboard.openLiveControl(); }
        function liveControl() { modernDashboard.liveControl(); }
        function viewAnalytics() { modernDashboard.viewAnalytics(); }
        function broadcastMessage() { modernDashboard.broadcastMessage(); }
        function showNotifications() { modernDashboard.showNotifications(); }
        function viewFullTimeline() { modernDashboard.viewFullTimeline(); }
        function openHelp() { modernDashboard.openHelp(); }

        document.addEventListener('DOMContentLoaded', () => {
            modernDashboard = new ModernOrganizerDashboard();
            
            // Performance optimization for mobile
            if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                document.body.classList.add('mobile-device');
                const style = document.createElement('style');
                style.textContent = `.mobile-device * { animation-duration: 0.2s !important; transition-duration: 0.2s !important; }`;
                document.head.appendChild(style);
            }

            // Auto-save user session
            setInterval(() => {
                const sessionData = {
                    name: modernDashboard.currentUser.name,
                    initials: modernDashboard.currentUser.initials,
                    role: modernDashboard.currentUser.role,
                    lastActive: Date.now()
                };
                localStorage.setItem('modernOrganizerSession', JSON.stringify(sessionData));
            }, 60000); // Save every minute
        });
        function logout() {
            if (confirm('Are you sure you want to logout?')) {
                localStorage.removeItem('modernOrganizerSession');
                modernDashboard.showToast('Logging out...', 'info');
                setTimeout(() => {
                    window.location.href = '../auth/login.html';
                }, 1000);
            }
        }
       
        // Animations and performance styles
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
            .stat-card, .quick-action, .timeline-item { transition: var(--transition) !important; }
            @media (hover: hover) and (pointer: fine) {
                .stat-card:hover { transform: translateY(-8px) !important; }
                .quick-action:hover { transform: translateY(-4px) !important; }
                .timeline-item:hover { transform: translateX(6px) !important; }
            }
            *:focus-visible { outline: 2px solid var(--primary) !important; outline-offset: 2px !important; }
        `;
         

        document.head.appendChild(style);
