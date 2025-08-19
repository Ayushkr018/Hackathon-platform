// ADVANCED EVALUATION CRITERIA SYSTEM
        class CriteriaManager {
            constructor() {
                this.criteria = [];
                this.templates = [];
                this.editingIndex = -1;
                this.totalWeight = 0;
                this.isMobile = window.innerWidth <= 1024;
                this.currentUser = { name: 'Dr. Jane Smith', initials: 'JS', role: 'Senior Judge', id: 'judge_001' };
                this.init();
            }

            init() {
                this.initializeTheme();
                this.setupEventListeners();
                this.loadCriteria();
                this.loadTemplates();
                this.renderCriteria();
                this.renderTemplates();
                this.updateStats();
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
                
                // Weight slider
                const weightSlider = document.getElementById('criteriaWeight');
                weightSlider.addEventListener('input', (e) => {
                    document.getElementById('currentWeight').textContent = `${e.target.value}%`;
                });

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

            loadCriteria() {
                const savedCriteria = localStorage.getItem('evaluationCriteria');
                if (savedCriteria) {
                    this.criteria = JSON.parse(savedCriteria);
                } else {
                    // Default criteria
                    this.criteria = [
                        {
                            id: 1,
                            name: 'Innovation & Creativity',
                            description: 'Uniqueness of the solution, creative approach to problem-solving, and novel implementation ideas.',
                            weight: 25,
                            scale: 10
                        },
                        {
                            id: 2,
                            name: 'Technical Implementation',
                            description: 'Code quality, architecture design, use of appropriate technologies, and technical complexity.',
                            weight: 30,
                            scale: 10
                        },
                        {
                            id: 3,
                            name: 'User Experience & Design',
                            description: 'Interface design, usability, accessibility, and overall user experience quality.',
                            weight: 20,
                            scale: 10
                        },
                        {
                            id: 4,
                            name: 'Business Impact',
                            description: 'Market potential, scalability, real-world applicability, and business model viability.',
                            weight: 15,
                            scale: 10
                        },
                        {
                            id: 5,
                            name: 'Presentation & Demo',
                            description: 'Quality of project demonstration, clarity of explanation, and presentation skills.',
                            weight: 10,
                            scale: 10
                        }
                    ];
                    this.saveCriteriaData();
                }
                this.calculateTotalWeight();
            }

            loadTemplates() {
                this.templates = [
                    {
                        id: 1,
                        name: 'Web3 Hackathon',
                        description: 'Focused on blockchain and decentralized applications',
                        criteriaCount: 6,
                        criteria: [
                            { name: 'Innovation', weight: 25, description: 'Novel blockchain solutions' },
                            { name: 'Technical Implementation', weight: 25, description: 'Smart contract quality and security' },
                            { name: 'User Experience', weight: 20, description: 'DApp usability and design' },
                            { name: 'Tokenomics', weight: 15, description: 'Token utility and economics' },
                            { name: 'Market Potential', weight: 10, description: 'Real-world adoption potential' },
                            { name: 'Presentation', weight: 5, description: 'Demo quality and clarity' }
                        ]
                    },
                    {
                        id: 2,
                        name: 'AI/ML Competition',
                        description: 'Machine learning and artificial intelligence projects',
                        criteriaCount: 5,
                        criteria: [
                            { name: 'Algorithm Innovation', weight: 30, description: 'Novel ML approaches and techniques' },
                            { name: 'Data Quality & Processing', weight: 25, description: 'Data handling and preprocessing' },
                            { name: 'Model Performance', weight: 20, description: 'Accuracy, efficiency, and robustness' },
                            { name: 'Real-world Application', weight: 15, description: 'Practical use cases and impact' },
                            { name: 'Documentation & Reproducibility', weight: 10, description: 'Code quality and documentation' }
                        ]
                    },
                    {
                        id: 3,
                        name: 'General Hackathon',
                        description: 'Balanced criteria for diverse project types',
                        criteriaCount: 4,
                        criteria: [
                            { name: 'Innovation & Creativity', weight: 30, description: 'Originality and creative problem-solving' },
                            { name: 'Technical Excellence', weight: 30, description: 'Code quality and technical implementation' },
                            { name: 'User Impact', weight: 25, description: 'User value and market potential' },
                            { name: 'Execution & Presentation', weight: 15, description: 'Project completion and demo quality' }
                        ]
                    }
                ];
            }

            renderCriteria() {
                const container = document.getElementById('criteriaList');
                container.innerHTML = '';

                this.criteria.forEach((criteria, index) => {
                    const criteriaDiv = document.createElement('div');
                    criteriaDiv.className = 'criteria-item';
                    criteriaDiv.innerHTML = `
                        <div class="criteria-header">
                            <div class="criteria-name">${criteria.name}</div>
                            <div class="criteria-controls">
                                <button class="control-btn edit" onclick="editCriteria(${index})" title="Edit">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="control-btn delete" onclick="deleteCriteria(${index})" title="Delete">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                        <div class="criteria-description">${criteria.description}</div>
                        <div class="criteria-weight">
                            <span class="weight-label">Weight:</span>
                            <span class="weight-value">${criteria.weight}%</span>
                        </div>
                        <div class="criteria-scale">
                            <span class="scale-label">Score Scale:</span>
                            <span class="scale-value">1-${criteria.scale}</span>
                        </div>
                    `;
                    container.appendChild(criteriaDiv);
                });
            }

            renderTemplates() {
                const container = document.getElementById('templateSection');
                container.innerHTML = '';

                this.templates.forEach(template => {
                    const templateDiv = document.createElement('div');
                    templateDiv.className = 'template-item';
                    templateDiv.onclick = () => this.loadTemplate(template.id);
                    templateDiv.innerHTML = `
                        <div class="template-name">${template.name}</div>
                        <div class="template-description">${template.description}</div>
                        <div class="template-stats">
                            <span>${template.criteriaCount} criteria</span>
                            <span>100% weight</span>
                        </div>
                    `;
                    container.appendChild(templateDiv);
                });
            }

            addNewCriteria() {
                this.editingIndex = -1;
                this.clearForm();
                document.getElementById('criteriaForm').classList.add('active');
                document.getElementById('addCriteriaBtn').style.display = 'none';
                document.getElementById('criteriaName').focus();
            }

            editCriteria(index) {
                this.editingIndex = index;
                const criteria = this.criteria[index];
                
                document.getElementById('criteriaName').value = criteria.name;
                document.getElementById('criteriaDescription').value = criteria.description;
                document.getElementById('criteriaWeight').value = criteria.weight;
                document.getElementById('currentWeight').textContent = `${criteria.weight}%`;
                document.getElementById('criteriaScale').value = criteria.scale;
                
                document.getElementById('criteriaForm').classList.add('active');
                document.getElementById('addCriteriaBtn').style.display = 'none';
                
                // Highlight the editing item
                document.querySelectorAll('.criteria-item').forEach((item, i) => {
                    if (i === index) {
                        item.classList.add('editing');
                    } else {
                        item.classList.remove('editing');
                    }
                });
            }

            deleteCriteria(index) {
                if (confirm('Are you sure you want to delete this criteria? This action cannot be undone.')) {
                    this.criteria.splice(index, 1);
                    this.saveCriteriaData();
                    this.renderCriteria();
                    this.updateStats();
                    this.showToast('Criteria deleted successfully', 'success');
                }
            }

            saveCriteria() {
                const name = document.getElementById('criteriaName').value.trim();
                const description = document.getElementById('criteriaDescription').value.trim();
                const weight = parseInt(document.getElementById('criteriaWeight').value);
                const scale = parseInt(document.getElementById('criteriaScale').value);

                // Validation
                if (!name || name.length < 3) {
                    this.showToast('Please enter a criteria name (minimum 3 characters)', 'warning');
                    return;
                }

                if (!description || description.length < 10) {
                    this.showToast('Please enter a description (minimum 10 characters)', 'warning');
                    return;
                }

                // Check total weight
                const currentWeight = this.editingIndex >= 0 ? this.criteria[this.editingIndex].weight : 0;
                const newTotalWeight = this.totalWeight - currentWeight + weight;
                
                if (newTotalWeight > 100) {
                    this.showToast(`Total weight cannot exceed 100%. Current total would be ${newTotalWeight}%`, 'warning');
                    return;
                }

                const criteriaData = {
                    id: this.editingIndex >= 0 ? this.criteria[this.editingIndex].id : Date.now(),
                    name: name,
                    description: description,
                    weight: weight,
                    scale: scale
                };

                if (this.editingIndex >= 0) {
                    this.criteria[this.editingIndex] = criteriaData;
                    this.showToast('Criteria updated successfully', 'success');
                } else {
                    this.criteria.push(criteriaData);
                    this.showToast('Criteria added successfully', 'success');
                }

                this.saveCriteriaData();
                this.cancelEdit();
                this.renderCriteria();
                this.updateStats();
            }

            cancelEdit() {
                document.getElementById('criteriaForm').classList.remove('active');
                document.getElementById('addCriteriaBtn').style.display = 'inline-flex';
                document.querySelectorAll('.criteria-item').forEach(item => {
                    item.classList.remove('editing');
                });
                this.editingIndex = -1;
                this.clearForm();
            }

            clearForm() {
                document.getElementById('criteriaName').value = '';
                document.getElementById('criteriaDescription').value = '';
                document.getElementById('criteriaWeight').value = '20';
                document.getElementById('currentWeight').textContent = '20%';
                document.getElementById('criteriaScale').value = '10';
            }

            loadTemplate(templateId) {
                const template = this.templates.find(t => t.id === templateId);
                if (!template) return;

                if (confirm(`Load "${template.name}" template? This will replace all current criteria.`)) {
                    this.criteria = template.criteria.map((c, index) => ({
                        id: Date.now() + index,
                        name: c.name,
                        description: c.description,
                        weight: c.weight,
                        scale: 10
                    }));

                    this.saveCriteriaData();
                    this.renderCriteria();
                    this.updateStats();
                    this.showToast(`Template "${template.name}" loaded successfully`, 'success');
                }
            }

            calculateTotalWeight() {
                this.totalWeight = this.criteria.reduce((total, criteria) => total + criteria.weight, 0);
            }

            updateStats() {
                this.calculateTotalWeight();
                
                document.getElementById('totalCriteria').textContent = this.criteria.length;
                document.getElementById('totalWeight').textContent = `${this.totalWeight}%`;
                document.getElementById('maxScore').textContent = '10';
                document.getElementById('activeTemplates').textContent = this.templates.length;
                document.getElementById('weightDisplay').textContent = `Total: ${this.totalWeight}%`;

                // Update weight display color
                const weightDisplay = document.getElementById('weightDisplay');
                if (this.totalWeight === 100) {
                    weightDisplay.style.background = 'var(--gradient-success)';
                } else if (this.totalWeight > 100) {
                    weightDisplay.style.background = 'var(--gradient-danger)';
                } else {
                    weightDisplay.style.background = 'var(--gradient-warning)';
                }
            }

            saveCriteriaData() {
                localStorage.setItem('evaluationCriteria', JSON.stringify(this.criteria));
            }

            exportJSON() {
                const exportData = {
                    criteria: this.criteria,
                    metadata: {
                        totalCriteria: this.criteria.length,
                        totalWeight: this.totalWeight,
                        exportedBy: this.currentUser.name,
                        exportedAt: new Date().toISOString(),
                        version: '1.0'
                    }
                };

                const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
                this.downloadFile(blob, 'evaluation-criteria.json');
                this.showToast('Criteria exported as JSON', 'success');
            }

            exportPDF() {
                this.showToast('PDF export functionality would be implemented here', 'info');
            }

            exportCSV() {
                let csvContent = 'Name,Description,Weight (%),Scale\n';
                this.criteria.forEach(criteria => {
                    const description = criteria.description.replace(/"/g, '""'); // Escape quotes
                    csvContent += `"${criteria.name}","${description}",${criteria.weight},${criteria.scale}\n`;
                });

                const blob = new Blob([csvContent], { type: 'text/csv' });
                this.downloadFile(blob, 'evaluation-criteria.csv');
                this.showToast('Criteria exported as CSV', 'success');
            }

            downloadFile(blob, filename) {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                a.click();
                URL.revokeObjectURL(url);
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
        let criteriaManager;

        function addNewCriteria() { criteriaManager.addNewCriteria(); }
        function editCriteria(index) { criteriaManager.editCriteria(index); }
        function deleteCriteria(index) { criteriaManager.deleteCriteria(index); }
        function saveCriteria() { criteriaManager.saveCriteria(); }
        function cancelEdit() { criteriaManager.cancelEdit(); }
        function exportJSON() { criteriaManager.exportJSON(); }
        function exportPDF() { criteriaManager.exportPDF(); }
        function exportCSV() { criteriaManager.exportCSV(); }
        function importCriteria() { criteriaManager.showToast('Import functionality would open file dialog', 'info'); }
        function showTemplates() { criteriaManager.showToast('Template manager opened', 'info'); }
        function backToDashboard() { window.location.href = 'dashboard.html'; }

        document.addEventListener('DOMContentLoaded', () => {
            criteriaManager = new CriteriaManager();
            
            // Add entrance animations
            setTimeout(() => {
                document.querySelectorAll('.criteria-item').forEach((item, index) => {
                    setTimeout(() => {
                        item.style.opacity = '0';
                        item.style.transform = 'translateX(-20px)';
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'translateX(0)';
                        }, 100);
                    }, index * 100);
                });
            }, 1000);

            // Template item animations
            setTimeout(() => {
                document.querySelectorAll('.template-item').forEach((item, index) => {
                    setTimeout(() => {
                        item.style.opacity = '0';
                        item.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0)';
                        }, 100);
                    }, index * 150);
                });
            }, 1500);

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
            .criteria-item, .template-item, .export-btn, .stat-card { transition: var(--transition) !important; }
            @media (hover: hover) and (pointer: fine) {
                .criteria-item:hover { transform: translateY(-4px) !important; }
                .template-item:hover { transform: translateX(4px) !important; }
                .stat-card:hover { transform: translateY(-6px) !important; }
            }
            *:focus-visible { outline: 2px solid var(--primary) !important; outline-offset: 2px !important; }
        `;
        document.head.appendChild(style);
