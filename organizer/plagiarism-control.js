   class ModernPlagiarismManager {
            constructor() {
                this.detections = [];
                this.scanHistory = [];
                this.aiRecommendations = [];
                this.chart = null;
                this.sensitivity = 70;
                this.scanMode = 'realtime';
                this.isScanning = true;
                this.scanInterval = null;
                this.isMobile = window.innerWidth <= 1024;
                this.currentUser = { name: 'Alex Chen', initials: 'AC', role: 'Lead Organizer', id: 'org_001' };
                this.init();
            }

            init() {
                this.initializeTheme();
                this.setupEventListeners();
                this.loadDetections();
                this.loadScanHistory();
                this.loadAIRecommendations();
                this.renderDetections();
                this.renderScanHistory();
                this.renderAIRecommendations();
                this.initializeChart();
                this.initializeUser();
                this.handleResize();
                this.startRealTimeScanning();
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
                
                // Resize chart
                if (this.chart) this.chart.resize();
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
                
                // Update chart colors
                this.updateChartTheme(newTheme);
                this.showToast(`Theme changed to ${newTheme} mode`, 'success');
            }

            loadDetections() {
                // Generate mock plagiarism detection data
                this.detections = [
                    {
                        id: 1,
                        teamA: 'AI Innovators',
                        teamB: 'Data Dynamos',
                        similarity: 89.7,
                        risk: 'high-risk',
                        linesMatched: 247,
                        functionsMatched: 12,
                        algorithmSimilarity: 94.2,
                        structureSimilarity: 85.3,
                        flaggedAt: '2 hours ago',
                        reviewStatus: 'pending'
                    },
                    {
                        id: 2,
                        teamA: 'Mobile Wizards',
                        teamB: 'App Masters',
                        similarity: 76.4,
                        risk: 'medium-risk',
                        linesMatched: 189,
                        functionsMatched: 8,
                        algorithmSimilarity: 81.7,
                        structureSimilarity: 71.2,
                        flaggedAt: '4 hours ago',
                        reviewStatus: 'reviewing'
                    },
                    {
                        id: 3,
                        teamA: 'Blockchain Masters',
                        teamB: 'Crypto Kings',
                        similarity: 92.1,
                        risk: 'high-risk',
                        linesMatched: 312,
                        functionsMatched: 15,
                        algorithmSimilarity: 96.8,
                        structureSimilarity: 87.4,
                        flaggedAt: '6 hours ago',
                        reviewStatus: 'flagged'
                    },
                    {
                        id: 4,
                        teamA: 'Green Code',
                        teamB: 'Eco Warriors',
                        similarity: 34.6,
                        risk: 'low-risk',
                        linesMatched: 67,
                        functionsMatched: 3,
                        algorithmSimilarity: 42.1,
                        structureSimilarity: 27.1,
                        flaggedAt: '1 day ago',
                        reviewStatus: 'cleared'
                    },
                    {
                        id: 5,
                        teamA: 'FinTech Fusion',
                        teamB: 'Payment Pirates',
                        similarity: 68.9,
                        risk: 'medium-risk',
                        linesMatched: 156,
                        functionsMatched: 7,
                        algorithmSimilarity: 74.3,
                        structureSimilarity: 63.5,
                        flaggedAt: '1 day ago',
                        reviewStatus: 'reviewing'
                    }
                ];
            }

            loadScanHistory() {
                this.scanHistory = [
                    { 
                        type: 'completed', 
                        text: 'Full system scan completed - 127 submissions analyzed', 
                        time: '1 hour ago' 
                    },
                    { 
                        type: 'flagged', 
                        text: 'High similarity detected between AI Innovators and Data Dynamos', 
                        time: '2 hours ago' 
                    },
                    { 
                        type: 'reviewing', 
                        text: 'Manual review initiated for Blockchain Masters vs Crypto Kings', 
                        time: '3 hours ago' 
                    },
                    { 
                        type: 'completed', 
                        text: 'Real-time monitoring updated - 15 new submissions scanned', 
                        time: '4 hours ago' 
                    },
                    { 
                        type: 'flagged', 
                        text: 'Medium risk similarity found in mobile development track', 
                        time: '6 hours ago' 
                    }
                ];
            }

            loadAIRecommendations() {
                this.aiRecommendations = [
                    {
                        title: 'Increase Sensitivity',
                        text: 'Based on recent patterns, consider increasing similarity threshold to 85% for better detection.'
                    },
                    {
                        title: 'Review Algorithm Similarity',
                        text: 'Multiple teams show similar algorithmic approaches. Manual review recommended for pattern analysis.'
                    },
                    {
                        title: 'Track-Specific Scanning',
                        text: 'Web3 track shows higher similarity rates. Consider specialized blockchain code analysis.'
                    },
                    {
                        title: 'Time-based Analysis',
                        text: 'Submission timing suggests potential collaboration. Implement temporal pattern detection.'
                    }
                ];
            }

            renderDetections() {
                const container = document.getElementById('detectionList');
                container.innerHTML = '';

                this.detections.forEach((detection, index) => {
                    const detectionDiv = document.createElement('div');
                    detectionDiv.className = `detection-item ${detection.risk}`;
                    detectionDiv.style.opacity = '0';
                    detectionDiv.style.transform = 'translateY(20px)';
                    detectionDiv.innerHTML = `
                        <div class="detection-header">
                            <div class="team-comparison">
                                <span class="team-name">${detection.teamA}</span>
                                <span class="vs-indicator">vs</span>
                                <span class="team-name">${detection.teamB}</span>
                            </div>
                            <div class="similarity-score">
                                <div class="similarity-value">${detection.similarity}%</div>
                                <div class="similarity-label">Similarity</div>
                            </div>
                        </div>
                        
                        <div class="detection-details">
                            <div class="detail-item">
                                <div class="detail-value">${detection.linesMatched}</div>
                                <div class="detail-label">Lines Matched</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-value">${detection.functionsMatched}</div>
                                <div class="detail-label">Functions</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-value">${detection.algorithmSimilarity}%</div>
                                <div class="detail-label">Algorithm</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-value">${detection.structureSimilarity}%</div>
                                <div class="detail-label">Structure</div>
                            </div>
                        </div>
                        
                        <div class="detection-actions">
                            <button class="btn btn-small btn-secondary" onclick="viewCodeComparison(${detection.id})">
                                <i class="fas fa-code"></i>
                                View Code
                            </button>
                            <button class="btn btn-small btn-danger" onclick="reportViolation(${detection.id})">
                                <i class="fas fa-flag"></i>
                                Report
                            </button>
                            <button class="btn btn-small btn-success" onclick="markAsReviewed(${detection.id})">
                                <i class="fas fa-check"></i>
                                Mark Safe
                            </button>
                        </div>
                    `;
                    container.appendChild(detectionDiv);

                    // Animate in
                    setTimeout(() => {
                        detectionDiv.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                        detectionDiv.style.opacity = '1';
                        detectionDiv.style.transform = 'translateY(0)';
                    }, index * 150);
                });
            }

            renderScanHistory() {
                const container = document.getElementById('historyList');
                container.innerHTML = '';

                this.scanHistory.forEach((history, index) => {
                    const historyDiv = document.createElement('div');
                    historyDiv.className = `history-item ${history.type}`;
                    historyDiv.style.opacity = '0';
                    historyDiv.style.transform = 'translateX(20px)';
                    historyDiv.innerHTML = `
                        <div class="history-icon ${history.type}">
                            <i class="fas ${this.getHistoryIcon(history.type)}"></i>
                        </div>
                        <div class="history-details">
                            <div class="history-text">${history.text}</div>
                            <div class="history-time">${history.time}</div>
                        </div>
                    `;
                    container.appendChild(historyDiv);

                    // Animate in
                    setTimeout(() => {
                        historyDiv.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                        historyDiv.style.opacity = '1';
                        historyDiv.style.transform = 'translateX(0)';
                    }, index * 100);
                });
            }

            renderAIRecommendations() {
                const container = document.getElementById('recommendationList');
                container.innerHTML = '';

                this.aiRecommendations.forEach((recommendation, index) => {
                    const recDiv = document.createElement('div');
                    recDiv.className = 'recommendation-item';
                    recDiv.style.opacity = '0';
                    recDiv.style.transform = 'scale(0.95)';
                    recDiv.innerHTML = `
                        <div class="recommendation-header">
                            <div class="recommendation-icon">
                                <i class="fas fa-lightbulb"></i>
                            </div>
                            <div class="recommendation-title">${recommendation.title}</div>
                        </div>
                        <div class="recommendation-text">${recommendation.text}</div>
                    `;
                    container.appendChild(recDiv);

                    // Animate in
                    setTimeout(() => {
                        recDiv.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                        recDiv.style.opacity = '1';
                        recDiv.style.transform = 'scale(1)';
                    }, index * 120);
                });
            }

            initializeChart() {
                const ctx = document.getElementById('riskChart').getContext('2d');
                const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
                
                // Risk distribution data
                const riskData = {
                    high: 3,
                    medium: 8,
                    low: 116
                };
                
                this.chart = new Chart(ctx, {
                    type: 'doughnut',
                    data: {
                        labels: ['High Risk', 'Medium Risk', 'Low Risk'],
                        datasets: [{
                            data: [riskData.high, riskData.medium, riskData.low],
                            backgroundColor: ['#ef4444', '#f59e0b', '#10b981'],
                            borderColor: ['#dc2626', '#d97706', '#059669'],
                            borderWidth: 2
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                position: 'bottom',
                                labels: {
                                    color: isDark ? '#e2e8f0' : '#64748b',
                                    padding: 15,
                                    usePointStyle: true,
                                    font: { size: 11 }
                                }
                            }
                        }
                    }
                });
            }

            getHistoryIcon(type) {
                const icons = {
                    completed: 'fa-check-circle',
                    flagged: 'fa-exclamation-triangle',
                    reviewing: 'fa-eye'
                };
                return icons[type] || 'fa-circle';
            }

            updateChartTheme(theme) {
                if (!this.chart) return;
                
                const isDark = theme === 'dark';
                const textColor = isDark ? '#e2e8f0' : '#64748b';

                this.chart.options.plugins.legend.labels.color = textColor;
                this.chart.update();
            }

            startRealTimeScanning() {
                if (this.scanMode !== 'realtime') return;
                
                this.scanInterval = setInterval(() => {
                    this.simulateNewDetection();
                }, 30000); // Every 30 seconds
            }

            simulateNewDetection() {
                if (Math.random() > 0.7) {
                    const teams = ['Code Warriors', 'Tech Titans', 'Digital Pioneers', 'Innovation Squad'];
                    const teamA = teams[Math.floor(Math.random() * teams.length)];
                    let teamB;
                    do {
                        teamB = teams[Math.floor(Math.random() * teams.length)];
                    } while (teamB === teamA);

                    const similarity = Math.floor(Math.random() * 60) + 30;
                    const risk = similarity > 80 ? 'high-risk' : similarity > 60 ? 'medium-risk' : 'low-risk';

                    const newDetection = {
                        id: Date.now(),
                        teamA: teamA,
                        teamB: teamB,
                        similarity: similarity,
                        risk: risk,
                        linesMatched: Math.floor(Math.random() * 200) + 50,
                        functionsMatched: Math.floor(Math.random() * 10) + 2,
                        algorithmSimilarity: similarity + Math.floor(Math.random() * 10) - 5,
                        structureSimilarity: similarity + Math.floor(Math.random() * 15) - 7,
                        flaggedAt: 'Just now',
                        reviewStatus: 'pending'
                    };

                    this.detections.unshift(newDetection);
                    this.detections = this.detections.slice(0, 8); // Keep only 8 latest

                    // Add to history
                    const historyItem = {
                        type: risk === 'high-risk' ? 'flagged' : 'completed',
                        text: `${similarity}% similarity detected between ${teamA} and ${teamB}`,
                        time: 'Just now'
                    };
                    this.scanHistory.unshift(historyItem);
                    this.scanHistory = this.scanHistory.slice(0, 6);

                    this.renderDetections();
                    this.renderScanHistory();

                    if (similarity > 75) {
                        this.showToast(`🚨 High similarity detected: ${teamA} vs ${teamB} (${similarity}%)`, 'warning');
                    }
                }
            }

            initializeAnimations() {
                // Enhanced entrance animations
                setTimeout(() => {
                    document.querySelectorAll('.detection-item').forEach((item, index) => {
                        setTimeout(() => {
                            item.style.opacity = '0';
                            item.style.transform = 'translateY(30px) scale(0.95)';
                            setTimeout(() => {
                                item.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                                item.style.opacity = '1';
                                item.style.transform = 'translateY(0) scale(1)';
                            }, 100);
                        }, index * 150);
                    });
                }, 500);
            }

            // Control Functions
            updateSensitivity() {
                const slider = document.getElementById('sensitivitySlider');
                this.sensitivity = slider.value * 10;
                document.getElementById('sensitivityValue').textContent = this.sensitivity + '%';
                this.showToast(`Detection sensitivity updated to ${this.sensitivity}%`, 'info');
            }

            changeScanMode() {
                this.scanMode = document.getElementById('scanMode').value;
                this.showToast(`Scan mode changed to ${this.scanMode}`, 'info');
                
                if (this.scanInterval) {
                    clearInterval(this.scanInterval);
                    this.scanInterval = null;
                }
                
                if (this.scanMode === 'realtime') {
                    this.startRealTimeScanning();
                }
            }

            autoTuneParameters() {
                this.showToast('AI auto-tuning detection parameters...', 'info');
                
                setTimeout(() => {
                    const newSensitivity = Math.floor(Math.random() * 3) + 7; // 7-9
                    document.getElementById('sensitivitySlider').value = newSensitivity;
                    this.sensitivity = newSensitivity * 10;
                    document.getElementById('sensitivityValue').textContent = this.sensitivity + '%';
                    
                    this.showToast(`🤖 AI optimization complete! Sensitivity tuned to ${this.sensitivity}%`, 'success');
                }, 2000);
            }

            startScan() {
                this.isScanning = true;
                document.getElementById('scanStatus').innerHTML = `
                    <div class="scan-dot"></div>
                    <span>SCANNING</span>
                `;
                this.showToast('Full system scan initiated...', 'info');
                this.startRealTimeScanning();
            }

            stopScan() {
                this.isScanning = false;
                if (this.scanInterval) {
                    clearInterval(this.scanInterval);
                    this.scanInterval = null;
                }
                document.getElementById('scanStatus').innerHTML = `
                    <div class="scan-dot" style="background: #6b7280;"></div>
                    <span>STOPPED</span>
                `;
                this.showToast('Scanning stopped', 'warning');
            }

            // Header Actions
            fullSystemScan() {
                this.showToast('Initiating comprehensive system scan...', 'info');
                
                setTimeout(() => {
                    this.showToast('🔍 Full scan completed! 127 submissions analyzed, 3 high-risk detections found.', 'success');
                }, 5000);
            }

            generateReport() {
                this.showToast('Generating comprehensive plagiarism report...', 'info');
                
                setTimeout(() => {
                    this.showToast('📊 Detailed plagiarism analysis report generated successfully!', 'success');
                }, 3000);
            }

            // Topbar Actions
            quickScan() {
                this.showToast('Running quick similarity scan...', 'info');
                
                setTimeout(() => {
                    const newDetection = Math.random() > 0.6;
                    if (newDetection) {
                        this.simulateNewDetection();
                        this.showToast('⚠️ Quick scan found potential similarity match!', 'warning');
                    } else {
                        this.showToast('✅ Quick scan completed - No issues detected', 'success');
                    }
                }, 2000);
            }

            getAIAnalysis() {
                this.showToast('Generating AI-powered analysis insights...', 'info');
                
                setTimeout(() => {
                    const insights = [
                        '🎯 Pattern analysis shows 15% increase in structural similarities this week',
                        '📊 AI detected potential template sharing in Web3 track submissions',
                        '⚡ Machine learning model suggests increasing threshold to 85% for better accuracy',
                        '🏆 Current detection rate: 98.7% with 0.3% false positive rate',
                        '🤖 Recommendation: Implement cross-language similarity detection for improved coverage'
                    ];
                    
                    const randomInsight = insights[Math.floor(Math.random() * insights.length)];
                    this.showToast(randomInsight, 'success');
                }, 2000);
            }

            exportReport() {
                this.showToast('Exporting detailed plagiarism analysis...', 'info');
                
                setTimeout(() => {
                    const reportData = {
                        generated: new Date().toISOString(),
                        event: 'NexusHack 2025',
                        totalSubmissions: 127,
                        detections: this.detections,
                        scanHistory: this.scanHistory,
                        aiRecommendations: this.aiRecommendations,
                        settings: {
                            sensitivity: this.sensitivity,
                            scanMode: this.scanMode
                        }
                    };

                    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `plagiarism-report-${new Date().toISOString().split('T')[0]}.json`;
                    a.click();
                    URL.revokeObjectURL(url);
                    
                    this.showToast('Advanced plagiarism report exported successfully!', 'success');
                }, 2500);
            }

            // Results Actions
            sortByRisk() {
                this.detections.sort((a, b) => {
                    const riskOrder = { 'high-risk': 3, 'medium-risk': 2, 'low-risk': 1 };
                    return riskOrder[b.risk] - riskOrder[a.risk];
                });
                this.renderDetections();
                this.showToast('Results sorted by risk level (highest first)', 'info');
            }

            filterResults() {
                this.showToast('Opening advanced filter options...', 'info');
            }

            // Detection Actions
            viewCodeComparison(id) {
                const detection = this.detections.find(d => d.id === id);
                if (!detection) return;

                // Simulate code samples
                const codeA = `function calculateHash(data) {
    const crypto = require('crypto');
    const hash = crypto.createHash('sha256');
    hash.update(data);
    return hash.digest('hex');
}

function validateInput(input) {
    if (!input || input.length === 0) {
        throw new Error('Input cannot be empty');
    }
    return input.trim();
}`;

                const codeB = `function computeHash(information) {
    const cryptoLib = require('crypto');
    const hasher = cryptoLib.createHash('sha256');
    hasher.update(information);
    return hasher.digest('hex');
}

function checkInput(data) {
    if (!data || data.length === 0) {
        throw new Error('Data cannot be empty');
    }
    return data.trim();
}`;

                document.getElementById('codeA').textContent = codeA;
                document.getElementById('codeB').textContent = codeB;
                
                // Highlight code
                Prism.highlightAll();
                
                document.getElementById('codeModal').classList.add('active');
            }

            reportViolation(id) {
                const detection = this.detections.find(d => d.id === id);
                if (detection) {
                    this.showToast(`🚨 Violation reported for ${detection.teamA} vs ${detection.teamB}`, 'warning');
                }
            }

            markAsReviewed(id) {
                const detection = this.detections.find(d => d.id === id);
                if (detection) {
                    detection.reviewStatus = 'cleared';
                    this.showToast(`✅ ${detection.teamA} vs ${detection.teamB} marked as safe`, 'success');
                }
            }

            closeCodeModal() {
                document.getElementById('codeModal').classList.remove('active');
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
        let modernPlagiarismManager;

        function updateSensitivity() { modernPlagiarismManager.updateSensitivity(); }
        function changeScanMode() { modernPlagiarismManager.changeScanMode(); }
        function autoTuneParameters() { modernPlagiarismManager.autoTuneParameters(); }
        function startScan() { modernPlagiarismManager.startScan(); }
        function stopScan() { modernPlagiarismManager.stopScan(); }
        function fullSystemScan() { modernPlagiarismManager.fullSystemScan(); }
        function generateReport() { modernPlagiarismManager.generateReport(); }
        function quickScan() { modernPlagiarismManager.quickScan(); }
        function getAIAnalysis() { modernPlagiarismManager.getAIAnalysis(); }
        function exportReport() { modernPlagiarismManager.exportReport(); }
        function sortByRisk() { modernPlagiarismManager.sortByRisk(); }
        function filterResults() { modernPlagiarismManager.filterResults(); }
        function viewCodeComparison(id) { modernPlagiarismManager.viewCodeComparison(id); }
        function reportViolation(id) { modernPlagiarismManager.reportViolation(id); }
        function markAsReviewed(id) { modernPlagiarismManager.markAsReviewed(id); }
        function closeCodeModal() { modernPlagiarismManager.closeCodeModal(); }
        function backToDashboard() { modernPlagiarismManager.backToDashboard(); }

        document.addEventListener('DOMContentLoaded', () => {
            modernPlagiarismManager = new ModernPlagiarismManager();
            
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
                    name: modernPlagiarismManager.currentUser.name,
                    initials: modernPlagiarismManager.currentUser.initials,
                    role: modernPlagiarismManager.currentUser.role,
                    lastActive: Date.now()
                };
                localStorage.setItem('modernOrganizerSession', JSON.stringify(sessionData));
            }, 60000);

            function logout() {
                if (confirm('Are you sure you want to logout?')) {
                    localStorage.removeItem('modernOrganizerSession');
                    modernPlagiarismManager.showToast('Logging out...', 'info');
                    setTimeout(() => {
                        window.location.href = '../auth/login.html';
                    }, 1000);
                }
            }

            // Keyboard shortcuts for plagiarism control
            document.addEventListener('keydown', (e) => {
                if (e.ctrlKey || e.metaKey) {
                    switch(e.key) {
                        case 's':
                            e.preventDefault();
                            startScan();
                            break;
                        case 'q':
                            e.preventDefault();
                            quickScan();
                            break;
                        case 'r':
                            e.preventDefault();
                            generateReport();
                            break;
                        case 'e':
                            e.preventDefault();
                            exportReport();
                            break;
                    }
                }
                if (e.key === 'Escape') {
                    closeCodeModal();
                }
            });
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
            
            /* Enhanced detection animations */
            .detection-item, .history-item, .recommendation-item { transition: var(--transition) !important; }
            @media (hover: hover) and (pointer: fine) {
                .detection-item:hover { 
                    transform: translateY(-4px) scale(1.02) !important;
                    box-shadow: var(--shadow-lg) !important;
                }
                .history-item:hover { transform: translateX(6px) !important; }
                .recommendation-item:hover { transform: scale(1.02) !important; }
            }
            
            /* Enhanced high-risk indicators */
            .detection-item.high-risk {
                position: relative;
                overflow: hidden;
            }
            .detection-item.high-risk::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: linear-gradient(45deg, transparent, rgba(239, 68, 68, 0.1), transparent);
                animation: dangerSweep 3s infinite;
            }
            
            @keyframes dangerSweep {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(100%); }
            }
            
            /* Enhanced scanning indicators */
            .scan-status {
                position: relative;
                overflow: hidden;
            }
            .scan-status::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
                animation: scanSweep 2s infinite;
            }
            
            @keyframes scanSweep {
                0% { left: -100%; }
                100% { left: 100%; }
            }
            
            /* Code modal enhancements */
            .code-modal {
                backdrop-filter: blur(15px);
            }
            .code-modal-content {
                animation: modalSlideIn 0.4s ease-out;
            }
            
            @keyframes modalSlideIn {
                from { 
                    opacity: 0; 
                    transform: scale(0.9) translateY(-20px); 
                }
                to { 
                    opacity: 1; 
                    transform: scale(1) translateY(0); 
                }
            }
            
            /* Performance optimizations */
            .detection-results, .analysis-sidebar {
                contain: layout style paint;
            }
            
            /* Enhanced focus states */
            .sensitivity-slider:focus,
            .scan-mode:focus {
                box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.3);
            }
        `;
        document.head.appendChild(style);
