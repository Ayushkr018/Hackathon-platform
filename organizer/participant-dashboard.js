class ModernParticipantManager {
    constructor() {
        this.participants = [];
        this.filteredParticipants = [];
        this.activityLog = [];
        this.chart = null;
        this.currentPage = 1;
        this.participantsPerPage = 15;
        this.isMobile = window.innerWidth <= 1024;
        this.currentUser = {
            name: 'Alex Chen',
            initials: 'AC',
            role: 'Lead Organizer',
            id: 'org_001'
        };
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
        if (themeToggle) {
            themeToggle.querySelector('i').className = savedTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
        }
    }

    initializeUser() {
        const userSession = localStorage.getItem('modernOrganizerSession');
        if (userSession) {
            const session = JSON.parse(userSession);
            this.currentUser.name = session.name || this.currentUser.name;
            this.currentUser.initials = session.initials || this.currentUser.initials;
        }

        const userNameElement = document.getElementById('userName');
        const userAvatarElement = document.getElementById('userAvatar');

        if (userNameElement) userNameElement.textContent = this.currentUser.name;
        if (userAvatarElement) userAvatarElement.textContent = this.currentUser.initials;
    }

    setupEventListeners() {
        const sidebarToggle = document.getElementById('sidebarToggle');
        const themeToggle = document.getElementById('themeToggle');
        const mobileOverlay = document.getElementById('mobileOverlay');

        if (sidebarToggle) sidebarToggle.addEventListener('click', () => this.toggleSidebar());
        if (themeToggle) themeToggle.addEventListener('click', () => this.toggleTheme());
        if (mobileOverlay) mobileOverlay.addEventListener('click', () => this.closeMobileSidebar());

        window.addEventListener('resize', () => this.handleResize());
        this.setupTouchGestures();
    }

    setupFiltering() {
        const searchInput = document.getElementById('searchInput');
        const statusFilter = document.getElementById('statusFilter');
        const teamFilter = document.getElementById('teamFilter');
        const trackFilter = document.getElementById('trackFilter');

        if (searchInput) searchInput.addEventListener('input', () => this.filterParticipants());
        if (statusFilter) statusFilter.addEventListener('change', () => this.filterParticipants());
        if (teamFilter) teamFilter.addEventListener('change', () => this.filterParticipants());
        if (trackFilter) trackFilter.addEventListener('change', () => this.filterParticipants());
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

        // Enhanced grid resize handling
        this.handleGridResize();

        if (this.chart) this.chart.resize();
    }

    handleGridResize() {
        const dashboardGrid = document.querySelector('.dashboard-grid');
        if (!dashboardGrid) return;

        if (window.innerWidth <= 1200) {
            dashboardGrid.style.gridTemplateColumns = '1fr';
        } else if (window.innerWidth <= 1400) {
            dashboardGrid.style.gridTemplateColumns = '2fr 1fr';
        } else {
            dashboardGrid.style.gridTemplateColumns = '2.2fr 0.8fr';
        }
    }

    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        if (!sidebar) return;

        if (this.isMobile) {
            sidebar.classList.toggle('open');
            this.toggleMobileOverlay();
        } else {
            sidebar.classList.toggle('collapsed');
        }
    }

    openMobileSidebar() {
        if (this.isMobile) {
            const sidebar = document.getElementById('sidebar');
            if (sidebar) sidebar.classList.add('open');
            this.showMobileOverlay();
        }
    }

    closeMobileSidebar() {
        const sidebar = document.getElementById('sidebar');
        if (sidebar) sidebar.classList.remove('open');
        this.hideMobileOverlay();
    }

    toggleMobileOverlay() {
        const overlay = document.getElementById('mobileOverlay');
        if (overlay) overlay.classList.toggle('active');
    }

    showMobileOverlay() {
        const overlay = document.getElementById('mobileOverlay');
        if (overlay) overlay.classList.add('active');
    }

    hideMobileOverlay() {
        const overlay = document.getElementById('mobileOverlay');
        if (overlay) overlay.classList.remove('active');
    }

    toggleTheme() {
        const html = document.documentElement;
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);

        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            const themeIcon = themeToggle.querySelector('i');
            if (themeIcon) {
                themeIcon.className = newTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
            }
        }

        this.updateChartTheme(newTheme);
        this.showToast(`Theme changed to ${newTheme} mode`, 'success');
    }

    loadParticipants() {
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
        const searchInput = document.getElementById('searchInput');
        const statusFilter = document.getElementById('statusFilter');
        const teamFilter = document.getElementById('teamFilter');
        const trackFilter = document.getElementById('trackFilter');

        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        const statusValue = statusFilter ? statusFilter.value : '';
        const teamValue = teamFilter ? teamFilter.value : '';
        const trackValue = trackFilter ? trackFilter.value : '';

        this.filteredParticipants = this.participants.filter(participant => {
            const matchesSearch = !searchTerm ||
                participant.name.toLowerCase().includes(searchTerm) ||
                participant.email.toLowerCase().includes(searchTerm) ||
                participant.skills.some(skill => skill.toLowerCase().includes(searchTerm)) ||
                (participant.university && participant.university.toLowerCase().includes(searchTerm)) ||
                (participant.company && participant.company.toLowerCase().includes(searchTerm));

            const matchesStatus = !statusValue || participant.status === statusValue;
            const matchesTeam = !teamValue || participant.teamStatus === teamValue;
            const matchesTrack = !trackValue || participant.track === trackValue;

            return matchesSearch && matchesStatus && matchesTeam && matchesTrack;
        });

        this.currentPage = 1;
        this.renderParticipants();
    }

    renderParticipants() {
        const container = document.getElementById('participantsList');
        if (!container) return;

        const startIndex = 0;
        const endIndex = this.currentPage * this.participantsPerPage;
        const participantsToShow = this.filteredParticipants.slice(startIndex, endIndex);

        if (this.currentPage === 1) {
            container.innerHTML = '';
        }

        if (participantsToShow.length === 0 && this.currentPage === 1) {
            container.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <h3>No participants found</h3>
                    <p>Try adjusting your filters or search terms.</p>
                </div>
            `;
            return;
        }

        participantsToShow.forEach((participant, index) => {
            const row = document.createElement('div');
            row.className = 'participant-row';
            row.style.animationDelay = `${index * 0.05}s`;

            row.innerHTML = `
                <div class="participant-avatar">${participant.avatar}</div>
                <div class="participant-info">
                    <div class="participant-name">${participant.name}</div>
                    <div class="participant-email">${participant.email}</div>
                    <div class="participant-skills">
                        ${participant.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                    </div>
                </div>
                <div class="participant-team">${participant.team}</div>
                <div class="participant-status ${participant.status}">${participant.status.replace('-', ' ')}</div>
                <div class="participant-actions">
                    <button class="action-btn-small view" title="View Profile">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn-small edit" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn-small message" title="Message">
                        <i class="fas fa-envelope"></i>
                    </button>
                </div>
            `;

            container.appendChild(row);
        });
    }

    renderActivity() {
        const container = document.getElementById('activityList');
        if (!container) return;

        container.innerHTML = '';

        this.activityLog.forEach((activity, index) => {
            const activityElement = document.createElement('div');
            activityElement.className = `activity-item ${activity.type}`;
            activityElement.style.animationDelay = `${index * 0.1}s`;

            activityElement.innerHTML = `
                <div class="activity-icon ${activity.type}">
                    <i class="fas ${this.getActivityIcon(activity.type)}"></i>
                </div>
                <div class="activity-details">
                    <div class="activity-text">${activity.text}</div>
                    <div class="activity-time">${activity.time}</div>
                </div>
            `;

            container.appendChild(activityElement);
        });
    }

    getActivityIcon(type) {
        const icons = {
            'registration': 'fa-user-plus',
            'checkin': 'fa-check-circle',
            'team': 'fa-users',
            'submission': 'fa-upload',
            'default': 'fa-bell'
        };
        return icons[type] || icons.default;
    }

    initializeChart() {
        const chartContainer = document.getElementById('chartContainer');
        if (!chartContainer) return;

        chartContainer.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: var(--text-muted);">
                <i class="fas fa-chart-line" style="font-size: 2rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                <div style="font-weight: 600;">Live Analytics</div>
                <div style="font-size: 0.8rem; margin-top: 0.5rem;">Real-time participant data</div>
            </div>
        `;

        setTimeout(() => {
            this.setupActualChart();
        }, 1000);
    }

    setupActualChart() {
        const chartContainer = document.getElementById('chartContainer');
        if (!chartContainer) return;

        const canvas = document.createElement('canvas');
        canvas.id = 'participantChart';
        chartContainer.innerHTML = '';
        chartContainer.appendChild(canvas);

        const ctx = canvas.getContext('2d');

        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Registrations',
                    data: [65, 89, 120, 181, 156, 155, 140],
                    borderColor: 'rgba(102, 126, 234, 1)',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    tension: 0.4,
                    fill: true,
                    borderWidth: 2
                }, {
                    label: 'Check-ins',
                    data: [45, 67, 98, 134, 127, 132, 120],
                    borderColor: 'rgba(16, 185, 129, 1)',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    tension: 0.4,
                    fill: true,
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            color: 'var(--text-secondary)',
                            usePointStyle: true,
                            padding: 15,
                            font: {
                                size: 11
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: 'var(--text-muted)',
                            font: {
                                size: 10
                            }
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: 'var(--text-muted)',
                            font: {
                                size: 10
                            }
                        }
                    }
                }
            }
        });
    }

    updateChartTheme(theme) {
        if (!this.chart) return;

        const textColor = theme === 'dark' ? '#e2e8f0' : '#334155';
        const gridColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

        this.chart.options.plugins.legend.labels.color = textColor;
        this.chart.options.scales.y.ticks.color = textColor;
        this.chart.options.scales.x.ticks.color = textColor;
        this.chart.options.scales.y.grid.color = gridColor;
        this.chart.options.scales.x.grid.color = gridColor;

        this.chart.update();
    }

    startLiveUpdates() {
        setInterval(() => {
            this.simulateRealTimeUpdates();
        }, 30000);
    }

    simulateRealTimeUpdates() {
        const activities = [
            { type: 'registration', text: 'New participant registered', time: 'Just now' },
            { type: 'checkin', text: 'Participant checked in', time: 'Just now' },
            { type: 'team', text: 'New team formed', time: 'Just now' }
        ];

        const newActivity = activities[Math.floor(Math.random() * activities.length)];
        this.activityLog.unshift(newActivity);
        this.activityLog = this.activityLog.slice(0, 8);

        this.renderActivity();
    }

    initializeAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        document.querySelectorAll('.stat-card, .participant-row, .activity-item').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--gradient-${type === 'success' ? 'success' : 'primary'});
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            z-index: 10000;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
            font-weight: 600;
            font-size: 0.9rem;
        `;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(0)';
        }, 100);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => document.body.removeChild(toast), 300);
        }, 3000);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ModernParticipantManager();
});
