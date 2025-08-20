// --- Global Configuration ---
const API_BASE_URL = 'http://localhost:5000';

// --- Initialization ---
document.addEventListener('DOMContentLoaded', async () => {
    initializeTheme();
    setupEventListeners();
    await handleOAuthCallback(); // Handle token from social login redirect
    updateUIForAuthState(); // Check login status and update UI
    runAnimations();
});


// --- Authentication Functions ---

/**
 * Checks for a JWT in the URL after an OAuth redirect, saves it,
 * and fetches the user's profile.
 */
async function handleOAuthCallback() {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
        // 1. Save the token to local storage immediately.
        localStorage.setItem('token', token);

        // 2. Fetch the user's profile from the backend using the token.
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error('Could not fetch user profile after social login.');
            }

            // 3. Save the user data to local storage.
            const user = data.data.user;
            localStorage.setItem('user', JSON.stringify(user));

            // 4. Clean the token from the URL for a better user experience.
            window.history.replaceState({}, document.title, window.location.pathname);

        } catch (error) {
            console.error(error);
            // If fetching the user fails, clear the bad token to prevent issues.
            localStorage.removeItem('token');
        }
    }
}


/**
 * Checks for user token and updates the navigation bar accordingly.
 */
function updateUIForAuthState() {
    const token = localStorage.getItem('token');
    const userJson = localStorage.getItem('user');
    const navActions = document.querySelector('.header .nav-actions');
    const mobileNavActions = document.querySelector('.mobile-menu');

    if (token && userJson && navActions && mobileNavActions) {
        try {
            const user = JSON.parse(userJson);
            const dashboardUrl = getDashboardUrl(user.role);

            // --- Update Desktop Header ---
            navActions.innerHTML = `
                <button class="theme-toggle" id="themeToggle" title="Toggle theme">
                    <i class="fas fa-moon"></i>
                </button>
                <a href="${dashboardUrl}" class="btn btn-outline" onclick="handlePageTransition(event, this.href)">Dashboard</a>
                <button class="btn btn-primary" id="logoutBtn">Logout</button>
            `;

            // --- Update Mobile Menu ---
            const mobileLoginLink = mobileNavActions.querySelector('a[href="auth/login.html"]');
            if (mobileLoginLink) mobileLoginLink.remove();
            
            const mobileRegisterLink = mobileNavActions.querySelector('a[href="auth/register.html"]');
            if (mobileRegisterLink) mobileRegisterLink.remove();

            // Add new buttons if they don't exist
            if (!mobileNavActions.querySelector('#mobileLogoutBtn')) {
                mobileNavActions.insertAdjacentHTML('beforeend', `
                    <a href="${dashboardUrl}" class="btn btn-outline" onclick="handlePageTransition(event, this.href)">Dashboard</a>
                    <button class="btn btn-primary" id="mobileLogoutBtn">Logout</button>
                `);
            }

            // Re-add theme toggle event listener as it was replaced
            document.getElementById('themeToggle').addEventListener('click', toggleTheme);
            // Add logout event listeners
            document.getElementById('logoutBtn').addEventListener('click', handleLogout);
            document.getElementById('mobileLogoutBtn').addEventListener('click', handleLogout);

        } catch (error) {
            console.error("Failed to parse user data:", error);
            handleLogout(); // Clear corrupted data
        }
    } else {
        // Ensure theme toggle is set up for logged-out users
        document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    }
}

/**
 * Logs the user out by clearing storage and reloading the page.
 */
function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    const transition = document.getElementById('pageTransition');
    transition.classList.add('active');
    setTimeout(() => {
        window.location.reload();
    }, 600);
}

/**
 * Determines the correct dashboard URL based on user role.
 * @param {string} role - The user's role.
 * @returns {string} The relative URL to the dashboard.
 */
function getDashboardUrl(role) {
    switch (role) {
        case 'organizer': return 'organizer/dashboard.html';
        case 'judge': return 'judge/dashboard.html';
        case 'participant':
        default: return 'participant/dashboard.html';
    }
}


// --- Event Listeners Setup ---
function setupEventListeners() {
    window.addEventListener('scroll', handleScrollEffects);
    document.getElementById('mobileMenuToggle').addEventListener('click', openMobileMenu);
    document.getElementById('mobileMenuClose').addEventListener('click', closeMobileMenu);
    document.querySelectorAll('.nav-link[data-section]').forEach(link => {
        link.addEventListener('click', handleSmoothScroll);
    });
    document.querySelector('.logo').addEventListener('click', scrollToTop);
}


// --- UI & Animation Functions ---

function toggleTheme() {
    const html = document.documentElement;
    const themeIcon = this.querySelector('i');
    const newTheme = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    themeIcon.className = newTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
}

function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    const themeIcon = document.querySelector('#themeToggle i');
    if (themeIcon) {
        themeIcon.className = savedTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
    }
}

function handleScrollEffects() {
    const header = document.getElementById('header');
    const scrollProgress = document.getElementById('scrollProgress');
    const scrolled = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrolled / maxScroll) * 100;

    scrollProgress.style.width = `${progress}%`;
    header.classList.toggle('scrolled', scrolled > 100);
    updateActiveNavLink();
}

function openMobileMenu() {
    document.getElementById('mobileMenu').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
    document.getElementById('mobileMenu').classList.remove('active');
    document.body.style.overflow = '';
}

function handleSmoothScroll(e) {
    e.preventDefault();
    const targetId = this.getAttribute('data-section');
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    closeMobileMenu();
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        if (sectionTop <= 100 && sectionTop + section.offsetHeight > 100) {
            current = section.getAttribute('id');
        }
    });
    document.querySelectorAll('.nav-link[data-section]').forEach(link => {
        link.classList.toggle('active', link.getAttribute('data-section') === current);
    });
}

function animateCounter(element, target, suffix = '+', duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    const update = () => {
        start += increment;
        if (start < target) {
            element.textContent = `${Math.floor(start).toLocaleString()}${suffix}`;
            requestAnimationFrame(update);
        } else {
            element.textContent = `${target.toLocaleString()}${suffix}`;
        }
    };
    update();
}

function runAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.id === 'statUsers') {
                    animateCounter(document.getElementById('statUsers'), 5000);
                    animateCounter(document.getElementById('statEvents'), 150);
                    animateCounter(document.getElementById('statProjects'), 1200);
                    animateCounter(document.getElementById('statSuccess'), 95, '%');
                    observer.unobserve(entry.target); // Animate only once
                }
            }
        });
    }, { threshold: 0.8 });

    const statsContainer = document.querySelector('.hero-stats');
    if (statsContainer) {
        // Use a single element to trigger all stat animations
        observer.observe(document.getElementById('statUsers'));
    }
}

function handlePageTransition(event, url) {
    event.preventDefault();
    const transition = document.getElementById('pageTransition');
    transition.classList.add('active');
    setTimeout(() => { window.location.href = url; }, 600);
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
