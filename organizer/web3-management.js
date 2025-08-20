  class ModernWeb3Manager {
            constructor() {
                this.nfts = [];
                this.contracts = [];
                this.rewards = [];
                this.chart = null;
                this.walletConnected = true;
                this.blockchainNetwork = 'Polygon';
                this.isMobile = window.innerWidth <= 1024;
                this.currentUser = { name: 'Alex Chen', initials: 'AC', role: 'Lead Organizer', id: 'org_001' };
                this.init();
            }

            init() {
                this.initializeTheme();
                this.setupEventListeners();
                this.loadNFTs();
                this.loadContracts();
                this.loadRewards();
                this.renderNFTs();
                this.renderContracts();
                this.renderRewards();
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

            loadNFTs() {
                // Generate mock NFT data
                this.nfts = [
                    {
                        id: 1,
                        name: 'Winner Certificate #001',
                        description: 'First place winner achievement NFT',
                        type: 'certificate',
                        minted: true,
                        recipient: 'AI Innovators',
                        tokenId: 'NHACK-001'
                    },
                    {
                        id: 2,
                        name: 'Participation Badge #127',
                        description: 'Hackathon participation commemorative NFT',
                        type: 'badge',
                        minted: true,
                        recipient: 'Blockchain Masters',
                        tokenId: 'NHACK-127'
                    },
                    {
                        id: 3,
                        name: 'Innovation Award #003',
                        description: 'Most innovative project recognition',
                        type: 'award',
                        minted: false,
                        recipient: 'Green Code',
                        tokenId: 'NHACK-003'
                    },
                    {
                        id: 4,
                        name: 'Track Leader #004',
                        description: 'Web3 track leader achievement',
                        type: 'leader',
                        minted: true,
                        recipient: 'Mobile Wizards',
                        tokenId: 'NHACK-004'
                    }
                ];
            }

            loadContracts() {
                this.contracts = [
                    {
                        name: 'NHACK Token',
                        status: 'deployed',
                        address: '0x742d35Cc6583C0532925a3b8D87f19CE1d65de5F',
                        type: 'ERC-20'
                    },
                    {
                        name: 'Certificate NFT',
                        status: 'deployed',
                        address: '0x8ba1f109551bD432803012645Hac136c8dC104A1',
                        type: 'ERC-721'
                    },
                    {
                        name: 'Reward Distribution',
                        status: 'deployed',
                        address: '0x9ca2f108442bE421804023646Hac237d9dC205B2',
                        type: 'Custom'
                    },
                    {
                        name: 'Voting System',
                        status: 'pending',
                        address: '0x0000000000000000000000000000000000000000',
                        type: 'DAO'
                    },
                    {
                        name: 'Prize Pool',
                        status: 'deployed',
                        address: '0x7ba3f207551aE532904034647Hac338e8dC306C3',
                        type: 'Escrow'
                    }
                ];
            }

            loadRewards() {
                this.rewards = [
                    {
                        title: '1st Place Prize',
                        description: '10,000 NHACK + Exclusive NFT',
                        amount: '10,000',
                        currency: 'NHACK',
                        status: 'pending'
                    },
                    {
                        title: '2nd Place Prize',
                        description: '5,000 NHACK + Certificate NFT',
                        amount: '5,000',
                        currency: 'NHACK',
                        status: 'pending'
                    },
                    {
                        title: 'Participation Reward',
                        description: '100 NHACK per participant',
                        amount: '100',
                        currency: 'NHACK',
                        status: 'distributed'
                    },
                    {
                        title: 'Track Winner',
                        description: '1,000 NHACK + Special NFT',
                        amount: '1,000',
                        currency: 'NHACK',
                        status: 'distributed'
                    }
                ];
            }

            renderNFTs() {
                const container = document.getElementById('nftGrid');
                container.innerHTML = '';

                this.nfts.forEach((nft, index) => {
                    const nftDiv = document.createElement('div');
                    nftDiv.className = 'nft-card';
                    nftDiv.style.opacity = '0';
                    nftDiv.style.transform = 'translateY(20px)';
                    nftDiv.innerHTML = `
                        <div class="nft-preview">
                            <i class="fas ${this.getNFTIcon(nft.type)}"></i>
                        </div>
                        <div class="nft-info">
                            <div class="nft-name">${nft.name}</div>
                            <div class="nft-description">${nft.description}</div>
                            <div class="nft-actions">
                                <button class="btn btn-small ${nft.minted ? 'btn-success' : 'btn-crypto'}" 
                                        onclick="toggleMint(${nft.id})">
                                    <i class="fas ${nft.minted ? 'fa-check' : 'fa-hammer'}"></i>
                                    ${nft.minted ? 'Minted' : 'Mint'}
                                </button>
                                <button class="btn btn-small btn-secondary" onclick="viewNFT(${nft.id})">
                                    <i class="fas fa-eye"></i>
                                    View
                                </button>
                            </div>
                        </div>
                    `;
                    container.appendChild(nftDiv);

                    // Animate in
                    setTimeout(() => {
                        nftDiv.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                        nftDiv.style.opacity = '1';
                        nftDiv.style.transform = 'translateY(0)';
                    }, index * 150);
                });
            }

            renderContracts() {
                const container = document.getElementById('contractList');
                container.innerHTML = '';

                this.contracts.forEach((contract, index) => {
                    const contractDiv = document.createElement('div');
                    contractDiv.className = 'contract-item';
                    contractDiv.style.opacity = '0';
                    contractDiv.style.transform = 'translateX(20px)';
                    contractDiv.innerHTML = `
                        <div class="contract-header">
                            <div class="contract-name">${contract.name}</div>
                            <div class="contract-status ${contract.status}">${this.capitalizeFirst(contract.status)}</div>
                        </div>
                        <div class="contract-address">${contract.address}</div>
                    `;
                    container.appendChild(contractDiv);

                    // Animate in
                    setTimeout(() => {
                        contractDiv.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                        contractDiv.style.opacity = '1';
                        contractDiv.style.transform = 'translateX(0)';
                    }, index * 100);
                });
            }

            renderRewards() {
                const container = document.getElementById('rewardList');
                container.innerHTML = '';

                this.rewards.forEach((reward, index) => {
                    const rewardDiv = document.createElement('div');
                    rewardDiv.className = 'reward-item';
                    rewardDiv.style.opacity = '0';
                    rewardDiv.style.transform = 'scale(0.95)';
                    rewardDiv.innerHTML = `
                        <div class="reward-info">
                            <div class="reward-title">${reward.title}</div>
                            <div class="reward-description">${reward.description}</div>
                        </div>
                        <div class="reward-amount">
                            <div class="amount-value">${reward.amount}</div>
                            <div class="amount-label">${reward.currency}</div>
                        </div>
                    `;
                    container.appendChild(rewardDiv);

                    // Animate in
                    setTimeout(() => {
                        rewardDiv.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                        rewardDiv.style.opacity = '1';
                        rewardDiv.style.transform = 'scale(1)';
                    }, index * 120);
                });
            }

            initializeChart() {
                const ctx = document.getElementById('distributionChart').getContext('2d');
                const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
                
                // Token distribution data
                const distributionData = {
                    prizes: 25000,
                    participation: 15000,
                    team: 5000,
                    reserve: 5000
                };
                
                this.chart = new Chart(ctx, {
                    type: 'doughnut',
                    data: {
                        labels: ['Prize Pool', 'Participation', 'Team Rewards', 'Reserve'],
                        datasets: [{
                            data: [distributionData.prizes, distributionData.participation, distributionData.team, distributionData.reserve],
                            backgroundColor: ['#8b5cf6', '#ec4899', '#06b6d4', '#10b981'],
                            borderColor: ['#7c3aed', '#db2777', '#0891b2', '#059669'],
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
                                    padding: 12,
                                    usePointStyle: true,
                                    font: { size: 10 }
                                }
                            }
                        }
                    }
                });
            }

            getNFTIcon(type) {
                const icons = {
                    certificate: 'fa-certificate',
                    badge: 'fa-medal',
                    award: 'fa-trophy',
                    leader: 'fa-crown'
                };
                return icons[type] || 'fa-image';
            }

            updateChartTheme(theme) {
                if (!this.chart) return;
                
                const isDark = theme === 'dark';
                const textColor = isDark ? '#e2e8f0' : '#64748b';

                this.chart.options.plugins.legend.labels.color = textColor;
                this.chart.update();
            }

            initializeAnimations() {
                // Enhanced entrance animations
                setTimeout(() => {
                    document.querySelectorAll('.stat-card').forEach((card, index) => {
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

            // Stat Card Functions
            manageNFTs() {
                this.showToast('Opening NFT management dashboard...', 'info');
            }

            manageCrypto() {
                this.showToast('Opening cryptocurrency management...', 'info');
            }

            manageContracts() {
                this.showToast('Opening smart contract manager...', 'info');
            }

            manageRewards() {
                this.showToast('Opening reward distribution system...', 'info');
            }

            // Header Actions
            connectWallet() {
                this.showToast('Connecting to Web3 wallet...', 'info');
                
                setTimeout(() => {
                    this.walletConnected = true;
                    document.getElementById('blockchainStatus').innerHTML = `
                        <div class="blockchain-dot"></div>
                        <span>CONNECTED</span>
                    `;
                    this.showToast('🔗 Wallet connected successfully to Polygon network!', 'success');
                }, 2000);
            }

            airdropTokens() {
                this.showToast('Initiating token airdrop to participants...', 'info');
                
                setTimeout(() => {
                    const tokensDistributed = 12400;
                    const recipients = 124;
                    this.showToast(`🎁 Airdrop completed! ${tokensDistributed} NHACK tokens sent to ${recipients} participants`, 'success');
                }, 3500);
            }

            // Topbar Actions
            deployContract() {
                this.showToast('Deploying smart contract to blockchain...', 'info');
                
                setTimeout(() => {
                    this.showToast('🚀 Smart contract deployed successfully! Gas used: 0.0234 MATIC', 'success');
                }, 4000);
            }

            mintNFTs() {
                this.showToast('Minting NFT collection for winners...', 'info');
                
                setTimeout(() => {
                    const nftsCount = Math.floor(Math.random() * 10) + 15;
                    document.getElementById('totalNFTs').textContent = (127 + nftsCount).toString();
                    this.showToast(`🎨 Successfully minted ${nftsCount} new NFTs for winners and participants!`, 'success');
                }, 3000);
            }

            openExplorer() {
                this.showToast('Opening blockchain explorer...', 'info');
            }

            // Gallery Actions
            refreshNFTs() {
                this.showToast('Refreshing NFT collection from blockchain...', 'info');
                
                setTimeout(() => {
                    this.renderNFTs();
                    this.showToast('NFT gallery refreshed with latest data!', 'success');
                }, 1500);
            }

            createNFT() {
                this.showToast('Opening NFT creation studio...', 'info');
            }

            // NFT Actions
            toggleMint(id) {
                const nft = this.nfts.find(n => n.id === id);
                if (nft) {
                    if (nft.minted) {
                        this.showToast(`NFT "${nft.name}" is already minted`, 'warning');
                    } else {
                        this.showToast(`Minting "${nft.name}" for ${nft.recipient}...`, 'info');
                        
                        setTimeout(() => {
                            nft.minted = true;
                            this.renderNFTs();
                            this.showToast(`🎨 "${nft.name}" minted successfully!`, 'success');
                        }, 2500);
                    }
                }
            }

            viewNFT(id) {
                const nft = this.nfts.find(n => n.id === id);
                if (nft) {
                    this.showToast(`Opening details for "${nft.name}"...`, 'info');
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
        let modernWeb3Manager;

        function manageNFTs() { modernWeb3Manager.manageNFTs(); }
        function manageCrypto() { modernWeb3Manager.manageCrypto(); }
        function manageContracts() { modernWeb3Manager.manageContracts(); }
        function manageRewards() { modernWeb3Manager.manageRewards(); }
        function connectWallet() { modernWeb3Manager.connectWallet(); }
        function airdropTokens() { modernWeb3Manager.airdropTokens(); }
        function deployContract() { modernWeb3Manager.deployContract(); }
        function mintNFTs() { modernWeb3Manager.mintNFTs(); }
        function openExplorer() { modernWeb3Manager.openExplorer(); }
        function refreshNFTs() { modernWeb3Manager.refreshNFTs(); }
        function createNFT() { modernWeb3Manager.createNFT(); }
        function toggleMint(id) { modernWeb3Manager.toggleMint(id); }
        function viewNFT(id) { modernWeb3Manager.viewNFT(id); }
        function backToDashboard() { modernWeb3Manager.backToDashboard(); }

        document.addEventListener('DOMContentLoaded', () => {
            modernWeb3Manager = new ModernWeb3Manager();
            
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
                    name: modernWeb3Manager.currentUser.name,
                    initials: modernWeb3Manager.currentUser.initials,
                    role: modernWeb3Manager.currentUser.role,
                    lastActive: Date.now()
                };
                localStorage.setItem('modernOrganizerSession', JSON.stringify(sessionData));
            }, 60000);
           

            

            // Keyboard shortcuts for Web3 management
            document.addEventListener('keydown', (e) => {
                if (e.ctrlKey || e.metaKey) {
                    switch(e.key) {
                        case 'n':
                            e.preventDefault();
                            createNFT();
                            break;
                        case 'm':
                            e.preventDefault();
                            mintNFTs();
                            break;
                        case 'd':
                            e.preventDefault();
                            deployContract();
                            break;
                        case 'w':
                            e.preventDefault();
                            connectWallet();
                            break;
                    }
                }
            });
        });
        
         // Logout function
            function logout() {
                if (confirm('Are you sure you want to logout?')) {
                    localStorage.removeItem('modernOrganizerSession');
                    modernWeb3Manager.showToast('Logging out...', 'info');
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
            
            /* Enhanced Web3 animations */
            .stat-card, .nft-card, .contract-item, .reward-item { transition: var(--transition) !important; }
            @media (hover: hover) and (pointer: fine) {
                .stat-card:hover { 
                    transform: translateY(-8px) scale(1.02) !important;
                    box-shadow: var(--shadow-lg) !important;
                }
                .nft-card:hover { transform: translateY(-6px) !important; }
                .contract-item:hover { transform: translateX(6px) !important; }
                .reward-item:hover { transform: scale(1.02) !important; }
            }
            
            /* Enhanced crypto pulse effects */
            .blockchain-status {
                position: relative;
                overflow: hidden;
            }
            .blockchain-status::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
                animation: cryptoSweep 2s infinite;
            }
            
            @keyframes cryptoSweep {
                0% { left: -100%; }
                100% { left: 100%; }
            }
            
            /* NFT shimmer effects */
            .nft-preview {
                position: relative;
                overflow: hidden;
            }
            
            /* Enhanced wallet connection */
            .wallet-card {
                position: relative;
                overflow: hidden;
            }
            .wallet-card::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 2px;
                background: var(--gradient-crypto);
                animation: walletPulse 3s infinite;
            }
            
            @keyframes walletPulse {
                0%, 100% { opacity: 0.3; }
                50% { opacity: 1; }
            }
            
            /* Smart contract indicators */
            .contract-status.deployed::after {
                content: '';
                position: absolute;
                top: 50%;
                right: -5px;
                width: 6px;
                height: 6px;
                background: #10b981;
                border-radius: 50%;
                transform: translateY(-50%);
                animation: pulse 2s infinite;
            }
            
            /* Performance optimizations */
            .nft-gallery, .blockchain-sidebar {
                contain: layout style paint;
            }
            
            /* Enhanced mobile NFT grid */
            @media (max-width: 480px) {
                .nft-card {
                    text-align: center;
                }
                .nft-actions {
                    flex-direction: column;
                    gap: 0.5rem;
                }
            }
        `;
        document.head.appendChild(style);
    
