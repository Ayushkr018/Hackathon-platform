// --- Configuration ---
const API_BASE_URL = 'http://localhost:5000';

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    authGuard(); // Protect the page
    initializeDashboard();
    setupEventListeners();
});


// --- Authentication & Data Loading ---

/**
 * Protects the page by checking for a valid user session.
 * Redirects to the login page if the user is not authenticated.
 */
function authGuard() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (!token || !user) {
        // If no token or user data, redirect to login
        window.location.href = '../auth/login.html';
    }
}

/**
 * Initializes the dashboard with user data and theme settings.
 */
function initializeDashboard() {
    // Load theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    const themeIcon = document.getElementById('themeToggle').querySelector('i');
    themeIcon.className = savedTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
    
    // Load user data from localStorage
    const userJson = localStorage.getItem('user');
    if (userJson) {
        try {
            const user = JSON.parse(userJson);
            updateUserProfile(user);
        } catch (error) {
            console.error("Failed to parse user data, logging out.", error);
            logout();
        }
    }
}

/**
 * Updates the UI with the logged-in user's information.
 * @param {object} user - The user object from localStorage.
 */
function updateUserProfile(user) {
    const userName = user.name || 'User';
    const userFirstName = userName.split(' ')[0];
    
    // Get initials for the avatar
    const nameParts = userName.split(' ');
    const initials = nameParts.length > 1 
        ? `${nameParts[0][0]}${nameParts[1][0]}` 
        : userName.substring(0, 2);

    document.getElementById('userName').textContent = userName;
    document.getElementById('welcomeName').textContent = userFirstName;
    document.getElementById('userAvatar').textContent = initials.toUpperCase();
}

/**
 * Logs the user out by clearing storage and redirecting.
 */
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '../auth/login.html';
}


// --- Event Listeners Setup ---
function setupEventListeners() {
    // Theme toggle
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);

    // Sidebar toggle
    const sidebarToggle = document.getElementById('sidebarToggle');
    sidebarToggle.addEventListener('click', () => {
        document.getElementById('sidebar').classList.toggle('collapsed');
    });
    sidebarToggle.addEventListener('click', toggleMobileSidebar);

    // Close mobile sidebar when clicking outside
    document.addEventListener('click', (e) => {
        const sidebar = document.getElementById('sidebar');
        if (window.innerWidth <= 1024 && !sidebar.contains(e.target) && !sidebarToggle.contains(e.target) && sidebar.classList.contains('open')) {
            sidebar.classList.remove('open');
        }
    });

    // Handle window resize for sidebar
    window.addEventListener('resize', () => {
        if (window.innerWidth > 1024) {
            document.getElementById('sidebar').classList.remove('open');
        }
    });
}


// --- UI & Utility Functions ---

function toggleTheme() {
    const html = document.documentElement;
    const newTheme = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    this.querySelector('i').className = newTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
}

function toggleMobileSidebar() {
    if (window.innerWidth <= 1024) {
        document.getElementById('sidebar').classList.toggle('open');
    }
}

// Make logout globally accessible from HTML
window.logout = logout;
