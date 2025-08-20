   class ModernParticipantManager {
            constructor() {
                this.participants = [];
                this.filteredParticipants = [];
                this.activityLog = [];
                this.chart = null;
                this.currentPage = 1;
                this.participantsPerPage = 15;
                this.isMobile = window.innerWidth <= 1024;
                this.currentUser = { name: 'Alex Chen', initials: 'AC', role: 'Lead Organizer', id: 'org_001' };
                this.init();
            }

            init() {
                this.initializeTheme();
                this.setupEventListeners();
                this.loadParticipants();
                this.loadActivityLog();
                this.renderParticipants();
                this.renderActivity();
                this.initializeChart();
                this.initializeUser();
                this.handleResize();
                this.setupFiltering();
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

            setupFiltering() {
                const searchInput = document.getElementById('searchInput');
                const statusFilter = document.getElementById('statusFilter');
                const teamFilter = document.getElementById('teamFilter');
                const trackFilter = document.getElementById('trackFilter');

                searchInput.addEventListener('input', () => this.filterParticipants());
                statusFilter.addEventListener('change', () => this.filterParticipants());
                teamFilter.addEventListener('change', () => this.filterParticipants());
                trackFilter.addEventListener('change', () => this.filterParticipants());
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

            loadParticipants() {
                // Generate enhanced mock participant data
                this.participants = [];
                const statuses = ['registered', 'checked-in', 'pending'];
                const tracks = ['web3', 'ai', 'mobile', 'sustainability'];
                const skills = ['JavaScript', 'Python', 'React', 'Node.js', 'Solidity', 'TensorFlow', 'Swift', 'Flutter', 'Blockchain', 'AI/ML'];
                const teamStatuses = ['formed', 'solo', 'seeking'];
                const universities = ['MIT', 'Stanford', 'UC Berkeley', 'Harvard', 'CMU', 'Caltech', 'Princeton'];
                const companies = ['Google', 'Microsoft', 'Apple', 'Meta', 'OpenAI', 'Tesla', 'SpaceX'];

                for (let i = 1; i <= 100; i++) {
                    const participant = {
                        id: i,
                        name: this.generateName(),
                        email: `participant${i}@example.com`,
                        avatar: this.generateAvatar(),
                        status: statuses[Math.floor(Math.random() * statuses.length)],
                        track: tracks[Math.floor(Math.random() * tracks.length)],
                        skills: this.getRandomSkills(skills),
                        team: Math.random() > 0.3 ? `Team ${Math.floor(Math.random() * 100) + 1}` : 'No Team',
                        teamStatus: teamStatuses[Math.floor(Math.random() * teamStatuses.length)],
                        university: Math.random() > 0.4 ? universities[Math.floor(Math.random() * universities.length)] : null,
                        company: Math.random() > 0.6 ? companies[Math.floor(Math.random() * companies.length)] : null,
                        experience: Math.random() > 0.5 ? 'Professional' : 'Student',
                        registeredAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
                        checkedInAt: Math.random() > 0.3 ? new Date(Date.now() - Math.random() * 2 * 24 * 60 * 60 * 1000).toISOString() : null,
                        githubUrl: `https://github.com/participant${i}`,
                        linkedinUrl: `https://linkedin.com/in/participant${i}`,
                        rating: Math.floor(Math.random() * 5) + 1
                    };
                    this.participants.push(participant);
                }

                this.filteredParticipants = [...this.participants];
            }

            generateName() {
                const firstNames = ['Alex', 'Sarah', 'Mike', 'Emma', 'David', 'Lisa', 'John', 'Anna', 'Chris', 'Maya', 'Ryan', 'Sophie', 'Kevin', 'Rachel'];
                const lastNames = ['Smith', 'Johnson', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor', 'Anderson', 'Thomas', 'Jackson', 'White'];
                return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
            }

            generateAvatar() {
                const names = ['Alex', 'Sarah', 'Mike', 'Emma', 'David', 'Lisa', 'John', 'Anna', 'Chris', 'Maya'];
                const name = names[Math.floor(Math.random() * names.length)];
                return name.charAt(0) + (name.length > 3 ? name.charAt(name.length - 1) : name.charAt(1));
            }

            getRandomSkills(skillsList) {
                const count = Math.floor(Math.random() * 4) + 2;
                const shuffled = skillsList.sort(() => 0.5 - Math.random());
                return shuffled.slice(0, count);
            }

            loadActivityLog() {
                this.activityLog = [
                    { type: 'registration', text: 'Sarah Johnson registered from Stanford University', time: '2 minutes ago' },
                    { type: 'checkin', text: 'Mike Brown checked in at Event Center', time: '5 minutes ago' },
                    { type: 'team', text: 'Team "AI Innovators" formed with 4 members', time: '12 minutes ago' },
                    { type: 'registration', text: 'Emma Davis joined Web3 track', time: '18 minutes ago' },
                    { type: 'submission', text: 'Team "Code Warriors" submitted first milestone', time: '25 minutes ago' },
                    { type: 'checkin', text: 'Batch check-in completed: 23 participants', time: '35 minutes ago' },
                    { type: 'team', text: 'AI-powered team matching suggested 12 new combinations', time: '45 minutes ago' },
                    { type: 'registration', text: 'Kevin Martinez verified student status', time: '1 hour ago' }
                ];
            }

            filterParticipants() {
                const searchTerm = document.getElementById('searchInput').value.toLowerCase();
                const statusFilter = document.getElementById('statusFilter').value;
                const teamFilter = document.getElementById('teamFilter').value;
                const trackFilter = document.getElementById('trackFilter').value;

                this.filteredParticipants = this.participants.filter(participant => {
                    const matchesSearch = !searchTerm || 
                        participant.name.toLowerCase().includes(searchTerm) ||
                        participant.email.toLowerCase().includes(searchTerm) ||
                        participant.skills.some(skill => skill.toLowerCase().includes(searchTerm)) ||
                        (participant.university && participant.university.toLowerCase().includes(searchTerm)) ||
                        (participant.company && participant.company.toLowerCase().includes(searchTerm));

                    const matchesStatus = !statusFilter || participant.status === statusFilter;
                    const matchesTeam = !teamFilter || participant.teamStatus === teamFilter;
                    const matchesTrack = !trackFilter || participant.track === trackFilter;

                    return matchesSearch && matchesStatus && matchesTeam && matchesTrack;
                });

                this.currentPage = 1;
                this.renderParticipants();
            }

            renderParticipants() {
                const container = document.getElementById('participantsList');
                const startIndex = 0;
                const endIndex = this.currentPage * this.participantsPerPage;
                const participantsToShow = this.filteredParticipants.slice(startIndex, endIndex);

                if (this.currentPage === 1) {
                    container.innerHTML = '';
                }

                if (participantsToShow.length === 0 && this.currentPage === 1) {
                    container.innerHTML = `
                        <div style="text-align: center; padding: 3rem; color: var(--text-muted);">
                            <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                            <h3 style="margin-bottom: 0.5rem;">No participants found</h3>
                            <p>Try adjusting your filters or search terms.</p>
                        </div>
                    `;
                    document.getElementById('loadMoreBtn').style.display = 'none';
                    return;
                }

                const startShowIndex = this.currentPage === 1 ? startIndex : (this.currentPage - 1) * this.participantsPerPage;
                participantsToShow.slice(startShowIndex >= 0 ? 0 : startShowIndex).forEach((participant, index) => {
                    const participantDiv = document.createElement('div');
                    participantDiv.className = 'participant-row';
                    participantDiv.style.opacity = '0';
                    participantDiv.style.transform = 'translateY(20px)';
                    participantDiv.innerHTML = `
                        <div class="participant-avatar">${participant.avatar}</div>
                        <div class="participant-info">
                            <div class="participant-name">${participant.name}</div>
                            <div class="participant-email">${participant.email}</div>
                            ${participant.university ? `<div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.25rem;"><i class="fas fa-university"></i> ${participant.university}</div>` : ''}
                            ${participant.company ? `<div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.25rem;"><i class="fas fa-building"></i> ${participant.company}</div>` : ''}
                            <div class="participant-skills">
                                ${participant.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                            </div>
                        </div>
                        <div class="participant-team">${participant.team}</div>
                        <div style="text-align: center;">
                            <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.25rem;">Experience</div>
                            <div style="font-size: 0.85rem; font-weight: 600;">${participant.experience}</div>
                        </div>
                        <div class="participant-status ${participant.status}">${this.capitalizeFirst(participant.status)}</div>
                        <div class="participant-actions">
                            <button class="action-btn-small view" onclick="viewParticipant(${participant.id})" title="View Profile">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="action-btn-small edit" onclick="editParticipant(${participant.id})" title="Edit">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="action-btn-small message" onclick="messageParticipant(${participant.id})" title="Message">
                                <i class="fas fa-envelope"></i>
                            </button>
                        </div>
                    `;
                    container.appendChild(participantDiv);

                    // Animate in
                    setTimeout(() => {
                        participantDiv.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                        participantDiv.style.opacity = '1';
                        participantDiv.style.transform = 'translateY(0)';
                    }, index * 100);
                });

                // Update load more button
                const loadMoreBtn = document.getElementById('loadMoreBtn');
                if (endIndex >= this.filteredParticipants.length) {
                    loadMoreBtn.style.display = 'none';
                } else {
                    loadMoreBtn.style.display = 'inline-flex';
                    loadMoreBtn.innerHTML = `
                        <i class="fas fa-plus-circle"></i>
                        Load More (${this.filteredParticipants.length - endIndex} remaining)
                    `;
                }
            }

            renderActivity() {
                const container = document.getElementById('activityList');
                container.innerHTML = '';

                this.activityLog.forEach((activity, index) => {
                    const activityDiv = document.createElement('div');
                    activityDiv.className = `activity-item ${activity.type}`;
                    activityDiv.style.opacity = '0';
                    activityDiv.style.transform = 'translateX(20px)';
                    activityDiv.innerHTML = `
                        <div class="activity-icon ${activity.type}">
                            <i class="fas ${this.getActivityIcon(activity.type)}"></i>
                        </div>
                        <div class="activity-details">
                            <div class="activity-text">${activity.text}</div>
                            <div class="activity-time">${activity.time}</div>
                        </div>
                    `;
                    container.appendChild(activityDiv);

                    // Animate in
                    setTimeout(() => {
                        activityDiv.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                        activityDiv.style.opacity = '1';
                        activityDiv.style.transform = 'translateX(0)';
                    }, index * 150);
                });
            }

            getActivityIcon(type) {
                const icons = {
                    registration: 'fa-user-plus',
                    checkin: 'fa-check-circle',
                    team: 'fa-users',
                    submission: 'fa-file-upload'
                };
                return icons[type] || 'fa-circle';
            }

            initializeChart() {
                const ctx = document.getElementById('registrationChart').getContext('2d');
                const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
                
                // Registration data for the last 7 days
                const registrationData = [45, 67, 89, 123, 145, 178, 201];
                
                this.chart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                        datasets: [{
                            label: 'Daily Registrations',
                            data: registrationData,
                            borderColor: '#10b981',
                            backgroundColor: 'rgba(16, 185, 129, 0.1)',
                            borderWidth: 3,
                            fill: true,
                            tension: 0.4,
                            pointBackgroundColor: '#10b981',
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
                    this.addRandomActivity();
                }, 30000); // Update every 30 seconds
            }

            updateLiveStats() {
                // Simulate stat changes
                const changes = {
                    totalRegistered: Math.random() > 0.8 ? Math.floor(Math.random() * 3) + 1 : 0,
                    totalCheckedIn: Math.random() > 0.7 ? Math.floor(Math.random() * 5) + 1 : 0,
                    totalTeams: Math.random() > 0.9 ? Math.floor(Math.random() * 2) + 1 : 0
                };

                Object.entries(changes).forEach(([key, change]) => {
                    if (change > 0) {
                        const element = document.getElementById(key);
                        if (element) {
                            const currentValue = parseInt(element.textContent.replace(/,/g, ''));
                            const newValue = currentValue + change;
                            element.textContent = newValue.toLocaleString();
                            this.animateStatChange(element);
                        }
                    }
                });
            }

            addRandomActivity() {
                const randomActivities = [
                    { type: 'registration', text: 'New participant registered from MIT', time: 'Just now' },
                    { type: 'checkin', text: 'Team lead checked in at registration desk', time: 'Just now' },
                    { type: 'team', text: 'New team formed with AI matching', time: 'Just now' },
                    { type: 'submission', text: 'First project milestone completed', time: 'Just now' }
                ];

                if (Math.random() > 0.7) {
                    const newActivity = randomActivities[Math.floor(Math.random() * randomActivities.length)];
                    this.activityLog.unshift(newActivity);
                    this.activityLog = this.activityLog.slice(0, 8); // Keep only 8 latest
                    this.renderActivity();
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
                document.getElementById('statusFilter').value = status;
                this.filterParticipants();
            }

            openTeamFormation() {
                this.showToast('Opening team formation dashboard...', 'info');
                setTimeout(() => {
                    window.location.href = 'team-formation.html';
                }, 1000);
            }

            // Participant Actions
            viewParticipant(id) {
                const participant = this.participants.find(p => p.id === id);
                if (participant) {
                    this.showToast(`Opening detailed profile for ${participant.name}...`, 'info');
                }
            }

            editParticipant(id) {
                const participant = this.participants.find(p => p.id === id);
                if (participant) {
                    this.showToast(`Opening edit form for ${participant.name}...`, 'info');
                }
            }

            messageParticipant(id) {
                const participant = this.participants.find(p => p.id === id);
                if (participant) {
                    this.showToast(`Composing message to ${participant.name}...`, 'info');
                }
            }

            // AI Functions
            getAIInsights() {
                this.showToast('Analyzing participant data with AI...', 'info');
                
                setTimeout(() => {
                    const insights = [
                        '🎯 Team formation completion rate: 78% (Above average)',
                        '📊 Web3 track has highest engagement (+32%)',
                        '🏆 Stanford participants show 45% higher check-in rate',
                        '⚡ Peak registration time: 2-4 PM EST',
                        '🤝 AI suggests 23 new team combinations'
                    ];
                    
                    const randomInsight = insights[Math.floor(Math.random() * insights.length)];
                    this.showToast(randomInsight, 'success');
                }, 2000);
            }

            // Bulk Actions
            bulkActions() {
                this.showToast('Opening bulk actions panel...', 'info');
            }

            bulkCheckIn() {
                this.showToast('Opening bulk check-in interface...', 'info');
            }

            teamRecommendations() {
                this.showToast('Generating AI-powered team recommendations...', 'info');
                
                setTimeout(() => {
                    this.showToast('AI found 23 optimal team combinations based on skills and experience!', 'success');
                }, 2000);
            }

            sendBulkMessage() {
                this.showToast('Opening broadcast message composer...', 'info');
            }

            generateCertificates() {
                this.showToast('Starting bulk certificate generation...', 'info');
                
                setTimeout(() => {
                    this.showToast('Generated 1,247 participation certificates successfully!', 'success');
                }, 3000);
            }

            exportParticipants() {
                const csvContent = this.generateCSV();
                const blob = new Blob([csvContent], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `participants-${new Date().toISOString().split('T')[0]}.csv`;
                a.click();
                URL.revokeObjectURL(url);
                this.showToast('Advanced participant data exported successfully!', 'success');
            }

            generateCSV() {
                let csvContent = 'Name,Email,Status,Track,Team,Skills,University,Company,Experience,Registered At,Checked In At\n';
                
                this.participants.forEach(participant => {
                    const skills = participant.skills.join('; ');
                    const registeredAt = new Date(participant.registeredAt).toLocaleDateString();
                    const checkedInAt = participant.checkedInAt ? new Date(participant.checkedInAt).toLocaleDateString() : 'Not checked in';
                    csvContent += `"${participant.name}","${participant.email}","${participant.status}","${participant.track}","${participant.team}","${skills}","${participant.university || 'N/A'}","${participant.company || 'N/A'}","${participant.experience}","${registeredAt}","${checkedInAt}"\n`;
                });
                
                return csvContent;
            }

            // Header Actions
            sendMessage() {
                this.showToast('Opening advanced message composer...', 'info');
            }

            exportReport() {
                this.showToast('Generating comprehensive analytics report...', 'info');
                
                setTimeout(() => {
                    this.showToast('Advanced analytics report generated with AI insights!', 'success');
                }, 3000);
            }

            // Table Actions
            refreshList() {
                this.showToast('Refreshing participant data...', 'info');
                
                setTimeout(() => {
                    this.loadParticipants();
                    this.renderParticipants();
                    this.showToast('Participant list refreshed with latest data!', 'success');
                }, 1500);
            }

            addParticipant() {
                this.showToast('Opening advanced participant registration form...', 'info');
            }

            loadMoreParticipants() {
                this.currentPage++;
                this.renderParticipants();
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
        let modernParticipantManager;

        function filterByStatus(status) { modernParticipantManager.filterByStatus(status); }
        function openTeamFormation() { modernParticipantManager.openTeamFormation(); }
        function viewParticipant(id) { modernParticipantManager.viewParticipant(id); }
        function editParticipant(id) { modernParticipantManager.editParticipant(id); }
        function messageParticipant(id) { modernParticipantManager.messageParticipant(id); }
        function getAIInsights() { modernParticipantManager.getAIInsights(); }
        function bulkActions() { modernParticipantManager.bulkActions(); }
        function bulkCheckIn() { modernParticipantManager.bulkCheckIn(); }
        function teamRecommendations() { modernParticipantManager.teamRecommendations(); }
        function sendBulkMessage() { modernParticipantManager.sendBulkMessage(); }
        function generateCertificates() { modernParticipantManager.generateCertificates(); }
        function exportParticipants() { modernParticipantManager.exportParticipants(); }
        function sendMessage() { modernParticipantManager.sendMessage(); }
        function exportReport() { modernParticipantManager.exportReport(); }
        function refreshList() { modernParticipantManager.refreshList(); }
        function addParticipant() { modernParticipantManager.addParticipant(); }
        function loadMoreParticipants() { modernParticipantManager.loadMoreParticipants(); }
        function backToDashboard() { modernParticipantManager.backToDashboard(); }

        document.addEventListener('DOMContentLoaded', () => {
            modernParticipantManager = new ModernParticipantManager();
            
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
                    name: modernParticipantManager.currentUser.name,
                    initials: modernParticipantManager.currentUser.initials,
                    role: modernParticipantManager.currentUser.role,
                    lastActive: Date.now()
                };
                localStorage.setItem('modernOrganizerSession', JSON.stringify(sessionData));
            }, 60000); // Save every minute
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
            .stat-card, .participant-row, .activity-item, .quick-action { transition: var(--transition) !important; }
            @media (hover: hover) and (pointer: fine) {
                .stat-card:hover { transform: translateY(-8px) scale(1.02) !important; }
                .participant-row:hover { transform: translateY(-4px) !important; }
                .activity-item:hover { transform: translateX(6px) !important; }
                .quick-action:hover { transform: translateY(-6px) scale(1.02) !important; }
            }
            *:focus-visible { outline: 2px solid var(--primary) !important; outline-offset: 2px !important; }
            
            /* Enhanced skill tags */
            .skill-tag {
                background: var(--bg-participant) !important;
                color: var(--organizer-green) !important;
                border: 1px solid var(--border-participant) !important;
                transition: var(--transition) !important;
            }
            .skill-tag:hover {
                transform: scale(1.05) !important;
                box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3) !important;
            }
            
            /* Participant status enhanced colors */
            .participant-status.registered { 
                background: var(--gradient-participant) !important;
                box-shadow: var(--shadow-participant) !important;
            }
            .participant-status.checked-in { 
                background: var(--gradient-success) !important;
                box-shadow: 0 4px 16px rgba(16, 185, 129, 0.3) !important;
            }
            .participant-status.pending { 
                background: var(--gradient-warning) !important;
                box-shadow: 0 4px 16px rgba(245, 158, 11, 0.3) !important;
            }
            
            /* Loading animations */
            .loading { opacity: 0.7; pointer-events: none; }
            .loading::after {
                content: '';
                position: absolute;
                width: 16px; height: 16px;
                border: 2px solid transparent;
                border-top: 2px solid currentColor;
                border-radius: 50%;
                animation: spin 1s infinite linear;
                top: 50%; left: 50%;
                transform: translate(-50%, -50%);
            }
            @keyframes spin {
                from { transform: translate(-50%, -50%) rotate(0deg); }
                to { transform: translate(-50%, -50%) rotate(360deg); }
            }
        `;
        document.head.appendChild(style);