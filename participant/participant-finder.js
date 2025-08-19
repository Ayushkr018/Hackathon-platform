// Advanced JavaScript for better UX and interactions
        class ParticipantFinder {
            constructor() {
                this.selectedSkills = [];
                this.compatibilityThreshold = 80;
                this.matchingTimeout = null;
                this.isProcessing = false;
                this.participants = [];
                this.filteredParticipants = [];
                
                this.init();
            }

            init() {
                this.initializeTheme();
                this.initializeUser();
                this.setupEventListeners();
                this.loadParticipants();
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
                        `${session.firstName}${session.lastName}` : 
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

            loadParticipants() {
                // Simulate loading participants from API
                this.participants = [
                    {
                        id: 'sarah-miller',
                        name: 'Sarah Miller',
                        role: 'Senior Full Stack Developer',
                        location: 'San Francisco, CA',
                        avatar: 'SM',
                        skills: ['React', 'Node.js', 'Python', 'PostgreSQL', 'Docker', 'AWS'],
                        hackathons: 18,
                        rating: 4.9,
                        winRate: 92,
                        compatibility: 95,
                        experience: 'advanced'
                    },
                    {
                        id: 'alex-kim',
                        name: 'Alex Kim',
                        role: 'Senior Mobile Developer',
                        location: 'Seattle, WA',
                        avatar: 'AK',
                        skills: ['Flutter', 'React Native', 'Swift', 'Kotlin', 'Firebase', 'GraphQL'],
                        hackathons: 14,
                        rating: 4.8,
                        winRate: 86,
                        compatibility: 89,
                        experience: 'advanced'
                    },
                    {
                        id: 'maria-johnson',
                        name: 'Maria Johnson',
                        role: 'Senior UX Designer',
                        location: 'Austin, TX',
                        avatar: 'MJ',
                        skills: ['Figma', 'Adobe XD', 'Prototyping', 'User Research', 'HTML/CSS', 'JavaScript'],
                        hackathons: 11,
                        rating: 4.9,
                        winRate: 73,
                        compatibility: 84,
                        experience: 'intermediate'
                    },
                    {
                        id: 'david-singh',
                        name: 'David Singh',
                        role: 'ML Engineer',
                        location: 'Boston, MA',
                        avatar: 'DS',
                        skills: ['Python', 'TensorFlow', 'PyTorch', 'Pandas', 'Jupyter', 'SQL'],
                        hackathons: 9,
                        rating: 4.6,
                        winRate: 67,
                        compatibility: 76,
                        experience: 'intermediate'
                    }
                ];

                this.filteredParticipants = [...this.participants];
            }

            startAIMatching() {
                if (this.isProcessing) return;
                
                this.isProcessing = true;
                this.showAIProcessing();
                
                // Simulate AI processing
                setTimeout(() => {
                    this.hideAIProcessing();
                    this.refreshMatches();
                    this.showToast('AI matching complete! Found perfect participants based on your preferences.', 'success');
                    this.isProcessing = false;
                }, 3500);
            }

            showAIProcessing() {
                document.getElementById('aiProcessing').style.display = 'flex';
                this.showLoading();
            }

            hideAIProcessing() {
                document.getElementById('aiProcessing').style.display = 'none';
                this.hideLoading();
            }

            showMatchingTips() {
                this.showToast('💡 Tip: Complete your profile and add more skills to get better matches! Also, participate in more hackathons to improve your compatibility score.', 'info');
            }

            toggleSkill(element) {
                const skill = element.dataset.skill;
                
                if (element.classList.contains('active')) {
                    element.classList.remove('active');
                    this.selectedSkills = this.selectedSkills.filter(s => s !== skill);
                } else {
                    element.classList.add('active');
                    this.selectedSkills.push(skill);
                }
                
                this.updateMatching();
            }

            updateCompatibility(value) {
                this.compatibilityThreshold = parseInt(value);
                document.getElementById('compatibilityValue').textContent = value + '%';
                this.updateMatching();
            }

            updateMatching() {
                clearTimeout(this.matchingTimeout);
                this.matchingTimeout = setTimeout(() => {
                    this.performMatching();
                }, 300);
            }

            performMatching() {
                console.log('Updating matches with preferences:', {
                    skills: this.selectedSkills,
                    compatibility: this.compatibilityThreshold,
                    event: document.getElementById('eventPreference').value,
                    role: document.getElementById('rolePreference').value,
                    experience: document.getElementById('experiencePreference').value
                });
                
                this.showLoading();
                
                setTimeout(() => {
                    this.hideLoading();
                    this.filterParticipants();
                }, 600);
            }

            filterParticipants() {
                let filtered = [...this.participants];
                
                // Filter by compatibility threshold
                filtered = filtered.filter(p => p.compatibility >= this.compatibilityThreshold);
                
                // Filter by selected skills
                if (this.selectedSkills.length > 0) {
                    filtered = filtered.filter(p => 
                        this.selectedSkills.some(skill => 
                            p.skills.some(pSkill => 
                                pSkill.toLowerCase().includes(skill.toLowerCase())
                            )
                        )
                    );
                }
                
                // Filter by experience
                const experienceFilter = document.getElementById('experiencePreference').value;
                if (experienceFilter) {
                    filtered = filtered.filter(p => p.experience === experienceFilter);
                }
                
                this.filteredParticipants = filtered;
                this.updateParticipantsDisplay();
            }

            updateParticipantsDisplay() {
                const participantsGrid = document.getElementById('participantsGrid');
                const emptyState = document.getElementById('emptyState');
                
                if (this.filteredParticipants.length === 0) {
                    participantsGrid.style.display = 'none';
                    emptyState.style.display = 'block';
                } else {
                    participantsGrid.style.display = 'grid';
                    emptyState.style.display = 'none';
                    
                    // Hide cards that don't match the filter
                    const cards = participantsGrid.children;
                    const displayedIds = this.filteredParticipants.map(p => p.id);
                    
                    for (let card of cards) {
                        const participantId = this.getParticipantIdFromCard(card);
                        if (displayedIds.includes(participantId)) {
                            card.style.display = 'block';
                        } else {
                            card.style.display = 'none';
                        }
                    }
                }
            }

            getParticipantIdFromCard(card) {
                // Extract participant ID from card (would be data attribute in real implementation)
                const name = card.querySelector('.participant-name')?.textContent;
                return this.participants.find(p => p.name === name)?.id || '';
            }

            refreshMatches() {
                this.showLoading();
                
                setTimeout(() => {
                    this.hideLoading();
                    
                    // Randomly update compatibility scores
                    document.querySelectorAll('.compatibility-badge').forEach(badge => {
                        const currentScore = parseInt(badge.textContent);
                        const newScore = Math.max(70, Math.min(98, currentScore + Math.floor(Math.random() * 8) - 4));
                        badge.textContent = newScore + '% Match';
                        
                        // Update badge color
                        badge.className = 'compatibility-badge';
                        if (newScore >= 90) {
                            badge.classList.add('compatibility-excellent');
                        } else if (newScore >= 80) {
                            badge.classList.add('compatibility-good');
                        } else {
                            badge.classList.add('compatibility-fair');
                        }
                    });
                    
                    this.showToast('Matches refreshed with the latest data and preferences!', 'success');
                }, 800);
            }

            resetPreferences() {
                // Reset all form values
                document.getElementById('eventPreference').value = '';
                document.getElementById('rolePreference').value = '';
                document.getElementById('experiencePreference').value = '';
                
                // Reset skill tags
                document.querySelectorAll('.skill-tag').forEach(tag => {
                    tag.classList.remove('active');
                });
                this.selectedSkills = [];
                
                // Reset compatibility slider
                document.getElementById('compatibilitySlider').value = 80;
                document.getElementById('compatibilityValue').textContent = '80%';
                this.compatibilityThreshold = 80;
                
                // Reset display
                this.filteredParticipants = [...this.participants];
                this.updateParticipantsDisplay();
                
                this.showToast('Preferences reset to default values!', 'info');
            }

            performSearch(query) {
                if (query.length < 2) {
                    this.filteredParticipants = [...this.participants];
                    this.updateParticipantsDisplay();
                    return;
                }
                
                this.showLoading();
                
                setTimeout(() => {
                    this.hideLoading();
                    
                    // Filter by name, role, or skills
                    this.filteredParticipants = this.participants.filter(p => 
                        p.name.toLowerCase().includes(query.toLowerCase()) ||
                        p.role.toLowerCase().includes(query.toLowerCase()) ||
                        p.skills.some(skill => skill.toLowerCase().includes(query.toLowerCase()))
                    );
                    
                    this.updateParticipantsDisplay();
                }, 400);
            }

            inviteParticipant(participantId) {
                const button = event.target;
                const originalText = button.innerHTML;
                
                button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Inviting...';
                button.disabled = true;
                
                setTimeout(() => {
                    button.innerHTML = '<i class="fas fa-check"></i> Invited!';
                    button.style.background = 'var(--gradient-success)';
                    
                    const participant = this.participants.find(p => p.id === participantId);
                    this.showToast(`Invitation sent to ${participant?.name || 'participant'} successfully!`, 'success');
                    
                    setTimeout(() => {
                        button.innerHTML = originalText;
                        button.disabled = false;
                        button.style.background = 'var(--gradient-primary)';
                    }, 3000);
                }, 1200);
            }

            chatWithParticipant(participantId) {
                const participant = this.participants.find(p => p.id === participantId);
                this.showToast(`Opening chat with ${participant?.name || 'participant'}...`, 'info');
                
                setTimeout(() => {
                    window.location.href = `../shared/chat.html?user=${participantId}`;
                }, 1000);
            }

            viewProfile(participantId) {
                const participant = this.participants.find(p => p.id === participantId);
                this.showToast(`Loading ${participant?.name || 'participant'}'s profile...`, 'info');
                
                setTimeout(() => {
                    console.log('Viewing profile for:', participantId);
                    // In real implementation, would open profile modal or redirect
                }, 500);
            }

            showLoading() {
                document.getElementById('participantsLoading').style.display = 'grid';
                document.getElementById('participantsGrid').style.display = 'none';
                document.getElementById('emptyState').style.display = 'none';
            }

            hideLoading() {
                document.getElementById('participantsLoading').style.display = 'none';
                this.updateParticipantsDisplay();
            }

            showToast(message, type = 'success') {
                // Remove any existing toasts
                const existingToast = document.querySelector('.toast');
                if (existingToast) {
                    existingToast.remove();
                }
                
                const toast = document.createElement('div');
                toast.className = `toast ${type}`;
                toast.innerHTML = `
                    <i class="fas ${this.getToastIcon(type)}"></i>
                    <span>${message}</span>
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

        // Global functions for onclick handlers
        let participantFinder;

        function startAIMatching() {
            participantFinder.startAIMatching();
        }

        function showMatchingTips() {
            participantFinder.showMatchingTips();
        }

        function toggleSkill(element) {
            participantFinder.toggleSkill(element);
        }

        function updateCompatibility(value) {
            participantFinder.updateCompatibility(value);
        }

        function updateMatching() {
            participantFinder.updateMatching();
        }

        function refreshMatches() {
            participantFinder.refreshMatches();
        }

        function resetPreferences() {
            participantFinder.resetPreferences();
        }

        function inviteParticipant(participantId) {
            participantFinder.inviteParticipant(participantId);
        }

        function chatWithParticipant(participantId) {
            participantFinder.chatWithParticipant(participantId);
        }

        function viewProfile(participantId) {
            participantFinder.viewProfile(participantId);
        }

        function logout() {
            if (confirm('Are you sure you want to logout?')) {
                localStorage.removeItem('userSession');
                window.location.href = '../auth/login.html';
            }
        }

        // Initialize the application
        document.addEventListener('DOMContentLoaded', () => {
            participantFinder = new ParticipantFinder();
            
            // Animate stats on page load
            setTimeout(() => {
                document.querySelectorAll('.ai-stat').forEach((stat, index) => {
                    setTimeout(() => {
                        stat.style.transform = 'scale(1.05)';
                        setTimeout(() => {
                            stat.style.transform = 'scale(1)';
                        }, 200);
                    }, index * 200);
                });
            }, 1000);
        });
