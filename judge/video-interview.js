 // ADVANCED VIDEO INTERVIEW SYSTEM
        class VideoInterview {
            constructor() {
                this.isRecording = true;
                this.isMuted = false;
                this.isVideoOn = true;
                this.isScreenSharing = false;
                this.startTime = Date.now() - 932000; // 15:32 ago
                this.activeTab = 'participants';
                this.isMobile = window.innerWidth <= 1024;
                this.currentUser = { name: 'Dr. Jane Smith', initials: 'JS', role: 'Senior Judge', id: 'judge_001' };
                this.init();
            }

            init() {
                this.initializeTheme();
                this.setupEventListeners();
                this.startTimer();
                this.initializeUser();
                this.handleResize();
                this.loadInterviewData();
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
                
                // Keyboard shortcuts
                document.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape') this.closeMobileSidebar();
                    if (e.ctrlKey && e.key === 'm') { e.preventDefault(); this.toggleMute(); }
                    if (e.ctrlKey && e.key === 'v') { e.preventDefault(); this.toggleVideo(); }
                    if (e.ctrlKey && e.key === 's') { e.preventDefault(); this.saveNotes(); }
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
                this.adjustVideoLayout();
            }

            adjustVideoLayout() {
                const videoGrid = document.getElementById('videoGrid');
                if (window.innerWidth <= 768) {
                    videoGrid.classList.remove('multi-view');
                } else {
                    videoGrid.classList.add('multi-view');
                }
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
                    const timer = document.getElementById('interviewTimer');
                    timer.textContent = `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
                }, 1000);
            }

            toggleMute() {
                this.isMuted = !this.isMuted;
                const btn = document.querySelector('.control-btn.mute');
                const icon = document.getElementById('muteIcon');
                
                if (this.isMuted) {
                    btn.classList.add('active');
                    icon.className = 'fas fa-microphone-slash';
                    this.showToast('Microphone muted', 'warning');
                } else {
                    btn.classList.remove('active');
                    icon.className = 'fas fa-microphone';
                    this.showToast('Microphone unmuted', 'success');
                }
            }

            toggleVideo() {
                this.isVideoOn = !this.isVideoOn;
                const btn = document.querySelector('.control-btn.video');
                const icon = document.getElementById('videoIcon');
                
                if (!this.isVideoOn) {
                    btn.classList.add('active');
                    icon.className = 'fas fa-video-slash';
                    this.showToast('Camera turned off', 'warning');
                } else {
                    btn.classList.remove('active');
                    icon.className = 'fas fa-video';
                    this.showToast('Camera turned on', 'success');
                }
            }

            toggleScreen() {
                this.isScreenSharing = !this.isScreenSharing;
                const btn = document.querySelector('.control-btn.screen');
                const icon = document.getElementById('screenIcon');
                
                if (this.isScreenSharing) {
                    btn.classList.add('active');
                    icon.className = 'fas fa-stop';
                    this.showToast('Screen sharing started', 'info');
                } else {
                    btn.classList.remove('active');
                    icon.className = 'fas fa-desktop';
                    this.showToast('Screen sharing stopped', 'info');
                }
            }

            toggleRecording() {
                this.isRecording = !this.isRecording;
                const btn = document.querySelector('.control-btn.record');
                const icon = document.getElementById('recordIcon');
                
                if (!this.isRecording) {
                    btn.classList.remove('active');
                    icon.className = 'fas fa-record-vinyl';
                    this.showToast('Recording stopped', 'warning');
                } else {
                    btn.classList.add('active');
                    icon.className = 'fas fa-stop';
                    this.showToast('Recording started', 'success');
                }
            }

            endInterview() {
                if (confirm('Are you sure you want to end the interview? This action cannot be undone.')) {
                    this.showToast('Interview ended. Saving recording...', 'info');
                    setTimeout(() => {
                        this.showToast('Interview data saved successfully!', 'success');
                        setTimeout(() => {
                            window.location.href = 'dashboard.html';
                        }, 2000);
                    }, 3000);
                }
            }

            switchTab(tabName) {
                this.activeTab = tabName;
                
                // Update tab buttons
                document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
                event.target.classList.add('active');
                
                // Update tab content
                document.querySelectorAll('.tab-content').forEach(content => {
                    content.style.display = 'none';
                });
                document.getElementById(`${tabName}Tab`).style.display = 'block';
            }

            askQuestion(questionId) {
                const questionItem = event.target.closest('.question-item');
                if (questionItem.classList.contains('asked')) {
                    this.showToast('This question has already been asked', 'warning');
                    return;
                }
                
                questionItem.classList.add('asked');
                const meta = questionItem.querySelector('.question-meta span:last-child');
                meta.textContent = 'Asked just now';
                
                this.showToast('Question marked as asked', 'success');
            }

            saveNotes() {
                const notes = document.getElementById('interviewNotes').value;
                const interviewData = {
                    notes: notes,
                    timestamp: Date.now(),
                    interviewId: 'interview_' + Date.now(),
                    participants: ['Alex Johnson', 'Sarah Miller'],
                    duration: Date.now() - this.startTime
                };
                
                localStorage.setItem('interviewNotes', JSON.stringify(interviewData));
                this.showToast('Notes saved successfully!', 'success');
            }

            exportNotes() {
                const notes = document.getElementById('interviewNotes').value;
                const blob = new Blob([notes], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `interview-notes-${new Date().toISOString().split('T')[0]}.txt`;
                a.click();
                URL.revokeObjectURL(url);
                this.showToast('Notes exported successfully!', 'success');
            }

            loadInterviewData() {
                const savedNotes = localStorage.getItem('interviewNotes');
                if (savedNotes) {
                    const data = JSON.parse(savedNotes);
                    if (data.notes && Date.now() - data.timestamp < 86400000) { // Within 24 hours
                        document.getElementById('interviewNotes').value = data.notes;
                    }
                }
            }

            handleBeforeUnload(event) {
                if (this.isRecording || Date.now() - this.startTime > 60000) {
                    event.preventDefault();
                    event.returnValue = 'Interview is in progress. Are you sure you want to leave?';
                    return 'Interview is in progress. Are you sure you want to leave?';
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
        let videoInterview;

        function toggleMute() { videoInterview.toggleMute(); }
        function toggleVideo() { videoInterview.toggleVideo(); }
        function toggleScreen() { videoInterview.toggleScreen(); }
        function toggleRecording() { videoInterview.toggleRecording(); }
        function endInterview() { videoInterview.endInterview(); }
        function switchTab(tabName) { videoInterview.switchTab(tabName); }
        function askQuestion(questionId) { videoInterview.askQuestion(questionId); }
        function saveNotes() { videoInterview.saveNotes(); }
        function exportNotes() { videoInterview.exportNotes(); }
        function openSettings() { videoInterview.showToast('Opening interview settings...', 'info'); }
        function toggleFullscreen() {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen();
                videoInterview.showToast('Entered fullscreen mode', 'info');
            } else {
                document.exitFullscreen();
                videoInterview.showToast('Exited fullscreen mode', 'info');
            }
        }
        function backToDashboard() {
            if (confirm('Interview is in progress. Are you sure you want to leave?')) {
                window.location.href = 'dashboard.html';
            }
        }

        document.addEventListener('DOMContentLoaded', () => {
            videoInterview = new VideoInterview();
            
            // Add entrance animations
            setTimeout(() => {
                document.querySelectorAll('.control-btn').forEach((btn, index) => {
                    setTimeout(() => {
                        btn.style.opacity = '0';
                        btn.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            btn.style.opacity = '1';
                            btn.style.transform = 'translateY(0)';
                        }, 100);
                    }, index * 100);
                });
            }, 1000);

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
            .control-btn, .participant-item, .question-item { transition: var(--transition) !important; }
            @media (hover: hover) and (pointer: fine) {
                .control-btn:hover { transform: translateY(-4px) !important; }
                .participant-item:hover { transform: translateX(4px) !important; }
            }
            *:focus-visible { outline: 2px solid var(--primary) !important; outline-offset: 2px !important; }
        `;
        document.head.appendChild(style);
