 class ChatManager {
            constructor() {
                this.messages = [];
                this.currentUser = { 
                    name: 'John Doe', 
                    initials: 'JD',
                    id: 'user1'
                };
                this.typingTimeout = null;
                this.isTyping = false;
                
                this.init();
            }

            init() {
                this.initializeTheme();
                this.loadMessages();
                this.renderMessages();
                this.setupEventListeners();
                this.initializeUser();
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
                    
                    this.currentUser.name = session.firstName ? 
                        `${session.firstName} ${session.lastName || ''}`.trim() : 
                        firstName;
                    
                    this.currentUser.initials = session.firstName && session.lastName ? 
                        `${session.firstName[0]}${session.lastName[0]}` : 
                        firstName.slice(0, 2).toUpperCase();
                    
                    document.getElementById('userName').textContent = this.currentUser.name;
                    document.getElementById('userAvatar').textContent = this.currentUser.initials;
                }
            }

            setupEventListeners() {
                // Theme toggle
                document.getElementById('themeToggle').addEventListener('click', () => {
                    this.toggleTheme();
                });

                // Send button
                document.getElementById('sendBtn').addEventListener('click', () => {
                    this.sendMessage();
                });

                // Message input
                const messageInput = document.getElementById('messageInput');
                messageInput.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        this.sendMessage();
                    }
                });

                messageInput.addEventListener('input', () => {
                    this.handleTyping();
                    this.autoResizeTextarea();
                });

                // Auto-resize textarea
                this.autoResizeTextarea();
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

            autoResizeTextarea() {
                const textarea = document.getElementById('messageInput');
                textarea.style.height = 'auto';
                textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
            }

            loadMessages() {
                // Load from localStorage or use mock data
                const stored = localStorage.getItem('teamChatMessages');
                if (stored) {
                    this.messages = JSON.parse(stored);
                } else {
                    this.messages = this.getMockMessages();
                    this.saveMessages();
                }
            }

            getMockMessages() {
                const now = Date.now();
                return [
                    {
                        id: 1,
                        userId: 'user2',
                        author: 'Alice Smith',
                        initials: 'AS',
                        text: 'Hey team! I just finished setting up the frontend architecture. React with TypeScript is ready to go! 🚀',
                        timestamp: now - 3600000, // 1 hour ago
                        sent: false
                    },
                    {
                        id: 2,
                        userId: 'user1',
                        author: this.currentUser.name,
                        initials: this.currentUser.initials,
                        text: 'Awesome work Alice! I\'ve got the backend API endpoints ready. The authentication system is fully implemented.',
                        timestamp: now - 3540000,
                        sent: true
                    },
                    {
                        id: 3,
                        userId: 'user3',
                        author: 'Bob Lee',
                        initials: 'BL',
                        text: 'Great progress everyone! The database schema is optimized and ready for the hackathon demo.',
                        timestamp: now - 3480000,
                        sent: false
                    },
                    {
                        id: 4,
                        userId: 'user4',
                        author: 'Carol Johnson',
                        initials: 'CJ',
                        text: 'UI mockups are complete! I\'ve designed a clean, modern interface that will impress the judges. Check your email for the Figma links! ✨',
                        timestamp: now - 3420000,
                        sent: false
                    },
                    {
                        id: 5,
                        userId: 'user1',
                        author: this.currentUser.name,
                        initials: this.currentUser.initials,
                        text: 'This is looking amazing! Should we schedule a quick team sync call to align on the final integration? We\'re so close to having everything ready! 💪',
                        timestamp: now - 3360000,
                        sent: true
                    },
                    {
                        id: 6,
                        userId: 'user2',
                        author: 'Alice Smith',
                        initials: 'AS',
                        text: 'Absolutely! How about in 30 minutes? I can show you the responsive design implementation.',
                        timestamp: now - 1800000, // 30 minutes ago
                        sent: false
                    }
                ];
            }

            saveMessages() {
                localStorage.setItem('teamChatMessages', JSON.stringify(this.messages));
            }

            renderMessages() {
                const container = document.getElementById('messagesContainer');
                container.innerHTML = '';

                if (this.messages.length === 0) {
                    this.showEmptyState();
                    return;
                }

                this.messages.forEach((message, index) => {
                    const messageEl = this.createMessageElement(message, index);
                    container.appendChild(messageEl);
                });

                // Scroll to bottom
                this.scrollToBottom();
            }

            createMessageElement(message, index) {
                const messageGroup = document.createElement('div');
                messageGroup.className = `message-group ${message.sent ? 'sent' : ''}`;

                const messageItem = document.createElement('div');
                messageItem.className = `message-item ${message.sent ? 'sent' : ''}`;
                messageItem.dataset.id = message.id;

                // Avatar
                const avatar = document.createElement('div');
                avatar.className = 'message-avatar';
                avatar.textContent = message.initials;

                // Message content
                const content = document.createElement('div');
                content.className = 'message-content';

                const bubble = document.createElement('div');
                bubble.className = 'message-bubble';

                // Author (only for received messages)
                if (!message.sent) {
                    const author = document.createElement('div');
                    author.className = 'message-author';
                    author.textContent = message.author;
                    bubble.appendChild(author);
                }

                // Message text
                const text = document.createElement('div');
                text.className = 'message-text';
                text.textContent = message.text;
                bubble.appendChild(text);

                // Timestamp
                const time = document.createElement('div');
                time.className = 'message-time';
                time.textContent = this.formatTime(message.timestamp);
                bubble.appendChild(time);

                content.appendChild(bubble);
                messageItem.appendChild(avatar);
                messageItem.appendChild(content);
                messageGroup.appendChild(messageItem);

                return messageGroup;
            }

            showEmptyState() {
                const container = document.getElementById('messagesContainer');
                container.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-icon">
                            <i class="fas fa-comments"></i>
                        </div>
                        <h3 class="empty-title">Start the conversation!</h3>
                        <p class="empty-description">
                            This is the beginning of your team chat.<br>
                            Share ideas, collaborate, and build something amazing together! 🚀
                        </p>
                    </div>
                `;
            }

            sendMessage() {
                const input = document.getElementById('messageInput');
                const text = input.value.trim();
                
                if (!text) return;

                const message = {
                    id: Date.now(),
                    userId: this.currentUser.id,
                    author: this.currentUser.name,
                    initials: this.currentUser.initials,
                    text: text,
                    timestamp: Date.now(),
                    sent: true
                };

                this.messages.push(message);
                this.saveMessages();

                // Clear input
                input.value = '';
                this.autoResizeTextarea();

                // Render messages
                this.renderMessages();

                // Simulate typing indicator and response
                this.simulateTeamResponse();

                this.showToast('Message sent!', 'success');
            }

            simulateTeamResponse() {
                // Show typing indicator
                setTimeout(() => {
                    this.showTypingIndicator();
                }, 1000);

                // Send mock response
                setTimeout(() => {
                    this.hideTypingIndicator();
                    
                    const responses = [
                        'Great idea! Let me work on that.',
                        'I agree! This will work perfectly.',
                        'Sounds good! I\'ll start implementing this.',
                        'Perfect! This aligns with our project goals.',
                        'Excellent suggestion! Let\'s move forward.',
                        'I love this approach! Very innovative.'
                    ];

                    const response = {
                        id: Date.now() + 1,
                        userId: 'user2',
                        author: 'Alice Smith',
                        initials: 'AS',
                        text: responses[Math.floor(Math.random() * responses.length)],
                        timestamp: Date.now(),
                        sent: false
                    };

                    this.messages.push(response);
                    this.saveMessages();
                    this.renderMessages();
                }, 3000);
            }

            handleTyping() {
                if (!this.isTyping) {
                    this.isTyping = true;
                    // In real app, would send typing indicator to other users
                }

                clearTimeout(this.typingTimeout);
                this.typingTimeout = setTimeout(() => {
                    this.isTyping = false;
                    // In real app, would stop typing indicator
                }, 1000);
            }

            showTypingIndicator() {
                document.getElementById('typingIndicator').classList.add('active');
                this.scrollToBottom();
            }

            hideTypingIndicator() {
                document.getElementById('typingIndicator').classList.remove('active');
            }

            scrollToBottom() {
                setTimeout(() => {
                    const container = document.getElementById('messagesContainer');
                    container.scrollTop = container.scrollHeight;
                }, 100);
            }

            formatTime(timestamp) {
                const now = Date.now();
                const diff = now - timestamp;
                
                if (diff < 60000) { // Less than 1 minute
                    return 'just now';
                } else if (diff < 3600000) { // Less than 1 hour
                    const minutes = Math.floor(diff / 60000);
                    return `${minutes}m ago`;
                } else if (diff < 86400000) { // Less than 24 hours
                    const hours = Math.floor(diff / 3600000);
                    return `${hours}h ago`;
                } else {
                    return new Date(timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                    });
                }
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
                    max-width: 300px;
                    box-shadow: var(--shadow-lg);
                    background: var(--gradient-${type});
                `;
                toast.innerHTML = `
                    <i class="fas ${this.getToastIcon(type)}"></i>
                    <span style="margin-left: 0.5rem;">${message}</span>
                `;
                
                document.body.appendChild(toast);
                
                // Auto remove after 3 seconds
                setTimeout(() => {
                    if (toast.parentNode) {
                        toast.remove();
                    }
                }, 3000);
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
        function goToDashboard() {
            window.location.href = '../participant/dashboard.html';
        }

        // Initialize the application
        let chatManager;

        document.addEventListener('DOMContentLoaded', () => {
            chatManager = new ChatManager();
            
            // Add entrance animation
            setTimeout(() => {
                document.querySelectorAll('.message-item').forEach((item, index) => {
                    setTimeout(() => {
                        item.style.opacity = '0';
                        item.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0)';
                        }, 100);
                    }, index * 100);
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