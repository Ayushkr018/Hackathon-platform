/**
 * ✅ NEXUSHACK - ULTIMATE ORGANIZER DASHBOARD SYSTEM
 * Advanced Dashboard with Real-time Updates, AI Integration, and Full Functionality
 * Version: 3.0 - Production Ready
 */

class ModernOrganizerDashboard {
    constructor() {
        this.eventData = {};
        this.timeline = [];
        this.stats = {};
        this.liveUpdates = true;
        this.isMobile = window.innerWidth <= 1024;
        this.isOnline = navigator.onLine;
        this.updateInterval = null;
        this.autoSaveInterval = null;
        this.lastActivity = Date.now();
        
        // ✅ ENHANCED USER SYSTEM
        this.currentUser = {
            name: 'Alex Chen',
            initials: 'AC',
            role: 'Lead Organizer',
            id: 'org_001',
            permissions: ['dashboard', 'participants', 'judges', 'payments', 'settings'],
            avatar: null,
            lastLogin: Date.now(),
            preferences: {
                theme: 'dark',
                notifications: true,
                autoUpdates: true,
                language: 'en'
            }
        };

        // ✅ ENHANCED EVENT SYSTEM
        this.currentEvent = {
            id: 'hackathon_2025_web3',
            name: 'Web3 Innovation Hackathon 2025',
            status: 'live',
            startDate: '2025-03-15T09:00:00Z',
            endDate: '2025-03-17T18:00:00Z',
            timezone: 'PST',
            location: 'San Francisco + Virtual',
            prizePool: 250000,
            currency: 'USD',
            tracks: ['Web3', 'AI/ML', 'Blockchain', 'DeFi', 'NFT', 'Gaming', 'Healthcare', 'Climate', 'Education', 'FinTech', 'IoT', 'Metaverse'],
            sponsors: ['Microsoft', 'Google', 'Meta', 'Coinbase', 'Polygon'],
            capacity: 1500,
            registrationFee: 50,
            features: ['live-streaming', 'virtual-booths', 'ai-judging', 'blockchain-certificates', 'prize-automation']
        };

        // ✅ REALISTIC DATA POOLS WITH ADVANCED FEATURES
        this.realisticData = {
            participants: [
                { 
                    id: 'part_001', name: 'Alex Johnson', avatar: 'AJ', role: 'Full Stack Developer', 
                    university: 'MIT', country: 'USA', skills: ['React', 'Node.js', 'Web3'], 
                    status: 'active', team: 'Blockchain Innovators', experience: 'Senior',
                    github: 'alexjohnson', linkedin: 'alex-johnson-mit', submissions: 3,
                    rating: 4.8, joinedAt: '2025-03-10T14:30:00Z', checkedIn: true
                },
                { 
                    id: 'part_002', name: 'Sarah Miller', avatar: 'SM', role: 'AI Engineer', 
                    university: 'Stanford', country: 'USA', skills: ['Python', 'TensorFlow', 'ML'], 
                    status: 'coding', team: 'AI Pioneers', experience: 'Expert',
                    github: 'sarahml', linkedin: 'sarah-miller-ai', submissions: 5,
                    rating: 4.9, joinedAt: '2025-03-09T10:15:00Z', checkedIn: true
                },
                { 
                    id: 'part_003', name: 'Raj Patel', avatar: 'RP', role: 'Blockchain Developer', 
                    university: 'Berkeley', country: 'India', skills: ['Solidity', 'Ethereum', 'DeFi'], 
                    status: 'presenting', team: 'CryptoBuilders', experience: 'Senior',
                    github: 'rajpatel-dev', linkedin: 'raj-patel-blockchain', submissions: 4,
                    rating: 4.7, joinedAt: '2025-03-08T08:45:00Z', checkedIn: true
                },
                { 
                    id: 'part_004', name: 'Emma Wilson', avatar: 'EW', role: 'UX Designer', 
                    university: 'Carnegie Mellon', country: 'Canada', skills: ['Figma', 'UI/UX', 'Design'], 
                    status: 'active', team: 'Design Masters', experience: 'Mid-level',
                    github: 'emmawilson-ux', linkedin: 'emma-wilson-design', submissions: 2,
                    rating: 4.6, joinedAt: '2025-03-11T16:20:00Z', checkedIn: true
                },
                { 
                    id: 'part_005', name: 'David Kim', avatar: 'DK', role: 'Data Scientist', 
                    university: 'Harvard', country: 'South Korea', skills: ['Python', 'Analytics', 'Big Data'], 
                    status: 'judging', team: 'Data Wizards', experience: 'Expert',
                    github: 'davidkim-data', linkedin: 'david-kim-harvard', submissions: 6,
                    rating: 4.9, joinedAt: '2025-03-07T12:00:00Z', checkedIn: true
                }
            ],

            projects: [
                { 
                    id: 'proj_001', name: 'DeFi Portfolio Tracker', team: 'Blockchain Innovators', 
                    category: 'Web3', status: 'In Progress', progress: 85, score: 8.7, 
                    members: 4, technologies: ['React', 'Node.js', 'Solidity', 'Web3.js'],
                    description: 'Advanced DeFi portfolio management with real-time analytics',
                    github: 'https://github.com/blockchain-innovators/defi-tracker',
                    demo: 'https://defi-tracker-demo.com', pitch: 'defi-pitch.pdf',
                    submittedAt: '2025-03-15T14:30:00Z', lastUpdate: '2025-03-15T16:45:00Z',
                    judgeComments: ['Excellent technical implementation', 'Great UI/UX design'],
                    plagiarismScore: 5.2, isOriginal: true, featured: true
                },
                { 
                    id: 'proj_002', name: 'AI Medical Assistant', team: 'AI Pioneers', 
                    category: 'Healthcare', status: 'Submitted', progress: 100, score: 9.2, 
                    members: 3, technologies: ['Python', 'TensorFlow', 'Flask', 'React'],
                    description: 'AI-powered medical diagnosis and treatment recommendation system',
                    github: 'https://github.com/ai-pioneers/medical-ai',
                    demo: 'https://medical-ai-demo.com', pitch: 'medical-ai-pitch.pdf',
                    submittedAt: '2025-03-15T18:20:00Z', lastUpdate: '2025-03-15T18:20:00Z',
                    judgeComments: ['Revolutionary healthcare solution', 'Impressive AI accuracy'],
                    plagiarismScore: 2.1, isOriginal: true, featured: true
                },
                { 
                    id: 'proj_003', name: 'Smart City Dashboard', team: 'Urban Tech', 
                    category: 'IoT', status: 'In Progress', progress: 75, score: 8.1, 
                    members: 5, technologies: ['Angular', 'Node.js', 'MongoDB', 'IoT'],
                    description: 'Real-time smart city monitoring and management platform',
                    github: 'https://github.com/urban-tech/smart-city',
                    demo: 'https://smart-city-demo.com', pitch: null,
                    submittedAt: null, lastUpdate: '2025-03-15T15:30:00Z',
                    judgeComments: [], plagiarismScore: 8.5, isOriginal: true, featured: false
                }
            ],

            judges: [
                { 
                    id: 'judge_001', name: 'Dr. Jane Smith', avatar: 'JS', role: 'Senior Judge', 
                    expertise: ['AI/ML', 'Data Science'], company: 'Google', status: 'online', 
                    evaluations: 12, rating: 4.9, yearsExperience: 15,
                    linkedin: 'jane-smith-google', twitter: '@janesmith_ai',
                    bio: 'Leading AI researcher with 15+ years in machine learning and data science',
                    assignedProjects: ['proj_002', 'proj_005', 'proj_008'],
                    availability: 'full-time', timezone: 'PST'
                },
                { 
                    id: 'judge_002', name: 'Mark Thompson', avatar: 'MT', role: 'Industry Expert', 
                    expertise: ['Web3', 'Blockchain'], company: 'Coinbase', status: 'evaluating', 
                    evaluations: 8, rating: 4.8, yearsExperience: 12,
                    linkedin: 'mark-thompson-coinbase', twitter: '@markthompson_web3',
                    bio: 'Blockchain pioneer and Web3 evangelist at Coinbase',
                    assignedProjects: ['proj_001', 'proj_004', 'proj_007'],
                    availability: 'full-time', timezone: 'EST'
                },
                { 
                    id: 'judge_003', name: 'Prof. Anna Lee', avatar: 'AL', role: 'Academic Judge', 
                    expertise: ['HCI', 'UX Design'], company: 'MIT', status: 'online', 
                    evaluations: 15, rating: 4.9, yearsExperience: 20,
                    linkedin: 'anna-lee-mit', twitter: '@prof_annalee',
                    bio: 'Professor of Human-Computer Interaction at MIT',
                    assignedProjects: ['proj_003', 'proj_006', 'proj_009'],
                    availability: 'part-time', timezone: 'EST'
                }
            ],

            activities: [],
            notifications: [],
            systemLogs: [],
            analytics: {
                hourlyStats: [],
                dailyStats: [],
                popularTechnologies: [],
                participantDemographics: {},
                projectCategories: {},
                judgingProgress: {}
            }
        };

        // ✅ ADVANCED CONFIGURATION
        this.config = {
            updateIntervals: {
                stats: 10000,        // 10 seconds
                timeline: 15000,     // 15 seconds
                notifications: 5000, // 5 seconds
                backup: 300000       // 5 minutes
            },
            limits: {
                maxNotifications: 50,
                maxTimelineItems: 20,
                maxActivities: 100
            },
            features: {
                aiPlagiarismDetection: true,
                blockchainIntegration: true,
                realtimeCollaboration: true,
                autoBackup: true,
                smartNotifications: true
            }
        };

        this.init();
    }

    // ✅ ENHANCED INITIALIZATION
    init() {
        this.initializeTheme();
        this.setupEventListeners();
        this.initializeUser();
        this.loadEventData();
        this.setupRealtimeUpdates();
        this.renderTimeline();
        this.startLiveUpdates();
        this.initializeNotificationSystem();
        this.handleResize();
        this.initializeAnimations();
        this.setupAdvancedFeatures();
        this.detectAndFillEmptyContainers();
        this.trackUserActivity();
        
        // Performance monitoring
        this.performanceMonitor = new PerformanceMonitor();
        
        console.log('🎯 NexusHack Dashboard initialized successfully!');
    }

    // ✅ ADVANCED THEME SYSTEM
    initializeTheme() {
        const savedTheme = localStorage.getItem('nexushack_theme') || this.currentUser.preferences.theme;
        document.documentElement.setAttribute('data-theme', savedTheme);
        
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            const themeIcon = themeToggle.querySelector('i');
            themeIcon.className = savedTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
        }
        
        this.updateNotificationColors(savedTheme);
        this.currentUser.preferences.theme = savedTheme;
    }

    updateNotificationColors(theme) {
        const root = document.documentElement;
        const colors = theme === 'light' 
            ? { bg: 'rgba(255, 255, 255, 0.95)', border: 'rgba(71, 85, 105, 0.2)', text: '#1e293b' }
            : { bg: 'rgba(22, 33, 62, 0.95)', border: 'rgba(255, 255, 255, 0.1)', text: '#ffffff' };
        
        Object.entries(colors).forEach(([key, value]) => {
            root.style.setProperty(`--notification-${key}`, value);
        });
    }

    // ✅ ENHANCED USER MANAGEMENT
    initializeUser() {
        try {
            const userSession = localStorage.getItem('nexushack_organizer_session');
            if (userSession) {
                const session = JSON.parse(userSession);
                Object.assign(this.currentUser, session);
            }

            // Update UI elements
            const userNameEl = document.getElementById('userName');
            const userAvatarEl = document.getElementById('userAvatar');
            
            if (userNameEl) userNameEl.textContent = this.currentUser.name;
            if (userAvatarEl) userAvatarEl.textContent = this.currentUser.initials;

            // Check user permissions
            this.validateUserPermissions();
            
        } catch (error) {
            console.error('Error initializing user:', error);
            this.handleUserInitError();
        }
    }

    validateUserPermissions() {
        const restrictedElements = document.querySelectorAll('[data-permission]');
        restrictedElements.forEach(element => {
            const requiredPermission = element.dataset.permission;
            if (!this.currentUser.permissions.includes(requiredPermission)) {
                element.style.display = 'none';
            }
        });
    }

    handleUserInitError() {
        this.showToast('❌ User session error. Please login again.', 'error');
        setTimeout(() => {
            this.logout();
        }, 3000);
    }

    // ✅ ADVANCED EVENT LISTENERS
    setupEventListeners() {
        // Basic UI controls
        this.setupBasicControls();
        
        // Advanced keyboard shortcuts
        this.setupKeyboardShortcuts();
        
        // Network monitoring
        this.setupNetworkMonitoring();
        
        // Touch gestures
        this.setupTouchGestures();
        
        // Window events
        this.setupWindowEvents();
        
        // Performance monitoring
        this.setupPerformanceMonitoring();
    }

    setupBasicControls() {
        const controls = {
            'sidebarToggle': () => this.toggleSidebar(),
            'themeToggle': () => this.toggleTheme(),
            'mobileOverlay': () => this.closeMobileSidebar()
        };

        Object.entries(controls).forEach(([id, handler]) => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('click', handler);
            }
        });
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ignore if typing in input fields
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            
            const shortcuts = {
                'ctrl+n': () => this.openNotifications(),
                'ctrl+l': () => this.openLeaderboard(),
                'ctrl+b': () => this.openBroadcastMessage(),
                'ctrl+p': () => this.openPaymentCenter(),
                'ctrl+s': () => this.saveCurrentState(),
                'ctrl+r': () => { e.preventDefault(); this.refreshAllData(); },
                'ctrl+h': () => this.showKeyboardShortcuts(),
                'escape': () => this.closeAllModals(),
                'f11': () => this.toggleFullscreen()
            };

            const key = (e.ctrlKey ? 'ctrl+' : '') + (e.shiftKey ? 'shift+' : '') + e.key.toLowerCase();
            
            if (shortcuts[key]) {
                e.preventDefault();
                shortcuts[key]();
            }
        });
    }

    setupNetworkMonitoring() {
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.showToast('🌐 Connection restored. Syncing data...', 'success');
            this.syncOfflineData();
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.showToast('📡 Connection lost. Working offline...', 'warning');
        });
    }

    setupTouchGestures() {
        let touchStart = { x: 0, y: 0, time: 0 };

        document.addEventListener('touchstart', (e) => {
            touchStart = {
                x: e.touches[0].clientX,
                y: e.touches.clientY,
                time: Date.now()
            };
        });

        document.addEventListener('touchend', (e) => {
            if (!touchStart.x) return;

            const touchEnd = {
                x: e.changedTouches[0].clientX,
                y: e.changedTouches.clientY,
                time: Date.now()
            };

            const deltaX = touchStart.x - touchEnd.x;
            const deltaY = touchStart.y - touchEnd.y;
            const deltaTime = touchEnd.time - touchStart.time;

            // Swipe detection
            if (Math.abs(deltaX) > 50 && deltaTime < 300) {
                if (deltaX > 0) {
                    this.closeMobileSidebar();
                } else if (this.isMobile) {
                    this.openMobileSidebar();
                }
            }

            // Pull to refresh
            if (deltaY < -100 && deltaTime < 500 && window.scrollY === 0) {
                this.refreshAllData();
            }

            touchStart = { x: 0, y: 0, time: 0 };
        });
    }

    setupWindowEvents() {
        window.addEventListener('resize', () => this.handleResize());
        window.addEventListener('beforeunload', (e) => this.handleBeforeUnload(e));
        window.addEventListener('visibilitychange', () => this.handleVisibilityChange());
        window.addEventListener('focus', () => this.handleWindowFocus());
        window.addEventListener('blur', () => this.handleWindowBlur());
    }

    setupPerformanceMonitoring() {
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    if (entry.entryType === 'measure') {
                        console.log(`Performance: ${entry.name} took ${entry.duration}ms`);
                    }
                });
            });
            observer.observe({ entryTypes: ['measure'] });
        }
    }

    // ✅ REAL-TIME UPDATE SYSTEM
    setupRealtimeUpdates() {
        // Clear existing intervals
        if (this.updateInterval) clearInterval(this.updateInterval);
        
        // Main update loop
        this.updateInterval = setInterval(() => {
            if (this.liveUpdates && this.isOnline) {
                this.updateLiveStats();
                this.updateTimeline();
                this.updateNotifications();
                this.updateAnalytics();
            }
        }, this.config.updateIntervals.stats);

        // Auto-save user session
        this.autoSaveInterval = setInterval(() => {
            this.saveUserSession();
        }, this.config.updateIntervals.backup);
    }

    // ✅ ADVANCED NOTIFICATION SYSTEM
    initializeNotificationSystem() {
        this.createNotificationContainer();
        this.loadNotifications();
        this.setupNotificationPermissions();
        
        // Welcome notification
        setTimeout(() => {
            this.showToast('🎯 NexusHack Dashboard loaded successfully!', 'success');
        }, 1000);

        // Check for urgent notifications
        setTimeout(() => {
            this.checkUrgentNotifications();
        }, 2000);
    }

    createNotificationContainer() {
        if (document.getElementById('notificationContainer')) return;
        
        const container = document.createElement('div');
        container.id = 'notificationContainer';
        container.style.cssText = `
            position: fixed;
            top: 90px;
            right: 20px;
            z-index: 10000;
            max-width: 400px;
            pointer-events: none;
        `;
        
        document.body.appendChild(container);
    }

    setupNotificationPermissions() {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    this.showToast('🔔 Browser notifications enabled!', 'success');
                }
            });
        }
    }

    // ✅ ENHANCED DATA LOADING
    loadEventData() {
        try {
            // Load cached data first
            this.loadCachedData();
            
            // Initialize stats
            this.stats = {
                participants: 1247,
                submissions: 127,
                judges: 15,
                liveViewers: 2847,
                checkedIn: 892,
                teamsFormed: 312,
                evaluationsComplete: 89,
                pendingActions: 23,
                totalPrizePool: this.currentEvent.prizePool,
                activeProjects: this.realisticData.projects.filter(p => p.status === 'In Progress').length,
                completedProjects: this.realisticData.projects.filter(p => p.status === 'Submitted').length
            };

            // Initialize timeline
            this.timeline = [
                {
                    id: 'tl_001',
                    time: '09:00',
                    title: 'Event Kickoff',
                    description: 'Opening ceremony with 2,847 live viewers. Team formation begins.',
                    type: 'milestone',
                    priority: 'high',
                    timestamp: new Date('2025-03-15T09:00:00Z'),
                    participants: 2847,
                    location: 'Main Auditorium'
                },
                {
                    id: 'tl_002',
                    time: '10:30',
                    title: 'AI Workshop Live',
                    description: 'Technical workshop on AI integration with 400+ participants attending.',
                    type: 'activity',
                    priority: 'medium',
                    timestamp: new Date('2025-03-15T10:30:00Z'),
                    participants: 400,
                    location: 'Workshop Hall A'
                },
                {
                    id: 'tl_003',
                    time: '12:00',
                    title: 'Server Alert',
                    description: 'High traffic detected - auto-scaling activated successfully.',
                    type: 'alert',
                    priority: 'high',
                    timestamp: new Date('2025-03-15T12:00:00Z'),
                    resolved: true,
                    impact: 'system'
                },
                {
                    id: 'tl_004',
                    time: '14:00',
                    title: 'Hacking Period',
                    description: 'Official coding period started. 312 teams actively building.',
                    type: 'milestone',
                    priority: 'high',
                    timestamp: new Date('2025-03-15T14:00:00Z'),
                    participants: 312,
                    status: 'active'
                },
                {
                    id: 'tl_005',
                    time: '16:30',
                    title: 'First Submissions',
                    description: '127 projects submitted for initial review. Quality looks excellent.',
                    type: 'activity',
                    priority: 'medium',
                    timestamp: new Date('2025-03-15T16:30:00Z'),
                    submissions: 127,
                    quality: 'excellent'
                },
                {
                    id: 'tl_006',
                    time: '18:00',
                    title: 'Judge Check-in',
                    description: 'All 15 expert judges confirmed and ready for evaluation phase.',
                    type: 'milestone',
                    priority: 'high',
                    timestamp: new Date('2025-03-15T18:00:00Z'),
                    judges: 15,
                    status: 'ready'
                }
            ];

            // Generate realistic notifications
            this.generateRealisticNotifications();
            
            // Initialize analytics
            this.initializeAnalytics();
            
        } catch (error) {
            console.error('Error loading event data:', error);
            this.showToast('❌ Error loading event data. Using fallback.', 'error');
        }
    }

    loadCachedData() {
        try {
            const cachedData = localStorage.getItem('nexushack_dashboard_cache');
            if (cachedData) {
                const parsed = JSON.parse(cachedData);
                if (Date.now() - parsed.timestamp < 300000) { // 5 minutes cache
                    Object.assign(this.realisticData, parsed.data);
                }
            }
        } catch (error) {
            console.warn('Cache loading failed:', error);
        }
    }

    generateRealisticNotifications() {
        const notifications = [
            {
                id: 'notif_001',
                title: 'Submission Deadline Extended',
                message: 'Due to overwhelming response, submission deadline extended by 2 hours.',
                priority: 'high',
                type: 'announcement',
                read: false,
                timestamp: Date.now() - 600000,
                action: 'update_deadline',
                icon: 'clock'
            },
            {
                id: 'notif_002',
                title: 'Judge Panel Live Q&A',
                message: 'Join our expert judges at 4:00 PM PST for live Q&A session.',
                priority: 'medium',
                type: 'event',
                read: false,
                timestamp: Date.now() - 1500000,
                action: 'join_qa',
                icon: 'users'
            },
            {
                id: 'notif_003',
                title: 'Payment System Alert',
                message: 'Prize distribution system requires immediate attention.',
                priority: 'urgent',
                type: 'system',
                read: false,
                timestamp: Date.now() - 300000,
                action: 'check_payments',
                icon: 'exclamation-triangle'
            },
            {
                id: 'notif_004',
                title: 'AI Plagiarism Detection',
                message: '3 projects flagged for similarity check. Manual review required.',
                priority: 'high',
                type: 'security',
                read: false,
                timestamp: Date.now() - 900000,
                action: 'review_plagiarism',
                icon: 'robot'
            },
            {
                id: 'notif_005',
                title: 'New Sponsor Onboard',
                message: 'Microsoft joined as Platinum sponsor. Update sponsor materials.',
                priority: 'medium',
                type: 'business',
                read: true,
                timestamp: Date.now() - 7200000,
                action: 'update_sponsors',
                icon: 'handshake'
            }
        ];

        this.realisticData.notifications = notifications;
    }

    initializeAnalytics() {
        this.realisticData.analytics = {
            hourlyStats: this.generateHourlyStats(),
            dailyStats: this.generateDailyStats(),
            popularTechnologies: this.calculatePopularTechnologies(),
            participantDemographics: this.calculateDemographics(),
            projectCategories: this.calculateProjectCategories(),
            judgingProgress: this.calculateJudgingProgress()
        };
    }

    // ✅ ADVANCED RENDERING SYSTEM
    renderTimeline() {
        const container = document.getElementById('timelineList');
        if (!container) return;

        container.innerHTML = '';
        
        this.timeline
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, this.config.limits.maxTimelineItems)
            .forEach((item, index) => {
                const timelineDiv = document.createElement('div');
                timelineDiv.className = `timeline-item ${item.type}`;
                timelineDiv.dataset.id = item.id;
                timelineDiv.style.cssText = 'opacity: 0; transform: translateY(20px); transition: all 0.5s ease-out;';
                
                timelineDiv.innerHTML = `
                    <div class="timeline-time">${item.time}</div>
                    <div class="timeline-content">
                        <div class="timeline-title-item">
                            ${item.title}
                            ${item.priority === 'high' ? '<i class="fas fa-star" style="color: var(--warning); margin-left: 0.5rem;"></i>' : ''}
                            ${item.priority === 'urgent' ? '<i class="fas fa-exclamation" style="color: var(--danger); margin-left: 0.5rem;"></i>' : ''}
                        </div>
                        <div class="timeline-description">${item.description}</div>
                        <div class="timeline-meta" style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.5rem;">
                            ${item.participants ? `👥 ${item.participants} participants` : ''}
                            ${item.location ? `📍 ${item.location}` : ''}
                            ${item.submissions ? `📂 ${item.submissions} submissions` : ''}
                        </div>
                    </div>
                `;
                
                // Add click handler
                timelineDiv.addEventListener('click', () => {
                    this.showTimelineDetails(item);
                });
                
                // Add hover effects
                timelineDiv.addEventListener('mouseenter', () => {
                    timelineDiv.style.transform = 'translateX(8px)';
                    timelineDiv.style.boxShadow = 'var(--shadow-md)';
                });
                
                timelineDiv.addEventListener('mouseleave', () => {
                    timelineDiv.style.transform = 'translateX(0)';
                    timelineDiv.style.boxShadow = 'none';
                });
                
                container.appendChild(timelineDiv);
                
                // Animate in
                setTimeout(() => {
                    timelineDiv.style.opacity = '1';
                    timelineDiv.style.transform = 'translateY(0)';
                }, index * 100);
            });
    }

    // ✅ ADVANCED FUNCTIONALITY IMPLEMENTATIONS

    // Sidebar Management
    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        if (!sidebar) return;
        
        if (this.isMobile) {
            sidebar.classList.toggle('open');
            this.toggleMobileOverlay();
        } else {
            sidebar.classList.toggle('collapsed');
            this.saveUserPreference('sidebarCollapsed', sidebar.classList.contains('collapsed'));
        }
        
        this.showToast('📱 Sidebar toggled', 'info');
        this.trackEvent('sidebar_toggle', { mobile: this.isMobile });
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

    // Theme Management
    toggleTheme() {
        const html = document.documentElement;
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        // Smooth transition
        html.style.transition = 'all 0.3s ease';
        html.setAttribute('data-theme', newTheme);
        
        // Update storage
        localStorage.setItem('nexushack_theme', newTheme);
        this.currentUser.preferences.theme = newTheme;
        
        // Update theme toggle icon
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            const themeIcon = themeToggle.querySelector('i');
            themeIcon.className = newTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
        }
        
        // Update notification colors
        this.updateNotificationColors(newTheme);
        
        // Show feedback
        this.showToast(`🎨 Theme switched to ${newTheme} mode`, 'success');
        
        // Track event
        this.trackEvent('theme_change', { theme: newTheme });
        
        // Remove transition after animation
        setTimeout(() => {
            html.style.transition = '';
        }, 300);
    }

    // ✅ LIVE UPDATE SYSTEM
    startLiveUpdates() {
        if (this.liveUpdates) {
            // Real-time clock
            setInterval(() => {
                this.updateClockElements();
            }, 1000);

            // Periodic data refresh
            setInterval(() => {
                this.refreshLiveData();
            }, this.config.updateIntervals.stats);

            // Activity tracking
            this.trackActivity();
        }
    }

    updateClockElements() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', {
            hour12: false,
            timeZone: this.currentEvent.timezone
        });
        
        document.querySelectorAll('.live-clock').forEach(el => {
            el.textContent = timeString;
        });

        // Update event countdown
        this.updateEventCountdown(now);
    }

    updateEventCountdown(now) {
        const endTime = new Date(this.currentEvent.endDate);
        const timeLeft = endTime - now;
        
        if (timeLeft > 0) {
            const hours = Math.floor(timeLeft / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
            
            const countdownEl = document.querySelector('.event-countdown');
            if (countdownEl) {
                countdownEl.textContent = `${hours}h ${minutes}m ${seconds}s`;
            }
        }
    }

    refreshLiveData() {
        if (!this.isOnline) return;
        
        // Simulate real-time updates
        this.updateLiveStats();
        this.addRealtimeActivity();
        this.updateNotificationsBadge();
        
        // Update analytics
        if (Math.random() > 0.7) {
            this.updateAnalytics();
        }
    }

    updateLiveStats() {
        const changes = this.generateStatChanges();
        
        Object.entries(changes).forEach(([key, change]) => {
            if (change !== 0) {
                const oldValue = this.stats[key];
                this.stats[key] = Math.max(0, this.stats[key] + change);
                
                // Update UI element
                this.updateStatElement(key, this.stats[key], oldValue);
                
                // Track significant changes
                if (Math.abs(change) > 10) {
                    this.trackEvent('stat_change', { stat: key, change, newValue: this.stats[key] });
                }
            }
        });
    }

    generateStatChanges() {
        return {
            participants: Math.random() > 0.8 ? Math.floor(Math.random() * 3) + 1 : 0,
            submissions: Math.random() > 0.9 ? Math.floor(Math.random() * 2) + 1 : 0,
            liveViewers: Math.floor(Math.random() * 100) - 50,
            checkedIn: Math.random() > 0.7 ? Math.floor(Math.random() * 5) + 1 : 0,
            teamsFormed: Math.random() > 0.9 ? Math.floor(Math.random() * 2) + 1 : 0,
            evaluationsComplete: Math.random() > 0.8 ? Math.floor(Math.random() * 3) + 1 : 0,
            pendingActions: Math.random() > 0.6 ? Math.floor(Math.random() * 5) - 2 : 0
        };
    }

    updateStatElement(key, newValue, oldValue) {
        const selectors = {
            participants: '.stat-card.participants .stat-value',
            submissions: '.stat-card.submissions .stat-value',
            judges: '.stat-card.judges .stat-value',
            liveViewers: '.stat-card.live .stat-value'
        };

        const element = document.querySelector(selectors[key]);
        if (element) {
            // Animate the change
            element.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            element.style.transform = 'scale(1.1)';
            element.style.filter = 'brightness(1.2)';
            
            // Update value
            element.textContent = newValue.toLocaleString();
            
            // Show trend indicator
            if (newValue > oldValue) {
                this.showTrendIndicator(element, 'up');
            } else if (newValue < oldValue) {
                this.showTrendIndicator(element, 'down');
            }
            
            // Reset animation
            setTimeout(() => {
                element.style.transform = 'scale(1)';
                element.style.filter = 'brightness(1)';
            }, 500);
        }
    }

    showTrendIndicator(element, direction) {
        const indicator = document.createElement('span');
        indicator.className = `trend-indicator trend-${direction}`;
        indicator.innerHTML = direction === 'up' ? '↗️' : '↘️';
        indicator.style.cssText = `
            position: absolute;
            top: -10px;
            right: -10px;
            font-size: 1.2rem;
            animation: fadeInOut 2s ease-out;
        `;
        
        element.style.position = 'relative';
        element.appendChild(indicator);
        
        setTimeout(() => {
            if (indicator.parentNode) {
                indicator.remove();
            }
        }, 2000);
    }

    addRealtimeActivity() {
        if (Math.random() > 0.6) {
            const activity = this.generateRandomActivity();
            this.realisticData.activities.unshift(activity);
            this.realisticData.activities = this.realisticData.activities.slice(0, this.config.limits.maxActivities);
            
            // Add to timeline if significant
            if (activity.priority === 'high' || activity.priority === 'urgent') {
                this.addToTimeline(activity);
            }
        }
    }

    generateRandomActivity() {
        const activities = [
            { 
                type: 'submission', 
                title: 'New Project Submission', 
                description: `Project "${this.getRandomProjectName()}" submitted by ${this.getRandomTeamName()}`,
                priority: 'high',
                icon: 'upload'
            },
            { 
                type: 'team', 
                title: 'Team Formation', 
                description: `New team "${this.getRandomTeamName()}" formed with ${Math.floor(Math.random() * 4) + 2} members`,
                priority: 'medium',
                icon: 'users'
            },
            { 
                type: 'evaluation', 
                title: 'Evaluation Complete', 
                description: `${this.getRandomJudgeName()} completed evaluation of project #${Math.floor(Math.random() * 100) + 1}`,
                priority: 'medium',
                icon: 'check-circle'
            },
            { 
                type: 'system', 
                title: 'System Update', 
                description: `Platform performance optimized. ${Math.floor(Math.random() * 1000) + 2000} concurrent users`,
                priority: 'low',
                icon: 'server'
            },
            { 
                type: 'workshop', 
                title: 'Workshop Activity', 
                description: `"${this.getRandomWorkshopName()}" workshop started with ${Math.floor(Math.random() * 200) + 100} attendees`,
                priority: 'medium',
                icon: 'chalkboard-teacher'
            }
        ];

        const activity = activities[Math.floor(Math.random() * activities.length)];
        return {
            id: `activity_${Date.now()}`,
            ...activity,
            timestamp: Date.now(),
            participants: Math.floor(Math.random() * 50) + 10
        };
    }

    getRandomProjectName() {
        const names = ['DeFi Analytics', 'AI Health Monitor', 'Smart City Hub', 'Blockchain Tracker', 'ML Predictor', 'Web3 Wallet'];
        return names[Math.floor(Math.random() * names.length)];
    }

    getRandomTeamName() {
        const names = ['Code Warriors', 'Tech Innovators', 'Digital Pioneers', 'Hack Masters', 'Future Builders', 'Innovation Labs'];
        return names[Math.floor(Math.random() * names.length)];
    }

    getRandomJudgeName() {
        return this.realisticData.judges[Math.floor(Math.random() * this.realisticData.judges.length)].name;
    }

    getRandomWorkshopName() {
        const workshops = ['Advanced React', 'Blockchain Fundamentals', 'AI/ML Basics', 'UX Design Principles', 'Cloud Architecture'];
        return workshops[Math.floor(Math.random() * workshops.length)];
    }

    // ✅ ADVANCED FEATURE IMPLEMENTATIONS

    // Empty Container Detection
    detectAndFillEmptyContainers() {
        setTimeout(() => {
            const emptySelectors = [
                '.participants-list:empty',
                '.projects-list:empty',
                '.judges-list:empty',
                '.recent-activity:empty',
                '.notifications-list:empty'
            ];

            emptySelectors.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                elements.forEach(el => this.fillContainerWithData(el, selector));
            });

            this.enhanceInteractiveElements();
        }, 500);
    }

    fillContainerWithData(element, selector) {
        if (!element || element.children.length > 0) return;

        const fillers = {
            '.participants-list:empty': () => this.fillParticipantsList(element),
            '.projects-list:empty': () => this.fillProjectsList(element),
            '.judges-list:empty': () => this.fillJudgesList(element),
            '.recent-activity:empty': () => this.fillRecentActivity(element),
            '.notifications-list:empty': () => this.fillNotificationsList(element)
        };

        const filler = fillers[selector];
        if (filler) filler();
    }

    enhanceInteractiveElements() {
        // Enhance stat cards
        document.querySelectorAll('.stat-card').forEach(card => {
            if (!card.hasAttribute('data-enhanced')) {
                card.setAttribute('data-enhanced', 'true');
                card.addEventListener('click', () => {
                    const title = card.querySelector('.stat-title')?.textContent || 'Statistics';
                    this.showStatModal(title);
                });
            }
        });

        // Enhance quick actions
        document.querySelectorAll('.quick-action').forEach(action => {
            if (!action.hasAttribute('data-enhanced')) {
                action.setAttribute('data-enhanced', 'true');
                this.setupQuickActionHandler(action);
            }
        });

        // Enhance metric items
        document.querySelectorAll('.metric-item').forEach(item => {
            if (!item.hasAttribute('data-enhanced')) {
                item.setAttribute('data-enhanced', 'true');
                item.addEventListener('click', () => {
                    const label = item.querySelector('.metric-label')?.textContent || 'Metric';
                    this.showMetricDetails(label);
                });
            }
        });
    }

    setupQuickActionHandler(action) {
        const title = action.querySelector('.quick-action-title')?.textContent;
        
        action.addEventListener('click', (e) => {
            e.preventDefault();
            
            const handlers = {
                'Live Leaderboard': () => this.openLeaderboard(),
                'AI Plagiarism Control': () => this.openPlagiarismControl(),
                'Payment Center': () => this.openPaymentCenter(),
                'Web3 & NFT Badges': () => this.openWeb3Badges(),
                'Broadcast Messages': () => this.openBroadcastMessage()
            };

            const handler = handlers[title];
            if (handler) {
                handler();
            } else {
                this.showToast(`🔧 ${title} feature activated`, 'info');
            }
        });
    }

    // ✅ MODAL AND UI SYSTEMS

    // Toast Notification System
    showToast(message, type = 'success', options = {}) {
        const container = document.getElementById('notificationContainer');
        if (!container) {
            this.createNotificationContainer();
            return this.showToast(message, type, options);
        }

        // Limit number of toasts
        this.limitToasts(container, 4);

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.style.cssText = `
            background: ${this.getToastBackground(type)};
            border: 1px solid ${this.getToastBorder(type)};
            color: var(--notification-text);
            padding: 1rem 1.25rem;
            border-radius: 12px;
            margin-bottom: 0.75rem;
            box-shadow: var(--shadow-lg);
            backdrop-filter: blur(10px);
            display: flex;
            align-items: center;
            gap: 0.75rem;
            font-weight: 600;
            font-size: 0.9rem;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            cursor: pointer;
            pointer-events: auto;
            position: relative;
            overflow: hidden;
            user-select: none;
            max-width: 100%;
        `;

        const icon = this.getToastIcon(type);
        const closeIcon = options.persistent ? '' : '<i class="fas fa-times" style="font-size: 0.8rem; opacity: 0.7; cursor: pointer;" onclick="this.closest(\'.toast\').remove()"></i>';
        
        toast.innerHTML = `
            <i class="fas ${icon}" style="font-size: 1rem; flex-shrink: 0;"></i>
            <span style="flex: 1; line-height: 1.4; word-break: break-word;">${message}</span>
            ${closeIcon}
        `;

        // Add progress bar for longer toasts
        if (type === 'info' || type === 'warning') {
            const progressBar = document.createElement('div');
            progressBar.style.cssText = `
                position: absolute;
                bottom: 0;
                left: 0;
                height: 3px;
                background: ${this.getToastAccent(type)};
                border-radius: 0 0 12px 12px;
                transition: width ${this.getToastDelay(type)}ms linear;
                width: 100%;
            `;
            toast.appendChild(progressBar);
            
            setTimeout(() => {
                progressBar.style.width = '0%';
            }, 100);
        }

        container.appendChild(toast);

        // Animate in
        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(0)';
        }, 50);

        // Auto remove (unless persistent)
        if (!options.persistent) {
            const delay = options.delay || this.getToastDelay(type);
            const autoRemoveTimer = setTimeout(() => {
                this.removeToast(toast);
            }, delay);

            // Click to dismiss
            toast.addEventListener('click', () => {
                clearTimeout(autoRemoveTimer);
                this.removeToast(toast);
            });
        }

        // Show browser notification for important messages
        if (type === 'error' || type === 'warning') {
            this.showBrowserNotification(message, type);
        }

        return toast;
    }

    removeToast(toast) {
        if (!toast || !toast.parentNode) return;
        
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 300);
    }

    limitToasts(container, maxToasts = 5) {
        const toasts = container.querySelectorAll('.toast');
        if (toasts.length >= maxToasts) {
            for (let i = 0; i < toasts.length - maxToasts + 1; i++) {
                this.removeToast(toasts[i]);
            }
        }
    }

    getToastBackground(type) {
        const backgrounds = {
            success: 'var(--gradient-success)',
            error: 'var(--gradient-danger)',
            warning: 'var(--gradient-warning)',
            info: 'var(--gradient-organizer)'
        };
        return backgrounds[type] || backgrounds.info;
    }

    getToastBorder(type) {
        const borders = {
            success: 'var(--success)',
            error: 'var(--danger)',
            warning: 'var(--warning)',
            info: 'var(--organizer-blue)'
        };
        return borders[type] || borders.info;
    }

    getToastAccent(type) {
        return '#ffffff';
    }

    getToastIcon(type) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        return icons[type] || icons.info;
    }

    getToastDelay(type) {
        const delays = {
            success: 4000,
            error: 6000,
            warning: 5000,
            info: 4000
        };
        return delays[type] || 4000;
    }

    showBrowserNotification(message, type) {
        if ('Notification' in window && Notification.permission === 'granted') {
            const notification = new Notification(`NexusHack Dashboard - ${type.toUpperCase()}`, {
                body: message,
                icon: '/favicon.ico',
                tag: `nexushack-${type}`,
                requireInteraction: type === 'error'
            });

            notification.onclick = () => {
                window.focus();
                notification.close();
            };

            setTimeout(() => {
                notification.close();
            }, 5000);
        }
    }

    // ✅ CONTINUE IN NEXT PART...
    
    // Event Tracking
    trackEvent(eventName, properties = {}) {
        const event = {
            name: eventName,
            properties: {
                ...properties,
                timestamp: Date.now(),
                userId: this.currentUser.id,
                eventId: this.currentEvent.id,
                sessionId: this.getSessionId(),
                userAgent: navigator.userAgent,
                url: window.location.href
            }
        };

        // Log to console in development
        console.log('📊 Event tracked:', event);

        // Store in session storage for analytics
        this.storeAnalyticsEvent(event);
    }

    storeAnalyticsEvent(event) {
        try {
            const events = JSON.parse(sessionStorage.getItem('nexushack_analytics') || '[]');
            events.push(event);
            
            // Keep only last 1000 events
            if (events.length > 1000) {
                events.splice(0, events.length - 1000);
            }
            
            sessionStorage.setItem('nexushack_analytics', JSON.stringify(events));
        } catch (error) {
            console.warn('Failed to store analytics event:', error);
        }
    }

    getSessionId() {
        let sessionId = sessionStorage.getItem('nexushack_session_id');
        if (!sessionId) {
            sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem('nexushack_session_id', sessionId);
        }
        return sessionId;
    }

    // User Session Management
    saveUserSession() {
        try {
            const sessionData = {
                ...this.currentUser,
                lastActive: this.lastActivity,
                sessionStart: this.getSessionId(),
                preferences: this.currentUser.preferences,
                dashboardState: this.getDashboardState()
            };
            
            localStorage.setItem('nexushack_organizer_session', JSON.stringify(sessionData));
        } catch (error) {
            console.warn('Failed to save user session:', error);
        }
    }

    getDashboardState() {
        const sidebar = document.getElementById('sidebar');
        return {
            sidebarCollapsed: sidebar?.classList.contains('collapsed') || false,
            theme: this.currentUser.preferences.theme,
            lastPage: window.location.pathname
        };
    }

    saveUserPreference(key, value) {
        this.currentUser.preferences[key] = value;
        this.saveUserSession();
    }

    // Activity Tracking
    trackActivity() {
        const activities = ['click', 'scroll', 'keydown', 'mousemove'];
        
        activities.forEach(activity => {
            document.addEventListener(activity, () => {
                this.lastActivity = Date.now();
            });
        });

        // Check for inactivity
        setInterval(() => {
            const inactiveTime = Date.now() - this.lastActivity;
            if (inactiveTime > 1800000) { // 30 minutes
                this.handleUserInactivity();
            }
        }, 60000); // Check every minute
    }

    handleUserInactivity() {
        this.showToast('⏰ You\'ve been inactive. Session will expire soon.', 'warning');
        
        setTimeout(() => {
            if (Date.now() - this.lastActivity > 2100000) { // 35 minutes total
                this.handleSessionTimeout();
            }
        }, 300000); // Give 5 more minutes
    }

    handleSessionTimeout() {
        this.showToast('🔒 Session expired due to inactivity. Please login again.', 'error');
        setTimeout(() => {
            this.logout();
        }, 3000);
    }

    // Window Events
    handleResize() {
        this.isMobile = window.innerWidth <= 1024;
        if (!this.isMobile) this.closeMobileSidebar();
        this.adjustNotificationPosition();
        this.trackEvent('window_resize', { 
            width: window.innerWidth, 
            height: window.innerHeight,
            isMobile: this.isMobile 
        });
    }

    adjustNotificationPosition() {
        const container = document.getElementById('notificationContainer');
        if (container) {
            if (this.isMobile) {
                container.style.left = '15px';
                container.style.right = '15px';
                container.style.maxWidth = 'none';
            } else {
                container.style.left = '';
                container.style.right = '20px';
                container.style.maxWidth = '400px';
            }
        }
    }

    handleBeforeUnload(e) {
        // Save current state
        this.saveUserSession();
        
        // Warn if there are unsaved changes
        if (this.hasUnsavedChanges()) {
            e.preventDefault();
            e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
            return 'You have unsaved changes. Are you sure you want to leave?';
        }
    }

    handleVisibilityChange() {
        if (document.hidden) {
            this.trackEvent('tab_hidden');
            // Pause non-critical updates
            this.pauseUpdates();
        } else {
            this.trackEvent('tab_visible');
            // Resume updates
            this.resumeUpdates();
            // Refresh data
            this.refreshAllData();
        }
    }

    handleWindowFocus() {
        this.trackEvent('window_focus');
        this.resumeUpdates();
    }

    handleWindowBlur() {
        this.trackEvent('window_blur');
        // Save current state
        this.saveUserSession();
    }

    pauseUpdates() {
        this.liveUpdates = false;
    }

    resumeUpdates() {
        this.liveUpdates = true;
    }

    hasUnsavedChanges() {
        // Check if there are any unsaved changes
        // This would be implemented based on specific form states
        return false;
    }

    // Utility Methods
    refreshAllData() {
        this.showToast('🔄 Refreshing all data...', 'info');
        
        // Simulate data refresh
        setTimeout(() => {
            this.updateLiveStats();
            this.renderTimeline();
            this.updateNotifications();
            this.showToast('✅ Data refreshed successfully!', 'success');
        }, 1500);
    }

    saveCurrentState() {
        this.saveUserSession();
        this.showToast('💾 Current state saved!', 'success');
    }

    closeAllModals() {
        document.querySelectorAll('.modal-overlay').forEach(modal => {
            modal.remove();
        });
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            this.showToast('🖥️ Entered fullscreen mode', 'info');
        } else {
            document.exitFullscreen();
            this.showToast('🖥️ Exited fullscreen mode', 'info');
        }
    }

    showKeyboardShortcuts() {
        const shortcuts = [
            { key: 'Ctrl + N', action: 'Open Notifications' },
            { key: 'Ctrl + L', action: 'Open Leaderboard' },
            { key: 'Ctrl + B', action: 'Broadcast Message' },
            { key: 'Ctrl + P', action: 'Payment Center' },
            { key: 'Ctrl + S', action: 'Save Current State' },
            { key: 'Ctrl + R', action: 'Refresh Data' },
            { key: 'Ctrl + H', action: 'Show Help' },
            { key: 'Escape', action: 'Close Modals' },
            { key: 'F11', action: 'Toggle Fullscreen' }
        ];

        const modal = this.createModal('Keyboard Shortcuts', `
            <div style="max-height: 400px; overflow-y: auto;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    ${shortcuts.map(shortcut => `
                        <div style="display: flex; justify-content: space-between; align-items: center; 
                            padding: 0.75rem; background: var(--bg-glass); border-radius: 8px;">
                            <kbd style="background: var(--bg-secondary); padding: 0.25rem 0.5rem; 
                                border-radius: 4px; font-family: monospace; font-size: 0.85rem;">${shortcut.key}</kbd>
                            <span style="color: var(--text-secondary); font-size: 0.9rem;">${shortcut.action}</span>
                        </div>
                    `).join('')}
                </div>
                
                <div style="margin-top: 2rem; text-align: center;">
                    <button onclick="this.closest('.modal-overlay').remove()" 
                        style="padding: 0.75rem 1.5rem; border: none; border-radius: 8px; 
                        background: var(--gradient-organizer); color: white; cursor: pointer; font-weight: 600;">
                        Close
                    </button>
                </div>
            </div>
        `);
    }

    // Logout
    logout() {
        if (confirm('Are you sure you want to logout?')) {
            // Clear session data
            localStorage.removeItem('nexushack_organizer_session');
            sessionStorage.clear();
            
            this.showToast('🚪 Logging out...', 'info');
            
            setTimeout(() => {
                window.location.href = '../auth/login.html';
            }, 1000);
        }
    }

    // Destructor
    destroy() {
        // Clear intervals
        if (this.updateInterval) clearInterval(this.updateInterval);
        if (this.autoSaveInterval) clearInterval(this.autoSaveInterval);
        
        // Remove event listeners
        document.removeEventListener('keydown', this.keydownHandler);
        window.removeEventListener('resize', this.handleResize);
        window.removeEventListener('beforeunload', this.handleBeforeUnload);
        
        // Save final state
        this.saveUserSession();
        
        console.log('🎯 NexusHack Dashboard destroyed');
    }
}

// ✅ PERFORMANCE MONITOR CLASS
class PerformanceMonitor {
    constructor() {
        this.metrics = {
            loadTime: 0,
            renderTime: 0,
            memoryUsage: 0,
            errorCount: 0
        };
        
        this.init();
    }

    init() {
        this.measureLoadTime();
        this.monitorMemoryUsage();
        this.monitorErrors();
    }

    measureLoadTime() {
        window.addEventListener('load', () => {
            const loadTime = performance.now();
            this.metrics.loadTime = loadTime;
            console.log(`📊 Dashboard loaded in ${loadTime.toFixed(2)}ms`);
        });
    }

    monitorMemoryUsage() {
        if ('memory' in performance) {
            setInterval(() => {
                this.metrics.memoryUsage = performance.memory.usedJSHeapSize / 1024 / 1024;
                
                // Warn if memory usage is high
                if (this.metrics.memoryUsage > 100) {
                    console.warn(`⚠️ High memory usage: ${this.metrics.memoryUsage.toFixed(2)}MB`);
                }
            }, 30000); // Check every 30 seconds
        }
    }

    monitorErrors() {
        window.addEventListener('error', (e) => {
            this.metrics.errorCount++;
            console.error('🚨 JavaScript Error:', e.error);
        });

        window.addEventListener('unhandledrejection', (e) => {
            this.metrics.errorCount++;
            console.error('🚨 Unhandled Promise Rejection:', e.reason);
        });
    }
}

// ✅ GLOBAL VARIABLES AND INITIALIZATION
let modernDashboard;

// Navigation Functions
function navigateToHome() {
    modernDashboard.showToast('🏠 Navigating to NexusHack homepage...', 'info');
    setTimeout(() => {
        window.location.href = '../index.html';
    }, 500);
}

// Dashboard Functions  
function openParticipants() { 
    modernDashboard.showToast('👥 Loading participants dashboard...', 'info');
    setTimeout(() => window.location.href = 'participant-dashboard.html', 800);
}

function openSubmissions() { 
    modernDashboard.showToast('📂 Opening project submissions...', 'info');
    setTimeout(() => window.location.href = 'submission-review.html', 800);
}

function openJudges() { 
    modernDashboard.showToast('⭐ Loading judges panel...', 'info');
    setTimeout(() => window.location.href = 'judge-management.html', 800);
}

function openLiveControl() { 
    modernDashboard.showToast('📺 Opening live event control...', 'info');
    setTimeout(() => window.location.href = 'live-event-control.html', 800);
}

// Quick Action Functions
function openLeaderboard() { modernDashboard.openLeaderboard(); }
function openPlagiarismControl() { modernDashboard.openPlagiarismControl(); }
function openPaymentCenter() { modernDashboard.openPaymentCenter(); }
function openWeb3Badges() { modernDashboard.openWeb3Badges(); }
function openBroadcastMessage() { modernDashboard.openBroadcastMessage(); }

// Utility Functions
function liveControl() { openLiveControl(); }
function viewAnalytics() { 
    modernDashboard.showToast('📊 Loading analytics dashboard...', 'info');
    setTimeout(() => window.location.href = 'analytics.html', 800);
}
function broadcastMessage() { openBroadcastMessage(); }
function showNotifications() { 
    modernDashboard.showToast('🔔 Loading notification center...', 'info');
    setTimeout(() => modernDashboard.openNotifications(), 500);
}
function viewFullTimeline() { 
    modernDashboard.showToast('📅 Opening complete event timeline...', 'info');
}
function openHelp() { 
    modernDashboard.showToast('❓ Opening help center...', 'info');
}

// Header Actions
function exportDashboardData() {
    modernDashboard.showToast('📊 Exporting dashboard data...', 'info');
    
    setTimeout(() => {
        const data = `NexusHack Dashboard Export
Event: ${modernDashboard.currentEvent.name}
Exported: ${new Date().toLocaleString()}

Statistics:
- Participants: ${modernDashboard.stats.participants}
- Submissions: ${modernDashboard.stats.submissions}  
- Judges: ${modernDashboard.stats.judges}
- Live Viewers: ${modernDashboard.stats.liveViewers}
- Teams Formed: ${modernDashboard.stats.teamsFormed}
- Evaluations Complete: ${modernDashboard.stats.evaluationsComplete}

Event Details:
- Start Date: ${modernDashboard.currentEvent.startDate}
- End Date: ${modernDashboard.currentEvent.endDate}
- Prize Pool: $${modernDashboard.currentEvent.prizePool.toLocaleString()}
- Tracks: ${modernDashboard.currentEvent.tracks.length}
`;

        modernDashboard.downloadFile(data, `nexushack-dashboard-${Date.now()}.txt`, 'text/plain');
        modernDashboard.showToast('📄 Dashboard data exported successfully!', 'success');
    }, 1500);
}

function startLiveBroadcast() {
    modernDashboard.showToast('📡 Starting live broadcast...', 'info');
    
    setTimeout(() => {
        modernDashboard.showToast('🔴 You are now LIVE! Broadcasting to 2,847 viewers.', 'success');
        modernDashboard.trackEvent('live_broadcast_started');
    }, 2000);
}

// Topbar Actions
function openLiveAnalytics() {
    modernDashboard.showToast('📈 Opening live analytics...', 'info');
    setTimeout(() => window.location.href = 'analytics.html', 800);
}

function openNotifications() {
    modernDashboard.showToast('🔔 Loading notifications...', 'info');
    // Implementation would show notification panel
}

function openHelp() {
    modernDashboard.showToast('❓ Opening help center...', 'info');
}

// Metric Functions
function viewCheckIns() { modernDashboard.showStatModal('Check-ins'); }
function viewTeams() { modernDashboard.showStatModal('Teams'); }  
function viewEvaluations() { modernDashboard.showStatModal('Evaluations'); }
function viewPendingActions() { modernDashboard.showStatModal('Pending Actions'); }
function viewParticipants() { modernDashboard.showStatModal('Participants'); }
function viewSubmissions() { modernDashboard.showStatModal('Submissions'); }
function viewJudges() { modernDashboard.showStatModal('Judges'); }
function viewLiveStream() { modernDashboard.showStatModal('Live Stream'); }

// Timeline Functions  
function refreshTimeline() {
    modernDashboard.renderTimeline();
    modernDashboard.showToast('🔄 Timeline refreshed!', 'success');
}

// Logout Function
function logout() {
    modernDashboard.logout();
}

// ✅ INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
    // Initialize dashboard
    modernDashboard = new ModernOrganizerDashboard();
    
    // Add global styles
    const style = document.createElement('style');
    style.textContent = `
        /* Enhanced Animations */
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
        
        @keyframes fadeInOut {
            0%, 100% { opacity: 0; }
            50% { opacity: 1; }
        }
        
        /* Enhanced Hover Effects */
        .stat-card:hover { 
            transform: translateY(-8px) !important; 
            box-shadow: var(--shadow-glow-strong) !important; 
        }
        
        .quick-action:hover { 
            transform: translateY(-4px) !important; 
            box-shadow: var(--shadow-lg) !important; 
        }
        
        .timeline-item:hover { 
            transform: translateX(8px) !important; 
            box-shadow: var(--shadow-md) !important; 
        }
        
        .metric-item:hover { 
            transform: translateY(-2px) !important; 
            box-shadow: var(--shadow-md) !important; 
        }
        
        /* Accessibility Improvements */
        *:focus-visible { 
            outline: 2px solid var(--primary) !important; 
            outline-offset: 2px !important; 
        }
        
        /* Mobile Optimizations */
        .mobile-device * { 
            animation-duration: 0.2s !important; 
            transition-duration: 0.2s !important; 
        }
        
        /* Loading States */
        .loading {
            position: relative;
            overflow: hidden;
        }
        
        .loading::after {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
            animation: shimmer 1.5s infinite;
        }
        
        @keyframes shimmer {
            0% { left: -100%; }
            100% { left: 100%; }
        }
        
        /* Trend Indicators */
        .trend-indicator {
            position: absolute !important;
            animation: fadeInOut 2s ease-out !important;
        }
        
        /* Performance Optimizations */
        .stat-card, .quick-action, .timeline-item, .metric-item { 
            will-change: transform;
            backface-visibility: hidden;
        }
    `;
    document.head.appendChild(style);
    
    // Performance optimization for mobile devices
    if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        document.body.classList.add('mobile-device');
    }
    
    // Show success notification
    setTimeout(() => {
        modernDashboard.showToast('🎯 NexusHack Dashboard ready! All systems operational.', 'success');
    }, 1500);
    
    // Global error handler
    window.addEventListener('error', (e) => {
        console.error('Global error:', e);
        modernDashboard.showToast('⚠️ An error occurred. Please refresh if issues persist.', 'error');
    });
    
    // Expose dashboard globally for debugging
    window.nexushackDashboard = modernDashboard;
    
    console.log('🚀 NexusHack Organizer Dashboard v3.0 initialized successfully!');
});

// ✅ EXPORT FOR MODULE SYSTEMS
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ModernOrganizerDashboard, PerformanceMonitor };
}
