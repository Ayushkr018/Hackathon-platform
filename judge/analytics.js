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
                this.loadAnalyticsData();
                this.initializeCharts();
                this.renderLeaderboard();
                this.renderActivityFeed();
                this.initializeUser();
                this.handleResize();
            }

            // ✅ THEME COLOR COMBINATION
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
                // Sidebar and UI controls
                document.getElementById('sidebarToggle').addEventListener('click', () => this.toggleSidebar());
                document.getElementById('themeToggle').addEventListener('click', () => this.toggleTheme());
                document.getElementById('mobileOverlay').addEventListener('click', () => this.closeMobileSidebar());
                window.addEventListener('resize', () => this.handleResize());
                window.addEventListener('orientationchange', () => setTimeout(() => this.handleResize(), 100));

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
                
                // Update chart colors
                this.updateChartTheme(newTheme);
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

            loadAnalyticsData() {
                this.showLoader();
                
                setTimeout(() => {
                    // Generate comprehensive mock analytics data
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
                    
                    this.completeLoader();
                }, 1200);
            }

            initializeCharts() {
                setTimeout(() => {
                    this.createEvaluationTrendsChart();
                    this.createScoreDistributionChart();
                }, 1500);
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
                    item.onclick = () => this.showProjectDetails(project);
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
                    { type: 'feedback', text: 'Provided comprehensive feedback for AI Healthcare Assistant', time: '25 minutes ago' },
                    { type: 'review', text: 'Reviewed code architecture for Smart City Dashboard', time: '1 hour ago' },
                    { type: 'evaluation', text: 'Started evaluation for Green Energy Monitor', time: '2 hours ago' },
                    { type: 'score', text: 'Scored Innovation criteria: 8.8/10', time: '3 hours ago' },
                    { type: 'feedback', text: 'Submitted detailed feedback report with recommendations', time: '4 hours ago' }
                ];

                container.innerHTML = '';
                activities.forEach(activity => {
                    const item = document.createElement('div');
                    item.className = 'activity-item';
                    item.onclick = () => this.showActivityDetails(activity);
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
                this.showToast('📊 Analytics updated with new filters', 'info');
                this.showLoader();
                
                setTimeout(() => {
                    // Update charts with new data
                    if (this.charts.evaluationTrends) {
                        this.charts.evaluationTrends.update();
                    }
                    
                    if (this.charts.scoreDistribution) {
                        this.charts.scoreDistribution.update();
                    }
                    
                    // Update metrics
                    this.updateMetrics();
                    this.completeLoader();
                    this.showToast('✅ Analytics data refreshed successfully!', 'success');
                }, 1500);
            }

            updateMetrics() {
                // Simulate metric updates
                const newEvaluations = Math.floor(Math.random() * 50) + 100;
                const newScore = (Math.random() * 2 + 7.5).toFixed(1);
                const newFeedback = Math.floor(Math.random() * 30) + 70;
                const newTime = Math.floor(Math.random() * 20) + 25;
                
                document.getElementById('totalEvaluations').textContent = newEvaluations;
                document.getElementById('avgScore').textContent = newScore;
                document.getElementById('totalFeedback').textContent = newFeedback;
                document.getElementById('avgTime').textContent = newTime;
            }

            // ✅ REALISTIC PROJECT DETAILS
            showProjectDetails(project) {
                this.showToast(`📋 Loading detailed analytics for ${project.name}...`, 'info');
                this.showLoader();
                
                setTimeout(() => {
                    this.completeLoader();
                    this.showToast(`🎯 Project "${project.name}" ranked #${project.rank} with score ${project.score}/10`, 'success');
                }, 1200);
            }

            // ✅ REALISTIC ACTIVITY DETAILS
            showActivityDetails(activity) {
                this.showToast(`📊 Activity: ${activity.text.substring(0, 50)}...`, 'info');
            }

            // ✅ REALISTIC REFRESH DATA
            refreshData() {
                this.showToast('🔄 Refreshing analytics data from all sources...', 'info');
                this.showLoader();
                
                setTimeout(() => {
                    this.loadAnalyticsData();
                    this.updateAnalytics();
                    this.renderLeaderboard();
                    this.renderActivityFeed();
                    this.completeLoader();
                    this.showToast('🎉 All analytics data refreshed with latest insights!', 'success');
                }, 3000);
            }

            // ✅ REALISTIC CSV EXPORT
            exportReport() {
                this.showToast('📄 Generating comprehensive analytics report...', 'info');
                this.showLoader();
                
                setTimeout(() => {
                    const reportData = {
                        summary: {
                            totalEvaluations: this.data.evaluations.total,
                            averageScore: this.data.scores.average,
                            totalFeedback: this.data.feedback.total,
                            averageTime: this.data.time.average,
                            generatedBy: this.currentUser.name,
                            generatedAt: new Date().toISOString(),
                            filters: this.filters
                        },
                        evaluationTrends: this.data.evaluations.weekly,
                        scoreDistribution: this.data.scores.distribution,
                        topProjects: [
                            'DeFi Portfolio Tracker - 9.2',
                            'AI Healthcare Assistant - 8.9',
                            'Smart City Dashboard - 8.7',
                            'Green Energy Monitor - 8.5',
                            'Social Impact Platform - 8.3'
                        ]
                    };

                    const csvContent = this.generateCsvReport(reportData);
                    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `nexushack-analytics-report-${new Date().toISOString().split('T')[0]}.csv`;
                    a.click();
                    URL.revokeObjectURL(url);
                    
                    this.completeLoader();
                    this.showToast('📥 Analytics report exported successfully! Downloaded to your device.', 'success');
                }, 2500);
            }

            generateCsvReport(data) {
                let csv = 'NexusHack Analytics Report\n';
                csv += `Generated by: ${data.summary.generatedBy}\n`;
                csv += `Generated at: ${new Date(data.summary.generatedAt).toLocaleString()}\n\n`;
                
                csv += 'Summary Metrics\n';
                csv += 'Metric,Value\n';
                csv += `Total Evaluations,${data.summary.totalEvaluations}\n`;
                csv += `Average Score,${data.summary.averageScore}\n`;
                csv += `Total Feedback,${data.summary.totalFeedback}\n`;
                csv += `Average Time (min),${data.summary.averageTime}\n\n`;
                
                csv += 'Top Projects\n';
                csv += 'Project,Score\n';
                data.topProjects.forEach(project => {
                    csv += `${project}\n`;
                });
                
                return csv;
            }

            // ✅ NOTIFICATION VISIBILITY - NO SEARCH BAR OVERLAP
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
                const icons = {
                    success: 'fa-check-circle',
                    error: 'fa-exclamation-circle',
                    info: 'fa-info-circle',
                    warning: 'fa-exclamation-triangle'
                };
                return icons[type] || 'fa-check-circle';
            }
        }

        // Global functions and initialization
        let analyticsDashboard;

        // ✅ REALISTIC BUTTON FUNCTIONS
        function switchChart(chartType, period) {
            // Update chart period
            document.querySelectorAll('.chart-btn').forEach(btn => btn.classList.remove('active'));
            event.target.classList.add('active');
            analyticsDashboard.showToast(`📈 Chart switched to ${period} view with updated data trends`, 'info');
        }

        function refreshScoreChart() {
            if (analyticsDashboard.charts.scoreDistribution) {
                analyticsDashboard.charts.scoreDistribution.update();
                analyticsDashboard.showToast('🔄 Score distribution chart refreshed with latest data', 'success');
            }
        }

        function viewFullLeaderboard() {
            analyticsDashboard.showToast('🏆 Opening comprehensive leaderboard with all 127 evaluated projects...', 'info');
            analyticsDashboard.showLoader();
            
            setTimeout(() => {
                analyticsDashboard.completeLoader();
                analyticsDashboard.showToast('📊 Full leaderboard would load here in the complete system', 'info');
            }, 1500);
        }

        function viewAllActivity() {
            analyticsDashboard.showToast('⏰ Loading complete activity history with detailed timeline...', 'info');
            analyticsDashboard.showLoader();
            
            setTimeout(() => {
                analyticsDashboard.completeLoader();
                analyticsDashboard.showToast('📈 Activity history interface would load here', 'info');
            }, 1200);
        }

        function exportReport() {
            analyticsDashboard.exportReport();
        }

        function refreshData() {
            analyticsDashboard.refreshData();
        }

        function updateFilters() {
            analyticsDashboard.filters.timePeriod = document.getElementById('timePeriodFilter').value;
            analyticsDashboard.filters.event = document.getElementById('eventFilter').value;
            analyticsDashboard.filters.category = document.getElementById('categoryFilter').value;
            analyticsDashboard.updateAnalytics();
        }

        function backToDashboard() {
            analyticsDashboard.showToast('🏠 Returning to judge dashboard...', 'info');
            analyticsDashboard.showLoader();
            
            setTimeout(() => {
                analyticsDashboard.completeLoader();
                window.location.href = 'dashboard.html';
            }, 1000);
        }

        // Initialize the application
        document.addEventListener('DOMContentLoaded', () => {
            analyticsDashboard = new AnalyticsDashboard();
            
            // Enhanced keyboard shortcuts
            console.log(`
🎯 NexusHack Analytics Dashboard - Keyboard Shortcuts:
• Escape : Close modals/overlays  
• Ctrl + R : Refresh data
• Ctrl + E : Export report
• Ctrl + T : Toggle theme
            `);
            
            // Keyboard shortcuts
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    analyticsDashboard.closeMobileSidebar();
                }
                if (e.ctrlKey) {
                    switch(e.key) {
                        case 'r':
                            e.preventDefault();
                            refreshData();
                            break;
                        case 'e':
                            e.preventDefault();
                            exportReport();
                            break;
                    }
                }
            });
            
            // Entrance animations
            setTimeout(() => {
                document.querySelectorAll('.metric-card').forEach((card, index) => {
                    setTimeout(() => {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 100);
                    }, index * 100);
                });
            }, 1000);

            // Chart container animations
            setTimeout(() => {
                document.querySelectorAll('.chart-card').forEach((card, index) => {
                    setTimeout(() => {
                        card.style.opacity = '0';
                        card.style.transform = 'scale(0.95)';
                        setTimeout(() => {
                            card.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, 150);
                    }, index * 200);
                });
            }, 2000);

            // Performance optimization for mobile devices
            if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                document.body.classList.add('mobile-device');
            }

            // Welcome message
            setTimeout(() => {
                analyticsDashboard.showToast('📊 Analytics Dashboard loaded! Advanced insights and real-time charts are ready with full export capabilities.', 'success');
            }, 3500);
        });