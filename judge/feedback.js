      class FeedbackManager {
            constructor() {
                this.projects = [];
                this.feedback = [];
                this.templates = [];
                this.selectedProject = null;
                this.selectedCategory = null;
                this.isMobile = window.innerWidth <= 1024;
                this.currentUser = {
                    name: 'Dr. Jane Smith',
                    initials: 'JS',
                    role: 'Senior Judge',
                    id: 'judge_001'
                };
                this.init();
            }

            init() {
                this.initializeTheme();
                this.setupEventListeners();
                this.loadData();
                this.renderProjects();
                this.renderCategories();
                this.renderRecentFeedback();
                this.renderTemplates();
                this.initializeUser();
                this.handleResize();
            }

            // ✅ THEME COLOR COMBINATION
            initializeTheme() {
                const savedTheme = localStorage.getItem('theme') || 'dark';
                document.documentElement.setAttribute('data-theme', savedTheme);
                const themeToggle = document.getElementById('themeToggle');
                const themeIcon = themeToggle.querySelector('i');
                themeIcon.className = savedTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
            }

            initializeUser() {
                const userSession = localStorage.getItem('judgeSession');
                if (userSession) {
                    const session = JSON.parse(userSession);
                    this.currentUser.name = session.name || this.currentUser.name;
                    this.currentUser.initials = session.initials || this.currentUser.initials;
                }
                document.getElementById('userName').textContent = this.currentUser.name;
                document.getElementById('userAvatar').textContent = this.currentUser.initials;
            }

            setupEventListeners() {
                // Sidebar and UI controls
                document.getElementById('sidebarToggle').addEventListener('click', () => this.toggleSidebar());
                document.getElementById('themeToggle').addEventListener('click', () => this.toggleTheme());
                document.getElementById('mobileOverlay').addEventListener('click', () => this.closeMobileSidebar());
                window.addEventListener('resize', () => this.handleResize());
                window.addEventListener('orientationchange', () => setTimeout(() => this.handleResize(), 100));
                
                // Project search
                const searchInput = document.getElementById('projectSearch');
                let searchTimeout;
                searchInput.addEventListener('input', (e) => {
                    clearTimeout(searchTimeout);
                    searchTimeout = setTimeout(() => this.searchProjects(e.target.value), 300);
                });

                // Form submission
                document.getElementById('feedbackForm').addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.submitFeedback();
                });

                // Auto-save and keyboard shortcuts
                this.setupAutoSave();
                this.setupKeyboardShortcuts();
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

            setupKeyboardShortcuts() {
                document.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape') {
                        this.closeMobileSidebar();
                    }
                    if (e.ctrlKey || e.metaKey) {
                        switch(e.key) {
                            case 's':
                                e.preventDefault();
                                this.saveDraft();
                                break;
                            case 'Enter':
                                if (e.shiftKey) {
                                    e.preventDefault();
                                    this.submitFeedback();
                                }
                                break;
                        }
                    }
                });
            }

            setupAutoSave() {
                const contentField = document.getElementById('feedbackContent');
                const subjectField = document.getElementById('feedbackSubject');
                
                let saveTimeout;
                const autoSave = () => {
                    clearTimeout(saveTimeout);
                    saveTimeout = setTimeout(() => {
                        this.saveDraftData();
                    }, 2000);
                };

                contentField.addEventListener('input', autoSave);
                subjectField.addEventListener('input', autoSave);
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

            // ✅ THEME TOGGLE WITH SMOOTH TRANSITION
            toggleTheme() {
                const html = document.documentElement;
                const currentTheme = html.getAttribute('data-theme');
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                
                html.style.transition = 'all 0.3s ease';
                html.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
                
                const themeIcon = document.getElementById('themeToggle').querySelector('i');
                themeIcon.className = newTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
                
                this.showToast(`Theme changed to ${newTheme} mode ✨`, 'success');
                
                setTimeout(() => {
                    html.style.transition = '';
                }, 300);
            }

            // ✅ UX LOADER AT TOP
            showLoader() {
                let loaderBar = document.getElementById('loaderBar');
                if (!loaderBar) {
                    loaderBar = document.createElement('div');
                    loaderBar.id = 'loaderBar';
                    document.body.appendChild(loaderBar);
                }
                
                setTimeout(() => {
                    loaderBar.style.width = '60%';
                }, 50);
            }

            completeLoader() {
                const loaderBar = document.getElementById('loaderBar');
                if (loaderBar) {
                    loaderBar.style.width = '100%';
                    
                    setTimeout(() => {
                        loaderBar.style.width = '0%';
                        loaderBar.style.opacity = '0';
                        
                        setTimeout(() => {
                            if (loaderBar.parentNode) {
                                loaderBar.remove();
                            }
                        }, 300);
                    }, 500);
                }
            }

            loadData() {
                // Load projects
                const storedProjects = localStorage.getItem('judgeProjects');
                if (storedProjects) {
                    this.projects = JSON.parse(storedProjects);
                } else {
                    this.projects = this.getMockProjects();
                    localStorage.setItem('judgeProjects', JSON.stringify(this.projects));
                }

                // Load feedback
                const storedFeedback = localStorage.getItem('judgeFeedback');
                if (storedFeedback) {
                    this.feedback = JSON.parse(storedFeedback);
                } else {
                    this.feedback = this.getMockFeedback();
                }

                // Load templates
                this.templates = this.getMockTemplates();

                // Load draft if exists
                this.loadDraftData();
            }

            getMockProjects() {
                return [
                    { id: 1, name: 'DeFi Portfolio Tracker', team: 'Blockchain Innovators', avatar: 'DP', status: 'active' },
                    { id: 2, name: 'AI Healthcare Assistant', team: 'MedTech Solutions', avatar: 'AH', status: 'active' },
                    { id: 3, name: 'Smart City Dashboard', team: 'Urban Tech', avatar: 'SC', status: 'pending' },
                    { id: 4, name: 'Green Energy Monitor', team: 'EcoTech', avatar: 'GE', status: 'active' },
                    { id: 5, name: 'Social Impact Platform', team: 'Change Makers', avatar: 'SI', status: 'completed' },
                    { id: 6, name: 'EdTech Learning Hub', team: 'Education First', avatar: 'EL', status: 'active' }
                ];
            }

            getMockFeedback() {
                return [
                    {
                        id: 1,
                        project: 'DeFi Portfolio Tracker',
                        subject: 'Excellent technical implementation with room for UX improvement',
                        content: 'Outstanding work on the smart contract architecture and security implementation. The code quality is professional-grade with proper error handling...',
                        status: 'sent',
                        category: 'technical',
                        priority: 'medium',
                        timestamp: Date.now() - 3600000,
                        author: this.currentUser.name
                    },
                    {
                        id: 2,
                        project: 'AI Healthcare Assistant',
                        subject: 'Great UX design, needs performance optimization',
                        content: 'The user interface is intuitive and well-designed. However, the AI response time could be improved for better user experience...',
                        status: 'draft',
                        category: 'design',
                        priority: 'high',
                        timestamp: Date.now() - 7200000,
                        author: this.currentUser.name
                    },
                    {
                        id: 3,
                        project: 'Smart City Dashboard',
                        subject: 'Strong business model with technical challenges',
                        content: 'Impressive market research and business potential. The revenue model is well-thought-out. Technical implementation needs refinement...',
                        status: 'pending',
                        category: 'business',
                        priority: 'medium',
                        timestamp: Date.now() - 10800000,
                        author: this.currentUser.name
                    }
                ];
            }

            getMockTemplates() {
                return [
                    {
                        id: 1,
                        name: 'Technical Feedback',
                        description: 'Comprehensive technical implementation review',
                        category: 'technical'
                    },
                    {
                        id: 2,
                        name: 'UX/UI Review',
                        description: 'Design and user experience assessment',
                        category: 'design'
                    },
                    {
                        id: 3,
                        name: 'Business Viability',
                        description: 'Market potential and business model evaluation',
                        category: 'business'
                    },
                    {
                        id: 4,
                        name: 'Innovation Assessment',
                        description: 'Creativity and innovation evaluation',
                        category: 'innovation'
                    }
                ];
            }

            renderProjects() {
                const container = document.getElementById('projectList');
                container.innerHTML = '';

                this.projects.forEach(project => {
                    const projectItem = document.createElement('div');
                    projectItem.className = 'project-item';
                    projectItem.onclick = () => this.selectProject(project.id);

                    projectItem.innerHTML = `
                        <div class="project-avatar">${project.avatar}</div>
                        <div class="project-details">
                            <div class="project-name">${project.name}</div>
                            <div class="project-team">${project.team}</div>
                        </div>
                    `;

                    container.appendChild(projectItem);
                });
            }

            renderCategories() {
                const categories = [
                    { id: 'technical', name: 'Technical', icon: 'fas fa-code' },
                    { id: 'design', name: 'Design', icon: 'fas fa-palette' },
                    { id: 'business', name: 'Business', icon: 'fas fa-chart-line' },
                    { id: 'innovation', name: 'Innovation', icon: 'fas fa-lightbulb' }
                ];

                const container = document.getElementById('feedbackCategories');
                container.innerHTML = '';

                categories.forEach(category => {
                    const categoryItem = document.createElement('div');
                    categoryItem.className = 'category-item';
                    categoryItem.onclick = () => this.selectCategory(category.id);

                    categoryItem.innerHTML = `
                        <div class="category-icon">
                            <i class="${category.icon}"></i>
                        </div>
                        <div class="category-name">${category.name}</div>
                    `;

                    container.appendChild(categoryItem);
                });
            }

            renderRecentFeedback() {
                const container = document.getElementById('recentFeedback');
                container.innerHTML = '';

                const recentFeedback = this.feedback.slice(0, 5);
                recentFeedback.forEach(feedback => {
                    const feedbackItem = document.createElement('div');
                    feedbackItem.className = 'feedback-item';
                    feedbackItem.onclick = () => this.loadFeedback(feedback.id);

                    feedbackItem.innerHTML = `
                        <div class="feedback-header-item">
                            <div class="feedback-project">${feedback.project}</div>
                            <div class="feedback-time">${this.formatTime(feedback.timestamp)}</div>
                        </div>
                        <div class="feedback-preview">${feedback.content}</div>
                        <div class="feedback-status">
                            <span class="status-badge ${feedback.status}">${feedback.status.toUpperCase()}</span>
                        </div>
                    `;

                    container.appendChild(feedbackItem);
                });
            }

            renderTemplates() {
                const container = document.getElementById('feedbackTemplates');
                container.innerHTML = '';

                this.templates.forEach(template => {
                    const templateItem = document.createElement('div');
                    templateItem.className = 'template-item';
                    templateItem.onclick = () => this.useTemplate(template.id);

                    templateItem.innerHTML = `
                        <div class="template-name">${template.name}</div>
                        <div class="template-description">${template.description}</div>
                    `;

                    container.appendChild(templateItem);
                });
            }

            selectProject(projectId) {
                this.selectedProject = projectId;
                
                // Update visual selection
                document.querySelectorAll('.project-item').forEach(item => {
                    item.classList.remove('selected');
                });
                event.target.closest('.project-item').classList.add('selected');

                const project = this.projects.find(p => p.id === projectId);
                this.showToast(`📁 Selected project: ${project.name}`, 'success');
            }

            selectCategory(categoryId) {
                this.selectedCategory = categoryId;
                
                // Update visual selection
                document.querySelectorAll('.category-item').forEach(item => {
                    item.classList.remove('selected');
                });
                event.target.closest('.category-item').classList.add('selected');

                this.showToast(`🏷️ Selected category: ${categoryId}`, 'success');
            }

            searchProjects(searchTerm) {
                const filteredProjects = this.projects.filter(project =>
                    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    project.team.toLowerCase().includes(searchTerm.toLowerCase())
                );

                const container = document.getElementById('projectList');
                container.innerHTML = '';

                filteredProjects.forEach(project => {
                    const projectItem = document.createElement('div');
                    projectItem.className = 'project-item';
                    projectItem.onclick = () => this.selectProject(project.id);

                    projectItem.innerHTML = `
                        <div class="project-avatar">${project.avatar}</div>
                        <div class="project-details">
                            <div class="project-name">${project.name}</div>
                            <div class="project-team">${project.team}</div>
                        </div>
                    `;

                    container.appendChild(projectItem);
                });

                if (filteredProjects.length === 0) {
                    container.innerHTML = `
                        <div style="text-align: center; padding: 2rem; color: var(--text-muted);">
                            <i class="fas fa-search" style="font-size: 2rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                            <div>No projects found for "${searchTerm}"</div>
                        </div>
                    `;
                }
            }

            // ✅ REALISTIC TEMPLATE USAGE
            useTemplate(templateId) {
                const template = this.templates.find(t => t.id === templateId);
                
                const templateContent = {
                    1: `Technical Implementation Review:

Strengths:
• Clean and well-structured codebase with proper organization
• Effective use of design patterns and best practices
• Comprehensive documentation and inline comments
• Good error handling and validation

Areas for Improvement:
• Consider implementing additional unit tests for core functionality
• Optimize database queries and API calls for better performance
• Review code for potential security vulnerabilities
• Add proper logging for debugging and monitoring

Technical Recommendations:
• Implement caching mechanisms for frequently accessed data
• Consider using design patterns like Repository or Factory
• Add input sanitization and validation layers
• Implement proper authentication and authorization

Next Steps:
• Code review with senior developers
• Performance testing and optimization
• Security audit and penetration testing
• Documentation updates and API documentation`,
                    
                    2: `UX/UI Design Assessment:

Strengths:
• Intuitive and user-friendly interface design
• Consistent visual hierarchy and design system
• Responsive design that works well across devices
• Good use of colors, typography, and spacing

Areas for Improvement:
• Some navigation elements could be more prominent
• Loading states and error messages need better visual feedback
• Consider accessibility improvements for screen readers
• Mobile experience could be further optimized

Design Recommendations:
• Implement comprehensive design system guidelines
• Add micro-interactions to improve user engagement
• Enhance accessibility with proper ARIA labels
• Optimize images and assets for better performance

User Experience Enhancements:
• Conduct user testing to validate design decisions
• Implement keyboard navigation support
• Add progressive web app features
• Consider dark mode implementation`,
                    
                    3: `Business Viability Analysis:

Strengths:
• Clear value proposition and well-defined target market
• Solid understanding of customer pain points
• Realistic revenue model and pricing strategy
• Good market research and competitive analysis

Areas for Improvement:
• Market analysis could include more comprehensive data
• Competitive landscape analysis needs deeper insights
• Financial projections require more detailed validation
• Go-to-market strategy needs refinement

Business Recommendations:
• Conduct comprehensive market validation studies
• Develop strategic partnerships for market entry
• Create detailed financial models and projections
• Build a robust customer acquisition strategy

Strategic Considerations:
• Analyze potential scalability challenges
• Consider regulatory and compliance requirements
• Evaluate technology stack for business growth
• Develop intellectual property protection strategy`,
                    
                    4: `Innovation and Creativity Assessment:

Strengths:
• Novel approach to solving complex problems
• Creative integration of emerging technologies
• Unique features that differentiate from competitors
• Innovative user experience design

Areas for Improvement:
• Some innovative features need better user education
• Technical complexity might hinder widespread adoption
• Innovation should align more closely with user needs
• Consider simplifying complex innovative elements

Innovation Recommendations:
• Balance innovation with practical usability
• Create educational content to help users understand benefits
• Iterate on innovative features based on user feedback
• Consider patent potential for unique innovations

Future Innovation Opportunities:
• Explore emerging technology integrations
• Consider AI/ML enhancements for personalization
• Investigate blockchain or IoT applications
• Plan for future technology adoptions and upgrades`
                };

                // Auto-select category based on template
                if (template.category) {
                    this.selectCategory(template.category);
                    document.querySelectorAll('.category-item').forEach(item => {
                        item.classList.remove('selected');
                        if (item.querySelector('.category-name').textContent.toLowerCase() === template.category) {
                            item.classList.add('selected');
                        }
                    });
                }

                const selectedProjectName = this.selectedProject ? 
                    this.projects.find(p => p.id === this.selectedProject).name : 
                    'Project Name';

                document.getElementById('feedbackSubject').value = `${template.name} - ${selectedProjectName}`;
                document.getElementById('feedbackContent').value = templateContent[templateId] || template.description;
                
                this.showToast(`📋 Template "${template.name}" loaded successfully`, 'success');
            }

            // ✅ REALISTIC SUBMIT FEEDBACK
            submitFeedback() {
                const subject = document.getElementById('feedbackSubject').value.trim();
                const content = document.getElementById('feedbackContent').value.trim();
                const priority = document.getElementById('feedbackPriority').value;

                // Enhanced validation
                if (!this.selectedProject) {
                    this.showToast('⚠️ Please select a project first', 'warning');
                    return;
                }

                if (!subject || subject.length < 5) {
                    this.showToast('⚠️ Please enter a subject (minimum 5 characters)', 'warning');
                    return;
                }

                if (!content || content.length < 50) {
                    this.showToast('⚠️ Please enter feedback content (minimum 50 characters)', 'warning');
                    return;
                }

                this.showLoader();

                setTimeout(() => {
                    // Create feedback object
                    const newFeedback = {
                        id: Date.now(),
                        project: this.projects.find(p => p.id === this.selectedProject).name,
                        subject: subject,
                        content: content,
                        category: this.selectedCategory || 'general',
                        priority: priority,
                        status: 'sent',
                        timestamp: Date.now(),
                        author: this.currentUser.name,
                        feedbackId: `FB-${Date.now()}-${this.currentUser.id.slice(-3)}`
                    };

                    // Save feedback
                    this.feedback.unshift(newFeedback);
                    localStorage.setItem('judgeFeedback', JSON.stringify(this.feedback));

                    // Clear form and selections
                    this.resetForm();

                    // Update UI
                    this.renderRecentFeedback();

                    this.completeLoader();
                    this.showToast(`✅ Feedback sent successfully! ID: ${newFeedback.feedbackId}`, 'success');
                }, 2000);
            }

            // ✅ REALISTIC SAVE DRAFT
            saveDraft() {
                const subject = document.getElementById('feedbackSubject').value.trim();
                const content = document.getElementById('feedbackContent').value.trim();
                const priority = document.getElementById('feedbackPriority').value;

                if (!this.selectedProject || !subject || !content) {
                    this.showToast('⚠️ Please fill in project, subject, and content before saving', 'warning');
                    return;
                }

                this.showLoader();

                setTimeout(() => {
                    const draft = {
                        id: Date.now(),
                        project: this.projects.find(p => p.id === this.selectedProject).name,
                        subject: subject,
                        content: content,
                        category: this.selectedCategory || 'general',
                        priority: priority,
                        status: 'draft',
                        timestamp: Date.now(),
                        author: this.currentUser.name,
                        draftId: `DRAFT-${Date.now()}-${this.currentUser.id.slice(-3)}`
                    };

                    this.feedback.unshift(draft);
                    localStorage.setItem('judgeFeedback', JSON.stringify(this.feedback));
                    this.renderRecentFeedback();

                    this.completeLoader();
                    this.showToast(`💾 Feedback saved as draft! ID: ${draft.draftId}`, 'success');
                }, 1500);
            }

            saveDraftData() {
                const draftData = {
                    selectedProject: this.selectedProject,
                    selectedCategory: this.selectedCategory,
                    subject: document.getElementById('feedbackSubject').value,
                    content: document.getElementById('feedbackContent').value,
                    priority: document.getElementById('feedbackPriority').value,
                    timestamp: Date.now()
                };

                localStorage.setItem('feedbackDraft', JSON.stringify(draftData));
            }

            loadDraftData() {
                const draft = localStorage.getItem('feedbackDraft');
                if (draft) {
                    const draftData = JSON.parse(draft);
                    
                    // Don't load if it's too old (more than 24 hours)
                    if (Date.now() - draftData.timestamp > 86400000) {
                        localStorage.removeItem('feedbackDraft');
                        return;
                    }

                    if (draftData.subject || draftData.content) {
                        document.getElementById('feedbackSubject').value = draftData.subject || '';
                        document.getElementById('feedbackContent').value = draftData.content || '';
                        document.getElementById('feedbackPriority').value = draftData.priority || 'medium';
                        
                        if (draftData.selectedProject) {
                            this.selectProject(draftData.selectedProject);
                        }
                        
                        if (draftData.selectedCategory) {
                            this.selectCategory(draftData.selectedCategory);
                        }

                        this.showToast('📄 Draft loaded from previous session', 'info');
                    }
                }
            }

            loadFeedback(feedbackId) {
                const feedback = this.feedback.find(f => f.id === feedbackId);
                if (!feedback) return;

                // Find and select project
                const project = this.projects.find(p => p.name === feedback.project);
                if (project) {
                    this.selectProject(project.id);
                }

                // Select category
                if (feedback.category) {
                    this.selectCategory(feedback.category);
                }

                // Fill form
                document.getElementById('feedbackSubject').value = feedback.subject;
                document.getElementById('feedbackContent').value = feedback.content;
                document.getElementById('feedbackPriority').value = feedback.priority || 'medium';

                this.showToast(`📝 Loaded feedback: ${feedback.subject}`, 'info');
            }

            resetForm() {
                document.getElementById('feedbackSubject').value = '';
                document.getElementById('feedbackContent').value = '';
                document.getElementById('feedbackPriority').value = 'medium';
                
                // Clear selections
                document.querySelectorAll('.project-item').forEach(item => {
                    item.classList.remove('selected');
                });
                document.querySelectorAll('.category-item').forEach(item => {
                    item.classList.remove('selected');
                });
                
                this.selectedProject = null;
                this.selectedCategory = null;

                // Clear draft
                localStorage.removeItem('feedbackDraft');
            }

            formatTime(timestamp) {
                const now = Date.now();
                const diff = now - timestamp;
                
                if (diff < 3600000) {
                    const minutes = Math.floor(diff / 60000);
                    return `${minutes}m ago`;
                } else if (diff < 86400000) {
                    const hours = Math.floor(diff / 3600000);
                    return `${hours}h ago`;
                } else {
                    const days = Math.floor(diff / 86400000);
                    return `${days}d ago`;
                }
            }

            // ✅ NOTIFICATION VISIBILITY - NO OVERLAP
            showToast(message, type = 'success') {
                // Remove existing toasts
                const existingToasts = document.querySelectorAll('.toast');
                existingToasts.forEach(toast => toast.remove());
                
                const toast = document.createElement('div');
                toast.className = `toast ${type}`;
                toast.innerHTML = `
                    <i class="fas ${this.getToastIcon(type)}" style="margin-right: 10px;"></i>
                    ${message}
                `;
                
                document.body.appendChild(toast);
                
                // Auto hide after 4 seconds
                const autoHideTimer = setTimeout(() => {
                    if (toast.parentNode) {
                        toast.style.opacity = '0';
                        setTimeout(() => {
                            if (toast.parentNode) {
                                toast.remove();
                            }
                        }, 300);
                    }
                }, 4000);
                
                // Click to dismiss
                toast.addEventListener('click', () => {
                    clearTimeout(autoHideTimer);
                    toast.style.opacity = '0';
                    setTimeout(() => {
                        if (toast.parentNode) {
                            toast.remove();
                        }
                    }, 300);
                });
            }

            getToastIcon(type) {
                const icons = {
                    success: 'fa-check-circle',
                    error: 'fa-exclamation-circle',
                    info: 'fa-info-circle',
                    warning: 'fa-exclamation-triangle'
                };
                return icons[type] || 'fa-check-circle';
            }
        }

        // Global functions and initialization
        let feedbackManager;

        function saveDraft() { feedbackManager.saveDraft(); }

        // ✅ REALISTIC BUTTON FUNCTIONS
        function openTemplates() {
            feedbackManager.showLoader();
            
            setTimeout(() => {
                feedbackManager.completeLoader();
                feedbackManager.showToast('📋 Template gallery with 20+ professional feedback templates for different categories', 'info');
            }, 1500);
        }

        function exportFeedback() {
            feedbackManager.showLoader();
            
            setTimeout(() => {
                                const exportData = {
                    nexusHackFeedback: {
                        platform: 'NexusHack Professional',
                        version: '2.0',
                        exportedBy: feedbackManager.currentUser.name,
                        exportedAt: new Date().toISOString(),
                        totalFeedback: feedbackManager.feedback.length,
                        feedbackData: feedbackManager.feedback,
                        projects: feedbackManager.projects,
                        templates: feedbackManager.templates,
                        statistics: {
                            sentFeedback: feedbackManager.feedback.filter(f => f.status === 'sent').length,
                            draftFeedback: feedbackManager.feedback.filter(f => f.status === 'draft').length,
                            pendingFeedback: feedbackManager.feedback.filter(f => f.status === 'pending').length,
                            categories: {
                                technical: feedbackManager.feedback.filter(f => f.category === 'technical').length,
                                design: feedbackManager.feedback.filter(f => f.category === 'design').length,
                                business: feedbackManager.feedback.filter(f => f.category === 'business').length,
                                innovation: feedbackManager.feedback.filter(f => f.category === 'innovation').length
                            }
                        }
                    }
                };

                const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `nexushack-feedback-${new Date().toISOString().split('T')[0]}.json`;
                a.style.display = 'none';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                
                feedbackManager.completeLoader();
                feedbackManager.showToast('📥 Complete feedback data exported with statistics and metadata!', 'success');
            }, 2000);
        }

        function backToDashboard() {
            feedbackManager.showToast('🏠 Returning to main dashboard...', 'info');
            feedbackManager.showLoader();
            
            setTimeout(() => {
                feedbackManager.completeLoader();
                window.location.href = 'dashboard.html';
            }, 1000);
        }

        // Initialize the application
        document.addEventListener('DOMContentLoaded', () => {
            feedbackManager = new FeedbackManager();
            
            // Add entrance animations
            setTimeout(() => {
                document.querySelectorAll('.category-item').forEach((item, index) => {
                    setTimeout(() => {
                        item.style.opacity = '0';
                        item.style.transform = 'translateY(30px)';
                        setTimeout(() => {
                            item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0)';
                        }, 100);
                    }, index * 100);
                });
            }, 1000);

            // Project item animations
            setTimeout(() => {
                document.querySelectorAll('.project-item').forEach((item, index) => {
                    setTimeout(() => {
                        item.style.opacity = '0';
                        item.style.transform = 'translateX(-30px)';
                        setTimeout(() => {
                            item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                            item.style.opacity = '1';
                            item.style.transform = 'translateX(0)';
                        }, 100);
                    }, index * 75);
                });
            }, 1500);

            // Feedback item animations
            setTimeout(() => {
                document.querySelectorAll('.feedback-item').forEach((item, index) => {
                    setTimeout(() => {
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.9)';
                        setTimeout(() => {
                            item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                        }, 100);
                    }, index * 100);
                });
            }, 2000);

            // Template item animations
            setTimeout(() => {
                document.querySelectorAll('.template-item').forEach((item, index) => {
                    setTimeout(() => {
                        item.style.opacity = '0';
                        item.style.transform = 'translateX(20px)';
                        setTimeout(() => {
                            item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                            item.style.opacity = '1';
                            item.style.transform = 'translateX(0)';
                        }, 100);
                    }, index * 150);
                });
            }, 2500);

            // Stat card animations
            setTimeout(() => {
                document.querySelectorAll('.stat-card').forEach((card, index) => {
                    setTimeout(() => {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(-20px)';
                        setTimeout(() => {
                            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 100);
                    }, index * 200);
                });
            }, 500);

            // Performance optimization for mobile
            if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                document.body.classList.add('mobile-device');
            }

            // Advanced features initialization
            feedbackManager.initializeAdvancedFeatures();

            // Welcome message
            setTimeout(() => {
                feedbackManager.showToast('💬 Feedback Management system loaded! Professional templates and comprehensive tracking ready.', 'success');
            }, 3000);
        });

        // Enhanced FeedbackManager with additional methods
        FeedbackManager.prototype.initializeAdvancedFeatures = function() {
            // Real-time word count
            const contentTextarea = document.getElementById('feedbackContent');
            contentTextarea.addEventListener('input', () => {
                const wordCount = contentTextarea.value.trim().split(/\s+/).filter(word => word.length > 0).length;
                let indicator = document.getElementById('wordCountIndicator');
                
                if (!indicator) {
                    indicator = document.createElement('div');
                    indicator.id = 'wordCountIndicator';
                    indicator.style.cssText = `
                        position: absolute; bottom: 10px; right: 15px; 
                        font-size: 0.8rem; color: var(--text-muted);
                        background: var(--bg-glass); padding: 0.25rem 0.5rem;
                        border-radius: 4px; pointer-events: none;
                    `;
                    contentTextarea.parentNode.style.position = 'relative';
                    contentTextarea.parentNode.appendChild(indicator);
                }
                
                indicator.textContent = `${wordCount} words`;
                
                if (wordCount < 50) {
                    indicator.style.color = 'var(--danger)';
                } else if (wordCount < 100) {
                    indicator.style.color = 'var(--warning)';
                } else {
                    indicator.style.color = 'var(--success)';
                }
            });

            // Priority level styling
            document.getElementById('feedbackPriority').addEventListener('change', (e) => {
                const priority = e.target.value;
                const form = document.getElementById('feedbackForm');
                
                form.className = `feedback-form priority-${priority}`;
                
                const priorityStyles = {
                    low: 'var(--info)',
                    medium: 'var(--warning)', 
                    high: 'var(--danger)',
                    urgent: 'var(--danger)'
                };
                
                e.target.style.borderColor = priorityStyles[priority];
            });

            // Auto-expand textarea
            const textarea = document.getElementById('feedbackContent');
            textarea.addEventListener('input', function() {
                this.style.height = 'auto';
                this.style.height = Math.min(this.scrollHeight, 400) + 'px';
            });

            // Smart suggestions based on category
            this.setupSmartSuggestions();
        };

        FeedbackManager.prototype.setupSmartSuggestions = function() {
            const suggestions = {
                technical: [
                    "Consider implementing error handling for edge cases",
                    "Review code architecture for scalability",
                    "Add comprehensive unit tests",
                    "Optimize database queries for performance",
                    "Implement proper logging and monitoring"
                ],
                design: [
                    "Improve visual hierarchy and contrast",
                    "Enhance mobile responsiveness",
                    "Add accessibility features",
                    "Consider user feedback and usability testing",
                    "Implement consistent design patterns"
                ],
                business: [
                    "Validate market demand with customer research",
                    "Analyze competitive landscape thoroughly",
                    "Develop comprehensive go-to-market strategy",
                    "Consider pricing strategy and revenue streams",
                    "Plan for scalability and growth challenges"
                ],
                innovation: [
                    "Explore emerging technology integrations",
                    "Consider patent potential for unique features",
                    "Balance innovation with practical usability",
                    "Plan for future technology adoptions",
                    "Evaluate disruptive potential in the market"
                ]
            };

            let suggestionTimeout;
            document.addEventListener('click', (e) => {
                if (e.target.closest('.category-item')) {
                    const category = this.selectedCategory;
                    if (category && suggestions[category]) {
                        clearTimeout(suggestionTimeout);
                        suggestionTimeout = setTimeout(() => {
                            this.showSuggestions(suggestions[category]);
                        }, 1000);
                    }
                }
            });
        };

        FeedbackManager.prototype.showSuggestions = function(suggestionList) {
            const existingSuggestions = document.getElementById('smartSuggestions');
            if (existingSuggestions) existingSuggestions.remove();

            const suggestionsDiv = document.createElement('div');
            suggestionsDiv.id = 'smartSuggestions';
            suggestionsDiv.style.cssText = `
                background: var(--bg-glass); border: 1px solid var(--border-feedback);
                border-radius: 12px; padding: 1rem; margin-top: 1rem;
                animation: slideInSuggestions 0.3s ease-out;
            `;

            suggestionsDiv.innerHTML = `
                <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem; color: var(--feedback-blue);">
                    <i class="fas fa-lightbulb"></i>
                    <strong>Smart Suggestions</strong>
                    <button onclick="this.closest('#smartSuggestions').remove()" 
                            style="margin-left: auto; background: none; border: none; color: var(--text-muted); cursor: pointer;">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                ${suggestionList.map(suggestion => `
                    <div class="suggestion-item" onclick="feedbackManager.applySuggestion('${suggestion}')"
                         style="padding: 0.5rem; border-radius: 8px; cursor: pointer; transition: var(--transition);
                                margin-bottom: 0.5rem; font-size: 0.9rem; border-left: 3px solid var(--feedback-blue);">
                        • ${suggestion}
                    </div>
                `).join('')}
            `;

            const formGroup = document.getElementById('feedbackContent').closest('.form-group');
            formGroup.appendChild(suggestionsDiv);

            // Style suggestion items
            suggestionsDiv.querySelectorAll('.suggestion-item').forEach(item => {
                item.addEventListener('mouseenter', () => {
                    item.style.background = 'var(--bg-glass-hover)';
                });
                item.addEventListener('mouseleave', () => {
                    item.style.background = 'transparent';
                });
            });
        };

        FeedbackManager.prototype.applySuggestion = function(suggestion) {
            const textarea = document.getElementById('feedbackContent');
            const currentValue = textarea.value;
            const cursorPosition = textarea.selectionStart;
            
            const suggestionText = `\n• ${suggestion}`;
            const newValue = currentValue.slice(0, cursorPosition) + suggestionText + currentValue.slice(cursorPosition);
            
            textarea.value = newValue;
            textarea.focus();
            textarea.setSelectionRange(cursorPosition + suggestionText.length, cursorPosition + suggestionText.length);
            
            // Trigger auto-expand
            textarea.style.height = 'auto';
            textarea.style.height = Math.min(textarea.scrollHeight, 400) + 'px';
            
            this.showToast('💡 Suggestion applied to feedback', 'success');
        };

        // Enhanced keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case '1':
                        e.preventDefault();
                        document.querySelector('[data-category="technical"]')?.click();
                        break;
                    case '2':
                        e.preventDefault();
                        document.querySelector('[data-category="design"]')?.click();
                        break;
                    case '3':
                        e.preventDefault();
                        document.querySelector('[data-category="business"]')?.click();
                        break;
                    case '4':
                        e.preventDefault();
                        document.querySelector('[data-category="innovation"]')?.click();
                        break;
                    case '/':
                        e.preventDefault();
                        document.getElementById('projectSearch').focus();
                        break;
                }
            }
        });

        // Add CSS animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInSuggestions {
                from { transform: translateY(-10px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            
            .priority-urgent {
                border-left: 4px solid var(--danger) !important;
                background: linear-gradient(90deg, rgba(239, 68, 68, 0.05), transparent) !important;
            }
            
            .priority-high {
                border-left: 4px solid var(--warning) !important;
                background: linear-gradient(90deg, rgba(245, 158, 11, 0.05), transparent) !important;
            }
            
            .priority-medium {
                border-left: 4px solid var(--info) !important;
            }
            
            .priority-low {
                border-left: 4px solid var(--success) !important;
            }
            
            .project-item, .category-item, .feedback-item, .template-item, .stat-card { 
                transition: var(--transition) !important; 
            }
            
            @media (hover: hover) and (pointer: fine) {
                .project-item:hover, .category-item:hover, .feedback-item:hover, .template-item:hover {
                    transform: translateY(-2px) !important;
                    box-shadow: var(--shadow-md) !important;
                }
                .stat-card:hover { 
                    transform: translateY(-4px) !important; 
                    box-shadow: var(--shadow-lg) !important;
                }
            }
            
            *:focus-visible { 
                outline: 2px solid var(--feedback-blue) !important; 
                outline-offset: 2px !important; 
            }
            
            /* Enhanced mobile optimizations */
            @media (max-width: 768px) {
                .feedback-layout {
                    grid-template-columns: 1fr !important;
                }
                
                .composer-header {
                    flex-direction: column !important;
                    align-items: flex-start !important;
                }
                
                .composer-meta {
                    width: 100% !important;
                    justify-content: space-between !important;
                }
                
                .feedback-categories {
                    grid-template-columns: repeat(2, 1fr) !important;
                }
            }
            
            @media (max-width: 480px) {
                .feedback-categories {
                    grid-template-columns: 1fr !important;
                }
                
                .form-actions {
                    flex-direction: column !important;
                }
                
                .topbar-actions > *:nth-child(2) {
                    display: none !important;
                }
            }
            
            /* Print styles */
            @media print {
                .sidebar, .topbar, .mobile-overlay, .action-btn, .toast, #loaderBar {
                    display: none !important;
                }
                
                .main-content {
                    margin-left: 0 !important;
                }
                
                .feedback-header {
                    background: none !important;
                    color: black !important;
                }
                
                .feedback-composer {
                    break-inside: avoid !important;
                }
            }
            
            /* Accessibility improvements */
            @media (prefers-reduced-motion: reduce) {
                * {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                    scroll-behavior: auto !important;
                }
            }
            
            /* High contrast mode support */
            @media (prefers-contrast: high) {
                :root {
                    --border: #ffffff !important;
                    --border-light: #cccccc !important;
                    --text-muted: #ffffff !important;
                }
            }
            
            /* Dark mode specific enhancements */
            [data-theme="dark"] {
                scrollbar-color: var(--feedback-blue) var(--bg-glass);
            }
            
            [data-theme="light"] {
                scrollbar-color: var(--feedback-blue) #f1f5f9;
            }
        `;
        document.head.appendChild(style);