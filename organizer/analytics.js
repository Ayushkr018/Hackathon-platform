  class ModernAnalyticsManager {
            constructor() {
                this.charts = {};
                this.realTimeEnabled = true;
                this.currentTimeFilter = '7d';
                this.aiInsights = [];
                this.isMobile = window.innerWidth <= 1024;
                this.currentUser = { name: 'Alex Chen', initials: 'AC', role: 'Lead Organizer', id: 'org_001' };
                this.teamFormationData = {};
                this.init();
            }

            init() {
                this.initializeTheme();
                this.setupEventListeners();
                this.loadAnalyticsData();
                this.initializeCharts();
                this.addTeamInsightsOverlay();
                this.addSkillsLevelIndicator();
                this.loadAIInsights();
                this.renderInsights();
                this.renderDemographics();
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
                document.getElementById('timeFilter').addEventListener('change', (e) => this.changeTimeFilter(e.target.value));
                window.addEventListener('resize', () => this.handleResize());
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
                
                // Resize all charts
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
                
                // Update all chart themes
                this.updateAllChartThemes(newTheme);
                this.showToast(`Theme changed to ${newTheme} mode`, 'success');
            }

            loadAnalyticsData() {
                // Generate comprehensive analytics data
                this.analyticsData = {
                    participants: {
                        total: 1247,
                        daily: [45, 67, 89, 123, 145, 178, 201],
                        growth: 34.7,
                        engagement: 87.4,
                        // Enhanced participant data
                        byExperience: {
                            beginner: 423,
                            intermediate: 567,
                            advanced: 234,
                            expert: 23
                        },
                        byTrack: {
                            web3: 298,
                            ai: 267,
                            mobile: 198,
                            sustainability: 156,
                            fintech: 134,
                            healthcare: 89,
                            gaming: 78,
                            other: 27
                        },
                        engagement: {
                            highlyEngaged: 89.2, // participants with >80% activity
                            moderatelyEngaged: 8.7,
                            lowEngaged: 2.1
                        }
                    },
                    submissions: {
                        total: 127,
                        quality: 4.8,
                        completion: 94.2,
                        // Enhanced submission data
                        byTrack: {
                            web3: 32,
                            ai: 28,
                            mobile: 21,
                            sustainability: 18,
                            fintech: 15,
                            healthcare: 8,
                            gaming: 5
                        },
                        qualityDistribution: {
                            excellent: 45,
                            good: 52,
                            average: 24,
                            needsWork: 6
                        }
                    },
                    geographic: [
                        { country: 'United States', participants: 387, percentage: 31.0, cities: ['San Francisco', 'New York', 'Austin'] },
                        { country: 'India', participants: 298, percentage: 23.9, cities: ['Bangalore', 'Mumbai', 'Delhi'] },
                        { country: 'Canada', participants: 156, percentage: 12.5, cities: ['Toronto', 'Vancouver', 'Montreal'] },
                        { country: 'United Kingdom', participants: 134, percentage: 10.7, cities: ['London', 'Manchester', 'Edinburgh'] },
                        { country: 'Germany', participants: 98, percentage: 7.9, cities: ['Berlin', 'Munich', 'Hamburg'] },
                        { country: 'Others', participants: 174, percentage: 14.0, cities: ['Various'] }
                    ],
                    skills: [
                        { skill: 'JavaScript', count: 456, percentage: 36.6, level: 'High Demand' },
                        { skill: 'Python', count: 398, percentage: 31.9, level: 'High Demand' },
                        { skill: 'React', count: 345, percentage: 27.7, level: 'Popular' },
                        { skill: 'Node.js', count: 289, percentage: 23.2, level: 'Popular' },
                        { skill: 'Blockchain', count: 234, percentage: 18.8, level: 'Emerging' },
                        { skill: 'AI/ML', count: 198, percentage: 15.9, level: 'Emerging' },
                        { skill: 'Flutter', count: 167, percentage: 13.4, level: 'Growing' },
                        { skill: 'Rust', count: 89, percentage: 7.1, level: 'Niche' },
                        { skill: 'Solidity', count: 76, percentage: 6.1, level: 'Specialized' },
                        { skill: 'Go', count: 54, percentage: 4.3, level: 'Niche' }
                    ],
                    demographics: {
                        students: 67.8,
                        professionals: 28.9,
                        others: 3.3,
                        avgAge: 24.5,
                        maleRatio: 58.2,
                        femaleRatio: 39.1,
                        otherRatio: 2.7,
                        // Enhanced demographics
                        education: {
                            undergraduate: 45.2,
                            graduate: 22.6,
                            doctorate: 4.8,
                            bootcamp: 18.7,
                            selfTaught: 8.7
                        },
                        workExperience: {
                            '0-1years': 34.5,
                            '2-3years': 28.9,
                            '4-7years': 21.3,
                            '8-15years': 12.1,
                            '15+years': 3.2
                        }
                    },
                    // NEW: Team Formation Analytics
                    teamFormation: {
                        totalTeams: 312,
                        soloParticipants: 89,
                        averageTeamSize: 3.2,
                        formationSuccess: 89.7,
                        teamsBySize: {
                            solo: { count: 89, successRate: 67.4 },
                            duo: { count: 67, successRate: 78.2 },
                            trio: { count: 78, successRate: 92.3 },
                            quad: { count: 58, successRate: 89.7 },
                            larger: { count: 20, successRate: 75.0 }
                        },
                        skillDiversityImpact: {
                            highDiversity: { teams: 67, avgScore: 4.7 },
                            mediumDiversity: { teams: 123, avgScore: 4.2 },
                            lowDiversity: { teams: 122, avgScore: 3.8 }
                        }
                    }
                };
            }

            initializeCharts() {
                this.initMainChart();
                this.initGeoChart();
                this.initSkillsChart();
                this.initTeamChart();
            }

            initMainChart() {
                const ctx = document.getElementById('mainChart').getContext('2d');
                const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
                
                this.charts.main = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                        datasets: [
                            {
                                label: 'Registrations',
                                data: this.analyticsData.participants.daily,
                                borderColor: '#667eea',
                                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                                borderWidth: 3,
                                fill: true,
                                tension: 0.4
                            },
                            {
                                label: 'Check-ins',
                                data: [34, 52, 67, 89, 112, 134, 156],
                                borderColor: '#10b981',
                                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                                borderWidth: 3,
                                fill: true,
                                tension: 0.4
                            },
                            {
                                label: 'Submissions',
                                data: [0, 0, 2, 8, 23, 45, 89],
                                borderColor: '#f59e0b',
                                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                                borderWidth: 3,
                                fill: true,
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
                                position: 'top',
                                labels: {
                                    color: isDark ? '#e2e8f0' : '#64748b',
                                    usePointStyle: true,
                                    padding: 20
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

            initGeoChart() {
                const ctx = document.getElementById('geoChart').getContext('2d');
                const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
                
                this.charts.geo = new Chart(ctx, {
                    type: 'doughnut',
                    data: {
                        labels: this.analyticsData.geographic.map(item => item.country),
                        datasets: [{
                            data: this.analyticsData.geographic.map(item => item.participants),
                            backgroundColor: [
                                '#667eea', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'
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
                                    padding: 15
                                }
                            }
                        }
                    }
                });
            }

            initSkillsChart() {
                const ctx = document.getElementById('skillsChart').getContext('2d');
                const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
                
                this.charts.skills = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: this.analyticsData.skills.map(item => item.skill),
                        datasets: [{
                            label: 'Participants',
                            data: this.analyticsData.skills.map(item => item.count),
                            backgroundColor: [
                                'rgba(102, 126, 234, 0.8)',
                                'rgba(102, 126, 234, 0.8)',
                                'rgba(16, 185, 129, 0.8)',
                                'rgba(16, 185, 129, 0.8)',
                                'rgba(245, 158, 11, 0.8)',
                                'rgba(245, 158, 11, 0.8)',
                                'rgba(139, 92, 246, 0.8)',
                                'rgba(239, 68, 68, 0.8)',
                                'rgba(239, 68, 68, 0.8)',
                                'rgba(239, 68, 68, 0.8)'
                            ],
                            borderColor: [
                                '#667eea', '#667eea', '#10b981', '#10b981', '#f59e0b', 
                                '#f59e0b', '#8b5cf6', '#ef4444', '#ef4444', '#ef4444'
                            ],
                            borderWidth: 2
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
                                    display: false
                                },
                                ticks: {
                                    color: isDark ? '#e2e8f0' : '#64748b'
                                }
                            }
                        }
                    }
                });
            }

            initTeamChart() {
                const ctx = document.getElementById('teamChart').getContext('2d');
                const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
                
                // Team formation data with actual statistics
                const teamFormationData = {
                    teamSizes: [
                        { size: '1 (Solo)', count: 89, percentage: 28.5 },
                        { size: '2 members', count: 67, percentage: 21.5 },
                        { size: '3 members', count: 78, percentage: 25.0 },
                        { size: '4 members', count: 58, percentage: 18.6 },
                        { size: '5+ members', count: 20, percentage: 6.4 }
                    ],
                    skillDiversity: {
                        highDiversity: 67,  // teams with 4+ different skill areas
                        mediumDiversity: 123, // teams with 2-3 skill areas
                        lowDiversity: 122    // teams with 1-2 skill areas
                    },
                    formationSuccess: {
                        successful: 89.7,
                        struggling: 10.3
                    }
                };

                // Create a mixed chart with team formation patterns
                this.charts.team = new Chart(ctx, {
                    type: 'doughnut',
                    data: {
                        labels: teamFormationData.teamSizes.map(item => item.size),
                        datasets: [{
                            label: 'Team Formation Distribution',
                            data: teamFormationData.teamSizes.map(item => item.count),
                            backgroundColor: [
                                'rgba(102, 126, 234, 0.8)',
                                'rgba(16, 185, 129, 0.8)',
                                'rgba(245, 158, 11, 0.8)',
                                'rgba(139, 92, 246, 0.8)',
                                'rgba(239, 68, 68, 0.8)'
                            ],
                            borderColor: [
                                '#667eea', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'
                            ],
                            borderWidth: 3,
                            cutout: '50%'
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
                                    padding: 15,
                                    usePointStyle: true,
                                    font: {
                                        size: 11
                                    }
                                }
                            },
                            tooltip: {
                                callbacks: {
                                    label: function(context) {
                                        const item = teamFormationData.teamSizes[context.dataIndex];
                                        return `${item.size}: ${item.count} teams (${item.percentage}%)`;
                                    }
                                }
                            }
                        }
                    }
                });

                // Store team formation data for access
                this.teamFormationData = teamFormationData;
            }

            addTeamInsightsOverlay() {
                const chartContainer = document.querySelector('#teamChart').parentElement;
                
                // Create insights overlay
                const overlay = document.createElement('div');
                overlay.className = 'team-insights';
                overlay.innerHTML = `
                    <div class="team-insights-title">Success Rate</div>
                    <div class="team-insights-value">89.7%</div>
                `;
                
                chartContainer.style.position = 'relative';
                chartContainer.appendChild(overlay);
            }

            addSkillsLevelIndicator() {
                const skillsContainer = document.querySelector('#skillsChart').parentElement;
                
                const indicator = document.createElement('div');
                indicator.className = 'skill-level-indicator';
                indicator.innerHTML = `
                    <div class="skill-level">
                        <div class="skill-level-dot high"></div>
                        <span>High Demand</span>
                    </div>
                    <div class="skill-level">
                        <div class="skill-level-dot popular"></div>
                        <span>Popular</span>
                    </div>
                    <div class="skill-level">
                        <div class="skill-level-dot emerging"></div>
                        <span>Emerging</span>
                    </div>
                    <div class="skill-level">
                        <div class="skill-level-dot growing"></div>
                        <span>Growing</span>
                    </div>
                    <div class="skill-level">
                        <div class="skill-level-dot niche"></div>
                        <span>Niche</span>
                    </div>
                `;
                
                skillsContainer.style.position = 'relative';
                skillsContainer.appendChild(indicator);
            }

            renderTeamFormationInsights() {
                // This will be called to show detailed team insights
                const insights = [
                    `🎯 Most successful team size: 3 members (${this.teamFormationData.teamSizes[2].percentage}%)`,
                    `👥 Solo participants: ${this.teamFormationData.teamSizes.count} (${this.teamFormationData.teamSizes.percentage}%)`,
                    `🏆 High skill diversity teams: ${this.teamFormationData.skillDiversity.highDiversity} teams`,
                    `⚡ Team formation success rate: ${this.teamFormationData.formationSuccess.successful}%`
                ];
                
                return insights;
            }

            updateAllChartThemes(theme) {
                const isDark = theme === 'dark';
                const textColor = isDark ? '#e2e8f0' : '#64748b';
                const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

                Object.values(this.charts).forEach(chart => {
                    if (chart && chart.options) {
                        // Update grid colors
                        if (chart.options.scales) {
                            Object.values(chart.options.scales).forEach(scale => {
                                if (scale.grid) scale.grid.color = gridColor;
                                if (scale.ticks) scale.ticks.color = textColor;
                                if (scale.angleLines) scale.angleLines.color = gridColor;
                                if (scale.pointLabels) scale.pointLabels.color = textColor;
                            });
                        }

                        // Update legend colors
                        if (chart.options.plugins && chart.options.plugins.legend) {
                            chart.options.plugins.legend.labels.color = textColor;
                        }

                        chart.update();
                    }
                });
            }

            loadAIInsights() {
                this.aiInsights = [
                    {
                        type: 'critical',
                        title: 'Peak Registration Alert',
                        text: 'Registration spike detected! Current rate is 340% above average. Consider scaling server capacity.'
                    },
                    {
                        type: 'opportunity',
                        title: 'High Engagement Opportunity',
                        text: 'AI/ML track shows 89% higher engagement. Consider adding more AI-focused workshops.'
                    },
                    {
                        type: 'prediction',
                        title: 'Submission Forecast',
                        text: 'Predicted 156 submissions by deadline based on current participation patterns.'
                    },
                    {
                        type: 'trend',
                        title: 'Geographic Growth',
                        text: 'European participants increased 67% this week. Consider timezone-specific events.'
                    },
                    {
                        type: 'opportunity',
                        title: 'Team Formation Pattern',
                        text: 'Students + professionals teams show 23% higher success rate. Promote mixed experience teams.'
                    },
                    {
                        type: 'critical',
                        title: 'Judge Workload Warning',
                        text: 'Current judge-to-submission ratio may cause evaluation delays. Consider adding 2-3 more judges.'
                    }
                ];
            }

            renderInsights() {
                const container = document.getElementById('insightsList');
                container.innerHTML = '';

                this.aiInsights.forEach((insight, index) => {
                    const insightDiv = document.createElement('div');
                    insightDiv.className = `insight-item ${insight.type}`;
                    insightDiv.style.opacity = '0';
                    insightDiv.style.transform = 'translateX(20px)';
                    insightDiv.innerHTML = `
                        <div class="insight-header">
                            <div class="insight-icon ${insight.type}">
                                <i class="fas ${this.getInsightIcon(insight.type)}"></i>
                            </div>
                            <div class="insight-title">${insight.title}</div>
                        </div>
                        <div class="insight-text">${insight.text}</div>
                    `;
                    container.appendChild(insightDiv);

                    // Animate in
                    setTimeout(() => {
                        insightDiv.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                        insightDiv.style.opacity = '1';
                        insightDiv.style.transform = 'translateX(0)';
                    }, index * 150);
                });
            }

            renderDemographics() {
                const container = document.getElementById('demographicGrid');
                
                // Enhanced demographics with more detailed data
                const demographics = [
                    { 
                        label: 'Students', 
                        value: `${this.analyticsData.demographics.students}%`,
                        detail: '845 participants',
                        trend: '+12%'
                    },
                    { 
                        label: 'Professionals', 
                        value: `${this.analyticsData.demographics.professionals}%`,
                        detail: '361 participants', 
                        trend: '+8%'
                    },
                    { 
                        label: 'Average Age', 
                        value: `${this.analyticsData.demographics.avgAge} yrs`,
                        detail: 'Range: 16-54',
                        trend: 'Stable'
                    },
                    { 
                        label: 'Female Ratio', 
                        value: `${this.analyticsData.demographics.femaleRatio}%`,
                        detail: '488 participants',
                        trend: '+15%'
                    },
                    {
                        label: 'International',
                        value: '34.2%',
                        detail: '427 participants',
                        trend: '+23%'
                    },
                    {
                        label: 'First-time',
                        value: '67.8%',
                        detail: '846 participants',
                        trend: '+19%'
                    },
                    {
                        label: 'Team Leaders',
                        value: '24.1%',
                        detail: '301 participants',
                        trend: '+11%'
                    },
                    {
                        label: 'Returning',
                        value: '32.2%',
                        detail: '401 participants',
                        trend: '+5%'
                    }
                ];

                container.innerHTML = '';
                demographics.forEach((demo, index) => {
                    const demoDiv = document.createElement('div');
                    demoDiv.className = 'demographic-item';
                    demoDiv.style.opacity = '0';
                    demoDiv.style.transform = 'scale(0.9)';
                    demoDiv.innerHTML = `
                        <div class="demographic-value">${demo.value}</div>
                        <div class="demographic-label">${demo.label}</div>
                        <div class="demographic-detail">${demo.detail}</div>
                        <div class="demographic-trend ${demo.trend.includes('+') ? 'positive' : 'neutral'}">${demo.trend}</div>
                    `;
                    container.appendChild(demoDiv);

                    // Animate in
                    setTimeout(() => {
                        demoDiv.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                        demoDiv.style.opacity = '1';
                        demoDiv.style.transform = 'scale(1)';
                    }, index * 100);
                });
            }

            getInsightIcon(type) {
                const icons = {
                    critical: 'fa-exclamation-triangle',
                    opportunity: 'fa-lightbulb',
                    prediction: 'fa-crystal-ball',
                    trend: 'fa-chart-line'
                };
                return icons[type] || 'fa-info-circle';
            }

            startRealTimeUpdates() {
                if (!this.realTimeEnabled) return;

                setInterval(() => {
                    this.updateLiveKPIs();
                    this.addRandomInsight();
                }, 15000); // Update every 15 seconds
            }

            updateLiveKPIs() {
                const kpis = [
                    { id: 'engagementScore', change: Math.random() * 2 - 1 },
                    { id: 'performanceIndex', change: Math.random() * 1 - 0.5 },
                    { id: 'growthRate', change: Math.random() * 3 - 1.5 },
                    { id: 'qualityScore', change: Math.random() * 0.2 - 0.1 }
                ];

                kpis.forEach(kpi => {
                    const element = document.getElementById(kpi.id);
                    if (element && Math.random() > 0.7) {
                        const currentValue = parseFloat(element.textContent.replace('%', ''));
                        const newValue = Math.max(0, currentValue + kpi.change);
                        
                        if (kpi.id === 'qualityScore') {
                            element.textContent = newValue.toFixed(1);
                        } else if (kpi.id.includes('Score') || kpi.id.includes('Rate')) {
                            element.textContent = `${newValue.toFixed(1)}%`;
                        } else {
                            element.textContent = newValue.toFixed(1);
                        }
                        
                        this.animateKPIChange(element);
                    }
                });
            }

            addRandomInsight() {
                const randomInsights = [
                    {
                        type: 'trend',
                        title: 'New Skill Trend',
                        text: 'Rust programming language gaining popularity - 45% increase in mentions.'
                    },
                    {
                        type: 'opportunity',
                        title: 'Mentor Engagement',
                        text: 'Participants with mentor interaction show 78% higher completion rates.'
                    },
                    {
                        type: 'prediction',
                        title: 'Quality Forecast',
                        text: 'AI predicts 12% increase in high-quality submissions based on current trends.'
                    }
                ];

                if (Math.random() > 0.6) {
                    const newInsight = randomInsights[Math.floor(Math.random() * randomInsights.length)];
                    this.aiInsights.unshift(newInsight);
                    this.aiInsights = this.aiInsights.slice(0, 6); // Keep only 6 latest
                    this.renderInsights();
                }
            }

            animateKPIChange(element) {
                element.classList.add('updating');
                element.style.transform = 'scale(1.1)';
                element.style.filter = 'brightness(1.3)';
                setTimeout(() => {
                    element.style.transform = 'scale(1)';
                    element.style.filter = 'brightness(1)';
                    element.classList.remove('updating');
                }, 600);
            }

            initializeAnimations() {
                // Enhanced entrance animations
                setTimeout(() => {
                    document.querySelectorAll('.kpi-card').forEach((card, index) => {
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

                // Chart containers animation
                setTimeout(() => {
                    document.querySelectorAll('.chart-container').forEach((container, index) => {
                        setTimeout(() => {
                            container.style.opacity = '0';
                            container.style.transform = 'translateY(20px)';
                            setTimeout(() => {
                                container.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                                container.style.opacity = '1';
                                container.style.transform = 'translateY(0)';
                            }, 100);
                        }, index * 200);
                    });
                }, 1000);
            }

            // Time Filter Functions
            changeTimeFilter(period) {
                this.currentTimeFilter = period;
                this.showToast(`Analytics updated for ${this.formatPeriod(period)}`, 'info');
                
                // Simulate data update
                this.updateChartsForPeriod(period);
            }

            formatPeriod(period) {
                const periods = {
                    '24h': 'last 24 hours',
                    '7d': 'last 7 days',
                    '30d': 'last 30 days',
                    '90d': 'last 3 months'
                };
                return periods[period] || period;
            }

                       updateChartsForPeriod(period) {
                // Simulate data changes based on time period
                const multipliers = {
                    '24h': 0.1,
                    '7d': 1,
                    '30d': 4.2,
                    '90d': 12.6
                };
                
                const multiplier = multipliers[period] || 1;
                const newData = this.analyticsData.participants.daily.map(val => Math.floor(val * multiplier));
                
                if (this.charts.main) {
                    this.charts.main.data.datasets[0].data = newData;
                    this.charts.main.update();
                }
            }

            // KPI Functions
            drillDown(metric) {
                this.showToast(`Opening detailed ${metric} analytics...`, 'info');
            }

            // Chart Type Functions
            changeChartType(type) {
                if (this.charts.main) {
                    this.charts.main.config.type = type;
                    this.charts.main.update();
                    this.showToast(`Chart changed to ${type} view`, 'success');
                }
            }

            // AI Functions
            getAIAnalytics() {
                this.showToast('Generating advanced AI analytics insights...', 'info');
                
                setTimeout(() => {
                    const insights = [
                        '🎯 Optimal team size identified: 3-4 members show 34% higher success rate',
                        '📊 Peak engagement time: 2-4 PM EST with 67% higher activity',
                        '⚡ JavaScript + AI/ML combination shows 89% project completion rate',
                        '🏆 Student-professional mixed teams outperform by 28%',
                        '🤖 AI predicts 23% increase in submissions by tomorrow'
                    ];
                    
                    const randomInsight = insights[Math.floor(Math.random() * insights.length)];
                    this.showToast(randomInsight, 'success');
                }, 2000);
            }

            getAIPredictions() {
                this.showToast('Analyzing data patterns for predictions...', 'info');
                
                setTimeout(() => {
                    // Add prediction data to main chart
                    if (this.charts.main) {
                        const predictions = [210, 225, 240];
                        this.charts.main.data.labels.push('Mon+1', 'Tue+1', 'Wed+1');
                        this.charts.main.data.datasets[0].data.push(...predictions);
                        this.charts.main.update();
                    }
                    
                    this.showToast('AI predictions added to chart - 3-day forecast generated!', 'success');
                }, 3000);
            }

            // Export Functions
            exportAnalytics() {
                this.showToast('Generating comprehensive analytics report...', 'info');
                
                setTimeout(() => {
                    const reportData = {
                        generated: new Date().toISOString(),
                        timeFilter: this.currentTimeFilter,
                        kpis: {
                            engagement: document.getElementById('engagementScore').textContent,
                            performance: document.getElementById('performanceIndex').textContent,
                            growth: document.getElementById('growthRate').textContent,
                            quality: document.getElementById('qualityScore').textContent
                        },
                        analytics: this.analyticsData,
                        insights: this.aiInsights,
                        teamFormation: this.teamFormationData
                    };

                    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `analytics-report-${new Date().toISOString().split('T')[0]}.json`;
                    a.click();
                    URL.revokeObjectURL(url);
                    
                    this.showToast('Advanced analytics report exported successfully!', 'success');
                }, 2500);
            }

            exportDemographics() {
                const csvContent = this.generateDemographicsCSV();
                const blob = new Blob([csvContent], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `demographics-${new Date().toISOString().split('T')[0]}.csv`;
                a.click();
                URL.revokeObjectURL(url);
                this.showToast('Demographics data exported to CSV!', 'success');
            }

            generateDemographicsCSV() {
                let csvContent = 'Category,Value,Percentage,Details,Trend\n';
                
                const demographics = this.analyticsData.demographics;
                csvContent += `Students,${demographics.students}%,${demographics.students},845 participants,+12%\n`;
                csvContent += `Professionals,${demographics.professionals}%,${demographics.professionals},361 participants,+8%\n`;
                csvContent += `Others,${demographics.others}%,${demographics.others},41 participants,+3%\n`;
                csvContent += `Average Age,${demographics.avgAge} years,N/A,Range: 16-54,Stable\n`;
                csvContent += `Male Ratio,${demographics.maleRatio}%,${demographics.maleRatio},726 participants,+2%\n`;
                csvContent += `Female Ratio,${demographics.femaleRatio}%,${demographics.femaleRatio},488 participants,+15%\n`;
                csvContent += `Other Gender,${demographics.otherRatio}%,${demographics.otherRatio},33 participants,+8%\n`;
                csvContent += `International,34.2%,34.2,427 participants,+23%\n`;
                csvContent += `First-time,67.8%,67.8,846 participants,+19%\n`;
                csvContent += `Team Leaders,24.1%,24.1,301 participants,+11%\n`;
                csvContent += `Returning,32.2%,32.2,401 participants,+5%\n`;
                
                return csvContent;
            }

            generateReport() {
                this.showToast('Generating comprehensive analytics report with AI insights...', 'info');
                
                setTimeout(() => {
                    this.showToast('📊 Full analytics report generated with predictive insights!', 'success');
                }, 3000);
            }

            // View Functions
            toggleMapView() {
                this.showToast('Switching to interactive geographic map view...', 'info');
            }

            toggleRealTime() {
                this.realTimeEnabled = !this.realTimeEnabled;
                const status = this.realTimeEnabled ? 'enabled' : 'disabled';
                this.showToast(`Real-time data updates ${status}`, this.realTimeEnabled ? 'success' : 'warning');
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
        let modernAnalyticsManager;

        function drillDown(metric) { modernAnalyticsManager.drillDown(metric); }
        function changeChartType(type) { modernAnalyticsManager.changeChartType(type); }
        function getAIAnalytics() { modernAnalyticsManager.getAIAnalytics(); }
        function getAIPredictions() { modernAnalyticsManager.getAIPredictions(); }
        function exportAnalytics() { modernAnalyticsManager.exportAnalytics(); }
        function exportDemographics() { modernAnalyticsManager.exportDemographics(); }
        function generateReport() { modernAnalyticsManager.generateReport(); }
        function toggleMapView() { modernAnalyticsManager.toggleMapView(); }
        function toggleRealTime() { modernAnalyticsManager.toggleRealTime(); }
        function backToDashboard() { modernAnalyticsManager.backToDashboard(); }

        document.addEventListener('DOMContentLoaded', () => {
            modernAnalyticsManager = new ModernAnalyticsManager();
            
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
                    name: modernAnalyticsManager.currentUser.name,
                    initials: modernAnalyticsManager.currentUser.initials,
                    role: modernAnalyticsManager.currentUser.role,
                    lastActive: Date.now()
                };
                localStorage.setItem('modernOrganizerSession', JSON.stringify(sessionData));
            }, 60000); // Save every minute

           

            // Add enhanced keyboard shortcuts
            document.addEventListener('keydown', (e) => {
                if (e.ctrlKey || e.metaKey) {
                    switch(e.key) {
                        case 'e':
                            e.preventDefault();
                            exportAnalytics();
                            break;
                        case 'r':
                            e.preventDefault();
                            generateReport();
                            break;
                        case 'i':
                            e.preventDefault();
                            getAIAnalytics();
                            break;
                        case 'p':
                            e.preventDefault();
                            getAIPredictions();
                            break;
                        case 't':
                            e.preventDefault();
                            modernAnalyticsManager.toggleTheme();
                            break;
                    }
                }
            });

            // Enhanced performance monitoring
            if (window.performance && window.performance.mark) {
                window.performance.mark('analytics-start');
                window.addEventListener('load', () => {
                    window.performance.mark('analytics-end');
                    window.performance.measure('analytics-load-time', 'analytics-start', 'analytics-end');
                });
            }

            // Add enhanced error handling
            window.addEventListener('error', (e) => {
                console.error('Analytics Error:', e.error);
                modernAnalyticsManager.showToast('An error occurred. Please refresh the page.', 'error');
            });

            // Enhanced accessibility features
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    document.body.classList.add('keyboard-navigation');
                }
            });

            document.addEventListener('mousedown', () => {
                document.body.classList.remove('keyboard-navigation');
            });
        });

         function logout() {
                if (confirm('Are you sure you want to logout?')) {
                    localStorage.removeItem('modernOrganizerSession');
                    modernAnalyticsManager.showToast('Logging out...', 'info');
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
            
            /* Enhanced hover effects */
            .kpi-card, .insight-item, .chart-container, .demographic-item { transition: var(--transition) !important; }
            @media (hover: hover) and (pointer: fine) {
                .kpi-card:hover { 
                    transform: translateY(-8px) scale(1.02) !important;
                    box-shadow: var(--shadow-lg) !important;
                }
                .insight-item:hover { transform: translateX(6px) !important; }
                .chart-container:hover { transform: translateY(-6px) !important; }
                .demographic-item:hover { transform: translateY(-4px) scale(1.02) !important; }
            }
            
            /* Keyboard navigation styles */
            .keyboard-navigation *:focus {
                outline: 2px solid var(--primary) !important; 
                outline-offset: 2px !important;
                box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.25) !important;
            }
            
            /* Enhanced loading states */
            .chart-canvas.loading::before {
                content: 'Loading advanced analytics...';
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                color: var(--text-muted);
                font-size: 0.9rem;
                opacity: 0.7;
            }
            
            /* Real-time update animations */
            .kpi-value.updating {
                animation: kpiUpdate 0.6s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            @keyframes kpiUpdate {
                0% { transform: scale(1); }
                50% { transform: scale(1.1); filter: brightness(1.3); }
                100% { transform: scale(1); filter: brightness(1); }
            }
            
            /* Enhanced chart responsiveness */
            @media (max-width: 1200px) {
                .chart-stats {
                    flex-direction: column;
                    gap: 0.5rem;
                    align-items: flex-start;
                }
            }
            
            /* Print optimizations */
            @media print {
                .sidebar, .topbar, .mobile-overlay, .topbar-actions, 
                .btn, .action-btn, .theme-toggle, .sidebar-toggle { 
                    display: none !important; 
                }
                .main-content { margin-left: 0 !important; }
                .content { padding: 1rem !important; }
                .chart-container, .kpi-card, .demographic-card { 
                    break-inside: avoid; 
                    page-break-inside: avoid;
                }
            }
            
            /* Enhanced mobile optimizations */
            @media (max-width: 480px) {
                .chart-header {
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 1rem;
                }
                
                .chart-stats {
                    width: 100%;
                    justify-content: space-between;
                }
                
                .demographic-grid {
                    grid-template-columns: 1fr 1fr;
                    gap: 0.75rem;
                }
                
                .kpi-grid {
                    grid-template-columns: 1fr;
                    gap: 1rem;
                }
            }
            
            /* Performance optimizations */
            .chart-container {
                contain: layout style paint;
            }
            
            .kpi-card {
                contain: layout style;
            }
            
            /* Enhanced focus indicators */
            .time-filter:focus,
            .chart-container:focus-within {
                box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.3);
                border-color: var(--primary);
            }
            
            /* Smooth transitions for theme changes */
            * {
                transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
            }
            
            /* Enhanced tooltip styles */
            [title] {
                position: relative;
            }
            
            [title]:hover::after {
                content: attr(title);
                position: absolute;
                top: 100%;
                left: 50%;
                transform: translateX(-50%);
                background: var(--bg-modal);
                color: var(--text-primary);
                padding: 0.5rem;
                border-radius: 6px;
                font-size: 0.8rem;
                white-space: nowrap;
                z-index: 1000;
                margin-top: 0.5rem;
                border: 1px solid var(--border);
                backdrop-filter: blur(10px);
            }
            
            /* Enhanced scroll behavior */
            .content {
                scroll-behavior: smooth;
                scrollbar-width: thin;
                scrollbar-color: var(--border-accent) var(--bg-glass);
            }
            
            /* Enhanced chart legends */
            .chart-container canvas {
                border-radius: 8px;
            }
            
            /* Real-time indicator */
            .action-btn.realtime-active {
                background: var(--gradient-success) !important;
                color: white !important;
            }
            
            .action-btn.realtime-active::after {
                content: '';
                position: absolute;
                top: 8px;
                right: 8px;
                width: 6px;
                height: 6px;
                background: #10b981;
                border-radius: 50%;
                animation: pulse 2s infinite;
            }
        `;
        document.head.appendChild(style);
