// DOM Elements
const navLinks = document.querySelectorAll('.nav-link');
const sectionContents = document.querySelectorAll('.section-content');
const cards = document.querySelectorAll('.card[data-page]');
const logoutBtn = document.getElementById('logoutBtn');

// Navigation functionality
function showSection(sectionId) {
    // Hide all sections
    sectionContents.forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target section
    const targetSection = document.getElementById(`${sectionId}-content`);
    if (targetSection) {
        targetSection.classList.add('active');
    }
}

function setActiveNavItem(targetSection) {
    // Remove active class from all nav items
    navLinks.forEach(link => {
        link.parentElement.classList.remove('active');
    });
    
    // Add active class to clicked nav item
    const targetNavLink = document.querySelector(`[data-section="${targetSection}"]`);
    if (targetNavLink) {
        targetNavLink.parentElement.classList.add('active');
    }
}

// Initialize navigation event listeners
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const targetSection = link.getAttribute('data-section');
        if (targetSection) {
            e.preventDefault();
            showSection(targetSection);
            setActiveNavItem(targetSection);
            history.pushState({ section: targetSection }, '', `#${targetSection}`);
            handleSectionLoad(targetSection);
        }
        // If no data-section, allow normal navigation
    });
});


// Card click navigation
cards.forEach(card => {
    card.addEventListener('click', () => {
        const targetPage = card.getAttribute('data-page');

        if (targetPage) {
            switch (targetPage) {
                case 'resume':
                    window.location.href='uresume.html';
                    break;
                case 'assessments':
                    window.location.href = 'uassignment.html';
                    break;
                case 'progress':
                    window.location.href = 'uprogress.html';
                    break;
                case 'skills':
                    window.location.href = 'skills.html'; // Adjust if needed
                    break;
                case 'learning-path':
                    window.location.href = 'ulearning.html'; // Adjust if needed
                    break;
                case 'hackathons':
                    window.location.href = 'uhack.html'; // Adjust if needed
                    break;
                case 'leaderboard':
                    window.location.href = 'uleader.html'; // Adjust if needed
                    break;
                default:
                    // Fallback: try to navigate via SPA-style logic if needed
                    showSection(targetPage);
                    setActiveNavItem(targetPage);
                    history.pushState({ section: targetPage }, '', `#${targetPage}`);
            }
        }
    });
});


// Handle browser back/forward buttons
window.addEventListener('popstate', (e) => {
    if (e.state && e.state.section) {
        showSection(e.state.section);
        setActiveNavItem(e.state.section);
    } else {
        // Default to dashboard if no state
        showSection('dashboard');
        setActiveNavItem('dashboard');
    }
});

// Initialize page based on URL hash
function initializePage() {
    const hash = window.location.hash.substring(1); // Remove #
    
    if (hash && document.getElementById(`${hash}-content`)) {
        showSection(hash);
        setActiveNavItem(hash);
    } else {
        // Default to dashboard
        showSection('dashboard');
        setActiveNavItem('dashboard');
    }
}

// Logout functionality
logoutBtn.addEventListener('click', (e) => {
    e.preventDefault(); // Stops form submission
    if (confirm('Are you sure you want to logout?')) {
        alert('Logging out...');
        window.location.href = 'index.html';
    }
});


// Progress bar animations
function animateProgressBars() {
    // Animate circular progress
    const circleProgress = document.querySelector('[data-progress="85"]');
    if (circleProgress) {
        const percentage = 85;
        const degrees = (percentage / 100) * 360;
        circleProgress.style.background = `conic-gradient(#8B5CF6 0deg, #8B5CF6 ${degrees}deg, #e2e8f0 ${degrees}deg)`;
    }
    
    // Animate large progress bar
    const largeFill = document.querySelector('.progress-fill-large[data-progress="100"]');
    if (largeFill) {
        setTimeout(() => {
            largeFill.style.width = '100%';
        }, 500);
    }
    
    // Animate mini progress bars
    const miniFills = document.querySelectorAll('.mini-fill[data-progress]');
    miniFills.forEach((fill, index) => {
        const progress = fill.getAttribute('data-progress');
        setTimeout(() => {
            fill.style.width = `${progress}%`;
        }, 800 + (index * 200));
    });
    
    // Animate lesson progress
    const lessonFill = document.querySelector('.lesson-fill[data-progress="65"]');
    if (lessonFill) {
        setTimeout(() => {
            lessonFill.style.width = '65%';
        }, 1200);
    }
}

// Hackathon quick actions
function initializeHackathonActions() {
    const quickJoinBtn = document.querySelector('.btn-quick-join');
    const viewDetailsBtn = document.querySelector('.btn-view-details');
    
    if (quickJoinBtn) {
        quickJoinBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent card click
            alert('Joining hackathon... This would redirect to hackathon registration in a real app.');
        });
    }
    
    if (viewDetailsBtn) {
        viewDetailsBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent card click
            // Navigate to hackathons page
            showSection('hackathons');
            setActiveNavItem('hackathons');
            history.pushState({ section: 'hackathons' }, '', '#hackathons');
        });
    }
}

// Add hover effects for cards
function initializeCardEffects() {
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
}

// Simulate loading for placeholder sections
function simulateLoading(sectionId) {
    const section = document.getElementById(`${sectionId}-content`);
    if (section && section.querySelector('.loading-placeholder')) {
        // In a real app, you would load actual content here
        setTimeout(() => {
            const placeholder = section.querySelector('.loading-placeholder');
            if (placeholder) {
                placeholder.innerHTML = `
                    <div style="text-align: center; color: #64748b;">
                        <i class="fas fa-info-circle" style="font-size: 2rem; margin-bottom: 1rem; color: #8B5CF6;"></i>
                        <h3>Coming Soon</h3>
                        <p>This section is under development. Stay tuned for updates!</p>
                    </div>
                `;
            }
        }, 1500);
    }
}

// Handle section loading
function handleSectionLoad(sectionId) {
    if (sectionId !== 'dashboard') {
        simulateLoading(sectionId);
    }
}

// Update navigation to handle loading
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const targetSection = link.getAttribute('data-section');
        if (targetSection) {
            handleSectionLoad(targetSection);
        }
    });
});

// Achievement interaction
function initializeAchievements() {
    const achievements = document.querySelectorAll('.achievement-mini');
    achievements.forEach(achievement => {
        achievement.addEventListener('click', (e) => {
            e.stopPropagation();
            if (achievement.classList.contains('earned')) {
                achievement.style.animation = 'bounce 0.6s ease-in-out';
                setTimeout(() => {
                    achievement.style.animation = '';
                }, 600);
            }
        });
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializePage();
    animateProgressBars();
    initializeHackathonActions();
    initializeCardEffects();
    initializeAchievements();
    
    // Add a welcome animation
    setTimeout(() => {
        document.querySelector('.dashboard-header').style.opacity = '0';
        document.querySelector('.dashboard-header').style.transform = 'translateY(-20px)';
        document.querySelector('.dashboard-header').style.transition = 'all 0.6s ease';
        
        setTimeout(() => {
            document.querySelector('.dashboard-header').style.opacity = '1';
            document.querySelector('.dashboard-header').style.transform = 'translateY(0)';
        }, 100);
    }, 200);
});

// Utility function to show notifications (for future use)
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#8B5CF6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Export functions for external use (if needed)
window.ZenCoders = {
    showSection,
    setActiveNavItem,
    showNotification
};