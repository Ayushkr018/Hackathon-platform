// ADVANCED SCORING SYSTEM
        class ScoringSystem {
            constructor() {
                this.criteria = [];
                this.scores = {};
                this.totalScore = 0;
                this.currentProject = {
                    id: 1,
                    name: 'DeFi Portfolio Tracker',
                    team: 'Blockchain Innovators',
                    avatar: 'DP'
                };
                this.isMobile = window.innerWidth <= 1024;
                this.currentUser = { name: 'Dr. Jane Smith', initials: 'JS', role: 'Senior Judge', id: 'judge_001' };
                this.init();
            }

            init() {
                this.initializeTheme();
                this.setupEventListeners();
                this.loadCriteria();
                this.renderCriteria();
                this.loadRecentScores();
                this.updateQuickStats();
                this.initializeUser();
                this.handleResize();
                this.loadSavedScores();
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

            loadCriteria() {
                this.criteria = [
                    {
                        id: 1,
                        name: 'Innovation & Creativity',
                        weight: 25,
                        description: 'Uniqueness of the solution, creative approach to problem-solving, and novel implementation ideas.',
                        maxScore: 10
                    },
                    {
                        id: 2,
                        name: 'Technical Implementation',
                        weight: 30,
                        description: 'Code quality, architecture design, use of appropriate technologies, and technical complexity.',
                        maxScore: 10
                    },
                    {
                        id: 3,
                        name: 'User Experience & Design',
                        weight: 20,
                        description: 'Interface design, usability, accessibility, and overall user experience quality.',
                        maxScore: 10
                    },
                    {
                        id: 4,
                        name: 'Business Impact',
                        weight: 15,
                        description: 'Market potential, scalability, real-world applicability, and business model viability.',
                        maxScore: 10
                    },
                    {
                        id: 5,
                        name: 'Presentation & Demo',
                        weight: 10,
                        description: 'Quality of project demonstration, clarity of explanation, and presentation skills.',
                        maxScore: 10
                    }
                ];
            }

            renderCriteria() {
                const container = document.getElementById('criteriaList');
                container.innerHTML = '';

                this.criteria.forEach(criteria => {
                    const criteriaDiv = document.createElement('div');
                    criteriaDiv.className = 'criteria-item';
                    criteriaDiv.innerHTML = `
                        <div class="criteria-header-item">
                            <div class="criteria-name">${criteria.name}</div>
                            <div class="criteria-weight">${criteria.weight}%</div>
                        </div>
                        <div class="criteria-description">${criteria.description}</div>
                        <div class="rating-system">
                            <div class="rating-stars" data-criteria="${criteria.id}">
                                ${Array.from({length: criteria.maxScore}, (_, i) => `
                                    <div class="star" data-value="${i + 1}" data-criteria="${criteria.id}" 
                                         onclick="setScore(${criteria.id}, ${i + 1})"
                                         onmouseover="hoverScore(${criteria.id}, ${i + 1})"
                                         onmouseout="clearHover(${criteria.id})"
                                         tabindex="0" role="button" aria-label="Rate ${i + 1} out of ${criteria.maxScore}">
                                        ${i + 1}
                                    </div>
                                `).join('')}
                            </div>
                            <div class="rating-info">
                                <div class="rating-value" id="rating-${criteria.id}">
                                    <i class="fas fa-star"></i>
                                    <span>0/${criteria.maxScore}</span>
                                </div>
                                <div class="rating-description" id="desc-${criteria.id}">Not rated</div>
                            </div>
                        </div>
                    `;
                    container.appendChild(criteriaDiv);
                });
            }

            setScore(criteriaId, score) {
                this.scores[criteriaId] = score;
                this.updateStarDisplay(criteriaId, score);
                this.updateRatingInfo(criteriaId, score);
                this.calculateTotalScore();
                this.updateQuickStats();
                this.autoSave();
                this.showToast(`Scored ${score}/10 for criteria ${criteriaId}`, 'success');
            }

            updateStarDisplay(criteriaId, score) {
                const stars = document.querySelectorAll(`[data-criteria="${criteriaId}"]`);
                stars.forEach((star) => {
                    const starValue = parseInt(star.dataset.value);
                    if (starValue <= score) {
                        star.classList.add('active');
                    } else {
                        star.classList.remove('active');
                    }
                });
            }

            hoverScore(criteriaId, score) {
                const stars = document.querySelectorAll(`[data-criteria="${criteriaId}"]`);
                stars.forEach((star) => {
                    const starValue = parseInt(star.dataset.value);
                    if (starValue <= score) {
                        star.style.borderColor = 'var(--scoring-gold)';
                        star.style.color = 'var(--scoring-gold)';
                        star.style.transform = 'scale(1.05)';
                    } else {
                        star.style.borderColor = '';
                        star.style.color = '';
                        star.style.transform = '';
                    }
                });
            }

            clearHover(criteriaId) {
                const stars = document.querySelectorAll(`[data-criteria="${criteriaId}"]`);
                stars.forEach((star) => {
                    if (!star.classList.contains('active')) {
                        star.style.borderColor = '';
                        star.style.color = '';
                        star.style.transform = '';
                    }
                });
            }

            updateRatingInfo(criteriaId, score) {
                const criteria = this.criteria.find(c => c.id === criteriaId);
                const ratingElement = document.getElementById(`rating-${criteriaId}`);
                const descElement = document.getElementById(`desc-${criteriaId}`);
                
                ratingElement.innerHTML = `
                    <i class="fas fa-star"></i>
                    <span>${score}/${criteria.maxScore}</span>
                `;

                const descriptions = {
                    1: 'Poor', 2: 'Fair', 3: 'Fair', 4: 'Good', 5: 'Good',
                    6: 'Good', 7: 'Very Good', 8: 'Very Good', 9: 'Excellent', 10: 'Outstanding'
                };
                descElement.textContent = descriptions[score] || 'Not rated';
            }

            calculateTotalScore() {
                let totalWeightedScore = 0;
                let totalWeight = 0;

                this.criteria.forEach(criteria => {
                    const score = this.scores[criteria.id] || 0;
                    const weightedScore = (score / criteria.maxScore) * criteria.weight;
                    totalWeightedScore += weightedScore;
                    totalWeight += criteria.weight;
                });

                this.totalScore = totalWeightedScore / totalWeight * 10;
                document.getElementById('totalScore').textContent = this.totalScore.toFixed(1);
            }

            updateQuickStats() {
                const scoredCriteria = Object.keys(this.scores).length;
                const totalCriteria = this.criteria.length;
                const avgScore = this.totalScore;
                const progress = (scoredCriteria / totalCriteria) * 100;

                const stats = [
                    { label: 'Progress', value: `${Math.round(progress)}%`, type: progress === 100 ? 'excellent' : progress > 50 ? 'good' : 'average' },
                    { label: 'Completed', value: `${scoredCriteria}/${totalCriteria}`, type: scoredCriteria === totalCriteria ? 'excellent' : 'average' },
                    { label: 'Average Score', value: avgScore.toFixed(1), type: avgScore >= 8 ? 'excellent' : avgScore >= 6 ? 'good' : 'average' },
                    { label: 'Status', value: progress === 100 ? 'Complete' : 'In Progress', type: progress === 100 ? 'excellent' : 'average' }
                ];

                const container = document.getElementById('quickStats');
                container.innerHTML = '';

                stats.forEach(stat => {
                    const statDiv = document.createElement('div');
                    statDiv.className = 'stat-item';
                    statDiv.innerHTML = `
                        <div class="stat-label">${stat.label}</div>
                        <div class="stat-value-display ${stat.type}">${stat.value}</div>
                    `;
                    container.appendChild(statDiv);
                });
            }

            loadRecentScores() {
                const recentScores = [
                    { project: 'AI Healthcare Assistant', score: 8.7, time: '2 hours ago' },
                    { project: 'Smart City Dashboard', score: 7.2, time: '1 day ago' },
                    { project: 'Green Energy Monitor', score: 9.1, time: '2 days ago' }
                ];

                const container = document.getElementById('recentScores');
                container.innerHTML = '';

                recentScores.forEach(score => {
                    const scoreDiv = document.createElement('div');
                    scoreDiv.className = 'score-item';
                    scoreDiv.innerHTML = `
                        <div class="score-header-item">
                            <div class="score-project">${score.project}</div>
                            <div class="score-time">${score.time}</div>
                        </div>
                        <div class="score-details">Final Score: ${score.score}/10</div>
                    `;
                    container.appendChild(scoreDiv);
                });
            }

            saveDraft() {
                const draftData = {
                    scores: this.scores,
                    totalScore: this.totalScore,
                    projectId: this.currentProject.id,
                    timestamp: Date.now(),
                    status: 'draft'
                };

                localStorage.setItem('scoringDraft', JSON.stringify(draftData));
                this.showToast('Scores saved as draft!', 'success');
            }

            autoSave() {
                if (Object.keys(this.scores).length > 0) {
                    setTimeout(() => {
                        const draftData = {
                            scores: this.scores,
                            totalScore: this.totalScore,
                            projectId: this.currentProject.id,
                            timestamp: Date.now(),
                            autoSave: true
                        };
                        localStorage.setItem('scoringAutoSave', JSON.stringify(draftData));
                    }, 1000);
                }
            }

            loadSavedScores() {
                const savedData = localStorage.getItem('scoringDraft') || localStorage.getItem('scoringAutoSave');
                if (savedData) {
                    const data = JSON.parse(savedData);
                    
                    // Don't load if it's too old (more than 24 hours)
                    if (Date.now() - data.timestamp > 86400000) {
                        localStorage.removeItem('scoringDraft');
                        localStorage.removeItem('scoringAutoSave');
                        return;
                    }

                    if (data.projectId === this.currentProject.id) {
                        this.scores = data.scores || {};
                        this.updateAllScoreDisplays();
                        this.calculateTotalScore();
                        this.updateQuickStats();
                        
                        if (!data.autoSave) {
                            this.showToast('Previous draft loaded', 'info');
                        }
                    }
                }
            }

            updateAllScoreDisplays() {
                Object.entries(this.scores).forEach(([criteriaId, score]) => {
                    this.updateStarDisplay(parseInt(criteriaId), score);
                    this.updateRatingInfo(parseInt(criteriaId), score);
                });
            }

            submitScores() {
                const scoredCriteria = Object.keys(this.scores).length;
                const totalCriteria = this.criteria.length;

                if (scoredCriteria < totalCriteria) {
                    this.showToast(`Please score all ${totalCriteria} criteria before submitting`, 'warning');
                    return;
                }

                if (!confirm('Are you sure you want to submit these scores? This action cannot be undone.')) {
                    return;
                }

                const submissionData = {
                    projectId: this.currentProject.id,
                    projectName: this.currentProject.name,
                    scores: this.scores,
                    totalScore: this.totalScore,
                    judgeId: this.currentUser.id,
                    judgeName: this.currentUser.name,
                    submittedAt: Date.now(),
                    status: 'submitted'
                };

                // Save submission
                const submissions = JSON.parse(localStorage.getItem('scoringSubmissions') || '[]');
                submissions.push(submissionData);
                localStorage.setItem('scoringSubmissions', JSON.stringify(submissions));

                // Clear draft
                localStorage.removeItem('scoringDraft');
                localStorage.removeItem('scoringAutoSave');

                this.showToast('Scores submitted successfully!', 'success');
                
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 2000);
            }

            handleBeforeUnload(event) {
                if (Object.keys(this.scores).length > 0) {
                    event.preventDefault();
                    event.returnValue = 'You have unsaved scores. Are you sure you want to leave?';
                    return 'You have unsaved scores. Are you sure you want to leave?';
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
        let scoringSystem;

        function setScore(criteriaId, score) { scoringSystem.setScore(criteriaId, score); }
        function hoverScore(criteriaId, score) { scoringSystem.hoverScore(criteriaId, score); }
        function clearHover(criteriaId) { scoringSystem.clearHover(criteriaId); }
        function saveDraft() { scoringSystem.saveDraft(); }
        function submitScores() { scoringSystem.submitScores(); }
        function selectProject() { scoringSystem.showToast('Project selector will open...', 'info'); }
        function viewAnalytics() { scoringSystem.showToast('Opening analytics dashboard...', 'info'); }
        function exportScores() { scoringSystem.showToast('Exporting score data...', 'info'); }
        function backToDashboard() { window.location.href = 'dashboard.html'; }

        document.addEventListener('DOMContentLoaded', () => {
            scoringSystem = new ScoringSystem();
            
            // Add entrance animations
            setTimeout(() => {
                document.querySelectorAll('.criteria-item').forEach((item, index) => {
                    setTimeout(() => {
                        item.style.opacity = '0';
                        item.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0)';
                        }, 100);
                    }, index * 150);
                });
            }, 1000);

            // Keyboard support for stars
            document.addEventListener('keydown', (e) => {
                if (e.target.classList.contains('star')) {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        e.target.click();
                    }
                }
            });

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
            .criteria-item, .score-item, .stat-item { transition: var(--transition) !important; }
            .star { transition: var(--transition) !important; }
            .star:active { transform: scale(0.95) !important; }
            @media (hover: hover) and (pointer: fine) {
                .criteria-item:hover { transform: translateY(-4px) !important; }
                .score-item:hover { transform: translateX(4px) !important; }
            }
            *:focus-visible { outline: 2px solid var(--primary) !important; outline-offset: 2px !important; }
        `;
        document.head.appendChild(style);
