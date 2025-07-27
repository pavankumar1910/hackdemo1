// Hackathon Panel JavaScript
// Global variables
let hackathons = [
    {
        id: 'web-innovation',
        title: 'Web Innovation Challenge',
        description: 'Build innovative web applications using modern technologies. Focus on user experience and performance optimization.',
        difficulty: 'intermediate',
        category: 'web',
        status: 'live',
        startDate: new Date('2025-07-26T00:00:00'),
        endDate: new Date('2025-07-28T23:59:59'),
        participants: 1234,
        prizePool: 5000,
        technologies: ['React', 'Node.js', 'MongoDB'],
        isJoined: true
    },
    {
        id: 'ai-summit',
        title: 'AI/ML Innovation Summit',
        description: 'Create cutting-edge AI solutions that solve real-world problems. Machine learning expertise required.',
        difficulty: 'advanced',
        category: 'ai',
        status: 'upcoming',
        startDate: new Date('2025-08-15T00:00:00'),
        endDate: new Date('2025-08-17T23:59:59'),
        participants: 567,
        prizePool: 15000,
        technologies: ['Python', 'TensorFlow', 'PyTorch'],
        isJoined: false
    },
    {
        id: 'mobile-challenge',
        title: 'Mobile App Challenge',
        description: 'Build your first mobile application. Perfect for beginners looking to learn mobile development.',
        difficulty: 'beginner',
        category: 'mobile',
        status: 'upcoming',
        startDate: new Date('2025-08-05T00:00:00'),
        endDate: new Date('2025-08-07T23:59:59'),
        participants: 892,
        prizePool: 2500,
        technologies: ['React Native', 'Flutter', 'Firebase'],
        isJoined: false
    },
    {
        id: 'blockchain-revolution',
        title: 'Blockchain Revolution',
        description: 'Develop innovative blockchain solutions for decentralized applications and smart contracts.',
        difficulty: 'intermediate',
        category: 'blockchain',
        status: 'completed',
        startDate: new Date('2025-07-15T00:00:00'),
        endDate: new Date('2025-07-20T23:59:59'),
        participants: 456,
        prizePool: 8000,
        technologies: ['Solidity', 'Web3.js', 'Ethereum'],
        isJoined: false
    }
];

let submissions = [
    {
        id: 'taskflow-pro',
        title: 'TaskFlow Pro',
        hackathonTitle: 'Web Innovation Challenge',
        hackathonId: 'web-innovation',
        description: 'A modern task management application with real-time collaboration features.',
        status: 'submitted',
        submissionDate: new Date('2025-07-26T00:00:00'),
        githubLink: '#',
        liveDemo: '#'
    }
];

let currentFilter = 'all';
let currentDifficulty = '';
let currentCategory = '';

// DOM Elements
const createHackathonBtn = document.getElementById('createHackathonBtn');
const createHackathonModal = document.getElementById('createHackathonModal');
const hackathonDetailsModal = document.getElementById('hackathonDetailsModal');
const createHackathonForm = document.getElementById('createHackathonForm');
const closeCreateModal = document.getElementById('closeCreateModal');
const closeDetailsModal = document.getElementById('closeDetailsModal');
const cancelCreate = document.getElementById('cancelCreate');
const hackathonGrid = document.getElementById('hackathonGrid');
const filterTabs = document.querySelectorAll('.filter-tab');
const difficultyFilter = document.getElementById('difficultyFilter');
const categoryFilter = document.getElementById('categoryFilter');
const logoutBtn = document.getElementById('logoutBtn');

// Utility functions
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function formatDate(date) {
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function formatDateTime(date) {
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function calculateTimeRemaining(endDate) {
    const now = new Date();
    const diff = endDate - now;
    
    if (diff <= 0) return 'Ended';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${days}d ${hours}h ${minutes}m left`;
}

function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        max-width: 300px;
        font-weight: 500;
    `;
    notification.textContent = message;
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.3s ease reverse';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Render functions
function renderHackathons() {
    hackathonGrid.innerHTML = '';
    
    hackathons.forEach(hackathon => {
        const hackathonCard = createHackathonCard(hackathon);
        hackathonGrid.appendChild(hackathonCard);
    });
    
    // Update countdown timers
    updateCountdowns();
}

function createHackathonCard(hackathon) {
    const card = document.createElement('div');
    card.className = `hackathon-card ${hackathon.status}`;
    card.dataset.status = hackathon.status;
    card.dataset.difficulty = hackathon.difficulty;
    card.dataset.category = hackathon.category;
    
    const statusConfig = {
        live: { icon: 'fas fa-fire', text: 'Live Event', class: 'live-status' },
        upcoming: { icon: 'fas fa-calendar', text: 'Upcoming', class: 'upcoming-status' },
        completed: { icon: 'fas fa-flag-checkered', text: 'Completed', class: 'completed-status' }
    };
    
    const difficultyConfig = {
        beginner: 'beginner',
        intermediate: 'intermediate',
        advanced: 'advanced'
    };
    
    const status = statusConfig[hackathon.status];
    const timeInfo = hackathon.status === 'live' 
        ? `<span class="countdown" data-end="${hackathon.endDate.toISOString()}">${calculateTimeRemaining(hackathon.endDate)}</span>`
        : hackathon.status === 'upcoming'
        ? `<span>Starts ${formatDate(hackathon.startDate)}</span>`
        : `<span>Ended ${formatDate(hackathon.endDate)}</span>`;
    
    const actionButtons = hackathon.status === 'completed'
        ? `
            <button class="btn-view-results" data-hackathon="${hackathon.id}">
                <i class="fas fa-trophy"></i>
                View Results
            </button>
            <button class="btn-view-details" data-hackathon="${hackathon.id}">
                <i class="fas fa-eye"></i>
                View Details
            </button>
        `
        : `
            <button class="btn-join ${hackathon.isJoined ? 'joined' : ''}" data-hackathon="${hackathon.id}">
                <i class="fas fa-${hackathon.isJoined ? 'check' : 'plus'}"></i>
                ${hackathon.isJoined ? 'Joined' : (hackathon.status === 'upcoming' ? 'Register' : 'Join')}
            </button>
            <button class="btn-view-details" data-hackathon="${hackathon.id}">
                <i class="fas fa-eye"></i>
                View Details
            </button>
        `;
    
    card.innerHTML = `
        <div class="card-status ${status.class}">
            <i class="${status.icon}"></i>
            <span>${status.text}</span>
        </div>
        <div class="card-header">
            <h3>${hackathon.title}</h3>
            <div class="hackathon-meta">
                <span class="difficulty ${difficultyConfig[hackathon.difficulty]}">${hackathon.difficulty}</span>
                <span class="category">${hackathon.category === 'web' ? 'Web Development' : 
                    hackathon.category === 'mobile' ? 'Mobile Apps' : 
                    hackathon.category === 'ai' ? 'AI/ML' : 'Blockchain'}</span>
            </div>
        </div>
        <div class="card-body">
            <p class="description">${hackathon.description}</p>
            <div class="hackathon-stats">
                <div class="stat">
                    <i class="fas fa-${hackathon.status === 'live' ? 'clock' : hackathon.status === 'upcoming' ? 'calendar-alt' : 'calendar-check'}"></i>
                    ${timeInfo}
                </div>
                <div class="stat">
                    <i class="fas fa-users"></i>
                    <span>${hackathon.participants.toLocaleString()} ${hackathon.status === 'upcoming' ? 'registered' : 'participants'}</span>
                </div>
                <div class="stat">
                    <i class="fas fa-trophy"></i>
                    <span>$${hackathon.prizePool.toLocaleString()} Prize Pool</span>
                </div>
            </div>
            <div class="tech-stack">
                ${hackathon.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
            </div>
        </div>
        <div class="card-actions">
            ${actionButtons}
        </div>
    `;
    
    return card;
}

function updateCountdowns() {
    const countdowns = document.querySelectorAll('.countdown');
    countdowns.forEach(countdown => {
        const endDate = new Date(countdown.dataset.end);
        countdown.textContent = calculateTimeRemaining(endDate);
    });
}

// Modal functions
function openCreateModal() {
    createHackathonModal.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    // Set minimum start date to today
    const now = new Date();
    const today = now.toISOString().slice(0, 16);
    document.getElementById('startDate').min = today;
}

function closeCreateModal_func() {
    createHackathonModal.classList.remove('show');
    document.body.style.overflow = '';
    createHackathonForm.reset();
}

function closeDetailsModal_func() {
    hackathonDetailsModal.classList.remove('show');
    document.body.style.overflow = '';
}

function showHackathonDetails(hackathonId) {
    const hackathon = hackathons.find(h => h.id === hackathonId);
    if (!hackathon) return;
    
    const detailsTitle = document.getElementById('detailsTitle');
    const detailsBody = document.getElementById('detailsBody');
    
    detailsTitle.textContent = hackathon.title;
    
    const statusConfig = {
        live: { color: '#ef4444', text: 'Live Event' },
        upcoming: { color: '#8B5CF6', text: 'Upcoming' },
        completed: { color: '#10b981', text: 'Completed' }
    };
    
    const status = statusConfig[hackathon.status];
    
    detailsBody.innerHTML = `
        <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem;">
            <span style="background: ${status.color}; color: white; padding: 0.5rem 1rem; border-radius: 12px; font-size: 0.9rem; font-weight: 600;">
                ${status.text}
            </span>
            <span style="background: #f1f5f9; color: #64748b; padding: 0.5rem 1rem; border-radius: 12px; font-size: 0.9rem; font-weight: 600; text-transform: capitalize;">
                ${hackathon.difficulty}
            </span>
        </div>
        
        <div style="margin-bottom: 2rem;">
            <h4 style="color: #1e293b; margin-bottom: 0.5rem;">Description</h4>
            <p style="color: #64748b; line-height: 1.6;">${hackathon.description}</p>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
            <div style="background: #f8fafc; padding: 1rem; border-radius: 12px;">
                <h5 style="color: #1e293b; margin-bottom: 0.5rem; font-size: 0.9rem;">Start Date</h5>
                <p style="color: #64748b; margin: 0;">${formatDateTime(hackathon.startDate)}</p>
            </div>
            <div style="background: #f8fafc; padding: 1rem; border-radius: 12px;">
                <h5 style="color: #1e293b; margin-bottom: 0.5rem; font-size: 0.9rem;">End Date</h5>
                <p style="color: #64748b; margin: 0;">${formatDateTime(hackathon.endDate)}</p>
            </div>
            <div style="background: #f8fafc; padding: 1rem; border-radius: 12px;">
                <h5 style="color: #1e293b; margin-bottom: 0.5rem; font-size: 0.9rem;">Participants</h5>
                <p style="color: #64748b; margin: 0;">${hackathon.participants.toLocaleString()}</p>
            </div>
            <div style="background: #f8fafc; padding: 1rem; border-radius: 12px;">
                <h5 style="color: #1e293b; margin-bottom: 0.5rem; font-size: 0.9rem;">Prize Pool</h5>
                <p style="color: #64748b; margin: 0;">$${hackathon.prizePool.toLocaleString()}</p>
            </div>
        </div>
        
        <div style="margin-bottom: 2rem;">
            <h4 style="color: #1e293b; margin-bottom: 1rem;">Technologies</h4>
            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                ${hackathon.technologies.map(tech => `
                    <span style="background: #8B5CF6; color: white; padding: 0.5rem 1rem; border-radius: 12px; font-size: 0.9rem; font-weight: 500;">
                        ${tech}
                    </span>
                `).join('')}
            </div>
        </div>
        
        <div style="background: linear-gradient(135deg, #f8fafc, #e2e8f0); padding: 1.5rem; border-radius: 12px;">
            <h4 style="color: #1e293b; margin-bottom: 1rem;">Rules & Guidelines</h4>
            <ul style="color: #64748b; line-height: 1.6; padding-left: 1.5rem;">
                <li>Teams can have 1-4 members</li>
                <li>Original code must be written during the hackathon period</li>
                <li>Use of open-source libraries and frameworks is allowed</li>
                <li>Projects will be judged on innovation, technical implementation, and presentation</li>
                <li>All submissions must include source code and demo</li>
            </ul>
        </div>
    `;
    
    hackathonDetailsModal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

// Handle create hackathon form submission
function handleCreateHackathon(e) {
    e.preventDefault();
    
    const startDate = new Date(document.getElementById('startDate').value);
    const endDate = new Date(document.getElementById('endDate').value);
    
    // Validation
    if (endDate <= startDate) {
        showNotification('End date must be after start date', 'error');
        return;
    }
    
    const hackathonData = {
        id: generateId(),
        title: document.getElementById('hackathonTitle').value,
        description: document.getElementById('hackathonDescription').value,
        difficulty: document.getElementById('hackathonDifficulty').value,
        category: document.getElementById('hackathonCategory').value,
        status: startDate > new Date() ? 'upcoming' : 'live',
        startDate: startDate,
        endDate: endDate,
        participants: 0,
        prizePool: parseInt(document.getElementById('prizePool').value) || 0,
        technologies: document.getElementById('techTags').value.split(',').map(tech => tech.trim()).filter(tech => tech),
        isJoined: false
    };
    
    // Add to hackathons array
    hackathons.unshift(hackathonData);
    
    // Re-render hackathons
    renderHackathons();
    
    // Close modal
    closeCreateModal_func();
    
    // Show success message
    showNotification('Hackathon created successfully!', 'success');
}

// Filter functions
function handleFilterTab(e) {
    // Remove active class from all tabs
    filterTabs.forEach(tab => tab.classList.remove('active'));
    
    // Add active class to clicked tab
    e.target.classList.add('active');
    
    // Update current filter
    currentFilter = e.target.dataset.filter;
    
    // Apply filters
    applyFilters();
}

function handleDifficultyFilter(e) {
    currentDifficulty = e.target.value;
    applyFilters();
}

function handleCategoryFilter(e) {
    currentCategory = e.target.value;
    applyFilters();
}

function applyFilters() {
    const cards = document.querySelectorAll('.hackathon-card');
    
    cards.forEach(card => {
        const status = card.dataset.status;
        const difficulty = card.dataset.difficulty;
        const category = card.dataset.category;
        
        let showCard = true;
        
        // Apply status filter
        if (currentFilter !== 'all') {
            if (currentFilter === 'my-hackathons') {
                const hackathonId = card.querySelector('.btn-join').dataset.hackathon;
                const hackathon = hackathons.find(h => h.id === hackathonId);
                showCard = hackathon && hackathon.isJoined;
            } else {
                showCard = status === currentFilter;
            }
        }
        
        // Apply difficulty filter
        if (showCard && currentDifficulty && difficulty !== currentDifficulty) {
            showCard = false;
        }
        
        // Apply category filter
        if (showCard && currentCategory && category !== currentCategory) {
            showCard = false;
        }
        
        // Show/hide card
        if (showCard) {
            card.classList.remove('hidden');
        } else {
            card.classList.add('hidden');
        }
    });
}

// Hackathon interaction functions
function handleJoinHackathon(e) {
    const hackathonId = e.target.dataset.hackathon;
    const hackathon = hackathons.find(h => h.id === hackathonId);
    
    if (hackathon && !hackathon.isJoined) {
        hackathon.isJoined = true;
        hackathon.participants += 1;
        
        // Update button
        e.target.innerHTML = '<i class="fas fa-check"></i> Joined';
        e.target.classList.add('joined');
        
        // Update participant count
        const card = e.target.closest('.hackathon-card');
        const participantStat = card.querySelector('.stat:nth-child(2) span');
        participantStat.textContent = `${hackathon.participants.toLocaleString()} participants`;
        
        showNotification(`Successfully joined ${hackathon.title}!`, 'success');
    }
}

function handleViewDetails(e) {
    const hackathonId = e.target.dataset.hackathon;
    showHackathonDetails(hackathonId);
}

function handleViewResults(e) {
    const hackathonId = e.target.dataset.hackathon;
    const hackathon = hackathons.find(h => h.id === hackathonId);
    
    if (hackathon) {
        showNotification(`Results for ${hackathon.title} are being prepared!`, 'success');
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Initial render
    renderHackathons();
    
    // Set up countdown update interval
    setInterval(updateCountdowns, 60000); // Update every minute
    
    // Modal event listeners
    createHackathonBtn.addEventListener('click', openCreateModal);
    closeCreateModal.addEventListener('click', closeCreateModal_func);
    closeDetailsModal.addEventListener('click', closeDetailsModal_func);
    cancelCreate.addEventListener('click', closeCreateModal_func);
    
    // Form submission
    createHackathonForm.addEventListener('submit', handleCreateHackathon);
    
    // Filter event listeners
    filterTabs.forEach(tab => {
        tab.addEventListener('click', handleFilterTab);
    });
    
    difficultyFilter.addEventListener('change', handleDifficultyFilter);
    categoryFilter.addEventListener('change', handleCategoryFilter);
    
    // Hackathon interaction event listeners (using event delegation)
    hackathonGrid.addEventListener('click', function(e) {
        if (e.target.closest('.btn-join')) {
            handleJoinHackathon(e);
        } else if (e.target.closest('.btn-view-details')) {
            handleViewDetails(e);
        } else if (e.target.closest('.btn-view-results')) {
            handleViewResults(e);
        }
    });
    
    // Close modals when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === createHackathonModal) {
            closeCreateModal_func();
        }
        if (e.target === hackathonDetailsModal) {
            closeDetailsModal_func();
        }
    });
    
    // Logout functionality
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to logout?')) {
                showNotification('Logging out...', 'success');
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);
            }
        });
    }
    
    // Form validation for date inputs
    document.getElementById('startDate').addEventListener('change', function() {
        const startDate = new Date(this.value);
        const endDateInput = document.getElementById('endDate');
        
        // Set minimum end date to start date
        endDateInput.min = this.value;
        
        // Clear end date if it's before start date
        if (endDateInput.value && new Date(endDateInput.value) <= startDate) {
            endDateInput.value = '';
        }
    });
});

// Export functions for potential external use
window.hackathonPanel = {
    renderHackathons,
    showHackathonDetails,
    applyFilters,
    showNotification
};