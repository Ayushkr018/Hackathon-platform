class ModernSponsorManager {
            constructor() {
                this.sponsors = [];
                this.opportunities = [];
                this.virtualBooths = [];
                this.chart = null;
                this.currentTier = 'gold';
                this.totalPartners = 8;
                this.totalRevenue = 245000;
                this.totalEngagement = 12400;
                this.activeBooths = 5;
                this.isMobile = window.innerWidth <= 1024;
                this.currentUser = { name: 'Alex Chen', initials: 'AC', role: 'Lead Organizer', id: 'org_001' };
                this.init();
            }

            init() {
                this.initializeTheme();
                this.setupEventListeners();
                this.loadSponsors();
                this.loadOpportunities();
                this.loadVirtualBooths();
                this.renderSponsors();
                this.renderOpportunities();
                this.renderVirtualBooths();
                this.initializeChart();
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

            loadSponsors() {
                // Generate mock sponsor data
                this.sponsors = {
                    gold: [
                        { id: 1, name: 'TechCorp', logo: 'TC', description: 'Leading technology solutions provider' },
                        { id: 2, name: 'InnovateLab', logo: 'IL', description: 'Innovation and R&D company' }
                    ],
                    silver: [
                        { id: 3, name: 'DataFlow', logo: 'DF', description: 'Big data and analytics platform' },
                        { id: 4, name: 'CloudSync', logo: 'CS', description: 'Cloud infrastructure services' },
                        { id: 5, name: 'DevTools', logo: 'DT', description: 'Developer productivity tools' }
                    ],
                    bronze: [
                        { id: 6, name: 'StartupHub', logo: 'SH', description: 'Startup incubation platform' },
                        { id: 7, name: 'CodeAcademy', logo: 'CA', description: 'Programming education platform' }
                    ],
                    startup: [
                        { id: 8, name: 'NeoTech', logo: 'NT', description: 'Emerging technology solutions' }
                    ]
                };
            }

            loadOpportunities() {
                this.opportunities = [
                    {
                        id: 1,
                        title: 'Platinum Tier Partnership',
                        value: '$100K',
                        description: 'Exclusive top-tier sponsorship with premium benefits',
                        benefits: ['Main Stage', 'VIP Access', 'Logo Placement', 'Workshop Slot']
                    },
                    {
                        id: 2,
                        title: 'Innovation Award Sponsor',
                        value: '$25K',
                        description: 'Sponsor the most innovative project award category',
                        benefits: ['Award Naming', 'Prize Delivery', 'Winner Mentorship']
                    },
                    {
                        id: 3,
                        title: 'Workshop Series Partner',
                        value: '$15K',
                        description: 'Sponsor educational workshop series for participants',
                        benefits: ['Workshop Branding', 'Expert Speaker', 'Content Creation']
                    },
                    {
                        id: 4,
                        title: 'Virtual Booth Premium',
                        value: '$5K',
                        description: 'Enhanced virtual booth with interactive features',
                        benefits: ['3D Environment', 'Live Chat', 'Lead Generation']
                    }
                ];
            }

            loadVirtualBooths() {
                this.virtualBooths = [
                    {
                        id: 1,
                        name: 'TechCorp Innovation Hub',
                        logo: 'TC',
                        status: 'live',
                        description: 'Explore cutting-edge technology solutions and career opportunities',
                        metrics: { visitors: 2847, leads: 89, engagement: 4.8 }
                    },
                    {
                        id: 2,
                        name: 'DataFlow Analytics Center',
                        logo: 'DF',
                        status: 'live',
                        description: 'Discover big data solutions and AI-powered analytics platforms',
                        metrics: { visitors: 1923, leads: 67, engagement: 4.6 }
                    },
                    {
                        id: 3,
                        name: 'CloudSync Solutions',
                        logo: 'CS',
                        status: 'setup',
                        description: 'Learn about cloud infrastructure and scalable solutions',
                        metrics: { visitors: 845, leads: 23, engagement: 4.2 }
                    },
                    {
                        id: 4,
                        name: 'InnovateLab Showcase',
                        logo: 'IL',
                        status: 'live',
                        description: 'Innovation lab featuring R&D projects and tech demos',
                        metrics: { visitors: 1456, leads: 45, engagement: 4.5 }
                    },
                    {
                        id: 5,
                        name: 'StartupHub Accelerator',
                        logo: 'SH',
                        status: 'offline',
                        description: 'Startup incubation and acceleration program showcase',
                        metrics: { visitors: 678, leads: 34, engagement: 4.1 }
                    }
                ];
            }

            renderSponsors() {
                const container = document.getElementById('sponsorGridDisplay');
                container.innerHTML = '';

                const tierSponsors = this.sponsors[this.currentTier] || [];

                tierSponsors.forEach((sponsor, index) => {
                    const sponsorDiv = document.createElement('div');
                    sponsorDiv.className = `sponsor-card ${this.currentTier}`;
                    sponsorDiv.style.opacity = '0';
                    sponsorDiv.style.transform = 'translateY(20px)';
                    sponsorDiv.innerHTML = `
                        <div class="sponsor-logo ${this.currentTier}">
                            ${sponsor.logo}
                        </div>
                        <div class="sponsor-name">${sponsor.name}</div>
                        <div class="sponsor-tier ${this.currentTier}">${this.capitalizeFirst(this.currentTier)} Sponsor</div>
                        <div class="sponsor-description">${sponsor.description}</div>
                        <div class="sponsor-actions">
                            <button class="btn btn-small btn-secondary" onclick="viewSponsor(${sponsor.id})">
                                <i class="fas fa-eye"></i>
                                View
                            </button>
                            <button class="btn btn-small btn-primary" onclick="manageSponsor(${sponsor.id})">
                                <i class="fas fa-cog"></i>
                                Manage
                            </button>
                        </div>
                    `;
                    container.appendChild(sponsorDiv);

                    // Animate in
                    setTimeout(() => {
                        sponsorDiv.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                        sponsorDiv.style.opacity = '1';
                        sponsorDiv.style.transform = 'translateY(0)';
                    }, index * 150);
                });
            }

            renderOpportunities() {
                const container = document.getElementById('opportunityList');
                container.innerHTML = '';

                this.opportunities.forEach((opportunity, index) => {
                    const opportunityDiv = document.createElement('div');
                    opportunityDiv.className = 'opportunity-item';
                    opportunityDiv.style.opacity = '0';
                    opportunityDiv.style.transform = 'translateX(20px)';
                    opportunityDiv.innerHTML = `
                        <div class="opportunity-header">
                            <div class="opportunity-title">${opportunity.title}</div>
                            <div class="opportunity-value">${opportunity.value}</div>
                        </div>
                        <div class="opportunity-description">${opportunity.description}</div>
                        <div class="opportunity-benefits">
                            ${opportunity.benefits.map(benefit => 
                                `<span class="benefit-tag">${benefit}</span>`
                            ).join('')}
                        </div>
                    `;
                    
                    opportunityDiv.addEventListener('click', () => this.viewOpportunity(opportunity.id));
                    container.appendChild(opportunityDiv);

                    // Animate in
                    setTimeout(() => {
                        opportunityDiv.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                        opportunityDiv.style.opacity = '1';
                        opportunityDiv.style.transform = 'translateX(0)';
                    }, index * 100);
                });
            }

            renderVirtualBooths() {
                const container = document.getElementById('boothsGrid');
                container.innerHTML = '';

                this.virtualBooths.forEach((booth, index) => {
                    const boothDiv = document.createElement('div');
                    boothDiv.className = 'booth-card';
                    boothDiv.style.opacity = '0';
                    boothDiv.style.transform = 'scale(0.95)';
                    boothDiv.innerHTML = `
                        <div class="booth-header">
                            <div class="booth-logo">${booth.logo}</div>
                            <div class="booth-info">
                                <div class="booth-name">${booth.name}</div>
                                <div class="booth-status ${booth.status}">${this.capitalizeFirst(booth.status)}</div>
                            </div>
                        </div>
                        <div class="booth-description">${booth.description}</div>
                        <div class="booth-metrics">
                            <div class="booth-metric">
                                <div class="booth-metric-value">${booth.metrics.visitors}</div>
                                <div class="booth-metric-label">Visitors</div>
                            </div>
                            <div class="booth-metric">
                                <div class="booth-metric-value">${booth.metrics.leads}</div>
                                <div class="booth-metric-label">Leads</div>
                            </div>
                            <div class="booth-metric">
                                <div class="booth-metric-value">${booth.metrics.engagement}</div>
                                <div class="booth-metric-label">Rating</div>
                            </div>
                        </div>
                        <div class="booth-actions">
                            <button class="btn btn-small btn-secondary" onclick="visitBooth(${booth.id})">
                                <i class="fas fa-external-link-alt"></i>
                                Visit
                            </button>
                            <button class="btn btn-small btn-primary" onclick="editBooth(${booth.id})">
                                <i class="fas fa-edit"></i>
                                Edit
                            </button>
                        </div>
                    `;
                    container.appendChild(boothDiv);

                    // Animate in
                    setTimeout(() => {
                        boothDiv.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                        boothDiv.style.opacity = '1';
                        boothDiv.style.transform = 'scale(1)';
                    }, index * 120);
                });
            }

            initializeChart() {
                const ctx = document.getElementById('revenueChart').getContext('2d');
                const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
                
                // Revenue growth data
                const revenueData = [50000, 85000, 120000, 165000, 190000, 220000, 245000];
                
                this.chart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                        datasets: [{
                            label: 'Sponsor Revenue',
                            data: revenueData,
                            borderColor: '#ec4899',
                            backgroundColor: 'rgba(236, 72, 153, 0.1)',
                            borderWidth: 3,
                            fill: true,
                            tension: 0.4,
                            pointBackgroundColor: '#ec4899',
                            pointBorderColor: '#ffffff',
                            pointBorderWidth: 2,
                            pointRadius: 6
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                display: false
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                grid: {
                                    color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                                },
                                ticks: {
                                    color: isDark ? '#e2e8f0' : '#64748b',
                                    callback: function(value) {
                                        return '$' + (value / 1000) + 'K';
                                    }
                                }
                            },
                            x: {
                                grid: {
                                    color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                                },
                                ticks: {
                                    color: isDark ? '#e2e8f0' : '#64748b'
                                }
                            }
                        }
                    }
                });
            }

            updateChartTheme(theme) {
                if (!this.chart) return;
                
                const isDark = theme === 'dark';
                const textColor = isDark ? '#e2e8f0' : '#64748b';
                const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

                this.chart.options.scales.y.grid.color = gridColor;
                this.chart.options.scales.x.grid.color = gridColor;
                this.chart.options.scales.y.ticks.color = textColor;
                this.chart.options.scales.x.ticks.color = textColor;
                this.chart.update();
            }

            initializeAnimations() {
                // Enhanced entrance animations
                setTimeout(() => {
                    document.querySelectorAll('.sponsor-stat-card').forEach((card, index) => {
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

            capitalizeFirst(str) {
                return str.charAt(0).toUpperCase() + str.slice(1);
            }

            // Tier Management
            showTier(tier) {
                this.currentTier = tier;
                
                // Update active tab
                document.querySelectorAll('.tier-tab').forEach(tab => {
                    tab.classList.remove('active');
                    tab.classList.remove('gold', 'silver', 'bronze', 'startup');
                });
                
                event.target.classList.add('active', tier);
                
                // Render sponsors for selected tier
                this.renderSponsors();
                
                this.showToast(`Showing ${this.capitalizeFirst(tier)} tier sponsors`, 'info');
            }

            viewOpportunity(id) {
                const opportunity = this.opportunities.find(o => o.id === id);
                if (opportunity) {
                    this.showToast(`Opening details for: ${opportunity.title}`, 'info');
                }
            }

            // Sponsor Stats Functions
            viewPartners() {
                this.showToast('Opening partner management dashboard...', 'info');
            }

            viewRevenue() {
                this.showToast('Opening revenue analytics and forecasting...', 'info');
            }

            viewEngagement() {
                this.showToast('Opening engagement metrics and insights...', 'info');
            }

            manageBooths() {
                this.showToast('Opening virtual booth management center...', 'info');
            }

            // Header Actions
            viewContracts() {
                this.showToast('Loading sponsor contracts and agreements...', 'info');
            }

            inviteSponsor() {
                this.showToast('Opening sponsor invitation workflow...', 'info');
                
                setTimeout(() => {
                    this.showToast('📧 Invitation sent to 15 potential sponsors!', 'success');
                }, 2500);
            }

            // Topbar Actions
            addSponsor() {
                this.showToast('Opening new sponsor registration form...', 'info');
                
                setTimeout(() => {
                    this.totalPartners++;
                    document.getElementById('totalPartners').textContent = this.totalPartners.toString();
                    document.getElementById('partnerCount').textContent = this.totalPartners.toString();
                    this.showToast('🤝 New sponsor successfully added to the platform!', 'success');
                }, 3000);
            }

            viewProposals() {
                this.showToast('Opening partnership proposal management...', 'info');
            }

            sponsorAnalytics() {
                this.showToast('Loading comprehensive sponsor analytics...', 'info');
            }

            // Showcase Actions
            manageTiers() {
                this.showToast('Opening sponsor tier management system...', 'info');
            }

            viewSponsor(id) {
                this.showToast(`Opening sponsor profile and details...`, 'info');
            }

            manageSponsor(id) {
                this.showToast(`Opening sponsor management dashboard...`, 'info');
            }

            // Quick Actions
            inviteNewSponsor() {
                this.showToast('Sending personalized sponsor invitations...', 'info');
                
                setTimeout(() => {
                    this.showToast('✉️ Invitations sent to 12 targeted sponsors!', 'success');
                }, 2000);
            }

            createProposal() {
                this.showToast('Opening partnership proposal creator...', 'info');
            }

            setupBooth() {
                this.showToast('Launching virtual booth setup wizard...', 'info');
            }

            generateReport() {
                this.showToast('Generating comprehensive sponsor performance report...', 'info');
                
                setTimeout(() => {
                    this.showToast('📊 Sponsor analytics report generated successfully!', 'success');
                }, 3000);
            }

            // Virtual Booth Actions
            previewBooth() {
                this.showToast('Opening virtual booth preview mode...', 'info');
            }

            createBooth() {
                this.showToast('Opening virtual booth creator...', 'info');
                
                setTimeout(() => {
                    this.activeBooths++;
                    document.getElementById('activeBooths').textContent = this.activeBooths.toString();
                    this.showToast('🏪 New virtual booth created successfully!', 'success');
                }, 2500);
            }

            visitBooth(id) {
                const booth = this.virtualBooths.find(b => b.id === id);
                if (booth) {
                    this.showToast(`Visiting ${booth.name} virtual booth...`, 'info');
                }
            }

            editBooth(id) {
                const booth = this.virtualBooths.find(b => b.id === id);
                if (booth) {
                    this.showToast(`Opening ${booth.name} booth editor...`, 'info');
                }
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
        let modernSponsorManager;

        function showTier(tier) { modernSponsorManager.showTier(tier); }
        function viewPartners() { modernSponsorManager.viewPartners(); }
        function viewRevenue() { modernSponsorManager.viewRevenue(); }
        function viewEngagement() { modernSponsorManager.viewEngagement(); }
        function manageBooths() { modernSponsorManager.manageBooths(); }
        function viewContracts() { modernSponsorManager.viewContracts(); }
        function inviteSponsor() { modernSponsorManager.inviteSponsor(); }
        function addSponsor() { modernSponsorManager.addSponsor(); }
        function viewProposals() { modernSponsorManager.viewProposals(); }
        function sponsorAnalytics() { modernSponsorManager.sponsorAnalytics(); }
        function manageTiers() { modernSponsorManager.manageTiers(); }
        function viewSponsor(id) { modernSponsorManager.viewSponsor(id); }
        function manageSponsor(id) { modernSponsorManager.manageSponsor(id); }
        function inviteNewSponsor() { modernSponsorManager.inviteNewSponsor(); }
        function createProposal() { modernSponsorManager.createProposal(); }
        function setupBooth() { modernSponsorManager.setupBooth(); }
        function generateReport() { modernSponsorManager.generateReport(); }
        function previewBooth() { modernSponsorManager.previewBooth(); }
        function createBooth() { modernSponsorManager.createBooth(); }
        function visitBooth(id) { modernSponsorManager.visitBooth(id); }
        function editBooth(id) { modernSponsorManager.editBooth(id); }
        function backToDashboard() { modernSponsorManager.backToDashboard(); }

        document.addEventListener('DOMContentLoaded', () => {
            modernSponsorManager = new ModernSponsorManager();
            
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
                    name: modernSponsorManager.currentUser.name,
                    initials: modernSponsorManager.currentUser.initials,
                    role: modernSponsorManager.currentUser.role,
                    lastActive: Date.now()
                };
                localStorage.setItem('modernOrganizerSession', JSON.stringify(sessionData));
            }, 60000);

            // Keyboard shortcuts for sponsor management
            document.addEventListener('keydown', (e) => {
                if (e.ctrlKey || e.metaKey) {
                    switch(e.key) {
                        case 's':
                            e.preventDefault();
                            addSponsor();
                            break;
                        case 'i':
                            e.preventDefault();
                            inviteSponsor();
                            break;
                        case 'p':
                            e.preventDefault();
                            viewProposals();
                            break;
                        case 'b':
                            e.preventDefault();
                            createBooth();
                            break;
                        case 'r':
                            e.preventDefault();
                            generateReport();
                            break;
                    }
                }
            });

            // Auto-update engagement metrics
            setInterval(() => {
                if (Math.random() > 0.7) {
                    const viewsIncrease = Math.floor(Math.random() * 50) + 10;
                    const currentViews = parseFloat(document.getElementById('totalViews').textContent.replace('K', '')) * 1000;
                    const newViews = (currentViews + viewsIncrease) / 1000;
                    document.getElementById('totalViews').textContent = newViews.toFixed(1) + 'K';
                }
            }, 30000); // Every 30 seconds

            // Sponsor booth status updates
            setInterval(() => {
                if (Math.random() > 0.8) {
                    modernSponsorManager.totalEngagement += Math.floor(Math.random() * 100) + 50;
                    document.getElementById('totalEngagement').textContent = 
                        (modernSponsorManager.totalEngagement / 1000).toFixed(1) + 'K';
                }
            }, 45000); // Every 45 seconds
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
            
            /* Enhanced sponsor animations */
            .sponsor-stat-card, .sponsor-card, .opportunity-item, .booth-card { 
                transition: var(--transition) !important; 
            }
            @media (hover: hover) and (pointer: fine) {
                .sponsor-stat-card:hover { 
                    transform: translateY(-8px) scale(1.02) !important;
                    box-shadow: var(--shadow-lg) !important;
                }
                .sponsor-card:hover { transform: translateY(-8px) !important; }
                .opportunity-item:hover { transform: translateY(-4px) !important; }
                .booth-card:hover { transform: translateY(-6px) scale(1.02) !important; }
            }
            
            /* Enhanced sponsor status */
            .sponsor-status {
                position: relative;
                overflow: hidden;
            }
            .sponsor-status::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
                animation: sponsorStatusSweep 3s infinite;
            }
            
            @keyframes sponsorStatusSweep {
                0% { left: -100%; }
                100% { left: 100%; }
            }
            
            /* Enhanced tier tabs */
            .tier-tab {
                position: relative;
                overflow: hidden;
            }
            .tier-tab::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
                transition: var(--transition-fast);
            }
            .tier-tab:hover::before {
                left: 100%;
            }
            
            /* Enhanced sponsor logos */
            .sponsor-logo {
                position: relative;
                overflow: hidden;
            }
            .sponsor-logo::after {
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
            .sponsor-card:hover .sponsor-logo::after {
                transform: rotate(45deg) translateX(100%);
            }
            
            /* Enhanced virtual booth indicators */
            .booth-status.live {
                position: relative;
            }
            .booth-status.live::before {
                content: '';
                position: absolute;
                left: -5px;
                top: 50%;
                transform: translateY(-50%);
                width: 6px;
                height: 6px;
                background: #10b981;
                border-radius: 50%;
                animation: liveIndicator 1.5s infinite;
            }
            
            @keyframes liveIndicator {
                0%, 100% { opacity: 1; transform: translateY(-50%) scale(1); }
                50% { opacity: 0.3; transform: translateY(-50%) scale(1.3); }
            }
            
            /* Enhanced opportunity values */
            .opportunity-value {
                position: relative;
                overflow: hidden;
            }
            .opportunity-value::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
                animation: valueShine 2s infinite;
            }
            
            @keyframes valueShine {
                0% { left: -100%; }
                100% { left: 100%; }
            }
            
            /* Enhanced revenue chart container */
            .chart-container {
                position: relative;
            }
            .chart-container::before {
                content: '';
                position: absolute;
                top: 10px;
                right: 10px;
                width: 8px;
                height: 8px;
                background: #10b981;
                border-radius: 50%;
                animation: chartLive 2s infinite;
            }
            
            @keyframes chartLive {
                0%, 100% { opacity: 0.3; }
                50% { opacity: 1; }
            }
            
            /* Enhanced booth metrics */
            .booth-metric {
                position: relative;
                overflow: hidden;
            }
            .booth-metric::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(236, 72, 153, 0.1), transparent);
                animation: metricUpdate 3s infinite;
            }
            
            @keyframes metricUpdate {
                0% { left: -100%; }
                100% { left: 100%; }
            }
            
            /* Enhanced quick action buttons */
            .quick-action-btn {
                position: relative;
            }
            .quick-action-btn::after {
                content: '';
                position: absolute;
                top: 0;
                right: 0;
                bottom: 0;
                width: 3px;
                background: var(--gradient-sponsor);
                opacity: 0;
                transition: var(--transition);
            }
            .quick-action-btn:hover::after {
                opacity: 1;
            }
            
            /* Enhanced benefit tags */
            .benefit-tag {
                position: relative;
                overflow: hidden;
            }
            .benefit-tag::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(236, 72, 153, 0.1), transparent);
                transition: var(--transition-fast);
            }
            .opportunity-item:hover .benefit-tag::before {
                left: 100%;
            }
            
            /* Enhanced partner count */
            .partner-count {
                position: relative;
                overflow: hidden;
            }
            .partner-count::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(236, 72, 153, 0.2), transparent);
                animation: partnerCountUpdate 2s infinite;
            }
            
            @keyframes partnerCountUpdate {
                0% { left: -100%; }
                100% { left: 100%; }
            }
            
            /* Performance optimizations */
            .sponsor-showcase, .partner-panel, .virtual-booths {
                contain: layout style paint;
            }
            
            /* Enhanced mobile sponsor grid */
            @media (max-width: 768px) {
                .sponsor-grid {
                    grid-template-columns: 1fr !important;
                }
                .sponsor-card {
                    text-align: center;
                }
                .tier-tab {
                    padding: 0.6rem 1rem !important;
                    font-size: 0.8rem !important;
                }
            }
            
            /* Enhanced sponsor tier indicators */
            .sponsor-card.gold::before {
                content: '';
                position: absolute;
                top: -2px;
                left: -2px;
                right: -2px;
                bottom: -2px;
                background: var(--gradient-gold);
                border-radius: inherit;
                z-index: -1;
                opacity: 0;
                transition: var(--transition);
            }
            .sponsor-card.gold:hover::before {
                opacity: 0.1;
            }
            
            .sponsor-card.silver::before {
                content: '';
                position: absolute;
                top: -2px;
                left: -2px;
                right: -2px;
                bottom: -2px;
                background: var(--gradient-silver);
                border-radius: inherit;
                z-index: -1;
                opacity: 0;
                transition: var(--transition);
            }
            .sponsor-card.silver:hover::before {
                opacity: 0.1;
            }
            
            .sponsor-card.bronze::before {
                content: '';
                position: absolute;
                top: -2px;
                left: -2px;
                right: -2px;
                bottom: -2px;
                background: var(--gradient-bronze);
                border-radius: inherit;
                z-index: -1;
                opacity: 0;
                transition: var(--transition);
            }
            .sponsor-card.bronze:hover::before {
                opacity: 0.1;
            }
            
            .sponsor-card.startup::before {
                content: '';
                position: absolute;
                top: -2px;
                left: -2px;
                right: -2px;
                bottom: -2px;
                background: var(--gradient-partnership);
                border-radius: inherit;
                z-index: -1;
                opacity: 0;
                transition: var(--transition);
            }
            .sponsor-card.startup:hover::before {
                opacity: 0.1;
            }
            
            /* Enhanced engagement metrics */
            .metric-value {
                position: relative;
            }
            .metric-value::after {
                content: '';
                position: absolute;
                top: 0;
                right: -15px;
                width: 6px;
                height: 6px;
                background: #ec4899;
                border-radius: 50%;
                animation: metricLive 1.5s infinite;
            }
            
            @keyframes metricLive {
                0%, 100% { opacity: 0; transform: scale(0.8); }
                50% { opacity: 1; transform: scale(1.2); }
            }
            
            /* Enhanced booth card headers */
            .booth-header {
                position: relative;
            }
            .booth-header::after {
                content: '';
                position: absolute;
                bottom: -10px;
                left: 0;
                right: 0;
                height: 1px;
                background: linear-gradient(to right, var(--gradient-sponsor), transparent);
                opacity: 0;
                transition: var(--transition);
            }
            .booth-card:hover .booth-header::after {
                opacity: 1;
            }
            
            /* Touch feedback for mobile */
            @media (hover: none) {
                .sponsor-card:active {
                    transform: scale(0.98);
                }
                .tier-tab:active {
                    transform: scale(0.95);
                }
                .quick-action-btn:active {
                    transform: scale(0.98);
                }
            }
            
            /* Enhanced form inputs for sponsor management */
            .sponsor-input:focus {
                background: linear-gradient(145deg, var(--bg-glass), rgba(236, 72, 153, 0.05));
                transform: translateY(-1px);
                box-shadow: var(--shadow-focus), 0 8px 25px rgba(236, 72, 153, 0.15);
            }
            
            /* Loading states for sponsor data */
            .loading-sponsor {
                position: relative;
                overflow: hidden;
            }
            .loading-sponsor::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(236, 72, 153, 0.2), transparent);
                animation: sponsorLoadingShimmer 1.5s infinite;
            }
            
            @keyframes sponsorLoadingShimmer {
                0% { left: -100%; }
                100% { left: 100%; }
            }
        `;
        document.head.appendChild(style);