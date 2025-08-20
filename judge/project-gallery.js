class ProjectGallery {
            constructor() {
                this.projects = [];
                this.filteredProjects = [];
                this.currentPage = 1;
                this.projectsPerPage = 12;
                this.viewMode = 'grid';
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
                this.loadProjectsData();
                this.renderProjects();
                this.updateStats();
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
                
                // Filters and search
                document.getElementById('statusFilter').addEventListener('change', () => this.filterProjects());
                document.getElementById('categoryFilter').addEventListener('change', () => this.filterProjects());
                
                const searchInput = document.getElementById('searchInput');
                let searchTimeout;
                searchInput.addEventListener('input', (e) => {
                    clearTimeout(searchTimeout);
                    searchTimeout = setTimeout(() => this.searchProjects(e.target.value), 300);
                });

                // Keyboard shortcuts
                document.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape') {
                        this.closeMobileSidebar();
                    }
                    if (e.ctrlKey || e.metaKey) {
                        switch(e.key) {
                            case 'f':
                                e.preventDefault();
                                document.getElementById('searchInput').focus();
                                break;
                            case 'r':
                                e.preventDefault();
                                this.refreshGallery();
                                break;
                        }
                    }
                });

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

            loadProjectsData() {
                const storedProjects = localStorage.getItem('judgeProjects');
                if (storedProjects) {
                    this.projects = JSON.parse(storedProjects);
                } else {
                    this.projects = this.getMockProjects();
                    this.saveProjects();
                }
                this.filteredProjects = [...this.projects];
            }

            getMockProjects() {
                const now = Date.now();
                const projects = [];
                
                for (let i = 0; i < 47; i++) {
                    projects.push({
                        id: i + 1,
                        title: this.getProjectTitle(i),
                        team: this.getTeamName(i),
                        description: this.getProjectDescription(i),
                        category: this.getCategory(i),
                        status: this.getStatus(i),
                        score: Math.floor(Math.random() * 10) + 1,
                        submittedAt: now - (Math.random() * 7 * 24 * 60 * 60 * 1000),
                        tags: this.getTags(i),
                        teamSize: Math.floor(Math.random() * 5) + 2,
                        githubUrl: `https://github.com/team${i + 1}/project`,
                        demoUrl: `https://demo-project${i + 1}.vercel.app`,
                        evaluated: Math.random() > 0.3,
                        views: Math.floor(Math.random() * 100) + 10,
                        likes: Math.floor(Math.random() * 50) + 5
                    });
                }
                
                return projects;
            }

            getProjectTitle(index) {
                const titles = [
                    'DeFi Portfolio Tracker', 'AI-Powered Healthcare Assistant', 'Sustainable Energy Monitor',
                    'Social Impact Platform', 'Blockchain Voting System', 'Smart City Dashboard',
                    'Mental Health Companion', 'Climate Change Tracker', 'Educational AR App',
                    'Community Marketplace', 'Supply Chain Analyzer', 'Fitness Gamification',
                    'Digital Identity Platform', 'Green Energy Optimizer', 'Medical Record System',
                    'Virtual Event Platform', 'Productivity AI Assistant', 'Urban Planning Tool',
                    'Financial Literacy App', 'Disaster Response System', 'Language Learning VR',
                    'Agricultural IoT Solution', 'Music Collaboration Platform', 'Space Data Visualizer',
                    'Accessibility Helper', 'Renewable Energy Tracker', 'Smart Home Controller',
                    'Telemedicine Platform', 'Carbon Footprint Calculator', 'Wildlife Conservation App',
                    'Remote Work Optimizer', 'Food Security Monitor', 'Digital Art Marketplace',
                    'Transportation Planner', 'Water Quality Tracker', 'Community Safety Net',
                    'Educational Game Engine', 'Healthcare Data Analytics', 'Environmental Monitor',
                    'Social Commerce Platform', 'Smart Waste Management', 'Digital Wellness Tracker',
                    'Renewable Energy Grid', 'Mental Health Analytics', 'Agricultural Assistant',
                    'Smart Transportation', 'Community Health Platform', 'Digital Innovation Hub'
                ];
                return titles[index % titles.length];
            }

            getTeamName(index) {
                const teams = [
                    'Blockchain Innovators', 'AI Pioneers', 'Green Tech Solutions', 'Social Impact Makers',
                    'Digital Creators', 'Future Builders', 'Tech for Good', 'Innovation Labs',
                    'Smart Solutions', 'Code Warriors', 'Data Scientists', 'UI/UX Masters',
                    'Full Stack Heroes', 'Machine Learning Experts', 'Cybersecurity Guardians',
                    'Cloud Architects', 'DevOps Champions', 'Product Innovators', 'Design Thinking Hub'
                ];
                return teams[index % teams.length];
            }

            getProjectDescription(index) {
                const descriptions = [
                    'A comprehensive solution that leverages cutting-edge technology to solve real-world problems with innovative approaches and user-centered design.',
                    'An innovative platform designed to improve user experience and drive social impact through advanced algorithms and intuitive interfaces.',
                    'Advanced system utilizing AI and machine learning for better decision making, predictive analytics, and automated optimization.',
                    'Mobile-first application focused on accessibility and user engagement with responsive design and cross-platform compatibility.',
                    'Blockchain-based solution ensuring transparency and security through decentralized architecture and smart contracts.',
                    'IoT-enabled platform for smart monitoring and automation with real-time data processing and remote control capabilities.',
                    'Web3 application revolutionizing digital interactions through decentralized protocols and community governance.',
                    'AR/VR experience creating immersive user journeys with spatial computing and interactive 3D environments.',
                    'Data analytics platform providing actionable insights through advanced visualization and predictive modeling.',
                    'Community-driven application fostering collaboration and knowledge sharing with social networking features.'
                ];
                return descriptions[index % descriptions.length];
            }

            getCategory(index) {
                const categories = ['web3', 'ai', 'mobile', 'iot', 'fintech'];
                return categories[index % categories.length];
            }

            getStatus(index) {
                const statuses = ['submitted', 'evaluated', 'pending'];
                const weights = [0.4, 0.35, 0.25]; // More submitted, fewer pending
                let random = Math.random();
                let cumulativeWeight = 0;
                
                for (let i = 0; i < statuses.length; i++) {
                    cumulativeWeight += weights[i];
                    if (random <= cumulativeWeight) {
                        return statuses[i];
                    }
                }
                return statuses[0];
            }

            getTags(index) {
                const allTags = [
                    'React', 'Node.js', 'Python', 'AI/ML', 'Blockchain', 'IoT', 'Mobile', 
                    'Web3', 'DeFi', 'NFT', 'AR/VR', 'Cloud', 'Security', 'Analytics',
                    'TypeScript', 'MongoDB', 'PostgreSQL', 'Docker', 'Kubernetes',
                    'GraphQL', 'REST API', 'Microservices', 'Flutter', 'React Native'
                ];
                const numTags = Math.floor(Math.random() * 4) + 2;
                const shuffled = [...allTags].sort(() => 0.5 - Math.random());
                return shuffled.slice(0, numTags);
            }

            saveProjects() {
                localStorage.setItem('judgeProjects', JSON.stringify(this.projects));
            }

            updateStats() {
                const totalProjects = this.projects.length;
                const evaluatedProjects = this.projects.filter(p => p.evaluated).length;
                const pendingProjects = this.projects.filter(p => p.status === 'pending').length;
                const averageScore = this.projects
                    .filter(p => p.evaluated)
                    .reduce((sum, p) => sum + p.score, 0) / evaluatedProjects;

                document.getElementById('totalProjects').textContent = totalProjects;
                document.getElementById('evaluatedProjects').textContent = evaluatedProjects;
                document.getElementById('pendingProjects').textContent = pendingProjects;
                document.getElementById('averageScore').textContent = averageScore.toFixed(1);
            }

            filterProjects() {
                const statusFilter = document.getElementById('statusFilter').value;
                const categoryFilter = document.getElementById('categoryFilter').value;
                const searchTerm = document.getElementById('searchInput').value.toLowerCase();

                this.filteredProjects = this.projects.filter(project => {
                    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
                    const matchesCategory = categoryFilter === 'all' || project.category === categoryFilter;
                    const matchesSearch = !searchTerm || 
                        project.title.toLowerCase().includes(searchTerm) ||
                        project.team.toLowerCase().includes(searchTerm) ||
                        project.description.toLowerCase().includes(searchTerm) ||
                        project.tags.some(tag => tag.toLowerCase().includes(searchTerm));
                    
                    return matchesStatus && matchesCategory && matchesSearch;
                });

                this.currentPage = 1;
                this.renderProjects();
                this.renderPagination();
                
                this.showToast(`Found ${this.filteredProjects.length} projects`, 'info');
            }

            searchProjects(searchTerm) {
                this.filterProjects();
            }

            // ✅ REALISTIC VIEW SWITCH
            switchView(view) {
                this.viewMode = view;
                document.querySelectorAll('.view-btn').forEach(btn => btn.classList.remove('active'));
                document.querySelector(`[data-view="${view}"]`).classList.add('active');
                
                const grid = document.getElementById('projectsGrid');
                grid.className = `projects-grid ${view}-view`;
                
                this.renderProjects();
                this.showToast(`📱 Switched to ${view} view`, 'info');
            }

            renderProjects() {
                const container = document.getElementById('projectsGrid');
                const startIndex = (this.currentPage - 1) * this.projectsPerPage;
                const endIndex = startIndex + this.projectsPerPage;
                const projectsToShow = this.filteredProjects.slice(startIndex, endIndex);

                if (projectsToShow.length === 0) {
                    container.innerHTML = `
                        <div class="empty-state" style="grid-column: 1 / -1;">
                            <div class="empty-icon"><i class="fas fa-search"></i></div>
                            <h3 class="empty-title">No projects found</h3>
                            <p class="empty-description">
                                Try adjusting your filters or search terms to find the projects you're looking for.
                                Check status filters, categories, or try broader search keywords.
                            </p>
                            <button class="btn btn-primary" onclick="clearFilters()">
                                <i class="fas fa-refresh"></i>Clear Filters
                            </button>
                        </div>
                    `;
                    return;
                }

                container.innerHTML = '';
                projectsToShow.forEach((project, index) => {
                    const projectCard = document.createElement('div');
                    projectCard.className = 'project-card';
                    projectCard.onclick = () => this.openProjectDetails(project.id);

                    projectCard.innerHTML = `
                        <div class="project-status ${project.status}">${project.status}</div>
                        <div class="project-header">
                            <div class="project-avatar">
                                <i class="fas ${this.getCategoryIcon(project.category)}"></i>
                            </div>
                            <div class="project-details">
                                <h3 class="project-title">${project.title}</h3>
                                <div class="project-team">${project.team}</div>
                                <div class="project-meta">
                                    <span><i class="fas fa-users"></i> ${project.teamSize} members</span>
                                    <span><i class="fas fa-clock"></i> ${this.formatDate(project.submittedAt)}</span>
                                    <span><i class="fas fa-tag"></i> ${this.getCategoryName(project.category)}</span>
                                </div>
                            </div>
                        </div>
                        <p class="project-description">${project.description}</p>
                        <div class="project-tags">
                            ${project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
                        </div>
                        <div class="project-score">
                            <div class="score-item">
                                <span class="score-value">${project.evaluated ? project.score.toFixed(1) : '—'}</span>
                                <span class="score-label">Score</span>
                            </div>
                            <div class="score-item">
                                <span class="score-value">${project.evaluated ? '✓' : '○'}</span>
                                <span class="score-label">Evaluated</span>
                            </div>
                            <div class="score-item">
                                <span class="score-value">${project.views}</span>
                                <span class="score-label">Views</span>
                            </div>
                        </div>
                        <div class="project-actions">
                            ${this.getProjectActions(project)}
                        </div>
                    `;

                    container.appendChild(projectCard);
                });

                this.renderPagination();
            }

            getCategoryIcon(category) {
                const icons = {
                    web3: 'fa-cube',
                    ai: 'fa-brain',
                    mobile: 'fa-mobile-alt',
                    iot: 'fa-microchip',
                    fintech: 'fa-coins'
                };
                return icons[category] || 'fa-folder';
            }

            getCategoryName(category) {
                const names = {
                    web3: 'Web3',
                    ai: 'AI & ML',
                    mobile: 'Mobile',
                    iot: 'IoT',
                    fintech: 'Fintech'
                };
                return names[category] || 'Other';
            }

            getProjectActions(project) {
                if (project.evaluated) {
                    return `
                        <button class="btn btn-primary" onclick="viewEvaluation(${project.id})">
                            <i class="fas fa-eye"></i>View Evaluation
                        </button>
                        <button class="btn btn-secondary" onclick="openProject(${project.id})">
                            <i class="fas fa-external-link-alt"></i>Open Project
                        </button>
                    `;
                } else {
                    return `
                        <button class="btn btn-success" onclick="startEvaluation(${project.id})">
                            <i class="fas fa-play"></i>Start Evaluation
                        </button>
                        <button class="btn btn-secondary" onclick="openProject(${project.id})">
                            <i class="fas fa-external-link-alt"></i>Preview
                        </button>
                    `;
                }
            }

            formatDate(timestamp) {
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

            renderPagination() {
                const totalPages = Math.ceil(this.filteredProjects.length / this.projectsPerPage);
                const pagination = document.getElementById('pagination');
                
                if (totalPages <= 1) {
                    pagination.innerHTML = '';
                    return;
                }

                let paginationHTML = '';
                
                // Previous button
                paginationHTML += `
                    <button class="pagination-btn" onclick="changePage(${this.currentPage - 1})" 
                            ${this.currentPage === 1 ? 'disabled' : ''}>
                        <i class="fas fa-chevron-left"></i>
                    </button>
                `;

                // Page numbers
                const startPage = Math.max(1, this.currentPage - 2);
                const endPage = Math.min(totalPages, startPage + 4);

                for (let i = startPage; i <= endPage; i++) {
                    paginationHTML += `
                        <button class="pagination-btn ${i === this.currentPage ? 'active' : ''}"
                                onclick="changePage(${i})">${i}</button>
                    `;
                }

                if (endPage < totalPages) {
                    if (endPage < totalPages - 1) {
                        paginationHTML += '<span class="pagination-btn disabled">...</span>';
                    }
                    paginationHTML += `
                        <button class="pagination-btn ${totalPages === this.currentPage ? 'active' : ''}"
                                onclick="changePage(${totalPages})">${totalPages}</button>
                    `;
                }

                // Next button
                paginationHTML += `
                    <button class="pagination-btn" onclick="changePage(${this.currentPage + 1})" 
                            ${this.currentPage === totalPages ? 'disabled' : ''}>
                        <i class="fas fa-chevron-right"></i>
                    </button>
                `;

                pagination.innerHTML = paginationHTML;
            }

            changePage(page) {
                const totalPages = Math.ceil(this.filteredProjects.length / this.projectsPerPage);
                if (page < 1 || page > totalPages) return;
                
                this.currentPage = page;
                this.renderProjects();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }

            openProjectDetails(projectId) {
                const project = this.projects.find(p => p.id === projectId);
                localStorage.setItem('viewProjectId', projectId);
                this.showToast(`🔍 Loading ${project.title}...`, 'info');
                
                this.showLoader();
                setTimeout(() => {
                    this.completeLoader();
                    window.location.href = 'evaluation.html';
                }, 1500);
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
        let projectGallery;

        function switchView(view) { projectGallery.switchView(view); }
        function changePage(page) { projectGallery.changePage(page); }

        // ✅ REALISTIC BUTTON FUNCTIONS
        function startEvaluation(projectId) {
            const project = projectGallery.projects.find(p => p.id === projectId);
            localStorage.setItem('evaluateProjectId', projectId);
            
            projectGallery.showLoader();
            projectGallery.showToast(`🚀 Starting evaluation for ${project.title}...`, 'info');
            
            setTimeout(() => {
                projectGallery.completeLoader();
                window.location.href = 'evaluation.html';
            }, 2000);
        }

        function viewEvaluation(projectId) {
            const project = projectGallery.projects.find(p => p.id === projectId);
            projectGallery.showLoader();
            projectGallery.showToast(`📊 Loading evaluation report for ${project.title}...`, 'info');
            
            setTimeout(() => {
                projectGallery.completeLoader();
                // Create evaluation summary modal
                const modal = document.createElement('div');
                modal.style.cssText = `
                    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                    background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center;
                    z-index: 10000; backdrop-filter: blur(15px);
                `;
                
                modal.innerHTML = `
                    <div style="background: var(--bg-card); border-radius: 20px; padding: 2.5rem; max-width: 600px; width: 90%; text-align: center;">
                        <div style="font-size: 3rem; margin-bottom: 1rem;">📊</div>
                        <h3 style="margin-bottom: 1rem; color: var(--text-primary);">${project.title}</h3>
                        <div style="background: var(--bg-glass); padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem;">
                            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem;">
                                <div><strong>Score:</strong> ${project.score.toFixed(1)}/10</div>
                                <div><strong>Status:</strong> ${project.status}</div>
                                <div><strong>Views:</strong> ${project.views}</div>
                            </div>
                        </div>
                        <p style="margin-bottom: 2rem; color: var(--text-secondary);">
                            Detailed evaluation completed with comprehensive scoring across all criteria.
                        </p>
                        <button onclick="this.closest('div').remove()" 
                            style="padding: 0.75rem 1.5rem; border: none; border-radius: 8px; 
                            background: var(--gradient-gallery); color: white; cursor: pointer;">Close</button>
                    </div>
                `;
                
                document.body.appendChild(modal);
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) modal.remove();
                });
            }, 1500);
        }

        function openProject(projectId) {
            const project = projectGallery.projects.find(p => p.id === projectId);
            projectGallery.showLoader();
            projectGallery.showToast(`🌐 Opening ${project.title} project demo...`, 'info');
            
            setTimeout(() => {
                projectGallery.completeLoader();
                window.open(project.demoUrl, '_blank');
            }, 1000);
        }

        function clearFilters() {
            document.getElementById('statusFilter').value = 'all';
            document.getElementById('categoryFilter').value = 'all';
            document.getElementById('searchInput').value = '';
            projectGallery.filterProjects();
            projectGallery.showToast('🔄 Filters cleared! Showing all projects.', 'success');
        }

        function exportProjects() {
            projectGallery.showLoader();
            
            setTimeout(() => {
                const exportData = {
                    nexusHackProjects: {
                        platform: 'NexusHack Professional',
                        version: '2.0',
                        exportedBy: projectGallery.currentUser.name,
                        exportedAt: new Date().toISOString(),
                        totalProjects: projectGallery.projects.length,
                        filteredProjects: projectGallery.filteredProjects.length,
                        projects: projectGallery.filteredProjects,
                        statistics: {
                            totalSubmissions: projectGallery.projects.length,
                            evaluatedProjects: projectGallery.projects.filter(p => p.evaluated).length,
                            pendingProjects: projectGallery.projects.filter(p => p.status === 'pending').length,
                            averageScore: projectGallery.projects
                                .filter(p => p.evaluated)
                                .reduce((sum, p) => sum + p.score, 0) / 
                                projectGallery.projects.filter(p => p.evaluated).length,
                            categories: {
                                web3: projectGallery.projects.filter(p => p.category === 'web3').length,
                                ai: projectGallery.projects.filter(p => p.category === 'ai').length,
                                mobile: projectGallery.projects.filter(p => p.category === 'mobile').length,
                                iot: projectGallery.projects.filter(p => p.category === 'iot').length,
                                fintech: projectGallery.projects.filter(p => p.category === 'fintech').length
                            }
                        }
                    }
                };

                const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `nexushack-projects-${new Date().toISOString().split('T')[0]}.json`;
                a.style.display = 'none';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                
                projectGallery.completeLoader();
                projectGallery.showToast('📥 Project data exported with complete statistics and metadata!', 'success');
            }, 2500);
        }

        function refreshGallery() {
            projectGallery.showLoader();
            projectGallery.showToast('🔄 Refreshing project gallery...', 'info');
            
            setTimeout(() => {
                projectGallery.loadProjectsData();
                projectGallery.renderProjects();
                projectGallery.updateStats();
                projectGallery.completeLoader();
                projectGallery.showToast('✅ Gallery refreshed with latest project data!', 'success');
            }, 2000);
        }

        function backToDashboard() {
            projectGallery.showToast('🏠 Returning to main dashboard...', 'info');
            projectGallery.showLoader();
            
            setTimeout(() => {
                projectGallery.completeLoader();
                window.location.href = 'dashboard.html';
            }, 1000);
        }

        // Initialize the application
        document.addEventListener('DOMContentLoaded', () => {
            projectGallery = new ProjectGallery();
            
            // Add entrance animations
            setTimeout(() => {
                document.querySelectorAll('.project-card').forEach((card, index) => {
                    setTimeout(() => {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(30px)';
                        setTimeout(() => {
                            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 100);
                    }, index * 50);
                });
            }, 500);

            // Stat card animations
            setTimeout(() => {
                document.querySelectorAll('.stat-card').forEach((card, index) => {
                    setTimeout(() => {
                        card.style.opacity = '0';
                        card.style.transform = 'scale(0.9)';
                        setTimeout(() => {
                            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, 100);
                    }, index * 150);
                });
            }, 200);

            // Performance optimization for mobile
            if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                document.body.classList.add('mobile-device');
            }

            // Welcome message
            setTimeout(() => {
                projectGallery.showToast('🖼️ Project Gallery loaded! Advanced filtering and evaluation tools ready for professional assessment.', 'success');
            }, 2500);
        });

        // Enhanced animations
        const style = document.createElement('style');
        style.textContent = `
            .project-card, .stat-card { transition: var(--transition) !important; }
            
            @media (hover: hover) and (pointer: fine) {
                .project-card:hover { 
                    transform: translateY(-8px) !important; 
                    box-shadow: var(--shadow-lg) !important;
                }
                .stat-card:hover { 
                    transform: translateY(-4px) !important; 
                    box-shadow: var(--shadow-md) !important;
                }
            }
            
            *:focus-visible { 
                outline: 2px solid var(--gallery-purple) !important; 
                outline-offset: 2px !important; 
            }
            
            /* Enhanced mobile optimizations */
            @media (max-width: 768px) {
                .projects-grid.grid-view {
                    grid-template-columns: 1fr !important;
                }
                
                .gallery-filters {
                    flex-direction: column !important;
                }
                
                .filter-group {
                    width: 100% !important;
                    justify-content: space-between !important;
                }
            }
        `;
        document.head.appendChild(style);