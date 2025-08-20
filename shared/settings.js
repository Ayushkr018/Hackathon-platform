 class SettingsManager {
            constructor() {
                this.currentSection = 'account';
                this.settings = {
                    account: {},
                    security: {},
                    privacy: {},
                    notifications: {},
                    appearance: {},
                    data: {},
                    integrations: {},
                    advanced: {}
                };
                
                this.init();
            }

            init() {
                this.initializeTheme();
                this.setupEventListeners();
                this.loadSettings();
                this.setupFormListeners();
            }

            initializeTheme() {
                const savedTheme = localStorage.getItem('theme') || 'dark';
                document.documentElement.setAttribute('data-theme', savedTheme);
                
                const themeToggle = document.getElementById('themeToggle');
                const themeIcon = themeToggle.querySelector('i');
                themeIcon.className = savedTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
                
                const themeSelect = document.getElementById('themeSelect');
                if (themeSelect) {
                    themeSelect.value = savedTheme;
                }
            }

            setupEventListeners() {
                // Theme toggle
                document.getElementById('themeToggle').addEventListener('click', () => {
                    this.toggleTheme();
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
                // Password Form
                const passwordForm = document.getElementById('passwordForm');
                passwordForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.handlePasswordChange(e);
                });
            }

            loadSettings() {
                // Load settings from localStorage
                const savedSettings = localStorage.getItem('userSettings');
                if (savedSettings) {
                    this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
                }
                
                // Populate form fields with saved settings
                this.populateFormFields();
            }

            populateFormFields() {
                // Account settings
                const fullName = document.getElementById('fullName');
                if (fullName && this.settings.account.fullName) {
                    fullName.value = this.settings.account.fullName;
                }
                
                // Add more field population as needed
            }

            toggleTheme() {
                const html = document.documentElement;
                const currentTheme = html.getAttribute('data-theme');
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                
                html.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
                
                const themeIcon = document.getElementById('themeToggle').querySelector('i');
                themeIcon.className = newTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
                
                const themeSelect = document.getElementById('themeSelect');
                if (themeSelect) {
                    themeSelect.value = newTheme;
                }
            }

            // Section Management
            switchSection(sectionName) {
                this.currentSection = sectionName;
                
                // Update navigation
                document.querySelectorAll('.settings-nav-item').forEach(item => {
                    item.classList.remove('active');
                });
                document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');
                
                // Show/hide sections
                document.querySelectorAll('.settings-section').forEach(section => {
                    section.classList.remove('active');
                });
                document.getElementById(`${sectionName}Section`).classList.add('active');
            }

            // Toggle Switch Handler
            toggleSwitch(toggleElement) {
                toggleElement.classList.toggle('active');
                
                // Save toggle state
                const isActive = toggleElement.classList.contains('active');
                this.showToast(`Setting ${isActive ? 'enabled' : 'disabled'}`, 'info');
            }

            // Theme Change Handler
            changeTheme(theme) {
                if (theme === 'auto') {
                    // Use system theme
                    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                    document.documentElement.setAttribute('data-theme', systemTheme);
                } else {
                    document.documentElement.setAttribute('data-theme', theme);
                }
                
                localStorage.setItem('theme', theme);
                
                const themeIcon = document.getElementById('themeToggle').querySelector('i');
                const currentTheme = document.documentElement.getAttribute('data-theme');
                themeIcon.className = currentTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
                
                this.showToast(`Theme changed to ${theme}`, 'success');
            }

            // Account Settings
            saveAccountSettings() {
                const accountData = {
                    fullName: document.getElementById('fullName').value,
                    email: document.getElementById('email').value,
                    username: document.getElementById('username').value,
                    bio: document.getElementById('bio').value,
                    location: document.getElementById('location').value,
                    timezone: document.getElementById('timezone').value
                };
                
                const button = event.target;
                const originalText = button.innerHTML;
                
                button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
                button.disabled = true;
                
                setTimeout(() => {
                    this.settings.account = { ...this.settings.account, ...accountData };
                    localStorage.setItem('userSettings', JSON.stringify(this.settings));
                    
                    this.showToast('Account settings saved successfully!', 'success');
                    
                    // Reset button
                    button.innerHTML = originalText;
                    button.disabled = false;
                }, 2000);
            }

            // Security Functions
            openPasswordModal() {
                const modal = document.getElementById('passwordModal');
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }

            closePasswordModal() {
                const modal = document.getElementById('passwordModal');
                modal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }

            handlePasswordChange(event) {
                const formData = new FormData(event.target);
                const submitBtn = event.target.querySelector('.btn-save');
                const originalText = submitBtn.innerHTML;
                
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Changing...';
                submitBtn.disabled = true;
                
                setTimeout(() => {
                    this.showToast('Password changed successfully!', 'success');
                    this.closePasswordModal();
                    
                    // Reset form and button
                    event.target.reset();
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }, 3000);
            }

            manage2FA() {
                this.showToast('Opening 2FA management...', 'info');
                setTimeout(() => {
                    console.log('Manage 2FA functionality');
                    // In real implementation, would open 2FA modal
                }, 1000);
            }

            // Integration Functions
            connectService(service) {
                const button = event.target;
                const originalText = button.innerHTML;
                
                button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connecting...';
                button.disabled = true;
                
                setTimeout(() => {
                    this.showToast(`${service.charAt(0).toUpperCase() + service.slice(1)} connected successfully!`, 'success');
                    
                    // Update UI to show connected state
                    const card = button.closest('.settings-card');
                    const subtitle = card.querySelector('.card-subtitle');
                    subtitle.textContent = 'Connected';
                    
                    button.innerHTML = '<i class="fas fa-unlink"></i> Disconnect';
                    button.className = 'btn btn-danger';
                    button.onclick = () => this.disconnectService(service);
                    
                    button.disabled = false;
                }, 2500);
            }

            disconnectService(service) {
                if (confirm(`Are you sure you want to disconnect ${service}?`)) {
                    const button = event.target;
                    const originalText = button.innerHTML;
                    
                    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Disconnecting...';
                    button.disabled = true;
                    
                    setTimeout(() => {
                        this.showToast(`${service.charAt(0).toUpperCase() + service.slice(1)} disconnected`, 'info');
                        
                        // Update UI to show disconnected state
                        const card = button.closest('.settings-card');
                        const subtitle = card.querySelector('.card-subtitle');
                        subtitle.textContent = 'Not Connected';
                        
                        button.innerHTML = '<i class="fas fa-link"></i> Connect';
                        button.className = 'btn btn-primary';
                        button.onclick = () => this.connectService(service);
                        
                        button.disabled = false;
                    }, 2000);
                }
            }

            manageDiscord() {
                this.showToast('Opening Discord management...', 'info');
                setTimeout(() => {
                    console.log('Manage Discord functionality');
                }, 1000);
            }

            // Data Management Functions
            manageFiles() {
                this.showToast('Opening file manager...', 'info');
                setTimeout(() => {
                    console.log('File management functionality');
                }, 1000);
            }

            manageMedia() {
                this.showToast('Opening media manager...', 'info');
                setTimeout(() => {
                    console.log('Media management functionality');
                }, 1000);
            }

            exportData() {
                const button = event.target;
                const originalText = button.innerHTML;
                
                button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Preparing Export...';
                button.disabled = true;
                
                setTimeout(() => {
                    this.showToast('Data export completed! Download link sent to your email.', 'success');
                    
                    // Reset button
                    button.innerHTML = originalText;
                    button.disabled = false;
                    
                    // In real implementation, would trigger actual data export
                    console.log('Export user data');
                }, 4000);
            }

            // Advanced Functions
            generateAPIKey() {
                const button = event.target;
                const originalText = button.innerHTML;
                
                button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
                button.disabled = true;
                
                setTimeout(() => {
                    const apiKey = 'nh_' + Math.random().toString(36).substr(2, 30);
                    const keyDisplay = document.querySelector('[style*="Courier New"]');
                    keyDisplay.textContent = apiKey + '...';
                    
                    this.showToast('New API key generated!', 'success');
                    
                    // Reset button
                    button.innerHTML = originalText;
                    button.disabled = false;
                }, 2000);
            }

            // Danger Zone Functions
            resetAllSettings() {
                if (confirm('Are you sure you want to reset ALL settings to default? This cannot be undone.')) {
                    const button = event.target;
                    const originalText = button.innerHTML;
                    
                    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Resetting...';
                    button.disabled = true;
                    
                    setTimeout(() => {
                        localStorage.removeItem('userSettings');
                        this.settings = {
                            account: {},
                            security: {},
                            privacy: {},
                            notifications: {},
                            appearance: {},
                            data: {},
                            integrations: {},
                            advanced: {}
                        };
                        
                        this.showToast('All settings have been reset to default', 'success');
                        
                        // Reset button
                        button.innerHTML = originalText;
                        button.disabled = false;
                        
                        // Reload page to reflect changes
                        setTimeout(() => {
                            window.location.reload();
                        }, 2000);
                    }, 3000);
                }
            }

            clearAllData() {
                if (confirm('Are you sure you want to clear ALL your data? This will remove all projects, files, and personal information. This cannot be undone.')) {
                    const button = event.target;
                    const originalText = button.innerHTML;
                    
                    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Clearing...';
                    button.disabled = true;
                    
                    setTimeout(() => {
                        this.showToast('All data has been cleared from your account', 'success');
                        
                        // Reset button
                        button.innerHTML = originalText;
                        button.disabled = false;
                        
                        console.log('Clear all user data');
                    }, 4000);
                }
            }

            deactivateAccount() {
                if (confirm('Are you sure you want to deactivate your account? You can reactivate it later by logging in.')) {
                    const button = event.target;
                    const originalText = button.innerHTML;
                    
                    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Deactivating...';
                    button.disabled = true;
                    
                    setTimeout(() => {
                        this.showToast('Account deactivated. Redirecting to login...', 'info');
                        
                        setTimeout(() => {
                            window.location.href = '../auth/login.html';
                        }, 2000);
                    }, 3000);
                }
            }

            deleteAccount() {
                const confirmation = prompt('This will permanently delete your account and all associated data. This action cannot be undone.\n\nType "DELETE ACCOUNT" to confirm:');
                
                if (confirmation === 'DELETE ACCOUNT') {
                    const button = event.target;
                    const originalText = button.innerHTML;
                    
                    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Deleting...';
                    button.disabled = true;
                    
                    setTimeout(() => {
                        this.showToast('Account deletion initiated. You will receive a confirmation email.', 'danger');
                        
                        setTimeout(() => {
                            window.location.href = '../index.html';
                        }, 3000);
                    }, 4000);
                } else if (confirmation !== null) {
                    this.showToast('Account deletion cancelled - confirmation text did not match', 'info');
                }
            }

            // Utility Functions
            saveAllSettings() {
                const button = event.target;
                const originalText = button.innerHTML;
                
                button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
                button.disabled = true;
                
                // Collect all form data
                const allSettings = this.collectAllSettings();
                
                setTimeout(() => {
                    localStorage.setItem('userSettings', JSON.stringify(allSettings));
                    this.showToast('All settings saved successfully!', 'success');
                    
                    // Reset button
                    button.innerHTML = originalText;
                    button.disabled = false;
                }, 3000);
            }

            collectAllSettings() {
                // Collect data from all forms and toggles
                const settings = { ...this.settings };
                
                // Account settings
                const fullName = document.getElementById('fullName');
                if (fullName) settings.account.fullName = fullName.value;
                
                // Add more setting collection logic here
                
                return settings;
            }

            closeAllModals() {
                this.closePasswordModal();
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
                    max-width: 400px;
                    box-shadow: var(--shadow-lg);
                    background: var(--gradient-${type});
                `;
                toast.innerHTML = `
                    <i class="fas ${this.getToastIcon(type)}"></i>
                    <span style="margin-left: 0.5rem;">${message}</span>
                `;
                
                document.body.appendChild(toast);
                
                // Auto remove after 5 seconds
                setTimeout(() => {
                    if (toast.parentNode) {
                        toast.remove();
                    }
                }, 5000);
            }

            getToastIcon(type) {
                switch (type) {
                    case 'success': return 'fa-check-circle';
                    case 'error': return 'fa-exclamation-circle';
                    case 'info': return 'fa-info-circle';
                    case 'danger': return 'fa-exclamation-triangle';
                    default: return 'fa-check-circle';
                }
            }
        }

        // Global instance and functions for onclick handlers
        let settingsManager;

        function switchSection(sectionName) {
            settingsManager.switchSection(sectionName);
        }

        function toggleSwitch(element) {
            settingsManager.toggleSwitch(element);
        }

        function changeTheme(theme) {
            settingsManager.changeTheme(theme);
        }

        function saveAccountSettings() {
            settingsManager.saveAccountSettings();
        }

        function openPasswordModal() {
            settingsManager.openPasswordModal();
        }

        function closePasswordModal() {
            settingsManager.closePasswordModal();
        }

        function manage2FA() {
            settingsManager.manage2FA();
        }

        function connectService(service) {
            settingsManager.connectService(service);
        }

        function disconnectService(service) {
            settingsManager.disconnectService(service);
        }

        function manageDiscord() {
            settingsManager.manageDiscord();
        }

        function manageFiles() {
            settingsManager.manageFiles();
        }

        function manageMedia() {
            settingsManager.manageMedia();
        }

        function exportData() {
            settingsManager.exportData();
        }

        function generateAPIKey() {
            settingsManager.generateAPIKey();
        }

        function resetAllSettings() {
            settingsManager.resetAllSettings();
        }

        function clearAllData() {
            settingsManager.clearAllData();
        }

        function deactivateAccount() {
            settingsManager.deactivateAccount();
        }

        function deleteAccount() {
            settingsManager.deleteAccount();
        }

        function saveAllSettings() {
            settingsManager.saveAllSettings();
        }

        // Initialize the application
        document.addEventListener('DOMContentLoaded', () => {
            settingsManager = new SettingsManager();
            
            // Animate settings cards on page load
            setTimeout(() => {
                document.querySelectorAll('.settings-card').forEach((card, index) => {
                    setTimeout(() => {
                        card.style.transform = 'translateY(-4px)';
                        setTimeout(() => {
                            card.style.transform = 'translateY(0)';
                        }, 200);
                    }, index * 100);
                });
            }, 1000);
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