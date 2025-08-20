 class ModernCertificateGenerator {
            constructor() {
                this.templates = [];
                this.recipients = [];
                this.history = [];
                this.canvas = null;
                this.fabricCanvas = null;
                this.totalGenerated = 1247;
                this.totalTemplates = 12;
                this.totalVerified = 892;
                this.totalPending = 34;
                this.isMobile = window.innerWidth <= 1024;
                this.currentUser = { name: 'Alex Chen', initials: 'AC', role: 'Lead Organizer', id: 'org_001' };
                this.init();
            }

            init() {
                this.initializeTheme();
                this.setupEventListeners();
                this.loadTemplates();
                this.loadRecipients();
                this.loadHistory();
                this.renderTemplates();
                this.renderRecipients();
                this.renderHistory();
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

            loadTemplates() {
                // Generate mock template data
                this.templates = [
                    {
                        id: 1,
                        name: 'Golden Elegance',
                        description: 'Luxurious gold design with elegant borders',
                        type: 'premium',
                        category: 'formal'
                    },
                    {
                        id: 2,
                        name: 'Modern Minimal',
                        description: 'Clean and contemporary design',
                        type: 'premium',
                        category: 'modern'
                    },
                    {
                        id: 3,
                        name: 'Classic Formal',
                        description: 'Traditional formal certificate design',
                        type: 'standard',
                        category: 'classic'
                    },
                    {
                        id: 4,
                        name: 'Tech Innovation',
                        description: 'Futuristic design for tech events',
                        type: 'premium',
                        category: 'tech'
                    },
                    {
                        id: 5,
                        name: 'Achievement Bronze',
                        description: 'Bronze themed achievement certificate',
                        type: 'standard',
                        category: 'award'
                    },
                    {
                        id: 6,
                        name: 'Digital Certificate',
                        description: 'Blockchain-ready digital format',
                        type: 'premium',
                        category: 'digital'
                    }
                ];
            }

            loadRecipients() {
                // Generate mock recipient data
                this.recipients = [
                    { id: 1, name: 'AI Innovators', type: 'team', category: 'winner', selected: false },
                    { id: 2, name: 'Blockchain Masters', type: 'team', category: 'winner', selected: false },
                    { id: 3, name: 'Green Code', type: 'team', category: 'winner', selected: false },
                    { id: 4, name: 'Mobile Wizards', type: 'team', category: 'participant', selected: false },
                    { id: 5, name: 'FinTech Fusion', type: 'team', category: 'participant', selected: false },
                    { id: 6, name: 'Dr. Sarah Wilson', type: 'judge', category: 'judge', selected: false },
                    { id: 7, name: 'Prof. Michael Chen', type: 'judge', category: 'judge', selected: false },
                    { id: 8, name: 'Alex Rodriguez', type: 'mentor', category: 'mentor', selected: false }
                ];
            }

            loadHistory() {
                this.history = [
                    {
                        id: 1,
                        type: 'completed',
                        title: 'Winner Certificates Generated',
                        details: '3 certificates for top teams • 2 hours ago',
                        count: 3
                    },
                    {
                        id: 2,
                        type: 'pending',
                        title: 'Participation Certificates',
                        details: 'Bulk generation for 127 participants • 4 hours ago',
                        count: 127
                    },
                    {
                        id: 3,
                        type: 'verified',
                        title: 'Blockchain Verification',
                        details: '89 certificates verified on blockchain • 1 day ago',
                        count: 89
                    },
                    {
                        id: 4,
                        type: 'completed',
                        title: 'Judge Appreciation',
                        details: '15 certificates for expert judges • 2 days ago',
                        count: 15
                    }
                ];
            }

            renderTemplates() {
                const container = document.getElementById('templateGrid');
                container.innerHTML = '';

                this.templates.forEach((template, index) => {
                    const templateDiv = document.createElement('div');
                    templateDiv.className = 'template-card';
                    templateDiv.style.opacity = '0';
                    templateDiv.style.transform = 'translateY(20px)';
                    templateDiv.innerHTML = `
                        <div class="template-preview">
                            <i class="fas fa-certificate"></i>
                        </div>
                        <div class="template-info">
                            <div class="template-name">${template.name}</div>
                            <div class="template-description">${template.description}</div>
                            <div class="template-actions">
                                <button class="btn btn-small btn-secondary" onclick="previewTemplate(${template.id})">
                                    <i class="fas fa-eye"></i>
                                    Preview
                                </button>
                                <button class="btn btn-small btn-primary" onclick="useTemplate(${template.id})">
                                    <i class="fas fa-check"></i>
                                    Use This
                                </button>
                            </div>
                        </div>
                    `;
                    container.appendChild(templateDiv);

                    // Animate in
                    setTimeout(() => {
                        templateDiv.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                        templateDiv.style.opacity = '1';
                        templateDiv.style.transform = 'translateY(0)';
                    }, index * 150);
                });
            }

            renderRecipients() {
                const container = document.getElementById('recipientSelector');
                container.innerHTML = '';

                this.recipients.forEach(recipient => {
                    const recipientDiv = document.createElement('div');
                    recipientDiv.className = 'recipient-item';
                    recipientDiv.innerHTML = `
                        <input type="checkbox" class="recipient-checkbox" 
                               id="recipient-${recipient.id}" 
                               ${recipient.selected ? 'checked' : ''}
                               onchange="toggleRecipient(${recipient.id})">
                        <div class="recipient-info">
                            <div class="recipient-name">${recipient.name}</div>
                            <div class="recipient-details">${this.capitalizeFirst(recipient.type)} • ${this.capitalizeFirst(recipient.category)}</div>
                        </div>
                    `;
                    container.appendChild(recipientDiv);
                });
            }

            renderHistory() {
                const container = document.getElementById('historyList');
                container.innerHTML = '';

                this.history.forEach((item, index) => {
                    const historyDiv = document.createElement('div');
                    historyDiv.className = `history-item ${item.type}`;
                    historyDiv.style.opacity = '0';
                    historyDiv.style.transform = 'translateX(20px)';
                    historyDiv.innerHTML = `
                        <div class="history-icon ${item.type}">
                            <i class="fas ${this.getHistoryIcon(item.type)}"></i>
                        </div>
                        <div class="history-info">
                            <div class="history-title">${item.title}</div>
                            <div class="history-details">${item.details}</div>
                        </div>
                        <div class="history-actions">
                            <button class="btn btn-small btn-secondary" onclick="viewHistoryItem(${item.id})">
                                <i class="fas fa-eye"></i>
                                View
                            </button>
                            <button class="btn btn-small btn-primary" onclick="downloadCertificates(${item.id})">
                                <i class="fas fa-download"></i>
                                Download
                            </button>
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

            initializeAnimations() {
                // Enhanced entrance animations
                setTimeout(() => {
                    document.querySelectorAll('.cert-card').forEach((card, index) => {
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

            getHistoryIcon(type) {
                const icons = {
                    completed: 'fa-check-circle',
                    pending: 'fa-clock',
                    verified: 'fa-shield-check'
                };
                return icons[type] || 'fa-circle';
            }

            capitalizeFirst(str) {
                return str.charAt(0).toUpperCase() + str.slice(1);
            }

            toggleRecipient(id) {
                const recipient = this.recipients.find(r => r.id === id);
                if (recipient) {
                    recipient.selected = !recipient.selected;
                    const selectedCount = this.recipients.filter(r => r.selected).length;
                    this.showToast(`${selectedCount} recipients selected`, 'info');
                }
            }

            // Certificate Stats Functions
            viewGenerated() {
                this.showToast('Opening generated certificates archive...', 'info');
            }

            viewTemplates() {
                this.showToast('Opening template management...', 'info');
            }

            viewVerified() {
                this.showToast('Opening blockchain verification dashboard...', 'info');
            }

            viewPending() {
                this.showToast('Opening pending distribution queue...', 'info');
            }

            // Header Actions
            viewGallery() {
                this.showToast('Opening certificate gallery...', 'info');
            }

            bulkGenerate() {
                this.showToast('Initiating bulk certificate generation...', 'info');
                
                setTimeout(() => {
                    const generated = Math.floor(Math.random() * 200) + 100;
                    this.totalGenerated += generated;
                    document.getElementById('totalGenerated').textContent = this.totalGenerated.toLocaleString();
                    this.showToast(`📜 ${generated} certificates generated successfully!`, 'success');
                }, 4000);
            }

            // Topbar Actions
            openCertificateEditor() {
                document.getElementById('certificateModal').classList.add('active');
                this.initializeFabricCanvas();
                this.showToast('Opening certificate designer...', 'info');
            }

            closeCertificateEditor() {
                document.getElementById('certificateModal').classList.remove('active');
                if (this.fabricCanvas) {
                    this.fabricCanvas.dispose();
                    this.fabricCanvas = null;
                }
            }

            initializeFabricCanvas() {
                if (!window.fabric) {
                    this.showToast('Loading design tools...', 'info');
                    return;
                }

                const canvas = document.getElementById('certificateCanvas');
                this.fabricCanvas = new fabric.Canvas(canvas);
                
                // Set up default certificate background
                this.fabricCanvas.backgroundColor = '#ffffff';
                this.fabricCanvas.renderAll();
                
                // Add default text
                const title = new fabric.Text('CERTIFICATE OF ACHIEVEMENT', {
                    left: 400,
                    top: 150,
                    fontFamily: 'Playfair Display',
                    fontSize: 36,
                    fill: '#f59e0b',
                    fontWeight: 'bold',
                    originX: 'center',
                    originY: 'center'
                });
                
                const subtitle = new fabric.Text('This is to certify that', {
                    left: 400,
                    top: 220,
                    fontFamily: 'Inter',
                    fontSize: 18,
                    fill: '#374151',
                    originX: 'center',
                    originY: 'center'
                });
                
                const name = new fabric.Text('[RECIPIENT NAME]', {
                    left: 400,
                    top: 280,
                    fontFamily: 'Playfair Display',
                    fontSize: 32,
                    fill: '#1f2937',
                    fontWeight: 'bold',
                    originX: 'center',
                    originY: 'center'
                });
                
                const description = new fabric.Text('has successfully completed NexusHack 2025', {
                    left: 400,
                    top: 340,
                    fontFamily: 'Inter',
                    fontSize: 16,
                    fill: '#374151',
                    originX: 'center',
                    originY: 'center'
                });
                
                this.fabricCanvas.add(title, subtitle, name, description);
                this.fabricCanvas.renderAll();
            }

            generateWithAI() {
                this.showToast('Activating AI certificate designer...', 'info');
                
                setTimeout(() => {
                    this.showToast('🤖 AI generated 5 unique certificate designs based on your event theme!', 'success');
                }, 3000);
            }

            blockchainVerify() {
                this.showToast('Connecting to blockchain for verification...', 'info');
                
                setTimeout(() => {
                    const verified = Math.floor(Math.random() * 50) + 20;
                    this.totalVerified += verified;
                    document.getElementById('totalVerified').textContent = this.totalVerified.toLocaleString();
                    this.showToast(`🔐 ${verified} certificates verified on blockchain!`, 'success');
                }, 3500);
            }

            // Template Actions
            previewTemplate(id) {
                const template = this.templates.find(t => t.id === id);
                if (template) {
                    this.showToast(`Previewing ${template.name} template...`, 'info');
                }
            }

            useTemplate(id) {
                const template = this.templates.find(t => t.id === id);
                if (template) {
                    document.getElementById('templateSelect').value = template.name.toLowerCase().replace(' ', '-');
                    this.showToast(`${template.name} template selected`, 'success');
                }
            }

            importTemplate() {
                this.showToast('Opening template import wizard...', 'info');
            }

            createTemplate() {
                this.openCertificateEditor();
            }

            // Generation Actions
            loadPreset() {
                this.showToast('Loading certificate generation preset...', 'info');
            }

            previewCertificates() {
                const selectedRecipients = this.recipients.filter(r => r.selected);
                if (selectedRecipients.length === 0) {
                    this.showToast('Please select at least one recipient', 'warning');
                    return;
                }
                
                this.showToast(`Previewing certificates for ${selectedRecipients.length} recipients...`, 'info');
            }

            generateSelected() {
                const selectedRecipients = this.recipients.filter(r => r.selected);
                if (selectedRecipients.length === 0) {
                    this.showToast('Please select at least one recipient', 'warning');
                    return;
                }
                
                this.showToast(`Generating certificates for ${selectedRecipients.length} recipients...`, 'info');
                
                setTimeout(() => {
                    this.totalGenerated += selectedRecipients.length;
                    document.getElementById('totalGenerated').textContent = this.totalGenerated.toLocaleString();
                    
                    // Add to history
                    const newHistoryItem = {
                        id: Date.now(),
                        type: 'completed',
                        title: `Certificates Generated`,
                        details: `${selectedRecipients.length} certificates created • Just now`,
                        count: selectedRecipients.length
                    };
                    
                    this.history.unshift(newHistoryItem);
                    this.history = this.history.slice(0, 6);
                    this.renderHistory();
                    
                    // Reset selections
                    this.recipients.forEach(r => r.selected = false);
                    this.renderRecipients();
                    
                    this.showToast(`🎉 Successfully generated ${selectedRecipients.length} certificates!`, 'success');
                }, 3000);
            }

            // Certificate Editor Tools
            addText() {
                if (!this.fabricCanvas) return;
                
                const text = new fabric.Text('New Text', {
                    left: 100,
                    top: 100,
                    fontFamily: 'Inter',
                    fontSize: 20,
                    fill: '#000000'
                });
                
                this.fabricCanvas.add(text);
                this.fabricCanvas.setActiveObject(text);
                this.fabricCanvas.renderAll();
            }

            addTitle() {
                if (!this.fabricCanvas) return;
                
                const title = new fabric.Text('CERTIFICATE TITLE', {
                    left: 400,
                    top: 100,
                    fontFamily: 'Playfair Display',
                    fontSize: 32,
                    fill: '#f59e0b',
                    fontWeight: 'bold',
                    originX: 'center',
                    originY: 'center'
                });
                
                this.fabricCanvas.add(title);
                this.fabricCanvas.setActiveObject(title);
                this.fabricCanvas.renderAll();
            }

            addLogo() {
                if (!this.fabricCanvas) return;
                
                // Create a placeholder logo
                const logo = new fabric.Circle({
                    left: 50,
                    top: 50,
                    radius: 40,
                    fill: '#f59e0b',
                    stroke: '#d97706',
                    strokeWidth: 3
                });
                
                const logoText = new fabric.Text('LOGO', {
                    left: 50,
                    top: 50,
                    fontSize: 12,
                    fill: 'white',
                    originX: 'center',
                    originY: 'center'
                });
                
                const group = new fabric.Group([logo, logoText], {
                    left: 50,
                    top: 50
                });
                
                this.fabricCanvas.add(group);
                this.fabricCanvas.setActiveObject(group);
                this.fabricCanvas.renderAll();
            }

            addBorder() {
                if (!this.fabricCanvas) return;
                
                const border = new fabric.Rect({
                    left: 20,
                    top: 20,
                    width: 760,
                    height: 560,
                    fill: 'transparent',
                    stroke: '#f59e0b',
                    strokeWidth: 5,
                    rx: 10,
                    ry: 10
                });
                
                this.fabricCanvas.add(border);
                this.fabricCanvas.sendToBack(border);
                this.fabricCanvas.renderAll();
            }

            addSignature() {
                if (!this.fabricCanvas) return;
                
                const signature = new fabric.Text('_________________', {
                    left: 600,
                    top: 450,
                    fontSize: 16,
                    fill: '#374151'
                });
                
                const signatureLabel = new fabric.Text('Authorized Signature', {
                    left: 600,
                    top: 470,
                    fontSize: 12,
                    fill: '#6b7280'
                });
                
                this.fabricCanvas.add(signature, signatureLabel);
                this.fabricCanvas.renderAll();
            }

            addSeal() {
                if (!this.fabricCanvas) return;
                
                const seal = new fabric.Circle({
                    left: 150,
                    top: 450,
                    radius: 35,
                    fill: 'transparent',
                    stroke: '#ef4444',
                    strokeWidth: 3
                });
                
                const sealText = new fabric.Text('OFFICIAL\nSEAL', {
                    left: 150,
                    top: 450,
                    fontSize: 10,
                    fill: '#ef4444',
                    textAlign: 'center',
                    originX: 'center',
                    originY: 'center'
                });
                
                this.fabricCanvas.add(seal, sealText);
                this.fabricCanvas.renderAll();
            }

            changeFontFamily() {
                if (!this.fabricCanvas) return;
                
                const activeObject = this.fabricCanvas.getActiveObject();
                if (activeObject && activeObject.type === 'text') {
                    const fontFamily = document.getElementById('fontSelector').value;
                    activeObject.set('fontFamily', fontFamily);
                    this.fabricCanvas.renderAll();
                }
            }

            changeColor() {
                if (!this.fabricCanvas) return;
                
                const activeObject = this.fabricCanvas.getActiveObject();
                if (activeObject) {
                    const color = document.getElementById('colorPicker').value;
                    if (activeObject.type === 'text') {
                        activeObject.set('fill', color);
                    } else {
                        activeObject.set('stroke', color);
                    }
                    this.fabricCanvas.renderAll();
                }
            }

            setGradientBG() {
                if (!this.fabricCanvas) return;
                
                const gradient = new fabric.Gradient({
                    type: 'linear',
                    coords: { x1: 0, y1: 0, x2: 800, y2: 600 },
                    colorStops: [
                        { offset: 0, color: '#fbbf24' },
                        { offset: 1, color: '#f59e0b' }
                    ]
                });
                
                this.fabricCanvas.setBackgroundColor(gradient, this.fabricCanvas.renderAll.bind(this.fabricCanvas));
            }

            setSolidBG() {
                if (!this.fabricCanvas) return;
                
                this.fabricCanvas.backgroundColor = '#ffffff';
                this.fabricCanvas.renderAll();
            }

            addPattern() {
                if (!this.fabricCanvas) return;
                
                // Create a simple pattern background
                const pattern = new fabric.Rect({
                    left: 0,
                    top: 0,
                    width: 800,
                    height: 600,
                    fill: 'rgba(245, 158, 11, 0.1)',
                    selectable: false
                });
                
                this.fabricCanvas.add(pattern);
                this.fabricCanvas.sendToBack(pattern);
                this.fabricCanvas.renderAll();
            }

            clearBG() {
                if (!this.fabricCanvas) return;
                
                this.fabricCanvas.backgroundColor = 'transparent';
                this.fabricCanvas.renderAll();
            }

            undoAction() {
                if (!this.fabricCanvas) return;
                
                this.showToast('Undo functionality coming soon...', 'info');
            }

            redoAction() {
                if (!this.fabricCanvas) return;
                
                this.showToast('Redo functionality coming soon...', 'info');
            }

            clearCanvas() {
                if (!this.fabricCanvas) return;
                
                this.fabricCanvas.clear();
                this.fabricCanvas.backgroundColor = '#ffffff';
                this.fabricCanvas.renderAll();
            }

            resetCanvas() {
                if (!this.fabricCanvas) return;
                
                this.fabricCanvas.clear();
                this.initializeFabricCanvas();
            }

            // Canvas Actions
            saveCertificate() {
                if (!this.fabricCanvas) return;
                
                this.showToast('Saving certificate template...', 'info');
                
                setTimeout(() => {
                    this.totalTemplates++;
                    document.getElementById('totalTemplates').textContent = this.totalTemplates.toString();
                    this.showToast('Certificate template saved successfully!', 'success');
                }, 2000);
            }

            previewCertificate() {
                if (!this.fabricCanvas) return;
                
                this.showToast('Opening certificate preview...', 'info');
            }

            generateCertificates() {
                if (!this.fabricCanvas) return;
                
                this.showToast('Generating certificates with current design...', 'info');
                
                setTimeout(() => {
                    const generated = Math.floor(Math.random() * 50) + 10;
                    this.totalGenerated += generated;
                    document.getElementById('totalGenerated').textContent = this.totalGenerated.toLocaleString();
                    this.closeCertificateEditor();
                    this.showToast(`🎨 Generated ${generated} certificates with custom design!`, 'success');
                }, 3000);
            }

            // History Actions
            viewHistoryItem(id) {
                const item = this.history.find(h => h.id === id);
                if (item) {
                    this.showToast(`Opening details for: ${item.title}`, 'info');
                }
            }

            downloadCertificates(id) {
                const item = this.history.find(h => h.id === id);
                if (item) {
                    this.showToast(`Downloading ${item.count} certificates...`, 'info');
                    
                    setTimeout(() => {
                        this.showToast(`📥 ${item.count} certificates downloaded as ZIP file!`, 'success');
                    }, 2000);
                }
            }

            clearHistory() {
                this.history = [];
                this.renderHistory();
                this.showToast('Certificate history cleared', 'success');
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
        let modernCertificateGenerator;

        function toggleRecipient(id) { modernCertificateGenerator.toggleRecipient(id); }
        function viewGenerated() { modernCertificateGenerator.viewGenerated(); }
        function viewTemplates() { modernCertificateGenerator.viewTemplates(); }
        function viewVerified() { modernCertificateGenerator.viewVerified(); }
        function viewPending() { modernCertificateGenerator.viewPending(); }
        function viewGallery() { modernCertificateGenerator.viewGallery(); }
        function bulkGenerate() { modernCertificateGenerator.bulkGenerate(); }
        function openCertificateEditor() { modernCertificateGenerator.openCertificateEditor(); }
        function closeCertificateEditor() { modernCertificateGenerator.closeCertificateEditor(); }
        function generateWithAI() { modernCertificateGenerator.generateWithAI(); }
        function blockchainVerify() { modernCertificateGenerator.blockchainVerify(); }
        function previewTemplate(id) { modernCertificateGenerator.previewTemplate(id); }
        function useTemplate(id) { modernCertificateGenerator.useTemplate(id); }
        function importTemplate() { modernCertificateGenerator.importTemplate(); }
        function createTemplate() { modernCertificateGenerator.createTemplate(); }
        function loadPreset() { modernCertificateGenerator.loadPreset(); }
        function previewCertificates() { modernCertificateGenerator.previewCertificates(); }
        function generateSelected() { modernCertificateGenerator.generateSelected(); }
        function viewHistoryItem(id) { modernCertificateGenerator.viewHistoryItem(id); }
        function downloadCertificates(id) { modernCertificateGenerator.downloadCertificates(id); }
        function clearHistory() { modernCertificateGenerator.clearHistory(); }
        function backToDashboard() { modernCertificateGenerator.backToDashboard(); }

        // Certificate Editor Functions
        function addText() { modernCertificateGenerator.addText(); }
        function addTitle() { modernCertificateGenerator.addTitle(); }
        function addLogo() { modernCertificateGenerator.addLogo(); }
        function addBorder() { modernCertificateGenerator.addBorder(); }
        function addSignature() { modernCertificateGenerator.addSignature(); }
        function addSeal() { modernCertificateGenerator.addSeal(); }
        function changeFontFamily() { modernCertificateGenerator.changeFontFamily(); }
        function changeColor() { modernCertificateGenerator.changeColor(); }
        function setGradientBG() { modernCertificateGenerator.setGradientBG(); }
        function setSolidBG() { modernCertificateGenerator.setSolidBG(); }
        function addPattern() { modernCertificateGenerator.addPattern(); }
        function clearBG() { modernCertificateGenerator.clearBG(); }
        function undoAction() { modernCertificateGenerator.undoAction(); }
        function redoAction() { modernCertificateGenerator.redoAction(); }
        function clearCanvas() { modernCertificateGenerator.clearCanvas(); }
        function resetCanvas() { modernCertificateGenerator.resetCanvas(); }
        function saveCertificate() { modernCertificateGenerator.saveCertificate(); }
        function previewCertificate() { modernCertificateGenerator.previewCertificate(); }
        function generateCertificates() { modernCertificateGenerator.generateCertificates(); }

        document.addEventListener('DOMContentLoaded', () => {
            modernCertificateGenerator = new ModernCertificateGenerator();
            
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
                    name: modernCertificateGenerator.currentUser.name,
                    initials: modernCertificateGenerator.currentUser.initials,
                    role: modernCertificateGenerator.currentUser.role,
                    lastActive: Date.now()
                };
                localStorage.setItem('modernOrganizerSession', JSON.stringify(sessionData));
            }, 60000);

            // Keyboard shortcuts for certificate generation
            document.addEventListener('keydown', (e) => {
                if (e.ctrlKey || e.metaKey) {
                    switch(e.key) {
                        case 'g':
                            e.preventDefault();
                            generateSelected();
                            break;
                        case 'p':
                            e.preventDefault();
                            previewCertificates();
                            break;
                        case 'd':
                            e.preventDefault();
                            openCertificateEditor();
                            break;
                        case 's':
                            e.preventDefault();
                            if (modernCertificateGenerator.fabricCanvas) {
                                saveCertificate();
                            }
                            break;
                    }
                }
                if (e.key === 'Escape') {
                    closeCertificateEditor();
                }
            });

            // Canvas keyboard shortcuts
            document.addEventListener('keydown', (e) => {
                if (modernCertificateGenerator.fabricCanvas && document.getElementById('certificateModal').classList.contains('active')) {
                    if (e.key === 'Delete' || e.key === 'Backspace') {
                        const activeObject = modernCertificateGenerator.fabricCanvas.getActiveObject();
                        if (activeObject) {
                            modernCertificateGenerator.fabricCanvas.remove(activeObject);
                            modernCertificateGenerator.fabricCanvas.renderAll();
                        }
                    }
                    if (e.ctrlKey && e.key === 'z') {
                        e.preventDefault();
                        undoAction();
                    }
                    if (e.ctrlKey && e.key === 'y') {
                        e.preventDefault();
                        redoAction();
                    }
                }
            });

            // Auto-generate certificates for new winners
            setInterval(() => {
                if (Math.random() > 0.9) {
                    const generated = Math.floor(Math.random() * 5) + 1;
                    modernCertificateGenerator.totalGenerated += generated;
                    document.getElementById('totalGenerated').textContent = modernCertificateGenerator.totalGenerated.toLocaleString();
                    
                    // Add to history
                    const newHistoryItem = {
                        id: Date.now(),
                        type: 'completed',
                        title: 'Auto-Generated Certificates',
                        details: `${generated} certificates for new achievements • Just now`,
                        count: generated
                    };
                    
                    modernCertificateGenerator.history.unshift(newHistoryItem);
                    modernCertificateGenerator.history = modernCertificateGenerator.history.slice(0, 6);
                    modernCertificateGenerator.renderHistory();
                }
            }, 120000); // Every 2 minutes
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
            
            /* Enhanced certificate animations */
            .cert-card, .template-card, .history-item { transition: var(--transition) !important; }
            @media (hover: hover) and (pointer: fine) {
                .cert-card:hover { 
                    transform: translateY(-8px) scale(1.02) !important;
                    box-shadow: var(--shadow-lg) !important;
                }
                .template-card:hover { transform: translateY(-6px) !important; }
                .history-item:hover { transform: translateY(-3px) !important; }
            }
            
            /* Enhanced generation status */
            .generation-status {
                position: relative;
                overflow: hidden;
            }
            .generation-status::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
                animation: generationSweep 2s infinite;
            }
            
            @keyframes generationSweep {
                0% { left: -100%; }
                100% { left: 100%; }
            }
            
            /* Enhanced template previews */
            .template-preview {
                position: relative;
                overflow: hidden;
            }
            .template-preview::after {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: 
                    radial-gradient(circle at 30% 40%, rgba(255,255,255,0.1), transparent 50%),
                    radial-gradient(circle at 70% 70%, rgba(255,255,255,0.05), transparent 50%);
                pointer-events: none;
            }
            
            /* Enhanced certificate canvas */
            .certificate-canvas {
                transition: var(--transition);
            }
            .certificate-canvas:hover {
                box-shadow: var(--shadow-certificate);
            }
            
            /* Enhanced tool buttons */
            .tool-btn {
                position: relative;
                overflow: hidden;
            }
            .tool-btn::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(245, 158, 11, 0.2), transparent);
                transition: var(--transition-fast);
            }
            .tool-btn:hover::before {
                left: 100%;
            }
            
            /* Enhanced recipient selection */
            .recipient-item {
                position: relative;
            }
            .recipient-item::before {
                content: '';
                position: absolute;
                left: 0;
                top: 0;
                bottom: 0;
                width: 3px;
                background: var(--gradient-certificate);
                transform: scaleY(0);
                transition: var(--transition);
            }
            .recipient-item:hover::before {
                transform: scaleY(1);
            }
            
            /* Certificate modal animations */
            .certificate-modal-content {
                animation: certificateModalSlide 0.4s ease-out;
            }
            
            @keyframes certificateModalSlide {
                from { 
                    opacity: 0; 
                    transform: scale(0.9) translateY(-20px); 
                }
                to { 
                    opacity: 1; 
                    transform: scale(1) translateY(0); 
                }
            }
            
            /* Enhanced history icons */
            .history-icon {
                position: relative;
                overflow: hidden;
            }
            .history-icon::after {
                content: '';
                position: absolute;
                top: -50%;
                left: -50%;
                width: 200%;
                height: 200%;
                background: linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent);
                transform: rotate(45deg) translateX(-100%);
                transition: var(--transition);
            }
            .history-item:hover .history-icon::after {
                transform: rotate(45deg) translateX(100%);
            }
            
            /* Performance optimizations */
            .template-gallery, .generation-panel, .certificate-history {
                contain: layout style paint;
            }
            
            /* Enhanced mobile certificate grid */
            @media (max-width: 768px) {
                .certificate-grid {
                    grid-template-columns: 1fr !important;
                }
                .template-card {
                    text-align: center;
                }
                .certificate-modal-content {
                    width: 98vw !important;
                    height: 95vh !important;
                }
                .certificate-modal-body {
                    flex-direction: column !important;
                }
                .certificate-tools {
                    width: 100% !important;
                    max-height: 200px !important;
                }
            }
            
            /* Enhanced form inputs */
            .form-input:focus, .form-select:focus {
                background: linear-gradient(145deg, var(--bg-glass), rgba(245, 158, 11, 0.05));
                transform: translateY(-1px);
                box-shadow: var(--shadow-focus), 0 8px 25px rgba(245, 158, 11, 0.15);
            }
            
            /* Certificate generation progress */
            .generation-status.generating {
                background: var(--gradient-warning) !important;
            }
            .generation-status.generating .generation-dot {
                animation: generatingPulse 0.8s infinite;
            }
            
            @keyframes generatingPulse {
                0%, 100% { transform: scale(1); opacity: 1; }
                50% { transform: scale(1.2); opacity: 0.7; }
            }
        `;
        document.head.appendChild(style);