// ADVANCED EVALUATION SYSTEM
        class EvaluationSystem {
            constructor() {
                this.evaluationData = {};
                this.startTime = Date.now() - 2730000; // 45:30 ago
                this.progress = 25;
                this.isMobile = window.innerWidth <= 1024;
                this.currentUser = { name: 'Dr. Jane Smith', initials: 'JS', role: 'Senior Judge', id: 'judge_001' };
                this.currentProject = {
                    id: 1,
                    name: 'DeFi Portfolio Tracker',
                    team: 'Blockchain Innovators',
                    avatar: 'DP',
                    category: 'Web3 & Blockchain'
                };
                this.init();
            }

            init() {
                this.initializeTheme();
                this.setupEventListeners();
                this.startTimer();
                this.loadEvaluationData();
                this.updateProgress();
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
                window.addEventListener('beforeunload', (e) => this.handleBeforeUnload(e));
                
                // Auto-save every 2 minutes
                setInterval(() => {
                    this.autoSave();
                }, 120000);

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

            startTimer() {
                setInterval(() => {
                    const elapsed = Date.now() - this.startTime;
                    const minutes = Math.floor(elapsed / 60000);
                    const seconds = Math.floor((elapsed % 60000) / 1000);
                    const timer = document.getElementById('evaluationTimer');
                    timer.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
                }, 1000);
            }

            loadEvaluationData() {
                const savedData = localStorage.getItem(`evaluation_${this.currentProject.id}`);
                if (savedData) {
                    this.evaluationData = JSON.parse(savedData);
                    this.progress = this.calculateProgress();
                    this.updateProgressDisplay();
                } else {
                    this.evaluationData = {
                        projectId: this.currentProject.id,
                        judgeId: this.currentUser.id,
                        startTime: this.startTime,
                        stages: {
                            initialReview: { completed: true, timestamp: Date.now() - 3600000 },
                            codeAnalysis: { completed: true, timestamp: Date.now() - 1800000 },
                            detailedScoring: { completed: false, progress: 0.3 },
                            teamInterview: { completed: false, scheduled: Date.now() + 7200000 },
                            finalReport: { completed: false }
                        }
                    };
                }
            }

            calculateProgress() {
                const stages = this.evaluationData.stages;
                let completedStages = 0;
                let totalStages = Object.keys(stages).length;
                
                Object.values(stages).forEach(stage => {
                    if (stage.completed) {
                        completedStages += 1;
                    } else if (stage.progress) {
                        completedStages += stage.progress;
                    }
                });

                return Math.round((completedStages / totalStages) * 100);
            }

            updateProgress() {
                this.progress = this.calculateProgress();
                this.updateProgressDisplay();
                
                if (this.progress >= 80) {
                    document.getElementById('finalizeBtn').style.display = 'inline-flex';
                }
            }

            updateProgressDisplay() {
                const progressElement = document.getElementById('overallProgress');
                progressElement.textContent = `${this.progress}%`;
                
                if (this.progress >= 75) {
                    progressElement.style.background = 'var(--gradient-success)';
                } else if (this.progress >= 50) {
                    progressElement.style.background = 'var(--gradient-warning)';
                } else {
                    progressElement.style.background = 'var(--gradient-ai)';
                }
            }

            saveProgress() {
                const saveData = {
                    ...this.evaluationData,
                    lastSaved: Date.now(),
                    progress: this.progress
                };

                localStorage.setItem(`evaluation_${this.currentProject.id}`, JSON.stringify(saveData));
                this.showToast('Evaluation progress saved successfully!', 'success');
            }

            autoSave() {
                if (Object.keys(this.evaluationData).length > 0) {
                    const saveData = {
                        ...this.evaluationData,
                        autoSaved: Date.now(),
                        progress: this.progress
                    };
                    localStorage.setItem(`evaluation_autosave_${this.currentProject.id}`, JSON.stringify(saveData));
                }
            }

            continueEvaluation() {
                // Determine next step based on progress
                const stages = this.evaluationData.stages;
                
                if (!stages.detailedScoring.completed) {
                    this.showToast('Redirecting to scoring system...', 'info');
                    setTimeout(() => window.location.href = 'scoring.html', 1000);
                } else if (!stages.teamInterview.completed) {
                    this.showToast('Starting video interview...', 'info');
                    setTimeout(() => window.location.href = 'video-interview.html', 1000);
                } else if (!stages.finalReport.completed) {
                    this.showToast('Opening final report editor...', 'info');
                    setTimeout(() => window.location.href = 'feedback.html', 1000);
                } else {
                    this.showToast('All stages completed! Ready for finalization.', 'success');
                }
            }

            finalizeEvaluation() {
                if (this.progress < 80) {
                    this.showToast('Please complete at least 80% of the evaluation before finalizing', 'warning');
                    return;
                }

                if (!confirm('Are you sure you want to finalize this evaluation? This action cannot be undone.')) {
                    return;
                }

                const finalData = {
                    ...this.evaluationData,
                    status: 'finalized',
                    finalizedAt: Date.now(),
                    finalizedBy: this.currentUser.id,
                    totalTime: Date.now() - this.startTime
                };

                // Save to submissions
                const submissions = JSON.parse(localStorage.getItem('evaluationSubmissions') || '[]');
                submissions.push(finalData);
                localStorage.setItem('evaluationSubmissions', JSON.stringify(submissions));

                // Clear current evaluation
                localStorage.removeItem(`evaluation_${this.currentProject.id}`);
                localStorage.removeItem(`evaluation_autosave_${this.currentProject.id}`);

                this.showToast('Evaluation finalized successfully!', 'success');
                
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 2000);
            }

            exportEvaluation() {
                const exportData = {
                    project: this.currentProject,
                    judge: this.currentUser,
                    evaluation: this.evaluationData,
                    progress: this.progress,
                    exportedAt: Date.now()
                };

                const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `evaluation_${this.currentProject.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.json`;
                a.click();
                URL.revokeObjectURL(url);
                
                this.showToast('Evaluation data exported successfully!', 'success');
            }

            handleBeforeUnload(event) {
                if (this.progress > 0 && this.progress < 100) {
                    event.preventDefault();
                    event.returnValue = 'You have an evaluation in progress. Are you sure you want to leave?';
                    return 'You have an evaluation in progress. Are you sure you want to leave?';
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
        let evaluationSystem;

        function saveProgress() { evaluationSystem.saveProgress(); }
        function continueEvaluation() { evaluationSystem.continueEvaluation(); }
        function finalizeEvaluation() { evaluationSystem.finalizeEvaluation(); }
        function exportEvaluation() { evaluationSystem.exportEvaluation(); }
        function backToDashboard() { window.location.href = 'dashboard.html'; }

        document.addEventListener('DOMContentLoaded', () => {
            evaluationSystem = new EvaluationSystem();
            
            // Add entrance animations
            setTimeout(() => {
                document.querySelectorAll('.tool-card').forEach((card, index) => {
                    setTimeout(() => {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 100);
                    }, index * 150);
                });
            }, 1000);

            // Progress item animations
            setTimeout(() => {
                document.querySelectorAll('.progress-item').forEach((item, index) => {
                    setTimeout(() => {
                        item.style.opacity = '0';
                        item.style.transform = 'translateX(-20px)';
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'translateX(0)';
                        }, 100);
                    }, index * 100);
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
            .tool-card, .progress-item, .meta-item { transition: var(--transition) !important; }
            @media (hover: hover) and (pointer: fine) {
                .tool-card:hover { transform: translateY(-8px) !important; }
                .progress-item:hover { transform: translateX(4px) !important; }
                .meta-item:hover { transform: translateY(-2px) !important; }
            }
            *:focus-visible { outline: 2px solid var(--primary) !important; outline-offset: 2px !important; }
        `;
        document.head.appendChild(style);
