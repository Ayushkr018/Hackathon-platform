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
                this.setupEnhancements();
            }

            // ✅ THEME COLOR COMBINATION - MATCHING BATCH EVALUATION
            initializeTheme() {
                const savedTheme = localStorage.getItem('theme') || 'dark';
                document.documentElement.setAttribute('data-theme', savedTheme);
                
                const themeToggle = document.getElementById('themeToggle');
                const themeIcon = themeToggle.querySelector('i');
                themeIcon.className = savedTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
                
                // Smooth theme transition
                document.documentElement.style.transition = 'all 0.3s ease';
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

                // ✅ THEME TOGGLE WITH SMOOTH TRANSITION
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

            // ✅ SETUP ENHANCEMENTS
            setupEnhancements() {
                // Add noselect class to body
                document.body.classList.add('noselect');

                // Setup NexusHack logo link
                const logoText = document.querySelector('.logo-text a');
                if (logoText) {
                    logoText.addEventListener('click', (e) => {
                        e.preventDefault();
                        this.showLoader();
                        setTimeout(() => {
                            this.completeLoader();
                            window.location.href = 'index.html';
                        }, 1000);
                    });
                }
            }

            setupTouchGestures() {
                let startX, startY, endX, endY;
                
                document.addEventListener('touchstart', (e) => {
                    startX = e.touches[0].clientX;
                    startY = e.touches.clientY;
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

            // ✅ THEME TOGGLE WITH SMOOTH TRANSITION
            toggleTheme() {
                const html = document.documentElement;
                const currentTheme = html.getAttribute('data-theme');
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                
                // Add smooth transition
                html.style.transition = 'all 0.3s ease';
                html.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
                
                const themeIcon = document.getElementById('themeToggle').querySelector('i');
                themeIcon.className = newTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
                
                this.showToast(`Theme changed to ${newTheme} mode ✨`, 'success');
                
                // Remove transition after completion
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
                
                // Animate to 60%
                setTimeout(() => {
                    loaderBar.style.width = '60%';
                }, 50);
            }

            completeLoader() {
                const loaderBar = document.getElementById('loaderBar');
                if (loaderBar) {
                    // Complete to 100%
                    loaderBar.style.width = '100%';
                    
                    // Hide after completion
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

            loadDashboardData() {
                this.showLoader();
                
                setTimeout(() => {
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
                    
                    this.completeLoader();
                }, 800);
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
                    this.showLoader();
                    
                    setTimeout(() => {
                        const filteredProjects = this.projects.filter(project =>
                            project.title.toLowerCase().includes(query.toLowerCase()) ||
                            project.team.toLowerCase().includes(query.toLowerCase()) ||
                            project.event.toLowerCase().includes(query.toLowerCase()) ||
                            project.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
                        );
                        
                        this.completeLoader();
                        this.showToast(`Found ${filteredProjects.length} results for "${query}" 🔍`, 'info');
                    }, 800);
                }
            }

            showProjectDetails(projectId) {
                const project = this.projects.find(p => p.id === projectId);
                if (project) {
                    this.showToast(`Loading details for "${project.title}"... 📋`, 'info');
                    this.showLoader();
                    
                    setTimeout(() => {
                        this.completeLoader();
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
                    this.showToast('New project submission received! 📥', 'info');
                }
            }

            addActivity(activity) {
                this.activities.unshift(activity);
                if (this.activities.length > 50) {
                    this.activities = this.activities.slice(0, 50);
                }
                this.saveActivities();
            }

            // ✅ NOTIFICATION VISIBILITY WITH AUTO-DISMISS
            showToast(message, type = 'success') {
                // Remove existing toast
                const existingToast = document.querySelector('.toast');
                if (existingToast) {
                    existingToast.remove();
                }
                
                // Create new toast with batch evaluation theme colors
                const toast = document.createElement('div');
                toast.className = `toast ${type}`;
                toast.innerHTML = `
                    <i class="fas ${this.getToastIcon(type)}" style="margin-right: 8px;"></i>
                    ${message}
                `;
                
                // Mobile responsive positioning
                if (window.innerWidth <= 768) {
                    toast.style.top = '15px';
                    toast.style.right = '15px';
                    toast.style.left = '15px';
                    toast.style.maxWidth = 'none';
                }
                
                document.body.appendChild(toast);
                
                // Auto-dismiss after 4 seconds
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
            judgeDashboard.showToast('Opening evaluation interface... 🚀', 'info');
            judgeDashboard.showLoader();
            setTimeout(() => {
                judgeDashboard.completeLoader();
                window.location.href = 'evaluation.html';
            }, 1000);
        }

        function viewAssignedEvents() {
            judgeDashboard.showToast('Loading assigned events... 📅', 'info');
            judgeDashboard.showLoader();
            setTimeout(() => {
                judgeDashboard.completeLoader();
                window.location.href = 'assigned-events.html';
            }, 1000);
        }

        function conductInterview() {
            judgeDashboard.showToast('Preparing video interview interface... 🎥', 'info');
            judgeDashboard.showLoader();
            setTimeout(() => {
                judgeDashboard.completeLoader();
                window.location.href = 'video-interview.html';
            }, 1000);
        }

        function reviewCode() {
            judgeDashboard.showToast('Loading code review tools... 💻', 'info');
            judgeDashboard.showLoader();
            setTimeout(() => {
                judgeDashboard.completeLoader();
                window.location.href = 'code-review.html';
            }, 1000);
        }

        function evaluateProject(projectId) {
            judgeDashboard.showToast('Starting evaluation process... ⭐', 'info');
            judgeDashboard.showLoader();
            setTimeout(() => {
                localStorage.setItem('evaluateProjectId', projectId);
                judgeDashboard.completeLoader();
                window.location.href = 'evaluation.html';
            }, 1000);
        }

        function previewProject(projectId) {
            judgeDashboard.showToast('Loading project preview... 👀', 'info');
            judgeDashboard.showLoader();
            setTimeout(() => {
                judgeDashboard.completeLoader();
                console.log('Preview project:', projectId);
            }, 1000);
        }

        function startBatchEvaluation() {
            judgeDashboard.showToast('Preparing batch evaluation interface... 📊', 'info');
            judgeDashboard.showLoader();
            setTimeout(() => {
                judgeDashboard.completeLoader();
                window.location.href = 'batch-evaluation.html';
            }, 1000);
        }

        function logout() {
            if (confirm('Are you sure you want to logout?')) {
                localStorage.removeItem('judgeSession');
                judgeDashboard.showToast('Logging out... 👋', 'info');
                judgeDashboard.showLoader();
                setTimeout(() => {
                    judgeDashboard.completeLoader();
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
                        animation-duration: 0.2s !important;
                        transition-duration: 0.2s !important;
                    }
                `;
                document.head.appendChild(style);
            }
            
            // Auto-save user session
            setInterval(() => {
                const sessionData = {
                    name: judgeDashboard.currentUser.name,
                    initials: judgeDashboard.currentUser.initials,
                    role: judgeDashboard.currentUser.role,
                    lastActive: Date.now()
                };
                localStorage.setItem('judgeSession', JSON.stringify(sessionData));
            }, 60000); // Every minute
            
            // Keyboard shortcuts help
            console.log(`
🎯 NexusHack Judge Dashboard - Keyboard Shortcuts:
• Ctrl + / : Focus search
• Escape : Close mobile sidebar/modals
• Ctrl + R : Refresh data
• Ctrl + T : Toggle theme
• Ctrl + L : Logout
            `);
            
            // Add additional keyboard shortcuts
            document.addEventListener('keydown', (e) => {
                if (e.ctrlKey) {
                    switch(e.key) {
                        case 't':
                            e.preventDefault();
                            document.getElementById('themeToggle').click();
                            break;
                        case 'r':
                            e.preventDefault();
                            judgeDashboard.showToast('Refreshing dashboard data... 🔄', 'info');
                            judgeDashboard.showLoader();
                            setTimeout(() => {
                                judgeDashboard.loadDashboardData();
                                judgeDashboard.renderProjects();
                                judgeDashboard.renderActivities();
                                judgeDashboard.completeLoader();
                                judgeDashboard.showToast('Dashboard refreshed successfully! ✅', 'success');
                            }, 1500);
                            break;
                        case 'l':
                            e.preventDefault();
                            logout();
                            break;
                    }
                }
            });
            
            // Initialize progressive loading with stagger effect
            const loadElements = document.querySelectorAll('.metric-card, .action-card, .project-item, .activity-item');
            loadElements.forEach((element, index) => {
                element.style.opacity = '0';
                element.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, index * 50 + 500);
            });
            
            // Add click analytics (mock)
            document.addEventListener('click', (e) => {
                const target = e.target.closest('.action-card, .metric-card, .project-item, .nav-link');
                if (target) {
                    const elementType = target.className.split(' ')[0];
                    console.log(`Analytics: User clicked on ${elementType}`);
                }
            });
            
            // Add smooth scroll behavior
            const style = document.createElement('style');
            style.textContent = `
                html { scroll-behavior: smooth; }
            `;
            document.head.appendChild(style);
            
            // Welcome message after initialization with batch evaluation theme
            setTimeout(() => {
                judgeDashboard.showToast('Welcome back, Judge! Dashboard loaded with enhanced batch evaluation features 🎉', 'success');
            }, 2000);
            
            // Service worker registration for PWA capabilities
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.register('/sw.js')
                    .then(registration => {
                        console.log('SW registered:', registration);
                    })
                    .catch(error => {
                        console.log('SW registration failed:', error);
                    });
            }
            
            // Add visibility change handler
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    console.log('Dashboard went to background');
                } else {
                    console.log('Dashboard came to foreground');
                    // Refresh data when user returns
                    judgeDashboard.checkForUpdates();
                }
            });
            
            // Add online/offline status with batch theme colors
            window.addEventListener('online', () => {
                judgeDashboard.showToast('Connection restored - Dashboard online 🌐', 'success');
            });
            
            window.addEventListener('offline', () => {
                judgeDashboard.showToast('Connection lost - Working offline ⚡', 'warning');
            });
            
            // Add error boundary
            window.addEventListener('error', (event) => {
                console.error('Global error:', event.error);
                judgeDashboard.showToast('An error occurred - Please refresh the page 🔄', 'error');
            });
            
            // Add unhandled promise rejection handler
            window.addEventListener('unhandledrejection', (event) => {
                console.error('Unhandled promise rejection:', event.reason);
                judgeDashboard.showToast('Network error - Please check your connection 📶', 'warning');
            });
            
            // Initialize batch evaluation preview button
            const batchBtn = document.querySelector('button[onclick="startBatchEvaluation()"]');
            if (batchBtn) {
                batchBtn.style.background = 'var(--gradient-batch)';
                batchBtn.style.boxShadow = 'var(--shadow-batch)';
                batchBtn.addEventListener('mouseenter', () => {
                    batchBtn.style.animation = 'batchPulse 1s ease-in-out infinite';
                });
                batchBtn.addEventListener('mouseleave', () => {
                    batchBtn.style.animation = '';
                });
            }
        });

        // Enhanced animations and performance styles matching batch evaluation theme
        const enhancedStyle = document.createElement('style');
        enhancedStyle.textContent = `
            @keyframes slideInToast {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 0.95;
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
                        opacity: 0.95;
                    }
                }
            }
            
            /* Enhanced button interactions with batch theme */
            .btn:active {
                transform: translateY(-1px) scale(0.98);
            }
            
            .action-btn:active,
            .theme-toggle:active,
            .sidebar-toggle:active {
                transform: translateY(-1px) scale(0.95);
            }
            
            /* Enhanced card hover effects matching batch evaluation */
            @media (hover: hover) and (pointer: fine) {
                .action-card:hover {
                    transform: translateY(-8px) scale(1.02);
                    box-shadow: var(--shadow-xl);
                    border-color: var(--border-batch);
                }
                
                .metric-card:hover {
                    transform: translateY(-4px) scale(1.01);
                    box-shadow: var(--shadow-lg);
                    border-color: var(--border-batch);
                }
                
                .project-item:hover {
                    transform: translateY(-3px);
                    box-shadow: var(--shadow-lg);
                    border-color: var(--border-batch);
                }
            }
            
            /* Batch evaluation pulse animation */
            @keyframes batchPulse {
                0%, 100% { 
                    box-shadow: var(--shadow-batch); 
                    transform: scale(1);
                }
                50% { 
                    box-shadow: 0 0 30px rgba(6, 182, 212, 0.7); 
                    transform: scale(1.02);
                }
            }
            
            /* Loading animation for buttons */
            .btn.loading {
                position: relative;
                color: transparent !important;
            }
            
            .btn.loading::after {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                width: 16px;
                height: 16px;
                margin: -8px 0 0 -8px;
                border: 2px solid #ffffff;
                border-top-color: transparent;
                border-radius: 50%;
                animation: buttonSpinner 1s linear infinite;
            }
            
            @keyframes buttonSpinner {
                to {
                    transform: rotate(360deg);
                }
            }
            
            /* Enhanced focus states with batch theme */
            .nav-link:focus,
            .action-btn:focus,
            .btn:focus,
            .theme-toggle:focus,
            .sidebar-toggle:focus {
                outline: 3px solid var(--info);
                outline-offset: 2px;
                box-shadow: 0 0 0 6px rgba(6, 182, 212, 0.2);
            }
            
            /* Smooth theme transitions */
            * {
                transition: background-color 0.3s ease, 
                           color 0.3s ease, 
                           border-color 0.3s ease,
                           box-shadow 0.3s ease;
            }
            
            /* Enhanced scrollbar for webkit browsers with batch theme */
            ::-webkit-scrollbar {
                width: 8px;
                height: 8px;
            }
            
            ::-webkit-scrollbar-track {
                background: var(--bg-glass);
                border-radius: 4px;
            }
            
            ::-webkit-scrollbar-thumb {
                background: linear-gradient(to bottom, var(--info), var(--primary));
                border-radius: 4px;
                transition: all 0.3s ease;
            }
            
            ::-webkit-scrollbar-thumb:hover {
                background: linear-gradient(to bottom, var(--primary), var(--secondary));
                box-shadow: 0 0 10px rgba(6, 182, 212, 0.5);
            }
            
            /* Enhanced selection styles with batch theme */
            ::selection {
                background: var(--info);
                color: white;
                text-shadow: none;
            }
            
            ::-moz-selection {
                background: var(--info);
                color: white;
                text-shadow: none;
            }
            
            /* Print optimizations */
            @media print {
                * {
                    background: white !important;
                    color: black !important;
                    box-shadow: none !important;
                    text-shadow: none !important;
                }
                
                .sidebar,
                .topbar,
                .mobile-overlay,
                .toast,
                #loaderBar {
                    display: none !important;
                }
                
                .main-content {
                    margin: 0 !important;
                }
                
                .content {
                    padding: 1rem !important;
                }
                
                .action-card,
                .metric-card,
                .project-item {
                    break-inside: avoid;
                    margin-bottom: 1rem;
                    border: 1px solid #ccc;
                }
            }
            
            /* High contrast mode support */
            @media (prefers-contrast: high) {
                :root {
                    --border: #ffffff;
                    --text-secondary: #ffffff;
                    --text-muted: #cccccc;
                    --border-batch: #00ffff;
                }
                
                .action-card,
                .metric-card {
                    border: 2px solid var(--border);
                }
            }
            
            /* Reduced motion support */
            @media (prefers-reduced-motion: reduce) {
                *,
                *::before,
                *::after {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                    scroll-behavior: auto !important;
                }
            }
            
            /* Enhanced mobile optimizations */
            @media (max-width: 480px) {
                .dashboard-title {
                    font-size: 1.75rem !important;
                }
                
                .action-card {
                    padding: 1rem !important;
                }
                
                .metric-card {
                    padding: 1rem !important;
                }
                
                .toast {
                    font-size: 0.9rem !important;
                    padding: 10px 15px !important;
                }
            }
            
            /* Ultra-wide screen optimizations */
            @media (min-width: 2560px) {
                .dashboard-container {
                    max-width: 2400px;
                    margin: 0 auto;
                }
                
                .content {
                    max-width: 1800px;
                    margin: 0 auto;
                }
            }
            
            /* Dark theme enhancements with batch colors */
            [data-theme="dark"] {
                color-scheme: dark;
            }
            
            [data-theme="dark"] img {
                filter: brightness(0.8);
            }
            
            [data-theme="dark"] .nav-badge {
                background: var(--gradient-batch);
                color: white;
            }
            
            /* Light theme enhancements */
            [data-theme="light"] {
                color-scheme: light;
            }
            
            [data-theme="light"] .toast {
                color: var(--text-primary) !important;
                text-shadow: none;
            }
            
            [data-theme="light"] .nav-badge {
                background: var(--gradient-batch);
                color: white;
            }
            
            /* Performance optimizations */
            .action-card,
            .metric-card,
            .project-item,
            .activity-item {
                contain: layout style paint;
                will-change: transform, opacity;
            }
            
            /* Accessibility improvements */
            @media (prefers-reduced-transparency: reduce) {
                .bg-glass,
                .sidebar,
                .topbar {
                    backdrop-filter: none;
                }
            }
            
            /* Custom scrollbar for Firefox */
            @supports (scrollbar-width: thin) {
                * {
                    scrollbar-width: thin;
                    scrollbar-color: var(--info) var(--bg-glass);
                }
            }
            
            /* Enhanced loading states with batch theme */
            .skeleton {
                background: linear-gradient(90deg, 
                    var(--bg-glass) 25%, 
                    var(--bg-glass-hover) 50%, 
                    var(--bg-glass) 75%);
                background-size: 200% 100%;
                animation: skeleton-loading 1.5s infinite;
            }
            
            @keyframes skeleton-loading {
                0% {
                    background-position: 200% 0;
                }
                100% {
                    background-position: -200% 0;
                }
            }
            
            /* Batch evaluation specific enhancements */
            .btn-primary {
                background: var(--gradient-batch) !important;
                box-shadow: var(--shadow-batch) !important;
            }
            
            .btn-primary:hover {
                background: var(--gradient-hover) !important;
                box-shadow: var(--shadow-glow-strong) !important;
                transform: translateY(-2px) !important;
            }
            
            /* Enhanced nav badge animations */
            .nav-badge {
                animation: batchPulse 2s infinite;
            }
        `;
        document.head.appendChild(enhancedStyle);

        // Export functions for external use
        window.NexusHackJudge = {
            showToast: (message, type) => judgeDashboard?.showToast(message, type),
            showLoader: () => judgeDashboard?.showLoader(),
            completeLoader: () => judgeDashboard?.completeLoader(),
            toggleTheme: () => judgeDashboard?.toggleTheme(),
            refreshData: () => {
                if (judgeDashboard) {
                    judgeDashboard.loadDashboardData();
                    judgeDashboard.renderProjects();
                    judgeDashboard.renderActivities();
                }
            }
        };

        // Add version info with batch evaluation theme
        console.log(`
🎯 NexusHack Judge Dashboard v2.1.0
✅ Theme Toggle: Enhanced with batch evaluation colors
✅ Notifications: Always Visible + Auto-dismiss (batch theme)
✅ UX Loader: Top progress bar (gradient-batch)
✅ Non-selectable Text: With fadeInOut animation
✅ NexusHack Link: Redirects to landing page
✅ Batch Evaluation: Color theme matching
✅ Enhanced UI: Cyan-purple gradient accents
🚀 Platform ready for production with batch evaluation integration!
        `);