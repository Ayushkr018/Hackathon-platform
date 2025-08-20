  class VideoInterview {
            constructor() {
                this.isRecording = true;
                this.isMuted = false;
                this.isVideoOn = true;
                this.isScreenSharing = false;
                this.startTime = Date.now() - 932000; // Started 15:32 ago
                this.activeTab = 'participants';
                this.isMobile = window.innerWidth <= 1024;
                this.currentUser = {
                    name: 'Dr. Jane Smith',
                    initials: 'JS',
                    role: 'Senior Judge',
                    id: 'judge_001'
                };
                this.participants = [
                    { id: 'AJ', name: 'Alex Johnson', role: 'Team Leader', status: 'online', muted: false },
                    { id: 'SM', name: 'Sarah Miller', role: 'Developer', status: 'online', muted: false },
                    { id: 'JS', name: 'Dr. Jane Smith', role: 'Senior Judge', status: 'online', host: true }
                ];
                this.questions = [
                    { id: 1, text: 'Can you walk us through the architecture of your solution?', category: 'Technical', asked: false },
                    { id: 2, text: 'What inspired your team to tackle this problem?', category: 'Background', asked: true, askedTime: 5 },
                    { id: 3, text: 'How does your solution compare to existing alternatives?', category: 'Innovation', asked: false },
                    { id: 4, text: 'What are the biggest technical challenges you faced?', category: 'Implementation', asked: false },
                    { id: 5, text: 'How do you plan to scale this solution in the future?', category: 'Business', asked: false },
                    { id: 6, text: 'What technologies did you use and why?', category: 'Technical', asked: false }
                ];
                this.init();
            }

            init() {
                this.initializeTheme();
                this.setupEventListeners();
                this.startTimer();
                this.initializeUser();
                this.handleResize();
                this.loadInterviewData();
                this.startConnectionMonitoring();
            }

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

                // Enhanced keyboard shortcuts
                document.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape') {
                        this.closeMobileSidebar();
                        this.exitFullscreen();
                    }
                    if (e.ctrlKey || e.metaKey) {
                        switch(e.key) {
                            case 'm':
                                e.preventDefault();
                                this.toggleMute();
                                break;
                            case 'v':
                                e.preventDefault();
                                this.toggleVideo();
                                break;
                            case 's':
                                e.preventDefault();
                                this.saveNotes();
                                break;
                            case 'r':
                                e.preventDefault();
                                this.toggleRecording();
                                break;
                            case 'f':
                                e.preventDefault();
                                this.toggleFullscreen();
                                break;
                        }
                    }
                    // Number keys for quick tab switching
                    if (e.key >= '1' && e.key <= '3' && !e.ctrlKey && !e.altKey) {
                        const tabs = ['participants', 'questions', 'notes'];
                        this.switchTab(tabs[parseInt(e.key) - 1]);
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
                
                this.showToast(`🎨 Theme switched to ${newTheme} mode`, 'success');
                
                setTimeout(() => {
                    html.style.transition = '';
                }, 300);
            }

            startTimer() {
                setInterval(() => {
                    const elapsed = Date.now() - this.startTime;
                    const hours = Math.floor(elapsed / 3600000);
                    const minutes = Math.floor((elapsed % 3600000) / 60000);
                    const seconds = Math.floor((elapsed % 60000) / 1000);
                    const timer = document.getElementById('interviewTimer');
                    timer.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
                }, 1000);
            }

            startConnectionMonitoring() {
                // Simulate connection quality changes
                setInterval(() => {
                    const qualities = ['excellent', 'good', 'poor'];
                    const statusElements = document.querySelectorAll('.connection-status');
                    statusElements.forEach(element => {
                        const quality = qualities[Math.floor(Math.random() * qualities.length)];
                        element.className = `connection-status ${quality}`;
                        element.textContent = quality === 'excellent' ? 'HD' : quality === 'good' ? 'SD' : 'LD';
                    });
                }, 10000); // Update every 10 seconds
            }

            // ✅ ENHANCED VIDEO CONTROLS
            toggleMute() {
                this.isMuted = !this.isMuted;
                const btn = document.querySelector('.control-btn.mute');
                const icon = document.getElementById('muteIcon');
                
                if (this.isMuted) {
                    btn.classList.add('active');
                    icon.className = 'fas fa-microphone-slash';
                    this.showToast('🎤 Microphone muted', 'warning');
                } else {
                    btn.classList.remove('active');
                    icon.className = 'fas fa-microphone';
                    this.showToast('🎤 Microphone unmuted', 'success');
                }
            }

            toggleVideo() {
                this.isVideoOn = !this.isVideoOn;
                const btn = document.querySelector('.control-btn.video');
                const icon = document.getElementById('videoIcon');
                
                if (!this.isVideoOn) {
                    btn.classList.add('active');
                    icon.className = 'fas fa-video-slash';
                    this.showToast('📹 Camera turned off', 'warning');
                } else {
                    btn.classList.remove('active');
                    icon.className = 'fas fa-video';
                    this.showToast('📹 Camera turned on', 'success');
                }
            }

            toggleScreen() {
                this.isScreenSharing = !this.isScreenSharing;
                const btn = document.querySelector('.control-btn.screen');
                const icon = document.getElementById('screenIcon');
                
                if (this.isScreenSharing) {
                    btn.classList.add('active');
                    icon.className = 'fas fa-stop';
                    this.showToast('🖥️ Screen sharing started', 'info');
                } else {
                    btn.classList.remove('active');
                    icon.className = 'fas fa-desktop';
                    this.showToast('🖥️ Screen sharing stopped', 'info');
                }
            }

            toggleRecording() {
                this.isRecording = !this.isRecording;
                const btn = document.querySelector('.control-btn.record');
                const icon = document.getElementById('recordIcon');
                
                if (!this.isRecording) {
                    btn.classList.remove('active');
                    icon.className = 'fas fa-record-vinyl';
                    this.showToast('⏹️ Recording stopped', 'warning');
                } else {
                    btn.classList.add('active');
                    icon.className = 'fas fa-stop';
                    this.showToast('🔴 Recording started', 'success');
                }
            }

            endInterview() {
                if (confirm('⚠️ Are you sure you want to end the interview? This will stop recording and disconnect all participants.')) {
                    this.showToast('📹 Ending interview and saving data...', 'info');
                    
                    // Simulate ending process
                    setTimeout(() => {
                        this.showToast('✅ Interview ended successfully! Recording saved.', 'success');
                        setTimeout(() => {
                            window.location.href = 'dashboard.html';
                        }, 2000);
                    }, 3000);
                }
            }

            // ✅ TAB SWITCHING WITH ENHANCED UX
            switchTab(tabName) {
                this.activeTab = tabName;
                
                // Update tab buttons
                document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
                document.querySelector(`[onclick="switchTab('${tabName}')"]`).classList.add('active');
                
                // Update tab content with animation
                document.querySelectorAll('.tab-content').forEach(content => {
                    content.style.display = 'none';
                    content.style.opacity = '0';
                });
                
                const targetTab = document.getElementById(`${tabName}Tab`);
                targetTab.style.display = 'block';
                
                setTimeout(() => {
                    targetTab.style.opacity = '1';
                }, 50);
                
                this.showToast(`📋 Switched to ${tabName.charAt(0).toUpperCase() + tabName.slice(1)} tab`, 'info');
            }

            // ✅ ENHANCED QUESTION MANAGEMENT
            askQuestion(questionId) {
                const question = this.questions.find(q => q.id === questionId);
                const questionItem = document.querySelector(`[onclick="askQuestion(${questionId})"]`);
                
                if (question.asked) {
                    this.showToast('❓ This question was already asked', 'warning');
                    return;
                }
                
                question.asked = true;
                question.askedTime = 0; // Just asked
                
                questionItem.classList.add('asked');
                const meta = questionItem.querySelector('.question-meta span:last-child');
                meta.textContent = 'Asked just now';
                
                this.showToast(`✅ Question "${question.text.substring(0, 30)}..." marked as asked`, 'success');
            }

            // ✅ PARTICIPANT MANAGEMENT
            muteParticipant(participantId) {
                const participant = this.participants.find(p => p.id === participantId);
                if (participant && !participant.host) {
                    participant.muted = !participant.muted;
                    this.showToast(`🔇 ${participant.name} has been ${participant.muted ? 'muted' : 'unmuted'}`, 'info');
                } else {
                    this.showToast('❌ Cannot mute the host', 'warning');
                }
            }

            // ✅ ENHANCED NOTES MANAGEMENT
            saveNotes() {
                const notes = document.getElementById('interviewNotes').value;
                const interviewData = {
                    notes: notes,
                    timestamp: Date.now(),
                    interviewId: 'interview_' + Date.now(),
                    participants: this.participants.filter(p => !p.host).map(p => p.name),
                    duration: Date.now() - this.startTime,
                    questions: this.questions.filter(q => q.asked),
                    recordingStatus: this.isRecording
                };
                
                localStorage.setItem('interviewNotes', JSON.stringify(interviewData));
                this.showToast('💾 Interview notes saved successfully!', 'success');
            }

            exportNotes() {
                const notes = document.getElementById('interviewNotes').value;
                const duration = Date.now() - this.startTime;
                const hours = Math.floor(duration / 3600000);
                const minutes = Math.floor((duration % 3600000) / 60000);
                
                const exportContent = `
NEXUSHACK VIDEO INTERVIEW NOTES
===============================

Interview Details:
• Date: ${new Date().toLocaleDateString()}
• Duration: ${hours}h ${minutes}m
• Participants: ${this.participants.filter(p => !p.host).map(p => p.name).join(', ')}
• Judge: ${this.currentUser.name}
• Recording: ${this.isRecording ? 'Yes' : 'No'}

Questions Asked:
${this.questions.filter(q => q.asked).map((q, i) => `${i + 1}. [${q.category}] ${q.text}`).join('\n')}

Notes:
======
${notes}

---
Generated by NexusHack Platform
`.trim();

                const blob = new Blob([exportContent], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `nexushack-interview-notes-${new Date().toISOString().split('T')[0]}.txt`;
                a.style.display = 'none';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                
                this.showToast('📄 Interview notes exported successfully!', 'success');
            }

            loadInterviewData() {
                const savedNotes = localStorage.getItem('interviewNotes');
                if (savedNotes) {
                    const data = JSON.parse(savedNotes);
                    if (data.notes && Date.now() - data.timestamp < 86400000) { // Within 24 hours
                        document.getElementById('interviewNotes').value = data.notes;
                        this.showToast('📋 Previous interview notes loaded', 'info');
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

            // ✅ ENHANCED NOTIFICATION SYSTEM
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

            exitFullscreen() {
                if (document.fullscreenElement) {
                    document.exitFullscreen();
                }
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
        function muteParticipant(participantId) { videoInterview.muteParticipant(participantId); }

        // ✅ ENHANCED GLOBAL FUNCTIONS
        function openSettings() {
            videoInterview.showToast('⚙️ Opening interview settings panel...', 'info');
            
            setTimeout(() => {
                const modal = document.createElement('div');
                modal.style.cssText = `
                    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                    background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center;
                    z-index: 10000; backdrop-filter: blur(15px);
                `;
                
                modal.innerHTML = `
                    <div style="background: var(--bg-card); border-radius: 20px; padding: 2rem; max-width: 500px; width: 90%;">
                        <h3 style="margin-bottom: 1.5rem; color: var(--text-primary); display: flex; align-items: center; gap: 0.5rem;">
                            <i class="fas fa-cog"></i> Interview Settings
                        </h3>
                        
                        <div style="display: flex; flex-direction: column; gap: 1rem; margin-bottom: 2rem;">
                            <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem; background: var(--bg-glass); border-radius: 8px;">
                                <span>Video Quality</span>
                                <select style="background: var(--bg-secondary); border: 1px solid var(--border); border-radius: 4px; padding: 0.25rem; color: var(--text-primary);">
                                    <option>720p HD</option>
                                    <option selected>1080p FHD</option>
                                    <option>4K UHD</option>
                                </select>
                            </div>
                            
                            <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem; background: var(--bg-glass); border-radius: 8px;">
                                <span>Auto-save Notes</span>
                                <input type="checkbox" checked style="transform: scale(1.2);">
                            </div>
                            
                            <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem; background: var(--bg-glass); border-radius: 8px;">
                                <span>Background Noise Reduction</span>
                                <input type="checkbox" checked style="transform: scale(1.2);">
                            </div>
                            
                            <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem; background: var(--bg-glass); border-radius: 8px;">
                                <span>Recording Storage</span>
                                <span style="color: var(--success); font-weight: 600;">Cloud (256GB free)</span>
                            </div>
                        </div>
                        
                        <div style="display: flex; gap: 1rem;">
                            <button onclick="this.closest('div').remove()" 
                                style="flex: 1; padding: 0.75rem; border: 1px solid var(--border); border-radius: 8px; background: var(--bg-glass); color: var(--text-primary); cursor: pointer;">
                                Cancel
                            </button>
                            <button onclick="this.closest('div').remove(); videoInterview.showToast('Settings saved successfully!', 'success');" 
                                style="flex: 1; padding: 0.75rem; border: none; border-radius: 8px; background: var(--gradient-video); color: white; cursor: pointer; font-weight: 600;">
                                Save Settings
                            </button>
                        </div>
                    </div>
                `;
                
                document.body.appendChild(modal);
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) modal.remove();
                });
            }, 800);
        }

        function toggleFullscreen() {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().then(() => {
                    videoInterview.showToast('🔍 Entered fullscreen mode (Press Esc to exit)', 'info');
                }).catch(() => {
                    videoInterview.showToast('❌ Fullscreen not supported', 'error');
                });
            } else {
                document.exitFullscreen().then(() => {
                    videoInterview.showToast('🔍 Exited fullscreen mode', 'info');
                });
            }
        }

        function backToDashboard() {
            if (confirm('Interview is in progress. Are you sure you want to leave? This will end the interview for all participants.')) {
                videoInterview.showToast('🏠 Ending interview and returning to dashboard...', 'info');
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1500);
            }
        }

        // Initialize the application
        document.addEventListener('DOMContentLoaded', () => {
            videoInterview = new VideoInterview();
            
            // Add entrance animations
            setTimeout(() => {
                document.querySelectorAll('.control-btn').forEach((btn, index) => {
                    setTimeout(() => {
                        btn.style.opacity = '0';
                        btn.style.transform = 'translateY(30px)';
                        setTimeout(() => {
                            btn.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                            btn.style.opacity = '1';
                            btn.style.transform = 'translateY(0)';
                        }, 100);
                    }, index * 100);
                });
            }, 1000);

            // Performance optimization for mobile devices
            if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                document.body.classList.add('mobile-device');
                const mobileStyle = document.createElement('style');
                mobileStyle.textContent = `
                    .mobile-device * { 
                        animation-duration: 0.1s !important; 
                        transition-duration: 0.1s !important; 
                    }
                `;
                document.head.appendChild(mobileStyle);
            }

            // Show welcome message
            setTimeout(() => {
                videoInterview.showToast('🎥 Video interview system ready! Use keyboard shortcuts for quick controls.', 'success');
            }, 2000);
        });
    