 const themeToggle = document.getElementById('themeToggle');
        const html = document.documentElement;
        const themeIcon = themeToggle.querySelector('i');
        
        themeToggle.addEventListener('click', () => {
            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            themeIcon.className = newTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
        });
        
        // Load saved theme
        const savedTheme = localStorage.getItem('theme') || 'dark';
        html.setAttribute('data-theme', savedTheme);
        themeIcon.className = savedTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
        
        // Enhanced Header scroll effect with scroll progress
        const header = document.getElementById('header');
        const scrollProgress = document.getElementById('scrollProgress');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (scrolled / maxScroll) * 100;
            
            scrollProgress.style.width = progress + '%';
            
            if (scrolled > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
        
        // Enhanced Mobile menu
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const mobileMenu = document.getElementById('mobileMenu');
        const mobileMenuClose = document.getElementById('mobileMenuClose');
        
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenu.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
        
        function closeMobileMenu() {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
        
        mobileMenuClose.addEventListener('click', closeMobileMenu);
        
        // Close mobile menu when clicking on a link
        mobileMenu.addEventListener('click', (e) => {
            if (e.target.classList.contains('nav-link')) {
                closeMobileMenu();
            }
        });
        
        // Enhanced navigation with active states
        const navLinks = document.querySelectorAll('.nav-link[data-section]');
        const sections = document.querySelectorAll('section[id]');
        
        function updateActiveNavLink() {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.getBoundingClientRect().top;
                const sectionHeight = section.offsetHeight;
                if (sectionTop <= 100 && sectionTop + sectionHeight > 100) {
                    current = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('data-section') === current) {
                    link.classList.add('active');
                }
            });
        }
        
        window.addEventListener('scroll', updateActiveNavLink);
        
        // Smooth scrolling for navigation links
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('data-section');
                const targetSection = document.getElementById(targetId);
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
                closeMobileMenu();
            });
        });
        
        // Enhanced animated counters with more realistic animation
        function animateCounter(element, target, suffix = '+', duration = 2000) {
            let start = 0;
            const increment = target / (duration / 16);
            
            function updateCounter() {
                start += increment;
                if (start < target) {
                    let displayValue = Math.floor(start);
                    if (suffix === '%') {
                        element.textContent = displayValue + '%';
                    } else {
                        element.textContent = displayValue.toLocaleString() + suffix;
                    }
                    requestAnimationFrame(updateCounter);
                } else {
                    if (suffix === '%') {
                        element.textContent = target + '%';
                    } else {
                        element.textContent = target.toLocaleString() + suffix;
                    }
                }
            }
            
            updateCounter();
        }
        
        // Enhanced Intersection Observer for animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (entry.target.classList.contains('hero-stats')) {
                        // Animate hero stats
                        setTimeout(() => {
                            animateCounter(document.getElementById('statUsers'), 5000);
                            animateCounter(document.getElementById('statEvents'), 150);
                            animateCounter(document.getElementById('statProjects'), 1200);
                            animateCounter(document.getElementById('statSuccess'), 95, '%');
                        }, 500);
                    }
                    
                    // Add animation classes
                    entry.target.classList.add('animate-fade-in-up');
                    
                    // Stagger animations for grid items
                    if (entry.target.classList.contains('features-grid') || 
                        entry.target.classList.contains('roles-grid') ||
                        entry.target.classList.contains('works-grid')) {
                        const cards = entry.target.children;
                        Array.from(cards).forEach((card, index) => {
                            setTimeout(() => {
                                card.classList.add('animate-fade-in-up');
                            }, index * 100);
                        });
                    }
                }
            });
        }, observerOptions);
        
        // Observe elements for animation
        document.querySelectorAll('.hero-content, .section-header, .feature-card, .role-card, .works-card, .hero-stats, .features-grid, .roles-grid, .works-grid, .about-content').forEach(el => {
            observer.observe(el);
        });
        
        // Page transition function
        function handlePageTransition(event, url) {
            event.preventDefault();
            const transition = document.getElementById('pageTransition');
            
            transition.classList.add('active');
            
            setTimeout(() => {
                window.location.href = url;
            }, 600);
        }
        
        // Scroll to top function
        function scrollToTop() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
        
        // Enhanced loading states for buttons
        document.querySelectorAll('.btn-primary').forEach(btn => {
            btn.addEventListener('click', function(e) {
                if (this.href && this.href.includes('.html')) {
                    const originalText = this.innerHTML;
                    this.innerHTML = '<span class="loading"></span> Loading...';
                    this.style.pointerEvents = 'none';
                    
                    // Reset after a delay (for demo purposes)
                    setTimeout(() => {
                        this.innerHTML = originalText;
                        this.style.pointerEvents = '';
                    }, 2000);
                }
            });
        });
        
        // Enhanced parallax effects
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const heroParallax = document.querySelector('.hero::after');
            
            // Parallax for hero background
            if (heroParallax) {
                const speed = scrolled * 0.3;
                document.documentElement.style.setProperty('--parallax-offset', `${speed}px`);
            }
        });
        
        // Social media hover effects
        document.querySelectorAll('.social-link').forEach(link => {
            link.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-3px) scale(1.1)';
            });
            
            link.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });
        
        // Keyboard navigation support
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeMobileMenu();
            }
        });
        
        // Initialize page
        document.addEventListener('DOMContentLoaded', () => {
            updateActiveNavLink();
            
            // Add initial animation delay to hero content
            setTimeout(() => {
                document.querySelector('.hero-content').classList.add('animate-fade-in-up');
            }, 300);
        });