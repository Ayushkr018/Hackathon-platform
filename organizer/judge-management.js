  class ModernJudgeManager {
            constructor() {
                this.judges = [];
                this.evaluations = [];
                this.queueItems = [];
                this.chart = null;
                this.isMobile = window.innerWidth <= 1024;
                this.currentUser = { name: 'Alex Chen', initials: 'AC', role: 'Lead Organizer', id: 'org_001' };
                this.init();
            }

            init() {
                this.initializeTheme();
                this.setupEventListeners();
                this.loadJudges();
                this.loadEvaluationQueue();
                this.renderJudges();
                this.renderQueue();
                this.initializeChart();
                this.initializeUser();
                this.handleResize();
                this.startLiveUpdates();
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

            loadJudges() {
                // Generate mock judge data
                this.judges = [
                    {
                        id: 1,
                        name: 'Dr. Sarah Mitchell',
                        title: 'Senior Principal Engineer',
                        company: 'Google AI',
                        avatar: 'SM',
                        status: 'available',
                        expertise: ['AI/ML', 'Deep Learning', 'Computer Vision', 'Python'],
                        projectsAssigned: 12,
                        evaluationsCompleted: 8,
                        avgScore: 4.7,
                        email: 'sarah.mitchell@google.com',
                        experience: '15+ years',
                        rating: 4.9
                    },
                    {
                        id: 2,
                        name: 'Prof. Michael Chen',
                        title: 'Blockchain Research Director',
                        company: 'MIT Labs',
                        avatar: 'MC',
                        status: 'busy',
                        expertise: ['Blockchain', 'Smart Contracts', 'DeFi', 'Solidity'],
                        projectsAssigned: 10,
                        evaluationsCompleted: 9,
                        avgScore: 4.8,
                        email: 'mchen@mit.edu',
                        experience: '12+ years',
                        rating: 4.8
                    },
                    {
                        id: 3,
                        name: 'Emma Rodriguez',
                        title: 'VP of Engineering',
                        company: 'Meta',
                        avatar: 'ER',
                        status: 'available',
                        expertise: ['Mobile Dev', 'React Native', 'iOS', 'Android'],
                        projectsAssigned: 15,
                        evaluationsCompleted: 12,
                        avgScore: 4.6,
                        email: 'emma.r@meta.com',
                        experience: '10+ years',
                        rating: 4.7
                    },
                    {
                        id: 4,
                        name: 'Dr. James Wilson',
                        title: 'Chief Technology Officer',
                        company: 'Tesla',
                        avatar: 'JW',
                        status: 'available',
                        expertise: ['IoT', 'Hardware', 'Embedded Systems', 'C++'],
                        projectsAssigned: 8,
                        evaluationsCompleted: 6,
                        avgScore: 4.9,
                        email: 'j.wilson@tesla.com',
                        experience: '18+ years',
                        rating: 4.8
                    },
                    {
                        id: 5,
                        name: 'Lisa Park',
                        title: 'Senior Data Scientist',
                        company: 'OpenAI',
                        avatar: 'LP',
                        status: 'busy',
                        expertise: ['Data Science', 'NLP', 'Machine Learning', 'Statistics'],
                        projectsAssigned: 11,
                        evaluationsCompleted: 7,
                        avgScore: 4.8,
                        email: 'lisa.park@openai.com',
                        experience: '8+ years',
                        rating: 4.9
                    }
                ];
            }

            loadEvaluationQueue() {
                this.queueItems = [
                    { id: 1, title: 'AI Health Predictor - Team Alpha', type: 'priority', info: 'Assigned to Dr. Sarah Mitchell' },
                    { id: 2, title: 'DeFi Lending Platform - Team Beta', type: 'normal', info: 'Assigned to Prof. Michael Chen' },
                    { id: 3, title: 'Climate Tracker App - Team Gamma', type: 'completed', info: 'Evaluated by Emma Rodriguez' },
                    { id: 4, title: 'IoT Smart Home - Team Delta', type: 'priority', info: 'Assigned to Dr. James Wilson' },
                    { id: 5, title: 'NLP Chatbot - Team Epsilon', type: 'normal', info: 'Assigned to Lisa Park' },
                    { id: 6, title: 'Blockchain Voting - Team Zeta', type: 'completed', info: 'Evaluated by Prof. Michael Chen' }
                ];
            }

            renderJudges() {
                const container = document.getElementById('judgesList');
                container.innerHTML = '';

                this.judges.forEach((judge, index) => {
                    const judgeDiv = document.createElement('div');
                    judgeDiv.className = 'judge-card';
                    judgeDiv.style.opacity = '0';
                    judgeDiv.style.transform = 'translateY(20px)';
                    judgeDiv.innerHTML = `
                        <div class="judge-header-card">
                            <div class="judge-avatar">${judge.avatar}</div>
                            <div class="judge-info">
                                <div class="judge-name">${judge.name}</div>
                                <div class="judge-title-text">${judge.title}</div>
                                <div class="judge-company">${judge.company}</div>
                            </div>
                            <div class="judge-status ${judge.status}">${this.capitalizeFirst(judge.status)}</div>
                        </div>
                        
                        <div class="judge-details">
                            <div class="judge-detail">
                                <div class="judge-detail-value">${judge.projectsAssigned}</div>
                                <div class="judge-detail-label">Projects Assigned</div>
                            </div>
                            <div class="judge-detail">
                                <div class="judge-detail-value">${judge.evaluationsCompleted}</div>
                                <div class="judge-detail-label">Completed</div>
                            </div>
                            <div class="judge-detail">
                                <div class="judge-detail-value">${judge.avgScore}</div>
                                <div class="judge-detail-label">Avg Score</div>
                            </div>
                        </div>
                        
                        <div class="judge-expertise">
                            <div class="expertise-title">Expertise Areas</div>
                            <div class="expertise-tags">
                                ${judge.expertise.map(skill => `<span class="expertise-tag">${skill}</span>`).join('')}
                            </div>
                        </div>
                        
                        <div class="judge-actions">
                            <button class="btn btn-small btn-secondary" onclick="messageJudge(${judge.id})">
                                <i class="fas fa-envelope"></i>
                                Message
                            </button>
                            <button class="btn btn-small btn-primary" onclick="assignProjects(${judge.id})">
                                <i class="fas fa-tasks"></i>
                                Assign
                            </button>
                            <button class="btn btn-small btn-success" onclick="viewProfile(${judge.id})">
                                <i class="fas fa-user"></i>
                                Profile
                            </button>
                        </div>
                    `;
                    container.appendChild(judgeDiv);

                    // Animate in
                    setTimeout(() => {
                        judgeDiv.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                        judgeDiv.style.opacity = '1';
                        judgeDiv.style.transform = 'translateY(0)';
                    }, index * 150);
                });
            }

            renderQueue() {
                const container = document.getElementById('queueList');
                container.innerHTML = '';

                this.queueItems.forEach((item, index) => {
                    const queueDiv = document.createElement('div');
                    queueDiv.className = `queue-item ${item.type}`;
                    queueDiv.style.opacity = '0';
                    queueDiv.style.transform = 'translateX(20px)';
                    queueDiv.innerHTML = `
                        <div class="queue-icon ${item.type}">
                            <i class="fas ${this.getQueueIcon(item.type)}"></i>
                        </div>
                        <div class="queue-details">
                            <div class="queue-title">${item.title}</div>
                            <div class="queue-info">${item.info}</div>
                        </div>
                    `;
                    container.appendChild(queueDiv);

                    // Animate in
                    setTimeout(() => {
                        queueDiv.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                        queueDiv.style.opacity = '1';
                        queueDiv.style.transform = 'translateX(0)';
                    }, index * 100);
                });
            }

            getQueueIcon(type) {
                const icons = {
                    priority: 'fa-exclamation-circle',
                    normal: 'fa-clock',
                    completed: 'fa-check-circle'
                };
                return icons[type] || 'fa-circle';
            }

            initializeChart() {
                const ctx = document.getElementById('evaluationChart').getContext('2d');
                const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
                
                // Evaluation progress data
                const evaluationData = [15, 23, 35, 48, 62, 75, 89];
                
                this.chart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                        datasets: [{
                            label: 'Evaluations Completed',
                            data: evaluationData,
                            borderColor: '#f59e0b',
                            backgroundColor: 'rgba(245, 158, 11, 0.1)',
                            borderWidth: 3,
                            fill: true,
                            tension: 0.4,
                            pointBackgroundColor: '#f59e0b',
                            pointBorderColor: '#ffffff',
                            pointBorderWidth: 2,
                            pointRadius: 6,
                            pointHoverRadius: 8
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                display: false
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

            updateChartTheme(theme) {
                if (!this.chart) return;
                
                const isDark = theme === 'dark';
                const textColor = isDark ? '#e2e8f0' : '#64748b';
                const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

                this.chart.options.scales.y.grid.color = gridColor;
                this.chart.options.scales.x.grid.color = gridColor;
                this.chart.options.scales.y.ticks.color = textColor;
                this.chart.options.scales.x.ticks.color = textColor;
                this.chart.update();
            }

            startLiveUpdates() {
                // Simulate live updates
                setInterval(() => {
                    this.updateLiveStats();
                    this.addRandomQueueItem();
                }, 30000); // Update every 30 seconds
            }

            updateLiveStats() {
                // Simulate stat changes
                const changes = {
                    totalEvaluations: Math.random() > 0.7 ? Math.floor(Math.random() * 3) + 1 : 0,
                    pendingEvaluations: Math.random() > 0.8 ? -Math.floor(Math.random() * 2) - 1 : 0
                };

                Object.entries(changes).forEach(([key, change]) => {
                    if (change !== 0) {
                        const element = document.getElementById(key);
                        if (element) {
                            const currentValue = parseInt(element.textContent.replace(/,/g, ''));
                            const newValue = Math.max(0, currentValue + change);
                            element.textContent = newValue.toLocaleString();
                            this.animateStatChange(element);
                        }
                    }
                });
            }

            addRandomQueueItem() {
                const randomItems = [
                    { title: 'Sustainability Tracker - Team Omega', type: 'priority', info: 'Assigned to Dr. Sarah Mitchell' },
                    { title: 'FinTech Mobile App - Team Sigma', type: 'normal', info: 'Assigned to Emma Rodriguez' },
                    { title: 'Smart Agriculture - Team Phi', type: 'completed', info: 'Evaluated by Dr. James Wilson' }
                ];

                if (Math.random() > 0.6) {
                    const newItem = randomItems[Math.floor(Math.random() * randomItems.length)];
                    newItem.id = Date.now();
                    this.queueItems.unshift(newItem);
                    this.queueItems = this.queueItems.slice(0, 6); // Keep only 6 latest
                    this.renderQueue();
                }
            }

            animateStatChange(element) {
                element.style.transform = 'scale(1.1)';
                element.style.filter = 'brightness(1.2)';
                setTimeout(() => {
                    element.style.transform = 'scale(1)';
                    element.style.filter = 'brightness(1)';
                }, 600);
            }

            initializeAnimations() {
                // Enhanced entrance animations
                setTimeout(() => {
                    document.querySelectorAll('.stat-card').forEach((card, index) => {
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
                return str.charAt(0).toUpperCase() + str.slice(1).replace('-', ' ');
            }

            // Filter Functions
            filterByStatus(status) {
                this.showToast(`Filtering judges by ${status} status...`, 'info');
            }

            openEvaluations() {
                this.showToast('Opening evaluation management dashboard...', 'info');
            }

            showPendingEvaluations() {
                this.showToast('Displaying pending evaluations...', 'info');
            }

            resolveConflicts() {
                this.showToast('Opening score conflict resolution panel...', 'info');
            }

            // Judge Actions
            messageJudge(id) {
                const judge = this.judges.find(j => j.id === id);
                if (judge) {
                    this.showToast(`Composing message to ${judge.name}...`, 'info');
                }
            }

            assignProjects(id) {
                const judge = this.judges.find(j => j.id === id);
                if (judge) {
                    this.showToast(`Opening project assignment for ${judge.name}...`, 'info');
                }
            }

            viewProfile(id) {
                const judge = this.judges.find(j => j.id === id);
                if (judge) {
                    this.showToast(`Opening detailed profile for ${judge.name}...`, 'info');
                }
            }

            // Header Actions
            openJudgePortal() {
                this.showToast('Opening judge evaluation portal...', 'info');
            }

            getAIEvaluation() {
                this.showToast('Generating AI-powered evaluation insights...', 'info');
                
                setTimeout(() => {
                    const insights = [
                        '🎯 Judge workload is well-balanced across expertise areas',
                        '📊 Evaluation consistency rate: 94% (Excellent)',
                        '⚡ Dr. Sarah Mitchell shows fastest evaluation turnaround',
                        '🏆 Average judge rating: 4.8/5.0 (Outstanding)',
                        '🤝 AI suggests pairing judges for complex projects'
                    ];
                    
                    const randomInsight = insights[Math.floor(Math.random() * insights.length)];
                    this.showToast(randomInsight, 'success');
                }, 2000);
            }

            generateReport() {
                this.showToast('Generating comprehensive evaluation report...', 'info');
                
                setTimeout(() => {
                    this.showToast('Evaluation analytics report generated successfully!', 'success');
                }, 3000);
            }

            sendJudgeMessage() {
                this.showToast('Opening broadcast message composer for judges...', 'info');
            }

            exportEvaluations() {
                this.showToast('Exporting evaluation results and analytics...', 'info');
                
                setTimeout(() => {
                    this.showToast('Evaluation data exported with judge insights!', 'success');
                }, 2500);
            }

            // Table Actions
            refreshJudges() {
                this.showToast('Refreshing judge panel data...', 'info');
                
                setTimeout(() => {
                    this.renderJudges();
                    this.showToast('Judge panel refreshed with latest status!', 'success');
                }, 1500);
            }

            inviteJudge() {
                this.showToast('Opening expert judge invitation system...', 'info');
            }

            // Quick Actions
            bulkAssign() {
                this.showToast('Opening bulk project assignment interface...', 'info');
            }

            evaluationCalendar() {
                this.showToast('Opening evaluation schedule coordinator...', 'info');
            }

            judgeTraining() {
                this.showToast('Starting judge training and criteria workshop...', 'info');
            }

            calibrationSession() {
                this.showToast('Initiating score calibration session...', 'info');
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
                    animation: slideInToast 0.3s ease-out; max-width: 400px;
                    box-shadow: var(--shadow-lg); background: var(--gradient-${type});
                `;
                
                if (window.innerWidth <= 768) {
                    toast.style.top = '1rem'; toast.style.right = '1rem';
                    toast.style.left = '1rem'; toast.style.maxWidth = 'none';
                }
                
                toast.innerHTML = `<i class="fas ${this.getToastIcon(type)}"></i><span style="margin-left: 0.5rem;">${message}</span>`;
                document.body.appendChild(toast);
                setTimeout(() => { if (toast.parentNode) toast.remove(); }, 5000);
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
        let modernJudgeManager;

        function filterByStatus(status) { modernJudgeManager.filterByStatus(status); }
        function openEvaluations() { modernJudgeManager.openEvaluations(); }
        function showPendingEvaluations() { modernJudgeManager.showPendingEvaluations(); }
        function resolveConflicts() { modernJudgeManager.resolveConflicts(); }
        function messageJudge(id) { modernJudgeManager.messageJudge(id); }
        function assignProjects(id) { modernJudgeManager.assignProjects(id); }
        function viewProfile(id) { modernJudgeManager.viewProfile(id); }
        function openJudgePortal() { modernJudgeManager.openJudgePortal(); }
        function getAIEvaluation() { modernJudgeManager.getAIEvaluation(); }
        function generateReport() { modernJudgeManager.generateReport(); }
        function sendJudgeMessage() { modernJudgeManager.sendJudgeMessage(); }
        function exportEvaluations() { modernJudgeManager.exportEvaluations(); }
        function refreshJudges() { modernJudgeManager.refreshJudges(); }
        function inviteJudge() { modernJudgeManager.inviteJudge(); }
        function bulkAssign() { modernJudgeManager.bulkAssign(); }
        function evaluationCalendar() { modernJudgeManager.evaluationCalendar(); }
        function judgeTraining() { modernJudgeManager.judgeTraining(); }
        function calibrationSession() { modernJudgeManager.calibrationSession(); }
        function backToDashboard() { modernJudgeManager.backToDashboard(); }

        document.addEventListener('DOMContentLoaded', () => {
            modernJudgeManager = new ModernJudgeManager();
            
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
                    name: modernJudgeManager.currentUser.name,
                    initials: modernJudgeManager.currentUser.initials,
                    role: modernJudgeManager.currentUser.role,
                    lastActive: Date.now()
                };
                localStorage.setItem('modernOrganizerSession', JSON.stringify(sessionData));
            }, 60000); // Save every minute
        });

         function logout() {
                if (confirm('Are you sure you want to logout?')) {
                    localStorage.removeItem('modernOrganizerSession');
                    modernJudgeManager.showToast('Logging out...', 'info');
                    setTimeout(() => {
                        window.location.href = '../auth/login.html';
                    }, 1000);
                }
            }

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
            .stat-card, .judge-card, .queue-item, .quick-action { transition: var(--transition) !important; }
            @media (hover: hover) and (pointer: fine) {
                .stat-card:hover { transform: translateY(-8px) scale(1.02) !important; }
                .judge-card:hover { transform: translateY(-6px) !important; }
                .queue-item:hover { transform: translateX(6px) !important; }
                .quick-action:hover { transform: translateY(-6px) scale(1.02) !important; }
            }
            *:focus-visible { outline: 2px solid var(--primary) !important; outline-offset: 2px !important; }
            
            /* Enhanced expertise tags */
            .expertise-tag {
                background: var(--bg-judge) !important;
                color: var(--warning) !important;
                border: 1px solid var(--border-judge) !important;
                transition: var(--transition) !important;
            }
            .expertise-tag:hover {
                transform: scale(1.05) !important;
                box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3) !important;
            }
            
            /* Judge status enhanced colors */
            .judge-status.available { 
                background: var(--gradient-success) !important;
                box-shadow: 0 4px 16px rgba(16, 185, 129, 0.3) !important;
            }
            .judge-status.busy { 
                background: var(--gradient-warning) !important;
                box-shadow: 0 4px 16px rgba(245, 158, 11, 0.3) !important;
            }
            .judge-status.offline { 
                background: var(--gradient-danger) !important;
                box-shadow: 0 4px 16px rgba(239, 68, 68, 0.3) !important;
            }
        `;
        document.head.appendChild(style);
