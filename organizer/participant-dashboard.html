 class ModernMessagingManager {
            constructor() {
                this.conversations = [];
                this.recipients = [];
                this.totalMessages = 1247;
                this.totalEmails = 15340;
                this.totalNotifications = 2890;
                this.totalCampaigns = 47;
                this.unreadCount = 5;
                this.isMobile = window.innerWidth <= 1024;
                this.currentUser = { name: 'Alex Chen', initials: 'AC', role: 'Lead Organizer', id: 'org_001' };
                this.init();
            }

            init() {
                this.initializeTheme();
                this.setupEventListeners();
                this.loadConversations();
                this.loadRecipients();
                this.renderConversations();
                this.updateRecipients();
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

            loadConversations() {
                // Generate mock conversation data
                this.conversations = [
                    {
                        id: 1,
                        sender: 'Sarah Martinez',
                        avatar: 'SM',
                        preview: 'Quick question about the submission deadline...',
                        time: '2 min ago',
                        unread: true,
                        status: 'delivered'
                    },
                    {
                        id: 2,
                        sender: 'Team AI Innovators',
                        avatar: 'AI',
                        preview: 'Thank you for the helpful resources!',
                        time: '15 min ago',
                        unread: true,
                        status: 'read'
                    },
                    {
                        id: 3,
                        sender: 'Judge Committee',
                        avatar: 'JC',
                        preview: 'Evaluation criteria clarification needed',
                        time: '1 hour ago',
                        unread: false,
                        status: 'sent'
                    },
                    {
                        id: 4,
                        sender: 'TechCorp Sponsor',
                        avatar: 'TC',
                        preview: 'Great event organization! Looking forward...',
                        time: '2 hours ago',
                        unread: true,
                        status: 'delivered'
                    },
                    {
                        id: 5,
                        sender: 'Mobile Wizards',
                        avatar: 'MW',
                        preview: 'Is there a way to extend our demo time?',
                        time: '3 hours ago',
                        unread: false,
                        status: 'read'
                    },
                    {
                        id: 6,
                        sender: 'Event Volunteer',
                        avatar: 'EV',
                        preview: 'Setup complete for the main auditorium',
                        time: '4 hours ago',
                        unread: true,
                        status: 'delivered'
                    }
                ];
            }

            loadRecipients() {
                this.recipients = {
                    all: ['All Participants (1,247)', 'All Judges (15)', 'All Sponsors (8)'],
                    teams: ['Team Leaders (312)', 'Co-founders (156)', 'Project Managers (89)'],
                    judges: ['Expert Judges (15)', 'Industry Mentors (12)', 'Technical Reviewers (8)'],
                    sponsors: ['Gold Sponsors (3)', 'Silver Sponsors (5)', 'Bronze Sponsors (8)'],
                    custom: ['Web3 Track (127)', 'AI Track (234)', 'Mobile Track (189)']
                };
            }

            renderConversations() {
                const container = document.getElementById('conversationList');
                container.innerHTML = '';

                this.conversations.forEach((conversation, index) => {
                    const conversationDiv = document.createElement('div');
                    conversationDiv.className = `conversation-item ${conversation.unread ? 'unread' : ''}`;
                    conversationDiv.style.opacity = '0';
                    conversationDiv.style.transform = 'translateY(20px)';
                    conversationDiv.innerHTML = `
                        <div class="conversation-avatar">${conversation.avatar}</div>
                        <div class="conversation-content">
                            <div class="conversation-meta">
                                <span class="conversation-sender">${conversation.sender}</span>
                                <span class="conversation-time">${conversation.time}</span>
                            </div>
                            <div class="conversation-preview">${conversation.preview}</div>
                        </div>
                        <div class="conversation-status ${conversation.status}"></div>
                    `;
                    
                    conversationDiv.addEventListener('click', () => this.openConversation(conversation.id));
                    container.appendChild(conversationDiv);

                    // Animate in
                    setTimeout(() => {
                        conversationDiv.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                        conversationDiv.style.opacity = '1';
                        conversationDiv.style.transform = 'translateY(0)';
                    }, index * 100);
                });
            }

            updateRecipients() {
                const recipientType = document.getElementById('recipientType').value;
                const recipientTags = document.getElementById('recipientTags');
                recipientTags.innerHTML = '';

                if (this.recipients[recipientType]) {
                    this.recipients[recipientType].forEach(recipient => {
                        const tag = document.createElement('div');
                        tag.className = 'recipient-tag';
                        tag.innerHTML = `
                            <span>${recipient}</span>
                            <div class="tag-remove" onclick="removeRecipient(this)">×</div>
                        `;
                        recipientTags.appendChild(tag);
                    });
                }
            }

            removeRecipient(element) {
                element.closest('.recipient-tag').remove();
            }

            initializeAnimations() {
                // Enhanced entrance animations
                setTimeout(() => {
                    document.querySelectorAll('.comm-card').forEach((card, index) => {
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

            // Communication Stats Functions
            viewMessages() {
                this.showToast('Opening message analytics dashboard...', 'info');
            }

            viewEmails() {
                this.showToast('Opening email campaign analytics...', 'info');
            }

            viewNotifications() {
                this.showToast('Opening notification delivery reports...', 'info');
            }

            viewCampaigns() {
                this.showToast('Opening campaign management center...', 'info');
            }

            // Header Actions
            viewAnalytics() {
                this.showToast('Loading comprehensive communication analytics...', 'info');
            }

            broadcastMessage() {
                this.showToast('Opening emergency broadcast system...', 'info');
                
                setTimeout(() => {
                    this.showToast('📢 Emergency broadcast sent to all 1,247 participants!', 'success');
                }, 2500);
            }

            // Topbar Actions
            openLiveChat() {
                this.showToast('Opening live chat interface...', 'info');
            }

            createEmailCampaign() {
                this.showToast('Opening email campaign designer...', 'info');
            }

            sendNotification() {
                this.showToast('Sending push notification to all devices...', 'info');
                
                setTimeout(() => {
                    const notificationsSent = Math.floor(Math.random() * 500) + 1000;
                    this.totalNotifications += notificationsSent;
                    document.getElementById('totalNotifications').textContent = this.totalNotifications.toLocaleString();
                    this.showToast(`🔔 ${notificationsSent} push notifications sent successfully!`, 'success');
                }, 2000);
            }

            // Composer Functions
            saveAsDraft() {
                const subject = document.getElementById('messageSubject').value;
                const content = document.getElementById('messageContent').value;
                
                if (subject || content) {
                    this.showToast('Message saved as draft', 'success');
                } else {
                    this.showToast('Please write something before saving', 'warning');
                }
            }

            previewMessage() {
                const subject = document.getElementById('messageSubject').value;
                const content = document.getElementById('messageContent').value;
                
                if (subject && content) {
                    this.showToast('Opening message preview...', 'info');
                } else {
                    this.showToast('Please fill in subject and content first', 'warning');
                }
            }

            sendMessage() {
                const recipientType = document.getElementById('recipientType').value;
                const messageType = document.getElementById('messageType').value;
                const subject = document.getElementById('messageSubject').value;
                const content = document.getElementById('messageContent').value;
                
                if (!subject || !content) {
                    this.showToast('Please fill in all required fields', 'warning');
                    return;
                }
                
                this.showToast('Sending message...', 'info');
                
                setTimeout(() => {
                    // Simulate message sending
                    const recipientCount = this.getRecipientCount(recipientType);
                    this.totalMessages += recipientCount;
                    document.getElementById('totalMessages').textContent = this.totalMessages.toLocaleString();
                    
                    // Clear form
                    document.getElementById('messageForm').reset();
                    this.updateRecipients();
                    
                    this.showToast(`📨 Message sent to ${recipientCount} recipients successfully!`, 'success');
                }, 2500);
            }

            getRecipientCount(type) {
                const counts = {
                    all: 1270,
                    teams: 312,
                    judges: 15,
                    sponsors: 16,
                    custom: 550
                };
                return counts[type] || 100;
            }

            // Conversation Functions
            markAllAsRead() {
                this.conversations.forEach(conv => conv.unread = false);
                this.unreadCount = 0;
                document.getElementById('unreadCount').textContent = '0';
                this.renderConversations();
                this.showToast('All messages marked as read', 'success');
            }

            openConversation(id) {
                const conversation = this.conversations.find(c => c.id === id);
                if (conversation) {
                    conversation.unread = false;
                    this.unreadCount = Math.max(0, this.unreadCount - 1);
                    document.getElementById('unreadCount').textContent = this.unreadCount.toString();
                    this.showToast(`Opening conversation with ${conversation.sender}...`, 'info');
                }
            }

            // Quick Actions
            emergencyBroadcast() {
                this.showToast('⚠️ Initiating emergency broadcast protocol...', 'warning');
                
                setTimeout(() => {
                    this.showToast('🚨 Emergency alert sent to all participants, judges, and staff!', 'danger');
                }, 3000);
            }

            createSurvey() {
                this.showToast('Opening survey creation wizard...', 'info');
            }

            scheduleReminder() {
                this.showToast('Opening reminder scheduling system...', 'info');
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
                    info: 'fa-info-circle', warning: 'fa-exclamation-triangle',
                    danger: 'fa-exclamation-triangle'
                };
                return icons[type] || 'fa-check-circle';
            }
        }

        // Global functions and initialization
        let modernMessagingManager;

        function updateRecipients() { modernMessagingManager.updateRecipients(); }
        function removeRecipient(element) { modernMessagingManager.removeRecipient(element); }
        function viewMessages() { modernMessagingManager.viewMessages(); }
        function viewEmails() { modernMessagingManager.viewEmails(); }
        function viewNotifications() { modernMessagingManager.viewNotifications(); }
        function viewCampaigns() { modernMessagingManager.viewCampaigns(); }
        function viewAnalytics() { modernMessagingManager.viewAnalytics(); }
        function broadcastMessage() { modernMessagingManager.broadcastMessage(); }
        function openLiveChat() { modernMessagingManager.openLiveChat(); }
        function createEmailCampaign() { modernMessagingManager.createEmailCampaign(); }
        function sendNotification() { modernMessagingManager.sendNotification(); }
        function saveAsDraft() { modernMessagingManager.saveAsDraft(); }
        function previewMessage() { modernMessagingManager.previewMessage(); }
        function sendMessage() { modernMessagingManager.sendMessage(); }
        function markAllAsRead() { modernMessagingManager.markAllAsRead(); }
        function emergencyBroadcast() { modernMessagingManager.emergencyBroadcast(); }
        function createSurvey() { modernMessagingManager.createSurvey(); }
        function scheduleReminder() { modernMessagingManager.scheduleReminder(); }
        function backToDashboard() { modernMessagingManager.backToDashboard(); }

        document.addEventListener('DOMContentLoaded', () => {
            modernMessagingManager = new ModernMessagingManager();
            
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
                    name: modernMessagingManager.currentUser.name,
                    initials: modernMessagingManager.currentUser.initials,
                    role: modernMessagingManager.currentUser.role,
                    lastActive: Date.now()
                };
                localStorage.setItem('modernOrganizerSession', JSON.stringify(sessionData));
            }, 60000);

            // Keyboard shortcuts for messaging
            document.addEventListener('keydown', (e) => {
                if (e.ctrlKey || e.metaKey) {
                    switch(e.key) {
                        case 'Enter':
                            e.preventDefault();
                            sendMessage();
                            break;
                        case 's':
                            e.preventDefault();
                            saveAsDraft();
                            break;
                        case 'p':
                            e.preventDefault();
                            previewMessage();
                            break;
                        case 'n':
                            e.preventDefault();
                            sendNotification();
                            break;
                    }
                }
            });

            // Auto-save draft every 30 seconds
            setInterval(() => {
                const subject = document.getElementById('messageSubject').value;
                const content = document.getElementById('messageContent').value;
                if (subject || content) {
                    localStorage.setItem('messageDraft', JSON.stringify({
                        subject, content, timestamp: Date.now()
                    }));
                }
            }, 30000);

            // Load saved draft
            const savedDraft = localStorage.getItem('messageDraft');
            if (savedDraft) {
                const draft = JSON.parse(savedDraft);
                const timeDiff = Date.now() - draft.timestamp;
                if (timeDiff < 24 * 60 * 60 * 1000) { // Less than 24 hours
                    document.getElementById('messageSubject').value = draft.subject;
                    document.getElementById('messageContent').value = draft.content;
                }
            }

            // Real-time message updates simulation
            setInterval(() => {
                if (Math.random() > 0.8) {
                    modernMessagingManager.unreadCount++;
                    document.getElementById('unreadCount').textContent = modernMessagingManager.unreadCount.toString();
                    
                    // Add new conversation
                    const newSenders = ['New Participant', 'Support Request', 'Team Update', 'Sponsor Query'];
                    const newPreviews = [
                        'I have a question about the event...',
                        'Need help with submission process',
                        'Team formation update needed',
                        'Partnership opportunity discussion'
                    ];
                    
                    const randomSender = newSenders[Math.floor(Math.random() * newSenders.length)];
                    const randomPreview = newPreviews[Math.floor(Math.random() * newPreviews.length)];
                    
                    const newConversation = {
                        id: Date.now(),
                        sender: randomSender,
                        avatar: randomSender.split(' ').map(word => word[0]).join(''),
                        preview: randomPreview,
                        time: 'Just now',
                        unread: true,
                        status: 'delivered'
                    };
                    
                    modernMessagingManager.conversations.unshift(newConversation);
                    modernMessagingManager.conversations = modernMessagingManager.conversations.slice(0, 10);
                    modernMessagingManager.renderConversations();
                }
            }, 45000); // Every 45 seconds
        });
         function logout() {
                if (confirm('Are you sure you want to logout?')) {
                    localStorage.removeItem('modernOrganizerSession');
                    modernMessagingManager.showToast('Logging out...', 'info');
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
            
            /* Enhanced messaging animations */
            .comm-card, .conversation-item, .quick-action-card { transition: var(--transition) !important; }
            @media (hover: hover) and (pointer: fine) {
                .comm-card:hover { 
                    transform: translateY(-8px) scale(1.02) !important;
                    box-shadow: var(--shadow-lg) !important;
                }
                .conversation-item:hover { transform: translateY(-3px) !important; }
                .quick-action-card:hover { transform: translateY(-6px) scale(1.02) !important; }
            }
            
            /* Enhanced message status */
            .message-status {
                position: relative;
                overflow: hidden;
            }
            .message-status::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
                animation: messageSweep 2s infinite;
            }
            
            @keyframes messageSweep {
                0% { left: -100%; }
                100% { left: 100%; }
            }
            
            /* Enhanced unread indicators */
            .conversation-item.unread {
                position: relative;
                overflow: hidden;
            }
            .conversation-item.unread::after {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                bottom: 0;
                width: 4px;
                background: linear-gradient(to bottom, #06b6d4, transparent);
                animation: unreadPulse 2s infinite;
            }
            
            @keyframes unreadPulse {
                0%, 100% { opacity: 0.5; }
                50% { opacity: 1; }
            }
            
            /* Enhanced form animations */
            .form-input:focus, .form-select:focus, .form-textarea:focus {
                transform: translateY(-2px);
                box-shadow: var(--shadow-focus), 0 8px 25px rgba(6, 182, 212, 0.15);
            }
            
            .recipient-tag {
                animation: tagAppear 0.3s ease-out;
            }
            
            @keyframes tagAppear {
                from { transform: scale(0.8); opacity: 0; }
                to { transform: scale(1); opacity: 1; }
            }
            
            /* Enhanced typing indicator */
            .form-textarea:focus {
                background: linear-gradient(145deg, var(--bg-glass), rgba(6, 182, 212, 0.05));
            }
            
            /* Performance optimizations */
            .message-composer, .conversation-panel {
                contain: layout style paint;
            }
            
            /* Enhanced mobile messaging */
            @media (max-width: 768px) {
                .conversation-item {
                    padding: 1rem 0.75rem !important;
                }
                .conversation-content {
                    font-size: 0.9rem !important;
                }
            }
            
            /* Auto-save indicator */
            .form-input:not(:placeholder-shown), .form-textarea:not(:placeholder-shown) {
                border-left: 3px solid rgba(6, 182, 212, 0.3);
            }
            
            /* Real-time notification badge */
            .unread-count {
                position: relative;
                overflow: hidden;
            }
            .unread-count::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
                animation: badgeShine 1.5s infinite;
            }
            
            @keyframes badgeShine {
                0% { left: -100%; }
                100% { left: 100%; }
            }
        `;
        document.head.appendChild(style);
