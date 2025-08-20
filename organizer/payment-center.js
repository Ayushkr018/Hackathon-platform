  class ModernPaymentManager {
            constructor() {
                this.transactions = [];
                this.paymentMethods = [];
                this.payoutSchedule = [];
                this.chart = null;
                this.totalRevenue = 125750;
                this.totalExpenses = 45230;
                this.netBalance = 80520;
                this.totalTransactions = 1247;
                this.isMobile = window.innerWidth <= 1024;
                this.currentUser = { name: 'Alex Chen', initials: 'AC', role: 'Lead Organizer', id: 'org_001' };
                this.init();
            }

            init() {
                this.initializeTheme();
                this.setupEventListeners();
                this.loadTransactions();
                this.loadPaymentMethods();
                this.loadPayoutSchedule();
                this.renderTransactions();
                this.renderPaymentMethods();
                this.renderPayoutSchedule();
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

            loadTransactions() {
                // Generate mock transaction data
                this.transactions = [
                    {
                        id: 1,
                        type: 'incoming',
                        title: 'Registration Fees - Batch #47',
                        description: 'Participant registration payments',
                        amount: 2850,
                        currency: 'USD',
                        date: '2 hours ago',
                        status: 'completed'
                    },
                    {
                        id: 2,
                        type: 'incoming',
                        title: 'Sponsor Payment - TechCorp',
                        description: 'Gold sponsor package payment',
                        amount: 15000,
                        currency: 'USD',
                        date: '5 hours ago',
                        status: 'completed'
                    },
                    {
                        id: 3,
                        type: 'outgoing',
                        title: 'Platform Fees',
                        description: 'Monthly platform subscription',
                        amount: 1200,
                        currency: 'USD',
                        date: '1 day ago',
                        status: 'completed'
                    },
                    {
                        id: 4,
                        type: 'pending',
                        title: 'Winner Prize Payout',
                        description: 'First place prize distribution',
                        amount: 10000,
                        currency: 'USD',
                        date: '1 day ago',
                        status: 'pending'
                    },
                    {
                        id: 5,
                        type: 'incoming',
                        title: 'Late Registration',
                        description: 'Last-minute participant payments',
                        amount: 750,
                        currency: 'USD',
                        date: '2 days ago',
                        status: 'completed'
                    },
                    {
                        id: 6,
                        type: 'outgoing',
                        title: 'Judge Honorarium',
                        description: 'Expert judge compensation',
                        amount: 3500,
                        currency: 'USD',
                        date: '3 days ago',
                        status: 'completed'
                    }
                ];
            }

            loadPaymentMethods() {
                this.paymentMethods = [
                    {
                        id: 1,
                        name: 'Credit/Debit Cards',
                        description: 'Visa, MasterCard, Amex',
                        type: 'card',
                        status: 'connected',
                        active: true
                    },
                    {
                        id: 2,
                        name: 'Cryptocurrency',
                        description: 'Bitcoin, Ethereum, USDC',
                        type: 'crypto',
                        status: 'connected',
                        active: false
                    },
                    {
                        id: 3,
                        name: 'Bank Transfer',
                        description: 'Direct bank deposits',
                        type: 'bank',
                        status: 'connected',
                        active: false
                    },
                    {
                        id: 4,
                        name: 'PayPal',
                        description: 'Digital wallet payments',
                        type: 'paypal',
                        status: 'disconnected',
                        active: false
                    }
                ];
            }

            loadPayoutSchedule() {
                this.payoutSchedule = [
                    {
                        id: 1,
                        title: '1st Place Winner',
                        amount: 10000,
                        currency: 'USD',
                        dueDate: 'Tomorrow',
                        recipient: 'AI Innovators'
                    },
                    {
                        id: 2,
                        title: '2nd Place Winner',
                        amount: 5000,
                        currency: 'USD',
                        dueDate: 'In 2 days',
                        recipient: 'Blockchain Masters'
                    },
                    {
                        id: 3,
                        title: 'Judge Payments',
                        amount: 7500,
                        currency: 'USD',
                        dueDate: 'In 1 week',
                        recipient: '15 Expert Judges'
                    },
                    {
                        id: 4,
                        title: 'Sponsor Refund',
                        amount: 2500,
                        currency: 'USD',
                        dueDate: 'In 2 weeks',
                        recipient: 'StartupCorp'
                    }
                ];
            }

            renderTransactions() {
                const container = document.getElementById('transactionList');
                container.innerHTML = '';

                this.transactions.forEach((transaction, index) => {
                    const transactionDiv = document.createElement('div');
                    transactionDiv.className = `transaction-item ${transaction.type}`;
                    transactionDiv.style.opacity = '0';
                    transactionDiv.style.transform = 'translateY(20px)';
                    transactionDiv.innerHTML = `
                        <div class="transaction-icon ${transaction.type}">
                            <i class="fas ${this.getTransactionIcon(transaction.type)}"></i>
                        </div>
                        <div class="transaction-info">
                            <div class="transaction-title">${transaction.title}</div>
                            <div class="transaction-details">${transaction.description} • ${transaction.date}</div>
                        </div>
                        <div class="transaction-amount">
                            <div class="amount-value">${transaction.type === 'outgoing' ? '-' : '+'}$${transaction.amount.toLocaleString()}</div>
                            <div class="amount-label">${transaction.currency}</div>
                        </div>
                    `;
                    container.appendChild(transactionDiv);

                    // Animate in
                    setTimeout(() => {
                        transactionDiv.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                        transactionDiv.style.opacity = '1';
                        transactionDiv.style.transform = 'translateY(0)';
                    }, index * 150);
                });
            }

            renderPaymentMethods() {
                const container = document.getElementById('methodList');
                container.innerHTML = '';

                this.paymentMethods.forEach((method, index) => {
                    const methodDiv = document.createElement('div');
                    methodDiv.className = `method-item ${method.active ? 'active' : ''}`;
                    methodDiv.style.opacity = '0';
                    methodDiv.style.transform = 'translateX(20px)';
                    methodDiv.innerHTML = `
                        <div class="method-icon ${method.type}">
                            <i class="fas ${this.getMethodIcon(method.type)}"></i>
                        </div>
                        <div class="method-info">
                            <div class="method-name">${method.name}</div>
                            <div class="method-description">${method.description}</div>
                        </div>
                        <div class="method-status ${method.status}">${this.capitalizeFirst(method.status)}</div>
                    `;
                    
                    methodDiv.addEventListener('click', () => this.togglePaymentMethod(method.id));
                    container.appendChild(methodDiv);

                    // Animate in
                    setTimeout(() => {
                        methodDiv.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                        methodDiv.style.opacity = '1';
                        methodDiv.style.transform = 'translateX(0)';
                    }, index * 100);
                });
            }

            renderPayoutSchedule() {
                const container = document.getElementById('scheduleList');
                container.innerHTML = '';

                this.payoutSchedule.forEach((payout, index) => {
                    const payoutDiv = document.createElement('div');
                    payoutDiv.className = 'schedule-item';
                    payoutDiv.style.opacity = '0';
                    payoutDiv.style.transform = 'scale(0.95)';
                    payoutDiv.innerHTML = `
                        <div class="schedule-header">
                            <div class="schedule-title">${payout.title}</div>
                            <div class="schedule-amount">$${payout.amount.toLocaleString()}</div>
                        </div>
                        <div class="schedule-details">${payout.recipient} • Due ${payout.dueDate}</div>
                    `;
                    container.appendChild(payoutDiv);

                    // Animate in
                    setTimeout(() => {
                        payoutDiv.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                        payoutDiv.style.opacity = '1';
                        payoutDiv.style.transform = 'scale(1)';
                    }, index * 120);
                });
            }

            initializeChart() {
                const ctx = document.getElementById('revenueChart').getContext('2d');
                const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
                
                // Revenue trend data
                const revenueData = [45000, 52000, 48000, 65000, 78000, 85000, 125750];
                
                this.chart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Current'],
                        datasets: [{
                            label: 'Revenue',
                            data: revenueData,
                            borderColor: '#10b981',
                            backgroundColor: 'rgba(16, 185, 129, 0.1)',
                            borderWidth: 3,
                            fill: true,
                            tension: 0.4,
                            pointBackgroundColor: '#10b981',
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

            getTransactionIcon(type) {
                const icons = {
                    incoming: 'fa-arrow-down',
                    outgoing: 'fa-arrow-up',
                    pending: 'fa-clock'
                };
                return icons[type] || 'fa-circle';
            }

            getMethodIcon(type) {
                const icons = {
                    card: 'fa-credit-card',
                    crypto: 'fa-bitcoin',
                    bank: 'fa-university',
                    paypal: 'fa-paypal'
                };
                return icons[type] || 'fa-circle';
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
                    document.querySelectorAll('.finance-card').forEach((card, index) => {
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

            togglePaymentMethod(id) {
                const method = this.paymentMethods.find(m => m.id === id);
                if (method && method.status === 'connected') {
                    // Deactivate all other methods
                    this.paymentMethods.forEach(m => m.active = false);
                    // Activate selected method
                    method.active = true;
                    this.renderPaymentMethods();
                    this.showToast(`${method.name} selected as primary payment method`, 'success');
                } else {
                    this.showToast(`Please connect ${method.name} first`, 'warning');
                }
            }

            capitalizeFirst(str) {
                return str.charAt(0).toUpperCase() + str.slice(1);
            }

            // Finance Card Functions
            viewRevenue() {
                this.showToast('Opening detailed revenue analytics...', 'info');
            }

            viewExpenses() {
                this.showToast('Opening expense breakdown...', 'info');
            }

            viewBalance() {
                this.showToast('Opening balance details...', 'info');
            }

            viewTransactions() {
                this.showToast('Loading all transaction history...', 'info');
            }

            // Header Actions
            exportFinancials() {
                this.showToast('Generating comprehensive financial report...', 'info');
                
                setTimeout(() => {
                    const financialData = {
                        generated: new Date().toISOString(),
                        event: 'NexusHack 2025',
                        summary: {
                            totalRevenue: this.totalRevenue,
                            totalExpenses: this.totalExpenses,
                            netBalance: this.netBalance,
                            totalTransactions: this.totalTransactions
                        },
                        transactions: this.transactions,
                        payoutSchedule: this.payoutSchedule
                    };

                    const blob = new Blob([JSON.stringify(financialData, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `financial-report-${new Date().toISOString().split('T')[0]}.json`;
                    a.click();
                    URL.revokeObjectURL(url);
                    
                    this.showToast('💰 Financial report exported successfully!', 'success');
                }, 2500);
            }

            initiatePayout() {
                this.showToast('Initiating automated payout process...', 'info');
                
                setTimeout(() => {
                    const pendingPayouts = this.payoutSchedule.length;
                    const totalAmount = this.payoutSchedule.reduce((sum, payout) => sum + payout.amount, 0);
                    this.showToast(`🚀 ${pendingPayouts} payouts initiated for $${totalAmount.toLocaleString()}`, 'success');
                }, 3000);
            }

            // Topbar Actions
            processPayments() {
                this.showToast('Processing pending payments...', 'info');
                
                setTimeout(() => {
                    const newRevenue = Math.floor(Math.random() * 5000) + 2000;
                    this.totalRevenue += newRevenue;
                    document.getElementById('totalRevenue').textContent = `$${this.totalRevenue.toLocaleString()}`;
                    this.showToast(`💳 $${newRevenue.toLocaleString()} in payments processed successfully!`, 'success');
                }, 2500);
            }

            manageCrypto() {
                this.showToast('Opening cryptocurrency payment management...', 'info');
            }

            bankTransfer() {
                this.showToast('Initiating bank transfer system...', 'info');
            }

            // Table Actions
            filterTransactions() {
                this.showToast('Opening transaction filters...', 'info');
            }

            searchTransactions() {
                this.showToast('Opening transaction search...', 'info');
            }

            // Quick Actions
            processWinnerPayout() {
                this.showToast('Processing winner prize payouts...', 'info');
                
                setTimeout(() => {
                    this.showToast('🏆 Winner payouts processed! $25,000 distributed to top 5 teams', 'success');
                }, 3500);
            }

            generateInvoice() {
                this.showToast('Generating sponsor invoice...', 'info');
                
                setTimeout(() => {
                    this.showToast('📄 Invoice #INV-2025-001 generated and sent to sponsor', 'success');
                }, 2000);
            }

            processRefund() {
                this.showToast('Processing refund request...', 'info');
                
                setTimeout(() => {
                    this.showToast('↩️ Refund of $1,250 processed successfully', 'success');
                }, 2500);
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
        let modernPaymentManager;

        function viewRevenue() { modernPaymentManager.viewRevenue(); }
        function viewExpenses() { modernPaymentManager.viewExpenses(); }
        function viewBalance() { modernPaymentManager.viewBalance(); }
        function viewTransactions() { modernPaymentManager.viewTransactions(); }
        function exportFinancials() { modernPaymentManager.exportFinancials(); }
        function initiatePayout() { modernPaymentManager.initiatePayout(); }
        function processPayments() { modernPaymentManager.processPayments(); }
        function manageCrypto() { modernPaymentManager.manageCrypto(); }
        function bankTransfer() { modernPaymentManager.bankTransfer(); }
        function filterTransactions() { modernPaymentManager.filterTransactions(); }
        function searchTransactions() { modernPaymentManager.searchTransactions(); }
        function processWinnerPayout() { modernPaymentManager.processWinnerPayout(); }
        function generateInvoice() { modernPaymentManager.generateInvoice(); }
        function processRefund() { modernPaymentManager.processRefund(); }
        function backToDashboard() { modernPaymentManager.backToDashboard(); }

        document.addEventListener('DOMContentLoaded', () => {
            modernPaymentManager = new ModernPaymentManager();
            
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
                    name: modernPaymentManager.currentUser.name,
                    initials: modernPaymentManager.currentUser.initials,
                    role: modernPaymentManager.currentUser.role,
                    lastActive: Date.now()
                };
                localStorage.setItem('modernOrganizerSession', JSON.stringify(sessionData));
            }, 60000);
           

            // Keyboard shortcuts for payment management
            document.addEventListener('keydown', (e) => {
                if (e.ctrlKey || e.metaKey) {
                    switch(e.key) {
                        case 'p':
                            e.preventDefault();
                            processPayments();
                            break;
                        case 'e':
                            e.preventDefault();
                            exportFinancials();
                            break;
                        case 'i':
                            e.preventDefault();
                            generateInvoice();
                            break;
                        case 'r':
                            e.preventDefault();
                            processRefund();
                            break;
                    }
                }
            });
        });
         function logout() {
                if (confirm('Are you sure you want to logout?')) {
                    localStorage.removeItem('modernOrganizerSession');
                    // Use the global instance to show toast
                    modernPaymentManager.showToast('Logging out...', 'info');
                    setTimeout(() => {
                        window.location.href = '../auth/login.html';
                    }, 1000);
                }
            }

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
            
            /* Enhanced payment animations */
            .finance-card, .transaction-item, .method-item, .schedule-item, .quick-action { 
                transition: var(--transition) !important; 
            }
            @media (hover: hover) and (pointer: fine) {
                .finance-card:hover { 
                    transform: translateY(-8px) scale(1.02) !important;
                    box-shadow: var(--shadow-lg) !important;
                }
                .transaction-item:hover { transform: translateY(-4px) !important; }
                .method-item:hover { transform: translateY(-3px) !important; }
                .schedule-item:hover { transform: scale(1.02) !important; }
                .quick-action:hover { transform: translateY(-4px) scale(1.02) !important; }
            }
            
            /* Enhanced payment status */
            .payment-status {
                position: relative;
                overflow: hidden;
            }
            .payment-status::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
                animation: paymentSweep 2s infinite;
            }
            
            @keyframes paymentSweep {
                0% { left: -100%; }
                100% { left: 100%; }
            }
            
            /* Enhanced transaction animations */
            .transaction-item.incoming::before {
                content: '';
                position: absolute;
                left: 0;
                top: 0;
                bottom: 0;
                width: 4px;
                background: linear-gradient(to bottom, #10b981, transparent);
                animation: incomeFlow 3s infinite;
            }
            
            @keyframes incomeFlow {
                0%, 100% { opacity: 0.3; }
                50% { opacity: 1; }
            }
            
            /* Enhanced method selection */
            .method-item.active {
                position: relative;
                overflow: hidden;
            }
            .method-item.active::after {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 2px;
                background: var(--gradient-payment);
                animation: methodActive 2s infinite;
            }
            
            @keyframes methodActive {
                0%, 100% { opacity: 0.5; }
                50% { opacity: 1; }
            }
            
            /* Performance optimizations */
            .transaction-table, .payment-sidebar {
                contain: layout style paint;
            }
            
            /* Enhanced mobile payment grid */
            @media (max-width: 768px) {
                .finance-card {
                    text-align: center;
                }
                .transaction-item {
                    text-align: center;
                }
            }
        `;
        document.head.appendChild(style);
