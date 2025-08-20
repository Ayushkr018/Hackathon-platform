 class EvaluationSystem {
            constructor() {
                this.evaluationData = {};
                this.startTime = Date.now() - 2730000; // 45:30 ago
                this.progress = 25;
                this.isMobile = window.innerWidth <= 1024;
                this.currentUser = {
                    name: 'Dr. Jane Smith',
                    initials: 'JS',
                    role: 'Senior Judge',
                    id: 'judge_001'
                };
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
                window.addEventListener('beforeunload', (e) => this.handleBeforeUnload(e));
                
                // Auto-save every 2 minutes
                setInterval(() => {
                    this.autoSave();
                }, 120000);

                // Keyboard shortcuts
                document.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape') {
                        this.closeMobileSidebar();
                    }
                    if (e.ctrlKey) {
                        switch(e.key) {
                            case 's':
                                e.preventDefault();
                                this.saveProgress();
                                break;
                            case 'e':
                                e.preventDefault();
                                this.exportEvaluation();
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

            // ✅ REALISTIC TIMER
            startTimer() {
                setInterval(() => {
                    const elapsed = Date.now() - this.startTime;
                    const minutes = Math.floor(elapsed / 60000);
                    const seconds = Math.floor((elapsed % 60000) / 1000);
                    const timer = document.getElementById('evaluationTimer');
                    timer.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
                    
                    // Change color based on time elapsed
                    if (minutes >= 60) {
                        timer.style.color = '#ef4444';
                    } else if (minutes >= 45) {
                        timer.style.color = '#f59e0b';
                    } else {
                        timer.style.color = 'white';
                    }
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
                        },
                        notes: [],
                        scores: {},
                        feedback: {}
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
                    progressElement.style.background = 'var(--gradient-evaluation)';
                }
            }

            // ✅ REALISTIC SAVE PROGRESS WITH LOADER
            saveProgress() {
                this.showLoader();
                
                setTimeout(() => {
                    const saveData = {
                        ...this.evaluationData,
                        lastSaved: Date.now(),
                        progress: this.progress,
                        savedBy: this.currentUser.name
                    };

                    localStorage.setItem(`evaluation_${this.currentProject.id}`, JSON.stringify(saveData));
                    this.completeLoader();
                    this.showToast('💾 Evaluation progress saved successfully with all data preserved!', 'success');
                }, 1500);
            }

            // ✅ REALISTIC AUTO-SAVE
            autoSave() {
                if (Object.keys(this.evaluationData).length > 0) {
                    const saveData = {
                        ...this.evaluationData,
                        autoSaved: Date.now(),
                        progress: this.progress
                    };
                    localStorage.setItem(`evaluation_autosave_${this.currentProject.id}`, JSON.stringify(saveData));
                    this.showToast('🔄 Auto-saved evaluation data', 'info');
                }
            }

            // ✅ REALISTIC CONTINUE EVALUATION
            continueEvaluation() {
                const stages = this.evaluationData.stages;
                
                this.showLoader();
                
                setTimeout(() => {
                    this.completeLoader();
                    
                    if (!stages.detailedScoring.completed) {
                        this.showToast('🎯 Redirecting to comprehensive scoring system...', 'info');
                        setTimeout(() => window.location.href = 'scoring.html', 1000);
                    } else if (!stages.teamInterview.completed) {
                        this.showToast('🎥 Starting professional video interview session...', 'info');
                        setTimeout(() => window.location.href = 'video-interview.html', 1000);
                    } else if (!stages.finalReport.completed) {
                        this.showToast('📝 Opening final report and feedback editor...', 'info');
                        setTimeout(() => window.location.href = 'feedback.html', 1000);
                    } else {
                        this.showToast('✅ All stages completed! Ready for final evaluation submission.', 'success');
                    }
                }, 1500);
            }

            // ✅ REALISTIC FINALIZE EVALUATION
            finalizeEvaluation() {
                if (this.progress < 80) {
                    this.showToast('⚠️ Please complete at least 80% of the evaluation before finalizing', 'warning');
                    return;
                }

                const modal = document.createElement('div');
                modal.className = 'modal active';
                modal.style.cssText = `
                    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                    background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center;
                    z-index: 10000; backdrop-filter: blur(15px);
                `;
                
                modal.innerHTML = `
                    <div style="background: var(--bg-card); border-radius: 20px; padding: 2.5rem; max-width: 600px; width: 90%; text-align: center;">
                        <div style="font-size: 4rem; margin-bottom: 1.5rem;">🏁</div>
                        <h3 style="margin-bottom: 1rem; color: var(--text-primary); font-size: 1.5rem;">Finalize Evaluation</h3>
                        <p style="margin-bottom: 1rem; color: var(--text-secondary); line-height: 1.6;">
                            You are about to finalize the evaluation for "<strong style="color: var(--text-primary);">${this.currentProject.name}</strong>".
                        </p>
                        <div style="background: var(--bg-glass); padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem; text-align: left;">
                            <h4 style="color: var(--text-primary); margin-bottom: 1rem;">Evaluation Summary:</h4>
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; font-size: 0.9rem;">
                                <div>Progress: <strong style="color: var(--primary);">${this.progress}%</strong></div>
                                <div>Judge: <strong style="color: var(--primary);">${this.currentUser.name}</strong></div>
                                <div>Project: <strong style="color: var(--primary);">${this.currentProject.team}</strong></div>
                                <div>Category: <strong style="color: var(--primary);">${this.currentProject.category}</strong></div>
                            </div>
                        </div>
                        <p style="margin-bottom: 2rem; color: var(--text-muted); font-size: 0.85rem;">
                            ⚠️ This action cannot be undone. The evaluation will be submitted for final review.
                        </p>
                        <div style="display: flex; gap: 1rem; justify-content: center;">
                            <button onclick="this.closest('.modal').remove()" 
                                style="padding: 0.75rem 1.5rem; border: 1px solid var(--border); border-radius: 8px; 
                                background: var(--bg-glass); color: var(--text-primary); cursor: pointer;">Cancel</button>
                            <button onclick="evaluationSystem.confirmFinalize(); this.closest('.modal').remove();" 
                                style="padding: 0.75rem 1.5rem; border: none; border-radius: 8px; 
                                background: var(--gradient-success); color: white; cursor: pointer;">Finalize Evaluation</button>
                        </div>
                    </div>
                `;
                
                document.body.appendChild(modal);
            }

            confirmFinalize() {
                this.showLoader();
                
                setTimeout(() => {
                    const finalData = {
                        ...this.evaluationData,
                        status: 'finalized',
                        finalizedAt: Date.now(),
                        finalizedBy: this.currentUser.id,
                        totalTime: Date.now() - this.startTime,
                        finalProgress: this.progress,
                        submissionId: `EVAL-${Date.now()}-${this.currentProject.id}`
                    };

                    // Save to submissions
                    const submissions = JSON.parse(localStorage.getItem('evaluationSubmissions') || '[]');
                    submissions.push(finalData);
                    localStorage.setItem('evaluationSubmissions', JSON.stringify(submissions));

                    // Clear current evaluation
                    localStorage.removeItem(`evaluation_${this.currentProject.id}`);
                    localStorage.removeItem(`evaluation_autosave_${this.currentProject.id}`);

                    this.completeLoader();
                    this.showToast('🎉 Evaluation finalized successfully! Submission ID: ' + finalData.submissionId, 'success');
                    
                    setTimeout(() => {
                        window.location.href = 'dashboard.html';
                    }, 3000);
                }, 2500);
            }

            // ✅ REALISTIC EXPORT EVALUATION
            exportEvaluation() {
                this.showLoader();
                
                setTimeout(() => {
                    const exportData = {
                        nexusHackEvaluation: {
                            project: {
                                ...this.currentProject,
                                submittedAt: new Date(Date.now() - 7200000).toISOString(),
                                description: "A comprehensive decentralized finance portfolio tracking application"
                            },
                            judge: {
                                ...this.currentUser,
                                evaluationId: `JUDGE-${this.currentUser.id}-${Date.now()}`
                            },
                            evaluation: this.evaluationData,
                            progress: this.progress,
                            metadata: {
                                platform: 'NexusHack Professional',
                                version: '2.0',
                                exportedAt: new Date().toISOString(),
                                totalTimeSpent: this.formatTime(Date.now() - this.startTime),
                                evaluationStage: this.progress >= 80 ? 'Ready for Finalization' : 'In Progress'
                            }
                        }
                    };

                    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `nexushack-evaluation-${this.currentProject.name.replace(/\s+/g, '_')}-${new Date().toISOString().split('T')[0]}.json`;
                    a.style.display = 'none';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                    
                    this.completeLoader();
                    this.showToast('📥 Complete evaluation data exported with metadata and progress tracking!', 'success');
                }, 2000);
            }

            formatTime(milliseconds) {
                const hours = Math.floor(milliseconds / 3600000);
                const minutes = Math.floor((milliseconds % 3600000) / 60000);
                return `${hours}h ${minutes}m`;
            }

            handleBeforeUnload(event) {
                if (this.progress > 0 && this.progress < 100) {
                    event.preventDefault();
                    event.returnValue = 'You have an evaluation in progress. Are you sure you want to leave? Your progress will be auto-saved.';
                    return 'You have an evaluation in progress. Are you sure you want to leave? Your progress will be auto-saved.';
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
                
                // Auto hide after 5 seconds for important messages
                const autoHideTimer = setTimeout(() => {
                    if (toast.parentNode) {
                        toast.style.opacity = '0';
                        setTimeout(() => {
                            if (toast.parentNode) {
                                toast.remove();
                            }
                        }, 300);
                    }
                }, type === 'success' && message.includes('finalized') ? 8000 : 5000);
                
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
        let evaluationSystem;

        function saveProgress() { evaluationSystem.saveProgress(); }
        function continueEvaluation() { evaluationSystem.continueEvaluation(); }
        function finalizeEvaluation() { evaluationSystem.finalizeEvaluation(); }
        function exportEvaluation() { evaluationSystem.exportEvaluation(); }

        function backToDashboard() {
            evaluationSystem.showToast('🏠 Returning to main dashboard...', 'info');
            evaluationSystem.showLoader();
            
            setTimeout(() => {
                evaluationSystem.completeLoader();
                window.location.href = 'dashboard.html';
            }, 1000);
        }

        // Initialize the application
        document.addEventListener('DOMContentLoaded', () => {
            evaluationSystem = new EvaluationSystem();
            
            // Add entrance animations
            setTimeout(() => {
                document.querySelectorAll('.tool-card').forEach((card, index) => {
                    setTimeout(() => {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(30px)';
                        setTimeout(() => {
                            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
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
                        item.style.transform = 'translateX(-30px)';
                        setTimeout(() => {
                            item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                            item.style.opacity = '1';
                            item.style.transform = 'translateX(0)';
                        }, 100);
                    }, index * 100);
                });
            }, 1500);

            // Meta item animations
            setTimeout(() => {
                document.querySelectorAll('.meta-item').forEach((item, index) => {
                    setTimeout(() => {
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.9)';
                        setTimeout(() => {
                            item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                        }, 100);
                    }, index * 75);
                });
            }, 2000);

            // Performance optimization for mobile
            if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                document.body.classList.add('mobile-device');
            }

            // Welcome message
            setTimeout(() => {
                evaluationSystem.showToast('📋 Project Evaluation workspace loaded! Comprehensive assessment tools ready for professional judging.', 'success');
            }, 2500);
        });