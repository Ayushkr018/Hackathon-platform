// ADVANCED FEEDBACK MANAGEMENT SYSTEM
        class FeedbackManager {
            constructor() {
                this.projects = [];
                this.feedback = [];
                this.templates = [];
                this.selectedProject = null;
                this.selectedCategory = null;
                this.isMobile = window.innerWidth <= 1024;
                this.currentUser = { name: 'Dr. Jane Smith', initials: 'JS', role: 'Senior Judge', id: 'judge_001' };
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

            initializeTheme() {
                const savedTheme = localStorage.getItem('theme') || 'dark';
                document.documentElement.setAttribute('data-theme', savedTheme);
                const themeToggle = document.getElementById('themeToggle');
                themeToggle.querySelector('i').className = savedTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
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
                document.getElementById('sidebarToggle').addEventListener('click', () => this.toggleSidebar());
                document.getElementById('themeToggle').addEventListener('click', () => this.toggleTheme());
                document.getElementById('mobileOverlay').addEventListener('click', () => this.closeMobileSidebar());
                window.addEventListener('resize', () => this.handleResize());
                
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

                // Auto-save draft
                this.setupAutoSave();
                this.setupTouchGestures();
            }

            setupTouchGestures() {
                let startX;
                document.addEventListener('touchstart', (e) => startX = e.touches[0].clientX);
                document.addEventListener('touchend', (e) => {
                    if (!startX) return;
                    const endX = e.changedTouches[0].clientX;
                    const diffX = startX - endX;
                    if (Math.abs(diffX) > 50) {
                        if (diffX > 0) this.closeMobileSidebar();
                        else if (this.isMobile) this.openMobileSidebar();
                    }
                    startX = null;
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

            loadData() {
                // Load projects
                const storedProjects = localStorage.getItem('judgeProjects');
                if (storedProjects) {
                    this.projects = JSON.parse(storedProjects);
                } else {
                    this.projects = this.getMockProjects();
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
                    { id: 1, name: 'DeFi Portfolio Tracker', team: 'Blockchain Innovators', avatar: 'DP' },
                    { id: 2, name: 'AI Healthcare Assistant', team: 'MedTech Solutions', avatar: 'AH' },
                    { id: 3, name: 'Smart City Dashboard', team: 'Urban Tech', avatar: 'SC' },
                    { id: 4, name: 'Green Energy Monitor', team: 'EcoTech', avatar: 'GE' },
                    { id: 5, name: 'Social Impact Platform', team: 'Change Makers', avatar: 'SI' }
                ];
            }

            getMockFeedback() {
                return [
                    {
                        id: 1,
                        project: 'DeFi Portfolio Tracker',
                        subject: 'Excellent technical implementation',
                        content: 'Outstanding work on the smart contract architecture...',
                        status: 'sent',
                        timestamp: Date.now() - 3600000
                    },
                    {
                        id: 2,
                        project: 'AI Healthcare Assistant',
                        subject: 'Great UX design, needs performance optimization',
                        content: 'The user interface is intuitive and well-designed...',
                        status: 'draft',
                        timestamp: Date.now() - 7200000
                    }
                ];
            }

            getMockTemplates() {
                return [
                    {
                        id: 1,
                        name: 'Technical Feedback',
                        description: 'Template for technical implementation feedback'
                    },
                    {
                        id: 2,
                        name: 'UX/UI Review',
                        description: 'Template for design and user experience feedback'
                    },
                    {
                        id: 3,
                        name: 'Business Viability',
                        description: 'Template for market potential and business model feedback'
                    },
                    {
                        id: 4,
                        name: 'Innovation Assessment',
                        description: 'Template for evaluating innovation and creativity'
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
                            <span class="status-badge ${feedback.status}">${feedback.status}</span>
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
                this.showToast(`Selected project: ${project.name}`, 'success');
            }

            selectCategory(categoryId) {
                this.selectedCategory = categoryId;
                
                // Update visual selection
                document.querySelectorAll('.category-item').forEach(item => {
                    item.classList.remove('selected');
                });
                event.target.closest('.category-item').classList.add('selected');

                this.showToast(`Selected category: ${categoryId}`, 'success');
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
            }

            useTemplate(templateId) {
                const template = this.templates.find(t => t.id === templateId);
                
                const templateContent = {
                    1: `Technical Implementation Review:

Strengths:
• Clean and well-structured codebase
• Proper use of design patterns
• Good documentation and comments

Areas for Improvement:
• Consider implementing error handling for edge cases
• Optimize database queries for better performance
• Add unit tests for core functionality

Recommendations:
• Review code for security vulnerabilities
• Consider scalability factors for production deployment
• Implement logging for better debugging`,
                    
                    2: `UX/UI Design Assessment:

Strengths:
• Intuitive user interface design
• Consistent visual hierarchy and branding
• Responsive design works well across devices

Areas for Improvement:
• Some navigation elements could be more prominent
• Loading states need better visual feedback
• Consider accessibility improvements for screen readers

Recommendations:
• Conduct user testing to validate design decisions
• Implement keyboard navigation support
• Add micro-interactions to improve user engagement`,
                    
                    3: `Business Viability Analysis:

Strengths:
• Clear value proposition and target market
• Solid understanding of customer pain points
• Realistic revenue model and pricing strategy

Areas for Improvement:
• Market analysis could be more comprehensive
• Competitive landscape needs deeper research
• Financial projections require validation

Recommendations:
• Conduct market validation through customer interviews
• Develop a go-to-market strategy
• Consider partnership opportunities for growth`,
                    
                    4: `Innovation and Creativity Assessment:

Strengths:
• Novel approach to solving the problem
• Creative use of emerging technologies
• Unique features that differentiate from competitors

Areas for Improvement:
• Some innovative features need better user onboarding
• Technical complexity might hinder adoption
• Innovation should align with user needs

Recommendations:
• Simplify complex features for better usability
• Create educational content to help users understand benefits
• Iterate on innovative features based on user feedback`
                };

                document.getElementById('feedbackSubject').value = template.name + ' - ' + (this.selectedProject ? this.projects.find(p => p.id === this.selectedProject).name : 'Project Name');
                document.getElementById('feedbackContent').value = templateContent[templateId] || template.description;
                
                this.showToast(`Template "${template.name}" loaded`, 'success');
            }

            submitFeedback() {
                const subject = document.getElementById('feedbackSubject').value.trim();
                const content = document.getElementById('feedbackContent').value.trim();
                const priority = document.getElementById('feedbackPriority').value;

                // Validation
                if (!this.selectedProject) {
                    this.showToast('Please select a project first', 'warning');
                    return;
                }

                if (!subject || subject.length < 5) {
                    this.showToast('Please enter a subject (minimum 5 characters)', 'warning');
                    return;
                }

                if (!content || content.length < 50) {
                    this.showToast('Please enter feedback content (minimum 50 characters)', 'warning');
                    return;
                }

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
                    author: this.currentUser.name
                };

                // Save feedback
                this.feedback.unshift(newFeedback);
                localStorage.setItem('judgeFeedback', JSON.stringify(this.feedback));

                // Clear form
                this.resetForm();

                // Update UI
                this.renderRecentFeedback();

                this.showToast('Feedback sent successfully!', 'success');
            }

            saveDraft() {
                const subject = document.getElementById('feedbackSubject').value.trim();
                const content = document.getElementById('feedbackContent').value.trim();
                const priority = document.getElementById('feedbackPriority').value;

                if (!this.selectedProject || !subject || !content) {
                    this.showToast('Please fill in all required fields before saving', 'warning');
                    return;
                }

                const draft = {
                    id: Date.now(),
                    project: this.projects.find(p => p.id === this.selectedProject).name,
                    subject: subject,
                    content: content,
                    category: this.selectedCategory || 'general',
                    priority: priority,
                    status: 'draft',
                    timestamp: Date.now(),
                    author: this.currentUser.name
                };

                this.feedback.unshift(draft);
                localStorage.setItem('judgeFeedback', JSON.stringify(this.feedback));
                this.renderRecentFeedback();

                this.showToast('Feedback saved as draft!', 'success');
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

                        this.showToast('Draft loaded from previous session', 'info');
                    }
                }
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

            showToast(message, type = 'success') {
                const existingToast = document.querySelector('.toast');
                if (existingToast) existingToast.remove();
                
                const toast = document.createElement('div');
                toast.className = `toast ${type}`;
                toast.style.cssText = `
                    position: fixed; top: 2rem; right: 2rem; padding: 1rem 1.5rem;
                    border-radius: 12px; color: white; font-weight: 500; z-index: 10001;
                    animation: slideInToast 0.3s ease-out; max-width: 350px;
                    box-shadow: var(--shadow-lg); background: var(--gradient-${type});
                `;
                
                if (window.innerWidth <= 768) {
                    toast.style.top = '1rem'; toast.style.right = '1rem';
                    toast.style.left = '1rem'; toast.style.maxWidth = 'none';
                }
                
                toast.innerHTML = `<i class="fas ${this.getToastIcon(type)}"></i><span style="margin-left: 0.5rem;">${message}</span>`;
                document.body.appendChild(toast);
                setTimeout(() => { if (toast.parentNode) toast.remove(); }, 4000);
            }

            getToastIcon(type) {
                const icons = {
                    success: 'fa-check-circle', error: 'fa-exclamation-circle',
                    info: 'fa-info-circle', warning: 'fa-exclamation-triangle'
                };
                return icons[type] || 'fa-check-circle';
            }
        }

        // Global functions and initialization
        let feedbackManager;

        function saveDraft() { feedbackManager.saveDraft(); }
        function openTemplates() { feedbackManager.showToast('Opening templates panel...', 'info'); }
        function exportFeedback() { feedbackManager.showToast('Exporting feedback data...', 'info'); }
        function backToDashboard() { window.location.href = 'dashboard.html'; }

        document.addEventListener('DOMContentLoaded', () => {
            feedbackManager = new FeedbackManager();
            
            // Add entrance animations
            setTimeout(() => {
                document.querySelectorAll('.category-item').forEach((item, index) => {
                    setTimeout(() => {
                        item.style.opacity = '0';
                        item.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0)';
                        }, 100);
                    }, index * 100);
                });
            }, 1000);

            // Performance optimization for mobile
            if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                document.body.classList.add('mobile-device');
                const style = document.createElement('style');
                style.textContent = `.mobile-device * { animation-duration: 0.1s !important; transition-duration: 0.1s !important; }`;
                document.head.appendChild(style);
            }
        });

        // Animations
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
            .project-item, .category-item, .feedback-item, .template-item, .stat-card { transition: var(--transition) !important; }
            @media (hover: hover) and (pointer: fine) {
                .project-item:hover, .category-item:hover, .feedback-item:hover, .template-item:hover {
                    transform: translateY(-2px) !important;
                }
                .stat-card:hover { transform: translateY(-4px) !important; }
            }
            *:focus-visible { outline: 2px solid var(--primary) !important; outline-offset: 2px !important; }
        `;
        document.head.appendChild(style);
