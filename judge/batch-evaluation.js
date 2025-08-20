class BatchEvaluationManager {
            constructor() {
                this.projects = [];
                this.selectedProjects = new Set();
                this.filters = { status: 'all', category: 'all', priority: 'all' };
                this.currentUser = { name: 'Dr. Jane Smith', role: 'Senior Judge' };
                this.isMobile = window.innerWidth <= 768;
                this.aiProcessing = false;
                
                this.init();
            }

            init() {
                this.initializeTheme();
                this.setupEventListeners();
                this.loadProjects();
                this.renderProjects();
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

            setupEventListeners() {
                // Theme toggle
                document.getElementById('themeToggle').addEventListener('click', () => {
                    this.toggleTheme();
                });

                // Window resize
                window.addEventListener('resize', () => {
                    this.handleResize();
                });

                // Keyboard shortcuts
                document.addEventListener('keydown', (e) => {
                    if (e.ctrlKey) {
                        switch(e.key) {
                            case 'a':
                                e.preventDefault();
                                this.selectAll();
                                break;
                            case 'd':
                                e.preventDefault();
                                this.clearSelection();
                                break;
                            case 'Enter':
                                e.preventDefault();
                                this.startBatchEvaluation();
                                break;
                        }
                    }
                });
            }

            handleResize() {
                this.isMobile = window.innerWidth <= 768;
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

            loadProjects() {
                this.showLoader();
                
                setTimeout(() => {
                    // Mock project data
                    this.projects = [
                        {
                            id: 1,
                            title: 'AI-Powered Climate Prediction System',
                            team: 'Green AI Innovators',
                            event: 'Climate Tech Challenge',
                            description: 'Advanced machine learning system that predicts climate patterns using satellite data and IoT sensors for better environmental monitoring and disaster prevention.',
                            category: 'ai',
                            status: 'pending',
                            priority: 'high',
                            tags: ['AI', 'Climate', 'IoT', 'Python', 'TensorFlow'],
                            submittedAt: Date.now() - 3600000,
                            deadline: Date.now() + 86400000,
                            score: null
                        },
                        {
                            id: 2,
                            title: 'Blockchain Supply Chain Tracker',
                            team: 'Chain Masters',
                            event: 'Web3 Innovation Summit',
                            description: 'Decentralized supply chain tracking system using Ethereum smart contracts for complete transparency and authenticity verification across global supply networks.',
                            category: 'blockchain',
                            status: 'pending',
                            priority: 'medium',
                            tags: ['Blockchain', 'Ethereum', 'Supply Chain', 'Solidity'],
                            submittedAt: Date.now() - 7200000,
                            deadline: Date.now() + 172800000,
                            score: null
                        },
                        {
                            id: 3,
                            title: 'Mental Health Support Mobile App',
                            team: 'Wellness Warriors',
                            event: 'Healthcare Innovation Hub',
                            description: 'React Native app providing AI-powered mental health support with mood tracking, therapy resources, and peer community features for comprehensive wellness management.',
                            category: 'mobile',
                            status: 'reviewed',
                            priority: 'high',
                            tags: ['Mobile', 'React Native', 'Mental Health', 'AI'],
                            submittedAt: Date.now() - 10800000,
                            deadline: Date.now() + 259200000,
                            score: 8.7
                        },
                        {
                            id: 4,
                            title: 'Smart City IoT Dashboard',
                            team: 'Urban Tech',
                            event: 'Smart Cities Challenge',
                            description: 'Real-time dashboard for monitoring city infrastructure using IoT sensors, data analytics, and predictive maintenance algorithms for optimal urban management.',
                            category: 'iot',
                            status: 'pending',
                            priority: 'medium',
                            tags: ['IoT', 'Dashboard', 'Smart City', 'Vue.js', 'Analytics'],
                            submittedAt: Date.now() - 14400000,
                            deadline: Date.now() + 432000000,
                            score: null
                        },
                        {
                            id: 5,
                            title: 'Virtual Reality Learning Platform',
                            team: 'VR Educators',
                            event: 'Education Technology Expo',
                            description: 'Immersive VR platform for educational content with AI-driven personalized learning paths and interactive 3D environments for enhanced student engagement.',
                            category: 'ai',
                            status: 'pending',
                            priority: 'low',
                            tags: ['VR', 'Education', 'Unity', 'AI', '3D'],
                            submittedAt: Date.now() - 18000000,
                            deadline: Date.now() + 518400000,
                            score: null
                        },
                        {
                            id: 6,
                            title: 'Quantum Computing Simulator',
                            team: 'Quantum Pioneers',
                            event: 'Advanced Computing Challenge',
                            description: 'Advanced quantum computing simulator with visual circuit designer and algorithm implementations for research and education in quantum mechanics.',
                            category: 'ai',
                            status: 'reviewed',
                            priority: 'high',
                            tags: ['Quantum', 'Simulation', 'Python', 'Qiskit', 'Research'],
                            submittedAt: Date.now() - 21600000,
                            deadline: Date.now() + 604800000,
                            score: 9.2
                        }
                    ];

                    this.completeLoader();
                }, 1000);
            }

            renderProjects() {
                const container = document.getElementById('batchProjectsGrid');
                container.innerHTML = '';

                const filteredProjects = this.filterProjectsData();

                if (filteredProjects.length === 0) {
                    container.innerHTML = `
                        <div style="grid-column: 1/-1;" class="empty-state">
                            <div class="empty-icon">
                                <i class="fas fa-search"></i>
                            </div>
                            <h3 class="empty-title">No projects found</h3>
                            <p class="empty-description">
                                Try adjusting your filters or check back later for new submissions.
                            </p>
                            <button class="btn btn-primary" onclick="batchEvaluationManager.clearFilters()">
                                <i class="fas fa-times"></i>
                                Clear Filters
                            </button>
                        </div>
                    `;
                    return;
                }

                filteredProjects.forEach((project, index) => {
                    const projectDiv = document.createElement('div');
                    projectDiv.className = `batch-project-card ${project.status}`;
                    if (this.selectedProjects.has(project.id)) {
                        projectDiv.classList.add('selected');
                    }
                    
                    projectDiv.innerHTML = `
                        <div class="batch-project-header">
                            <div class="batch-project-info">
                                <div class="batch-project-title">${project.title}</div>
                                <div class="batch-project-team">by ${project.team}</div>
                                <div class="batch-project-event">${project.event}</div>
                            </div>
                            <div class="batch-project-checkbox">
                                <input type="checkbox" class="batch-checkbox" id="project-${project.id}" 
                                       ${this.selectedProjects.has(project.id) ? 'checked' : ''}
                                       onchange="batchEvaluationManager.toggleSelection(${project.id})">
                            </div>
                        </div>
                        <div class="batch-project-description">${project.description}</div>
                        <div class="batch-project-meta">
                            <span><i class="fas fa-clock"></i> ${this.formatTime(project.submittedAt)}</span>
                            <span><i class="fas fa-flag"></i> ${this.capitalizeFirst(project.priority)} Priority</span>
                            <span><i class="fas fa-calendar"></i> Due ${this.formatDeadline(project.deadline)}</span>
                            ${project.score ? `<span><i class="fas fa-star"></i> Score: ${project.score}/10</span>` : ''}
                        </div>
                        <div class="batch-project-tags">
                            ${project.tags.map(tag => 
                                `<span class="batch-project-tag">${tag}</span>`
                            ).join('')}
                        </div>
                        <div class="batch-project-actions">
                            <button class="btn btn-small btn-secondary" onclick="batchEvaluationManager.previewProject(${project.id})">
                                <i class="fas fa-eye"></i>
                                Preview
                            </button>
                            <button class="btn btn-small btn-primary" onclick="batchEvaluationManager.evaluateProject(${project.id})">
                                <i class="fas fa-star"></i>
                                ${project.status === 'reviewed' ? 'Re-evaluate' : 'Evaluate'}
                            </button>
                        </div>
                    `;
                    
                    container.appendChild(projectDiv);
                });

                this.updateStats();
            }

            filterProjectsData() {
                return this.projects.filter(project => {
                    const statusMatch = this.filters.status === 'all' || project.status === this.filters.status;
                    const categoryMatch = this.filters.category === 'all' || project.category === this.filters.category;
                    const priorityMatch = this.filters.priority === 'all' || project.priority === this.filters.priority;
                    
                    return statusMatch && categoryMatch && priorityMatch;
                });
            }

            toggleSelection(projectId) {
                if (this.selectedProjects.has(projectId)) {
                    this.selectedProjects.delete(projectId);
                } else {
                    this.selectedProjects.add(projectId);
                }
                
                this.updateSelectionUI(projectId);
                this.updateStats();
            }

            updateSelectionUI(projectId) {
                const card = document.querySelector(`#project-${projectId}`).closest('.batch-project-card');
                if (this.selectedProjects.has(projectId)) {
                    card.classList.add('selected');
                } else {
                    card.classList.remove('selected');
                }
            }

            updateStats() {
                document.getElementById('selectedProjects').textContent = this.selectedProjects.size;
                
                const evaluateBtn = document.getElementById('batchEvaluateBtn');
                if (this.selectedProjects.size > 0) {
                    evaluateBtn.innerHTML = `<i class="fas fa-play"></i> Evaluate Selected (${this.selectedProjects.size})`;
                    evaluateBtn.style.animation = 'batchPulse 2s infinite';
                } else {
                    evaluateBtn.innerHTML = '<i class="fas fa-play"></i> Evaluate Selected';
                    evaluateBtn.style.animation = '';
                }
            }

            selectAll() {
                const filteredProjects = this.filterProjectsData();
                filteredProjects.forEach(project => {
                    this.selectedProjects.add(project.id);
                });
                
                this.renderProjects();
                this.showToast(`Selected all ${filteredProjects.length} visible projects 📋`, 'success');
            }

            clearSelection() {
                this.selectedProjects.clear();
                this.renderProjects();
                this.showToast('Selection cleared 🗑️', 'info');
            }

            filterProjects() {
                this.filters.status = document.getElementById('statusFilter').value;
                this.filters.category = document.getElementById('categoryFilter').value;
                this.filters.priority = document.getElementById('priorityFilter').value;
                
                this.renderProjects();
                this.showToast('Filters applied 🔍', 'info');
            }

            clearFilters() {
                document.getElementById('statusFilter').value = 'all';
                document.getElementById('categoryFilter').value = 'all';
                document.getElementById('priorityFilter').value = 'all';
                
                this.filters = { status: 'all', category: 'all', priority: 'all' };
                this.renderProjects();
                this.showToast('Filters cleared 🔄', 'info');
            }

            // ✅ REALISTIC AI ASSISTANT
            openAiAssistant() {
                if (this.selectedProjects.size === 0) {
                    this.showToast('Please select projects first for AI evaluation 🤖', 'warning');
                    return;
                }

                const modal = document.getElementById('aiModal');
                modal.classList.add('active');
                
                this.aiProcessing = true;
                this.runAiEvaluation();
            }

            closeAiModal() {
                const modal = document.getElementById('aiModal');
                modal.classList.remove('active');
                this.aiProcessing = false;
            }

            runAiEvaluation() {
                const progressBar = document.getElementById('aiProgressBar');
                const statusText = document.getElementById('aiStatus');
                const selectedCount = this.selectedProjects.size;
                
                const steps = [
                    'Analyzing project repositories...',
                    'Processing code quality metrics...',
                    'Evaluating innovation factors...',
                    'Assessing technical complexity...',
                    'Computing final scores...',
                    'Generating detailed reports...'
                ];
                
                let currentStep = 0;
                
                const runStep = () => {
                    if (!this.aiProcessing) return;
                    
                    if (currentStep < steps.length) {
                        statusText.textContent = steps[currentStep];
                        progressBar.style.width = `${((currentStep + 1) / steps.length) * 100}%`;
                        
                        currentStep++;
                        setTimeout(runStep, 1500);
                    } else {
                        statusText.textContent = `✅ AI evaluation completed for ${selectedCount} projects!`;
                        progressBar.style.width = '100%';
                        
                        // Update projects with AI scores
                        this.selectedProjects.forEach(id => {
                            const project = this.projects.find(p => p.id === id);
                            if (project && project.status === 'pending') {
                                project.score = (Math.random() * 3 + 7).toFixed(1); // 7.0-10.0
                                project.status = 'reviewed';
                            }
                        });
                        
                        setTimeout(() => {
                            this.closeAiModal();
                            this.renderProjects();
                            this.showToast(`🎯 AI evaluation completed! ${selectedCount} projects scored automatically.`, 'success');
                        }, 2000);
                    }
                };
                
                runStep();
            }

            // ✅ REALISTIC CSV EXPORT
            exportResults() {
                this.showLoader();
                this.showToast('📊 Generating CSV export...', 'info');
                
                setTimeout(() => {
                    const csvData = this.generateCsvData();
                    this.downloadCsv(csvData, `nexushack-batch-evaluation-${new Date().toISOString().split('T')[0]}.csv`);
                    
                    this.completeLoader();
                    this.showToast('📥 Evaluation results exported successfully!', 'success');
                }, 2000);
            }

            generateCsvData() {
                const headers = [
                    'Project ID',
                    'Title',
                    'Team',
                    'Event',
                    'Category',
                    'Priority',
                    'Status',
                    'Score',
                    'Tags',
                    'Submitted Date',
                    'Deadline'
                ];
                
                const rows = this.projects.map(project => [
                    project.id,
                    `"${project.title}"`,
                    `"${project.team}"`,
                    `"${project.event}"`,
                    project.category,
                    project.priority,
                    project.status,
                    project.score || 'N/A',
                    `"${project.tags.join('; ')}"`,
                    new Date(project.submittedAt).toISOString().split('T')[0],
                    new Date(project.deadline).toISOString().split('T')
                ]);
                
                return [headers, ...rows].map(row => row.join(',')).join('\n');
            }

            downloadCsv(csvData, filename) {
                const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
                const link = document.createElement('a');
                
                if (link.download !== undefined) {
                    const url = URL.createObjectURL(blob);
                    link.setAttribute('href', url);
                    link.setAttribute('download', filename);
                    link.style.visibility = 'hidden';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
            }

            startBatchEvaluation() {
                if (this.selectedProjects.size === 0) {
                    this.showToast('Please select at least one project to evaluate 📋', 'warning');
                    return;
                }
                
                this.showToast(`Starting batch evaluation for ${this.selectedProjects.size} projects... 🚀`, 'info');
                this.showLoader();
                
                setTimeout(() => {
                    // Simulate batch processing
                    this.selectedProjects.forEach(id => {
                        const project = this.projects.find(p => p.id === id);
                        if (project && project.status === 'pending') {
                            project.score = (Math.random() * 3 + 7).toFixed(1);
                            project.status = 'reviewed';
                        }
                    });
                    
                    this.completeLoader();
                    this.showToast(`🎯 Batch evaluation completed! ${this.selectedProjects.size} projects processed successfully.`, 'success');
                    
                    this.clearSelection();
                    this.renderProjects();
                }, 3000);
            }

            previewProject(id) {
                const project = this.projects.find(p => p.id === id);
                this.showToast(`Loading preview for "${project.title}"... 👀`, 'info');
                this.showLoader();
                
                setTimeout(() => {
                    this.completeLoader();
                    
                    // Create preview modal
                    const modal = document.createElement('div');
                    modal.className = 'ai-modal active';
                    modal.innerHTML = `
                        <div class="ai-modal-content">
                            <div class="ai-modal-header">
                                <div class="ai-modal-title">
                                    <i class="fas fa-eye"></i>
                                    Project Preview
                                </div>
                                <button class="ai-close" onclick="this.closest('.ai-modal').remove()">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                            <div style="max-height: 400px; overflow-y: auto;">
                                <h3 style="color: var(--text-primary); margin-bottom: 0.5rem;">${project.title}</h3>
                                <p style="color: var(--text-secondary); margin-bottom: 1rem;">by ${project.team} • ${project.event}</p>
                                <p style="color: var(--text-muted); line-height: 1.6; margin-bottom: 1rem;">${project.description}</p>
                                <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1rem;">
                                    ${project.tags.map(tag => `<span style="background: var(--bg-batch); color: var(--info); padding: 0.25rem 0.5rem; border-radius: 8px; font-size: 0.75rem;">${tag}</span>`).join('')}
                                </div>
                                <div style="color: var(--text-secondary); font-size: 0.9rem;">
                                    <p><strong>Priority:</strong> ${this.capitalizeFirst(project.priority)}</p>
                                    <p><strong>Status:</strong> ${this.capitalizeFirst(project.status)}</p>
                                    ${project.score ? `<p><strong>Current Score:</strong> ${project.score}/10</p>` : ''}
                                </div>
                            </div>
                        </div>
                    `;
                    
                    document.body.appendChild(modal);
                }, 1000);
            }

            evaluateProject(id) {
                const project = this.projects.find(p => p.id === id);
                this.showToast(`Opening evaluation for "${project.title}"... ⭐`, 'info');
                this.showLoader();
                
                setTimeout(() => {
                    localStorage.setItem('evaluateProjectId', id);
                    this.completeLoader();
                    window.location.href = 'evaluation.html';
                }, 1000);
            }

            formatTime(timestamp) {
                const now = Date.now();
                const diff = now - timestamp;
                
                if (diff < 60000) {
                    return 'just now';
                } else if (diff < 3600000) {
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

            formatDeadline(timestamp) {
                const now = Date.now();
                const diff = timestamp - now;
                
                if (diff < 0) {
                    return 'Overdue';
                } else if (diff < 3600000) {
                    const minutes = Math.floor(diff / 60000);
                    return `in ${minutes}m`;
                } else if (diff < 86400000) {
                    const hours = Math.floor(diff / 3600000);
                    return `in ${hours}h`;
                } else {
                    const days = Math.floor(diff / 86400000);
                    return `in ${days}d`;
                }
            }

            capitalizeFirst(str) {
                return str.charAt(0).toUpperCase() + str.slice(1);
            }

            // ✅ NOTIFICATION VISIBILITY WITH AUTO-DISMISS
            showToast(message, type = 'success') {
                const existingToast = document.querySelector('.toast');
                if (existingToast) {
                    existingToast.remove();
                }
                
                const toast = document.createElement('div');
                toast.className = `toast ${type}`;
                toast.innerHTML = `
                    <i class="fas ${this.getToastIcon(type)}" style="margin-right: 8px;"></i>
                    ${message}
                `;
                
                document.body.appendChild(toast);
                
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
                switch (type) {
                    case 'success': return 'fa-check-circle';
                    case 'error': return 'fa-exclamation-circle';
                    case 'info': return 'fa-info-circle';
                    case 'warning': return 'fa-exclamation-triangle';
                    default: return 'fa-check-circle';
                }
            }
        }

        // Global instance and functions
        let batchEvaluationManager;

        function selectAll() {
            batchEvaluationManager.selectAll();
        }

        function clearSelection() {
            batchEvaluationManager.clearSelection();
        }

        function startBatchEvaluation() {
            batchEvaluationManager.startBatchEvaluation();
        }

        function filterProjects() {
            batchEvaluationManager.filterProjects();
        }

        function openAiAssistant() {
            batchEvaluationManager.openAiAssistant();
        }

        function closeAiModal() {
            batchEvaluationManager.closeAiModal();
        }

        function exportResults() {
            batchEvaluationManager.exportResults();
        }

        function backToDashboard() {
            batchEvaluationManager.showToast('Returning to judge dashboard... 🏠', 'info');
            batchEvaluationManager.showLoader();
            
            setTimeout(() => {
                batchEvaluationManager.completeLoader();
                window.location.href = 'dashboard.html';
            }, 1000);
        }

        // Initialize the application
        document.addEventListener('DOMContentLoaded', () => {
            batchEvaluationManager = new BatchEvaluationManager();
            
            // Enhanced keyboard shortcuts
            console.log(`
🎯 NexusHack Batch Evaluation - Keyboard Shortcuts:
• Ctrl + A : Select all visible projects
• Ctrl + D : Clear selection
• Ctrl + Enter : Start batch evaluation
• Ctrl + T : Toggle theme
            `);
            
            // Performance optimization for mobile
            if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                document.body.classList.add('mobile-device');
            }
            
            // Welcome message
            setTimeout(() => {
                batchEvaluationManager.showToast('🚀 Batch Evaluation Center ready! Select projects and start evaluating with AI assistance.', 'success');
            }, 1500);
        });

        // Enhanced styles
        const enhancedStyle = document.createElement('style');
        enhancedStyle.textContent = `
            @keyframes batchPulse {
                0%, 100% { 
                    box-shadow: var(--shadow-batch); 
                    transform: scale(1);
                }
                50% { 
                    box-shadow: 0 0 30px rgba(6, 182, 212, 0.7); 
                    transform: scale(1.02);
                }
            }
            
            @media (hover: hover) and (pointer: fine) {
                .batch-project-card:hover {
                    transform: translateY(-8px) scale(1.01);
                    box-shadow: var(--shadow-xl);
                }
            }
        `;
        document.head.appendChild(enhancedStyle);