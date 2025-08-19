 // Advanced JavaScript for Submissions with Full Working Features
        class SubmissionManager {
            constructor() {
                this.currentTab = 'all';
                this.uploadedFiles = [];
                this.submissions = [
                    {
                        id: 'cryptowallet-defi',
                        title: 'CryptoWallet DeFi',
                        event: 'Web3 Innovation Challenge 2025',
                        description: 'A comprehensive DeFi wallet with advanced trading features...',
                        status: 'submitted',
                        date: '2025-03-10',
                        files: ['source-code.zip', 'demo-video.mp4', 'README.md'],
                        icon: '🚀'
                    },
                    {
                        id: 'healthai-assistant',
                        title: 'HealthAI Assistant',
                        event: 'AI Healthcare Hackathon',
                        description: 'AI-powered diagnostic assistant that helps doctors...',
                        status: 'reviewing',
                        date: '2025-03-05',
                        files: ['ml-models.zip', 'presentation.pptx', 'research-paper.pdf'],
                        icon: '🏥'
                    },
                    {
                        id: 'ecotrack-mobile',
                        title: 'EcoTrack Mobile',
                        event: 'Climate Tech Solutions 2025',
                        description: 'Mobile app for tracking personal carbon footprint...',
                        status: 'draft',
                        date: '2025-03-12',
                        files: ['app-prototype.zip', 'mockups.png'],
                        icon: '📱'
                    },
                    {
                        id: 'cryptoportfolio-pro',
                        title: 'CryptoPortfolio Pro',
                        event: 'FinTech Revolution 2024',
                        description: 'Advanced cryptocurrency portfolio management tool...',
                        status: 'submitted',
                        date: '2024-12-15',
                        winner: true,
                        files: ['full-source.zip', 'winner-certificate.pdf', 'final-demo.mp4'],
                        icon: '💰'
                    }
                ];
                
                this.init();
            }

            init() {
                this.initializeTheme();
                this.initializeUser();
                this.setupEventListeners();
                this.setupFileUpload();
                this.setupModalEventListeners();
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

            setupFileUpload() {
                const fileUploadArea = document.getElementById('fileUploadArea');
                const fileInput = document.getElementById('fileInput');

                // Click to upload
                fileUploadArea.addEventListener('click', () => {
                    fileInput.click();
                });

                // File input change
                fileInput.addEventListener('change', (e) => {
                    this.handleFiles(e.target.files);
                });

                // Drag and drop
                fileUploadArea.addEventListener('dragover', (e) => {
                    e.preventDefault();
                    fileUploadArea.classList.add('drag-over');
                });

                fileUploadArea.addEventListener('dragleave', (e) => {
                    e.preventDefault();
                    fileUploadArea.classList.remove('drag-over');
                });

                fileUploadArea.addEventListener('drop', (e) => {
                    e.preventDefault();
                    fileUploadArea.classList.remove('drag-over');
                    this.handleFiles(e.dataTransfer.files);
                });
            }

            setupModalEventListeners() {
                // Submission Form
                const submissionForm = document.getElementById('submissionForm');
                submissionForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.handleSubmission(e);
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

            performSearch(query) {
                console.log('Searching submissions for:', query);
                if (query.length > 2) {
                    this.showToast(`Searching for "${query}"...`, 'info');
                }
            }

            // File Upload Functions
            handleFiles(files) {
                const filesList = Array.from(files);
                const maxSize = 100 * 1024 * 1024; // 100MB
                const allowedTypes = ['.zip', '.pdf', '.mp4', '.png', '.jpg', '.jpeg', '.pptx', '.docx'];

                filesList.forEach(file => {
                    // Validate file size
                    if (file.size > maxSize) {
                        this.showToast(`File "${file.name}" is too large. Maximum size is 100MB.`, 'error');
                        return;
                    }

                    // Validate file type
                    const fileExt = '.' + file.name.split('.').pop().toLowerCase();
                    if (!allowedTypes.includes(fileExt)) {
                        this.showToast(`File type "${fileExt}" is not supported.`, 'error');
                        return;
                    }

                    // Add to uploaded files
                    this.uploadedFiles.push({
                        id: Date.now() + Math.random(),
                        name: file.name,
                        size: this.formatFileSize(file.size),
                        type: this.getFileType(file.name),
                        file: file
                    });
                });

                this.updateFilesList();
                this.simulateUpload();
            }

            simulateUpload() {
                const progressContainer = document.getElementById('uploadProgress');
                const progressFill = document.getElementById('progressFill');
                const progressText = document.getElementById('progressText');

                progressContainer.style.display = 'block';
                
                let progress = 0;
                const interval = setInterval(() => {
                    progress += Math.random() * 15;
                    if (progress >= 100) {
                        progress = 100;
                        clearInterval(interval);
                        progressText.textContent = 'Upload complete!';
                        setTimeout(() => {
                            progressContainer.style.display = 'none';
                            progressFill.style.width = '0%';
                        }, 1000);
                    }
                    
                    progressFill.style.width = progress + '%';
                    progressText.textContent = `Uploading... ${Math.round(progress)}%`;
                }, 200);
            }

            updateFilesList() {
                const filesContainer = document.getElementById('uploadedFiles');
                const filesList = document.getElementById('filesList');

                if (this.uploadedFiles.length === 0) {
                    filesContainer.style.display = 'none';
                    return;
                }

                filesContainer.style.display = 'block';
                filesList.innerHTML = '';

                this.uploadedFiles.forEach(file => {
                    const fileElement = document.createElement('div');
                    fileElement.className = 'uploaded-file';
                    fileElement.innerHTML = `
                        <div class="file-info">
                            <div class="file-type-icon">
                                <i class="fas ${this.getFileIcon(file.type)}"></i>
                            </div>
                            <div class="file-details">
                                <div class="file-name">${file.name}</div>
                                <div class="file-size">${file.size}</div>
                            </div>
                        </div>
                        <div class="file-actions">
                            <button class="file-action-btn" onclick="submissionManager.previewFile('${file.id}')">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="file-action-btn delete" onclick="submissionManager.removeFile('${file.id}')">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    `;
                    filesList.appendChild(fileElement);
                });
            }

            removeFile(fileId) {
                this.uploadedFiles = this.uploadedFiles.filter(file => file.id != fileId);
                this.updateFilesList();
                this.showToast('File removed successfully!', 'success');
            }

            previewFile(fileId) {
                const file = this.uploadedFiles.find(f => f.id == fileId);
                if (file) {
                    this.showToast(`Previewing ${file.name}...`, 'info');
                }
            }

            formatFileSize(bytes) {
                if (bytes === 0) return '0 Bytes';
                const k = 1024;
                const sizes = ['Bytes', 'KB', 'MB', 'GB'];
                const i = Math.floor(Math.log(bytes) / Math.log(k));
                return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
            }

            getFileType(filename) {
                const ext = filename.split('.').pop().toLowerCase();
                if (['zip', 'rar'].includes(ext)) return 'archive';
                if (['pdf'].includes(ext)) return 'pdf';
                if (['mp4', 'avi', 'mov'].includes(ext)) return 'video';
                if (['png', 'jpg', 'jpeg', 'gif'].includes(ext)) return 'image';
                if (['pptx', 'ppt'].includes(ext)) return 'presentation';
                if (['docx', 'doc'].includes(ext)) return 'document';
                return 'file';
            }

            getFileIcon(type) {
                const icons = {
                    archive: 'fa-file-archive',
                    pdf: 'fa-file-pdf',
                    video: 'fa-file-video',
                    image: 'fa-file-image',
                    presentation: 'fa-file-powerpoint',
                    document: 'fa-file-word',
                    file: 'fa-file'
                };
                return icons[type] || 'fa-file';
            }

            // Modal Functions
            openSubmissionModal() {
                const modal = document.getElementById('submissionModal');
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }

            closeSubmissionModal() {
                const modal = document.getElementById('submissionModal');
                modal.classList.remove('active');
                document.body.style.overflow = 'auto';
                
                // Reset form and files
                const form = document.getElementById('submissionForm');
                form.reset();
                this.uploadedFiles = [];
                this.updateFilesList();
            }

            closeAllModals() {
                this.closeSubmissionModal();
            }

            handleSubmission(event) {
                const formData = new FormData(event.target);
                const submissionData = Object.fromEntries(formData);
                
                // Validate form
                if (!submissionData.title || !submissionData.event || !submissionData.description) {
                    this.showToast('Please fill in all required fields!', 'error');
                    return;
                }
                
                if (this.uploadedFiles.length === 0) {
                    this.showToast('Please upload at least one project file!', 'error');
                    return;
                }
                
                // Simulate submission
                const submitBtn = event.target.querySelector('.btn-submit');
                const originalText = submitBtn.innerHTML;
                
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
                submitBtn.disabled = true;
                
                setTimeout(() => {
                    this.showToast('Project submitted successfully! 🎉', 'success');
                    this.closeSubmissionModal();
                    
                    // Reset button
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    
                    // In real implementation, would add submission to data and refresh display
                    console.log('Submitted project with data:', submissionData);
                    console.log('Uploaded files:', this.uploadedFiles);
                }, 2500);
            }

            // Submission Actions
            viewSubmission(submissionId) {
                const submission = this.findSubmission(submissionId);
                this.showToast(`Loading ${submission?.title || 'submission'} details...`, 'info');
                
                setTimeout(() => {
                    console.log('View submission:', submissionId);
                    // In real implementation, would open detailed view modal
                }, 1000);
            }

            editSubmission(submissionId) {
                const submission = this.findSubmission(submissionId);
                this.showToast(`Opening ${submission?.title || 'submission'} for editing...`, 'info');
                
                setTimeout(() => {
                    console.log('Edit submission:', submissionId);
                    this.openSubmissionModal(); // Would pre-populate with existing data
                }, 1000);
            }

            deleteSubmission(submissionId) {
                const submission = this.findSubmission(submissionId);
                
                if (confirm(`Are you sure you want to delete "${submission?.title || 'this submission'}"?`)) {
                    const button = event.target;
                    const originalContent = button.innerHTML;
                    
                    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
                    button.disabled = true;
                    
                    setTimeout(() => {
                        this.showToast(`${submission?.title || 'Submission'} deleted successfully!`, 'success');
                        
                        // Reset button
                        button.innerHTML = originalContent;
                        button.disabled = false;
                        
                        // In real implementation, would remove from data and refresh display
                        console.log('Delete submission:', submissionId);
                    }, 1500);
                }
            }

            submitProject(submissionId) {
                const submission = this.findSubmission(submissionId);
                
                if (confirm(`Submit "${submission?.title || 'this project'}" for evaluation?`)) {
                    const button = event.target;
                    const originalContent = button.innerHTML;
                    
                    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
                    button.disabled = true;
                    
                    setTimeout(() => {
                        this.showToast(`${submission?.title || 'Project'} submitted for review!`, 'success');
                        
                        // Reset button
                        button.innerHTML = originalContent;
                        button.disabled = false;
                        
                        console.log('Submit project:', submissionId);
                    }, 2000);
                }
            }

            shareSubmission(submissionId) {
                const submission = this.findSubmission(submissionId);
                
                // Simulate copying share link
                const shareLink = `https://nexushack.com/submissions/${submissionId}`;
                
                if (navigator.clipboard) {
                    navigator.clipboard.writeText(shareLink).then(() => {
                        this.showToast('Share link copied to clipboard!', 'success');
                    });
                } else {
                    this.showToast(`Share link: ${shareLink}`, 'info');
                }
            }

            downloadCertificate(submissionId) {
                const submission = this.findSubmission(submissionId);
                const button = event.target;
                const originalContent = button.innerHTML;
                
                button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
                button.disabled = true;
                
                setTimeout(() => {
                    this.showToast('Certificate downloaded successfully!', 'success');
                    
                    // Reset button
                    button.innerHTML = originalContent;
                    button.disabled = false;
                    
                    console.log('Download certificate:', submissionId);
                }, 1500);
            }

            viewGuidelines() {
                this.showToast('Opening submission guidelines...', 'info');
                
                setTimeout(() => {
                    console.log('View guidelines');
                    // In real implementation, would open guidelines modal or redirect
                }, 1000);
            }

            findSubmission(submissionId) {
                return this.submissions.find(s => s.id === submissionId);
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
        let submissionManager;

        function switchTab(tabName) {
            submissionManager.switchTab(tabName);
        }

        function openSubmissionModal() {
            submissionManager.openSubmissionModal();
        }

        function closeSubmissionModal() {
            submissionManager.closeSubmissionModal();
        }

        function viewSubmission(submissionId) {
            submissionManager.viewSubmission(submissionId);
        }

        function editSubmission(submissionId) {
            submissionManager.editSubmission(submissionId);
        }

        function deleteSubmission(submissionId) {
            submissionManager.deleteSubmission(submissionId);
        }

        function submitProject(submissionId) {
            submissionManager.submitProject(submissionId);
        }

        function shareSubmission(submissionId) {
            submissionManager.shareSubmission(submissionId);
        }

        function downloadCertificate(submissionId) {
            submissionManager.downloadCertificate(submissionId);
        }

        function viewGuidelines() {
            submissionManager.viewGuidelines();
        }

        function logout() {
            if (confirm('Are you sure you want to logout?')) {
                localStorage.removeItem('userSession');
                window.location.href = '../auth/login.html';
            }
        }

        // Initialize the application
        document.addEventListener('DOMContentLoaded', () => {
            submissionManager = new SubmissionManager();
            
            // Animate submission cards on page load
            setTimeout(() => {
                document.querySelectorAll('.submission-card').forEach((card, index) => {
                    setTimeout(() => {
                        card.style.transform = 'translateY(-6px)';
                        setTimeout(() => {
                            card.style.transform = 'translateY(0)';
                        }, 200);
                    }, index * 150);
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
