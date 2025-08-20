 class CriteriaManager {
            constructor() {
                this.criteria = [];
                this.templates = [];
                this.editingIndex = -1;
                this.totalWeight = 0;
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
                this.loadCriteria();
                this.loadTemplates();
                this.renderCriteria();
                this.renderTemplates();
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

            loadCriteria() {
                const savedCriteria = localStorage.getItem('evaluationCriteria');
                if (savedCriteria) {
                    this.criteria = JSON.parse(savedCriteria);
                } else {
                    // Default criteria with NexusHack standards
                    this.criteria = [
                        {
                            id: 1,
                            name: 'Innovation & Creativity',
                            description: 'Uniqueness of the solution, creative approach to problem-solving, and novel implementation ideas that stand out from conventional approaches.',
                            weight: 25,
                            scale: 10
                        },
                        {
                            id: 2,
                            name: 'Technical Implementation',
                            description: 'Code quality, architecture design, use of appropriate technologies, technical complexity, and overall engineering excellence.',
                            weight: 30,
                            scale: 10
                        },
                        {
                            id: 3,
                            name: 'User Experience & Design',
                            description: 'Interface design, usability, accessibility, and overall user experience quality that makes the solution intuitive and engaging.',
                            weight: 20,
                            scale: 10
                        },
                        {
                            id: 4,
                            name: 'Business Impact',
                            description: 'Market potential, scalability, real-world applicability, business model viability, and potential for commercial success.',
                            weight: 15,
                            scale: 10
                        },
                        {
                            id: 5,
                            name: 'Presentation & Demo',
                            description: 'Quality of project demonstration, clarity of explanation, presentation skills, and ability to communicate the solution effectively.',
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
                            { name: 'Innovation', weight: 25, description: 'Novel blockchain solutions and creative DeFi approaches' },
                            { name: 'Technical Implementation', weight: 25, description: 'Smart contract quality, security, and gas optimization' },
                            { name: 'User Experience', weight: 20, description: 'DApp usability, wallet integration, and user onboarding' },
                            { name: 'Tokenomics', weight: 15, description: 'Token utility, economics model, and sustainability' },
                            { name: 'Market Potential', weight: 10, description: 'Real-world adoption potential and ecosystem impact' },
                            { name: 'Presentation', weight: 5, description: 'Demo quality, technical explanation, and team communication' }
                        ]
                    },
                    {
                        id: 2,
                        name: 'AI/ML Competition',
                        description: 'Machine learning and artificial intelligence projects',
                        criteriaCount: 5,
                        criteria: [
                            { name: 'Algorithm Innovation', weight: 30, description: 'Novel ML approaches, model architecture, and AI techniques' },
                            { name: 'Data Quality & Processing', weight: 25, description: 'Data handling, preprocessing, feature engineering, and dataset quality' },
                            { name: 'Model Performance', weight: 20, description: 'Accuracy, efficiency, robustness, and evaluation metrics' },
                            { name: 'Real-world Application', weight: 15, description: 'Practical use cases, societal impact, and problem-solving relevance' },
                            { name: 'Documentation & Reproducibility', weight: 10, description: 'Code quality, documentation, and experiment reproducibility' }
                        ]
                    },
                    {
                        id: 3,
                        name: 'General Hackathon',
                        description: 'Balanced criteria for diverse project types',
                        criteriaCount: 4,
                        criteria: [
                            { name: 'Innovation & Creativity', weight: 30, description: 'Originality, creative problem-solving, and unique approach' },
                            { name: 'Technical Excellence', weight: 30, description: 'Code quality, architecture, and technical implementation' },
                            { name: 'User Impact', weight: 25, description: 'User value, market potential, and real-world applicability' },
                            { name: 'Execution & Presentation', weight: 15, description: 'Project completion, demo quality, and communication skills' }
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
                this.showToast('📝 Adding new evaluation criteria...', 'info');
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

                this.showToast(`✏️ Editing criteria: ${criteria.name}`, 'info');
            }

            // ✅ REALISTIC DELETE WITH CONFIRMATION
            deleteCriteria(index) {
                const criteria = this.criteria[index];
                const modal = document.createElement('div');
                modal.className = 'modal active';
                modal.style.cssText = `
                    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                    background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center;
                    z-index: 10000; backdrop-filter: blur(10px);
                `;
                
                modal.innerHTML = `
                    <div style="background: var(--bg-card); border-radius: 20px; padding: 2rem; max-width: 500px; width: 90%; text-align: center;">
                        <div style="font-size: 3rem; color: var(--danger); margin-bottom: 1rem;">⚠️</div>
                        <h3 style="margin-bottom: 1rem; color: var(--text-primary);">Delete Criteria</h3>
                        <p style="margin-bottom: 1.5rem; color: var(--text-secondary); line-height: 1.6;">
                            Are you sure you want to delete "<strong style="color: var(--text-primary);">${criteria.name}</strong>"? 
                            This action cannot be undone and will affect all evaluations using this criteria.
                        </p>
                        <div style="display: flex; gap: 1rem; justify-content: center;">
                            <button onclick="this.closest('.modal').remove()" 
                                style="padding: 0.75rem 1.5rem; border: 1px solid var(--border); border-radius: 8px; 
                                background: var(--bg-glass); color: var(--text-primary); cursor: pointer;">Cancel</button>
                            <button onclick="criteriaManager.confirmDelete(${index}); this.closest('.modal').remove();" 
                                style="padding: 0.75rem 1.5rem; border: none; border-radius: 8px; 
                                background: var(--gradient-danger); color: white; cursor: pointer;">Delete</button>
                        </div>
                    </div>
                `;
                
                document.body.appendChild(modal);
            }

            confirmDelete(index) {
                const criteriaName = this.criteria[index].name;
                this.criteria.splice(index, 1);
                this.saveCriteriaData();
                this.renderCriteria();
                this.updateStats();
                this.showToast(`🗑️ Criteria "${criteriaName}" deleted successfully`, 'success');
            }

            // ✅ REALISTIC SAVE WITH VALIDATION
            saveCriteria() {
                const name = document.getElementById('criteriaName').value.trim();
                const description = document.getElementById('criteriaDescription').value.trim();
                const weight = parseInt(document.getElementById('criteriaWeight').value);
                const scale = parseInt(document.getElementById('criteriaScale').value);

                // Enhanced validation
                if (!name || name.length < 3) {
                    this.showToast('⚠️ Please enter a criteria name (minimum 3 characters)', 'warning');
                    return;
                }

                if (!description || description.length < 20) {
                    this.showToast('⚠️ Please enter a detailed description (minimum 20 characters)', 'warning');
                    return;
                }

                // Check for duplicate names
                const isDuplicate = this.criteria.some((c, index) => 
                    c.name.toLowerCase() === name.toLowerCase() && index !== this.editingIndex
                );

                if (isDuplicate) {
                    this.showToast('⚠️ A criteria with this name already exists', 'warning');
                    return;
                }

                // Check total weight
                const currentWeight = this.editingIndex >= 0 ? this.criteria[this.editingIndex].weight : 0;
                const newTotalWeight = this.totalWeight - currentWeight + weight;
                
                if (newTotalWeight > 100) {
                    this.showToast(`⚠️ Total weight cannot exceed 100%. Current total would be ${newTotalWeight}%`, 'warning');
                    return;
                }

                this.showLoader();

                setTimeout(() => {
                    const criteriaData = {
                        id: this.editingIndex >= 0 ? this.criteria[this.editingIndex].id : Date.now(),
                        name: name,
                        description: description,
                        weight: weight,
                        scale: scale,
                        createdAt: this.editingIndex >= 0 ? this.criteria[this.editingIndex].createdAt : new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                    };

                    if (this.editingIndex >= 0) {
                        this.criteria[this.editingIndex] = criteriaData;
                        this.showToast(`✅ Criteria "${name}" updated successfully`, 'success');
                    } else {
                        this.criteria.push(criteriaData);
                        this.showToast(`✅ Criteria "${name}" added successfully`, 'success');
                    }

                    this.saveCriteriaData();
                    this.cancelEdit();
                    this.renderCriteria();
                    this.updateStats();
                    this.completeLoader();
                }, 1000);
            }

            cancelEdit() {
                document.getElementById('criteriaForm').classList.remove('active');
                document.getElementById('addCriteriaBtn').style.display = 'inline-flex';
                document.querySelectorAll('.criteria-item').forEach(item => {
                    item.classList.remove('editing');
                });
                this.editingIndex = -1;
                this.clearForm();
                this.showToast('❌ Edit cancelled', 'info');
            }

            clearForm() {
                document.getElementById('criteriaName').value = '';
                document.getElementById('criteriaDescription').value = '';
                document.getElementById('criteriaWeight').value = '20';
                document.getElementById('currentWeight').textContent = '20%';
                document.getElementById('criteriaScale').value = '10';
            }

            // ✅ REALISTIC TEMPLATE LOADING
            loadTemplate(templateId) {
                const template = this.templates.find(t => t.id === templateId);
                if (!template) return;

                const modal = document.createElement('div');
                modal.className = 'modal active';
                modal.style.cssText = `
                    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                    background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center;
                    z-index: 10000; backdrop-filter: blur(10px);
                `;
                
                modal.innerHTML = `
                    <div style="background: var(--bg-card); border-radius: 20px; padding: 2rem; max-width: 600px; width: 90%; text-align: center;">
                        <div style="font-size: 3rem; margin-bottom: 1rem;">📋</div>
                        <h3 style="margin-bottom: 1rem; color: var(--text-primary);">Load Template</h3>
                        <p style="margin-bottom: 1rem; color: var(--text-secondary); line-height: 1.6;">
                            Load "<strong style="color: var(--text-primary);">${template.name}</strong>" template?
                        </p>
                        <div style="background: var(--bg-glass); padding: 1rem; border-radius: 12px; margin-bottom: 1.5rem; text-align: left;">
                            <h4 style="color: var(--text-primary); margin-bottom: 0.5rem;">Template includes:</h4>
                            ${template.criteria.map(c => 
                                `<div style="margin: 0.25rem 0; color: var(--text-secondary); font-size: 0.9rem;">• ${c.name} (${c.weight}%)</div>`
                            ).join('')}
                        </div>
                        <p style="margin-bottom: 1.5rem; color: var(--text-muted); font-size: 0.85rem;">
                            This will replace all current criteria with the template criteria.
                        </p>
                        <div style="display: flex; gap: 1rem; justify-content: center;">
                            <button onclick="this.closest('.modal').remove()" 
                                style="padding: 0.75rem 1.5rem; border: 1px solid var(--border); border-radius: 8px; 
                                background: var(--bg-glass); color: var(--text-primary); cursor: pointer;">Cancel</button>
                            <button onclick="criteriaManager.confirmLoadTemplate(${templateId}); this.closest('.modal').remove();" 
                                style="padding: 0.75rem 1.5rem; border: none; border-radius: 8px; 
                                background: var(--gradient-criteria); color: white; cursor: pointer;">Load Template</button>
                        </div>
                    </div>
                `;
                
                document.body.appendChild(modal);
            }

            confirmLoadTemplate(templateId) {
                const template = this.templates.find(t => t.id === templateId);
                if (!template) return;

                this.showLoader();

                setTimeout(() => {
                    this.criteria = template.criteria.map((c, index) => ({
                        id: Date.now() + index,
                        name: c.name,
                        description: c.description,
                        weight: c.weight,
                        scale: 10,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                    }));

                    this.saveCriteriaData();
                    this.renderCriteria();
                    this.updateStats();
                    this.completeLoader();
                    this.showToast(`📋 Template "${template.name}" loaded successfully with ${template.criteriaCount} criteria`, 'success');
                }, 1500);
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

            // ✅ REALISTIC EXPORT FUNCTIONS
            exportJSON() {
                this.showLoader();
                
                setTimeout(() => {
                    const exportData = {
                        criteria: this.criteria,
                        metadata: {
                            totalCriteria: this.criteria.length,
                            totalWeight: this.totalWeight,
                            exportedBy: this.currentUser.name,
                            exportedAt: new Date().toISOString(),
                            version: '2.0',
                            platform: 'NexusHack',
                            type: 'Evaluation Criteria'
                        },
                        templates: this.templates,
                        settings: {
                            defaultScale: 10,
                            weightValidation: true,
                            requiredWeight: 100
                        }
                    };

                    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
                    this.downloadFile(blob, `nexushack-criteria-${new Date().toISOString().split('T')[0]}.json`);
                    this.completeLoader();
                    this.showToast('📁 Comprehensive criteria exported as JSON with metadata', 'success');
                }, 2000);
            }

            exportPDF() {
                this.showLoader();
                
                setTimeout(() => {
                    this.completeLoader();
                    this.showToast('📄 PDF export would generate a professional evaluation guide with criteria details, weights, and scoring instructions', 'info');
                }, 1500);
            }

            exportCSV() {
                this.showLoader();
                
                setTimeout(() => {
                    let csvContent = 'NexusHack Evaluation Criteria Export\n';
                    csvContent += `Exported by: ${this.currentUser.name}\n`;
                    csvContent += `Export Date: ${new Date().toLocaleString()}\n`;
                    csvContent += `Total Criteria: ${this.criteria.length}\n`;
                    csvContent += `Total Weight: ${this.totalWeight}%\n\n`;
                    
                    csvContent += 'Name,Description,Weight (%),Scale,Created,Updated\n';
                    this.criteria.forEach(criteria => {
                        const description = criteria.description.replace(/"/g, '""');
                        const created = criteria.createdAt ? new Date(criteria.createdAt).toLocaleDateString() : 'N/A';
                        const updated = criteria.updatedAt ? new Date(criteria.updatedAt).toLocaleDateString() : 'N/A';
                        csvContent += `"${criteria.name}","${description}",${criteria.weight},${criteria.scale},"${created}","${updated}"\n`;
                    });

                    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                    this.downloadFile(blob, `nexushack-criteria-${new Date().toISOString().split('T')[0]}.csv`);
                    this.completeLoader();
                    this.showToast('📊 Detailed criteria exported as CSV with timestamps', 'success');
                }, 2000);
            }

            downloadFile(blob, filename) {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                a.style.display = 'none';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
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
        let criteriaManager;

        function addNewCriteria() { criteriaManager.addNewCriteria(); }
        function editCriteria(index) { criteriaManager.editCriteria(index); }
        function deleteCriteria(index) { criteriaManager.deleteCriteria(index); }
        function saveCriteria() { criteriaManager.saveCriteria(); }
        function cancelEdit() { criteriaManager.cancelEdit(); }
        function exportJSON() { criteriaManager.exportJSON(); }
        function exportPDF() { criteriaManager.exportPDF(); }
        function exportCSV() { criteriaManager.exportCSV(); }

        // ✅ REALISTIC BUTTON FUNCTIONS
        function importCriteria() {
            criteriaManager.showLoader();
            
            setTimeout(() => {
                criteriaManager.completeLoader();
                criteriaManager.showToast('📂 Import functionality would open file dialog to load JSON/CSV criteria files', 'info');
            }, 1500);
        }

        function showTemplates() {
            criteriaManager.showToast('📋 Template gallery with 50+ pre-built criteria sets for different hackathon types', 'info');
        }

        function backToDashboard() {
            criteriaManager.showToast('🏠 Returning to main dashboard...', 'info');
            criteriaManager.showLoader();
            
            setTimeout(() => {
                criteriaManager.completeLoader();
                window.location.href = 'dashboard.html';
            }, 1000);
        }

        // Initialize the application
        document.addEventListener('DOMContentLoaded', () => {
            criteriaManager = new CriteriaManager();
            
            // Add entrance animations
            setTimeout(() => {
                document.querySelectorAll('.criteria-item').forEach((item, index) => {
                    setTimeout(() => {
                        item.style.opacity = '0';
                        item.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0)';
                        }, 100);
                    }, index * 100);
                });
            }, 1000);

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
            }, 1500);

            // Performance optimization for mobile
            if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                document.body.classList.add('mobile-device');
            }

            // Keyboard shortcuts
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    criteriaManager.closeMobileSidebar();
                    const modals = document.querySelectorAll('.modal');
                    modals.forEach(modal => modal.remove());
                }
                if (e.ctrlKey) {
                    switch(e.key) {
                        case 's':
                            e.preventDefault();
                            if (document.getElementById('criteriaForm').classList.contains('active')) {
                                saveCriteria();
                            }
                            break;
                        case 'n':
                            e.preventDefault();
                            addNewCriteria();
                            break;
                    }
                }
            });

            // Welcome message
            setTimeout(() => {
                criteriaManager.showToast('⚖️ Evaluation Criteria Setup loaded! Create professional judging standards with weighted scoring systems.', 'success');
            }, 2000);
        });