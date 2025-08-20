   class ModernEventManager {
            constructor() {
                this.currentStep = 1;
                this.totalSteps = 6;
                this.eventData = {};
                this.tracks = [];
                this.timeline = [];
                this.aiEnabled = true;
                this.isMobile = window.innerWidth <= 1024;
                this.currentUser = { name: 'Alex Chen', initials: 'AC', role: 'Lead Organizer', id: 'org_001' };
                this.init();
            }

            init() {
                this.initializeTheme();
                this.setupEventListeners();
                this.loadDefaultData();
                this.initializeUser();
                this.handleResize();
                this.setupAI();
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
                
                // Auto-save form data
                this.setupAutoSave();
                this.setupTouchGestures();
            }

            setupAutoSave() {
                const formInputs = document.querySelectorAll('input, select, textarea');
                formInputs.forEach(input => {
                    input.addEventListener('input', () => {
                        clearTimeout(this.autoSaveTimeout);
                        this.autoSaveTimeout = setTimeout(() => {
                            this.saveFormData();
                        }, 3000);
                    });
                });
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

            setupAI() {
                // AI Assistant initialization
                this.aiSuggestions = {
                    basic: [
                        "AI Innovation Summit 2025",
                        "Blockchain Future Hackathon", 
                        "Sustainable Tech Challenge",
                        "FinTech Disruption Event"
                    ],
                    tracks: [
                        { name: "Web3 & DeFi", description: "Build decentralized finance applications and blockchain solutions" },
                        { name: "AI & Machine Learning", description: "Create intelligent applications using cutting-edge AI technology" },
                        { name: "Climate Tech", description: "Develop solutions to combat climate change and promote sustainability" },
                        { name: "HealthTech Innovation", description: "Transform healthcare through technology and digital solutions" }
                    ],
                    schedule: [
                        { time: "09:00", title: "Registration & Welcome", description: "Check-in and opening ceremony" },
                        { time: "10:30", title: "Keynote & Networking", description: "Industry keynote and team formation" },
                        { time: "12:00", title: "Hacking Begins", description: "Official start of development period" },
                        { time: "18:00", title: "Progress Check-in", description: "Mentor consultations and feedback" }
                    ]
                };
            }

            initializeAnimations() {
                // Enhanced entrance animations
                setTimeout(() => {
                    document.querySelectorAll('.wizard-step').forEach((step, index) => {
                        setTimeout(() => {
                            step.style.opacity = '0';
                            step.style.transform = 'translateY(20px) scale(0.95)';
                            setTimeout(() => {
                                step.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                                step.style.opacity = '1';
                                step.style.transform = 'translateY(0) scale(1)';
                            }, 100);
                        }, index * 150);
                    });
                }, 500);
            }

            loadDefaultData() {
                this.tracks = [
                    {
                        id: 1,
                        name: 'Web3 & Blockchain Innovation',
                        description: 'Build the future of decentralized technology with blockchain, smart contracts, and DeFi protocols',
                        icon: 'fas fa-link',
                        prize: '$50,000'
                    },
                    {
                        id: 2,
                        name: 'AI & Machine Learning',
                        description: 'Create intelligent applications using artificial intelligence, neural networks, and data science',
                        icon: 'fas fa-brain',
                        prize: '$40,000'
                    },
                    {
                        id: 3,
                        name: 'Climate & Sustainability',
                        description: 'Develop solutions to combat climate change and create a sustainable future for all',
                        icon: 'fas fa-leaf',
                        prize: '$35,000'
                    }
                ];

                this.timeline = [
                    {
                        id: 1,
                        time: '09:00 AM',
                        title: 'Registration & Welcome Coffee',
                        description: 'Participant check-in, welcome kit distribution, and networking'
                    },
                    {
                        id: 2,
                        time: '10:30 AM',
                        title: 'Opening Keynote',
                        description: 'Inspiring keynote from industry leaders and event overview'
                    },
                    {
                        id: 3,
                        time: '12:00 PM',
                        title: 'Team Formation & Lunch',
                        description: 'Networking lunch and team building activities'
                    },
                    {
                        id: 4,
                        time: '02:00 PM',
                        title: 'Hacking Period Begins',
                        description: 'Official start of the development phase - let the innovation begin!'
                    },
                    {
                        id: 5,
                        time: '06:00 PM',
                        title: 'First Mentor Check-in',
                        description: 'Technical mentorship sessions and progress evaluation'
                    }
                ];

                this.renderTracks();
                this.renderTimeline();
            }

            goToStep(stepNumber) {
                if (stepNumber < 1 || stepNumber > this.totalSteps) return;
                
                // Hide current step
                document.getElementById(`step${this.currentStep}`).classList.remove('active');
                
                // Update step
                this.currentStep = stepNumber;
                
                // Show new step with animation
                const newStep = document.getElementById(`step${this.currentStep}`);
                newStep.style.opacity = '0';
                newStep.style.transform = 'translateX(20px)';
                newStep.classList.add('active');
                
                setTimeout(() => {
                    newStep.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
                    newStep.style.opacity = '1';
                    newStep.style.transform = 'translateX(0)';
                }, 50);
                
                // Update wizard navigation
                this.updateWizardNavigation();
                this.updateNavigationButtons();
                
                // Update step indicator
                document.getElementById('currentStepNumber').textContent = this.currentStep;

                // Generate summary for final step
                if (this.currentStep === 6) {
                    this.generateEventSummary();
                }
            }

            nextStep() {
                if (this.currentStep < this.totalSteps) {
                    if (this.validateCurrentStep()) {
                        this.markStepCompleted(this.currentStep);
                        this.goToStep(this.currentStep + 1);
                    }
                }
            }

            previousStep() {
                if (this.currentStep > 1) {
                    this.goToStep(this.currentStep - 1);
                }
            }

            validateCurrentStep() {
                const currentStepElement = document.getElementById(`step${this.currentStep}`);
                const requiredInputs = currentStepElement.querySelectorAll('[required]');
                
                for (let input of requiredInputs) {
                    if (!input.value.trim()) {
                        this.showToast(`Please fill in all required fields`, 'warning');
                        input.focus();
                        return false;
                    }
                }

                // Step-specific validation
                switch (this.currentStep) {
                    case 1:
                        return this.validateBasicInfo();
                    case 2:
                        return this.validateEventDetails();
                    default:
                        return true;
                }
            }

            validateBasicInfo() {
                const startDate = new Date(document.getElementById('startDate').value);
                const endDate = new Date(document.getElementById('endDate').value);
                
                if (startDate >= endDate) {
                    this.showToast('End date must be after start date', 'warning');
                    return false;
                }
                
                if (startDate < new Date()) {
                    this.showToast('Start date cannot be in the past', 'warning');
                    return false;
                }
                
                return true;
            }

            validateEventDetails() {
                const maxParticipants = parseInt(document.getElementById('maxParticipants').value);
                if (maxParticipants && maxParticipants < 10) {
                    this.showToast('Minimum 10 participants required', 'warning');
                    return false;
                }
                return true;
            }

            updateWizardNavigation() {
                const steps = document.querySelectorAll('.wizard-step');
                steps.forEach((step, index) => {
                    const stepNumber = index + 1;
                    step.classList.remove('active', 'completed');
                    
                    if (stepNumber === this.currentStep) {
                        step.classList.add('active');
                    } else if (stepNumber < this.currentStep) {
                        step.classList.add('completed');
                    }
                });
            }

            updateNavigationButtons() {
                const prevBtn = document.getElementById('prevBtn');
                const nextBtn = document.getElementById('nextBtn');
                const launchBtn = document.getElementById('launchBtn');
                
                prevBtn.style.display = this.currentStep > 1 ? 'inline-flex' : 'none';
                
                if (this.currentStep === this.totalSteps) {
                    nextBtn.style.display = 'none';
                    launchBtn.style.display = 'inline-flex';
                } else {
                    nextBtn.style.display = 'inline-flex';
                    launchBtn.style.display = 'none';
                }
            }

            markStepCompleted(stepNumber) {
                const step = document.querySelector(`.wizard-step[data-step="${stepNumber}"]`);
                if (step) {
                    step.classList.add('completed');
                }
            }

            renderTracks() {
                const container = document.getElementById('trackList');
                container.innerHTML = '';
                
                this.tracks.forEach(track => {
                    const trackDiv = document.createElement('div');
                    trackDiv.className = 'track-item';
                    trackDiv.innerHTML = `
                        <div class="track-icon">
                            <i class="${track.icon}"></i>
                        </div>
                        <div class="track-details">
                            <div class="track-name">${track.name}</div>
                            <div class="track-description">${track.description}</div>
                        </div>
                        <div style="text-align: center; margin: 0 1rem;">
                            <div style="font-weight: 700; color: var(--organizer-orange);">${track.prize || '$25,000'}</div>
                            <div style="font-size: 0.8rem; color: var(--text-muted);">Prize Pool</div>
                        </div>
                        <div class="track-controls">
                            <button class="track-control edit" onclick="editTrack(${track.id})" title="Edit Track">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="track-control delete" onclick="deleteTrack(${track.id})" title="Delete Track">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    `;
                    container.appendChild(trackDiv);
                });
            }

            renderTimeline() {
                const container = document.getElementById('timelineList');
                container.innerHTML = '';
                
                this.timeline.forEach(item => {
                    const timelineDiv = document.createElement('div');
                    timelineDiv.className = 'timeline-item';
                    timelineDiv.innerHTML = `
                        <div class="timeline-time">${item.time}</div>
                        <div class="timeline-details">
                            <div class="timeline-title">${item.title}</div>
                            <div class="timeline-description">${item.description}</div>
                        </div>
                        <div class="track-controls">
                            <button class="track-control edit" onclick="editTimelineItem(${item.id})" title="Edit Event">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="track-control delete" onclick="deleteTimelineItem(${item.id})" title="Delete Event">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    `;
                    container.appendChild(timelineDiv);
                });
            }

            generateEventSummary() {
                const form = document.getElementById('modernEventForm');
                const formData = new FormData(form);
                
                const summary = `
                    <h3 style="margin-bottom: 1.5rem; color: var(--text-primary); display: flex; align-items: center; gap: 0.5rem;">
                        <i class="fas fa-sparkles" style="color: var(--organizer-orange);"></i>
                        Event Summary
                    </h3>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2rem;">
                        <div>
                            <strong>Event Name:</strong><br>
                            ${formData.get('eventName') || 'Not specified'}
                        </div>
                        <div>
                            <strong>Format:</strong><br>
                            ${this.capitalizeFirst(formData.get('eventType') || 'Not specified')}
                        </div>
                        <div>
                            <strong>Duration:</strong><br>
                            ${formData.get('startDate') ? new Date(formData.get('startDate')).toLocaleDateString() : 'Not set'} - 
                            ${formData.get('endDate') ? new Date(formData.get('endDate')).toLocaleDateString() : 'Not set'}
                        </div>
                        <div>
                            <strong>Max Participants:</strong><br>
                            ${formData.get('maxParticipants') || 'Unlimited'}
                        </div>
                        <div>
                            <strong>Category:</strong><br>
                            ${this.capitalizeFirst(formData.get('eventCategory') || 'Not specified')}
                        </div>
                        <div>
                            <strong>Prize Pool:</strong><br>
                            $${formData.get('prizePool') ? parseInt(formData.get('prizePool')).toLocaleString() : '0'}
                        </div>
                    </div>
                    
                    <div style="margin-bottom: 2rem;">
                        <strong>Challenge Tracks:</strong><br>
                        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.5rem;">
                            ${this.tracks.map(track => `
                                <span style="background: var(--bg-event); color: var(--organizer-orange); padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.8rem;">
                                    ${track.name}
                                </span>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div style="margin-bottom: 2rem;">
                        <strong>Advanced Features Enabled:</strong><br>
                        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.5rem;">
                            ${document.getElementById('enableLeaderboard').checked ? '<span style="background: var(--gradient-success); color: white; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.8rem;">Live Leaderboard</span>' : ''}
                            ${document.getElementById('enablePlagiarism').checked ? '<span style="background: var(--gradient-ai); color: white; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.8rem;">AI Plagiarism Detection</span>' : ''}
                            ${document.getElementById('enableWeb3').checked ? '<span style="background: var(--gradient-web3); color: white; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.8rem;">Web3 & NFTs</span>' : ''}
                            ${document.getElementById('enablePayments').checked ? '<span style="background: var(--gradient-payment); color: white; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.8rem;">Payment Processing</span>' : ''}
                            ${document.getElementById('enableCertificates').checked ? '<span style="background: var(--gradient-warning); color: white; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.8rem;">Auto-Certificates</span>' : ''}
                        </div>
                    </div>
                    
                    <div style="background: var(--gradient-success); color: white; padding: 1.5rem; border-radius: 12px; text-align: center;">
                        <i class="fas fa-rocket" style="font-size: 2rem; margin-bottom: 0.5rem;"></i><br>
                        <strong>Ready to Launch!</strong><br>
                        Your next-generation hackathon is configured and ready to go live.
                    </div>
                `;
                
                document.getElementById('eventSummary').innerHTML = summary;
            }

            // AI Functions
            toggleAI() {
                const aiChat = document.getElementById('aiChat');
                aiChat.classList.toggle('active');
            }

            aiSuggestBasic() {
                const suggestion = this.aiSuggestions.basic[Math.floor(Math.random() * this.aiSuggestions.basic.length)];
                document.getElementById('eventName').value = suggestion;
                this.showToast('AI suggested an event name!', 'success');
            }

            aiSuggestDetails() {
                // AI suggests optimized settings based on category
                const category = document.getElementById('eventCategory').value;
                if (category === 'web3') {
                    document.getElementById('enableWeb3').checked = true;
                    document.getElementById('enablePayments').checked = true;
                } else if (category === 'ai') {
                    document.getElementById('enablePlagiarism').checked = true;
                }
                this.showToast('AI optimized your event settings!', 'success');
            }

            aiSuggestTracks() {
                this.tracks = [...this.aiSuggestions.tracks.map((track, index) => ({
                    id: index + 100,
                    name: track.name,
                    description: track.description,
                    icon: 'fas fa-star',
                    prize: '$' + (50000 - index * 10000).toLocaleString()
                }))];
                this.renderTracks();
                this.showToast('AI generated challenge tracks!', 'success');
            }

            aiOptimizeSchedule() {
                this.timeline = [...this.aiSuggestions.schedule.map((item, index) => ({
                    id: index + 100,
                    time: item.time,
                    title: item.title,
                    description: item.description
                }))];
                this.renderTimeline();
                this.showToast('AI optimized your event schedule!', 'success');
            }

            // CRUD Functions
            addTrack() {
                const name = prompt('Enter track name:');
                const description = prompt('Enter track description:');
                
                if (name && description) {
                    const newTrack = {
                        id: Date.now(),
                        name: name,
                        description: description,
                        icon: 'fas fa-star',
                        prize: '$25,000'
                    };
                    this.tracks.push(newTrack);
                    this.renderTracks();
                    this.showToast('Track added successfully!', 'success');
                }
            }

            addTimelineItem() {
                const time = prompt('Enter time (e.g., 09:00 AM):');
                const title = prompt('Enter event title:');
                const description = prompt('Enter event description:');
                
                if (time && title && description) {
                    const newItem = {
                        id: Date.now(),
                        time: time,
                        title: title,
                        description: description
                    };
                    this.timeline.push(newItem);
                    this.renderTimeline();
                    this.showToast('Timeline event added successfully!', 'success');
                }
            }

            deleteTrack(trackId) {
                if (confirm('Are you sure you want to delete this track?')) {
                    this.tracks = this.tracks.filter(track => track.id !== trackId);
                    this.renderTracks();
                    this.showToast('Track deleted successfully!', 'success');
                }
            }

            deleteTimelineItem(itemId) {
                if (confirm('Are you sure you want to delete this timeline event?')) {
                    this.timeline = this.timeline.filter(item => item.id !== itemId);
                    this.renderTimeline();
                    this.showToast('Timeline event deleted successfully!', 'success');
                }
            }

            saveFormData() {
                const formData = new FormData(document.getElementById('modernEventForm'));
                const eventData = {};
                
                for (let [key, value] of formData.entries()) {
                    eventData[key] = value;
                }
                
                eventData.tracks = this.tracks;
                eventData.timeline = this.timeline;
                eventData.lastSaved = Date.now();
                eventData.currentStep = this.currentStep;
                
                localStorage.setItem('modernEventDraft', JSON.stringify(eventData));
            }

            saveDraft() {
                this.saveFormData();
                this.showToast('Event draft saved successfully!', 'success');
            }

            previewEvent() {
                this.showToast('Event preview will open in new tab...', 'info');
            }

            launchEvent() {
                if (!this.validateAllSteps()) {
                    this.showToast('Please complete all required information', 'warning');
                    return;
                }

                if (!confirm('Are you sure you want to launch this event? It will go live immediately and be visible to participants.')) {
                    return;
                }

                this.collectEventData();
                
                // Simulate launching with loading
                this.showToast('Launching your next-generation hackathon...', 'info');
                
                setTimeout(() => {
                    this.showToast('Event launched successfully! 🎉', 'success');
                    setTimeout(() => {
                        window.location.href = 'dashboard.html';
                    }, 2000);
                }, 3000);
            }

            validateAllSteps() {
                // Comprehensive validation for all steps
                const eventName = document.getElementById('eventName').value;
                const startDate = document.getElementById('startDate').value;
                const endDate = document.getElementById('endDate').value;
                const eventType = document.getElementById('eventType').value;
                
                return eventName && startDate && endDate && eventType;
            }

            collectEventData() {
                const form = document.getElementById('modernEventForm');
                const formData = new FormData(form);
                
                this.eventData = {
                    // Basic Info
                    eventName: formData.get('eventName'),
                    eventType: formData.get('eventType'),
                    startDate: formData.get('startDate'),
                    endDate: formData.get('endDate'),
                    description: formData.get('eventDescription'),
                    maxParticipants: formData.get('maxParticipants'),
                    location: formData.get('eventLocation'),
                    
                    // Details
                    category: formData.get('eventCategory'),
                    teamSize: formData.get('teamSize'),
                    registrationFee: formData.get('registrationFee'),
                    prizePool: formData.get('prizePool'),
                    rules: formData.get('eventRules'),
                    judgingCriteria: formData.get('judgingCriteria'),
                    
                    // Advanced Features
                    features: {
                        plagiarismDetection: document.getElementById('enablePlagiarism').checked,
                        liveLeaderboard: document.getElementById('enableLeaderboard').checked,
                        web3Integration: document.getElementById('enableWeb3').checked,
                        paymentProcessing: document.getElementById('enablePayments').checked,
                        autoCertificates: document.getElementById('enableCertificates').checked,
                        liveStreaming: document.getElementById('enableStreaming').checked
                    },
                    
                    // Tracks and Timeline
                    tracks: this.tracks,
                    timeline: this.timeline,
                    
                    // Meta
                    organizerId: this.currentUser.id,
                    createdAt: Date.now(),
                    status: 'published'
                };

                // Save to localStorage
                const existingEvents = JSON.parse(localStorage.getItem('modernPublishedEvents') || '[]');
                existingEvents.push(this.eventData);
                localStorage.setItem('modernPublishedEvents', JSON.stringify(existingEvents));
            }

            capitalizeFirst(str) {
                return str.charAt(0).toUpperCase() + str.slice(1).replace('-', ' ');
            }

            backToDashboard() {
                if (this.hasUnsavedChanges()) {
                    if (confirm('You have unsaved changes. Do you want to save as draft before leaving?')) {
                        this.saveDraft();
                    }
                }
                window.location.href = 'dashboard.html';
            }

            hasUnsavedChanges() {
                const form = document.getElementById('modernEventForm');
                const inputs = form.querySelectorAll('input, select, textarea');
                return Array.from(inputs).some(input => input.value.trim() !== '');
            }

                        showToast(message, type = 'success') {
                const existingToast = document.querySelector('.toast');
                if (existingToast) existingToast.remove();
                
                const toast = document.createElement('div');
                toast.className = `toast ${type}`;
                toast.style.cssText = `
                    position: fixed; top: 2rem; right: 2rem; padding: 1rem 1.5rem;
                    border-radius: 12px; color: white; font-weight: 500; z-index: 10001;
                    animation: slideInToast 0.3s ease-out; max-width: 350px;
                    box-shadow: var(--shadow-lg); background: var(--gradient-${type});
                `;
                
                if (window.innerWidth <= 768) {
                    toast.style.top = '1rem'; toast.style.right = '1rem';
                    toast.style.left = '1rem'; toast.style.maxWidth = 'none';
                }
                
                toast.innerHTML = `<i class="fas ${this.getToastIcon(type)}"></i><span style="margin-left: 0.5rem;">${message}</span>`;
                document.body.appendChild(toast);
                setTimeout(() => { if (toast.parentNode) toast.remove(); }, 4000);
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
        let modernEventManager;

        function goToStep(step) { modernEventManager.goToStep(step); }
        function nextStep() { modernEventManager.nextStep(); }
        function previousStep() { modernEventManager.previousStep(); }
        function addTrack() { modernEventManager.addTrack(); }
        function addTimelineItem() { modernEventManager.addTimelineItem(); }
        function deleteTrack(id) { modernEventManager.deleteTrack(id); }
        function deleteTimelineItem(id) { modernEventManager.deleteTimelineItem(id); }
        function editTrack(id) { modernEventManager.showToast('Advanced track editor opening...', 'info'); }
        function editTimelineItem(id) { modernEventManager.showToast('Timeline event editor opening...', 'info'); }
        function saveDraft() { modernEventManager.saveDraft(); }
        function previewEvent() { modernEventManager.previewEvent(); }
        function launchEvent() { modernEventManager.launchEvent(); }
        function backToDashboard() { modernEventManager.backToDashboard(); }
        function toggleAI() { modernEventManager.toggleAI(); }
        function aiSuggestBasic() { modernEventManager.aiSuggestBasic(); }
        function aiSuggestDetails() { modernEventManager.aiSuggestDetails(); }
        function aiSuggestTracks() { modernEventManager.aiSuggestTracks(); }
        function aiOptimizeSchedule() { modernEventManager.aiOptimizeSchedule(); }

        document.addEventListener('DOMContentLoaded', () => {
            modernEventManager = new ModernEventManager();
            
            // Initialize date inputs with default values
            const now = new Date();
            const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
            const dayAfter = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
            
            document.getElementById('startDate').value = tomorrow.toISOString().slice(0, 16);
            document.getElementById('endDate').value = dayAfter.toISOString().slice(0, 16);
            
            // Enhanced form animations
            setTimeout(() => {
                const formGroups = document.querySelectorAll('.form-step.active .form-group');
                formGroups.forEach((group, index) => {
                    setTimeout(() => {
                        group.style.opacity = '0';
                        group.style.transform = 'translateY(30px)';
                        setTimeout(() => {
                            group.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                            group.style.opacity = '1';
                            group.style.transform = 'translateY(0)';
                        }, 100);
                    }, index * 150);
                });
            }, 800);

            // Track and timeline animations
            setTimeout(() => {
                document.querySelectorAll('.track-item, .timeline-item').forEach((item, index) => {
                    setTimeout(() => {
                        item.style.opacity = '0';
                        item.style.transform = 'translateX(-30px)';
                        setTimeout(() => {
                            item.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                            item.style.opacity = '1';
                            item.style.transform = 'translateX(0)';
                        }, 100);
                    }, index * 100);
                });
            }, 1200);

            // AI Assistant pulse animation
            setTimeout(() => {
                const aiToggle = document.querySelector('.ai-toggle');
                if (aiToggle) {
                    aiToggle.style.animation = 'pulse 2s infinite';
                }
            }, 3000);

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
                    name: modernEventManager.currentUser.name,
                    initials: modernEventManager.currentUser.initials,
                    role: modernEventManager.currentUser.role,
                    lastActive: Date.now()
                };
                localStorage.setItem('modernOrganizerSession', JSON.stringify(sessionData));
            }, 60000); // Save every minute

            // Load saved draft if exists
            const savedDraft = localStorage.getItem('modernEventDraft');
            if (savedDraft) {
                const draftData = JSON.parse(savedDraft);
                
                // Restore form values
                Object.keys(draftData).forEach(key => {
                    const element = document.getElementById(key);
                    if (element && typeof draftData[key] === 'string') {
                        element.value = draftData[key];
                    }
                });

                // Restore tracks and timeline
                if (draftData.tracks) {
                    modernEventManager.tracks = draftData.tracks;
                    modernEventManager.renderTracks();
                }
                if (draftData.timeline) {
                    modernEventManager.timeline = draftData.timeline;
                    modernEventManager.renderTimeline();
                }

                // Restore current step
                if (draftData.currentStep) {
                    modernEventManager.goToStep(draftData.currentStep);
                }

                modernEventManager.showToast('Draft loaded successfully!', 'info');
            }
        });

         function logout() {
                if (confirm('Are you sure you want to logout?')) {
                    localStorage.removeItem('modernOrganizerSession');
                    modernEventManager.showToast('Logging out...', 'info');
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
            
            /* Enhanced form animations */
            .form-step { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important; }
            .wizard-step, .track-item, .timeline-item, .add-button { transition: var(--transition) !important; }
            
            @media (hover: hover) and (pointer: fine) {
                .wizard-step:hover { transform: translateY(-4px) scale(1.02) !important; }
                .track-item:hover { transform: translateY(-4px) !important; }
                .timeline-item:hover { transform: translateY(-4px) !important; }
                .add-button:hover { transform: translateY(-4px) scale(1.02) !important; }
                .form-input:hover, .form-select:hover, .form-textarea:hover {
                    border-color: var(--border-accent) !important;
                    background: var(--bg-glass-hover) !important;
                }
            }
            
            *:focus-visible { outline: 2px solid var(--primary) !important; outline-offset: 2px !important; }
            
            /* AI Assistant animations */
            .ai-toggle {
                animation: aiPulse 3s infinite;
            }
            @keyframes aiPulse {
                0%, 100% { 
                    box-shadow: 0 0 20px rgba(139, 92, 246, 0.3);
                    transform: scale(1);
                }
                50% { 
                    box-shadow: 0 0 40px rgba(139, 92, 246, 0.6);
                    transform: scale(1.05);
                }
            }
            
            /* Modern form enhancements */
            .form-input:focus, .form-select:focus, .form-textarea:focus {
                transform: translateY(-2px) !important;
            }
            
            /* Wizard step hover effects */
            .wizard-step {
                position: relative;
                overflow: hidden;
            }
            .wizard-step::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
                transition: var(--transition-fast);
            }
            .wizard-step:hover::before {
                left: 100%;
            }
            
            /* Track and timeline item enhancements */
            .track-item, .timeline-item {
                position: relative;
                overflow: hidden;
            }
            .track-item::after, .timeline-item::after {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 2px;
                background: var(--gradient-event);
                transform: scaleX(0);
                transform-origin: left;
                transition: var(--transition);
            }
            .track-item:hover::after, .timeline-item:hover::after {
                transform: scaleX(1);
            }
            
            /* Enhanced button effects */
            .btn {
                position: relative;
                overflow: hidden;
            }
            .btn:hover {
                transform: translateY(-3px) scale(1.02) !important;
            }
            
            /* Loading animation for AI suggestions */
            .btn-ai.loading {
                pointer-events: none;
                opacity: 0.7;
            }
            .btn-ai.loading::after {
                content: '';
                position: absolute;
                width: 16px;
                height: 16px;
                border: 2px solid transparent;
                border-top: 2px solid white;
                border-radius: 50%;
                animation: spin 1s infinite linear;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }
            @keyframes spin {
                from { transform: translate(-50%, -50%) rotate(0deg); }
                to { transform: translate(-50%, -50%) rotate(360deg); }
            }
            
            /* Mobile form optimizations */
            @media (max-width: 768px) {
                .form-row {
                    grid-template-columns: 1fr !important;
                    gap: 1rem !important;
                }
                .wizard-steps {
                    flex-wrap: nowrap !important;
                    overflow-x: auto !important;
                    padding-bottom: 0.5rem;
                }
                .wizard-steps::-webkit-scrollbar {
                    height: 4px;
                }
                .wizard-steps::-webkit-scrollbar-track {
                    background: var(--bg-glass);
                    border-radius: 2px;
                }
                .wizard-steps::-webkit-scrollbar-thumb {
                    background: var(--border-accent);
                    border-radius: 2px;
                }
            }
            
            /* Enhanced checkboxes for advanced features */
            input[type="checkbox"] {
                width: 20px !important;
                height: 20px !important;
                accent-color: var(--organizer-orange) !important;
                cursor: pointer !important;
            }
            
            /* Section header enhancements */
            .section-header {
                position: relative;
            }
            .section-header::after {
                content: '';
                position: absolute;
                bottom: 0;
                left: 0;
                width: 50px;
                height: 3px;
                background: var(--gradient-event);
                border-radius: 2px;
            }
            
            /* Form validation styles */
            .form-input:invalid {
                border-color: var(--danger) !important;
                box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.1) !important;
            }
            .form-input:valid {
                border-color: var(--success) !important;
            }
        `;
        document.head.appendChild(style);
