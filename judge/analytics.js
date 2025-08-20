// ADVANCED ANALYTICS DASHBOARD SYSTEM
        class AnalyticsDashboard {
            constructor() {
                this.charts = {};
                this.data = {};
                this.filters = {
                    timePeriod: 'month',
                    event: 'all',
                    category: 'all'
                };
                this.isMobile = window.innerWidth <= 1024;
                this.currentUser = { name: 'Dr. Jane Smith', initials: 'JS', role: 'Senior Judge', id: 'judge_001' };
                this.init();
            }

            init() {
                this.initializeTheme();
                this.setupEventListeners();
                this.loadAnalyticsData();
                this.initializeCharts();
                this.renderLeaderboard();
                this.renderActivityFeed();
                this.initializeUser();
                this.handleResize();
            }

            initializeTheme() {
                const savedTheme = localStorage.getItem('theme') || 'dark';
                document.documentElement.setAttribute('data-theme', savedTheme);
                const themeToggle = document.getElementById('themeToggle');
                themeToggle.querySelector('i').className = savedTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
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
                
                // Filter listeners
                document.getElementById('timePeriodFilter').addEventListener('change', (e) => {
                    this.filters.timePeriod = e.target.value;
                    this.updateAnalytics();
                });
                
                document.getElementById('eventFilter').addEventListener('change', (e) => {
                    this.filters.event = e.target.value;
                    this.updateAnalytics();
                });
                
                document.getElementById('categoryFilter').addEventListener('change', (e) => {
                    this.filters.category = e.target.value;
                    this.updateAnalytics();
                });

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
                
                // Resize charts
                Object.values(this.charts).forEach(chart => {
                    if (chart) chart.resize();
                });
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

            loadAnalyticsData() {
                // Generate mock analytics data
                this.data = {
                    evaluations: {
                        total: 127,
                        trend: 15,
                        weekly: [18, 22, 25, 19, 28, 24, 21],
                        monthly: [89, 95, 103, 112, 127],
                        labels: {
                            weekly: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                            monthly: ['Jan', 'Feb', 'Mar', 'Apr', 'May']
                        }
                    },
                    scores: {
                        average: 8.6,
                        distribution: [5, 12, 25, 35, 28, 18, 12, 8, 3, 1],
                        categories: {
                            innovation: 8.8,
                            technical: 8.4,
                            design: 8.7,
                            business: 8.2,
                            presentation: 8.9
                        }
                    },
                    feedback: {
                        total: 89,
                        trend: 22,
                        quality: 4.7
                    },
                    time: {
                        average: 34,
                        trend: -5
                    }
                };
            }

            initializeCharts() {
                this.createEvaluationTrendsChart();
                this.createScoreDistributionChart();
            }

            createEvaluationTrendsChart() {
                const ctx = document.getElementById('evaluationTrendsChart').getContext('2d');
                const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
                
                this.charts.evaluationTrends = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: this.data.evaluations.labels.weekly,
                        datasets: [{
                            label: 'Evaluations',
                            data: this.data.evaluations.weekly,
                            borderColor: '#3b82f6',
                            backgroundColor: 'rgba(59, 130, 246, 0.1)',
                            borderWidth: 3,
                            fill: true,
                            tension: 0.4,
                            pointBackgroundColor: '#3b82f6',
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

            createScoreDistributionChart() {
                const ctx = document.getElementById('scoreDistributionChart').getContext('2d');
                const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
                
                this.charts.scoreDistribution = new Chart(ctx, {
                    type: 'doughnut',
                    data: {
                        labels: ['1-2', '2-3', '3-4', '4-5', '5-6', '6-7', '7-8', '8-9', '9-10'],
                        datasets: [{
                            data: this.data.scores.distribution,
                            backgroundColor: [
                                '#ef4444', '#f97316', '#f59e0b', '#eab308',
                                '#84cc16', '#22c55e', '#10b981', '#06b6d4', '#3b82f6'
                            ],
                            borderWidth: 2,
                            borderColor: isDark ? '#1a1a2e' : '#ffffff'
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                position: 'bottom',
                                labels: {
                                    color: isDark ? '#e2e8f0' : '#64748b',
                                    font: {
                                        size: 12
                                    },
                                    padding: 15
                                }
                            }
                        }
                    }
                });
            }

            updateChartTheme(theme) {
                const isDark = theme === 'dark';
                const textColor = isDark ? '#e2e8f0' : '#64748b';
                const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
                const borderColor = isDark ? '#1a1a2e' : '#ffffff';

                // Update evaluation trends chart
                if (this.charts.evaluationTrends) {
                    this.charts.evaluationTrends.options.scales.y.grid.color = gridColor;
                    this.charts.evaluationTrends.options.scales.x.grid.color = gridColor;
                    this.charts.evaluationTrends.options.scales.y.ticks.color = textColor;
                    this.charts.evaluationTrends.options.scales.x.ticks.color = textColor;
                    this.charts.evaluationTrends.update();
                }

                // Update score distribution chart
                if (this.charts.scoreDistribution) {
                    this.charts.scoreDistribution.data.datasets[0].borderColor = borderColor;
                    this.charts.scoreDistribution.options.plugins.legend.labels.color = textColor;
                    this.charts.scoreDistribution.update();
                }
            }

            renderLeaderboard() {
                const container = document.getElementById('topProjectsList');
                const projects = [
                    { rank: 1, name: 'DeFi Portfolio Tracker', team: 'Blockchain Innovators', score: 9.2, avatar: 'DP' },
                    { rank: 2, name: 'AI Healthcare Assistant', team: 'MedTech Solutions', score: 8.9, avatar: 'AH' },
                    { rank: 3, name: 'Smart City Dashboard', team: 'Urban Tech', score: 8.7, avatar: 'SC' },
                    { rank: 4, name: 'Green Energy Monitor', team: 'EcoTech', score: 8.5, avatar: 'GE' },
                    { rank: 5, name: 'Social Impact Platform', team: 'Change Makers', score: 8.3, avatar: 'SI' }
                ];

                container.innerHTML = '';
                projects.forEach(project => {
                    const item = document.createElement('div');
                    item.className = 'leaderboard-item';
                    item.innerHTML = `
                        <div class="leaderboard-rank ${project.rank <= 3 ? 'top' : ''}">${project.rank}</div>
                        <div class="leaderboard-avatar">${project.avatar}</div>
                        <div class="leaderboard-details">
                            <div class="leaderboard-name">${project.name}</div>
                            <div class="leaderboard-stats">${project.team}</div>
                        </div>
                        <div class="leaderboard-score">${project.score}</div>
                    `;
                    container.appendChild(item);
                });
            }

            renderActivityFeed() {
                const container = document.getElementById('activityList');
                const activities = [
                    { type: 'evaluation', text: 'Completed evaluation for DeFi Portfolio Tracker', time: '5 minutes ago' },
                    { type: 'score', text: 'Scored Technical Implementation: 9.2/10', time: '12 minutes ago' },
                    { type: 'feedback', text: 'Provided feedback for AI Healthcare Assistant', time: '25 minutes ago' },
                    { type: 'review', text: 'Reviewed code architecture for Smart City Dashboard', time: '1 hour ago' },
                    { type: 'evaluation', text: 'Started evaluation for Green Energy Monitor', time: '2 hours ago' },
                    { type: 'score', text: 'Scored Innovation criteria: 8.8/10', time: '3 hours ago' },
                    { type: 'feedback', text: 'Submitted comprehensive feedback report', time: '4 hours ago' }
                ];

                container.innerHTML = '';
                activities.forEach(activity => {
                    const item = document.createElement('div');
                    item.className = 'activity-item';
                    item.innerHTML = `
                        <div class="activity-icon ${activity.type}">
                            <i class="fas ${this.getActivityIcon(activity.type)}"></i>
                        </div>
                        <div class="activity-details">
                            <div class="activity-text">${activity.text}</div>
                            <div class="activity-time">${activity.time}</div>
                        </div>
                    `;
                    container.appendChild(item);
                });
            }

            getActivityIcon(type) {
                const icons = {
                    evaluation: 'fa-clipboard-check',
                    score: 'fa-star',
                    feedback: 'fa-comment-alt',
                    review: 'fa-code'
                };
                return icons[type] || 'fa-circle';
            }

            updateAnalytics() {
                // Simulate data update based on filters
                this.showToast('Analytics updated with new filters', 'info');
                
                // Update charts with new data
                if (this.charts.evaluationTrends) {
                    this.charts.evaluationTrends.update();
                }
                
                if (this.charts.scoreDistribution) {
                    this.charts.scoreDistribution.update();
                }
            }

            refreshData() {
                this.showToast('Refreshing analytics data...', 'info');
                
                // Simulate data refresh
                setTimeout(() => {
                    this.loadAnalyticsData();
                    this.updateAnalytics();
                    this.renderLeaderboard();
                    this.renderActivityFeed();
                    this.showToast('Analytics data refreshed successfully!', 'success');
                }, 2000);
            }

            exportReport() {
                const reportData = {
                    summary: {
                        totalEvaluations: this.data.evaluations.total,
                        averageScore: this.data.scores.average,
                        totalFeedback: this.data.feedback.total,
                        averageTime: this.data.time.average
                    },
                    filters: this.filters,
                    exportedBy: this.currentUser.name,
                    exportedAt: new Date().toISOString()
                };

                const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `analytics-report-${new Date().toISOString().split('T')[0]}.json`;
                a.click();
                URL.revokeObjectURL(url);
                
                this.showToast('Analytics report exported successfully!', 'success');
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
        let analyticsDashboard;

        function switchChart(chartType, period) {
            // Update chart period
            document.querySelectorAll('.chart-btn').forEach(btn => btn.classList.remove('active'));
            event.target.classList.add('active');
            analyticsDashboard.showToast(`Switched to ${period} view`, 'info');
        }

        function refreshScoreChart() {
            if (analyticsDashboard.charts.scoreDistribution) {
                analyticsDashboard.charts.scoreDistribution.update();
                analyticsDashboard.showToast('Score distribution updated', 'success');
            }
        }

        function viewFullLeaderboard() { analyticsDashboard.showToast('Opening full leaderboard...', 'info'); }
        function viewAllActivity() { analyticsDashboard.showToast('Opening activity history...', 'info'); }
        function exportReport() { analyticsDashboard.exportReport(); }
        function refreshData() { analyticsDashboard.refreshData(); }
        function backToDashboard() { window.location.href = 'dashboard.html'; }

        document.addEventListener('DOMContentLoaded', () => {
            analyticsDashboard = new AnalyticsDashboard();
            
            // Add entrance animations
            setTimeout(() => {
                document.querySelectorAll('.metric-card').forEach((card, index) => {
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

            // Chart container animations
            setTimeout(() => {
                document.querySelectorAll('.chart-card').forEach((card, index) => {
                    setTimeout(() => {
                        card.style.opacity = '0';
                        card.style.transform = 'scale(0.95)';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, 150);
                    }, index * 200);
                });
            }, 1000);

            // Performance optimization for mobile
            if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                document.body.classList.add('mobile-device');
                const style = document.createElement('style');
                style.textContent = `.mobile-device * { animation-duration: 0.1s !important; transition-duration: 0.1s !important; }`;
                document.head.appendChild(style);
            }
        });

        // Animations
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
            .metric-card, .chart-card, .leaderboard-item, .activity-item { transition: var(--transition) !important; }
            @media (hover: hover) and (pointer: fine) {
                .metric-card:hover { transform: translateY(-6px) !important; }
                .leaderboard-item:hover { transform: translateX(4px) !important; }
                .activity-item:hover { transform: translateX(2px) !important; }
            }
            *:focus-visible { outline: 2px solid var(--primary) !important; outline-offset: 2px !important; }
        `;
        document.head.appendChild(style);
