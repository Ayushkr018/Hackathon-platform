  class ModernEventSetupManager {
            constructor() {
                this.setupProgress = 85;
                this.progressSteps = [];
                this.timelineEvents = [];
                this.startDatePicker = null;
                this.endDatePicker = null;
                this.isMobile = window.innerWidth <= 1024;
                this.currentUser = { name: 'Alex Chen', initials: 'AC', role: 'Lead Organizer', id: 'org_001' };
                this.init();
            }

            init() {
                this.initializeTheme();
                this.setupEventListeners();
                this.loadProgressSteps();
                this.loadTimelineEvents();
                this.renderProgressSteps();
                this.renderTimelineEvents();
                this.initializeDatePickers();
                this.initializeUser();
                this.handleResize();
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
                this.showToast(`Theme changed to ${newTheme} mode`, 'success');
            }

            loadProgressSteps() {
                this.progressSteps = [
                    {
                        id: 1,
                        title: 'Basic Information',
                        description: 'Event name, dates, and description',
                        status: 'completed',
                        icon: 'fa-info-circle'
                    },
                    {
                        id: 2,
                        title: 'Registration Setup',
                        description: 'Participant registration configuration',
                        status: 'completed',
                        icon: 'fa-user-plus'
                    },
                    {
                        id: 3,
                        title: 'Timeline & Schedule',
                        description: 'Event timeline and milestone setup',
                        status: 'active',
                        icon: 'fa-calendar-alt'
                    },
                    {
                        id: 4,
                        title: 'Judging Criteria',
                        description: 'Scoring rubric and evaluation setup',
                        status: 'pending',
                        icon: 'fa-gavel'
                    },
                    {
                        id: 5,
                        title: 'Sponsor Integration',
                        description: 'Sponsor booths and partnership setup',
                        status: 'pending',
                        icon: 'fa-handshake'
                    },
                    {
                        id: 6,
                        title: 'Platform Integration',
                        description: 'APIs, tools, and service connections',
                        status: 'pending',
                        icon: 'fa-plug'
                    }
                ];
            }

            loadTimelineEvents() {
                this.timelineEvents = [
                    {
                        id: 1,
                        title: 'Registration Opens',
                        description: 'Participant registration begins',
                        time: '09:00 AM',
                        date: '2025-08-25',
                        type: 'registration'
                    },
                    {
                        id: 2,
                        title: 'Opening Ceremony',
                        description: 'Welcome participants and announce challenges',
                        time: '10:00 AM',
                        date: '2025-08-25',
                        type: 'ceremony'
                    },
                    {
                        id: 3,
                        title: 'Team Formation',
                        description: 'Participants form teams and choose projects',
                        time: '11:00 AM',
                        date: '2025-08-25',
                        type: 'activity'
                    },
                    {
                        id: 4,
                        title: 'Coding Begins',
                        description: 'Official hacking period starts',
                        time: '12:00 PM',
                        date: '2025-08-25',
                        type: 'coding'
                    },
                    {
                        id: 5,
                        title: 'Mid-Event Check-in',
                        description: 'Progress updates and mentor sessions',
                        time: '06:00 PM',
                        date: '2025-08-26',
                        type: 'checkpoint'
                    },
                    {
                        id: 6,
                        title: 'Final Submissions',
                        description: 'Deadline for project submissions',
                        time: '09:00 AM',
                        date: '2025-08-27',
                        type: 'deadline'
                    },
                    {
                        id: 7,
                        title: 'Judging & Presentations',
                        description: 'Teams present to judges',
                        time: '10:00 AM',
                        date: '2025-08-27',
                        type: 'judging'
                    },
                    {
                        id: 8,
                        title: 'Awards Ceremony',
                        description: 'Winner announcement and closing',
                        time: '04:00 PM',
                        date: '2025-08-27',
                        type: 'ceremony'
                    }
                ];
            }

            renderProgressSteps() {
                const container = document.getElementById('progressSteps');
                container.innerHTML = '';

                this.progressSteps.forEach((step, index) => {
                    const stepDiv = document.createElement('div');
                    stepDiv.className = `progress-step ${step.status}`;
                    stepDiv.style.opacity = '0';
                    stepDiv.style.transform = 'translateY(20px)';
                    stepDiv.innerHTML = `
                        <div class="step-header">
                            <div class="step-icon ${step.status}">
                                <i class="fas ${step.icon}"></i>
                            </div>
                            <div class="step-info">
                                <div class="step-title">${step.title}</div>
                                <div class="step-description">${step.description}</div>
                            </div>
                            <div class="step-status ${step.status}">${this.capitalizeFirst(step.status)}</div>
                        </div>
                    `;
                    
                    stepDiv.addEventListener('click', () => this.openStep(step.id));
                    container.appendChild(stepDiv);

                    // Animate in
                    setTimeout(() => {
                        stepDiv.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                        stepDiv.style.opacity = '1';
                        stepDiv.style.transform = 'translateY(0)';
                    }, index * 100);
                });
            }

            renderTimelineEvents() {
                const container = document.getElementById('timelineEvents');
                container.innerHTML = '';

                this.timelineEvents.forEach((event, index) => {
                    const eventDiv = document.createElement('div');
                    eventDiv.className = 'timeline-event';
                    eventDiv.style.opacity = '0';
                    eventDiv.style.transform = 'translateX(20px)';
                    eventDiv.innerHTML = `
                        <div class="event-header">
                            <div class="event-time">${event.time}</div>
                            <div class="event-info">
                                <div class="event-title">${event.title}</div>
                                <div class="event-description">${event.description}</div>
                            </div>
                        </div>
                        <div class="event-actions">
                            <button class="btn btn-small btn-secondary" onclick="editEvent(${event.id})">
                                <i class="fas fa-edit"></i>
                                Edit
                            </button>
                            <button class="btn btn-small btn-secondary" onclick="deleteEvent(${event.id})">
                                <i class="fas fa-trash"></i>
                                Delete
                            </button>
                        </div>
                    `;
                    container.appendChild(eventDiv);

                    // Animate in
                    setTimeout(() => {
                        eventDiv.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                        eventDiv.style.opacity = '1';
                        eventDiv.style.transform = 'translateX(0)';
                    }, index * 100);
                });
            }

            initializeDatePickers() {
                // Initialize start date picker
                this.startDatePicker = flatpickr("#startDate", {
                    enableTime: false,
                    dateFormat: "Y-m-d",
                    defaultDate: "2025-08-25",
                    minDate: "today",
                    onChange: (selectedDates, dateStr) => {
                        this.showToast(`Start date set to ${dateStr}`, 'success');
                    }
                });

                // Initialize end date picker
                this.endDatePicker = flatpickr("#endDate", {
                    enableTime: false,
                    dateFormat: "Y-m-d",
                    defaultDate: "2025-08-27",
                    minDate: "today",
                    onChange: (selectedDates, dateStr) => {
                        this.showToast(`End date set to ${dateStr}`, 'success');
                    }
                });
            }

            initializeAnimations() {
                // Enhanced entrance animations
                setTimeout(() => {
                    document.querySelectorAll('.quick-action-card').forEach((card, index) => {
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
                return str.charAt(0).toUpperCase() + str.slice(1);
            }

            openStep(id) {
                const step = this.progressSteps.find(s => s.id === id);
                if (step) {
                    this.showToast(`Opening ${step.title} configuration...`, 'info');
                }
            }

            // Header Actions
            saveProgress() {
                this.showToast('Saving event configuration progress...', 'info');
                
                setTimeout(() => {
                    this.showToast('💾 Event progress saved successfully!', 'success');
                }, 2000);
            }

            publishEvent() {
                this.showToast('Publishing event and notifying participants...', 'info');
                
                setTimeout(() => {
                    this.setupProgress = 100;
                    document.getElementById('overallProgress').textContent = '100%';
                    document.getElementById('progressBar').textContent = '100%';
                    this.showToast('🚀 Event published successfully! 1,247 participants notified!', 'success');
                }, 3000);
            }

            // Topbar Actions
            launchWizard() {
                this.showToast('🧙‍♂️ Launching AI-powered setup wizard...', 'info');
                
                setTimeout(() => {
                    this.showToast('✨ Setup wizard activated! Follow the guided steps.', 'success');
                }, 2000);
            }

            advancedConfig() {
                this.showToast('Opening advanced configuration panel...', 'info');
            }

            previewEvent() {
                this.showToast('Generating event preview...', 'info');
                
                setTimeout(() => {
                    this.showToast('👀 Event preview ready! Opening in new tab.', 'success');
                }, 2500);
            }

            // Configuration Actions
            autoFillEvent() {
                this.showToast('🤖 AI auto-filling event configuration...', 'info');
                
                setTimeout(() => {
                    // Simulate auto-fill
                    document.getElementById('eventName').value = 'NexusHack 2025 - Global Innovation Challenge';
                    document.getElementById('eventDescription').value = 'Join the ultimate global innovation challenge where brilliant minds come together to solve tomorrow\'s problems with cutting-edge technology, AI, and blockchain solutions.';
                    document.getElementById('maxParticipants').value = '2000';
                    
                    this.showToast('✨ Event details auto-filled using AI insights!', 'success');
                }, 2500);
            }

            // Timeline Actions
            addTimelineEvent() {
                this.showToast('Opening timeline event creator...', 'info');
                
                setTimeout(() => {
                    const newEvent = {
                        id: this.timelineEvents.length + 1,
                        title: 'Workshop Session',
                        description: 'Technical workshop for participants',
                        time: '02:00 PM',
                        date: '2025-08-26',
                        type: 'workshop'
                    };
                    
                    this.timelineEvents.push(newEvent);
                    this.renderTimelineEvents();
                    this.showToast('📅 New timeline event added successfully!', 'success');
                }, 2000);
            }

            editEvent(id) {
                const event = this.timelineEvents.find(e => e.id === id);
                if (event) {
                    this.showToast(`Opening editor for: ${event.title}`, 'info');
                }
            }

            deleteEvent(id) {
                const event = this.timelineEvents.find(e => e.id === id);
                if (event) {
                    this.timelineEvents = this.timelineEvents.filter(e => e.id !== id);
                    this.renderTimelineEvents();
                    this.showToast(`Event "${event.title}" removed from timeline`, 'warning');
                }
            }

            // Quick Actions
            useTemplate() {
                this.showToast('Opening hackathon template library...', 'info');
                
                setTimeout(() => {
                    this.setupProgress = Math.min(100, this.setupProgress + 10);
                    document.getElementById('overallProgress').textContent = this.setupProgress + '%';
                    document.getElementById('progressBar').textContent = this.setupProgress + '%';
                    this.showToast('📋 Template applied! Configuration updated.', 'success');
                }, 2500);
            }

            importEvent() {
                this.showToast('Opening event import wizard...', 'info');
                
                setTimeout(() => {
                    this.showToast('📥 Previous event configuration imported successfully!', 'success');
                }, 2000);
            }

            aiAssistant() {
                this.showToast('🤖 Activating AI setup assistant...', 'info');
                
                setTimeout(() => {
                    this.setupProgress = Math.min(100, this.setupProgress + 15);
                    document.getElementById('overallProgress').textContent = this.setupProgress + '%';
                    document.getElementById('progressBar').textContent = this.setupProgress + '%';
                    this.showToast('🧠 AI assistant configured your event with optimal settings!', 'success');
                }, 4000);
            }

            duplicateEvent() {
                this.showToast('Opening event duplication wizard...', 'info');
                
                setTimeout(() => {
                    this.showToast('📋 Event configuration cloned from NexusHack 2024!', 'success');
                }, 2500);
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
                    animation: slideInToast 0.3s ease-out; max-width: 450px;
                    box-shadow: var(--shadow-lg); background: var(--gradient-${type});
                `;
                
                if (window.innerWidth <= 768) {
                    toast.style.top = '1rem'; toast.style.right = '1rem';
                    toast.style.left = '1rem'; toast.style.maxWidth = 'none';
                }
                
                toast.innerHTML = `<i class="fas ${this.getToastIcon(type)}"></i><span style="margin-left: 0.5rem;">${message}</span>`;
                document.body.appendChild(toast);
                setTimeout(() => { if (toast.parentNode) toast.remove(); }, 6000);
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
        let modernEventSetupManager;

        function saveProgress() { modernEventSetupManager.saveProgress(); }
        function publishEvent() { modernEventSetupManager.publishEvent(); }
        function launchWizard() { modernEventSetupManager.launchWizard(); }
        function advancedConfig() { modernEventSetupManager.advancedConfig(); }
        function previewEvent() { modernEventSetupManager.previewEvent(); }
        function autoFillEvent() { modernEventSetupManager.autoFillEvent(); }
        function addTimelineEvent() { modernEventSetupManager.addTimelineEvent(); }
        function editEvent(id) { modernEventSetupManager.editEvent(id); }
        function deleteEvent(id) { modernEventSetupManager.deleteEvent(id); }
        function useTemplate() { modernEventSetupManager.useTemplate(); }
        function importEvent() { modernEventSetupManager.importEvent(); }
        function aiAssistant() { modernEventSetupManager.aiAssistant(); }
        function duplicateEvent() { modernEventSetupManager.duplicateEvent(); }
        function backToDashboard() { modernEventSetupManager.backToDashboard(); }

        document.addEventListener('DOMContentLoaded', () => {
            modernEventSetupManager = new ModernEventSetupManager();
            
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
                    name: modernEventSetupManager.currentUser.name,
                    initials: modernEventSetupManager.currentUser.initials,
                    role: modernEventSetupManager.currentUser.role,
                    lastActive: Date.now()
                };
                localStorage.setItem('modernOrganizerSession', JSON.stringify(sessionData));
            }, 60000);

            // Keyboard shortcuts for event setup
            document.addEventListener('keydown', (e) => {
                if (e.ctrlKey || e.metaKey) {
                    switch(e.key) {
                        case 's':
                            e.preventDefault();
                            saveProgress();
                            break;
                        case 'p':
                            e.preventDefault();
                            publishEvent();
                            break;
                        case 'w':
                            e.preventDefault();
                            launchWizard();
                            break;
                        case 't':
                            e.preventDefault();
                            useTemplate();
                            break;
                        case 'i':
                            e.preventDefault();
                            importEvent();
                            break;
                    }
                }
            });

            // Auto-save form progress
            const form = document.getElementById('eventConfigForm');
            const inputs = form.querySelectorAll('input, textarea, select');
            
            inputs.forEach(input => {
                input.addEventListener('change', () => {
                    // Save form data to localStorage
                    const formData = new FormData(form);
                    const data = Object.fromEntries(formData);
                    localStorage.setItem('eventSetupProgress', JSON.stringify(data));
                });
            });

            // Load saved form data
            const savedData = localStorage.getItem('eventSetupProgress');
            if (savedData) {
                const data = JSON.parse(savedData);
                Object.keys(data).forEach(key => {
                    const element = document.getElementById(key);
                    if (element) {
                        element.value = data[key];
                    }
                });
            }

            // Progress auto-update simulation
            setInterval(() => {
                if (modernEventSetupManager.setupProgress < 100 && Math.random() > 0.85) {
                    modernEventSetupManager.setupProgress = Math.min(100, modernEventSetupManager.setupProgress + 1);
                    document.getElementById('overallProgress').textContent = modernEventSetupManager.setupProgress + '%';
                    document.getElementById('progressBar').textContent = modernEventSetupManager.setupProgress + '%';
                }
            }, 30000); // Every 30 seconds
        });
         function logout() {
                if (confirm('Are you sure you want to logout?')) {
                    localStorage.removeItem('modernOrganizerSession');
                    modernEventSetupManager.showToast('Logging out...', 'info');
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
            
            /* Enhanced setup animations */
            .progress-step, .timeline-event, .quick-action-card { 
                transition: var(--transition) !important; 
            }
            @media (hover: hover) and (pointer: fine) {
                .progress-step:hover { 
                    transform: translateY(-6px) !important;
                    box-shadow: var(--shadow-md) !important;
                }
                .timeline-event:hover { transform: translateY(-3px) !important; }
                .quick-action-card:hover { 
                    transform: translateY(-8px) scale(1.02) !important;
                    box-shadow: var(--shadow-lg) !important;
                }
            }
            
            /* Enhanced setup status */
            .setup-status {
                position: relative;
                overflow: hidden;
            }
            .setup-status::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
                animation: setupStatusSweep 3s infinite;
            }
            
            @keyframes setupStatusSweep {
                0% { left: -100%; }
                100% { left: 100%; }
            }
            
            /* Enhanced progress indicators */
            .progress-percentage {
                position: relative;
                overflow: hidden;
            }
            .progress-percentage::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
                animation: progressShine 2s infinite;
            }
            
            @keyframes progressShine {
                0% { left: -100%; }
                100% { left: 100%; }
            }
            
            /* Enhanced step icons */
            .step-icon.active {
                position: relative;
                overflow: hidden;
            }
            .step-icon.active::after {
                content: '';
                position: absolute;
                top: -50%;
                left: -50%;
                width: 200%;
                height: 200%;
                background: linear-gradient(45deg, transparent, rgba(255,255,255,0.2), transparent);
                transform: rotate(45deg) translateX(-100%);
                animation: iconSpin 2s infinite;
            }
            
            @keyframes iconSpin {
                0% { transform: rotate(45deg) translateX(-100%); }
                100% { transform: rotate(45deg) translateX(100%); }
            }
            
            /* Enhanced form inputs */
            .form-input:focus, .form-select:focus, .form-textarea:focus {
                transform: translateY(-2px);
            }
            
            /* Enhanced timeline events */
            .event-time {
                position: relative;
                overflow: hidden;
            }
            .event-time::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
                animation: timeShine 3s infinite;
            }
            
            @keyframes timeShine {
                0% { left: -100%; }
                100% { left: 100%; }
            }
            
            /* Performance optimizations */
            .event-configuration, .timeline-builder, .quick-setup {
                contain: layout style paint;
            }
            
            /* Enhanced mobile setup wizard */
            @media (max-width: 768px) {
                .setup-wizard {
                    grid-template-columns: 1fr !important;
                }
                .form-row {
                    grid-template-columns: 1fr !important;
                }
            }
        `;
        document.head.appendChild(style);
