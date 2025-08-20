   class ModernLeaderboardManager {
            constructor() {
                this.teams = [];
                this.liveUpdates = [];
                this.trackBreakdown = [];
                this.chart = null;
                this.liveMode = true;
                this.publicView = true;
                this.updateFrequency = 10000; // 10 seconds
                this.updateInterval = null;
                this.isMobile = window.innerWidth <= 1024;
                this.currentUser = { name: 'Alex Chen', initials: 'AC', role: 'Lead Organizer', id: 'org_001' };
                this.init();
            }

            init() {
                this.initializeTheme();
                this.setupEventListeners();
                this.loadTeams();
                this.loadLiveUpdates();
                this.loadTrackBreakdown();
                this.renderLeaderboard();
                this.renderLiveUpdates();
                this.renderTrackBreakdown();
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

            loadTeams() {
                // Generate enhanced mock team data
                this.teams = [
                    {
                        id: 1,
                        name: 'AI Innovators',
                        members: ['Sarah M.', 'Alex K.', 'Maria L.', 'David P.'],
                        track: 'AI & Machine Learning',
                        score: 9847,
                        rank: 1,
                        avatar: 'AI',
                        trend: 'positive',
                        change: '+124',
                        lastUpdate: '2 min ago',
                        university: 'Stanford University',
                        submissions: 5,
                        avgRating: 4.9
                    },
                    {
                        id: 2,
                        name: 'Blockchain Masters',
                        members: ['John D.', 'Emma W.', 'Carlos R.'],
                        track: 'Web3 & Blockchain',
                        score: 9723,
                        rank: 2,
                        avatar: 'BM',
                        trend: 'positive',
                        change: '+89',
                        lastUpdate: '1 min ago',
                        university: 'MIT',
                        submissions: 4,
                        avgRating: 4.8
                    },
                    {
                        id: 3,
                        name: 'Green Code',
                        members: ['Lisa P.', 'Mike T.', 'Anna S.', 'Tom K.'],
                        track: 'Sustainability',
                        score: 9654,
                        rank: 3,
                        avatar: 'GC',
                        trend: 'neutral',
                        change: '+12',
                        lastUpdate: '3 min ago',
                        university: 'UC Berkeley',
                        submissions: 6,
                        avgRating: 4.7
                    },
                    {
                        id: 4,
                        name: 'Mobile Wizards',
                        members: ['Jake L.', 'Sophie M.'],
                        track: 'Mobile Development',
                        score: 9542,
                        rank: 4,
                        avatar: 'MW',
                        trend: 'positive',
                        change: '+67',
                        lastUpdate: '5 min ago',
                        university: 'Carnegie Mellon',
                        submissions: 3,
                        avgRating: 4.6
                    },
                    {
                        id: 5,
                        name: 'FinTech Fusion',
                        members: ['Ryan C.', 'Maya J.', 'Kevin B.'],
                        track: 'FinTech',
                        score: 9456,
                        rank: 5,
                        avatar: 'FF',
                        trend: 'negative',
                        change: '-23',
                        lastUpdate: '4 min ago',
                        university: 'Harvard University',
                        submissions: 4,
                        avgRating: 4.5
                    },
                    {
                        id: 6,
                        name: 'HealthTech Heroes',
                        members: ['Rachel G.', 'James H.', 'Nina P.', 'Sam W.'],
                        track: 'HealthTech',
                        score: 9389,
                        rank: 6,
                        avatar: 'HH',
                        trend: 'positive',
                        change: '+45',
                        lastUpdate: '6 min ago',
                        university: 'Johns Hopkins',
                        submissions: 5,
                        avgRating: 4.4
                    },
                    {
                        id: 7,
                        name: 'Game Changers',
                        members: ['Chris A.', 'Zoe T.'],
                        track: 'Gaming',
                        score: 9267,
                        rank: 7,
                        avatar: 'GZ',
                        trend: 'neutral',
                        change: '+8',
                        lastUpdate: '7 min ago',
                                                university: 'University of Washington',
                        submissions: 3,
                        avgRating: 4.3
                    },
                    {
                        id: 8,
                        name: 'Data Dynamos',
                        members: ['Priya S.', 'Lucas M.', 'Olivia K.'],
                        track: 'Data Science',
                        score: 9156,
                        rank: 8,
                        avatar: 'DD',
                        trend: 'positive',
                        change: '+34',
                        lastUpdate: '8 min ago',
                        university: 'Georgia Tech',
                        submissions: 4,
                        avgRating: 4.2
                    }
                ];
            }

            loadLiveUpdates() {
                this.liveUpdates = [
                    { 
                        type: 'score-change', 
                        text: 'AI Innovators gained +124 points with latest submission', 
                        time: '2 minutes ago',
                        team: 'AI Innovators'
                    },
                    { 
                        type: 'new-submission', 
                        text: 'HealthTech Heroes submitted milestone 3', 
                        time: '4 minutes ago',
                        team: 'HealthTech Heroes'
                    },
                    { 
                        type: 'rank-change', 
                        text: 'Mobile Wizards moved up to 4th place', 
                        time: '5 minutes ago',
                        team: 'Mobile Wizards'
                    },
                    { 
                        type: 'score-change', 
                        text: 'Blockchain Masters completed bonus challenge (+89 pts)', 
                        time: '6 minutes ago',
                        team: 'Blockchain Masters'
                    },
                    { 
                        type: 'new-submission', 
                        text: 'Green Code submitted final presentation', 
                        time: '8 minutes ago',
                        team: 'Green Code'
                    },
                    { 
                        type: 'rank-change', 
                        text: 'Data Dynamos climbed 2 positions', 
                        time: '10 minutes ago',
                        team: 'Data Dynamos'
                    }
                ];
            }

            loadTrackBreakdown() {
                this.trackBreakdown = [
                    { 
                        name: 'AI & Machine Learning', 
                        teams: 45, 
                        leader: 'AI Innovators',
                        topScore: 9847,
                        color: '#8b5cf6'
                    },
                    { 
                        name: 'Web3 & Blockchain', 
                        teams: 38, 
                        leader: 'Blockchain Masters',
                        topScore: 9723,
                        color: '#06b6d4'
                    },
                    { 
                        name: 'Sustainability', 
                        teams: 52, 
                        leader: 'Green Code',
                        topScore: 9654,
                        color: '#10b981'
                    },
                    { 
                        name: 'Mobile Development', 
                        teams: 41, 
                        leader: 'Mobile Wizards',
                        topScore: 9542,
                        color: '#f59e0b'
                    },
                    { 
                        name: 'FinTech', 
                        teams: 33, 
                        leader: 'FinTech Fusion',
                        topScore: 9456,
                        color: '#ef4444'
                    },
                    { 
                        name: 'HealthTech', 
                        teams: 29, 
                        leader: 'HealthTech Heroes',
                        topScore: 9389,
                        color: '#ec4899'
                    }
                ];
            }

            renderLeaderboard() {
                const container = document.getElementById('leaderboardList');
                container.innerHTML = '';

                this.teams.forEach((team, index) => {
                    const teamDiv = document.createElement('div');
                    teamDiv.className = `leaderboard-item rank-${team.rank}`;
                    teamDiv.style.opacity = '0';
                    teamDiv.style.transform = 'translateY(20px)';
                    teamDiv.innerHTML = `
                        <div class="rank-number">${team.rank}</div>
                        <div class="team-avatar">${team.avatar}</div>
                        <div class="team-info">
                            <div class="team-name">${team.name}</div>
                            <div class="team-details">${team.track} • ${team.university}</div>
                            <div class="team-members">
                                ${team.members.map(member => `<span class="member-tag">${member}</span>`).join('')}
                            </div>
                        </div>
                        <div class="score-display">
                            <div class="score-value">${team.score.toLocaleString()}</div>
                            <div class="score-label">Total Points</div>
                            <div class="score-trend ${team.trend}">
                                <i class="fas ${this.getTrendIcon(team.trend)}"></i>
                                <span>${team.change}</span>
                            </div>
                        </div>
                    `;
                    container.appendChild(teamDiv);

                    // Animate in
                    setTimeout(() => {
                        teamDiv.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                        teamDiv.style.opacity = '1';
                        teamDiv.style.transform = 'translateY(0)';
                    }, index * 100);
                });
            }

            renderLiveUpdates() {
                const container = document.getElementById('updateList');
                container.innerHTML = '';

                this.liveUpdates.forEach((update, index) => {
                    const updateDiv = document.createElement('div');
                    updateDiv.className = `update-item ${update.type}`;
                    updateDiv.style.opacity = '0';
                    updateDiv.style.transform = 'translateX(20px)';
                    updateDiv.innerHTML = `
                        <div class="update-icon ${update.type}">
                            <i class="fas ${this.getUpdateIcon(update.type)}"></i>
                        </div>
                        <div class="update-details">
                            <div class="update-text">${update.text}</div>
                            <div class="update-time">${update.time}</div>
                        </div>
                    `;
                    container.appendChild(updateDiv);

                    // Animate in
                    setTimeout(() => {
                        updateDiv.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                        updateDiv.style.opacity = '1';
                        updateDiv.style.transform = 'translateX(0)';
                    }, index * 150);
                });
            }

            renderTrackBreakdown() {
                const container = document.getElementById('trackList');
                container.innerHTML = '';

                this.trackBreakdown.forEach((track, index) => {
                    const trackDiv = document.createElement('div');
                    trackDiv.className = 'track-item';
                    trackDiv.style.opacity = '0';
                    trackDiv.style.transform = 'scale(0.95)';
                    trackDiv.innerHTML = `
                        <div>
                            <div class="track-name">${track.name}</div>
                            <div class="track-teams">${track.teams} teams</div>
                        </div>
                        <div class="track-leader">${track.leader}</div>
                    `;
                    container.appendChild(trackDiv);

                    // Animate in
                    setTimeout(() => {
                        trackDiv.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                        trackDiv.style.opacity = '1';
                        trackDiv.style.transform = 'scale(1)';
                    }, index * 100);
                });
            }

            initializeChart() {
                const ctx = document.getElementById('progressChart').getContext('2d');
                const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
                
                // Score progression data for top teams
                const scoreData = [
                    { team: 'AI Innovators', scores: [8200, 8650, 9100, 9450, 9847] },
                    { team: 'Blockchain Masters', scores: [7890, 8234, 8567, 9123, 9723] },
                    { team: 'Green Code', scores: [7654, 8012, 8456, 8934, 9654] },
                    { team: 'Mobile Wizards', scores: [7123, 7567, 8012, 8678, 9542] }
                ];
                
                this.chart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Final'],
                        datasets: scoreData.map((team, index) => ({
                            label: team.team,
                            data: team.scores,
                            borderColor: this.getTeamColor(index),
                            backgroundColor: this.getTeamColor(index, 0.1),
                            borderWidth: 3,
                            fill: false,
                            tension: 0.4,
                            pointBackgroundColor: this.getTeamColor(index),
                            pointBorderColor: '#ffffff',
                            pointBorderWidth: 2,
                            pointRadius: 6,
                            pointHoverRadius: 8
                        }))
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
                                beginAtZero: false,
                                grid: {
                                    color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                                },
                                ticks: {
                                    color: isDark ? '#e2e8f0' : '#64748b',
                                    callback: function(value) {
                                        return value.toLocaleString();
                                    }
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

            getTeamColor(index, alpha = 1) {
                const colors = ['#f97316', '#8b5cf6', '#10b981', '#06b6d4', '#f59e0b', '#ef4444'];
                const color = colors[index % colors.length];
                if (alpha < 1) {
                    return color + Math.floor(alpha * 255).toString(16).padStart(2, '0');
                }
                return color;
            }

            getTrendIcon(trend) {
                const icons = {
                    positive: 'fa-arrow-up',
                    negative: 'fa-arrow-down',
                    neutral: 'fa-minus'
                };
                return icons[trend] || 'fa-minus';
            }

            getUpdateIcon(type) {
                const icons = {
                    'score-change': 'fa-chart-line',
                    'new-submission': 'fa-file-upload',
                    'rank-change': 'fa-sort'
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

            startLiveUpdates() {
                if (!this.liveMode) return;
                
                this.updateInterval = setInterval(() => {
                    this.simulateLiveUpdate();
                }, this.updateFrequency);
            }

            simulateLiveUpdate() {
                // Simulate random score changes
                const randomTeam = this.teams[Math.floor(Math.random() * this.teams.length)];
                const scoreChange = Math.floor(Math.random() * 100) - 50; // -50 to +50
                
                if (Math.abs(scoreChange) > 20) {
                    randomTeam.score += scoreChange;
                    randomTeam.change = scoreChange > 0 ? `+${scoreChange}` : `${scoreChange}`;
                    randomTeam.trend = scoreChange > 0 ? 'positive' : 'negative';
                    randomTeam.lastUpdate = 'Just now';
                    
                    // Resort teams
                    this.teams.sort((a, b) => b.score - a.score);
                    this.teams.forEach((team, index) => {
                        team.rank = index + 1;
                    });
                    
                    // Add new live update
                    const newUpdate = {
                        type: 'score-change',
                        text: `${randomTeam.name} ${scoreChange > 0 ? 'gained' : 'lost'} ${Math.abs(scoreChange)} points`,
                        time: 'Just now',
                        team: randomTeam.name
                    };
                    
                    this.liveUpdates.unshift(newUpdate);
                    this.liveUpdates = this.liveUpdates.slice(0, 6); // Keep only 6 latest
                    
                    // Re-render
                    this.renderLeaderboard();
                    this.renderLiveUpdates();
                    
                    this.showToast(`${randomTeam.name} score updated: ${scoreChange > 0 ? '+' : ''}${scoreChange} points`, 'info');
                }
            }

            initializeAnimations() {
                // Enhanced entrance animations
                setTimeout(() => {
                    document.querySelectorAll('.leaderboard-item').forEach((item, index) => {
                        setTimeout(() => {
                            item.style.opacity = '0';
                            item.style.transform = 'translateY(30px) scale(0.95)';
                            setTimeout(() => {
                                item.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                                item.style.opacity = '1';
                                item.style.transform = 'translateY(0) scale(1)';
                            }, 100);
                        }, index * 150);
                    });
                }, 500);
            }

            // Control Functions
            toggleLiveUpdates() {
                this.liveMode = !this.liveMode;
                const switchElement = document.getElementById('liveSwitch');
                switchElement.classList.toggle('active', this.liveMode);
                
                if (this.liveMode) {
                    this.startLiveUpdates();
                    this.showToast('Live updates enabled', 'success');
                } else {
                    if (this.updateInterval) {
                        clearInterval(this.updateInterval);
                        this.updateInterval = null;
                    }
                    this.showToast('Live updates disabled', 'warning');
                }
            }

            togglePublicView() {
                this.publicView = !this.publicView;
                const switchElement = document.getElementById('publicSwitch');
                switchElement.classList.toggle('active', this.publicView);
                
                this.showToast(`Public view ${this.publicView ? 'enabled' : 'disabled'}`, this.publicView ? 'success' : 'warning');
            }

            changeUpdateFrequency() {
                const frequency = document.getElementById('updateFrequency').value;
                this.updateFrequency = parseInt(frequency) * 1000;
                
                if (this.updateInterval) {
                    clearInterval(this.updateInterval);
                    this.startLiveUpdates();
                }
                
                this.showToast(`Update frequency changed to ${frequency} seconds`, 'info');
            }

            // Header Actions
            freezeRankings() {
                this.showToast('Rankings frozen for final evaluation...', 'warning');
                
                if (this.updateInterval) {
                    clearInterval(this.updateInterval);
                    this.updateInterval = null;
                }
                
                this.liveMode = false;
                document.getElementById('liveSwitch').classList.remove('active');
            }

            announceWinners() {
                this.showToast('Opening winner announcement system...', 'info');
                
                setTimeout(() => {
                    const winners = this.teams.slice(0, 3);
                    const announcement = `🏆 Winners Announced!\n1st: ${winners[0].name}\n2nd: ${winners[1].name}\n3rd: ${winners.name}`;
                    this.showToast(announcement, 'success');
                }, 2000);
            }

            // Topbar Actions
            openBroadcast() {
                this.showToast('Opening live broadcast view...', 'info');
            }

            getAIRankings() {
                this.showToast('Generating AI-powered ranking insights...', 'info');
                
                setTimeout(() => {
                    const insights = [
                        '🎯 AI Innovators show consistent performance across all metrics',
                        '📊 Blockchain Masters excel in code quality (96% rating)',
                        '⚡ Green Code leads in innovation score with sustainability focus',
                        '🏆 Mobile Wizards demonstrate strong technical execution',
                        '🤖 AI predicts close competition for top 3 positions'
                    ];
                    
                    const randomInsight = insights[Math.floor(Math.random() * insights.length)];
                    this.showToast(randomInsight, 'success');
                }, 2000);
            }

            exportRankings() {
                this.showToast('Generating comprehensive rankings report...', 'info');
                
                setTimeout(() => {
                    const rankingsData = {
                        generated: new Date().toISOString(),
                        event: 'NexusHack 2025',
                        totalTeams: 312,
                        topRankings: this.teams,
                        trackBreakdown: this.trackBreakdown,
                        liveUpdates: this.liveUpdates
                    };

                    const blob = new Blob([JSON.stringify(rankingsData, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `leaderboard-${new Date().toISOString().split('T')[0]}.json`;
                    a.click();
                    URL.revokeObjectURL(url);
                    
                    this.showToast('Rankings exported successfully!', 'success');
                }, 2500);
            }

            // Table Actions
            sortBy(criteria) {
                if (criteria === 'score') {
                    this.teams.sort((a, b) => b.score - a.score);
                    this.teams.forEach((team, index) => {
                        team.rank = index + 1;
                    });
                    this.renderLeaderboard();
                    this.showToast('Sorted by score (highest first)', 'info');
                }
            }

            filterByTrack() {
                this.showToast('Opening track filter options...', 'info');
            }

            autoRank() {
                this.showToast('AI auto-ranking initiated...', 'info');
                
                setTimeout(() => {
                    // Simulate AI reordering based on multiple factors
                    this.teams.forEach(team => {
                        const aiBonus = Math.floor(Math.random() * 50);
                        team.score += aiBonus;
                        team.change = `+${aiBonus}`;
                        team.trend = 'positive';
                    });
                    
                    this.teams.sort((a, b) => b.score - a.score);
                    this.teams.forEach((team, index) => {
                        team.rank = index + 1;
                    });
                    
                    this.renderLeaderboard();
                    this.showToast('AI auto-ranking completed with multi-factor analysis!', 'success');
                }, 3000);
            }

            refreshRankings() {
                this.showToast('Refreshing live rankings...', 'info');
                
                setTimeout(() => {
                    this.renderLeaderboard();
                    this.renderLiveUpdates();
                    this.renderTrackBreakdown();
                    this.showToast('Rankings refreshed with latest data!', 'success');
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
        let modernLeaderboardManager;

        function toggleLiveUpdates() { modernLeaderboardManager.toggleLiveUpdates(); }
        function togglePublicView() { modernLeaderboardManager.togglePublicView(); }
        function changeUpdateFrequency() { modernLeaderboardManager.changeUpdateFrequency(); }
        function freezeRankings() { modernLeaderboardManager.freezeRankings(); }
        function announceWinners() { modernLeaderboardManager.announceWinners(); }
        function openBroadcast() { modernLeaderboardManager.openBroadcast(); }
        function getAIRankings() { modernLeaderboardManager.getAIRankings(); }
        function exportRankings() { modernLeaderboardManager.exportRankings(); }
        function sortBy(criteria) { modernLeaderboardManager.sortBy(criteria); }
        function filterByTrack() { modernLeaderboardManager.filterByTrack(); }
        function autoRank() { modernLeaderboardManager.autoRank(); }
        function refreshRankings() { modernLeaderboardManager.refreshRankings(); }
        function backToDashboard() { modernLeaderboardManager.backToDashboard(); }

        document.addEventListener('DOMContentLoaded', () => {
            modernLeaderboardManager = new ModernLeaderboardManager();
            
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
                    name: modernLeaderboardManager.currentUser.name,
                    initials: modernLeaderboardManager.currentUser.initials,
                    role: modernLeaderboardManager.currentUser.role,
                    lastActive: Date.now()
                };
                localStorage.setItem('modernOrganizerSession', JSON.stringify(sessionData));
            }, 60000); // Save every minute

            // Add keyboard shortcuts for leaderboard control
            document.addEventListener('keydown', (e) => {
                if (e.ctrlKey || e.metaKey) {
                    switch(e.key) {
                        case 'l':
                            e.preventDefault();
                            toggleLiveUpdates();
                            break;
                        case 'r':
                            e.preventDefault();
                            refreshRankings();
                            break;
                        case 'e':
                            e.preventDefault();
                            exportRankings();
                            break;
                        case 'f':
                            e.preventDefault();
                            freezeRankings();
                            break;
                        case 'b':
                            e.preventDefault();
                            openBroadcast();
                            break;
                    }
                }
            });

            // Enhanced live update indicator
            setInterval(() => {
                const liveIndicator = document.querySelector('.live-dot');
                if (liveIndicator && modernLeaderboardManager.liveMode) {
                    liveIndicator.style.animation = 'pulse 1.5s infinite';
                }
            }, 1000);
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
            
            /* Enhanced leaderboard animations */
            .leaderboard-item, .update-item, .track-item { transition: var(--transition) !important; }
            @media (hover: hover) and (pointer: fine) {
                .leaderboard-item:hover { 
                    transform: translateY(-4px) scale(1.02) !important;
                    box-shadow: var(--shadow-lg) !important;
                }
                .update-item:hover { transform: translateX(6px) !important; }
                .track-item:hover { transform: translateY(-4px) scale(1.02) !important; }
            }
            
            /* Enhanced rank indicators */
            .leaderboard-item.rank-1 {
                position: relative;
                overflow: hidden;
            }
            .leaderboard-item.rank-1::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: linear-gradient(45deg, transparent, rgba(251, 191, 36, 0.1), transparent);
                animation: goldShimmer 3s infinite;
            }
            
            @keyframes goldShimmer {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(100%); }
            }
            
            /* Enhanced control switches */
            .control-switch {
                position: relative;
                overflow: hidden;
            }
            .control-switch::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
                transform: translateX(-100%);
                transition: var(--transition);
            }
            .control-switch:hover::before {
                transform: translateX(100%);
            }
            
            /* Live update pulse effects */
            .update-item.score-change {
                animation: scoreUpdatePulse 0.5s ease-out;
            }
            
            @keyframes scoreUpdatePulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); }
            }
            
            /* Enhanced team avatars */
            .team-avatar {
                position: relative;
                overflow: hidden;
            }
            .team-avatar::after {
                content: '';
                position: absolute;
                top: -50%;
                left: -50%;
                width: 200%;
                height: 200%;
                background: linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent);
                transform: rotate(45deg) translateX(-100%);
                transition: var(--transition);
            }
            .team-avatar:hover::after {
                transform: rotate(45deg) translateX(100%);
            }
            
            /* Mobile optimizations */
            @media (max-width: 768px) {
                .leaderboard-item {
                    padding: 1.25rem !important;
                }
                .team-members {
                    flex-direction: column !important;
                    align-items: center !important;
                    gap: 0.25rem !important;
                }
                .score-display {
                    margin-top: 1rem !important;
                }
            }
            
            /* Real-time indicators */
            .live-indicator {
                position: relative;
                overflow: hidden;
            }
            .live-indicator::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
                animation: liveIndicatorSweep 2s infinite;
            }
            
            @keyframes liveIndicatorSweep {
                0% { left: -100%; }
                100% { left: 100%; }
            }
            
            /* Performance optimizations */
            .leaderboard-table, .stats-sidebar {
                contain: layout style paint;
            }
            
            /* Enhanced focus states */
            .control-switch:focus,
            .update-frequency:focus {
                box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.3);
            }
        `;
        document.head.appendChild(style);