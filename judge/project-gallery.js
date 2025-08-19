// ADVANCED PROJECT GALLERY SYSTEM
        class ProjectGallery {
            constructor() {
                this.projects = [];
                this.filteredProjects = [];
                this.currentPage = 1;
                this.projectsPerPage = 12;
                this.viewMode = 'grid';
                this.isMobile = window.innerWidth <= 1024;
                this.currentUser = { name: 'Dr. Jane Smith', initials: 'JS', role: 'Senior Judge', id: 'judge_001' };
                this.init();
            }

            init() {
                this.initializeTheme();
                this.setupEventListeners();
                this.loadProjectsData();
                this.renderProjects();
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
                
                // Filters
                document.getElementById('statusFilter').addEventListener('change', () => this.filterProjects());
                document.getElementById('categoryFilter').addEventListener('change', () => this.filterProjects());
                
                // Search
                const searchInput = document.getElementById('searchInput');
                let searchTimeout;
                searchInput.addEventListener('input', (e) => {
                    clearTimeout(searchTimeout);
                    searchTimeout = setTimeout(() => this.searchProjects(e.target.value), 300);
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
                return Array.from({ length: 47 }, (_, index) => ({
                    id: index + 1,
                    title: this.getProjectTitle(index),
                    team: this.getTeamName(index),
                    description: this.getProjectDescription(index),
                    category: this.getCategory(index),
                    status: this.getStatus(index),
                    score: Math.floor(Math.random() * 10) + 1,
                    submittedAt: now - (Math.random() * 7 * 24 * 60 * 60 * 1000),
                    tags: this.getTags(index),
                    teamSize: Math.floor(Math.random() * 5) + 2,
                    githubUrl: `https://github.com/team${index + 1}/project`,
                    demoUrl: `https://demo-project${index + 1}.vercel.app`,
                    evaluated: Math.random() > 0.3
                }));
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
                    'Cloud Architects', 'DevOps Champions', 'Product Innovators'
                ];
                return teams[index % teams.length];
            }

            getProjectDescription(index) {
                const descriptions = [
                    'A comprehensive solution that leverages cutting-edge technology to solve real-world problems.',
                    'An innovative platform designed to improve user experience and drive social impact.',
                    'Advanced system utilizing AI and machine learning for better decision making.',
                    'Mobile-first application focused on accessibility and user engagement.',
                    'Blockchain-based solution ensuring transparency and security.',
                    'IoT-enabled platform for smart monitoring and automation.',
                    'Web3 application revolutionizing digital interactions.',
                    'AR/VR experience creating immersive user journeys.',
                    'Data analytics platform providing actionable insights.',
                    'Community-driven application fostering collaboration.'
                ];
                return descriptions[index % descriptions.length];
            }

            getCategory(index) {
                const categories = ['web3', 'ai', 'mobile', 'iot', 'fintech'];
                return categories[index % categories.length];
            }

            getStatus(index) {
                const statuses = ['submitted', 'evaluated', 'pending'];
                return statuses[index % statuses.length];
            }

            getTags(index) {
                const allTags = ['React', 'Node.js', 'Python', 'AI/ML', 'Blockchain', 'IoT', 'Mobile', 'Web3', 'DeFi', 'NFT', 'AR/VR', 'Cloud', 'Security', 'Analytics'];
                const numTags = Math.floor(Math.random() * 4) + 2;
                return Array.from({ length: numTags }, () => allTags[Math.floor(Math.random() * allTags.length)])
                    .filter((tag, index, arr) => arr.indexOf(tag) === index);
            }

            saveProjects() {
                localStorage.setItem('judgeProjects', JSON.stringify(this.projects));
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
            }

            searchProjects(searchTerm) {
                this.filterProjects();
            }

            switchView(view) {
                this.viewMode = view;
                document.querySelectorAll('.view-btn').forEach(btn => btn.classList.remove('active'));
                document.querySelector(`[data-view="${view}"]`).classList.add('active');
                
                const grid = document.getElementById('projectsGrid');
                grid.className = `projects-grid ${view}-view`;
                
                this.renderProjects();
                this.showToast(`Switched to ${view} view`, 'info');
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
                            </p>
                            <button class="btn btn-primary" onclick="clearFilters()">
                                <i class="fas fa-refresh"></i>Clear Filters
                            </button>
                        </div>
                    `;
                    return;
                }

                container.innerHTML = '';
                projectsToShow.forEach(project => {
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
                                <span class="score-value">${Math.floor(Math.random() * 50) + 10}</span>
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
                for (let i = 1; i <= Math.min(totalPages, 5); i++) {
                    paginationHTML += `
                        <button class="pagination-btn ${i === this.currentPage ? 'active' : ''}"
                                onclick="changePage(${i})">${i}</button>
                    `;
                }

                if (totalPages > 5) {
                    paginationHTML += '<span class="pagination-btn disabled">...</span>';
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
                localStorage.setItem('viewProjectId', projectId);
                this.showToast(`Loading project details...`, 'info');
                setTimeout(() => window.location.href = 'evaluation.html', 1000);
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
        let projectGallery;

        function switchView(view) { projectGallery.switchView(view); }
        function changePage(page) { projectGallery.changePage(page); }
        function startEvaluation(projectId) { 
            localStorage.setItem('evaluateProjectId', projectId);
            projectGallery.showToast('Starting evaluation...', 'info');
            setTimeout(() => window.location.href = 'evaluation.html', 1000);
        }
        function viewEvaluation(projectId) { projectGallery.showToast(`Viewing evaluation for project ${projectId}...`, 'info'); }
        function openProject(projectId) { projectGallery.showToast(`Opening project ${projectId}...`, 'info'); }
        function clearFilters() {
            document.getElementById('statusFilter').value = 'all';
            document.getElementById('categoryFilter').value = 'all';
            document.getElementById('searchInput').value = '';
            projectGallery.filterProjects();
            projectGallery.showToast('Filters cleared!', 'success');
        }
        function exportProjects() { projectGallery.showToast('Exporting projects...', 'info'); }
        function refreshGallery() { 
            projectGallery.loadProjectsData(); 
            projectGallery.renderProjects(); 
            projectGallery.showToast('Gallery refreshed!', 'success'); 
        }
        function backToDashboard() { window.location.href = 'dashboard.html'; }

        document.addEventListener('DOMContentLoaded', () => {
            projectGallery = new ProjectGallery();
            
            // Animate cards on load
            setTimeout(() => {
                document.querySelectorAll('.project-card').forEach((card, index) => {
                    setTimeout(() => {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 100);
                    }, index * 50);
                });
            }, 500);

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
            .project-card, .stat-card { transition: var(--transition) !important; }
            @media (hover: hover) and (pointer: fine) {
                .project-card:hover { transform: translateY(-8px) !important; }
                .stat-card:hover { transform: translateY(-4px) !important; }
            }
            *:focus-visible { outline: 2px solid var(--primary) !important; outline-offset: 2px !important; }
        `;
        document.head.appendChild(style);
