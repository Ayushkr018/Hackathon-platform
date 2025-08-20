
 // ADVANCED JAVASCRIPT - FULLY RESPONSIVE
        class JudgeDashboard {
            constructor() {
                this.projects = [];
                this.activities = [];
                this.currentUser = {
                    name: 'Dr. Jane Smith',
                    initials: 'JS',
                    role: 'Senior Judge',
                    id: 'judge_001'
                };
                this.isMobile = window.innerWidth <= 1024;
                
                this.init();
            }

            init() {
                this.initializeTheme();
                this.setupEventListeners();
                this.loadDashboardData();
                this.renderProjects();
                this.renderActivities();
                this.initializeUser();
                this.startRealTimeUpdates();
                this.handleResize();
            }

            initializeTheme() {
                const savedTheme = localStorage.getItem('theme') || 'dark';
                document.documentElement.setAttribute('data-theme', savedTheme);
                
                const themeToggle = document.getElementById('themeToggle');
                const themeIcon = themeToggle.querySelector('i');
                themeIcon.className = savedTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
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
                // Sidebar toggle
                document.getElementById('sidebarToggle').addEventListener('click', () => {
                    this.toggleSidebar();
                });

                // Theme toggle
                document.getElementById('themeToggle').addEventListener('click', () => {
                    this.toggleTheme();
                });

                // Mobile overlay
                document.getElementById('mobileOverlay').addEventListener('click', () => {
                    this.closeMobileSidebar();
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
                    this.handleResize();
                });

                // Handle orientation change
                window.addEventListener('orientationchange', () => {
                    setTimeout(() => {
                        this.handleResize();
                    }, 100);
                });

                // Keyboard shortcuts
                document.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape') {
                        this.closeMobileSidebar();
                    }
                    if (e.ctrlKey && e.key === '/') {
                        e.preventDefault();
                        const searchInput = document.getElementById('searchInput');
                        if (searchInput) {
                            searchInput.focus();
                        }
                    }
                });

                // Touch gestures for mobile
                this.setupTouchGestures();
            }

            setupTouchGestures() {
                let startX, startY, endX, endY;
                
                document.addEventListener('touchstart', (e) => {
                    startX = e.touches[0].clientX;
                                        startY = e.touches[0].clientY;
                });
                
                document.addEventListener('touchend', (e) => {
                    if (!startX || !startY) return;
                    
                    endX = e.changedTouches[0].clientX;
                    endY = e.changedTouches.clientY;
                    
                    const diffX = startX - endX;
                    const diffY = startY - endY;
                    
                    // Horizontal swipe detection
                    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                        if (diffX > 0) {
                            // Swipe left - close sidebar
                            this.closeMobileSidebar();
                        } else {
                            // Swipe right - open sidebar
                            if (this.isMobile) {
                                this.openMobileSidebar();
                            }
                        }
                    }
                    
                    startX = null;
                    startY = null;
                });
            }

            handleResize() {
                this.isMobile = window.innerWidth <= 1024;
                
                if (!this.isMobile) {
                    this.closeMobileSidebar();
                }
                
                // Adjust content padding for different screen sizes
                this.adjustContentPadding();
            }

            adjustContentPadding() {
                const content = document.querySelector('.content');
                if (window.innerWidth <= 480) {
                    content.style.setProperty('--content-padding', '1rem');
                } else if (window.innerWidth <= 768) {
                    content.style.setProperty('--content-padding', '1.5rem');
                } else {
                    content.style.setProperty('--content-padding', '2rem');
                }
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
                    const sidebar = document.getElementById('sidebar');
                    sidebar.classList.add('open');
                    this.showMobileOverlay();
                }
            }

            closeMobileSidebar() {
                const sidebar = document.getElementById('sidebar');
                sidebar.classList.remove('open');
                this.hideMobileOverlay();
            }

            toggleMobileOverlay() {
                const overlay = document.getElementById('mobileOverlay');
                overlay.classList.toggle('active');
            }

            showMobileOverlay() {
                const overlay = document.getElementById('mobileOverlay');
                overlay.classList.add('active');
            }

            hideMobileOverlay() {
                const overlay = document.getElementById('mobileOverlay');
                overlay.classList.remove('active');
            }

            toggleTheme() {
                const html = document.documentElement;
                const currentTheme = html.getAttribute('data-theme');
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                
                html.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
                
                const themeIcon = document.getElementById('themeToggle').querySelector('i');
                themeIcon.className = newTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
                
                this.showToast(`Theme changed to ${newTheme} mode`, 'success');
            }

            loadDashboardData() {
                const storedProjects = localStorage.getItem('judgeProjects');
                if (storedProjects) {
                    this.projects = JSON.parse(storedProjects);
                } else {
                    this.projects = this.getMockProjects();
                    this.saveProjects();
                }

                const storedActivities = localStorage.getItem('judgeActivities');
                if (storedActivities) {
                    this.activities = JSON.parse(storedActivities);
                } else {
                    this.activities = this.getMockActivities();
                    this.saveActivities();
                }
            }

            getMockProjects() {
                const now = Date.now();
                return [
                    {
                        id: 1,
                        title: 'DeFi Portfolio Tracker',
                        team: 'Blockchain Innovators',
                        event: 'Web3 Challenge 2025',
                        submittedAt: now - 3600000,
                        deadline: now + 86400000,
                        priority: 'high',
                        tags: ['Web3', 'DeFi', 'React'],
                        status: 'pending',
                        participants: 4
                    },
                    {
                        id: 2,
                        title: 'AI-Powered Health Assistant',
                        team: 'MedTech Warriors',
                        event: 'Healthcare Hack 2025',
                        submittedAt: now - 7200000,
                        deadline: now + 172800000,
                        priority: 'medium',
                        tags: ['AI', 'Healthcare', 'Python'],
                        status: 'pending',
                        participants: 3
                    },
                    {
                        id: 3,
                        title: 'Smart City Traffic Manager',
                        team: 'Urban Solutions',
                        event: 'Smart Cities Challenge',
                        submittedAt: now - 10800000,
                        deadline: now + 259200000,
                        priority: 'medium',
                        tags: ['IoT', 'Smart City', 'Node.js'],
                        status: 'pending',
                        participants: 5
                    },
                    {
                        id: 4,
                        title: 'Sustainable Energy Optimizer',
                        team: 'GreenTech Innovators',
                        event: 'Climate Tech Hackathon',
                        submittedAt: now - 14400000,
                        deadline: now + 432000000,
                        priority: 'low',
                        tags: ['Green Tech', 'Energy', 'Python'],
                        status: 'pending',
                        participants: 4
                    }
                ];
            }

            getMockActivities() {
                const now = Date.now();
                return [
                    {
                        id: 1,
                        type: 'evaluation',
                        icon: 'fa-clipboard-check',
                        title: 'Completed evaluation',
                        description: 'Scored "Crypto Trading Bot" project - 8.5/10',
                        time: now - 1800000,
                        project: 'Crypto Trading Bot'
                    },
                    {
                        id: 2,
                        type: 'feedback',
                        icon: 'fa-comment-alt',
                        title: 'Provided detailed feedback',
                        description: 'Left comprehensive review for Team Alpha',
                        time: now - 3600000,
                        project: 'NFT Marketplace'
                    },
                    {
                        id: 3,
                        type: 'interview',
                        icon: 'fa-video',
                        title: 'Conducted video interview',
                        description: 'Technical interview with Team Beta completed',
                        time: now - 5400000,
                        project: 'AI Assistant'
                    },
                    {
                        id: 4,
                        type: 'code_review',
                        icon: 'fa-code',
                        title: 'Code review completed',
                        description: 'Reviewed React.js implementation quality',
                        time: now - 7200000,
                        project: 'E-commerce Platform'
                    },
                    {
                        id: 5,
                        type: 'assignment',
                        icon: 'fa-calendar-plus',
                        title: 'New event assignment',
                        description: 'Assigned as judge for "Mobile App Challenge"',
                        time: now - 86400000,
                        project: 'Mobile App Challenge'
                    }
                ];
            }

            saveProjects() {
                localStorage.setItem('judgeProjects', JSON.stringify(this.projects));
            }

            saveActivities() {
                localStorage.setItem('judgeActivities', JSON.stringify(this.activities));
            }

            renderProjects() {
                const container = document.getElementById('projectQueue');
                container.innerHTML = '';

                if (this.projects.length === 0) {
                    container.innerHTML = `
                        <div class="empty-state">
                            <div class="empty-icon">
                                <i class="fas fa-inbox"></i>
                            </div>
                            <h3 class="empty-title">No projects to evaluate</h3>
                            <p class="empty-description">
                                You're all caught up! New project submissions will appear here.
                            </p>
                        </div>
                    `;
                    return;
                }

                const sortedProjects = this.projects
                    .filter(p => p.status === 'pending')
                    .sort((a, b) => {
                        const priorityOrder = { high: 0, medium: 1, low: 2 };
                        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
                            return priorityOrder[a.priority] - priorityOrder[b.priority];
                        }
                        return a.deadline - b.deadline;
                    });

                sortedProjects.forEach(project => {
                    const projectEl = document.createElement('div');
                    projectEl.className = `project-item ${project.priority === 'high' ? 'urgent' : ''}`;
                    projectEl.dataset.id = project.id;

                    projectEl.innerHTML = `
                        <div class="project-avatar">
                            <i class="fas fa-folder"></i>
                        </div>
                        <div class="project-details">
                            <h3 class="project-title">${project.title}</h3>
                            <div class="project-meta">
                                <span><i class="fas fa-users"></i> ${project.team}</span>
                                <span><i class="fas fa-calendar"></i> ${project.event}</span>
                                <span><i class="fas fa-clock"></i> Due ${this.formatDeadline(project.deadline)}</span>
                                <span><i class="fas fa-user-friends"></i> ${project.participants} members</span>
                            </div>
                            <div class="project-tags">
                                ${project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
                            </div>
                        </div>
                        <div class="project-actions">
                            <button class="btn btn-primary project-btn" onclick="evaluateProject(${project.id})">
                                <i class="fas fa-play"></i>
                                Evaluate
                            </button>
                            <button class="btn btn-secondary project-btn" onclick="previewProject(${project.id})">
                                <i class="fas fa-eye"></i>
                                Preview
                            </button>
                        </div>
                    `;

                    projectEl.addEventListener('click', (e) => {
                        if (!e.target.closest('button')) {
                            this.showProjectDetails(project.id);
                        }
                    });

                    container.appendChild(projectEl);
                });
            }

            renderActivities() {
                const container = document.getElementById('activityList');
                container.innerHTML = '';

                if (this.activities.length === 0) {
                    container.innerHTML = `
                        <div class="empty-state">
                            <div class="empty-icon">
                                <i class="fas fa-history"></i>
                            </div>
                            <h3 class="empty-title">No recent activity</h3>
                            <p class="empty-description">
                                Your evaluation activities will appear here.
                            </p>
                        </div>
                    `;
                    return;
                }

                const sortedActivities = this.activities
                    .sort((a, b) => b.time - a.time)
                    .slice(0, 6);

                sortedActivities.forEach(activity => {
                    const activityEl = document.createElement('div');
                    activityEl.className = 'activity-item';

                    activityEl.innerHTML = `
                        <div class="activity-icon">
                            <i class="fas ${activity.icon}"></i>
                        </div>
                        <div class="activity-content">
                            <div class="activity-title">${activity.title}</div>
                            <div class="activity-description">${activity.description}</div>
                        </div>
                        <div class="activity-time">${this.formatTime(activity.time)}</div>
                    `;

                    container.appendChild(activityEl);
                });
            }

            formatTime(timestamp) {
                const now = Date.now();
                const diff = now - timestamp;
                
                if (diff < 60000) {
                    return 'just now';
                } else if (diff < 3600000) {
                    const minutes = Math.floor(diff / 60000);
                    return `${minutes}m ago`;
                } else if (diff < 86400000) {
                    const hours = Math.floor(diff / 3600000);
                    return `${hours}h ago`;
                } else {
                    const days = Math.floor(diff / 86400000);
                    return `${days}d ago`;
                }
            }

            formatDeadline(timestamp) {
                const now = Date.now();
                const diff = timestamp - now;
                
                if (diff < 0) {
                    return 'Overdue';
                } else if (diff < 3600000) {
                    const minutes = Math.floor(diff / 60000);
                    return `in ${minutes}m`;
                } else if (diff < 86400000) {
                    const hours = Math.floor(diff / 3600000);
                    return `in ${hours}h`;
                } else {
                    const days = Math.floor(diff / 86400000);
                    return `in ${days}d`;
                }
            }

            performSearch(query) {
                console.log('Searching for:', query);
                if (query.length > 2) {
                    const filteredProjects = this.projects.filter(project =>
                        project.title.toLowerCase().includes(query.toLowerCase()) ||
                        project.team.toLowerCase().includes(query.toLowerCase()) ||
                        project.event.toLowerCase().includes(query.toLowerCase()) ||
                        project.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
                    );
                    
                    this.showToast(`Found ${filteredProjects.length} results for "${query}"`, 'info');
                }
            }

            showProjectDetails(projectId) {
                const project = this.projects.find(p => p.id === projectId);
                if (project) {
                    this.showToast(`Loading details for "${project.title}"...`, 'info');
                    setTimeout(() => {
                        console.log('Show project details:', project);
                    }, 1000);
                }
            }

            startRealTimeUpdates() {
                setInterval(() => {
                    this.checkForUpdates();
                }, 30000);
            }

            checkForUpdates() {
                const random = Math.random();
                if (random < 0.3) {
                    this.addActivity({
                        id: Date.now(),
                        type: 'update',
                        icon: 'fa-bell',
                        title: 'New project submission',
                        description: 'A new project has been submitted for evaluation',
                        time: Date.now(),
                        project: 'New Project'
                    });
                    this.renderActivities();
                    this.showToast('New project submission received!', 'info');
                }
            }

            addActivity(activity) {
                this.activities.unshift(activity);
                if (this.activities.length > 50) {
                    this.activities = this.activities.slice(0, 50);
                }
                this.saveActivities();
            }

            showToast(message, type = 'success') {
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
                
                // Mobile responsive toast positioning
                if (window.innerWidth <= 768) {
                    toast.style.top = '1rem';
                    toast.style.right = '1rem';
                    toast.style.left = '1rem';
                    toast.style.maxWidth = 'none';
                }
                
                toast.innerHTML = `
                    <i class="fas ${this.getToastIcon(type)}"></i>
                    <span style="margin-left: 0.5rem;">${message}</span>
                `;
                
                document.body.appendChild(toast);
                
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
                    case 'warning': return 'fa-exclamation-triangle';
                    default: return 'fa-check-circle';
                }
            }
        }

        // Global instance and functions
        let judgeDashboard;

        function startEvaluation() {
            judgeDashboard.showToast('Opening evaluation interface...', 'info');
            setTimeout(() => {
                window.location.href = 'evaluation.html';
            }, 1000);
        }

        function viewAssignedEvents() {
            judgeDashboard.showToast('Loading assigned events...', 'info');
            setTimeout(() => {
                window.location.href = 'assigned-events.html';
            }, 1000);
        }

        function conductInterview() {
            judgeDashboard.showToast('Preparing video interview interface...', 'info');
            setTimeout(() => {
                window.location.href = 'video-interview.html';
            }, 1000);
        }

        function reviewCode() {
            judgeDashboard.showToast('Loading code review tools...', 'info');
            setTimeout(() => {
                window.location.href = 'code-review.html';
            }, 1000);
        }

        function evaluateProject(projectId) {
            judgeDashboard.showToast('Starting evaluation process...', 'info');
            setTimeout(() => {
                localStorage.setItem('evaluateProjectId', projectId);
                window.location.href = 'evaluation.html';
            }, 1000);
        }

        function previewProject(projectId) {
            judgeDashboard.showToast('Loading project preview...', 'info');
            setTimeout(() => {
                console.log('Preview project:', projectId);
            }, 1000);
        }

        function startBatchEvaluation() {
            judgeDashboard.showToast('Preparing batch evaluation interface...', 'info');
            setTimeout(() => {
                window.location.href = 'batch-evaluation.html';
            }, 1000);
        }

        function logout() {
            if (confirm('Are you sure you want to logout?')) {
                localStorage.removeItem('judgeSession');
                judgeDashboard.showToast('Logging out...', 'info');
                setTimeout(() => {
                    window.location.href = '../auth/login.html';
                }, 1000);
            }
        }

        // Initialize the application
        document.addEventListener('DOMContentLoaded', () => {
            judgeDashboard = new JudgeDashboard();
            
            // Animate dashboard elements
            setTimeout(() => {
                document.querySelectorAll('.action-card').forEach((card, index) => {
                    setTimeout(() => {
                        card.style.transform = 'translateY(-4px)';
                        setTimeout(() => {
                            card.style.transform = 'translateY(0)';
                        }, 200);
                    }, index * 100);
                });
            }, 1000);
            
            // Performance optimization for mobile
            if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                document.body.classList.add('mobile-device');
                
                // Reduce animations on mobile for better performance
                const style = document.createElement('style');
                style.textContent = `
                    .mobile-device * {
                        animation-duration: 0.1s !important;
                        transition-duration: 0.1s !important;
                    }
                `;
                document.head.appendChild(style);
            }
        });

        // Add enhanced animations
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
            
            @media (max-width: 768px) {
                @keyframes slideInToast {
                    from {
                        transform: translateY(-100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
            }
            
            /* Loading animation */
            @keyframes loading {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            .loading {
                animation: loading 1s linear infinite;
            }
            
            /* Enhanced hover effects for desktop */
            @media (hover: hover) and (pointer: fine) {
                .action-card:hover {
                    transform: translateY(-8px) !important;
                    box-shadow: var(--shadow-xl) !important;
                }
                
                .metric-card:hover {
                    transform: translateY(-4px) !important;
                }
            }
            
            /* Smooth scrolling for all elements */
            * {
                scroll-behavior: smooth;
            }
            
            /* Better focus indicators */
            *:focus-visible {
                outline: 2px solid var(--primary) !important;
                outline-offset: 2px !important;
            }
        `;
        document.head.appendChild(style);
