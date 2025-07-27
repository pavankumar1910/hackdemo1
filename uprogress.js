// Progress tracking data
const progressData = {
    steps: [
        {
            id: 1,
            title: "Profile Created",
            status: "completed",
            timestamp: "July 22, 2025 - 09:15 AM",
            duration: "5 minutes",
            score: "100%",
            details: {
                description: "Account created and verified",
                metrics: [
                    { icon: "fas fa-clock", text: "Completed in 5 minutes" },
                    { icon: "fas fa-check", text: "All required fields filled" },
                    { icon: "fas fa-user-check", text: "Email verification completed" }
                ]
            }
        },
        {
            id: 2,
            title: "Assessment Completed",
            status: "completed",
            timestamp: "July 22, 2025 - 10:30 AM",
            duration: "15 minutes",
            score: "85%",
            details: {
                description: "Comprehensive skill evaluation completed",
                metrics: [
                    { icon: "fas fa-clock", text: "Assessment took 15 minutes" },
                    { icon: "fas fa-star", text: "Score: 85%" },
                    { icon: "fas fa-chart-bar", text: "Above average performance" },
                    { icon: "fas fa-brain", text: "Cognitive skills tested" }
                ]
            }
        },
        {
            id: 3,
            title: "Skills Evaluated",
            status: "completed",
            timestamp: "July 22, 2025 - 11:45 AM",
            duration: "8 minutes",
            score: "100%",
            details: {
                description: "Detailed evaluation of your technical abilities",
                metrics: [
                    { icon: "fas fa-clock", text: "Analysis took 8 minutes" },
                    { icon: "fas fa-code", text: "12 skills identified" },
                    { icon: "fas fa-trophy", text: "3 strength areas found" },
                    { icon: "fas fa-chart-pie", text: "Comprehensive analysis" }
                ]
            }
        },
        {
            id: 4,
            title: "Learning Path Generated",
            status: "pending",
            timestamp: "In Progress...",
            duration: "5 minutes",
            score: "60%",
            details: {
                description: "Creating your personalized learning journey",
                metrics: [
                    { icon: "fas fa-hourglass-half", text: "Estimated: 5 minutes" },
                    { icon: "fas fa-map", text: "Customized roadmap" },
                    { icon: "fas fa-target", text: "Goal-oriented approach" },
                    { icon: "fas fa-rocket", text: "AI-powered recommendations" }
                ]
            }
        }
    ],
    currentStep: 3,
    overallProgress: 75
};

// DOM elements
const elements = {
    progressFill: document.getElementById('progressFill'),
    overallProgress: document.getElementById('overallProgress'),
    totalTime: document.getElementById('totalTime'),
    completedSteps: document.getElementById('completedSteps'),
    currentScore: document.getElementById('currentScore'),
    resetProgressBtn: document.getElementById('resetProgressBtn'),
    exportBtn: document.getElementById('exportBtn'),
    continueBtn: document.getElementById('continueBtn'),
    viewReportBtn: document.getElementById('viewReportBtn'),
    logoutBtn: document.getElementById('logoutBtn')
};

// Animation and interaction state
let animationInProgress = false;
let simulationInterval = null;

// Initialize the application
function init() {
    console.log('🚀 Initializing Progress Tracker...');
    
    // Core functionality
    updateProgressBar();
    updateStats();
    renderProgressNodes();
    bindEventListeners();
    
    // Enhanced features
    addAnimationEffects();
    initializeTooltips();
    startProgressSimulation();
    
    // Accessibility
    addKeyboardNavigation();
    
    console.log('✅ Progress Tracker initialized successfully');
}

// Update progress bar visual with smooth animation
function updateProgressBar() {
    const completedSteps = progressData.steps.filter(step => step.status === 'completed').length;
    const totalSteps = progressData.steps.length;
    const progressPercentage = (completedSteps / totalSteps) * 100;
    
    if (elements.progressFill) {
        // Smooth animation
        elements.progressFill.style.transition = 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
        elements.progressFill.style.width = `${progressPercentage}%`;
        
        // Update data attribute for CSS animations
        elements.progressFill.setAttribute('data-progress', progressPercentage);
    }
    
    // Update overall progress data
    progressData.overallProgress = progressPercentage;
}

// Update statistics display with animations
function updateStats() {
    const completedSteps = progressData.steps.filter(step => step.status === 'completed').length;
    const totalSteps = progressData.steps.length;
    
    // Calculate total time
    let totalMinutes = 0;
    progressData.steps.forEach(step => {
        if (step.status === 'completed') {
            const minutes = parseInt(step.duration);
            totalMinutes += minutes;
        }
    });
    
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const totalTimeStr = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
    
    // Calculate average score
    const completedScores = progressData.steps
        .filter(step => step.status === 'completed')
        .map(step => parseInt(step.score));
    const averageScore = completedScores.length > 0 
        ? Math.round(completedScores.reduce((a, b) => a + b, 0) / completedScores.length)
        : 0;
    
    // Animate number updates
    animateNumber(elements.overallProgress, Math.round((completedSteps / totalSteps) * 100), '%');
    animateNumber(elements.currentScore, averageScore, '%');
    
    // Update other elements
    if (elements.totalTime) {
        elements.totalTime.textContent = totalTimeStr;
    }
    if (elements.completedSteps) {
        elements.completedSteps.textContent = `${completedSteps}/${totalSteps}`;
    }
}

// Animate number changes
function animateNumber(element, targetValue, suffix = '') {
    if (!element) return;
    
    const startValue = parseInt(element.textContent) || 0;
    const duration = 1000;
    const startTime = performance.now();
    
    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.round(startValue + (targetValue - startValue) * easeOutCubic);
        
        element.textContent = currentValue + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        }
    }
    
    requestAnimationFrame(updateNumber);
}

// Render progress nodes dynamically
function renderProgressNodes() {
    const nodesContainer = document.querySelector('.progress-nodes');
    if (!nodesContainer) return;
    
    nodesContainer.innerHTML = '';
    
    progressData.steps.forEach((step, index) => {
        const nodeElement = createProgressNode(step, index);
        nodesContainer.appendChild(nodeElement);
    });
}

// Create individual progress node
function createProgressNode(step, index) {
    const node = document.createElement('div');
    node.className = `progress-node ${step.status}`;
    node.setAttribute('data-step', step.id);
    node.setAttribute('tabindex', '0');
    node.setAttribute('role', 'button');
    node.setAttribute('aria-label', `Step ${step.id}: ${step.title} - ${step.status}`);
    
    const iconMap = {
        1: 'fas fa-user',
        2: 'fas fa-clipboard-check',
        3: 'fas fa-brain',
        4: 'fas fa-route'
    };
    
    node.innerHTML = `
        <div class="node-circle">
            <i class="${iconMap[step.id] || 'fas fa-circle'}"></i>
        </div>
        <div class="node-content">
            <h3 class="node-title">${step.title}</h3>
            <p class="node-description">${step.details.description}</p>
            <div class="node-timestamp">
                <i class="fas fa-calendar"></i>
                <span>${step.timestamp}</span>
            </div>
        </div>
        <div class="node-tooltip">
            <div class="tooltip-content">
                <h4>${step.title}</h4>
                <p>${step.details.description}</p>
                <div class="tooltip-details">
                    ${step.details.metrics.map(metric => 
                        `<span><i class="${metric.icon}"></i> ${metric.text}</span>`
                    ).join('')}
                </div>
            </div>
        </div>
    `;
    
    // Add click handler for detailed view
    node.addEventListener('click', () => showStepDetails(step));
    
    return node;
}

// Show detailed step information
function showStepDetails(step) {
    const modal = createModal(step);
    document.body.appendChild(modal);
    
    // Animate modal appearance
    requestAnimationFrame(() => {
        modal.classList.add('show');
    });
}

// Create modal for step details
function createModal(step) {
    const modal = document.createElement('div');
    modal.className = 'step-modal';
    modal.innerHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <div class="modal-header">
                    <h2><i class="fas fa-info-circle"></i> ${step.title}</h2>
                    <button class="modal-close" aria-label="Close modal">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="step-status ${step.status}">
                        <i class="fas ${step.status === 'completed' ? 'fa-check-circle' : 'fa-clock'}"></i>
                        <span>${step.status.charAt(0).toUpperCase() + step.status.slice(1)}</span>
                    </div>
                    <p class="step-description">${step.details.description}</p>
                    <div class="step-metrics">
                        <h3>Details:</h3>
                        <ul>
                            ${step.details.metrics.map(metric => 
                                `<li><i class="${metric.icon}"></i> ${metric.text}</li>`
                            ).join('')}
                        </ul>
                    </div>
                    <div class="step-info">
                        <div class="info-item">
                            <label>Timestamp:</label>
                            <span>${step.timestamp}</span>
                        </div>
                        <div class="info-item">
                            <label>Duration:</label>
                            <span>${step.duration}</span>
                        </div>
                        <div class="info-item">
                            <label>Score:</label>
                            <span>${step.score}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add styles
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 10000;
        opacity: 0;
        transform: scale(0.9);
        transition: all 0.3s ease;
    `;
    
    // Close modal functionality
    const closeModal = () => {
        modal.classList.remove('show');
        setTimeout(() => modal.remove(), 300);
    };
    
    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.querySelector('.modal-overlay').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) closeModal();
    });
    
    // Keyboard support
    modal.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
    
    return modal;
}

// Bind event listeners
function bindEventListeners() {
    // Reset progress button
    if (elements.resetProgressBtn) {
        elements.resetProgressBtn.addEventListener('click', resetProgress);
    }
    
    // Export button
    if (elements.exportBtn) {
        elements.exportBtn.addEventListener('click', exportReport);
    }
    
    // Continue button
    if (elements.continueBtn) {
        elements.continueBtn.addEventListener('click', continueToLearningPath);
    }
    
    // View report button
    if (elements.viewReportBtn) {
        elements.viewReportBtn.addEventListener('click', viewDetailedReport);
    }
    
    // Logout button
    if (elements.logoutBtn) {
        elements.logoutBtn.addEventListener('click', handleLogout);
    }
    
    // Window resize handler
    window.addEventListener('resize', handleResize);
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
}

// Reset progress with confirmation
function resetProgress() {
    if (confirm('Are you sure you want to reset all progress? This action cannot be undone.')) {
        animationInProgress = true;
        
        // Reset data
        progressData.steps.forEach(step => {
            step.status = step.id === 1 ? 'completed' : 'inactive';
            if (step.id > 1) {
                step.timestamp = 'Not started';
                step.score = '0%';
            }
        });
        
        progressData.currentStep = 1;
        progressData.overallProgress = 25;
        
        // Update UI with animation
        updateProgressBar();
        updateStats();
        renderProgressNodes();
        
        // Show success message
        showNotification('Progress has been reset successfully!', 'success');
        
        setTimeout(() => {
            animationInProgress = false;
        }, 1500);
    }
}

// Export progress report
function exportReport() {
    const reportData = {
        exportDate: new Date().toISOString(),
        overallProgress: progressData.overallProgress,
        steps: progressData.steps,
        summary: generateSummary()
    };
    
    // Create downloadable file
    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
        type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `progress-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
    showNotification('Progress report exported successfully!', 'success');
}

// Generate progress summary
function generateSummary() {
    const completed = progressData.steps.filter(s => s.status === 'completed').length;
    const totalTime = progressData.steps
        .filter(s => s.status === 'completed')
        .reduce((acc, s) => acc + parseInt(s.duration), 0);
    
    const avgScore = progressData.steps
        .filter(s => s.status === 'completed')
        .reduce((acc, s) => acc + parseInt(s.score), 0) / completed;
    
    return {
        completedSteps: completed,
        totalSteps: progressData.steps.length,
        totalTimeMinutes: totalTime,
        averageScore: Math.round(avgScore),
        completionRate: Math.round((completed / progressData.steps.length) * 100)
    };
}

// Continue to learning path
function continueToLearningPath() {
    if (progressData.currentStep < 4) {
        showNotification('Please complete all previous steps first.', 'warning');
        return;
    }
    
    showNotification('Redirecting to Learning Path...', 'info');
    setTimeout(() => {
        window.location.href = 'learning-path.html';
    }, 1000);
}

// View detailed report
function viewDetailedReport() {
    const reportWindow = window.open('', '_blank', 'width=800,height=600');
    const reportHTML = generateDetailedReportHTML();
    
    reportWindow.document.write(reportHTML);
    reportWindow.document.close();
    
    showNotification('Detailed report opened in new window.', 'info');
}

// Generate detailed report HTML
function generateDetailedReportHTML() {
    const summary = generateSummary();
    
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Progress Report - Zen Coders</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
                .header { text-align: center; margin-bottom: 40px; }
                .summary { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
                .step { border: 1px solid #dee2e6; margin: 10px 0; padding: 15px; border-radius: 5px; }
                .completed { border-left: 4px solid #28a745; }
                .pending { border-left: 4px solid #ffc107; }
                .inactive { border-left: 4px solid #6c757d; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>Progress Report - Zen Coders</h1>
                <p>Generated on: ${new Date().toLocaleString()}</p>
            </div>
            
            <div class="summary">
                <h2>Summary</h2>
                <p><strong>Overall Progress:</strong> ${summary.completionRate}%</p>
                <p><strong>Completed Steps:</strong> ${summary.completedSteps}/${summary.totalSteps}</p>
                <p><strong>Total Time:</strong> ${summary.totalTimeMinutes} minutes</p>
                <p><strong>Average Score:</strong> ${summary.averageScore}%</p>
            </div>
            
            <div class="steps">
                <h2>Step Details</h2>
                ${progressData.steps.map(step => `
                    <div class="step ${step.status}">
                        <h3>${step.title}</h3>
                        <p><strong>Status:</strong> ${step.status}</p>
                        <p><strong>Timestamp:</strong> ${step.timestamp}</p>
                        <p><strong>Duration:</strong> ${step.duration}</p>
                        <p><strong>Score:</strong> ${step.score}</p>
                        <p><strong>Description:</strong> ${step.details.description}</p>
                    </div>
                `).join('')}
            </div>
        </body>
        </html>
    `;
}

// Handle logout
function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        showNotification('Logging out...', 'info');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1000);
    }
}

// Add animation effects
function addAnimationEffects() {
    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, { threshold: 0.1 });
    
    // Observe elements for animation
    document.querySelectorAll('.stat-card, .progress-node, .detail-card').forEach(el => {
        observer.observe(el);
    });
}

// Initialize tooltips
function initializeTooltips() {
    const tooltipTriggers = document.querySelectorAll('[data-tooltip]');
    
    tooltipTriggers.forEach(trigger => {
        trigger.addEventListener('mouseenter', showTooltip);
        trigger.addEventListener('mouseleave', hideTooltip);
    });
}

// Show tooltip
function showTooltip(e) {
    const tooltip = e.target.querySelector('.node-tooltip');
    if (tooltip) {
        tooltip.style.opacity = '1';
        tooltip.style.visibility = 'visible';
        tooltip.style.transform = 'translateX(-50%) translateY(-10px)';
    }
}

// Hide tooltip
function hideTooltip(e) {
    const tooltip = e.target.querySelector('.node-tooltip');
    if (tooltip) {
        tooltip.style.opacity = '0';
        tooltip.style.visibility = 'hidden';
        tooltip.style.transform = 'translateX(-50%) translateY(0)';
    }
}

// Start progress simulation
function startProgressSimulation() {
    // Simulate progress for pending step
    const pendingStep = progressData.steps.find(step => step.status === 'pending');
    
    if (pendingStep) {
        let progress = parseInt(pendingStep.score);
        
        simulationInterval = setInterval(() => {
            if (progress < 100) {
                progress += Math.random() * 5;
                progress = Math.min(progress, 100);
                pendingStep.score = Math.round(progress) + '%';
                
                // Update UI
                updateStats();
                
                // Complete step when reaching 100%
                if (progress >= 100) {
                    pendingStep.status = 'completed';
                    pendingStep.timestamp = new Date().toLocaleString();
                    clearInterval(simulationInterval);
                    
                    // Update progress and show notification
                    updateProgressBar();
                    updateStats();
                    renderProgressNodes();
                    showNotification(`${pendingStep.title} completed!`, 'success');
                }
            }
        }, 2000);
    }
}

// Add keyboard navigation
function addKeyboardNavigation() {
    const progressNodes = document.querySelectorAll('.progress-node');
    
    progressNodes.forEach((node, index) => {
        node.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'Enter':
                case ' ':
                    e.preventDefault();
                    node.click();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    if (index < progressNodes.length - 1) {
                        progressNodes[index + 1].focus();
                    }
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    if (index > 0) {
                        progressNodes[index - 1].focus();
                    }
                    break;
            }
        });
    });
}

// Handle keyboard shortcuts
function handleKeyboardShortcuts(e) {
    if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
            case 'r':
                e.preventDefault();
                resetProgress();
                break;
            case 'e':
                e.preventDefault();
                exportReport();
                break;
            case 'd':
                e.preventDefault();
                viewDetailedReport();
                break;
        }
    }
}

// Handle window resize
function handleResize() {
    // Recalculate positions and sizes if needed
    const progressLine = document.querySelector('.progress-line');
    if (progressLine && window.innerWidth <= 768) {
        progressLine.style.display = 'none';
    } else if (progressLine) {
        progressLine.style.display = 'block';
    }
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    requestAnimationFrame(() => {
        notification.style.transform = 'translateX(0)';
    });
    
    // Auto remove
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Get notification icon
function getNotificationIcon(type) {
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    return icons[type] || icons.info;
}

// Get notification color
function getNotificationColor(type) {
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    };
    return colors[type] || colors.info;
}

// Error handling
window.addEventListener('error', (e) => {
    console.error('Progress Tracker Error:', e.error);
    showNotification('An error occurred. Please refresh the page.', 'error');
});

// Performance monitoring
function logPerformance() {
    if (performance.mark) {
        performance.mark('progress-tracker-loaded');
        console.log('📊 Progress Tracker Performance:', {
            loadTime: performance.now(),
            memory: performance.memory ? performance.memory.usedJSHeapSize : 'N/A'
        });
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        init();
        logPerformance();
    });
} else {
    init();
    logPerformance();
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (simulationInterval) {
        clearInterval(simulationInterval);
    }
});

// Export functions for external use
window.ProgressTracker = {
    updateStep: (stepId, status, score) => {
        const step = progressData.steps.find(s => s.id === stepId);
        if (step) {
            step.status = status;
            step.score = score + '%';
            step.timestamp = new Date().toLocaleString();
            updateProgressBar();
            updateStats();
            renderProgressNodes();
        }
    },
    getCurrentProgress: () => progressData,
    exportData: exportReport,
    resetAll: resetProgress
};