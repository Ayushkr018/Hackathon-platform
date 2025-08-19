 // Advanced JavaScript for Profile Management
        class ProfileManager {
            constructor() {
                this.currentTab = 'overview';
                this.userProfile = {
                    name: 'John Doe',
                    title: 'Full Stack Developer & AI Enthusiast',
                    about: 'Passionate full-stack developer with 5+ years of experience building scalable web applications.',
                    location: 'San Francisco, CA',
                    skills: ['JavaScript', 'React', 'Node.js', 'Python', 'AWS', 'MongoDB', 'Docker', 'Machine Learning'],
                    rank: 23,
                    score: 8.7,
                    projects: 4,
                    teams: 2
                };
                
                this.init();
            }

            init() {
                this.initializeTheme();
                this.initializeUser();
                this.setupEventListeners();
                this.setupFormListeners();
                this.loadProfileData();
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
                        `${session.firstName[0]}${session.lastName[0]}` : 
                        firstName.slice(0, 2).toUpperCase();
                    document.getElementById('userAvatar').textContent = initials;
                    document.getElementById('profileAvatar').textContent = initials;
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

            setupFormListeners() {
                // Edit Profile Form
                const editProfileForm = document.getElementById('editProfileForm');
                editProfileForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.handleProfileUpdate(e);
                });

                // Add Skill Form
                const addSkillForm = document.getElementById('addSkillForm');
                addSkillForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.handleAddSkill(e);
                });

                // Profile Settings Form
                const profileSettingsForm = document.getElementById('profileSettingsForm');
                profileSettingsForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.handleSettingsUpdate(e);
                });
            }

            loadProfileData() {
                // Load profile data from storage or API
                const savedProfile = localStorage.getItem('userProfile');
                if (savedProfile) {
                    this.userProfile = { ...this.userProfile, ...JSON.parse(savedProfile) };
                }
                this.updateProfileDisplay();
            }

            updateProfileDisplay() {
                // Update profile header
                document.getElementById('profileName').textContent = this.userProfile.name;
                document.getElementById('profileTitle').textContent = this.userProfile.title;
                document.getElementById('aboutText').textContent = this.userProfile.about;
                
                // Update form fields
                if (document.getElementById('displayName')) {
                    document.getElementById('displayName').value = this.userProfile.name;
                }
                if (document.getElementById('professionalTitle')) {
                    document.getElementById('professionalTitle').value = this.userProfile.title;
                }
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

            performSearch(query) {
                console.log('Searching:', query);
                if (query.length > 2) {
                    this.showToast(`Searching for "${query}"...`, 'info');
                }
            }

            // Tab Management
            switchTab(tabName) {
                this.currentTab = tabName;
                
                // Update tab buttons
                document.querySelectorAll('.tab-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
                
                // Show/hide tab content
                document.querySelectorAll('.tab-content').forEach(content => {
                    content.style.display = 'none';
                });
                document.getElementById(`${tabName}Tab`).style.display = 'block';
            }

            // Profile Actions
            editProfile() {
                // Pre-populate form with current data
                document.getElementById('editFullName').value = this.userProfile.name;
                document.getElementById('editTitle').value = this.userProfile.title;
                document.getElementById('editAbout').value = this.userProfile.about;
                document.getElementById('editLocation').value = this.userProfile.location || '';
                
                this.openEditProfileModal();
            }

            shareProfile() {
                const shareUrl = window.location.href;
                const shareText = `Check out my NexusHack profile! I'm a ${this.userProfile.title} ranked #${this.userProfile.rank}.`;
                
                if (navigator.share) {
                    navigator.share({
                        title: `${this.userProfile.name} - NexusHack Profile`,
                        text: shareText,
                        url: shareUrl
                    });
                } else if (navigator.clipboard) {
                    navigator.clipboard.writeText(shareText + '\n' + shareUrl).then(() => {
                        this.showToast('Profile link copied to clipboard!', 'success');
                    });
                } else {
                    this.showToast('Share functionality not supported', 'error');
                }
            }

            downloadResume() {
                const button = event.target;
                const originalContent = button.innerHTML;
                
                button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
                button.disabled = true;
                
                setTimeout(() => {
                    // Simulate resume generation
                    this.showToast('Resume generated and downloaded!', 'success');
                    
                    // Reset button
                    button.innerHTML = originalContent;
                    button.disabled = false;
                    
                    // In real implementation, would generate and download PDF
                    console.log('Download resume for:', this.userProfile.name);
                }, 2500);
            }

            uploadAvatar() {
                // Create file input dynamically
                const fileInput = document.createElement('input');
                fileInput.type = 'file';
                fileInput.accept = 'image/*';
                fileInput.style.display = 'none';
                
                fileInput.addEventListener('change', (e) => {
                    const file = e.target.files[0];
                    if (file) {
                        this.handleAvatarUpload(file);
                    }
                });
                
                document.body.appendChild(fileInput);
                fileInput.click();
                document.body.removeChild(fileInput);
            }

            handleAvatarUpload(file) {
                // Validate file
                if (file.size > 5 * 1024 * 1024) { // 5MB limit
                    this.showToast('File size must be less than 5MB', 'error');
                    return;
                }
                
                if (!file.type.startsWith('image/')) {
                    this.showToast('Please select a valid image file', 'error');
                    return;
                }
                
                // Show uploading state
                const avatarButton = document.querySelector('.avatar-upload');
                const originalContent = avatarButton.innerHTML;
                avatarButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
                avatarButton.disabled = true;
                
                // Simulate upload
                setTimeout(() => {
                    // Create file URL for preview
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        // In real implementation, would upload to server
                        this.showToast('Avatar updated successfully!', 'success');
                        console.log('Avatar uploaded:', file.name);
                    };
                    reader.readAsDataURL(file);
                    
                    // Reset button
                    avatarButton.innerHTML = originalContent;
                    avatarButton.disabled = false;
                }, 2000);
            }

            // Modal Management
            openEditProfileModal() {
                const modal = document.getElementById('editProfileModal');
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }

            closeEditProfileModal() {
                const modal = document.getElementById('editProfileModal');
                modal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }

            openAddSkillModal() {
                const modal = document.getElementById('addSkillModal');
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
                
                // Clear form
                document.getElementById('addSkillForm').reset();
            }

            closeAddSkillModal() {
                const modal = document.getElementById('addSkillModal');
                modal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }

            closeAllModals() {
                this.closeEditProfileModal();
                this.closeAddSkillModal();
            }

            // Form Handlers
            handleProfileUpdate(event) {
                const formData = new FormData(event.target);
                const updateData = {
                    name: formData.get('fullName') || document.getElementById('editFullName').value,
                    title: formData.get('title') || document.getElementById('editTitle').value,
                    about: formData.get('about') || document.getElementById('editAbout').value,
                    location: formData.get('location') || document.getElementById('editLocation').value
                };
                
                const submitBtn = event.target.querySelector('.btn-save');
                const originalText = submitBtn.innerHTML;
                
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
                submitBtn.disabled = true;
                
                setTimeout(() => {
                    // Update profile data
                    this.userProfile = { ...this.userProfile, ...updateData };
                    localStorage.setItem('userProfile', JSON.stringify(this.userProfile));
                    
                    // Update display
                    this.updateProfileDisplay();
                    
                    this.showToast('Profile updated successfully!', 'success');
                    this.closeEditProfileModal();
                    
                    // Reset button
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }, 2000);
            }

            handleAddSkill(event) {
                const formData = new FormData(event.target);
                const skillName = formData.get('skillName') || document.getElementById('newSkillName').value;
                const skillLevel = formData.get('skillLevel') || document.getElementById('skillLevel').value;
                
                if (!skillName.trim()) {
                    this.showToast('Please enter a skill name', 'error');
                    return;
                }
                
                // Check if skill already exists
                if (this.userProfile.skills.includes(skillName)) {
                    this.showToast('Skill already exists!', 'error');
                    return;
                }
                
                const submitBtn = event.target.querySelector('.btn-save');
                const originalText = submitBtn.innerHTML;
                
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Adding...';
                submitBtn.disabled = true;
                
                setTimeout(() => {
                    // Add skill to profile
                    this.userProfile.skills.push(skillName);
                    localStorage.setItem('userProfile', JSON.stringify(this.userProfile));
                    
                    // Add skill to display
                    this.addSkillToDisplay(skillName);
                    
                    this.showToast(`${skillName} added successfully!`, 'success');
                    this.closeAddSkillModal();
                    
                    // Reset button
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }, 1500);
            }

            handleSettingsUpdate(event) {
                const formData = new FormData(event.target);
                const settingsData = Object.fromEntries(formData);
                
                const submitBtn = event.target.querySelector('.btn-primary');
                const originalText = submitBtn.innerHTML;
                
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
                submitBtn.disabled = true;
                
                setTimeout(() => {
                    // Update settings
                    localStorage.setItem('profileSettings', JSON.stringify(settingsData));
                    
                    this.showToast('Settings saved successfully!', 'success');
                    
                    // Reset button
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    
                    console.log('Settings updated:', settingsData);
                }, 2000);
            }

            // Skills Management
            addSkillToDisplay(skillName) {
                const skillsList = document.getElementById('skillsList');
                const skillTag = document.createElement('div');
                skillTag.className = 'skill-tag';
                skillTag.innerHTML = `
                    ${skillName}
                    <button class="remove-skill" onclick="profileManager.removeSkill(this)">
                        <i class="fas fa-times"></i>
                    </button>
                `;
                skillsList.appendChild(skillTag);
            }

            removeSkill(button) {
                const skillTag = button.parentElement;
                const skillName = skillTag.textContent.trim();
                
                // Remove from profile data
                const index = this.userProfile.skills.indexOf(skillName);
                if (index > -1) {
                    this.userProfile.skills.splice(index, 1);
                    localStorage.setItem('userProfile', JSON.stringify(this.userProfile));
                }
                
                // Remove from display with animation
                skillTag.style.transform = 'scale(0)';
                skillTag.style.opacity = '0';
                
                setTimeout(() => {
                    skillTag.remove();
                }, 300);
                
                this.showToast(`${skillName} removed`, 'info');
            }

            // Section Actions
            editAbout() {
                this.editProfile();
            }

            editSkills() {
                this.openAddSkillModal();
            }

            addExperience() {
                this.showToast('Experience editor opening...', 'info');
                setTimeout(() => {
                    console.log('Add experience functionality');
                    // In real implementation, would open experience modal
                }, 1000);
            }

            addProject() {
                this.showToast('Project editor opening...', 'info');
                setTimeout(() => {
                    console.log('Add project functionality');
                    // In real implementation, would open project modal
                }, 1000);
            }

            addAchievement() {
                this.showToast('Achievement editor opening...', 'info');
                setTimeout(() => {
                    console.log('Add achievement functionality');
                    // In real implementation, would open achievement modal
                }, 1000);
            }

            // Utility Functions
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
        let profileManager;

        function switchTab(tabName) {
            profileManager.switchTab(tabName);
        }

        function editProfile() {
            profileManager.editProfile();
        }

        function shareProfile() {
            profileManager.shareProfile();
        }

        function downloadResume() {
            profileManager.downloadResume();
        }

        function uploadAvatar() {
            profileManager.uploadAvatar();
        }

        function closeEditProfileModal() {
            profileManager.closeEditProfileModal();
        }

        function closeAddSkillModal() {
            profileManager.closeAddSkillModal();
        }

        function removeSkill(button) {
            profileManager.removeSkill(button);
        }

        function editAbout() {
            profileManager.editAbout();
        }

        function editSkills() {
            profileManager.editSkills();
        }

        function addExperience() {
            profileManager.addExperience();
        }

        function addProject() {
            profileManager.addProject();
        }

        function addAchievement() {
            profileManager.addAchievement();
        }

        function logout() {
            if (confirm('Are you sure you want to logout?')) {
                localStorage.removeItem('userSession');
                window.location.href = '../auth/login.html';
            }
        }

        // Initialize the application
        document.addEventListener('DOMContentLoaded', () => {
            profileManager = new ProfileManager();
            
            // Animate profile sections on page load
            setTimeout(() => {
                document.querySelectorAll('.profile-section').forEach((section, index) => {
                    setTimeout(() => {
                        section.style.transform = 'translateY(-4px)';
                        setTimeout(() => {
                            section.style.transform = 'translateY(0)';
                        }, 200);
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
