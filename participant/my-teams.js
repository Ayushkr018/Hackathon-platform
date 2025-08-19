// Advanced JavaScript for My Teams with Working Modals
        class MyTeams {
            constructor() {
                this.currentTab = 'active';
                this.currentTeam = null;
                this.teams = {
                    active: [
                        {
                            id: 'block-innovators',
                            name: 'Block Innovators',
                            project: 'DeFi Trading Platform',
                            event: 'Web3 Innovation Challenge',
                            progress: 78,
                            members: [
                                {id: 'JD', name: 'John Doe', role: 'Team Lead'},
                                {id: 'SM', name: 'Sarah Miller', role: 'Frontend Developer'},
                                {id: 'AK', name: 'Alex Kim', role: 'Backend Developer'},
                                {id: 'MJ', name: 'Maria Johnson', role: 'UI/UX Designer'}
                            ],
                            maxMembers: 5,
                            status: 'active',
                            avatar: '🚀'
                        },
                        {
                            id: 'healthtech-heroes',
                            name: 'HealthTech Heroes',
                            project: 'AI Diagnostic Assistant',
                            event: 'AI Healthcare Hackathon',
                            progress: 45,
                            members: [
                                {id: 'JD', name: 'John Doe', role: 'Team Lead'},
                                {id: 'DS', name: 'David Singh', role: 'ML Engineer'},
                                {id: 'LP', name: 'Lisa Park', role: 'Data Scientist'}
                            ],
                            maxMembers: 4,
                            status: 'preparing',
                            avatar: '🏥'
                        },
                        {
                            id: 'green-warriors',
                            name: 'Green Warriors',
                            project: 'Carbon Tracking System',
                            event: 'Climate Tech Solutions',
                            progress: 92,
                            members: [
                                {id: 'JD', name: 'John Doe', role: 'Team Lead'},
                                {id: 'EG', name: 'Emma Green', role: 'IoT Developer'},
                                {id: 'TC', name: 'Tom Chen', role: 'Backend Developer'},
                                {id: 'RK', name: 'Ryan Kumar', role: 'Data Analyst'},
                                {id: 'NP', name: 'Nina Patel', role: 'Frontend Developer'}
                            ],
                            maxMembers: 5,
                            status: 'active',
                            avatar: '🌱'
                        }
                    ],
                    completed: [
                        {
                            id: 'fintech-pioneers',
                            name: 'FinTech Pioneers',
                            project: 'Crypto Portfolio Manager',
                            event: 'FinTech Revolution 2024',
                            progress: 100,
                            members: [
                                {id: 'JD', name: 'John Doe', role: 'Team Lead'},
                                {id: 'MB', name: 'Michael Brown', role: 'Blockchain Developer'},
                                {id: 'JL', name: 'Jessica Lee', role: 'Frontend Developer'},
                                {id: 'CR', name: 'Carlos Rodriguez', role: 'Backend Developer'}
                            ],
                            maxMembers: 4,
                            status: 'completed',
                            result: '🏆 2nd Place',
                            avatar: '💰'
                        }
                    ],
                    archived: []
                };
                
                this.init();
            }

            init() {
                this.initializeTheme();
                this.initializeUser();
                this.setupEventListeners();
                this.setupModalEventListeners();
                this.animateProgressBars();
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

                // Close modals when clicking outside
                document.addEventListener('click', (e) => {
                    if (e.target.classList.contains('modal-overlay')) {
                        this.closeAllModals();
                    }
                });

                // ESC key to close modals
                document.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape') {
                        this.closeAllModals();
                    }
                });
            }

            setupModalEventListeners() {
                // Create Team Form
                const createTeamForm = document.getElementById('createTeamForm');
                createTeamForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.handleCreateTeam(e);
                });

                // Progress slider
                const progressSlider = document.getElementById('progressSlider');
                const progressValue = document.getElementById('progressValue');
                
                if (progressSlider && progressValue) {
                    progressSlider.addEventListener('input', (e) => {
                        progressValue.textContent = e.target.value + '%';
                    });
                }
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

            switchTab(tabName) {
                this.currentTab = tabName;
                
                // Update tab buttons
                document.querySelectorAll('.tab-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
                
                // Show/hide tab content
                document.querySelectorAll('.tab-content').forEach(content => {
                    content.style.display = 'none';
                });
                document.getElementById(`${tabName}Tab`).style.display = 'block';
                
                // Re-animate progress bars for the visible tab
                setTimeout(() => {
                    this.animateProgressBars();
                }, 100);
            }

            animateProgressBars() {
                const progressBars = document.querySelectorAll('.progress-fill');
                progressBars.forEach((bar, index) => {
                    setTimeout(() => {
                        const width = bar.style.width;
                        bar.style.width = '0%';
                        setTimeout(() => {
                            bar.style.width = width;
                        }, 100);
                    }, index * 200);
                });
            }

            performSearch(query) {
                console.log('Searching teams for:', query);
                // In real implementation, would filter teams based on query
                if (query.length > 2) {
                    this.showToast(`Searching for "${query}"...`, 'info');
                }
            }

            // Modal Functions
            openCreateTeamModal() {
                const modal = document.getElementById('createTeamModal');
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }

            closeCreateTeamModal() {
                const modal = document.getElementById('createTeamModal');
                modal.classList.remove('active');
                document.body.style.overflow = 'auto';
                
                // Reset form
                const form = document.getElementById('createTeamForm');
                form.reset();
            }

            openManageTeamModal(teamId) {
                this.currentTeam = this.findTeam(teamId);
                const modal = document.getElementById('manageTeamModal');
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
                
                // Update modal title
                const modalTitle = modal.querySelector('.modal-title');
                modalTitle.textContent = `Manage ${this.currentTeam?.name || 'Team'}`;
                
                // Update progress slider
                const progressSlider = document.getElementById('progressSlider');
                const progressValue = document.getElementById('progressValue');
                if (progressSlider && progressValue && this.currentTeam) {
                    progressSlider.value = this.currentTeam.progress;
                    progressValue.textContent = this.currentTeam.progress + '%';
                }
            }

            closeManageTeamModal() {
                const modal = document.getElementById('manageTeamModal');
                modal.classList.remove('active');
                document.body.style.overflow = 'auto';
                this.currentTeam = null;
            }

            closeAllModals() {
                this.closeCreateTeamModal();
                this.closeManageTeamModal();
            }

            handleCreateTeam(event) {
                const formData = new FormData(event.target);
                const teamData = Object.fromEntries(formData);
                
                // Validate form
                if (!teamData.teamName || !teamData.projectDescription || !teamData.targetEvent) {
                    this.showToast('Please fill in all required fields!', 'error');
                    return;
                }
                
                // Simulate team creation
                const submitBtn = event.target.querySelector('.btn-submit');
                const originalText = submitBtn.innerHTML;
                
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating...';
                submitBtn.disabled = true;
                
                setTimeout(() => {
                    this.showToast('Team created successfully! 🎉', 'success');
                    this.closeCreateTeamModal();
                    
                    // Reset button
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    
                    // In real implementation, would add team to data and refresh display
                    console.log('Created team with data:', teamData);
                }, 2000);
            }

            // Team Actions
            joinTeam() {
                this.showToast('Redirecting to team finder...', 'info');
                setTimeout(() => {
                    window.location.href = 'team-finder.html';
                }, 1000);
            }

            browseEvents() {
                this.showToast('Redirecting to events...', 'info');
                setTimeout(() => {
                    window.location.href = 'browse-events.html';
                }, 1000);
            }

            manageProfile() {
                this.showToast('Redirecting to profile...', 'info');
                setTimeout(() => {
                    window.location.href = 'profile.html';
                }, 1000);
            }

            enterTeam(teamId) {
                const team = this.findTeam(teamId);
                const button = event.target;
                const originalText = button.innerHTML;
                
                button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Entering...';
                button.disabled = true;
                
                setTimeout(() => {
                    this.showToast(`Entering ${team?.name || 'team'} workspace...`, 'success');
                    
                    // Reset button
                    button.innerHTML = originalText;
                    button.disabled = false;
                    
                    // In real implementation, would redirect to team workspace
                    console.log('Enter team functionality for:', teamId);
                }, 1500);
            }

            archiveTeam(teamId) {
                if (confirm('Are you sure you want to archive this team?')) {
                    const team = this.findTeam(teamId);
                    this.showToast(`${team?.name || 'Team'} archived successfully!`, 'success');
                    
                    // In real implementation, would move team to archived
                    setTimeout(() => {
                        console.log('Archive team functionality for:', teamId);
                    }, 500);
                }
            }

            viewProject(teamId) {
                const team = this.findTeam(teamId);
                this.showToast(`Loading ${team?.name || 'team'} project details...`, 'info');
                
                setTimeout(() => {
                    console.log('View project functionality for:', teamId);
                    // In real implementation, would show project details modal
                }, 1000);
            }

            findTeam(teamId) {
                for (const category in this.teams) {
                    const team = this.teams[category].find(t => t.id === teamId);
                    if (team) return team;
                }
                return null;
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
        let myTeams;

        function switchTab(tabName) {
            myTeams.switchTab(tabName);
        }

        function openCreateTeamModal() {
            myTeams.openCreateTeamModal();
        }

        function closeCreateTeamModal() {
            myTeams.closeCreateTeamModal();
        }

        function openManageTeamModal(teamId) {
            myTeams.openManageTeamModal(teamId);
        }

        function closeManageTeamModal() {
            myTeams.closeManageTeamModal();
        }

        function joinTeam() {
            myTeams.joinTeam();
        }

        function browseEvents() {
            myTeams.browseEvents();
        }

        function manageProfile() {
            myTeams.manageProfile();
        }

        function enterTeam(teamId) {
            myTeams.enterTeam(teamId);
        }

        function archiveTeam(teamId) {
            myTeams.archiveTeam(teamId);
        }

        function viewProject(teamId) {
            myTeams.viewProject(teamId);
        }

        function logout() {
            if (confirm('Are you sure you want to logout?')) {
                localStorage.removeItem('userSession');
                window.location.href = '../auth/login.html';
            }
        }

        // Initialize the application
        document.addEventListener('DOMContentLoaded', () => {
            myTeams = new MyTeams();
            
            // Animate team cards on page load
            setTimeout(() => {
                document.querySelectorAll('.team-card').forEach((card, index) => {
                    setTimeout(() => {
                        card.style.transform = 'translateY(-6px)';
                        setTimeout(() => {
                            card.style.transform = 'translateY(0)';
                        }, 200);
                    }, index * 150);
                });
            }, 500);
        });

        // Add animations
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
        `;
        document.head.appendChild(style);
