// Same JavaScript as before - just copy the complete JavaScript from previous response
        // Advanced JavaScript for Leaderboard with FIXED Button Issues
        class LeaderboardManager {
            constructor() {
                this.currentEvent = 'web3-innovation-2025';
                this.currentCategory = 'overall';
                this.currentPeriod = 'current';
                this.currentSort = 'rank';
                this.participants = [
                    {
                        id: 'alex-chen',
                        name: 'Alex Chen',
                        team: 'BlockMasters',
                        avatar: 'AC',
                        rank: 1,
                        score: 9.8,
                        projects: 3,
                        wins: 2,
                        trend: 0,
                        achievements: ['Champion', 'Top Scorer'],
                        event: 'web3-innovation-2025'
                    },
                    {
                        id: 'sarah-miller',
                        name: 'Sarah Miller',
                        team: 'CryptoBuilders',
                        avatar: 'SM',
                        rank: 2,
                        score: 9.2,
                        projects: 4,
                        wins: 1,
                        trend: 1,
                        achievements: ['Rising Star'],
                        event: 'web3-innovation-2025'
                    },
                    {
                        id: 'mike-johnson',
                        name: 'Mike Johnson',
                        team: 'WebInnovators',
                        avatar: 'MJ',
                        rank: 3,
                        score: 8.9,
                        projects: 2,
                        wins: 1,
                        trend: -1,
                        achievements: ['Consistent Performer'],
                        event: 'web3-innovation-2025'
                    },
                    {
                        id: 'emma-green',
                        name: 'Emma Green',
                        team: 'EcoTech Solutions',
                        avatar: 'EG',
                        rank: 4,
                        score: 8.7,
                        projects: 3,
                        wins: 0,
                        trend: 2,
                        achievements: ['Innovation Award'],
                        event: 'web3-innovation-2025'
                    },
                    {
                        id: 'john-doe',
                        name: 'John Doe',
                        team: 'Block Innovators',
                        avatar: 'JD',
                        rank: 23,
                        score: 8.7,
                        projects: 2,
                        wins: 0,
                        trend: 5,
                        achievements: ['Team Player'],
                        event: 'web3-innovation-2025',
                        isCurrentUser: true
                    }
                ];
                
                this.init();
            }

            init() {
                this.initializeTheme();
                this.initializeUser();
                this.setupEventListeners();
                this.loadLeaderboard();
                this.startLiveUpdates();
                this.setupTableButtonListeners();
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

            // FIXED: Setup proper table button listeners
            setupTableButtonListeners() {
                const tableButtons = document.querySelectorAll('.table-btn[data-sort]');
                tableButtons.forEach(button => {
                    button.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        // Remove active from all buttons
                        tableButtons.forEach(btn => btn.classList.remove('active'));
                        
                        // Add active to clicked button
                        button.classList.add('active');
                        
                        // Get sort criteria
                        const sortCriteria = button.getAttribute('data-sort');
                        this.currentSort = sortCriteria;
                        
                        this.showToast(`Sorting by ${sortCriteria}...`, 'info');
                        this.loadLeaderboard();
                    });
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

            loadLeaderboard() {
                const loadingContainer = document.getElementById('loadingContainer');
                const leaderboardRows = document.getElementById('leaderboardRows');
                
                // Show loading
                loadingContainer.style.display = 'flex';
                leaderboardRows.style.display = 'none';
                
                // Simulate loading delay
                setTimeout(() => {
                    loadingContainer.style.display = 'none';
                    leaderboardRows.style.display = 'block';
                    this.animateRows();
                }, 1500);
            }

            animateRows() {
                const rows = document.querySelectorAll('.leaderboard-row');
                rows.forEach((row, index) => {
                    setTimeout(() => {
                        row.style.transform = 'translateX(-20px)';
                        row.style.opacity = '0';
                        setTimeout(() => {
                            row.style.transform = 'translateX(0)';
                            row.style.opacity = '1';
                        }, 100);
                    }, index * 100);
                });
            }

            startLiveUpdates() {
                // Simulate live updates every 30 seconds
                setInterval(() => {
                    this.simulateLiveUpdate();
                }, 30000);
            }

            simulateLiveUpdate() {
                // Randomly update a participant's rank or score
                const randomIndex = Math.floor(Math.random() * this.participants.length);
                const participant = this.participants[randomIndex];
                
                // Simulate small score change
                const oldScore = participant.score;
                participant.score = Math.max(0, Math.min(10, oldScore + (Math.random() - 0.5) * 0.2));
                
                this.showToast(`Live update: ${participant.name}'s score changed to ${participant.score.toFixed(1)}!`, 'info');
            }

            performSearch(query) {
                console.log('Searching participants for:', query);
                if (query.length > 2) {
                    this.showToast(`Searching for "${query}"...`, 'info');
                }
            }

            // Filter Functions
            filterByEvent() {
                const eventFilter = document.getElementById('eventFilter').value;
                this.currentEvent = eventFilter;
                this.showToast('Filtering by event...', 'info');
                this.loadLeaderboard();
            }

            filterByCategory() {
                const categoryFilter = document.getElementById('categoryFilter').value;
                this.currentCategory = categoryFilter;
                this.showToast('Updating category view...', 'info');
                this.loadLeaderboard();
            }

            filterByPeriod() {
                const periodFilter = document.getElementById('periodFilter').value;
                this.currentPeriod = periodFilter;
                this.showToast('Filtering by time period...', 'info');
                this.loadLeaderboard();
            }

            refreshLeaderboard() {
                const button = event.target;
                const originalContent = button.innerHTML;
                
                button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
                button.disabled = true;
                
                setTimeout(() => {
                    this.loadLeaderboard();
                    this.showToast('Leaderboard refreshed!', 'success');
                    
                    // Reset button
                    button.innerHTML = originalContent;
                    button.disabled = false;
                }, 2000);
            }

            // FIXED: Sorting Functions
            sortBy(criteria) {
                // Update active button
                document.querySelectorAll('.table-btn[data-sort]').forEach(btn => {
                    btn.classList.remove('active');
                });
                
                const activeBtn = document.querySelector(`[data-sort="${criteria}"]`);
                if (activeBtn) {
                    activeBtn.classList.add('active');
                }
                
                this.currentSort = criteria;
                this.showToast(`Sorting by ${criteria}...`, 'info');
                this.loadLeaderboard();
            }

            exportLeaderboard() {
                const button = event.target;
                const originalContent = button.innerHTML;
                
                button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
                button.disabled = true;
                
                setTimeout(() => {
                    // Simulate export
                    const csvContent = this.generateCSV();
                    this.downloadCSV(csvContent, 'leaderboard.csv');
                    this.showToast('Leaderboard exported successfully!', 'success');
                    
                    // Reset button
                    button.innerHTML = originalContent;
                    button.disabled = false;
                }, 2000);
            }

            generateCSV() {
                const headers = ['Rank', 'Name', 'Team', 'Score', 'Projects', 'Wins'];
                const rows = this.participants.map(p => [
                    p.rank, p.name, p.team, p.score, p.projects, p.wins
                ]);
                
                const csvContent = [headers, ...rows]
                    .map(row => row.join(','))
                    .join('\n');
                
                return csvContent;
            }

            downloadCSV(content, filename) {
                const blob = new Blob([content], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = filename;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            }

            // Participant Actions
            viewParticipant(participantId) {
                const participant = this.participants.find(p => p.id === participantId);
                if (!participant) return;
                
                this.openParticipantModal(participant);
            }

            openParticipantModal(participant) {
                const modal = document.getElementById('participantModal');
                const modalTitle = document.getElementById('modalTitle');
                const modalContent = document.getElementById('modalContent');
                
                modalTitle.textContent = `${participant.name} - Rank #${participant.rank}`;
                
                modalContent.innerHTML = `
                    <div style="text-align: center; margin-bottom: 2rem;">
                        <div style="width: 100px; height: 100px; background: var(--gradient-primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 2rem; margin: 0 auto 1rem;">${participant.avatar}</div>
                        <h3 style="margin-bottom: 0.5rem;">${participant.name}</h3>
                        <p style="color: var(--text-secondary); margin-bottom: 1rem;">${participant.team}</p>
                        <div style="display: flex; justify-content: center; gap: 2rem; margin-bottom: 2rem;">
                            <div style="text-align: center;">
                                <div style="font-size: 1.5rem; font-weight: 700; color: var(--text-accent);">#${participant.rank}</div>
                                <div style="font-size: 0.8rem; color: var(--text-muted);">Rank</div>
                            </div>
                            <div style="text-align: center;">
                                <div style="font-size: 1.5rem; font-weight: 700; color: var(--text-accent);">${participant.score}</div>
                                <div style="font-size: 0.8rem; color: var(--text-muted);">Score</div>
                            </div>
                            <div style="text-align: center;">
                                <div style="font-size: 1.5rem; font-weight: 700; color: var(--text-accent);">${participant.projects}</div>
                                <div style="font-size: 0.8rem; color: var(--text-muted);">Projects</div>
                            </div>
                        </div>
                        ${participant.achievements.length > 0 ? `
                            <div style="margin-bottom: 2rem;">
                                <h4 style="margin-bottom: 1rem;">Achievements</h4>
                                <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; justify-content: center;">
                                    ${participant.achievements.map(achievement => `
                                        <span style="background: var(--gradient-success); color: white; padding: 0.3rem 0.8rem; border-radius: 20px; font-size: 0.8rem; font-weight: 600;">${achievement}</span>
                                    `).join('')}
                                </div>
                            </div>
                        ` : ''}
                        <div style="display: flex; gap: 1rem; justify-content: center;">
                            <button class="btn btn-primary" onclick="leaderboardManager.messageParticipant('${participant.id}')">
                                <i class="fas fa-envelope"></i>
                                Send Message
                            </button>
                            <button class="btn btn-secondary" onclick="leaderboardManager.viewProfile('${participant.id}')">
                                <i class="fas fa-user"></i>
                                View Profile
                            </button>
                        </div>
                    </div>
                `;
                
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }

            closeParticipantModal() {
                const modal = document.getElementById('participantModal');
                modal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }

            closeAllModals() {
                this.closeParticipantModal();
            }

            messageParticipant(participantId) {
                const participant = this.participants.find(p => p.id === participantId);
                this.showToast(`Opening chat with ${participant?.name || 'participant'}...`, 'info');
                
                setTimeout(() => {
                    console.log('Message participant:', participantId);
                    // In real implementation, would open chat modal or redirect
                    this.closeParticipantModal();
                }, 1000);
            }

            viewProfile(participantId) {
                const participant = this.participants.find(p => p.id === participantId);
                this.showToast(`Loading ${participant?.name || 'participant'} profile...`, 'info');
                
                setTimeout(() => {
                    console.log('View profile:', participantId);
                    // In real implementation, would redirect to profile page
                    this.closeParticipantModal();
                }, 1000);
            }

            // User Actions
            viewYourStats() {
                this.showToast('Loading your detailed statistics...', 'info');
                
                setTimeout(() => {
                    console.log('View your stats');
                    // In real implementation, would open stats modal
                }, 1000);
            }

            shareRanking() {
                const shareText = `Check out my ranking on NexusHack! I'm currently #23 in the Web3 Innovation Challenge 2025.`;
                
                if (navigator.share) {
                    navigator.share({
                        title: 'My NexusHack Ranking',
                        text: shareText,
                        url: window.location.href
                    });
                } else if (navigator.clipboard) {
                    navigator.clipboard.writeText(shareText + '\n' + window.location.href).then(() => {
                        this.showToast('Ranking shared to clipboard!', 'success');
                    });
                } else {
                    this.showToast('Share functionality not supported', 'error');
                }
            }

            improveRanking() {
                this.showToast('Here are some tips to improve your ranking...', 'info');
                
                setTimeout(() => {
                    console.log('Show ranking improvement tips');
                    // In real implementation, would show tips modal
                }, 1000);
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
        let leaderboardManager;

        function filterByEvent() {
            leaderboardManager.filterByEvent();
        }

        function filterByCategory() {
            leaderboardManager.filterByCategory();
        }

        function filterByPeriod() {
            leaderboardManager.filterByPeriod();
        }

        function refreshLeaderboard() {
            leaderboardManager.refreshLeaderboard();
        }

        function sortBy(criteria) {
            leaderboardManager.sortBy(criteria);
        }

        function exportLeaderboard() {
            leaderboardManager.exportLeaderboard();
        }

        function viewParticipant(participantId) {
            leaderboardManager.viewParticipant(participantId);
        }

        function messageParticipant(participantId) {
            leaderboardManager.messageParticipant(participantId);
        }

        function closeParticipantModal() {
            leaderboardManager.closeParticipantModal();
        }

        function viewYourStats() {
            leaderboardManager.viewYourStats();
        }

        function shareRanking() {
            leaderboardManager.shareRanking();
        }

        function improveRanking() {
            leaderboardManager.improveRanking();
        }

        function logout() {
            if (confirm('Are you sure you want to logout?')) {
                localStorage.removeItem('userSession');
                window.location.href = '../auth/login.html';
            }
        }

        // Initialize the application
        document.addEventListener('DOMContentLoaded', () => {
            leaderboardManager = new LeaderboardManager();
            
            // Animate podium on page load
            setTimeout(() => {
                document.querySelectorAll('.podium-place').forEach((place, index) => {
                    setTimeout(() => {
                        place.style.transform = 'translateY(-8px)';
                        setTimeout(() => {
                            place.style.transform = 'translateY(0)';
                        }, 200);
                    }, index * 200);
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
