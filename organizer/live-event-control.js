    class ModernLiveEventManager {
            constructor() {
                this.systemStatus = [];
                this.liveFeed = [];
                this.chart = null;
                this.totalViewers = 2847;
                this.activeParticipants = 1247;
                this.liveSubmissions = 89;
                this.activeIssues = 3;
                this.isLive = true;
                this.streamActive = true;
                this.isMobile = window.innerWidth <= 1024;
                this.currentUser = { name: 'Alex Chen', initials: 'AC', role: 'Lead Organizer', id: 'org_001' };
                this.init();
            }

            init() {
                this.initializeTheme();
                this.setupEventListeners();
                this.loadSystemStatus();
                this.loadLiveFeed();
                this.renderSystemStatus();
                this.renderLiveFeed();
                this.initializeChart();
                this.initializeUser();
                this.handleResize();
                this.startRealTimeUpdates();
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
                
                // Resize chart
                if (this.chart) this.chart.resize();
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
                
                // Update chart colors
                this.updateChartTheme(newTheme);
                this.showToast(`Theme changed to ${newTheme} mode`, 'success');
            }

            loadSystemStatus() {
                this.systemStatus = [
                    {
                        name: 'Live Stream Server',
                        status: 'online',
                        details: 'Broadcasting at 1080p, 2500 kbps',
                        uptime: '99.9%'
                    },
                    {
                        name: 'Database Cluster',
                        status: 'online',
                        details: 'All nodes operational',
                        uptime: '100%'
                    },
                    {
                        name: 'CDN Network',
                        status: 'warning',
                        details: 'High traffic load detected',
                        uptime: '98.7%'
                    },
                    {
                        name: 'Authentication Service',
                        status: 'online',
                        details: '1,247 active sessions',
                        uptime: '99.8%'
                    },
                    {
                        name: 'File Storage',
                        status: 'online',
                        details: '89% capacity, 127 new uploads',
                        uptime: '99.5%'
                    }
                ];
            }

            loadLiveFeed() {
                this.liveFeed = [
                    {
                        type: 'info',
                        title: 'New Team Registration',
                        details: 'AI Innovators team completed registration',
                        time: '2 min ago'
                    },
                    {
                        type: 'warning',
                        title: 'High Server Load',
                        details: 'Stream server at 85% capacity',
                        time: '5 min ago'
                    },
                    {
                        type: 'info',
                        title: 'Submission Received',
                        details: 'Blockchain Masters submitted project',
                        time: '8 min ago'
                    },
                    {
                        type: 'critical',
                        title: 'Technical Issue Reported',
                        details: 'Audio feedback in main auditorium',
                        time: '12 min ago'
                    },
                    {
                        type: 'info',
                        title: 'Judge Panel Connected',
                        details: 'All 15 judges are now online',
                        time: '15 min ago'
                    },
                    {
                        type: 'info',
                        title: 'Sponsor Booth Setup',
                        details: 'TechCorp completed virtual booth setup',
                        time: '18 min ago'
                    }
                ];
            }

            renderSystemStatus() {
                const container = document.getElementById('statusList');
                container.innerHTML = '';

                this.systemStatus.forEach((status, index) => {
                    const statusDiv = document.createElement('div');
                    statusDiv.className = 'status-item';
                    statusDiv.style.opacity = '0';
                    statusDiv.style.transform = 'translateY(20px)';
                    statusDiv.innerHTML = `
                        <div class="status-icon ${status.status}">
                            <i class="fas ${this.getStatusIcon(status.status)}"></i>
                        </div>
                        <div class="status-info">
                            <div class="status-name">${status.name}</div>
                            <div class="status-details">${status.details}</div>
                        </div>
                        <div class="status-badge ${status.status}">${this.capitalizeFirst(status.status)}</div>
                    `;
                    container.appendChild(statusDiv);

                    // Animate in
                    setTimeout(() => {
                        statusDiv.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                        statusDiv.style.opacity = '1';
                        statusDiv.style.transform = 'translateY(0)';
                    }, index * 100);
                });
            }

            renderLiveFeed() {
                const container = document.getElementById('liveFeedList');
                container.innerHTML = '';

                this.liveFeed.forEach((item, index) => {
                    const feedDiv = document.createElement('div');
                    feedDiv.className = `feed-item ${item.type}`;
                    feedDiv.style.opacity = '0';
                    feedDiv.style.transform = 'translateX(20px)';
                    feedDiv.innerHTML = `
                        <div class="feed-icon">
                            <i class="fas ${this.getFeedIcon(item.type)}"></i>
                        </div>
                        <div class="feed-content">
                            <div class="feed-title">${item.title}</div>
                            <div class="feed-details">${item.details}</div>
                            <div class="feed-time">${item.time}</div>
                        </div>
                    `;
                    container.appendChild(feedDiv);

                    // Animate in
                    setTimeout(() => {
                        feedDiv.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                        feedDiv.style.opacity = '1';
                        feedDiv.style.transform = 'translateX(0)';
                    }, index * 100);
                });
            }

            initializeChart() {
                const ctx = document.getElementById('participantChart').getContext('2d');
                const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
                
                // Real-time participant activity data
                const activityData = {
                    labels: ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'],
                    online: [890, 1020, 1150, 1247, 1180, 1220, 1247, 1200],
                    coding: [650, 780, 890, 950, 920, 980, 1020, 950],
                    submissions: [45, 67, 89, 102, 95, 115, 127, 120]
                };
                
                this.chart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: activityData.labels,
                        datasets: [
                            {
                                label: 'Online Participants',
                                data: activityData.online,
                                borderColor: '#ef4444',
                                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                borderWidth: 3,
                                fill: true,
                                tension: 0.4
                            },
                            {
                                label: 'Active Coding',
                                data: activityData.coding,
                                borderColor: '#10b981',
                                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                                borderWidth: 3,
                                fill: false,
                                tension: 0.4
                            },
                            {
                                label: 'Submissions',
                                data: activityData.submissions,
                                borderColor: '#3b82f6',
                                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                                borderWidth: 3,
                                fill: false,
                                tension: 0.4
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                display: true,
                                position: 'bottom',
                                labels: {
                                    color: isDark ? '#e2e8f0' : '#64748b',
                                    usePointStyle: true,
                                    padding: 15,
                                    font: { size: 11 }
                                }
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                grid: {
                                    color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                                },
                                ticks: {
                                    color: isDark ? '#e2e8f0' : '#64748b'
                                }
                            },
                            x: {
                                grid: {
                                    color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                                },
                                ticks: {
                                    color: isDark ? '#e2e8f0' : '#64748b'
                                }
                            }
                        }
                    }
                });
            }

            getStatusIcon(status) {
                const icons = {
                    online: 'fa-check-circle',
                    warning: 'fa-exclamation-triangle',
                    offline: 'fa-times-circle'
                };
                return icons[status] || 'fa-circle';
            }

            getFeedIcon(type) {
                const icons = {
                    info: 'fa-info-circle',
                    warning: 'fa-exclamation-triangle',
                    critical: 'fa-exclamation-circle'
                };
                return icons[type] || 'fa-circle';
            }

            updateChartTheme(theme) {
                if (!this.chart) return;
                
                const isDark = theme === 'dark';
                const textColor = isDark ? '#e2e8f0' : '#64748b';
                const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

                this.chart.options.scales.y.grid.color = gridColor;
                this.chart.options.scales.x.grid.color = gridColor;
                this.chart.options.scales.y.ticks.color = textColor;
                this.chart.options.scales.x.ticks.color = textColor;
                this.chart.options.plugins.legend.labels.color = textColor;
                this.chart.update();
            }

            startRealTimeUpdates() {
                setInterval(() => {
                    this.updateLiveStats();
                    this.addNewFeedItem();
                }, 15000); // Every 15 seconds
            }

            updateLiveStats() {
                // Simulate real-time viewer changes
                const viewerChange = Math.floor(Math.random() * 100) - 50;
                this.totalViewers = Math.max(2000, this.totalViewers + viewerChange);
                document.getElementById('totalViewers').textContent = this.totalViewers.toLocaleString();
                document.getElementById('viewerCount').textContent = this.totalViewers.toLocaleString();

                // Update participants
                const participantChange = Math.floor(Math.random() * 20) - 10;
                this.activeParticipants = Math.max(1200, this.activeParticipants + participantChange);
                document.getElementById('activeParticipants').textContent = this.activeParticipants.toLocaleString();

                // Update submissions
                if (Math.random() > 0.7) {
                    this.liveSubmissions += Math.floor(Math.random() * 3) + 1;
                    document.getElementById('liveSubmissions').textContent = this.liveSubmissions.toString();
                }
            }

            addNewFeedItem() {
                if (Math.random() > 0.6) {
                    const feedTypes = ['info', 'warning'];
                    const feedTitles = [
                        'New Team Joined',
                        'System Update',
                        'Submission Received',
                        'Judge Activity',
                        'Network Status',
                        'User Login Spike'
                    ];
                    const feedDetails = [
                        'Another team has entered the competition',
                        'Automatic system maintenance completed',
                        'Project submission from active team',
                        'Judge panel reviewing submissions',
                        'Network performance optimized',
                        'High volume of concurrent logins'
                    ];

                    const newItem = {
                        type: feedTypes[Math.floor(Math.random() * feedTypes.length)],
                        title: feedTitles[Math.floor(Math.random() * feedTitles.length)],
                        details: feedDetails[Math.floor(Math.random() * feedDetails.length)],
                        time: 'Just now'
                    };

                    this.liveFeed.unshift(newItem);
                    this.liveFeed = this.liveFeed.slice(0, 8); // Keep only 8 latest
                    this.renderLiveFeed();
                }
            }

            initializeAnimations() {
                // Enhanced entrance animations
                setTimeout(() => {
                    document.querySelectorAll('.live-stat-card').forEach((card, index) => {
                        setTimeout(() => {
                            card.style.opacity = '0';
                            card.style.transform = 'translateY(30px) scale(0.95)';
                            setTimeout(() => {
                                card.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                                card.style.opacity = '1';
                                card.style.transform = 'translateY(0) scale(1)';
                            }, 100);
                        }, index * 150);
                    });
                }, 500);
            }

            capitalizeFirst(str) {
                return str.charAt(0).toUpperCase() + str.slice(1);
            }

            // Live Stats Functions
            viewLiveViewers() {
                this.showToast('Opening live viewer analytics...', 'info');
            }

            trackParticipants() {
                this.showToast('Opening participant tracking dashboard...', 'info');
            }

            monitorSubmissions() {
                this.showToast('Opening submission monitoring...', 'info');
            }

            handleIssues() {
                this.showToast('Opening issue management center...', 'info');
            }

            // Header Actions
            viewAnalytics() {
                this.showToast('Loading comprehensive live analytics...', 'info');
            }

            startEvent() {
                this.showToast('🚀 Event officially started! All systems are live!', 'success');
            }

            // Topbar Actions
            goLive() {
                if (this.isLive) {
                    this.showToast('⚡ Already broadcasting live to 2,847 viewers!', 'info');
                } else {
                    this.isLive = true;
                    document.getElementById('liveStatus').innerHTML = `
                        <div class="live-dot"></div>
                        <span>LIVE</span>
                        <span class="viewer-count">${this.totalViewers.toLocaleString()}</span>
                    `;
                    this.showToast('📡 Live stream started successfully!', 'success');
                }
            }

            broadcastMessage() {
                this.showToast('📢 Broadcasting urgent message to all participants...', 'info');
                
                setTimeout(() => {
                    this.showToast('✅ Emergency broadcast sent to 1,247 participants!', 'success');
                }, 2500);
            }

            emergencyProtocol() {
                this.showToast('🚨 Emergency protocol activated! Alerting all personnel...', 'warning');
                
                setTimeout(() => {
                    this.showToast('⚠️ All emergency contacts notified. Response teams dispatched.', 'warning');
                }, 3000);
            }

            // Stream Control Functions
            openStreamSettings() {
                this.showToast('Opening advanced stream configuration...', 'info');
            }

            toggleMainStream() {
                this.streamActive = !this.streamActive;
                const status = this.streamActive ? 'activated' : 'deactivated';
                this.showToast(`Main stream ${status}`, this.streamActive ? 'success' : 'warning');
            }

            toggleAudio() {
                this.showToast('Audio settings toggled', 'info');
            }

            shareScreen() {
                this.showToast('Screen sharing initiated...', 'info');
            }

            recordStream() {
                this.showToast('🔴 Stream recording started', 'success');
            }

            // Emergency Functions
            pauseEvent() {
                this.showToast('⏸️ Event paused! All activities suspended.', 'warning');
            }

            evacuationProtocol() {
                this.showToast('🚨 EVACUATION ALERT SENT! Emergency services notified.', 'danger');
            }

            technicalSupport() {
                this.showToast('🔧 Technical support team alerted and responding...', 'info');
            }

            // Tracking Functions
            exportActivity() {
                this.showToast('Exporting real-time activity data...', 'info');
                
                setTimeout(() => {
                    this.showToast('📊 Activity report exported successfully!', 'success');
                }, 2000);
            }

            refreshTracking() {
                this.showToast('Refreshing participant tracking data...', 'info');
                
                setTimeout(() => {
                    this.updateLiveStats();
                    this.showToast('🔄 Tracking data refreshed with latest information!', 'success');
                }, 1500);
            }

            backToDashboard() {
                window.location.href = 'dashboard.html';
            }

            showToast(message, type = 'success') {
                const existingToast = document.querySelector('.toast');
                if (existingToast) existingToast.remove();
                
                const toast = document.createElement('div');
                toast.className = `toast ${type}`;
                toast.style.cssText = `
                    position: fixed; top: 2rem; right: 2rem; padding: 1rem 1.5rem;
                    border-radius: 12px; color: white; font-weight: 500; z-index: 10001;
                    animation: slideInToast 0.3s ease-out; max-width: 450px;
                    box-shadow: var(--shadow-lg); background: var(--gradient-${type});
                `;
                
                if (window.innerWidth <= 768) {
                    toast.style.top = '1rem'; toast.style.right = '1rem';
                    toast.style.left = '1rem'; toast.style.maxWidth = 'none';
                }
                
                toast.innerHTML = `<i class="fas ${this.getToastIcon(type)}"></i><span style="margin-left: 0.5rem;">${message}</span>`;
                document.body.appendChild(toast);
                setTimeout(() => { if (toast.parentNode) toast.remove(); }, 6000);
            }

            getToastIcon(type) {
                const icons = {
                    success: 'fa-check-circle', error: 'fa-exclamation-circle',
                    info: 'fa-info-circle', warning: 'fa-exclamation-triangle',
                    danger: 'fa-exclamation-triangle'
                };
                return icons[type] || 'fa-check-circle';
            }
        }

        // Global functions and initialization
        let modernLiveEventManager;

        function viewLiveViewers() { modernLiveEventManager.viewLiveViewers(); }
        function trackParticipants() { modernLiveEventManager.trackParticipants(); }
        function monitorSubmissions() { modernLiveEventManager.monitorSubmissions(); }
        function handleIssues() { modernLiveEventManager.handleIssues(); }
        function viewAnalytics() { modernLiveEventManager.viewAnalytics(); }
        function startEvent() { modernLiveEventManager.startEvent(); }
        function goLive() { modernLiveEventManager.goLive(); }
        function broadcastMessage() { modernLiveEventManager.broadcastMessage(); }
        function emergencyProtocol() { modernLiveEventManager.emergencyProtocol(); }
        function openStreamSettings() { modernLiveEventManager.openStreamSettings(); }
        function toggleMainStream() { modernLiveEventManager.toggleMainStream(); }
        function toggleAudio() { modernLiveEventManager.toggleAudio(); }
        function shareScreen() { modernLiveEventManager.shareScreen(); }
        function recordStream() { modernLiveEventManager.recordStream(); }
        function pauseEvent() { modernLiveEventManager.pauseEvent(); }
        function evacuationProtocol() { modernLiveEventManager.evacuationProtocol(); }
        function technicalSupport() { modernLiveEventManager.technicalSupport(); }
        function exportActivity() { modernLiveEventManager.exportActivity(); }
        function refreshTracking() { modernLiveEventManager.refreshTracking(); }
        function backToDashboard() { modernLiveEventManager.backToDashboard(); }

        document.addEventListener('DOMContentLoaded', () => {
            modernLiveEventManager = new ModernLiveEventManager();
            
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
                    name: modernLiveEventManager.currentUser.name,
                    initials: modernLiveEventManager.currentUser.initials,
                    role: modernLiveEventManager.currentUser.role,
                    lastActive: Date.now()
                };
                localStorage.setItem('modernOrganizerSession', JSON.stringify(sessionData));
            }, 60000);

            // Keyboard shortcuts for live event control
            document.addEventListener('keydown', (e) => {
                if (e.ctrlKey || e.metaKey) {
                    switch(e.key) {
                        case 'l':
                            e.preventDefault();
                            goLive();
                            break;
                        case 'b':
                            e.preventDefault();
                            broadcastMessage();
                            break;
                        case 'e':
                            e.preventDefault();
                            emergencyProtocol();
                            break;
                        case 'r':
                            e.preventDefault();
                            refreshTracking();
                            break;
                        case 'p':
                            e.preventDefault();
                            pauseEvent();
                            break;
                    }
                }
            });

            // Emergency hotkey
            document.addEventListener('keydown', (e) => {
                if (e.key === 'F12' && e.shiftKey) {
                    e.preventDefault();
                    emergencyProtocol();
                }
            });
        });

        // Enhanced animations and performance styles
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
            
            /* Enhanced live event animations */
            .live-stat-card, .status-item, .feed-item, .control-btn { transition: var(--transition) !important; }
            @media (hover: hover) and (pointer: fine) {
                .live-stat-card:hover { 
                    transform: translateY(-8px) scale(1.02) !important;
                    box-shadow: var(--shadow-lg) !important;
                }
                .status-item:hover { transform: translateY(-3px) !important; }
                .feed-item:hover { transform: translateX(6px) !important; }
                .control-btn:hover { transform: translateY(-4px) !important; }
            }
            
            /* Enhanced live status */
            .live-status {
                position: relative;
                overflow: hidden;
            }
            .live-status::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
                animation: liveStatusSweep 3s infinite;
            }
            
            @keyframes liveStatusSweep {
                0% { left: -100%; }
                100% { left: 100%; }
            }
            
            /* Enhanced emergency buttons */
            .emergency-btn {
                position: relative;
                overflow: hidden;
            }
            .emergency-btn::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
                transition: var(--transition-fast);
            }
            .emergency-btn:hover::before {
                left: 100%;
            }
            
            /* Enhanced stream preview */
            .stream-preview {
                position: relative;
                overflow: hidden;
            }
            .stream-preview::after {
                content: '';
                position: absolute;
                top: 10px;
                right: 10px;
                width: 12px;
                height: 12px;
                background: #ef4444;
                border-radius: 50%;
                animation: liveBroadcast 1s infinite;
            }
            
            /* Enhanced system status indicators */
            .status-item.online::before {
                content: '';
                position: absolute;
                left: 0;
                top: 0;
                bottom: 0;
                width: 3px;
                background: #10b981;
                animation: statusPulse 2s infinite;
            }
            
            @keyframes statusPulse {
                0%, 100% { opacity: 0.5; }
                50% { opacity: 1; }
            }
            
            /* Enhanced live feed animations */
            .feed-item.critical {
                animation: criticalAlert 2s infinite;
            }
            
            @keyframes criticalAlert {
                0%, 100% { border-left-color: #ef4444; }
                50% { border-left-color: #dc2626; }
            }
            
                        /* Performance optimizations */
            .stream-control, .monitoring-panel, .participant-tracking {
                contain: layout style paint;
            }
            
            /* Enhanced mobile live event grid */
            @media (max-width: 768px) {
                .live-grid {
                    grid-template-columns: 1fr !important;
                }
                .stream-control {
                    order: 1;
                }
                .monitoring-panel {
                    order: 2;
                }
            }
            
            /* Enhanced control buttons */
            .control-btn.active {
                position: relative;
                overflow: hidden;
            }
            .control-btn.active::after {
                content: '';
                position: absolute;
                top: -50%;
                left: -50%;
                width: 200%;
                height: 200%;
                background: linear-gradient(45deg, transparent, rgba(239, 68, 68, 0.1), transparent);
                transform: rotate(45deg) translateX(-100%);
                transition: var(--transition);
                animation: controlActive 2s infinite;
            }
            
            @keyframes controlActive {
                0% { transform: rotate(45deg) translateX(-100%); }
                100% { transform: rotate(45deg) translateX(100%); }
            }
            
            /* Enhanced viewer count animation */
            .viewer-count {
                position: relative;
                overflow: hidden;
            }
            .viewer-count::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(239, 68, 68, 0.2), transparent);
                animation: viewerUpdate 3s infinite;
            }
            
            @keyframes viewerUpdate {
                0% { left: -100%; }
                100% { left: 100%; }
            }
            
            /* Enhanced participant chart */
            #participantChart {
                transition: var(--transition);
            }
            #participantChart:hover {
                transform: scale(1.02);
            }
            
            /* Enhanced feed item types */
            .feed-item.warning::before {
                content: '';
                position: absolute;
                left: -4px;
                top: 0;
                bottom: 0;
                width: 4px;
                background: linear-gradient(to bottom, #f59e0b, transparent);
                animation: warningFlow 2s infinite;
            }
            
            @keyframes warningFlow {
                0% { opacity: 0.5; }
                50% { opacity: 1; }
                100% { opacity: 0.5; }
            }
            
            /* Real-time data indicators */
            .stat-value {
                position: relative;
            }
            .stat-value::after {
                content: '';
                position: absolute;
                top: 0;
                right: -20px;
                width: 8px;
                height: 8px;
                background: #10b981;
                border-radius: 50%;
                animation: dataUpdate 2s infinite;
            }
            
            @keyframes dataUpdate {
                0%, 100% { opacity: 0; transform: scale(0.8); }
                50% { opacity: 1; transform: scale(1.2); }
            }
            
            /* Enhanced emergency protocol styling */
            .action-btn.emergency {
                position: relative;
            }
            .action-btn.emergency::after {
                content: '';
                position: absolute;
                inset: -2px;
                background: conic-gradient(from 0deg, transparent, #dc2626, transparent);
                border-radius: inherit;
                z-index: -1;
                animation: emergencyRotate 2s linear infinite;
            }
            
            @keyframes emergencyRotate {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
            
            /* Enhanced stream quality indicator */
            .stream-settings .setting-value[readonly] {
                background: linear-gradient(145deg, var(--bg-glass), rgba(239, 68, 68, 0.05));
                color: var(--text-primary);
            }
            
            /* System monitoring enhancements */
            .status-item.warning {
                animation: warningPulse 3s infinite;
            }
            
            @keyframes warningPulse {
                0%, 100% { background: var(--bg-glass); }
                50% { background: rgba(245, 158, 11, 0.1); }
            }
            
            /* Live event command center styling */
            .live-header::after {
                content: 'COMMAND CENTER';
                position: absolute;
                top: 2rem;
                right: 2rem;
                font-size: 0.8rem;
                font-weight: 700;
                color: rgba(255, 255, 255, 0.3);
                letter-spacing: 2px;
                transform: rotate(-90deg);
                transform-origin: center;
            }
            
            /* Mobile emergency controls */
            @media (max-width: 768px) {
                .emergency-buttons {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 0.5rem;
                }
                .emergency-btn {
                    padding: 1rem 0.5rem;
                    font-size: 0.8rem;
                }
            }
            
            /* Enhanced loading states */
            .loading {
                position: relative;
                overflow: hidden;
            }
            .loading::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(239, 68, 68, 0.2), transparent);
                animation: loadingShimmer 1.5s infinite;
            }
            
            @keyframes loadingShimmer {
                0% { left: -100%; }
                100% { left: 100%; }
            }
            
            /* Touch feedback for mobile */
            @media (hover: none) {
                .control-btn:active {
                    transform: scale(0.95);
                    background: var(--bg-glass-hover);
                }
                .emergency-btn:active {
                    transform: scale(0.98);
                }
            }
        `;
        document.head.appendChild(style);