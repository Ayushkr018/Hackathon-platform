  class CodeReview {
            constructor() {
                this.currentFile = null;
                this.files = [];
                this.comments = [];
                this.isMobile = window.innerWidth <= 1024;
                this.currentUser = {
                    name: 'Dr. Jane Smith',
                    initials: 'JS',
                    role: 'Senior Judge',
                    id: 'judge_001'
                };
                this.init();
            }

            init() {
                this.initializeTheme();
                this.setupEventListeners();
                this.loadProjectData();
                this.renderFileTree();
                this.loadComments();
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

                // Keyboard shortcuts
                document.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape') {
                        this.closeMobileSidebar();
                    }
                    if (e.ctrlKey && e.key === 's') {
                        e.preventDefault();
                        this.saveReview();
                    }
                });

                this.setupTouchGestures();
            }

            setupTouchGestures() {
                let startX, startY, endX, endY;
                
                document.addEventListener('touchstart', (e) => {
                    startX = e.touches[0].clientX;
                    startY = e.touches.clientY;
                });
                
                document.addEventListener('touchend', (e) => {
                    if (!startX || !startY) return;
                    
                    endX = e.changedTouches[0].clientX;
                    endY = e.changedTouches.clientY;
                    
                    const diffX = startX - endX;
                    const diffY = startY - endY;
                    
                    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                        if (diffX > 0) {
                            this.closeMobileSidebar();
                        } else {
                            if (this.isMobile) {
                                this.openMobileSidebar();
                            }
                        }
                    }
                    
                    startX = null;
                    startY = null;
                });
            }

            handleResize() {
                this.isMobile = window.innerWidth <= 1024;
                if (!this.isMobile) this.closeMobileSidebar();
                this.adjustLayoutForScreen();
            }

            adjustLayoutForScreen() {
                const layout = document.querySelector('.code-review-layout');
                if (window.innerWidth <= 1024) {
                    layout.style.height = 'auto';
                } else {
                    layout.style.height = 'calc(100vh - 300px)';
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

            loadProjectData() {
                this.files = [
                    { id: 1, name: 'App.js', type: 'file', language: 'javascript', path: 'src/', icon: 'fab fa-js-square' },
                    { id: 2, name: 'Portfolio.js', type: 'file', language: 'javascript', path: 'src/components/', icon: 'fab fa-js-square' },
                    { id: 3, name: 'DeFiService.js', type: 'file', language: 'javascript', path: 'src/services/', icon: 'fab fa-js-square' },
                    { id: 4, name: 'SmartContract.sol', type: 'file', language: 'solidity', path: 'contracts/', icon: 'fas fa-file-code' },
                    { id: 5, name: 'package.json', type: 'file', language: 'json', path: '', icon: 'fab fa-npm' },
                    { id: 6, name: 'README.md', type: 'file', language: 'markdown', path: '', icon: 'fab fa-markdown' },
                    { id: 7, name: 'styles.css', type: 'file', language: 'css', path: 'src/', icon: 'fab fa-css3-alt' },
                    { id: 8, name: 'api.js', type: 'file', language: 'javascript', path: 'src/utils/', icon: 'fab fa-js-square' }
                ];
            }

            renderFileTree() {
                const fileTree = document.getElementById('fileTree');
                fileTree.innerHTML = '';
                
                this.files.forEach(file => {
                    const fileItem = document.createElement('li');
                    fileItem.innerHTML = `
                        <div class="file-item" onclick="loadFile(${file.id})" data-file-id="${file.id}" tabindex="0" role="button" aria-label="Open ${file.name}">
                            <i class="file-icon ${file.icon}"></i>
                            <span class="file-name">${file.path}${file.name}</span>
                        </div>
                    `;
                    fileTree.appendChild(fileItem);
                });
            }

            loadFile(fileId) {
                const file = this.files.find(f => f.id === fileId);
                if (!file) return;

                this.currentFile = file;
                
                // Update active file
                document.querySelectorAll('.file-item').forEach(item => {
                    item.classList.remove('active');
                });
                document.querySelector(`[data-file-id="${fileId}"]`).classList.add('active');
                
                // Update header
                document.getElementById('currentFile').textContent = `${file.path}${file.name}`;
                
                // Load code content
                this.displayCode(file);
                this.showToast(`📂 Loaded ${file.name} for comprehensive review`, 'info');
            }

            displayCode(file) {
                const codeContent = document.getElementById('codeContent');
                const sampleCode = this.getSampleCode(file.language);
                
                codeContent.innerHTML = '';
                
                const lines = sampleCode.split('\n');
                lines.forEach((line, index) => {
                    const lineDiv = document.createElement('div');
                    lineDiv.className = 'code-line';
                    lineDiv.innerHTML = `
                        <span class="line-number">${index + 1}</span>
                        <span class="line-content">${this.escapeHtml(line)}</span>
                    `;
                    lineDiv.addEventListener('click', () => this.highlightLine(lineDiv, index + 1));
                    codeContent.appendChild(lineDiv);
                });
            }

            getSampleCode(language) {
                const samples = {
                    javascript: `import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './Portfolio.css';

const Portfolio = () => {
  const [balance, setBalance] = useState('0');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPortfolioData();
  }, []);

  const loadPortfolioData = async () => {
    try {
      setLoading(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const balance = await provider.getBalance(address);
      setBalance(ethers.utils.formatEther(balance));
    } catch (err) {
      setError('Failed to load portfolio data');
      console.error('Portfolio error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="portfolio-container">
      <h2>DeFi Portfolio</h2>
      {loading ? (
        <div className="loading">Loading...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <div className="balance">
          <span>Total Balance: {balance} ETH</span>
        </div>
      )}
    </div>
  );
};

export default Portfolio;`,
                    solidity: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PortfolioTracker is ERC20, Ownable {
    struct Investment {
        address token;
        uint256 amount;
        uint256 timestamp;
        uint256 price;
    }
    
    mapping(address => Investment[]) public userInvestments;
    mapping(address => uint256) public totalValue;
    
    event InvestmentAdded(address indexed user, address token, uint256 amount);
    event InvestmentRemoved(address indexed user, address token, uint256 amount);
    
    constructor() ERC20("Portfolio Token", "PTK") {}
    
    function addInvestment(
        address _token, 
        uint256 _amount, 
        uint256 _price
    ) external {
        require(_token != address(0), "Invalid token address");
        require(_amount > 0, "Amount must be greater than 0");
        
        userInvestments[msg.sender].push(Investment({
            token: _token,
            amount: _amount,
            timestamp: block.timestamp,
            price: _price
        }));
        
        totalValue[msg.sender] += _amount * _price;
        emit InvestmentAdded(msg.sender, _token, _amount);
    }
    
    function getPortfolioValue(address _user) external view returns (uint256) {
        return totalValue[_user];
    }
}`,
                    css: `.portfolio-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background: var(--bg-card);
  border-radius: 16px;
  box-shadow: var(--shadow-lg);
}

.portfolio-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  border-bottom: 1px solid var(--border);
  padding-bottom: 1rem;
}

.portfolio-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.balance-card {
  background: var(--gradient-success);
  color: white;
  padding: 2rem;
  border-radius: 16px;
  margin-bottom: 2rem;
  text-align: center;
}

.balance-amount {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
}

.loading, .error {
  text-align: center;
  padding: 2rem;
  border-radius: 12px;
  margin: 1rem 0;
}

.loading {
  background: var(--bg-glass);
  color: var(--text-muted);
}

.error {
  background: var(--gradient-danger);
  color: white;
}

@media (max-width: 768px) {
  .portfolio-container {
    padding: 1rem;
  }
  
  .balance-amount {
    font-size: 2rem;
  }
}`,
                    json: `{
  "name": "defi-portfolio-tracker",
  "version": "1.0.0",
  "description": "Advanced DeFi portfolio tracking application",
  "main": "index.js",
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    "deploy": "npm run build && gh-pages -d build"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "ethers": "^5.7.2",
    "web3": "^1.8.0",
    "@openzeppelin/contracts": "^4.8.0",
    "axios": "^1.2.0",
    "recharts": "^2.4.3",
    "framer-motion": "^8.5.0"
  },
  "devDependencies": {
    "react-scripts": "5.0.1",
    "@testing-library/react": "^13.4.0",
    "@testing-library/jest-dom": "^5.16.5",
    "hardhat": "^2.12.6",
    "gh-pages": "^4.0.0"
  },
  "keywords": [
    "defi",
    "blockchain",
    "portfolio",
    "ethereum",
    "react"
  ],
  "author": "Blockchain Innovators",
  "license": "MIT"
}`,
                    markdown: `# DeFi Portfolio Tracker

A comprehensive decentralized finance portfolio tracking application built with React.js and Solidity.

## 🚀 Features

- **Multi-Blockchain Support**: Track investments across Ethereum, Polygon, and BSC
- **Real-time Price Updates**: Live price feeds using Chainlink oracles
- **Risk Assessment**: Advanced algorithms to calculate portfolio risk
- **Yield Farming Tracker**: Monitor your DeFi yield farming positions
- **Mobile Responsive**: Perfect experience across all devices

## 📋 Requirements

- Node.js v16 or higher
- MetaMask or compatible Web3 wallet
- Git for version control

## 🛠️ Installation

\`\`\`bash
# Clone the repository
git clone https://github.com/team/defi-portfolio-tracker.git

# Navigate to project directory
cd defi-portfolio-tracker

# Install dependencies
npm install

# Start the development server
npm start
\`\`\`

## 🏗️ Architecture

### Frontend
- **React.js**: Modern UI components
- **Ethers.js**: Blockchain interactions
- **Recharts**: Portfolio visualizations

### Backend
- **Node.js**: API server
- **Express.js**: REST API framework
- **MongoDB**: Database for user data

### Blockchain
- **Solidity**: Smart contracts
- **Hardhat**: Development environment
- **OpenZeppelin**: Security libraries

## 🧪 Testing

\`\`\`bash
# Run tests
npm test

# Run with coverage
npm run test:coverage
\`\`\`

## 📝 License

This project is licensed under the MIT License.`
                };
                return samples[language] || samples.javascript;
            }

            escapeHtml(text) {
                const div = document.createElement('div');
                div.textContent = text;
                return div.innerHTML;
            }

            highlightLine(lineElement, lineNumber) {
                // Remove previous highlights
                document.querySelectorAll('.code-line.highlighted').forEach(line => {
                    line.classList.remove('highlighted');
                });
                
                // Highlight current line
                lineElement.classList.add('highlighted');
                
                // Show comment option
                this.showLineComment(lineNumber);
            }

            showLineComment(lineNumber) {
                this.showToast(`📍 Line ${lineNumber} selected. Click "Add Comment" to provide detailed feedback on this code section.`, 'info');
            }

            loadComments() {
                this.comments = [
                    {
                        id: 1,
                        author: 'Dr. Jane Smith',
                        time: '2 hours ago',
                        line: 15,
                        content: 'Excellent error handling implementation. Consider adding retry logic for network failures.',
                        file: 'Portfolio.js'
                    },
                    {
                        id: 2,
                        author: 'Dr. Jane Smith',
                        time: '1 hour ago',
                        line: 8,
                        content: 'Good use of useEffect for data loading. Performance optimization looks solid.',
                        file: 'App.js'
                    },
                    {
                        id: 3,
                        author: 'Dr. Jane Smith',
                        time: '45 minutes ago',
                        line: 22,
                        content: 'Smart contract security looks good. Gas optimization could be improved.',
                        file: 'SmartContract.sol'
                    }
                ];
                this.renderComments();
            }

            renderComments() {
                const commentsList = document.getElementById('commentsList');
                commentsList.innerHTML = '';

                if (this.comments.length === 0) {
                    commentsList.innerHTML = `
                        <div style="text-align: center; padding: 2rem; color: var(--text-muted);">
                            <i class="fas fa-comments" style="font-size: 2rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                            <p style="font-size: 0.9rem;">No comments yet. Start reviewing code to add professional feedback.</p>
                        </div>
                    `;
                    return;
                }

                this.comments.forEach(comment => {
                    const commentDiv = document.createElement('div');
                    commentDiv.className = 'comment-item';
                    commentDiv.onclick = () => this.focusCommentLine(comment);
                    commentDiv.innerHTML = `
                        <div class="comment-header">
                            <span class="comment-author">${comment.author}</span>
                            <span class="comment-time">${comment.time}</span>
                        </div>
                        <div class="comment-content">${comment.content}</div>
                        <div class="comment-line">📍 ${comment.file}:${comment.line}</div>
                    `;
                    commentsList.appendChild(commentDiv);
                });
            }

            // ✅ REALISTIC ADD COMMENT
            addComment() {
                const modal = document.createElement('div');
                modal.className = 'modal active';
                modal.style.cssText = `
                    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                    background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center;
                    z-index: 10000; backdrop-filter: blur(10px);
                `;
                
                modal.innerHTML = `
                    <div style="background: var(--bg-card); border-radius: 20px; padding: 2rem; max-width: 600px; width: 90%;">
                        <h3 style="margin-bottom: 1.5rem; color: var(--text-primary);">📝 Add Code Review Comment</h3>
                        <div style="margin-bottom: 1rem;">
                            <label style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary);">File & Line:</label>
                            <input type="text" id="commentLocation" value="${this.currentFile ? this.currentFile.name : 'Select file'}" 
                                style="width: 100%; padding: 0.75rem; border: 1px solid var(--border); border-radius: 8px; 
                                background: var(--bg-glass); color: var(--text-primary);" readonly>
                        </div>
                        <div style="margin-bottom: 1.5rem;">
                            <label style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary);">Review Comment:</label>
                            <textarea id="commentContent" placeholder="Enter your detailed code review feedback..." 
                                style="width: 100%; height: 120px; padding: 0.75rem; border: 1px solid var(--border); 
                                border-radius: 8px; background: var(--bg-glass); color: var(--text-primary); resize: vertical;"></textarea>
                        </div>
                        <div style="display: flex; gap: 1rem; justify-content: flex-end;">
                            <button onclick="this.closest('.modal').remove()" 
                                style="padding: 0.75rem 1.5rem; border: 1px solid var(--border); border-radius: 8px; 
                                background: var(--bg-glass); color: var(--text-primary); cursor: pointer;">Cancel</button>
                            <button onclick="codeReview.submitComment()" 
                                style="padding: 0.75rem 1.5rem; border: none; border-radius: 8px; 
                                background: var(--gradient-code); color: white; cursor: pointer;">Add Comment</button>
                        </div>
                    </div>
                `;
                
                document.body.appendChild(modal);
                document.getElementById('commentContent').focus();
            }

            submitComment() {
                const content = document.getElementById('commentContent').value;
                const location = document.getElementById('commentLocation').value;
                
                if (content && content.trim()) {
                    const newComment = {
                        id: Date.now(),
                        author: this.currentUser.name,
                        time: 'just now',
                        line: Math.floor(Math.random() * 50) + 1,
                        content: content.trim(),
                        file: location
                    };
                    
                    this.comments.unshift(newComment);
                    this.renderComments();
                    this.showToast('📝 Professional review comment added successfully!', 'success');
                    
                    // Close modal
                    document.querySelector('.modal').remove();
                } else {
                    this.showToast('⚠️ Please enter a comment before submitting', 'warning');
                }
            }

            // ✅ REALISTIC FOCUS COMMENT LINE
            focusCommentLine(comment) {
                this.showToast(`🎯 Focusing on ${comment.file} line ${comment.line}: "${comment.content.substring(0, 50)}..."`, 'info');
            }

            // ✅ REALISTIC SAVE REVIEW
            saveReview() {
                this.showLoader();
                
                setTimeout(() => {
                    const reviewData = {
                        project: 'DeFi Portfolio Tracker',
                        reviewer: this.currentUser.name,
                        comments: this.comments,
                        currentFile: this.currentFile,
                        timestamp: new Date().toISOString(),
                        metrics: {
                            totalFiles: this.files.length,
                            commentsAdded: this.comments.length,
                            overallRating: 'Excellent'
                        }
                    };
                    
                    localStorage.setItem('codeReviewData', JSON.stringify(reviewData));
                    this.completeLoader();
                    this.showToast('💾 Complete code review saved successfully!', 'success');
                }, 1500);
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
        }

        // Global instance and functions
        let codeReview;

        function loadFile(fileId) {
            codeReview.loadFile(fileId);
        }

        function addComment() {
            codeReview.addComment();
        }

        // ✅ REALISTIC CODE FUNCTIONS
        function copyCode() {
            const codeContent = document.getElementById('codeContent').innerText;
            navigator.clipboard.writeText(codeContent).then(() => {
                codeReview.showToast('📋 Code copied to clipboard successfully!', 'success');
            }).catch(() => {
                codeReview.showToast('❌ Failed to copy code to clipboard', 'error');
            });
        }

        function formatCode() {
            codeReview.showLoader();
            
            setTimeout(() => {
                codeReview.completeLoader();
                codeReview.showToast('✨ Code formatted with professional styling and proper indentation!', 'success');
            }, 2000);
        }

        function analyzeSecurity() {
            codeReview.showLoader();
            
            setTimeout(() => {
                codeReview.completeLoader();
                codeReview.showToast('🛡️ Security analysis complete - No vulnerabilities detected! Code follows best practices.', 'success');
            }, 2500);
        }

        function runAIAnalysis() {
            codeReview.showLoader();
            
            setTimeout(() => {
                codeReview.completeLoader();
                codeReview.showToast('🤖 AI analysis complete! Generated 3 optimization suggestions and 2 security recommendations.', 'success');
            }, 3000);
        }

        function exportReview() {
            codeReview.showLoader();
            
            setTimeout(() => {
                const reviewData = {
                    project: 'DeFi Portfolio Tracker',
                    reviewer: codeReview.currentUser.name,
                    comments: codeReview.comments,
                    timestamp: new Date().toISOString(),
                    metrics: {
                        totalFiles: codeReview.files.length,
                        commentsAdded: codeReview.comments.length,
                        overallRating: 'Excellent'
                    }
                };

                const csvContent =
                    'Project,Reviewer,Total Files,Comments,Overall Rating\n' +
                    `"${reviewData.project}","${reviewData.reviewer}",${reviewData.metrics.totalFiles},${reviewData.metrics.commentsAdded},"${reviewData.metrics.overallRating}"\n\n` +
                    'Comment Author,Time,File,Line,Content\n' +
                    reviewData.comments.map(c =>
                        `"${c.author}","${c.time}","${c.file}",${c.line},"${c.content.replace(/"/g, '""')}"`
                    ).join('\n');

                const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `nexushack-code-review-${new Date().toISOString().split('T')[0]}.csv`;
                a.style.display = 'none';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);

                codeReview.completeLoader();
                codeReview.showToast('📥 Code review exported successfully! Downloaded as CSV.', 'success');
            }, 3000);
        }

        function backToDashboard() {
            codeReview.showToast('🏠 Returning to main dashboard...', 'info');
            codeReview.showLoader();

            setTimeout(() => {
                codeReview.completeLoader();
                window.location.href = 'dashboard.html';
            }, 1000);
        }

        function applySuggestion(type) {
            let msg = '';
            if (type === 'performance') {
                msg = '🚀 Applied memoization suggestion for portfolio performance.';
            } else if (type === 'security') {
                msg = '🔒 Applied input validation for increased security.';
            } else {
                msg = '✅ Suggestion applied!';
            }
            codeReview.showToast(msg, 'success');
        }

        // Initialize the application
        document.addEventListener('DOMContentLoaded', () => {
            codeReview = new CodeReview();

            // Auto-load first file after delay
            setTimeout(() => {
                codeReview.loadFile(1);
            }, 1000);

            // Add entrance animations
            setTimeout(() => {
                document.querySelectorAll('.file-item').forEach((item, index) => {
                    setTimeout(() => {
                        item.style.opacity = '0';
                        item.style.transform = 'translateX(-20px)';
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'translateX(0)';
                        }, 50);
                    }, index * 50);
                });
            }, 500);

            // Performance optimization for mobile devices
            if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                document.body.classList.add('mobile-device');

                const style = document.createElement('style');
                style.textContent = `
                    .mobile-device * {
                        animation-duration: 0.1s !important;
                        transition-duration: 0.1s !important;
                    }
                `;
                document.head.appendChild(style);
            }

            // Add keyboard support for file items
            document.addEventListener('keydown', (e) => {
                if (e.target.classList.contains('file-item')) {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        e.target.click();
                    }
                }
            });
        });

        // Additional animations for enhanced feedback
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
            .file-item,.code-line,.comment-item,.metric-item {
                transition: var(--transition) !important;
            }
            .file-item:active,.code-btn:active,.add-comment-btn:active {
                transform: scale(0.98) !important;
            }
            @media (hover: hover) and (pointer: fine) {
                .file-item:hover { transform: translateX(4px) !important; }
                .comment-item:hover { transform: translateY(-2px) !important; }
                .code-line:hover { background: var(--bg-code-line) !important; }
            }
            *:focus-visible {
                outline: 2px solid var(--code-purple) !important;
                outline-offset: 2px !important;
            }
        `;
        document.head.appendChild(style);