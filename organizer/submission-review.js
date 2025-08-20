class ModernSubmissionReviewManager {
            constructor() {
                this.submissions = [];
                this.filters = { status: 'all', category: 'all', score: 'all' };
                this.totalSubmissions = 127;
                this.pendingReviews = 34;
                this.completedReviews = 89;
                this.flaggedSubmissions = 4;
                this.isMobile = window.innerWidth <= 1024;
                this.currentUser = { name: 'Alex Chen', initials: 'AC', role: 'Lead Organizer', id: 'org_001' };
                this.init();
            }

            init() {
                this.initializeTheme();
                this.setupEventListeners();
                this.loadSubmissions();
                this.renderSubmissions();
                this.initializeUser();
                this.handleResize();
                this.initializeAnimations();
            }

            initializeTheme() {
                const savedTheme = localStorage.getItem('theme') || 'dark';
                document.documentElement.setAttribute('data-theme', savedTheme);
                const themeToggle = document.getElementById('themeToggle');
                themeToggle.querySelector('i').className = savedTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
            }

            initializeUser() {
                const userSession = localStorage.getItem('modernOrganizerSession');
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

            loadSubmissions() {
                // Generate mock submission data
                this.submissions = [
                    {
                        id: 1,
                        title: 'AI-Powered Climate Prediction System',
                        team: 'Green AI Innovators',
                        category: 'ai',
                        status: 'pending',
                        score: null,
                        description: 'An advanced machine learning system that predicts climate patterns using satellite data and IoT sensors.',
                        tags: ['AI', 'Climate', 'IoT', 'Python'],
                        submittedAt: '2025-08-27 14:30',
                        githubUrl: 'https://github.com/team/climate-ai',
                        demoUrl: 'https://climate-prediction.demo.com',
                        plagiarismScore: 2,
                        metrics: { innovation: 0, technical: 0, design: 0 }
                    },
                    {
                        id: 2,
                        title: 'Blockchain Supply Chain Tracker',
                        team: 'Chain Masters',
                        category: 'blockchain',
                        status: 'reviewed',
                        score: 92,
                        description: 'Decentralized supply chain tracking system using Ethereum smart contracts for transparency.',
                        tags: ['Blockchain', 'Ethereum', 'Supply Chain', 'Solidity'],
                        submittedAt: '2025-08-27 13:45',
                        githubUrl: 'https://github.com/team/supply-chain',
                        demoUrl: 'https://supply-tracker.demo.com',
                        plagiarismScore: 1,
                        metrics: { innovation: 95, technical: 90, design: 91 }
                    },
                    {
                        id: 3,
                        title: 'Mental Health Support Mobile App',
                        team: 'Wellness Warriors',
                        category: 'mobile',
                        status: 'reviewed',
                        score: 88,
                        description: 'React Native app providing AI-powered mental health support with mood tracking and therapy resources.',
                        tags: ['Mobile', 'React Native', 'Mental Health', 'AI'],
                        submittedAt: '2025-08-27 15:20',
                        githubUrl: 'https://github.com/team/wellness-app',
                        demoUrl: 'https://wellness.demo.com',
                        plagiarismScore: 0,
                        metrics: { innovation: 85, technical: 90, design: 89 }
                    },
                    {
                        id: 4,
                        title: 'Smart City IoT Dashboard',
                        team: 'Urban Tech',
                        category: 'web',
                        status: 'flagged',
                        score: null,
                        description: 'Real-time dashboard for monitoring city infrastructure using IoT sensors and data analytics.',
                        tags: ['IoT', 'Dashboard', 'Smart City', 'Vue.js'],
                        submittedAt: '2025-08-27 12:15',
                        githubUrl: 'https://github.com/team/smart-city',
                        demoUrl: 'https://smart-city.demo.com',
                        plagiarismScore: 15,
                        metrics: { innovation: 0, technical: 0, design: 0 }
                    },
                    {
                        id: 5,
                        title: 'Virtual Reality Learning Platform',
                        team: 'VR Educators',
                        category: 'ai',
                        status: 'pending',
                        score: null,
                        description: 'Immersive VR platform for educational content with AI-driven personalized learning paths.',
                        tags: ['VR', 'Education', 'Unity', 'AI'],
                        submittedAt: '2025-08-27 16:10',
                        githubUrl: 'https://github.com/team/vr-learning',
                        demoUrl: 'https://vr-education.demo.com',
                        plagiarismScore: 3,
                        metrics: { innovation: 0, technical: 0, design: 0 }
                    },
                    {
                        id: 6,
                        title: 'Quantum Computing Simulator',
                        team: 'Quantum Pioneers',
                        category: 'ai',
                        status: 'reviewed',
                        score: 96,
                        description: 'Advanced quantum computing simulator with visual circuit designer and algorithm implementations.',
                        tags: ['Quantum', 'Simulation', 'Python', 'Qiskit'],
                        submittedAt: '2025-08-27 11:30',
                        githubUrl: 'https://github.com/team/quantum-sim',
                        demoUrl: 'https://quantum.demo.com',
                        plagiarismScore: 1,
                        metrics: { innovation: 98, technical: 95, design: 95 }
                    }
                ];
            }

            renderSubmissions() {
                const container = document.getElementById('submissionsGrid');
                container.innerHTML = '';

                const filteredSubmissions = this.filterSubmissions();

                filteredSubmissions.forEach((submission, index) => {
                    const submissionDiv = document.createElement('div');
                    submissionDiv.className = `submission-card ${submission.status}`;
                    submissionDiv.style.opacity = '0';
                    submissionDiv.style.transform = 'translateY(20px)';
                    submissionDiv.innerHTML = `
                        <div class="submission-header">
                            <div class="submission-info">
                                <div class="submission-title">${submission.title}</div>
                                <div class="submission-team">by ${submission.team}</div>
                                <div class="submission-category">
                                    <i class="fas ${this.getCategoryIcon(submission.category)}"></i>
                                    ${this.capitalizeFirst(submission.category)}
                                </div>
                            </div>
                            <div class="submission-status ${submission.status}">
                                ${this.capitalizeFirst(submission.status)}
                            </div>
                        </div>
                        <div class="submission-description">
                            ${submission.description}
                        </div>
                        <div class="submission-tags">
                            ${submission.tags.map(tag => 
                                `<span class="submission-tag ${this.getTagClass(tag)}">${tag}</span>`
                            ).join('')}
                        </div>
                        <div class="submission-metrics">
                            <div class="metric">
                                <div class="metric-value">${submission.metrics.innovation || '–'}</div>
                                <div class="metric-label">Innovation</div>
                            </div>
                            <div class="metric">
                                <div class="metric-value">${submission.metrics.technical || '–'}</div>
                                <div class="metric-label">Technical</div>
                            </div>
                            <div class="metric">
                                <div class="metric-value">${submission.metrics.design || '–'}</div>
                                <div class="metric-label">Design</div>
                            </div>
                        </div>
                        <div class="submission-actions">
                            <button class="btn btn-small btn-secondary" onclick="viewSubmission(${submission.id})">
                                <i class="fas fa-eye"></i>
                                Review
                            </button>
                            <button class="btn btn-small btn-primary" onclick="scoreSubmission(${submission.id})">
                                <i class="fas fa-star"></i>
                                ${submission.score ? 'Edit Score' : 'Score'}
                            </button>
                            ${submission.status === 'flagged' ? 
                                `<button class="btn btn-small btn-danger" onclick="handleFlag(${submission.id})">
                                    <i class="fas fa-flag"></i>
                                    Review Flag
                                </button>` : ''}
                        </div>
                    `;
                    
                    container.appendChild(submissionDiv);

                    // Animate in
                    setTimeout(() => {
                        submissionDiv.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                        submissionDiv.style.opacity = '1';
                        submissionDiv.style.transform = 'translateY(0)';
                    }, index * 100);
                });

                if (filteredSubmissions.length === 0) {
                    container.innerHTML = `
                        <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-muted);">
                            <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                            <h3>No submissions found</h3>
                            <p>Try adjusting your filters or check back later.</p>
                        </div>
                    `;
                }
            }

            filterSubmissions() {
                return this.submissions.filter(submission => {
                    const statusMatch = this.filters.status === 'all' || submission.status === this.filters.status;
                    const categoryMatch = this.filters.category === 'all' || submission.category === this.filters.category;
                    
                    let scoreMatch = true;
                    if (this.filters.score !== 'all' && submission.score !== null) {
                        switch (this.filters.score) {
                            case 'high':
                                scoreMatch = submission.score >= 90;
                                break;
                            case 'medium':
                                scoreMatch = submission.score >= 70 && submission.score < 90;
                                break;
                            case 'low':
                                scoreMatch = submission.score < 70;
                                break;
                        }
                    } else if (this.filters.score !== 'all' && submission.score === null) {
                        scoreMatch = false;
                    }
                    
                    return statusMatch && categoryMatch && scoreMatch;
                });
            }

            getCategoryIcon(category) {
                const icons = {
                    ai: 'fa-robot',
                    blockchain: 'fa-link',
                    mobile: 'fa-mobile-alt',
                    web: 'fa-globe'
                };
                return icons[category] || 'fa-code';
            }

            getTagClass(tag) {
                const tagClasses = {
                    'AI': 'ai',
                    'Blockchain': 'blockchain',
                    'Ethereum': 'blockchain',
                    'Mobile': 'mobile',
                    'React Native': 'mobile',
                    'Web': 'web',
                    'Vue.js': 'web'
                };
                return tagClasses[tag] || '';
            }

            capitalizeFirst(str) {
                return str.charAt(0).toUpperCase() + str.slice(1);
            }

            initializeAnimations() {
                // Enhanced entrance animations
                setTimeout(() => {
                    document.querySelectorAll('.review-stat-card').forEach((card, index) => {
                        setTimeout(() => {
                            card.style.opacity = '0';
                            card.style.transform = 'translateY(30px) scale(0.95)';
                            setTimeout(() => {
                                card.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                                card.style.opacity = '1';
                                card.style.transform = 'translateY(0) scale(1)';
                            }, 100);
                        }, index * 150);
                    });
                }, 500);
            }

            // Filter Functions
            filterSubmissions() {
                this.filters.status = document.getElementById('statusFilter').value;
                this.filters.category = document.getElementById('categoryFilter').value;
                this.filters.score = document.getElementById('scoreFilter').value;
                this.renderSubmissions();
            }

            clearFilters() {
                document.getElementById('statusFilter').value = 'all';
                document.getElementById('categoryFilter').value = 'all';
                document.getElementById('scoreFilter').value = 'all';
                this.filters = { status: 'all', category: 'all', score: 'all' };
                this.renderSubmissions();
                this.showToast('Filters cleared', 'info');
            }

            refreshSubmissions() {
                this.showToast('Refreshing submissions...', 'info');
                setTimeout(() => {
                    this.renderSubmissions();
                    this.showToast('Submissions refreshed successfully!', 'success');
                }, 1500);
            }

            // Stats Functions
            viewAllSubmissions() {
                this.clearFilters();
                this.showToast('Showing all submissions', 'info');
            }

            viewPendingReviews() {
                document.getElementById('statusFilter').value = 'pending';
                this.filterSubmissions();
                this.showToast('Showing pending reviews', 'info');
            }

            viewCompletedReviews() {
                document.getElementById('statusFilter').value = 'reviewed';
                this.filterSubmissions();
                this.showToast('Showing completed reviews', 'info');
            }

            viewFlaggedSubmissions() {
                document.getElementById('statusFilter').value = 'flagged';
                this.filterSubmissions();
                this.showToast('Showing flagged submissions', 'warning');
            }

            // Header Actions
            exportResults() {
                this.showToast('Exporting review results...', 'info');
                
                setTimeout(() => {
                    this.showToast('📊 Review results exported as CSV file!', 'success');
                }, 2500);
            }

            finalizeScores() {
                this.showToast('Finalizing all scores and rankings...', 'info');
                
                setTimeout(() => {
                    this.showToast('🏆 Scores finalized! Leaderboard updated.', 'success');
                }, 3000);
            }

            // Topbar Actions
            aiReviewAssistant() {
                this.showToast('🤖 Activating AI review assistant...', 'info');
                
                setTimeout(() => {
                    this.showToast('✨ AI assistant ready! Auto-scoring 34 pending submissions.', 'success');
                }, 3000);
            }

            runPlagiarismCheck() {
                this.showToast('🔍 Running comprehensive plagiarism check...', 'info');
                
                setTimeout(() => {
                    const flagged = Math.floor(Math.random() * 3) + 1;
                    this.flaggedSubmissions += flagged;
                    document.getElementById('flaggedSubmissions').textContent = this.flaggedSubmissions.toString();
                    this.showToast(`⚠️ Plagiarism check complete! ${flagged} new issues found.`, 'warning');
                }, 4000);
            }

            bulkActions() {
                this.showToast('Opening bulk action panel...', 'info');
            }

            // Submission Actions
            viewSubmission(id) {
                const submission = this.submissions.find(s => s.id === id);
                if (submission) {
                    this.openSubmissionModal(submission);
                }
            }

            scoreSubmission(id) {
                const submission = this.submissions.find(s => s.id === id);
                if (submission) {
                    this.openSubmissionModal(submission, true);
                }
            }

            handleFlag(id) {
                const submission = this.submissions.find(s => s.id === id);
                if (submission) {
                    this.showToast(`Reviewing flagged submission: ${submission.title}`, 'warning');
                }
            }

            openSubmissionModal(submission, focusScoring = false) {
                document.getElementById('modalTitle').textContent = submission.title;
                
                // Load submission content
                document.getElementById('submissionContent').innerHTML = `
                    <div class="submission-detail-header">
                        <div>
                            <h2 class="detail-title">${submission.title}</h2>
                            <div class="detail-meta">
                                <span><i class="fas fa-users"></i> ${submission.team}</span>
                                <span><i class="fas fa-tag"></i> ${this.capitalizeFirst(submission.category)}</span>
                                <span><i class="fas fa-clock"></i> ${submission.submittedAt}</span>
                                ${submission.plagiarismScore > 10 ? 
                                    `<span style="color: var(--danger);"><i class="fas fa-exclamation-triangle"></i> Plagiarism: ${submission.plagiarismScore}%</span>` :
                                    `<span style="color: var(--success);"><i class="fas fa-shield-check"></i> Clean: ${submission.plagiarismScore}%</span>`
                                }
                            </div>
                        </div>
                    </div>
                    
                    <div style="margin-bottom: 2rem;">
                        <h3 style="margin-bottom: 1rem;">Project Description</h3>
                        <p style="line-height: 1.6; color: var(--text-secondary);">${submission.description}</p>
                    </div>
                    
                    <div style="margin-bottom: 2rem;">
                        <h3 style="margin-bottom: 1rem;">Project Links</h3>
                        <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                            <a href="${submission.githubUrl}" target="_blank" class="demo-link">
                                <i class="fab fa-github"></i> GitHub Repository
                            </a>
                            <a href="${submission.demoUrl}" target="_blank" class="demo-link">
                                <i class="fas fa-external-link-alt"></i> Live Demo
                            </a>
                        </div>
                    </div>
                    
                    <div style="margin-bottom: 2rem;">
                        <h3 style="margin-bottom: 1rem;">Technologies Used</h3>
                        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                            ${submission.tags.map(tag => 
                                `<span class="submission-tag ${this.getTagClass(tag)}">${tag}</span>`
                            ).join('')}
                        </div>
                    </div>
                    
                    <div class="code-preview">
                        <h4 style="margin-bottom: 1rem; color: #e2e8f0;">Sample Code Preview</h4>
                        <pre><code class="language-python"># AI Climate Prediction System
import tensorflow as tf
import numpy as np
from sklearn.preprocessing import StandardScaler

class ClimatePredictionModel:
    def __init__(self, input_shape):
        self.model = self.build_model(input_shape)
        self.scaler = StandardScaler()
    
    def build_model(self, input_shape):
        model = tf.keras.Sequential([
            tf.keras.layers.LSTM(128, return_sequences=True, input_shape=input_shape),
            tf.keras.layers.Dropout(0.2),
            tf.keras.layers.LSTM(64, return_sequences=False),
            tf.keras.layers.Dense(50, activation='relu'),
            tf.keras.layers.Dense(1, activation='linear')
        ])
        model.compile(optimizer='adam', loss='mse', metrics=['mae'])
        return model
    
    def predict_temperature(self, sensor_data):
        scaled_data = self.scaler.transform(sensor_data)
        prediction = self.model.predict(scaled_data)
        return prediction[0][0]</code></pre>
                    </div>
                `;
                
                // Load scoring sidebar
                document.getElementById('submissionSidebar').innerHTML = `
                    <div class="scoring-section">
                        <h3 class="scoring-title">Evaluation Scoring</h3>
                        
                        <div class="score-item">
                            <span class="score-label">Innovation (30%)</span>
                            <input type="number" class="score-input" id="innovationScore" 
                                   min="0" max="100" value="${submission.metrics.innovation || 0}">
                        </div>
                        
                        <div class="score-item">
                            <span class="score-label">Technical Excellence (40%)</span>
                            <input type="number" class="score-input" id="technicalScore" 
                                   min="0" max="100" value="${submission.metrics.technical || 0}">
                        </div>
                        
                        <div class="score-item">
                            <span class="score-label">Design & UX (30%)</span>
                            <input type="number" class="score-input" id="designScore" 
                                   min="0" max="100" value="${submission.metrics.design || 0}">
                        </div>
                        
                        <div class="total-score" id="totalScore">
                            Total Score: ${submission.score || 0}/100
                        </div>
                    </div>
                    
                    <div style="margin-top: 2rem;">
                        <h4 style="margin-bottom: 1rem;">AI Insights</h4>
                        <div style="background: var(--bg-glass); padding: 1rem; border-radius: 12px; font-size: 0.85rem; line-height: 1.5;">
                            <strong>✨ AI Analysis:</strong> This project demonstrates strong technical implementation with innovative use of LSTM networks for climate prediction. The code quality is excellent with proper error handling and documentation.
                        </div>
                    </div>
                    
                    <div style="margin-top: 1.5rem; display: flex; flex-direction: column; gap: 1rem;">
                        <button class="btn btn-success" onclick="saveScore(${submission.id})">
                            <i class="fas fa-save"></i>
                            Save Score
                        </button>
                        <button class="btn btn-primary" onclick="generateFeedback(${submission.id})">
                            <i class="fas fa-comment"></i>
                            Generate Feedback
                        </button>
                        <button class="btn btn-secondary" onclick="requestPeerReview(${submission.id})">
                            <i class="fas fa-users"></i>
                            Peer Review
                        </button>
                    </div>
                `;
                
                // Add event listeners for score calculation
                ['innovationScore', 'technicalScore', 'designScore'].forEach(id => {
                    document.getElementById(id).addEventListener('input', this.calculateTotalScore);
                });
                
                document.getElementById('submissionModal').classList.add('active');
            }

            closeSubmissionModal() {
                document.getElementById('submissionModal').classList.remove('active');
            }

            calculateTotalScore() {
                const innovation = parseInt(document.getElementById('innovationScore').value) || 0;
                const technical = parseInt(document.getElementById('technicalScore').value) || 0;
                const design = parseInt(document.getElementById('designScore').value) || 0;
                
                const total = Math.round((innovation * 0.3) + (technical * 0.4) + (design * 0.3));
                document.getElementById('totalScore').textContent = `Total Score: ${total}/100`;
            }

            saveScore(id) {
                const submission = this.submissions.find(s => s.id === id);
                if (submission) {
                    const innovation = parseInt(document.getElementById('innovationScore').value) || 0;
                    const technical = parseInt(document.getElementById('technicalScore').value) || 0;
                    const design = parseInt(document.getElementById('designScore').value) || 0;
                    const total = Math.round((innovation * 0.3) + (technical * 0.4) + (design * 0.3));
                    
                    submission.metrics = { innovation, technical, design };
                    submission.score = total;
                    submission.status = 'reviewed';
                    
                    this.pendingReviews = Math.max(0, this.pendingReviews - 1);
                    this.completedReviews++;
                    
                    document.getElementById('pendingReviews').textContent = this.pendingReviews.toString();
                    document.getElementById('completedReviews').textContent = this.completedReviews.toString();
                    document.getElementById('pendingCount').textContent = this.pendingReviews.toString();
                    
                    this.closeSubmissionModal();
                    this.renderSubmissions();
                    this.showToast(`Score saved: ${total}/100 for ${submission.title}`, 'success');
                }
            }

            generateFeedback(id) {
                this.showToast('🤖 AI generating detailed feedback...', 'info');
                
                setTimeout(() => {
                    this.showToast('✨ Comprehensive feedback generated and sent to team!', 'success');
                }, 2500);
            }

            requestPeerReview(id) {
                this.showToast('📝 Requesting peer review from additional judges...', 'info');
                
                setTimeout(() => {
                    this.showToast('👥 Peer review request sent to 3 expert judges!', 'success');
                }, 2000);
            }

            backToDashboard() {
                window.location.href = 'dashboard.html';
            }

            showToast(message, type = 'success') {
                const existingToast = document.querySelector('.toast');
                if (existingToast) existingToast.remove();
                
                const toast = document.createElement('div');
                toast.className = `toast ${type}`;
                toast.style.cssText = `
                    position: fixed; top: 2rem; right: 2rem; padding: 1rem 1.5rem;
                    border-radius: 12px; color: white; font-weight: 500; z-index: 10001;
                    animation: slideInToast 0.3s ease-out; max-width: 450px;
                    box-shadow: var(--shadow-lg); background: var(--gradient-${type});
                `;
                
                if (window.innerWidth <= 768) {
                    toast.style.top = '1rem'; toast.style.right = '1rem';
                    toast.style.left = '1rem'; toast.style.maxWidth = 'none';
                }
                
                toast.innerHTML = `<i class="fas ${this.getToastIcon(type)}"></i><span style="margin-left: 0.5rem;">${message}</span>`;
                document.body.appendChild(toast);
                setTimeout(() => { if (toast.parentNode) toast.remove(); }, 6000);
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
        let modernSubmissionReviewManager;

        function filterSubmissions() { modernSubmissionReviewManager.filterSubmissions(); }
        function clearFilters() { modernSubmissionReviewManager.clearFilters(); }
        function refreshSubmissions() { modernSubmissionReviewManager.refreshSubmissions(); }
        function viewAllSubmissions() { modernSubmissionReviewManager.viewAllSubmissions(); }
        function viewPendingReviews() { modernSubmissionReviewManager.viewPendingReviews(); }
        function viewCompletedReviews() { modernSubmissionReviewManager.viewCompletedReviews(); }
        function viewFlaggedSubmissions() { modernSubmissionReviewManager.viewFlaggedSubmissions(); }
        function exportResults() { modernSubmissionReviewManager.exportResults(); }
        function finalizeScores() { modernSubmissionReviewManager.finalizeScores(); }
        function aiReviewAssistant() { modernSubmissionReviewManager.aiReviewAssistant(); }
        function runPlagiarismCheck() { modernSubmissionReviewManager.runPlagiarismCheck(); }
        function bulkActions() { modernSubmissionReviewManager.bulkActions(); }
        function viewSubmission(id) { modernSubmissionReviewManager.viewSubmission(id); }
        function scoreSubmission(id) { modernSubmissionReviewManager.scoreSubmission(id); }
        function handleFlag(id) { modernSubmissionReviewManager.handleFlag(id); }
        function closeSubmissionModal() { modernSubmissionReviewManager.closeSubmissionModal(); }
        function saveScore(id) { modernSubmissionReviewManager.saveScore(id); }
        function generateFeedback(id) { modernSubmissionReviewManager.generateFeedback(id); }
        function requestPeerReview(id) { modernSubmissionReviewManager.requestPeerReview(id); }
        function backToDashboard() { modernSubmissionReviewManager.backToDashboard(); }

        document.addEventListener('DOMContentLoaded', () => {
            modernSubmissionReviewManager = new ModernSubmissionReviewManager();
            
            // Performance optimization for mobile
            if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                document.body.classList.add('mobile-device');
                const style = document.createElement('style');
                                style.textContent = `.mobile-device * { animation-duration: 0.2s !important; transition-duration: 0.2s !important; }`;
                document.head.appendChild(style);
            }

            // Auto-save user session
            setInterval(() => {
                const sessionData = {
                    name: modernSubmissionReviewManager.currentUser.name,
                    initials: modernSubmissionReviewManager.currentUser.initials,
                    role: modernSubmissionReviewManager.currentUser.role,
                    lastActive: Date.now()
                };
                localStorage.setItem('modernOrganizerSession', JSON.stringify(sessionData));
            }, 60000);

            // Keyboard shortcuts for submission review
            document.addEventListener('keydown', (e) => {
                if (e.ctrlKey || e.metaKey) {
                    switch(e.key) {
                        case 'f':
                            e.preventDefault();
                            document.getElementById('statusFilter').focus();
                            break;
                        case 'r':
                            e.preventDefault();
                            refreshSubmissions();
                            break;
                        case 'a':
                            e.preventDefault();
                            aiReviewAssistant();
                            break;
                        case 'p':
                            e.preventDefault();
                            runPlagiarismCheck();
                            break;
                        case 'e':
                            e.preventDefault();
                            exportResults();
                            break;
                    }
                }
                if (e.key === 'Escape') {
                    closeSubmissionModal();
                }
            });

            // Auto-update submission status
            setInterval(() => {
                if (Math.random() > 0.8 && modernSubmissionReviewManager.pendingReviews > 0) {
                    // Simulate a review completion
                    modernSubmissionReviewManager.pendingReviews--;
                    modernSubmissionReviewManager.completedReviews++;
                    
                    document.getElementById('pendingReviews').textContent = modernSubmissionReviewManager.pendingReviews.toString();
                    document.getElementById('completedReviews').textContent = modernSubmissionReviewManager.completedReviews.toString();
                    document.getElementById('pendingCount').textContent = modernSubmissionReviewManager.pendingReviews.toString();
                }
            }, 45000); // Every 45 seconds

            // Initialize Prism.js for code highlighting
            if (typeof Prism !== 'undefined') {
                Prism.highlightAll();
            }

            // Auto-save modal scores
            document.addEventListener('input', (e) => {
                if (e.target.classList.contains('score-input')) {
                    // Auto-save score inputs
                    const submissionId = e.target.closest('.submission-modal-content')?.dataset?.submissionId;
                    if (submissionId) {
                        localStorage.setItem(`score_${submissionId}`, JSON.stringify({
                            innovation: document.getElementById('innovationScore')?.value || 0,
                            technical: document.getElementById('technicalScore')?.value || 0,
                            design: document.getElementById('designScore')?.value || 0,
                            timestamp: Date.now()
                        }));
                    }
                }
            });

            // Real-time collaboration for judges
            setInterval(() => {
                // Simulate real-time updates from other judges
                if (Math.random() > 0.9) {
                    const activities = [
                        'Judge Sarah completed review for "Smart City Dashboard"',
                        'Judge Mike flagged potential plagiarism in "VR Learning"',
                        'Judge Lisa scored "Climate AI" with 94/100',
                        'Judge David requested peer review for "Quantum Simulator"'
                    ];
                    
                    const activity = activities[Math.floor(Math.random() * activities.length)];
                    modernSubmissionReviewManager.showToast(`📝 ${activity}`, 'info');
                }
            }, 60000); // Every minute

            // Advanced search functionality
            const searchInput = document.createElement('input');
            searchInput.type = 'text';
            searchInput.placeholder = 'Search submissions...';
            searchInput.style.cssText = `
                background: var(--bg-glass); border: 1px solid var(--border); border-radius: 12px;
                padding: 0.75rem 1rem; color: var(--text-primary); font-size: 0.9rem;
                transition: var(--transition); outline: none; width: 250px;
            `;
            
            searchInput.addEventListener('input', (e) => {
                const searchTerm = e.target.value.toLowerCase();
                const cards = document.querySelectorAll('.submission-card');
                
                cards.forEach(card => {
                    const title = card.querySelector('.submission-title').textContent.toLowerCase();
                    const team = card.querySelector('.submission-team').textContent.toLowerCase();
                    const description = card.querySelector('.submission-description').textContent.toLowerCase();
                    
                    const matches = title.includes(searchTerm) || 
                                   team.includes(searchTerm) || 
                                   description.includes(searchTerm);
                    
                    card.style.display = matches ? 'block' : 'none';
                });
            });

            // Add search to filters
            const filtersElement = document.querySelector('.review-filters');
            if (filtersElement) {
                const searchGroup = document.createElement('div');
                searchGroup.className = 'filter-group';
                searchGroup.innerHTML = '<span class="filter-label">Search:</span>';
                searchGroup.appendChild(searchInput);
                filtersElement.insertBefore(searchGroup, filtersElement.querySelector('.filter-actions'));
            }
        });

        // Enhanced animations and performance styles
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
            
            /* Enhanced submission review animations */
            .review-stat-card, .submission-card { transition: var(--transition) !important; }
            @media (hover: hover) and (pointer: fine) {
                .review-stat-card:hover { 
                    transform: translateY(-8px) scale(1.02) !important;
                    box-shadow: var(--shadow-lg) !important;
                }
                .submission-card:hover { 
                    transform: translateY(-6px) !important;
                    box-shadow: var(--shadow-lg) !important;
                }
            }
            
            /* Enhanced review status */
            .review-status {
                position: relative;
                overflow: hidden;
            }
            .review-status::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
                animation: reviewStatusSweep 3s infinite;
            }
            
            @keyframes reviewStatusSweep {
                0% { left: -100%; }
                100% { left: 100%; }
            }
            
            /* Enhanced pending count */
            .pending-count {
                position: relative;
                overflow: hidden;
            }
            .pending-count::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
                animation: pendingCountPulse 2s infinite;
            }
            
            @keyframes pendingCountPulse {
                0% { left: -100%; }
                100% { left: 100%; }
            }
            
            /* Enhanced submission status indicators */
            .submission-status.pending {
                position: relative;
                animation: pendingBlink 2s infinite;
            }
            
            @keyframes pendingBlink {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.6; }
            }
            
            .submission-status.flagged {
                animation: flaggedAlert 1.5s infinite;
            }
            
            @keyframes flaggedAlert {
                0%, 100% { background: rgba(245, 158, 11, 0.15); }
                50% { background: rgba(239, 68, 68, 0.15); }
            }
            
            /* Enhanced submission metrics */
            .metric {
                position: relative;
                overflow: hidden;
            }
            .metric::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(249, 115, 22, 0.1), transparent);
                transition: var(--transition);
            }
            .submission-card:hover .metric::before {
                left: 100%;
            }
            
            /* Enhanced code preview */
            .code-preview {
                position: relative;
            }
            .code-preview::before {
                content: 'CODE';
                position: absolute;
                top: 10px;
                right: 15px;
                font-size: 0.7rem;
                font-weight: 700;
                color: rgba(226, 232, 240, 0.5);
                letter-spacing: 2px;
            }
            
            /* Enhanced scoring section */
            .scoring-section {
                position: relative;
            }
            .scoring-section::before {
                content: '';
                position: absolute;
                top: -2px;
                left: -2px;
                right: -2px;
                bottom: -2px;
                background: var(--gradient-review);
                border-radius: inherit;
                z-index: -1;
                opacity: 0.1;
            }
            
            /* Enhanced score inputs */
            .score-input {
                position: relative;
                background: var(--bg-glass);
                border: 2px solid var(--border);
                color: var(--text-primary);
                font-weight: 700;
                transition: var(--transition);
            }
            .score-input:focus {
                border-color: var(--border-review);
                box-shadow: 0 0 0 4px rgba(249, 115, 22, 0.15);
                transform: scale(1.05);
            }
            
            /* Enhanced total score */
            .total-score {
                position: relative;
                overflow: hidden;
            }
            .total-score::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
                animation: totalScoreShine 3s infinite;
            }
            
            @keyframes totalScoreShine {
                0% { left: -100%; }
                100% { left: 100%; }
            }
            
            /* Enhanced submission tags */
            .submission-tag {
                position: relative;
                overflow: hidden;
                transition: var(--transition);
            }
            .submission-tag::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
                transition: var(--transition-fast);
            }
            .submission-card:hover .submission-tag::before {
                left: 100%;
            }
            
            /* Enhanced modal animations */
            .submission-modal-content {
                animation: submissionModalSlide 0.4s ease-out;
            }
            
            @keyframes submissionModalSlide {
                from { 
                    opacity: 0; 
                    transform: scale(0.9) translateY(-20px); 
                }
                to { 
                    opacity: 1; 
                    transform: scale(1) translateY(0); 
                }
            }
            
            /* Enhanced filter selects */
            .filter-select:focus {
                border-color: var(--border-focus);
                box-shadow: var(--shadow-focus);
                background: linear-gradient(145deg, var(--bg-glass), rgba(249, 115, 22, 0.05));
            }
            
            /* Real-time collaboration indicators */
            .collaboration-indicator {
                position: fixed;
                bottom: 2rem;
                right: 2rem;
                background: var(--gradient-ai);
                color: white;
                padding: 0.75rem 1rem;
                border-radius: 25px;
                font-size: 0.85rem;
                font-weight: 600;
                box-shadow: var(--shadow-lg);
                animation: collaborationPulse 2s infinite;
                z-index: 1000;
            }
            
            @keyframes collaborationPulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }
            
            /* Performance optimizations */
            .submissions-grid, .submission-modal-content {
                contain: layout style paint;
            }
            
            /* Enhanced mobile submission grid */
            @media (max-width: 768px) {
                .submissions-grid {
                    grid-template-columns: 1fr !important;
                }
                .submission-modal-content {
                    width: 98vw !important;
                    height: 95vh !important;
                }
                .submission-modal-body {
                    flex-direction: column !important;
                }
                .submission-sidebar {
                    width: 100% !important;
                    max-height: 300px !important;
                }
                .review-filters {
                    flex-direction: column !important;
                    gap: 1rem !important;
                }
                .filter-group {
                    width: 100%;
                }
                .filter-select {
                    width: 100%;
                }
            }
            
            /* Enhanced submission cards based on status */
            .submission-card.pending {
                position: relative;
            }
            .submission-card.pending::after {
                content: '';
                position: absolute;
                left: 0;
                top: 0;
                bottom: 0;
                width: 4px;
                background: linear-gradient(to bottom, var(--danger), transparent);
                animation: pendingGlow 2s infinite;
            }
            
            @keyframes pendingGlow {
                0%, 100% { opacity: 0.5; }
                50% { opacity: 1; }
            }
            
            .submission-card.reviewed {
                position: relative;
            }
            .submission-card.reviewed::after {
                content: '';
                position: absolute;
                left: 0;
                top: 0;
                bottom: 0;
                width: 4px;
                background: var(--success);
                opacity: 0.8;
            }
            
            .submission-card.flagged {
                position: relative;
                animation: flaggedCardAlert 3s infinite;
            }
            
            @keyframes flaggedCardAlert {
                0%, 100% { box-shadow: var(--shadow-md); }
                50% { box-shadow: 0 0 20px rgba(245, 158, 11, 0.4); }
            }
            
            /* Enhanced search input */
            .filter-group input[type="text"]:focus {
                border-color: var(--border-focus);
                box-shadow: var(--shadow-focus);
                transform: translateY(-2px);
            }
            
            /* Loading states for submissions */
            .loading-submission {
                position: relative;
                overflow: hidden;
            }
            .loading-submission::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(249, 115, 22, 0.2), transparent);
                animation: submissionLoadingShimmer 1.5s infinite;
            }
            
            @keyframes submissionLoadingShimmer {
                0% { left: -100%; }
                100% { left: 100%; }
            }
            
            /* Enhanced AI insights */
            .ai-insights {
                position: relative;
                background: linear-gradient(145deg, var(--bg-ai), rgba(139, 92, 246, 0.1));
                border: 1px solid rgba(139, 92, 246, 0.2);
            }
            .ai-insights::before {
                content: '✨';
                position: absolute;
                top: 0.75rem;
                left: 0.75rem;
                font-size: 1rem;
                animation: aiSparkle 2s infinite;
            }
            
            @keyframes aiSparkle {
                0%, 100% { opacity: 0.5; transform: scale(1); }
                50% { opacity: 1; transform: scale(1.2); }
            }
        `;
        document.head.appendChild(style);
