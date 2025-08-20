 class NotificationCenter {
            constructor() {
                this.notifications = [];
                this.currentFilter = 'all';
                
                this.init();
            }

            init() {
                this.initializeTheme();
                this.setupEventListeners();
                this.loadNotifications();
                this.startAutoRefresh();
            }

            initializeTheme() {
                const savedTheme = localStorage.getItem('theme') || 'dark';
                document.documentElement.setAttribute('data-theme', savedTheme);
                
                const themeToggle = document.getElementById('themeToggle');
                const themeIcon = themeToggle.querySelector('i');
                themeIcon.className = savedTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
            }

            setupEventListeners() {
                // Theme toggle
                document.getElementById('themeToggle').addEventListener('click', () => {
                    this.toggleTheme();
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

            loadNotifications() {
                // Show loading state
                document.getElementById('loadingContainer').style.display = 'flex';
                
                // Simulate loading delay
                setTimeout(() => {
                    // Load from localStorage or use mock data
                    const stored = localStorage.getItem('userNotifications');
                    if (stored) {
                        this.notifications = JSON.parse(stored);
                    } else {
                        this.notifications = this.getMockNotifications();
                        this.saveNotifications();
                    }
                    
                    this.renderNotifications();
                    this.updateStats();
                    
                    document.getElementById('loadingContainer').style.display = 'none';
                }, 1500);
            }

            getMockNotifications() {
                return [
                    {
                        id: 1,
                        title: 'Welcome to NexusHack!',
                        message: 'Thanks for joining our hackathon community! Get ready to build amazing projects.',
                        time: '2 hours ago',
                        category: 'system',
                        type: 'info',
                        read: false,
                        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
                    },
                    {
                        id: 2,
                        title: 'New Hackathon Available',
                        message: 'The Web3 Innovation Challenge 2025 is now open for registration. Don\'t miss out!',
                        time: '1 day ago',
                        category: 'events',
                        type: 'event',
                        read: false,
                        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000)
                    },
                    {
                        id: 3,
                        title: 'Team Invitation Received',
                        message: 'BlockMasters team has invited you to join their hackathon project.',
                        time: '1 day ago',
                        category: 'teams',
                        type: 'success',
                        read: false,
                        timestamp: new Date(Date.now() - 25 * 60 * 60 * 1000)
                    },
                    {
                        id: 4,
                        title: 'Submission Successful',
                        message: 'Your project "DeFi Wallet" has been successfully submitted to the Web3 Challenge.',
                        time: '2 days ago',
                        category: 'submissions',
                        type: 'success',
                        read: true,
                        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
                    },
                    {
                        id: 5,
                        title: 'Hackathon Reminder',
                        message: 'Only 3 days left to submit your project for the AI Healthcare Hackathon.',
                        time: '3 days ago',
                        category: 'events',
                        type: 'warning',
                        read: true,
                        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
                    },
                    {
                        id: 6,
                        title: 'Profile Updated',
                        message: 'Your profile information has been successfully updated.',
                        time: '1 week ago',
                        category: 'system',
                        type: 'info',
                        read: true,
                        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                    },
                    {
                        id: 7,
                        title: 'Achievement Unlocked!',
                        message: 'Congratulations! You\'ve earned the "Team Player" achievement.',
                        time: '1 week ago',
                        category: 'system',
                        type: 'success',
                        read: true,
                        timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000)
                    },
                    {
                        id: 8,
                        title: 'Security Alert',
                        message: 'New login detected from Chrome on Windows. If this wasn\'t you, please secure your account.',
                        time: '2 weeks ago',
                        category: 'system',
                        type: 'danger',
                        read: true,
                        timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
                    }
                ];
            }

            saveNotifications() {
                localStorage.setItem('userNotifications', JSON.stringify(this.notifications));
            }

            renderNotifications() {
                const container = document.getElementById('notificationsList');
                const emptyState = document.getElementById('emptyState');
                
                let filteredNotifications = this.getFilteredNotifications();
                
                if (filteredNotifications.length === 0) {
                    container.innerHTML = '';
                    emptyState.style.display = 'block';
                    return;
                }
                
                emptyState.style.display = 'none';
                
                container.innerHTML = filteredNotifications.map(notification => `
                    <div class="notification-item ${!notification.read ? 'unread' : ''}" data-id="${notification.id}">
                        <div class="notification-icon ${notification.type}">
                            <i class="fas ${this.getNotificationIcon(notification.type, notification.category)}"></i>
                        </div>
                        <div class="notification-content" onclick="handleNotificationClick(${notification.id})">
                            <h3 class="notification-title">${notification.title}</h3>
                            <p class="notification-message">${notification.message}</p>
                            <div class="notification-meta">
                                <div class="notification-time">
                                    <i class="fas fa-clock"></i>
                                    ${notification.time}
                                </div>
                                <div class="notification-category">
                                    <i class="fas fa-tag"></i>
                                    ${notification.category}
                                </div>
                            </div>
                        </div>
                        <div class="notification-actions">
                            ${!notification.read ? `
                                <button class="notification-action primary" onclick="markAsRead(${notification.id})">
                                    <i class="fas fa-check"></i>
                                    Mark Read
                                </button>
                            ` : `
                                <button class="notification-action" onclick="markAsUnread(${notification.id})">
                                    <i class="fas fa-envelope"></i>
                                    Mark Unread
                                </button>
                            `}
                            <button class="notification-action danger" onclick="deleteNotification(${notification.id})">
                                <i class="fas fa-trash"></i>
                                Delete
                            </button>
                        </div>
                    </div>
                `).join('');
            }

            getFilteredNotifications() {
                if (this.currentFilter === 'all') {
                    return this.notifications;
                } else if (this.currentFilter === 'unread') {
                    return this.notifications.filter(n => !n.read);
                } else {
                    return this.notifications.filter(n => n.category === this.currentFilter);
                }
            }

            getNotificationIcon(type, category) {
                const icons = {
                    info: 'fa-info-circle',
                    success: 'fa-check-circle',
                    warning: 'fa-exclamation-triangle',
                    danger: 'fa-exclamation-circle',
                    event: 'fa-calendar'
                };
                
                const categoryIcons = {
                    events: 'fa-calendar-alt',
                    teams: 'fa-users',
                    submissions: 'fa-upload',
                    system: 'fa-cog'
                };
                
                return categoryIcons[category] || icons[type] || 'fa-bell';
            }

            updateStats() {
                const totalCount = this.notifications.length;
                const unreadCount = this.notifications.filter(n => !n.read).length;
                const todayCount = this.notifications.filter(n => {
                    const today = new Date();
                    const notifDate = new Date(n.timestamp);
                    return notifDate.toDateString() === today.toDateString();
                }).length;
                
                document.getElementById('totalCount').textContent = totalCount;
                document.getElementById('unreadCount').textContent = unreadCount;
                document.getElementById('todayCount').textContent = todayCount;
            }

            filterNotifications(filter) {
                this.currentFilter = filter;
                
                // Update active filter button
                document.querySelectorAll('.filter-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
                
                this.renderNotifications();
            }

            markAsRead(id) {
                const notification = this.notifications.find(n => n.id === id);
                if (notification) {
                    notification.read = true;
                    this.saveNotifications();
                    this.renderNotifications();
                    this.updateStats();
                    this.showToast('Notification marked as read', 'success');
                }
            }

            markAsUnread(id) {
                const notification = this.notifications.find(n => n.id === id);
                if (notification) {
                    notification.read = false;
                    this.saveNotifications();
                    this.renderNotifications();
                    this.updateStats();
                    this.showToast('Notification marked as unread', 'info');
                }
            }

            deleteNotification(id) {
                if (confirm('Are you sure you want to delete this notification?')) {
                    this.notifications = this.notifications.filter(n => n.id !== id);
                    this.saveNotifications();
                    this.renderNotifications();
                    this.updateStats();
                    this.showToast('Notification deleted', 'success');
                }
            }

            markAllAsRead() {
                this.notifications.forEach(n => n.read = true);
                this.saveNotifications();
                this.renderNotifications();
                this.updateStats();
                this.showToast('All notifications marked as read', 'success');
            }

            clearAllNotifications() {
                if (confirm('Are you sure you want to delete all notifications? This action cannot be undone.')) {
                    this.notifications = [];
                    this.saveNotifications();
                    this.renderNotifications();
                    this.updateStats();
                    this.showToast('All notifications cleared', 'success');
                }
            }

            refreshNotifications() {
                const button = event.target;
                const originalContent = button.innerHTML;
                
                button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Refreshing...';
                button.disabled = true;
                
                setTimeout(() => {
                    // In real implementation, would fetch from server
                    this.showToast('Notifications refreshed!', 'info');
                    
                    // Reset button
                    button.innerHTML = originalContent;
                    button.disabled = false;
                }, 2000);
            }

            handleNotificationClick(id) {
                const notification = this.notifications.find(n => n.id === id);
                if (notification && !notification.read) {
                    this.markAsRead(id);
                }
                
                // Handle different notification types
                switch (notification.category) {
                    case 'events':
                        this.showToast('Redirecting to event details...', 'info');
                        // setTimeout(() => window.location.href = 'event-details.html', 1000);
                        break;
                    case 'teams':
                        this.showToast('Opening team invitation...', 'info');
                        break;
                    case 'submissions':
                        this.showToast('Viewing submission details...', 'info');
                        break;
                    default:
                        this.showToast(`Notification: ${notification.title}`, 'info');
                }
            }

            startAutoRefresh() {
                // Auto refresh every 30 seconds
                setInterval(() => {
                    // In real implementation, would check for new notifications from server
                    console.log('Auto-refreshing notifications...');
                }, 30000);
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

        // Global instance and functions for onclick handlers
        let notificationCenter;

        function filterNotifications(filter) {
            notificationCenter.filterNotifications(filter);
        }

        function markAsRead(id) {
            notificationCenter.markAsRead(id);
        }

        function markAsUnread(id) {
            notificationCenter.markAsUnread(id);
        }

        function deleteNotification(id) {
            notificationCenter.deleteNotification(id);
        }

        function markAllAsRead() {
            notificationCenter.markAllAsRead();
        }

        function clearAllNotifications() {
            notificationCenter.clearAllNotifications();
        }

        function refreshNotifications() {
            notificationCenter.refreshNotifications();
        }

        function handleNotificationClick(id) {
            notificationCenter.handleNotificationClick(id);
        }

        // Initialize the application
        document.addEventListener('DOMContentLoaded', () => {
            notificationCenter = new NotificationCenter();
            
            // Animate notifications on page load
            setTimeout(() => {
                document.querySelectorAll('.notification-item').forEach((item, index) => {
                    setTimeout(() => {
                        item.style.transform = 'translateX(-10px)';
                        item.style.opacity = '0';
                        setTimeout(() => {
                            item.style.transform = 'translateX(0)';
                            item.style.opacity = '1';
                        }, 100);
                    }, index * 100);
                });
            }, 2000);
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