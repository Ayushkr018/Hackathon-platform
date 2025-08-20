// --- Configuration ---
const API_BASE_URL = 'http://localhost:5000';

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    authGuard(); // Protect the page
    initializePage();
    setupEventListeners();
});


// --- Authentication & Data Loading ---

/**
 * Protects the page by checking for a valid user session and correct role.
 * Redirects to the login page if the user is not an authenticated participant.
 */
function authGuard() {
    const token = localStorage.getItem('token');
    const userJson = localStorage.getItem('user');

    if (!token || !userJson) {
        window.location.href = '../auth/login.html';
        return;
    }

    try {
        const user = JSON.parse(userJson);
        // Security Check: Ensure only participants can see this page.
        if (user.role !== 'participant') {
            console.error("Access Denied: User is not a participant. Logging out.");
            logout(); // Log out users with the wrong role
            return;
        }
    } catch (error) {
        console.error("Failed to parse user data, logging out.", error);
        logout();
    }
}

/**
 * Initializes the page's theme and loads user data into the UI.
 */
function initializePage() {
    initializeTheme();
    loadUserProfile();
}

/**
 * Sets the theme based on what's saved in localStorage.
 */
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    const themeIcon = document.getElementById('themeToggle').querySelector('i');
    if (themeIcon) {
        themeIcon.className = savedTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
    }
}

/**
 * Loads user data from localStorage and updates the UI.
 */
function loadUserProfile() {
    const userJson = localStorage.getItem('user');
    if (userJson) {
        try {
            const user = JSON.parse(userJson);
            updateUIWithUserData(user);
        } catch (error) {
            console.error("Failed to parse user data, logging out.", error);
            logout();
        }
    }
}

/**
 * Updates all relevant parts of the UI with the user's information.
 * @param {object} user - The user object from localStorage.
 */
function updateUIWithUserData(user) {
    const userName = user.name || 'User';
    const nameParts = userName.split(' ');
    const initials = nameParts.length > 1 ? `${nameParts[0][0]}${nameParts[1][0]}` : userName.substring(0, 2);

    // Sidebar and Profile Header
    document.getElementById('userName').textContent = userName;
    document.getElementById('userAvatar').textContent = initials.toUpperCase();
    document.getElementById('profileName').textContent = userName;
    document.getElementById('profileAvatar').textContent = initials.toUpperCase();
    
    // Overview Tab
    document.getElementById('profileTitle').textContent = user.bio || 'No bio provided. Click "Edit Profile" to add one!';
    document.getElementById('aboutText').textContent = user.bio || 'No bio provided. Click "Edit Profile" to add one!';
    
    // Skills
    const skillsList = document.getElementById('skillsList');
    skillsList.innerHTML = ''; // Clear existing skills
    if (user.skills && user.skills.length > 0) {
        user.skills.forEach(skill => addSkillToDisplay(skill));
    } else {
        skillsList.innerHTML = '<p>No skills added yet. Click "Add Skill" to get started!</p>';
    }
}

/**
 * Logs the user out by clearing storage and redirecting.
 */
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '../auth/login.html';
}

// --- Event Listeners ---
function setupEventListeners() {
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    document.getElementById('sidebarToggle').addEventListener('click', toggleSidebar);
    document.getElementById('editProfileForm').addEventListener('submit', handleProfileUpdate);
    document.getElementById('addSkillForm').addEventListener('submit', handleAddSkill);
}

// --- Core Functionality ---

async function handleProfileUpdate(event) {
    event.preventDefault();
    const token = localStorage.getItem('token');
    
    const updatedData = {
        name: document.getElementById('editFullName').value,
        bio: document.getElementById('editAbout').value,
    };

    try {
        const response = await fetch(`${API_BASE_URL}/api/users/me`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updatedData)
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message);

        localStorage.setItem('user', JSON.stringify(data.data.user));
        updateUIWithUserData(data.data.user);
        closeEditProfileModal();
        showToast('Profile updated successfully!', 'success');

    } catch (error) {
        showToast(error.message || 'Failed to update profile.', 'error');
    }
}

async function handleAddSkill(event) {
    event.preventDefault();
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    
    const newSkill = document.getElementById('newSkillName').value.trim();
    if (!newSkill) return;

    const updatedSkills = [...(user.skills || []), newSkill];

    try {
        const response = await fetch(`${API_BASE_URL}/api/users/me`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ skills: updatedSkills })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message);

        localStorage.setItem('user', JSON.stringify(data.data.user));
        updateUIWithUserData(data.data.user);
        closeAddSkillModal();
        showToast('Skill added successfully!', 'success');

    } catch (error) {
        showToast(error.message || 'Failed to add skill.', 'error');
    }
}

async function removeSkill(element, skillName) {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    const updatedSkills = user.skills.filter(s => s !== skillName);

    try {
        const response = await fetch(`${API_BASE_URL}/api/users/me`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ skills: updatedSkills })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);

        localStorage.setItem('user', JSON.stringify(data.data.user));
        element.parentElement.remove();
        showToast('Skill removed!', 'success');

    } catch (error) {
        showToast(error.message || 'Failed to remove skill.', 'error');
    }
}


// --- UI & Utility Functions ---

function toggleTheme() {
    const html = document.documentElement;
    const newTheme = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    this.querySelector('i').className = newTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
}

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('collapsed');
}

function switchTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.querySelectorAll('.tab-content').forEach(content => content.style.display = 'none');
    document.getElementById(`${tabName}Tab`).style.display = 'block';
}

function addSkillToDisplay(skillName) {
    const skillsList = document.getElementById('skillsList');
    if (skillsList.querySelector('p')) {
        skillsList.innerHTML = '';
    }
    const skillTag = document.createElement('div');
    skillTag.className = 'skill-tag';
    skillTag.innerHTML = `${skillName} <button class="remove-skill" onclick="removeSkill(this, '${skillName}')"><i class="fas fa-times"></i></button>`;
    skillsList.appendChild(skillTag);
}

// Modal controls
function editProfile() {
    const user = JSON.parse(localStorage.getItem('user'));
    document.getElementById('editFullName').value = user.name || '';
    document.getElementById('editAbout').value = user.bio || '';
    document.getElementById('editProfileModal').classList.add('active');
}
function closeEditProfileModal() { document.getElementById('editProfileModal').classList.remove('active'); }
function editSkills() { document.getElementById('addSkillModal').classList.add('active'); }
function closeAddSkillModal() { document.getElementById('addSkillModal').classList.remove('active'); }

function showToast(message, type = 'success') {
    const existingToast = document.querySelector('.toast');
    if (existingToast) existingToast.remove();
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
}

// Make functions globally accessible from HTML
window.logout = logout;
window.switchTab = switchTab;
window.editProfile = editProfile;
window.closeEditProfileModal = closeEditProfileModal;
window.editSkills = editSkills;
window.closeAddSkillModal = closeAddSkillModal;
window.removeSkill = removeSkill;
