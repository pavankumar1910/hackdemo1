// Learning Path JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize the application
    initializeLearningPath();
    
    function initializeLearningPath() {
        setupEventListeners();
        updateStatistics();
        initializeFilters();
        animateProgressBars();
        animateStatsCards();
    }
    
    // Setup all event listeners
    function setupEventListeners() {
        // Toggle row details functionality
        setupRowExpansion();
        
        // Filter functionality
        setupFilters();
        
        // Button actions
        setupButtonActions();
        
        // Header actions
        setupHeaderActions();
        
        // Logout functionality
        setupLogout();
    }
    
    // Row expansion functionality
    function setupRowExpansion() {
        // Expand button click
        document.querySelectorAll('.btn-expand').forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                toggleRowDetails(this);
            });
        });
        
        // Row click to expand
        document.querySelectorAll('.row-main').forEach(row => {
            row.addEventListener('click', function(e) {
                // Don't trigger if clicking on buttons or links
                if (e.target.closest('.btn-expand') || e.target.closest('button')) {
                    return;
                }
                const expandBtn = this.querySelector('.btn-expand');
                if (expandBtn) {
                    toggleRowDetails(expandBtn);
                }
            });
        });
    }
    
    // Toggle row details
    function toggleRowDetails(button) {
        const moduleRow = button.closest('.module-row');
        const details = moduleRow.querySelector('.row-details');
        const icon = button.querySelector('i');
        
        // Check if this row is currently expanded
        const isExpanded = details.style.display === 'block';
        
        // Close all other expanded rows first
        closeAllExpandedRows();
        
        if (!isExpanded) {
            // Open current row
            details.style.display = 'block';
            icon.style.transform = 'rotate(180deg)';
            moduleRow.classList.add('expanded');
            
            // Animate the expansion
            details.style.opacity = '0';
            details.style.transform = 'translateY(-10px)';
            
            requestAnimationFrame(() => {
                details.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                details.style.opacity = '1';
                details.style.transform = 'translateY(0)';
            });
            
            // Animate progress bar if present
            const progressFill = details.querySelector('.progress-fill');
            if (progressFill) {
                const targetWidth = progressFill.style.width;
                progressFill.style.width = '0%';
                setTimeout(() => {
                    progressFill.style.width = targetWidth;
                }, 200);
            }
        }
    }
    
    // Close all expanded rows
    function closeAllExpandedRows() {
        document.querySelectorAll('.module-row').forEach(row => {
            const details = row.querySelector('.row-details');
            const icon = row.querySelector('.btn-expand i');
            
            if (details.style.display === 'block') {
                details.style.opacity = '0';
                details.style.transform = 'translateY(-10px)';
                
                setTimeout(() => {
                    details.style.display = 'none';
                    details.style.transition = '';
                }, 200);
            }
            
            if (icon) {
                icon.style.transform = 'rotate(0deg)';
            }
            row.classList.remove('expanded');
        });
    }
    
    // Setup filter functionality
    function setupFilters() {
        const statusFilter = document.getElementById('statusFilter');
        const difficultyFilter = document.getElementById('difficultyFilter');
        
        if (statusFilter) {
            statusFilter.addEventListener('change', applyFilters);
        }
        
        if (difficultyFilter) {
            difficultyFilter.addEventListener('change', applyFilters);
        }
    }
    
    // Initialize filters with animation
    function initializeFilters() {
        const filterControls = document.querySelectorAll('.filter-select');
        filterControls.forEach((filter, index) => {
            filter.style.opacity = '0';
            filter.style.transform = 'translateY(-10px)';
            
            setTimeout(() => {
                filter.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                filter.style.opacity = '1';
                filter.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
    
    // Apply filters to modules
    function applyFilters() {
        const statusFilter = document.getElementById('statusFilter')?.value || 'all';
        const difficultyFilter = document.getElementById('difficultyFilter')?.value || 'all';
        const moduleRows = document.querySelectorAll('.module-row');
        
        let visibleCount = 0;
        
        moduleRows.forEach((row, index) => {
            const statusBadge = row.querySelector('.status-badge');
            const difficultyBadge = row.querySelector('.difficulty-badge');
            
            let statusMatch = statusFilter === 'all';
            let difficultyMatch = difficultyFilter === 'all';
            
            // Check status match
            if (!statusMatch && statusBadge) {
                statusMatch = statusBadge.classList.contains(statusFilter);
            }
            
            // Check difficulty match
            if (!difficultyMatch && difficultyBadge) {
                difficultyMatch = difficultyBadge.classList.contains(difficultyFilter);
            }
            
            // Show/hide row with animation
            if (statusMatch && difficultyMatch) {
                showModuleRow(row, visibleCount * 50);
                visibleCount++;
            } else {
                hideModuleRow(row);
            }
        });
        
        // Update statistics after filtering
        setTimeout(() => {
            updateFilteredStatistics(visibleCount);
        }, 300);
    }
    
    // Show module row with animation
    function showModuleRow(row, delay = 0) {
        setTimeout(() => {
            row.style.display = 'block';
            row.style.opacity = '0';
            row.style.transform = 'translateX(-20px)';
            
            requestAnimationFrame(() => {
                row.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                row.style.opacity = '1';
                row.style.transform = 'translateX(0)';
            });
        }, delay);
    }
    
    // Hide module row with animation
    function hideModuleRow(row) {
        row.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
        row.style.opacity = '0';
        row.style.transform = 'translateX(-20px)';
        
        setTimeout(() => {
            row.style.display = 'none';
        }, 200);
    }
    
    // Setup button actions
    function setupButtonActions() {
        document.querySelectorAll('.btn-action').forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                handleButtonAction(this);
            });
        });
    }
    
    // Handle different button actions
    function handleButtonAction(button) {
        const buttonText = button.textContent.trim();
        const moduleRow = button.closest('.module-row');
        const moduleId = moduleRow?.dataset.moduleId;
        const moduleName = moduleRow?.querySelector('.module-details h3')?.textContent;
        
        switch (buttonText) {
            case 'Continue Learning':
                startLearning(moduleId, moduleName, true);
                break;
            case 'Start Learning':
                startLearning(moduleId, moduleName, false);
                break;
            case 'View Certificate':
                viewCertificate(moduleId, moduleName);
                break;
            case 'Retake':
                retakeModule(moduleId, moduleName);
                break;
            case 'Bookmark':
                bookmarkModule(moduleId, moduleName);
                break;
            case 'Resources':
                downloadResources(moduleId, moduleName);
                break;
            case 'Prerequisites':
                showPrerequisites(moduleId, moduleName);
                break;
            case 'Locked':
                showLockedInfo(moduleId, moduleName);
                break;
            default:
                console.log(`Unknown action: ${buttonText}`);
        }
    }
    
    // Start learning a module
    function startLearning(moduleId, moduleName, isContinue = false) {
        const action = isContinue ? 'Continuing' : 'Starting';
        showNotification(`${action} ${moduleName}...`, 'info');
        
        // Simulate navigation to learning module
        setTimeout(() => {
            // In a real application, this would navigate to the learning module
            console.log(`Navigating to module ${moduleId}: ${moduleName}`);
            // window.location.href = `module.html?id=${moduleId}`;
        }, 1000);
    }
    
    // View certificate
    function viewCertificate(moduleId, moduleName) {
        showNotification(`Opening certificate for ${moduleName}`, 'success');
        // Simulate opening certificate
        setTimeout(() => {
            console.log(`Opening certificate for module ${moduleId}`);
            // window.open(`certificate.html?module=${moduleId}`, '_blank');
        }, 500);
    }
    
    // Retake module
    function retakeModule(moduleId, moduleName) {
        if (confirm(`Are you sure you want to retake "${moduleName}"? This will reset your progress.`)) {
            showNotification(`Retaking ${moduleName}...`, 'warning');
            
            // Update the UI to show retake in progress
            const moduleRow = document.querySelector(`[data-module-id="${moduleId}"]`);
            if (moduleRow) {
                const statusBadge = moduleRow.querySelector('.status-badge');
                const progressFill = moduleRow.querySelector('.progress-fill');
                const progressPercentage = moduleRow.querySelector('.progress-percentage');
                
                // Update status
                statusBadge.className = 'status-badge in-progress';
                statusBadge.innerHTML = '<i class="fas fa-play"></i> In Progress';
                
                // Reset progress
                if (progressFill) progressFill.style.width = '0%';
                if (progressPercentage) progressPercentage.textContent = '0%';
                
                // Update action buttons
                const actionContainer = moduleRow.querySelector('.module-actions');
                if (actionContainer) {
                    actionContainer.innerHTML = `
                        <button class="btn-action primary">
                            <i class="fas fa-play"></i>
                            Continue Learning
                        </button>
                        <button class="btn-action secondary">
                            <i class="fas fa-bookmark"></i>
                            Bookmark
                        </button>
                    `;
                    
                    // Re-attach event listeners
                    actionContainer.querySelectorAll('.btn-action').forEach(btn => {
                        btn.addEventListener('click', function(e) {
                            e.stopPropagation();
                            handleButtonAction(this);
                        });
                    });
                }
            }
            
            // Update statistics
            updateStatistics();
        }
    }
    
    // Bookmark module
    function bookmarkModule(moduleId, moduleName) {
        showNotification(`${moduleName} added to bookmarks`, 'success');
        
        // Toggle bookmark visual state
        const button = event.target.closest('.btn-action');
        const icon = button.querySelector('i');
        
        if (icon.classList.contains('fa-bookmark')) {
            icon.classList.remove('fa-bookmark');
            icon.classList.add('fa-bookmark-o');
            button.innerHTML = '<i class="fas fa-bookmark-o"></i> Bookmark';
        } else {
            icon.classList.remove('fa-bookmark-o');
            icon.classList.add('fa-bookmark');
            button.innerHTML = '<i class="fas fa-bookmark"></i> Bookmarked';
        }
    }
    
    // Download resources
    function downloadResources(moduleId, moduleName) {
        showNotification(`Downloading resources for ${moduleName}...`, 'info');
        
        // Simulate download
        setTimeout(() => {
            showNotification(`Resources for ${moduleName} downloaded successfully`, 'success');
        }, 2000);
    }
    
    // Show prerequisites
    function showPrerequisites(moduleId, moduleName) {
        const prerequisites = getPrerequisites(moduleId);
        
        const modal = createModal('Prerequisites', `
            <div class="prerequisites-content">
                <h4>To start "${moduleName}", you need to complete:</h4>
                <ul class="prerequisites-list">
                    ${prerequisites.map(prereq => `
                        <li class="prerequisite-item ${prereq.completed ? 'completed' : 'pending'}">
                            <i class="fas ${prereq.completed ? 'fa-check-circle' : 'fa-clock'}"></i>
                            ${prereq.name}
                        </li>
                    `).join('')}
                </ul>
            </div>
        `);
        
        document.body.appendChild(modal);
    }
    
    // Show locked module info
    function showLockedInfo(moduleId, moduleName) {
        showNotification(`${moduleName} is locked. Complete prerequisites first.`, 'warning');
        showPrerequisites(moduleId, moduleName);
    }
    
    // Setup header actions
    function setupHeaderActions() {
        const refreshBtn = document.getElementById('refreshPathBtn');
        const customizeBtn = document.getElementById('customizeBtn');
        
        if (refreshBtn) {
            refreshBtn.addEventListener('click', refreshLearningPath);
        }
        
        if (customizeBtn) {
            customizeBtn.addEventListener('click', customizePath);
        }
    }
    
    // Refresh learning path
    function refreshLearningPath() {
        const button = document.getElementById('refreshPathBtn');
        const icon = button.querySelector('i');
        
        // Add spinning animation
        icon.style.animation = 'spin 1s linear infinite';
        button.disabled = true;
        
        showNotification('Refreshing learning path...', 'info');
        
        // Simulate refresh
        setTimeout(() => {
            icon.style.animation = '';
            button.disabled = false;
            showNotification('Learning path updated successfully!', 'success');
            updateStatistics();
        }, 2000);
    }
    
    // Customize learning path
    function customizePath() {
        showNotification('Opening customization options...', 'info');
        
        const modal = createModal('Customize Learning Path', `
            <div class="customize-content">
                <div class="customize-section">
                    <h4>Learning Preferences</h4>
                    <label>
                        <input type="checkbox" checked> Include beginner modules
                    </label>
                    <label>
                        <input type="checkbox" checked> Include intermediate modules
                    </label>
                    <label>
                        <input type="checkbox"> Include advanced modules
                    </label>
                </div>
                <div class="customize-section">
                    <h4>Time Commitment</h4>
                    <select>
                        <option>1-2 hours per week</option>
                        <option selected>3-5 hours per week</option>
                        <option>5+ hours per week</option>
                    </select>
                </div>
                <div class="customize-section">
                    <h4>Focus Areas</h4>
                    <label><input type="checkbox" checked> Frontend Development</label>
                    <label><input type="checkbox"> Backend Development</label>
                    <label><input type="checkbox"> Data Analysis</label>
                    <label><input type="checkbox"> Mobile Development</label>
                </div>
                <div class="customize-actions">
                    <button class="btn-primary" onclick="saveCustomization()">Save Changes</button>
                    <button class="btn-secondary" onclick="closeModal()">Cancel</button>
                </div>
            </div>
        `);
        
        document.body.appendChild(modal);
    }
    
    // Setup logout functionality
    function setupLogout() {
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function() {
                if (confirm('Are you sure you want to logout?')) {
                    showNotification('Logging out...', 'info');
                    setTimeout(() => {
                        // window.location.href = 'login.html';
                        console.log('Redirecting to login page');
                    }, 1000);
                }
            });
        }
    }
    
    // Update statistics
    function updateStatistics() {
        const moduleRows = document.querySelectorAll('.module-row');
        let totalModules = moduleRows.length;
        let completedModules = 0;
        let inProgressModules = 0;
        let totalEstimatedTime = 0;
        
        moduleRows.forEach(row => {
            const statusBadge = row.querySelector('.status-badge');
            const timeValue = row.querySelector('.time-value')?.textContent;
            
            if (statusBadge?.classList.contains('completed')) {
                completedModules++;
            } else if (statusBadge?.classList.contains('in-progress')) {
                inProgressModules++;
            }
            
            // Extract time value
            if (timeValue) {
                const hours = parseInt(timeValue.match(/\d+/)?.[0] || 0);
                totalEstimatedTime += hours;
            }
        });
        
        // Update stat cards with animation
        animateStatValue('totalModules', totalModules);
        animateStatValue('completedModules', completedModules);
        animateStatValue('inProgressModules', inProgressModules);
        animateStatValue('estimatedTime', `${totalEstimatedTime}h`);
    }
    
    // Update filtered statistics
    function updateFilteredStatistics(visibleCount) {
        const totalElement = document.getElementById('totalModules');
        if (totalElement) {
            animateStatValue('totalModules', visibleCount);
        }
    }
    
    // Animate stat value changes
    function animateStatValue(elementId, newValue) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        const currentValue = element.textContent;
        if (currentValue === newValue.toString()) return;
        
        element.style.transform = 'scale(1.1)';
        element.style.color = '#8B5CF6';
        
        setTimeout(() => {
            element.textContent = newValue;
            element.style.transform = 'scale(1)';
            element.style.color = '';
        }, 150);
    }
    
    // Animate stats cards on load
    function animateStatsCards() {
        const statCards = document.querySelectorAll('.stat-card');
        statCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 150);
        });
    }
    
    // Animate progress bars on load
    function animateProgressBars() {
        setTimeout(() => {
            document.querySelectorAll('.progress-fill').forEach(bar => {
                const targetWidth = bar.style.width;
                bar.style.width = '0%';
                
                setTimeout(() => {
                    bar.style.width = targetWidth;
                }, 100);
            });
        }, 1000);
    }
    
    // Utility functions
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existing = document.querySelector('.notification');
        if (existing) {
            existing.remove();
        }
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${getNotificationIcon(type)}"></i>
                <span>${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
        
        // Close button
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });
    }
    
    function getNotificationIcon(type) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        return icons[type] || icons.info;
    }
    
    function createModal(title, content) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="modal-close" onclick="closeModal()">&times;</button>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
            </div>
        `;
        
        // Close on overlay click
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
        
        return modal;
    }
    
    function getPrerequisites(moduleId) {
        // Mock prerequisites data
        const prerequisites = {
            '3': [
                { name: 'JavaScript Fundamentals', completed: true },
                { name: 'Basic SQL Concepts', completed: false }
            ],
            '4': [
                { name: 'JavaScript Fundamentals', completed: true },
                { name: 'React Component Development', completed: false },
                { name: 'Database Design & SQL', completed: false }
            ],
            '5': [
                { name: 'Python Basics', completed: true },
                { name: 'Statistics Fundamentals', completed: false }
            ]
        };
        
        return prerequisites[moduleId] || [];
    }
    
    // Global functions for modal actions
    window.closeModal = function() {
        const modal = document.querySelector('.modal-overlay');
        if (modal) {
            modal.remove();
        }
    };
    
    window.saveCustomization = function() {
        showNotification('Customization saved successfully!', 'success');
        closeModal();
        setTimeout(() => {
            refreshLearningPath();
        }, 500);
    };
    
    // Add CSS for notifications and modals
    const styles = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            background: white;
            border-radius: 8px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
            overflow: hidden;
            animation: slideInRight 0.3s ease;
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            padding: 1rem 1.5rem;
            gap: 0.75rem;
        }
        
        .notification-success { border-left: 4px solid #10b981; }
        .notification-error { border-left: 4px solid #ef4444; }
        .notification-warning { border-left: 4px solid #f59e0b; }
        .notification-info { border-left: 4px solid #3b82f6; }
        
        .notification-success i { color: #10b981; }
        .notification-error i { color: #ef4444; }
        .notification-warning i { color: #f59e0b; }
        .notification-info i { color: #3b82f6; }
        
        .notification-close {
            background: none;
            border: none;
            font-size: 1.2rem;
            cursor: pointer;
            color: #94a3b8;
            margin-left: auto;
        }
        
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease;
        }
        
        .modal-content {
            background: white;
            border-radius: 12px;
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            animation: slideInUp 0.3s ease;
        }
        
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1.5rem;
            border-bottom: 1px solid #e2e8f0;
        }
        
        .modal-close {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: #94a3b8;
        }
        
        .modal-body {
            padding: 1.5rem;
        }
        
        .customize-content {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
        }
        
        .customize-section h4 {
            margin-bottom: 0.75rem;
            color: #1e293b;
        }
        
        .customize-section label {
            display: block;
            margin-bottom: 0.5rem;
            cursor: pointer;
        }
        
        .customize-section input,
        .customize-section select {
            margin-right: 0.5rem;
        }
        
        .customize-actions {
            display: flex;
            gap: 1rem;
            justify-content: flex-end;
            margin-top: 1rem;
        }
        
        .prerequisites-list {
            list-style: none;
            padding: 0;
            margin: 1rem 0;
        }
        
        .prerequisite-item {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 0.75rem;
            margin-bottom: 0.5rem;
            border-radius: 8px;
            background: #f8fafc;
        }
        
        .prerequisite-item.completed {
            background: rgba(16, 185, 129, 0.1);
            color: #059669;
        }
        
        .prerequisite-item.pending {
            background: rgba(245, 158, 11, 0.1);
            color: #d97706;
        }
        
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes slideInUp {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
    `;
    
    // Inject styles
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
});