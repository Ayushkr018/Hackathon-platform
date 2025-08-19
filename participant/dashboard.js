// Initialize theme and user data
        function initializeDashboard() {
            // Load theme
            const savedTheme = localStorage.getItem('theme') || 'dark';
            document.documentElement.setAttribute('data-theme', savedTheme);
            
            const themeToggle = document.getElementById('themeToggle');
            const themeIcon = themeToggle.querySelector('i');
            themeIcon.className = savedTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
            
            // Load user data
            const userSession = localStorage.getItem('userSession');
            if (userSession) {
                const session = JSON.parse(userSession);
                const firstName = session.firstName || session.email.split('@')[0];
                
                document.getElementById('userName').textContent = session.firstName ? 
                    `${session.firstName} ${session.lastName || ''}`.trim() : 
                    firstName;
                document.getElementById('welcomeName').textContent = firstName;
                
                // Update avatar
                const initials = session.firstName && session.lastName ? 
                    `${session.firstName[0]}${session.lastName}` : 
                    firstName.slice(0, 2).toUpperCase();
                document.getElementById('userAvatar').textContent = initials;
            }
        }

        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => {
            const html = document.documentElement;
            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            const themeIcon = document.getElementById('themeToggle').querySelector('i');
            themeIcon.className = newTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
        });

        // Sidebar toggle
        const sidebar = document.getElementById('sidebar');
        const sidebarToggle = document.getElementById('sidebarToggle');

        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
        });

        // Mobile sidebar
        function toggleMobileSidebar() {
            if (window.innerWidth <= 1024) {
                sidebar.classList.toggle('open');
            }
        }

        sidebarToggle.addEventListener('click', toggleMobileSidebar);

        // Close mobile sidebar when clicking outside
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 1024 && 
                !sidebar.contains(e.target) && 
                !sidebarToggle.contains(e.target) &&
                sidebar.classList.contains('open')) {
                sidebar.classList.remove('open');
            }
        });

        // Logout function
        function logout() {
            if (confirm('Are you sure you want to logout?')) {
                localStorage.removeItem('userSession');
                window.location.href = '../auth/login.html';
            }
        }

        // Search functionality
        const searchInput = document.querySelector('.search-input');
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            if (query.length > 2) {
                // Simulate search (in real app, this would make API calls)
                console.log('Searching for:', query);
                // Add search logic here
            }
        });

        // Real-time data updates
        function updateLiveData() {
            // Update stats with slight variations
            const stats = document.querySelectorAll('.stat-value');
            stats.forEach(stat => {
                const currentValue = parseInt(stat.textContent);
                if (!isNaN(currentValue)) {
                    const variation = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
                    const newValue = Math.max(0, currentValue + variation);
                    if (variation !== 0) {
                        stat.textContent = newValue;
                        
                        // Add brief animation
                        stat.style.transform = 'scale(1.05)';
                        setTimeout(() => {
                            stat.style.transform = 'scale(1)';
                        }, 200);
                    }
                }
            });
        }

        // Update data every 30 seconds
        setInterval(updateLiveData, 30000);

        // Notification badge animation
        function animateNotificationBadge() {
            const badge = document.querySelector('.has-badge');
            badge.style.transform = 'scale(1.1)';
            setTimeout(() => {
                badge.style.transform = 'scale(1)';
            }, 300);
        }

        // Simulate new notifications
        setInterval(animateNotificationBadge, 45000);

        // Initialize dashboard on load
        document.addEventListener('DOMContentLoaded', () => {
            initializeDashboard();
            
            // Add loading animation to quick actions
            document.querySelectorAll('.quick-action').forEach(action => {
                action.addEventListener('click', function(e) {
                    if (!e.target.closest('a').href.includes('#')) {
                        const icon = this.querySelector('.action-icon i');
                        const originalClass = icon.className;
                        icon.className = 'loading';
                        
                        setTimeout(() => {
                            icon.className = originalClass;
                        }, 1000);
                    }
                });
            });
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 1024) {
                sidebar.classList.remove('open');
            }
        });

        // Smooth scroll for internal links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Add hover effects to cards
        document.querySelectorAll('.recommendation-item, .notification-item, .activity-item').forEach(item => {
            item.addEventListener('mouseenter', function() {
                this.style.transform = 'translateX(4px)';
            });
            
            item.addEventListener('mouseleave', function() {
                this.style.transform = 'translateX(0)';
            });
        });
