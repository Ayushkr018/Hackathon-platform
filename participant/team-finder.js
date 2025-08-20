 // Advanced JavaScript for Team Finder
        class TeamFinder {
            constructor() {
                this.selectedSkills = [];
                this.activeFilters = {
                    event: '',
                    size: '',
                    role: '',
                    experience: '',
                    skills: []
                };
                this.teams = [];
                this.filteredTeams = [];
                this.isProcessing = false;
                
                this.init();
            }

            init() {
                this.initializeTheme();
                this.initializeUser();
                this.setupEventListeners();
                this.loadTeams();
            }

            initializeTheme() {
                const savedTheme = localStorage.getItem('theme') || 'dark';
                document.documentElement.setAttribute('data-theme', savedTheme);
                
                const themeToggle = document.getElementById('themeToggle');
                const themeIcon = themeToggle.querySelector('i');
                themeIcon.className = savedTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
            }

            initializeUser() {
                const userSession = localStorage.getItem('userSession');
                if (userSession) {
                    const session = JSON.parse(userSession);
                    const firstName = session.firstName || session.email.split('@')[0];
                    
                    document.getElementById('userName').textContent = session.firstName ? 
                        `${session.firstName} ${session.lastName || ''}`.trim() : 
                        firstName;
                    
                    const initials = session.firstName && session.lastName ? 
                        `${session.firstName[0]}${session.lastName}` : 
                        firstName.slice(0, 2).toUpperCase();
                    document.getElementById('userAvatar').textContent = initials;
                }
            }

            setupEventListeners() {
                // Theme toggle
                document.getElementById('themeToggle').addEventListener('click', () => {
                    this.toggleTheme();
                });

                // Sidebar toggle
                const sidebar = document.getElementById('sidebar');
                const sidebarToggle = document.getElementById('sidebarToggle');

                sidebarToggle.addEventListener('click', () => {
                    if (window.innerWidth <= 1024) {
                        sidebar.classList.toggle('open');
                    } else {
                        sidebar.classList.toggle('collapsed');
                    }
                });

                // Close mobile sidebar when clicking outside
                document.addEventListener('click', (e) => {
                    if (window.innerWidth <= 1024 && 
                        !sidebar.contains(e.target) && 
                        !sidebarToggle.contains(e.target) &&
                        sidebar.classList.contains('open')) {
                        sidebar.classList.remove('open');
                    }
                });

                // Search functionality
                const searchInput = document.getElementById('searchInput');
                let searchTimeout;

                searchInput.addEventListener('input', (e) => {
                    clearTimeout(searchTimeout);
                    searchTimeout = setTimeout(() => {
                        this.performSearch(e.target.value);
                    }, 300);
                });

                // Handle window resize
                window.addEventListener('resize', () => {
                    if (window.innerWidth > 1024) {
                        sidebar.classList.remove('open');
                    }
                });
            }

            toggleTheme() {
                const html = document.documentElement;
                const currentTheme = html.getAttribute('data-theme');
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                
                html.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
                
                const themeIcon = document.getElementById('themeToggle').querySelector('i');
                themeIcon.className = newTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
            }

            loadTeams() {
                // Simulate loading teams from API
                this.teams = [
                    {
                        id: 'block-innovators',
                        name: 'Block Innovators',
                        project: 'DeFi Trading Platform',
                        event: 'web3-innovation-2025',
                        description: 'Revolutionary DeFi trading platform with AI insights',
                        skills: ['Solidity', 'React', 'Web3.js', 'Node.js', 'Python'],
                        members: ['SM', 'AK'],
                        maxMembers: 5,
                        status: 'recruiting',
                        lookingFor: ['fullstack', 'blockchain'],
                        experience: 'intermediate'
                    },
                    {
                        id: 'healthtech-heroes',
                        name: 'HealthTech Heroes',
                        project: 'AI Diagnostic Assistant',
                        event: 'ai-healthcare-2025',
                        description: 'AI-powered diagnostic assistant for doctors',
                        skills: ['TensorFlow', 'Python', 'FastAPI', 'React', 'Docker'],
                        members: ['MJ', 'DS', 'RK'],
                        maxMembers: 4,
                        status: 'almost-full',
                        lookingFor: ['ml'],
                        experience: 'advanced'
                    },
                    {
                        id: 'mobile-mavericks',
                        name: 'Mobile Mavericks',
                        project: 'Social Impact App',
                        event: 'mobile-innovation-2025',
                        description: 'Mobile app connecting volunteers with communities',
                        skills: ['Flutter', 'Firebase', 'Figma', 'Node.js', 'MongoDB'],
                        members: ['LP'],
                        maxMembers: 4,
                        status: 'recruiting',
                        lookingFor: ['mobile', 'designer'],
                        experience: 'beginner'
                    },
                    {
                        id: 'green-warriors',
                        name: 'Green Warriors',
                        project: 'Carbon Tracking System',
                        event: 'climate-tech-2025',
                        description: 'IoT-based carbon footprint tracking system',
                        skills: ['IoT', 'Python', 'Arduino', 'InfluxDB', 'Grafana'],
                        members: ['EG', 'TC'],
                        maxMembers: 5,
                        status: 'recruiting',
                        lookingFor: ['data', 'backend'],
                        experience: 'intermediate'
                    }
                ];

                this.filteredTeams = [...this.teams];
            }

            updateTeamFilters() {
                this.activeFilters.event = document.getElementById('eventFilter').value;
                this.activeFilters.size = document.getElementById('sizeFilter').value;
                this.activeFilters.role = document.getElementById('roleFilter').value;
                this.activeFilters.experience = document.getElementById('experienceFilter').value;
                this.activeFilters.skills = this.selectedSkills;
                
                console.log('Applying team filters:', this.activeFilters);
                
                this.showLoading();
                
                setTimeout(() => {
                    this.hideLoading();
                    this.filterTeams();
                }, 600);
            }

            toggleSkill(element) {
                const skill = element.dataset.skill;
                
                if (element.classList.contains('active')) {
                    element.classList.remove('active');
                    this.selectedSkills = this.selectedSkills.filter(s => s !== skill);
                } else {
                    element.classList.add('active');
                    this.selectedSkills.push(skill);
                }
                
                this.updateTeamFilters();
            }

            filterTeams() {
                let filtered = [...this.teams];
                
                // Filter by event
                if (this.activeFilters.event) {
                    filtered = filtered.filter(team => team.event === this.activeFilters.event);
                }
                
                // Filter by role needed
                if (this.activeFilters.role) {
                    filtered = filtered.filter(team => 
                        team.lookingFor.includes(this.activeFilters.role)
                    );
                }
                
                // Filter by experience
                if (this.activeFilters.experience) {
                    filtered = filtered.filter(team => team.experience === this.activeFilters.experience);
                }
                
                // Filter by team size
                if (this.activeFilters.size) {
                    filtered = filtered.filter(team => {
                        const size = team.maxMembers;
                        switch (this.activeFilters.size) {
                            case 'small': return size <= 3;
                            case 'medium': return size >= 4 && size <= 5;
                            case 'large': return size >= 6;
                            default: return true;
                        }
                    });
                }
                
                // Filter by skills
                if (this.selectedSkills.length > 0) {
                    filtered = filtered.filter(team => 
                        this.selectedSkills.some(skill => 
                            team.skills.some(teamSkill => 
                                teamSkill.toLowerCase().includes(skill.toLowerCase())
                            )
                        )
                    );
                }
                
                this.filteredTeams = filtered;
                this.updateTeamsDisplay();
            }

            updateTeamsDisplay() {
                const teamsGrid = document.getElementById('teamsGrid');
                const emptyState = document.getElementById('emptyState');
                
                if (this.filteredTeams.length === 0) {
                    teamsGrid.style.display = 'none';
                    emptyState.style.display = 'block';
                } else {
                    teamsGrid.style.display = 'grid';
                    emptyState.style.display = 'none';
                    
                    // Hide cards that don't match the filter
                    const cards = teamsGrid.children;
                    const displayedIds = this.filteredTeams.map(team => team.id);
                    
                    for (let card of cards) {
                        const teamId = this.getTeamIdFromCard(card);
                        if (displayedIds.includes(teamId)) {                            card.style.display = 'block';
                        } else {
                            card.style.display = 'none';
                        }
                    }
                }
            }

            getTeamIdFromCard(card) {
                // Extract team ID from card (would be data attribute in real implementation)
                const name = card.querySelector('.team-name')?.textContent;
                return this.teams.find(team => team.name === name)?.id || '';
            }

            performSearch(query) {
                if (query.length < 2) {
                    this.filteredTeams = [...this.teams];
                    this.updateTeamsDisplay();
                    return;
                }
                
                this.showLoading();
                
                setTimeout(() => {
                    this.hideLoading();
                    
                    // Filter by team name, project, or skills
                    this.filteredTeams = this.teams.filter(team => 
                        team.name.toLowerCase().includes(query.toLowerCase()) ||
                        team.project.toLowerCase().includes(query.toLowerCase()) ||
                        team.skills.some(skill => skill.toLowerCase().includes(query.toLowerCase()))
                    );
                    
                    this.updateTeamsDisplay();
                }, 400);
            }

            refreshTeams() {
                this.showLoading();
                
                setTimeout(() => {
                    this.hideLoading();
                    
                    // Simulate refresh with updated data
                    this.loadTeams();
                    this.updateTeamsDisplay();
                    this.showToast('Teams refreshed with latest updates!', 'success');
                }, 800);
            }

            resetFilters() {
                // Reset dropdowns
                document.getElementById('eventFilter').value = '';
                document.getElementById('sizeFilter').value = '';
                document.getElementById('roleFilter').value = '';
                document.getElementById('experienceFilter').value = '';
                
                // Reset skills
                document.querySelectorAll('.skill-tag').forEach(tag => {
                    tag.classList.remove('active');
                });
                this.selectedSkills = [];
                
                // Reset search
                document.getElementById('searchInput').value = '';
                
                // Reset filters
                this.activeFilters = {
                    event: '',
                    size: '',
                    role: '',
                    experience: '',
                    skills: []
                };
                
                // Reset display
                this.filteredTeams = [...this.teams];
                this.updateTeamsDisplay();
                
                this.showToast('Filters reset to default!', 'info');
            }

            createTeam() {
                this.showToast('Redirecting to team creation...', 'info');
                // In real implementation, would open team creation modal or redirect
                setTimeout(() => {
                    console.log('Create team functionality');
                }, 1000);
            }

            showTeamTips() {
                this.showToast('💡 Tip: Complete your profile and showcase your skills to attract the best teams!', 'info');
            }

            joinTeam(teamId) {
                const button = event.target;
                const originalText = button.innerHTML;
                
                button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Requesting...';
                button.disabled = true;
                
                setTimeout(() => {
                    button.innerHTML = '<i class="fas fa-check"></i> Request Sent!';
                    button.style.background = 'var(--gradient-success)';
                    
                    const team = this.teams.find(t => t.id === teamId);
                    this.showToast(`Join request sent to ${team?.name || 'team'} successfully!`, 'success');
                    
                    setTimeout(() => {
                        button.innerHTML = originalText;
                        button.disabled = false;
                        button.style.background = 'var(--gradient-primary)';
                    }, 3000);
                }, 1200);
            }

            viewTeam(teamId) {
                const team = this.teams.find(t => t.id === teamId);
                this.showToast(`Loading ${team?.name || 'team'} details...`, 'info');
                
                setTimeout(() => {
                    console.log('Viewing team details for:', teamId);
                    // In real implementation, would open team details modal
                }, 500);
            }

            contactTeam(teamId) {
                const team = this.teams.find(t => t.id === teamId);
                this.showToast(`Opening chat with ${team?.name || 'team'}...`, 'info');
                
                setTimeout(() => {
                    window.location.href = `../shared/chat.html?team=${teamId}`;
                }, 1000);
            }

            showLoading() {
                document.getElementById('teamsLoading').style.display = 'grid';
                document.getElementById('teamsGrid').style.display = 'none';
                document.getElementById('emptyState').style.display = 'none';
            }

            hideLoading() {
                document.getElementById('teamsLoading').style.display = 'none';
                this.updateTeamsDisplay();
            }

            showToast(message, type = 'success') {
                // Remove any existing toasts
                const existingToast = document.querySelector('.toast');
                if (existingToast) {
                    existingToast.remove();
                }
                
                const toast = document.createElement('div');
                toast.className = `toast ${type}`;
                toast.style.cssText = `
                    position: fixed;
                    top: 2rem;
                    right: 2rem;
                    padding: 1rem 1.5rem;
                    border-radius: 12px;
                    color: white;
                    font-weight: 500;
                    z-index: 10001;
                    animation: slideInToast 0.3s ease-out;
                    max-width: 350px;
                    box-shadow: var(--shadow-lg);
                    background: var(--gradient-${type});
                `;
                toast.innerHTML = `
                    <i class="fas ${this.getToastIcon(type)}"></i>
                    <span style="margin-left: 0.5rem;">${message}</span>
                `;
                
                document.body.appendChild(toast);
                
                // Auto remove after 4 seconds
                setTimeout(() => {
                    if (toast.parentNode) {
                        toast.remove();
                    }
                }, 4000);
            }

            getToastIcon(type) {
                switch (type) {
                    case 'success': return 'fa-check-circle';
                    case 'error': return 'fa-exclamation-circle';
                    case 'info': return 'fa-info-circle';
                    default: return 'fa-check-circle';
                }
            }
        }

        // Global functions for onclick handlers
        let teamFinder;

        function updateTeamFilters() {
            teamFinder.updateTeamFilters();
        }

        function toggleSkill(element) {
            teamFinder.toggleSkill(element);
        }

        function refreshTeams() {
            teamFinder.refreshTeams();
        }

        function resetFilters() {
            teamFinder.resetFilters();
        }

        function createTeam() {
            teamFinder.createTeam();
        }

        function showTeamTips() {
            teamFinder.showTeamTips();
        }

        function joinTeam(teamId) {
            teamFinder.joinTeam(teamId);
        }

        function viewTeam(teamId) {
            teamFinder.viewTeam(teamId);
        }

        function contactTeam(teamId) {
            teamFinder.contactTeam(teamId);
        }

        function logout() {
            if (confirm('Are you sure you want to logout?')) {
                localStorage.removeItem('userSession');
                window.location.href = '../auth/login.html';
            }
        }

        // Initialize the application
        document.addEventListener('DOMContentLoaded', () => {
            teamFinder = new TeamFinder();
            
            // Animate stats on page load
            setTimeout(() => {
                document.querySelectorAll('.team-stat').forEach((stat, index) => {
                    setTimeout(() => {
                        stat.style.transform = 'scale(1.05)';
                        setTimeout(() => {
                            stat.style.transform = 'scale(1)';
                        }, 200);
                    }, index * 200);
                });
            }, 1000);
        });

        // Add slide in animation keyframes
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInToast {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            .loading {
                display: inline-block;
                width: 12px;
                height: 12px;
                border: 2px solid rgba(255,255,255,0.3);
                border-radius: 50%;
                border-top-color: #fff;
                animation: spin 1s ease-in-out infinite;
            }
        `;
        document.head.appendChild(style);
