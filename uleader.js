// Leaderboard & Achievements JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the page
    initializeLeaderboard();
    initializeAchievements();
    initializeEventListeners();
    
    // Auto-update stats every 30 seconds
    setInterval(updateUserStats, 30000);
});

// Sample data for leaderboards (different time periods)
const leaderboardData = {
    global: [
        { rank: 1, name: 'Sarah Chen', title: 'Senior Full Stack Developer', points: 4320, avatar: 'https://ui-avatars.com/api/?name=Sarah+Chen&background=FFD700&color=fff&size=80', trend: { type: 'up', value: 150 } },
        { rank: 2, name: 'Alex Johnson', title: 'Frontend Architect', points: 3850, avatar: 'https://ui-avatars.com/api/?name=Alex+Johnson&background=C0C0C0&color=fff&size=80', trend: { type: 'up', value: 95 } },
        { rank: 3, name: 'Mike Williams', title: 'DevOps Engineer', points: 3200, avatar: 'https://ui-avatars.com/api/?name=Mike+Williams&background=CD7F32&color=fff&size=80', trend: { type: 'down', value: 30 } },
        { rank: 4, name: 'Emma Davis', title: 'Full Stack Developer', points: 2980, avatar: 'https://ui-avatars.com/api/?name=Emma+Davis&background=8B5CF6&color=fff&size=40', trend: { type: 'up', value: 120 } },
        { rank: 5, name: 'David Wilson', title: 'Frontend Developer', points: 2750, avatar: 'https://ui-avatars.com/api/?name=David+Wilson&background=10B981&color=fff&size=40', trend: { type: 'down', value: 45 } },
        { rank: 47, name: 'You (user@2025)', title: 'Developer', points: 2450, avatar: 'https://ui-avatars.com/api/?name=User+2025&background=8B5CF6&color=fff&size=40', trend: { type: 'up', value: 85 }, isCurrentUser: true },
        { rank: 48, name: 'Lisa Garcia', title: 'Backend Developer', points: 2380, avatar: 'https://ui-avatars.com/api/?name=Lisa+Garcia&background=F59E0B&color=fff&size=40', trend: { type: 'up', value: 32 } },
        { rank: 49, name: 'Tom Brown', title: 'Mobile Developer', points: 2290, avatar: 'https://ui-avatars.com/api/?name=Tom+Brown&background=EF4444&color=fff&size=40', trend: { type: 'stable', value: 0 } }
    ],
    monthly: [
        { rank: 1, name: 'Emma Davis', title: 'Full Stack Developer', points: 1200, avatar: 'https://ui-avatars.com/api/?name=Emma+Davis&background=FFD700&color=fff&size=80', trend: { type: 'up', value: 200 } },
        { rank: 2, name: 'You (user@2025)', title: 'Developer', points: 980, avatar: 'https://ui-avatars.com/api/?name=User+2025&background=C0C0C0&color=fff&size=80', trend: { type: 'up', value: 150 }, isCurrentUser: true },
        { rank: 3, name: 'David Wilson', title: 'Frontend Developer', points: 850, avatar: 'https://ui-avatars.com/api/?name=David+Wilson&background=CD7F32&color=fff&size=80', trend: { type: 'up', value: 120 } },
        { rank: 4, name: 'Sarah Chen', title: 'Senior Full Stack Developer', points: 720, avatar: 'https://ui-avatars.com/api/?name=Sarah+Chen&background=8B5CF6&color=fff&size=40', trend: { type: 'stable', value: 0 } },
        { rank: 5, name: 'Alex Johnson', title: 'Frontend Architect', points: 650, avatar: 'https://ui-avatars.com/api/?name=Alex+Johnson&background=10B981&color=fff&size=40', trend: { type: 'down', value: 50 } }
    ],
    weekly: [
        { rank: 1, name: 'You (user@2025)', title: 'Developer', points: 350, avatar: 'https://ui-avatars.com/api/?name=User+2025&background=FFD700&color=fff&size=80', trend: { type: 'up', value: 85 }, isCurrentUser: true },
        { rank: 2, name: 'Emma Davis', title: 'Full Stack Developer', points: 320, avatar: 'https://ui-avatars.com/api/?name=Emma+Davis&background=C0C0C0&color=fff&size=80', trend: { type: 'up', value: 75 } },
        { rank: 3, name: 'Tom Brown', title: 'Mobile Developer', points: 280, avatar: 'https://ui-avatars.com/api/?name=Tom+Brown&background=CD7F32&color=fff&size=80', trend: { type: 'up', value: 60 } },
        { rank: 4, name: 'Lisa Garcia', title: 'Backend Developer', points: 240, avatar: 'https://ui-avatars.com/api/?name=Lisa+Garcia&background=8B5CF6&color=fff&size=40', trend: { type: 'up', value: 40 } },
        { rank: 5, name: 'David Wilson', title: 'Frontend Developer', points: 180, avatar: 'https://ui-avatars.com/api/?name=David+Wilson&background=10B981&color=fff&size=40', trend: { type: 'down', value: 20 } }
    ]
};

// Achievement definitions
const achievementDefinitions = {
    'first-assessment': {
        icon: 'fas fa-play',
        title: 'First Steps',
        description: 'Complete your first assessment',
        category: 'Getting Started',
        points: 50
    },
    'streak-master': {
        icon: 'fas fa-fire',
        title: 'Streak Master',
        description: 'Maintain a 7-day learning streak',
        category: 'Consistency',
        points: 150
    },
    'code-warrior': {
        icon: 'fas fa-sword',
        title: 'Code Warrior',
        description: 'Complete 10 coding challenges',
        category: 'Challenges',
        points: 200
    },
    'hackathon-hero': {
        icon: 'fas fa-rocket',
        title: 'Hackathon Hero',
        description: 'Participate in your first hackathon',
        category: 'Events',
        points: 300
    },
    'js-expert': {
        icon: 'fab fa-js-square',
        title: 'JavaScript Expert',
        description: 'Master JavaScript fundamentals',
        category: 'Skills',
        points: 250
    },
    'team-player': {
        icon: 'fas fa-users',
        title: 'Team Player',
        description: 'Collaborate on a team project',
        category: 'Collaboration',
        points: 180
    },
    'fast-learner': {
        icon: 'fas fa-bolt',
        title: 'Fast Learner',
        description: 'Complete a course in record time',
        category: 'Learning',
        points: 120
    },
    'mentor': {
        icon: 'fas fa-graduation-cap',
        title: 'Mentor',
        description: 'Help 5 other developers',
        category: 'Community',
        points: 400
    },
    'perfectionist': {
        icon: 'fas fa-star',
        title: 'Perfectionist',
        description: 'Score 100% on 5 assessments',
        category: 'Excellence',
        points: 500,
        progress: { current: 3, total: 5 }
    },
    'marathon-runner': {
        icon: 'fas fa-running',
        title: 'Marathon Runner',
        description: 'Maintain a 30-day streak',
        category: 'Consistency',
        points: 600,
        progress: { current: 15, total: 30 }
    },
    'full-stack-master': {
        icon: 'fas fa-layer-group',
        title: 'Full Stack Master',
        description: 'Complete all technology tracks',
        category: 'Skills',
        points: 1000,
        progress: { current: 4, total: 8 }
    },
    'community-champion': {
        icon: 'fas fa-heart',
        title: 'Community Champion',
        description: 'Get 100 likes on forum posts',
        category: 'Community',
        points: 300,
        progress: { current: 67, total: 100 }
    }
};

// User's earned achievements
let userAchievements = [
    { id: 'first-assessment', earnedDate: '2 weeks ago' },
    { id: 'streak-master', earnedDate: '1 week ago' },
    { id: 'code-warrior', earnedDate: '5 days ago' },
    { id: 'hackathon-hero', earnedDate: '3 days ago' },
    { id: 'js-expert', earnedDate: '1 day ago' },
    { id: 'team-player', earnedDate: 'yesterday' },
    { id: 'fast-learner', earnedDate: 'today' },
    { id: 'mentor', earnedDate: 'today' }
];

// Current leaderboard filter
let currentFilter = 'global';

// Initialize leaderboard functionality
function initializeLeaderboard() {
    updateLeaderboard(currentFilter);
    updateUserRankStats();
}

// Initialize achievements
function initializeAchievements() {
    renderAchievements();
    updateAchievementProgress();
}

// Set up event listeners
function initializeEventListeners() {
    // Filter tabs
    const filterTabs = document.querySelectorAll('.filter-tab');
    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            switchLeaderboardFilter(filter);
        });
    });

    // Achievement cards
    const achievementCards = document.querySelectorAll('.achievement-card');
    achievementCards.forEach(card => {
        card.addEventListener('click', function() {
            const achievementId = this.getAttribute('data-achievement');
            showAchievementModal(achievementId);
        });
    });

    // Modal close functionality
    const modal = document.getElementById('achievementModal');
    const closeBtn = document.querySelector('.close-modal');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeAchievementModal);
    }
    
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeAchievementModal();
            }
        });
    }

    // Logout functionality
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // Add hover effects to stat cards
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(-2px) scale(1)';
        });
    });
}

// Switch leaderboard filter
function switchLeaderboardFilter(filter) {
    currentFilter = filter;
    
    // Update active tab
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.classList.toggle('active', tab.getAttribute('data-filter') === filter);
    });
    
    // Update leaderboard display
    updateLeaderboard(filter);
    updateUserRankStats();
    
    // Add transition effect
    const leaderboardSection = document.querySelector('.leaderboard-section');
    leaderboardSection.style.opacity = '0.7';
    setTimeout(() => {
        leaderboardSection.style.opacity = '1';
    }, 300);
}

// Update leaderboard display
function updateLeaderboard(filter) {
    const data = leaderboardData[filter] || leaderboardData.global;
    updatePodium(data.slice(0, 3));
    updateLeaderboardList(data.slice(3));
}

// Update podium (top 3)
function updatePodium(topThree) {
    const podium = document.querySelector('.podium');
    if (!podium) return;
    
    // Clear existing podium
    podium.innerHTML = '';
    
    // Reorder for visual display (2nd, 1st, 3rd)
    const orderedPositions = [topThree[1], topThree[0], topThree[2]].filter(Boolean);
    
    orderedPositions.forEach((user, index) => {
        if (!user) return;
        
        const position = user.rank;
        const positionClass = position === 1 ? 'first' : position === 2 ? 'second' : 'third';
        const avatarSize = position === 1 ? 80 : 60;
        
        const podiumPosition = document.createElement('div');
        podiumPosition.className = `podium-position ${positionClass}`;
        
        podiumPosition.innerHTML = `
            ${position === 1 ? '<div class="crown"><i class="fas fa-crown"></i></div>' : ''}
            <div class="podium-user">
                <img src="${user.avatar.replace(/size=\d+/, `size=${avatarSize}`)}" alt="${user.name}">
                <h4>${user.name}</h4>
                <span class="points">${user.points.toLocaleString()} pts</span>
            </div>
            <div class="podium-rank">${position}</div>
        `;
        
        podium.appendChild(podiumPosition);
    });
}

// Update leaderboard list
function updateLeaderboardList(users) {
    const leaderboardList = document.querySelector('.leaderboard-list');
    if (!leaderboardList) return;
    
    leaderboardList.innerHTML = '';
    
    users.forEach(user => {
        const listItem = document.createElement('div');
        listItem.className = `leaderboard-item ${user.isCurrentUser ? 'current-user' : ''}`;
        
        const trendIcon = user.trend.type === 'up' ? 'fa-arrow-up' : 
                         user.trend.type === 'down' ? 'fa-arrow-down' : 'fa-minus';
        const trendText = user.trend.type === 'stable' ? '0' : 
                         user.trend.type === 'up' ? `+${user.trend.value}` : `-${user.trend.value}`;
        
        listItem.innerHTML = `
            <span class="rank">${user.rank}</span>
            <div class="user-info">
                <img src="${user.avatar}" alt="${user.name}">
                <div class="user-details">
                    <span class="name">${user.name}</span>
                    <span class="title">${user.title}</span>
                </div>
            </div>
            <span class="points">${user.points.toLocaleString()} pts</span>
            <div class="trend ${user.trend.type}">
                <i class="fas ${trendIcon}"></i>
                <span>${trendText}</span>
            </div>
        `;
        
        leaderboardList.appendChild(listItem);
        
        // Add animation
        setTimeout(() => {
            listItem.style.opacity = '1';
            listItem.style.transform = 'translateX(0)';
        }, users.indexOf(user) * 100);
        
        listItem.style.opacity = '0';
        listItem.style.transform = 'translateX(-20px)';
        listItem.style.transition = 'all 0.3s ease';
    });
}

// Update user rank statistics
function updateUserRankStats() {
    const data = leaderboardData[currentFilter] || leaderboardData.global;
    const currentUser = data.find(user => user.isCurrentUser);
    
    if (currentUser) {
        updateStatCard(0, `#${currentUser.rank}`, 'Global Rank');
        updateStatCard(1, currentUser.points.toLocaleString(), 'Total Points');
    }
}

// Update individual stat card
function updateStatCard(index, number, label) {
    const statCards = document.querySelectorAll('.stat-card');
    if (statCards[index]) {
        const numberElement = statCards[index].querySelector('.stat-number');
        const labelElement = statCards[index].querySelector('.stat-label');
        
        if (numberElement && labelElement) {
            // Animate number change
            numberElement.style.transform = 'scale(1.1)';
            numberElement.style.color = '#A855F7';
            
            setTimeout(() => {
                numberElement.textContent = number;
                numberElement.style.transform = 'scale(1)';
                numberElement.style.color = '#8B5CF6';
                labelElement.textContent = label;
            }, 150);
        }
    }
}

// Render achievements
function renderAchievements() {
    const achievementsGrid = document.querySelector('.achievements-grid');
    if (!achievementsGrid) return;
    
    achievementsGrid.innerHTML = '';
    
    // Separate earned and locked achievements
    const earnedIds = userAchievements.map(a => a.id);
    const allAchievementIds = Object.keys(achievementDefinitions);
    
    // Render earned achievements first
    userAchievements.forEach(userAchievement => {
        const definition = achievementDefinitions[userAchievement.id];
        if (definition) {
            achievementsGrid.appendChild(createAchievementCard(userAchievement.id, definition, true, userAchievement.earnedDate));
        }
    });
    
    // Render locked achievements
    allAchievementIds.forEach(id => {
        if (!earnedIds.includes(id)) {
            const definition = achievementDefinitions[id];
            achievementsGrid.appendChild(createAchievementCard(id, definition, false));
        }
    });
}

// Create achievement card element
function createAchievementCard(id, definition, isEarned, earnedDate = null) {
    const card = document.createElement('div');
    card.className = `achievement-card ${isEarned ? 'earned' : 'locked'}`;
    card.setAttribute('data-achievement', id);
    
    let progressHTML = '';
    if (!isEarned && definition.progress) {
        const progressPercent = Math.round((definition.progress.current / definition.progress.total) * 100);
        progressHTML = `
            <div class="progress-info">
                <span>Progress: ${definition.progress.current}/${definition.progress.total} ${definition.category === 'Consistency' ? 'days' : definition.category === 'Skills' ? 'tracks' : definition.category === 'Community' ? 'likes' : ''}</span>
                <div class="mini-progress">
                    <div class="mini-fill" style="width: ${progressPercent}%"></div>
                </div>
            </div>
        `;
    }
    
    card.innerHTML = `
        <div class="achievement-icon">
            <i class="${definition.icon}"></i>
        </div>
        <div class="achievement-info">
            <h4>${definition.title}</h4>
            <p>${definition.description}</p>
            ${isEarned ? `<span class="earned-date">Earned ${earnedDate}</span>` : progressHTML}
        </div>
        <div class="achievement-badge">
            <i class="fas ${isEarned ? 'fa-check' : 'fa-lock'}"></i>
        </div>
    `;
    
    // Add hover effect
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-3px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(-2px) scale(1)';
    });
    
    return card;
}

// Update achievement progress bar
function updateAchievementProgress() {
    const totalAchievements = Object.keys(achievementDefinitions).length;
    const earnedCount = userAchievements.length;
    const progressPercent = Math.round((earnedCount / totalAchievements) * 100);
    
    const progressText = document.querySelector('.achievement-progress span');
    const progressFill = document.querySelector('.progress-fill');
    
    if (progressText) {
        progressText.textContent = `${earnedCount} of ${totalAchievements} earned`;
    }
    
    if (progressFill) {
        setTimeout(() => {
            progressFill.style.width = `${progressPercent}%`;
        }, 500);
    }
}

// Show achievement modal
function showAchievementModal(achievementId) {
    const definition = achievementDefinitions[achievementId];
    const userAchievement = userAchievements.find(a => a.id === achievementId);
    const modal = document.getElementById('achievementModal');
    
    if (!definition || !modal) return;
    
    const modalIcon = document.querySelector('.modal-icon i');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const modalProgress = document.getElementById('modalProgress');
    
    if (modalIcon) modalIcon.className = definition.icon;
    if (modalTitle) modalTitle.textContent = definition.title;
    if (modalDescription) modalDescription.textContent = definition.description;
    
    // Update modal content based on achievement status
    if (userAchievement) {
        modalProgress.innerHTML = `
            <div style="text-align: center;">
                <div style="color: #10b981; font-weight: 600; margin-bottom: 0.5rem;">
                    <i class="fas fa-check-circle"></i> Achievement Earned!
                </div>
                <div style="color: #64748b; font-size: 0.9rem;">
                    Earned ${userAchievement.earnedDate} • +${definition.points} points
                </div>
            </div>
        `;
    } else if (definition.progress) {
        const progressPercent = Math.round((definition.progress.current / definition.progress.total) * 100);
        modalProgress.innerHTML = `
            <div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                    <span>Progress</span>
                    <span>${definition.progress.current}/${definition.progress.total}</span>
                </div>
                <div class="progress-bar" style="width: 100%; margin-bottom: 0.5rem;">
                    <div class="progress-fill" style="width: ${progressPercent}%"></div>
                </div>
                <div style="color: #64748b; font-size: 0.85rem; text-align: center;">
                    Reward: +${definition.points} points
                </div>
            </div>
        `;
    } else {
        modalProgress.innerHTML = `
            <div style="text-align: center; color: #64748b; font-size: 0.9rem;">
                Complete the requirements to unlock this achievement and earn +${definition.points} points
            </div>
        `;
    }
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Add animation
    const modalContent = modal.querySelector('.modal-content');
    modalContent.style.transform = 'translateY(-50px) scale(0.9)';
    modalContent.style.opacity = '0';
    
    setTimeout(() => {
        modalContent.style.transform = 'translateY(0) scale(1)';
        modalContent.style.opacity = '1';
    }, 10);
}

// Close achievement modal
function closeAchievementModal() {
    const modal = document.getElementById('achievementModal');
    if (modal) {
        const modalContent = modal.querySelector('.modal-content');
        modalContent.style.transform = 'translateY(-50px) scale(0.9)';
        modalContent.style.opacity = '0';
        
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 300);
    }
}

// Update user stats (simulated real-time updates)
function updateUserStats() {
    const statCards = document.querySelectorAll('.stat-card');
    
    // Simulate small random changes in streak
    const streakCard = statCards[3];
    if (streakCard) {
        const currentStreak = parseInt(streakCard.querySelector('.stat-number').textContent);
        const newStreak = Math.max(1, currentStreak + Math.floor(Math.random() * 3) - 1);
        updateStatCard(3, newStreak.toString(), 'Day Streak');
    }
    
    // Occasionally show achievement notifications
    if (Math.random() < 0.1) { // 10% chance every 30 seconds
        showAchievementNotification();
    }
}

// Show achievement notification
function showAchievementNotification() {
    const lockedAchievements = Object.keys(achievementDefinitions).filter(id => 
        !userAchievements.some(a => a.id === id)
    );
    
    if (lockedAchievements.length === 0) return;
    
    const randomAchievement = lockedAchievements[Math.floor(Math.random() * lockedAchievements.length)];
    const definition = achievementDefinitions[randomAchievement];
    
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #8B5CF6, #A855F7);
        color: white;
        padding: 1rem;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(139, 92, 246, 0.3);
        z-index: 1500;
        max-width: 300px;
        transform: translateX(100%);
        transition: all 0.3s ease;
    `;
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.75rem;">
            <div style="width: 40px; height: 40px; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                <i class="${definition.icon}"></i>
            </div>
            <div style="flex: 1;">
                <div style="font-weight: 600; margin-bottom: 0.25rem;">Progress Update!</div>
                <div style="font-size: 0.85rem; opacity: 0.9;">You're getting closer to "${definition.title}"</div>
            </div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 4000);
}

// Handle logout
function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        // Add logout animation
        document.body.style.opacity = '0.7';
        document.body.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            // In a real application, this would redirect to login page
            window.location.href = 'login.html';
        }, 500);
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // ESC to close modal
    if (e.key === 'Escape') {
        closeAchievementModal();
    }
    
    // Number keys to switch leaderboard filters
    if (e.key >= '1' && e.key <= '3') {
        const filters = ['global', 'monthly', 'weekly'];
        const filterIndex = parseInt(e.key) - 1;
        if (filters[filterIndex]) {
            switchLeaderboardFilter(filters[filterIndex]);
        }
    }
});

// Add smooth scrolling for internal navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Performance optimization: Lazy load avatar images
function lazyLoadAvatars() {
    const avatars = document.querySelectorAll('img[src*="ui-avatars.com"]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.src; // Trigger reload for lazy loading
                observer.unobserve(img);
            }
        });
    });
    
    avatars.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading when page loads
document.addEventListener('DOMContentLoaded', lazyLoadAvatars);

// Export functions for potential external use
window.LeaderboardApp = {
    switchFilter: switchLeaderboardFilter,
    showAchievement: showAchievementModal,
    updateStats: updateUserStats
};