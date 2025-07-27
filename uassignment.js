// Assessment Panel JavaScript
// Handle all interactive features for the assessment dashboard

class AssessmentPanel {
    constructor() {
        this.currentTab = 'upcoming';
        this.uploadedFiles = [];
        this.init();
    }

    init() {
        this.bindEvents();
        this.initializeAnimations();
        this.loadInitialData();
    }

    bindEvents() {
        // Modal events
        this.bindModalEvents();
        
        // Tab navigation events
        this.bindTabEvents();
        
        // Upload form events
        this.bindUploadEvents();
        
        // Repository connection events
        this.bindRepositoryEvents();
        
        // Assessment action events
        this.bindAssessmentEvents();
        
        // Logout event
        this.bindLogoutEvent();
        
        // General UI events
        this.bindUIEvents();
    }

    bindModalEvents() {
        // Upload modal
        const uploadBtn = document.getElementById('uploadBtn');
        const uploadModal = document.getElementById('uploadModal');
        const closeModal = document.getElementById('closeModal');
        const cancelUpload = document.getElementById('cancelUpload');

        uploadBtn?.addEventListener('click', () => this.openModal('uploadModal'));
        closeModal?.addEventListener('click', () => this.closeModal('uploadModal'));
        cancelUpload?.addEventListener('click', () => this.closeModal('uploadModal'));

        // Connect repository modal
        const connectBtn = document.getElementById('connectBtn');
        const connectModal = document.getElementById('connectModal');
        const closeConnectModal = document.getElementById('closeConnectModal');

        connectBtn?.addEventListener('click', () => this.openModal('connectModal'));
        closeConnectModal?.addEventListener('click', () => this.closeModal('connectModal'));

        // Close modal on backdrop click
        [uploadModal, connectModal].forEach(modal => {
            modal?.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal.id);
                }
            });
        });

        // Close modal on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });
    }

    bindTabEvents() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabName = button.getAttribute('data-tab');
                this.switchTab(tabName);
            });
        });
    }

    bindUploadEvents() {
        const uploadForm = document.getElementById('uploadForm');
        const fileInput = document.getElementById('exerciseFiles');
        const fileUploadArea = document.getElementById('fileUploadArea');
        const uploadExerciseBtn = document.getElementById('uploadExerciseBtn');

        // Form submission
        uploadForm?.addEventListener('submit', (e) => this.handleUploadSubmit(e));

        // File input change
        fileInput?.addEventListener('change', (e) => this.handleFileSelect(e));

        // Drag and drop events
        fileUploadArea?.addEventListener('click', () => fileInput?.click());
        fileUploadArea?.addEventListener('dragover', (e) => this.handleDragOver(e));
        fileUploadArea?.addEventListener('dragleave', (e) => this.handleDragLeave(e));
        fileUploadArea?.addEventListener('drop', (e) => this.handleFileDrop(e));

        // Upload exercise button in exercises tab
        uploadExerciseBtn?.addEventListener('click', () => this.openModal('uploadModal'));
    }

    bindRepositoryEvents() {
        const connectOptions = document.querySelectorAll('.connect-option');
        
        connectOptions.forEach(option => {
            const connectBtn = option.querySelector('.btn-connect');
            connectBtn?.addEventListener('click', () => {
                const provider = option.getAttribute('data-provider');
                this.handleRepositoryConnect(provider);
            });
        });
    }

    bindAssessmentEvents() {
        // Assessment action buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.btn-action')) {
                const button = e.target.closest('.btn-action');
                const action = this.getButtonAction(button);
                const assessmentCard = button.closest('.assessment-card, .exercise-card');
                
                this.handleAssessmentAction(action, assessmentCard);
            }
        });
    }

    bindLogoutEvent() {
        const logoutBtn = document.getElementById('logoutBtn');
        logoutBtn?.addEventListener('click', () => this.handleLogout());
    }

    bindUIEvents() {
        // Add hover effects and animations
        this.addHoverEffects();
        
        // Handle responsive navigation
        this.handleResponsiveNav();
        
        // Add loading states
        this.initializeLoadingStates();
    }

    // Modal Management
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Reset form if it's upload modal
            if (modalId === 'uploadModal') {
                this.resetUploadForm();
            }
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    closeAllModals() {
        const modals = document.querySelectorAll('.modal.active');
        modals.forEach(modal => {
            modal.classList.remove('active');
        });
        document.body.style.overflow = '';
    }

    // Tab Management
    switchTab(tabName) {
        // Update active tab button
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`)?.classList.add('active');

        // Update active tab content
        document.querySelectorAll('.tab-pane').forEach(pane => {
            pane.classList.remove('active');
        });
        document.getElementById(`${tabName}-tab`)?.classList.add('active');

        this.currentTab = tabName;
        
        // Load tab-specific data
        this.loadTabData(tabName);
    }

    // File Upload Management
    handleFileSelect(e) {
        const files = Array.from(e.target.files);
        this.addFiles(files);
    }

    handleDragOver(e) {
        e.preventDefault();
        e.currentTarget.classList.add('dragover');
    }

    handleDragLeave(e) {
        e.preventDefault();
        e.currentTarget.classList.remove('dragover');
    }

    handleFileDrop(e) {
        e.preventDefault();
        e.currentTarget.classList.remove('dragover');
        
        const files = Array.from(e.dataTransfer.files);
        this.addFiles(files);
    }

    addFiles(files) {
        const validFiles = files.filter(file => this.isValidFile(file));
        
        validFiles.forEach(file => {
            if (!this.uploadedFiles.find(f => f.name === file.name)) {
                this.uploadedFiles.push(file);
            }
        });
        
        this.updateFileList();
    }

    isValidFile(file) {
        const validExtensions = ['.js', '.py', '.java', '.cpp', '.html', '.css', '.md', '.txt'];
        const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
        const maxSize = 10 * 1024 * 1024; // 10MB
        
        if (!validExtensions.includes(fileExtension)) {
            this.showNotification('Invalid file type. Please upload supported file formats.', 'error');
            return false;
        }
        
        if (file.size > maxSize) {
            this.showNotification('File too large. Maximum size is 10MB.', 'error');
            return false;
        }
        
        return true;
    }

    updateFileList() {
        const fileList = document.getElementById('fileList');
        if (!fileList) return;

        fileList.innerHTML = '';
        
        this.uploadedFiles.forEach((file, index) => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            
            fileItem.innerHTML = `
                <div class="file-info">
                    <i class="fas fa-file-code"></i>
                    <span class="file-name">${file.name}</span>
                    <span class="file-size">(${this.formatFileSize(file.size)})</span>
                </div>
                <button type="button" class="file-remove" data-index="${index}">
                    <i class="fas fa-times"></i>
                </button>
            `;
            
            // Add remove event listener
            const removeBtn = fileItem.querySelector('.file-remove');
            removeBtn.addEventListener('click', () => this.removeFile(index));
            
            fileList.appendChild(fileItem);
        });
    }

    removeFile(index) {
        this.uploadedFiles.splice(index, 1);
        this.updateFileList();
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    resetUploadForm() {
        const form = document.getElementById('uploadForm');
        if (form) {
            form.reset();
            this.uploadedFiles = [];
            this.updateFileList();
        }
    }

    // Form Submission
    async handleUploadSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const title = formData.get('title');
        const description = formData.get('description');
        const language = formData.get('language');
        const difficulty = formData.get('difficulty');
        
        // Validation
        if (!title || !description || !language || !difficulty) {
            this.showNotification('Please fill in all required fields.', 'error');
            return;
        }
        
        if (this.uploadedFiles.length === 0) {
            this.showNotification('Please upload at least one file.', 'error');
            return;
        }
        
        // Add files to form data
        this.uploadedFiles.forEach(file => {
            formData.append('files[]', file);
        });
        
        try {
            this.setLoadingState(e.target, true);
            
            // Simulate API call
            await this.uploadExercise(formData);
            
            this.showNotification('Exercise uploaded successfully!', 'success');
            this.closeModal('uploadModal');
            this.refreshExercisesTab();
            
        } catch (error) {
            this.showNotification('Failed to upload exercise. Please try again.', 'error');
            console.error('Upload error:', error);
        } finally {
            this.setLoadingState(e.target, false);
        }
    }

    async uploadExercise(formData) {
        // Simulate API call with delay
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate success/failure
                if (Math.random() > 0.1) {
                    resolve({ success: true, id: Date.now() });
                } else {
                    reject(new Error('Upload failed'));
                }
            }, 2000);
        });
    }

    // Repository Connection
    async handleRepositoryConnect(provider) {
        try {
            this.showNotification(`Connecting to ${provider}...`, 'info');
            
            // Simulate OAuth flow
            await this.connectToRepository(provider);
            
            this.showNotification(`Successfully connected to ${provider}!`, 'success');
            this.closeModal('connectModal');
            
        } catch (error) {
            this.showNotification(`Failed to connect to ${provider}. Please try again.`, 'error');
            console.error('Connection error:', error);
        }
    }

    async connectToRepository(provider) {
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ connected: true, provider });
            }, 1500);
        });
    }

    // Assessment Actions
    handleAssessmentAction(action, card) {
        const title = card.querySelector('h3')?.textContent || 'Assessment';
        
        switch (action) {
            case 'start':
                this.startAssessment(card);
                break;
            case 'view-details':
                this.viewAssessmentDetails(card);
                break;
            case 'view-results':
                this.viewResults(card);
                break;
            case 'retake':
                this.retakeAssessment(card);
                break;
            case 'view-feedback':
                this.viewFeedback(card);
                break;
            case 'view-code':
                this.viewCode(card);
                break;
            case 'download':
                this.downloadExercise(card);
                break;
            case 'edit':
                this.editExercise(card);
                break;
            default:
                console.log('Unknown action:', action);
        }
    }

    getButtonAction(button) {
        const text = button.textContent.toLowerCase().trim();
        const icon = button.querySelector('i')?.classList;
        
        if (text.includes('start')) return 'start';
        if (text.includes('details')) return 'view-details';
        if (text.includes('results')) return 'view-results';
        if (text.includes('retake')) return 'retake';
        if (text.includes('feedback')) return 'view-feedback';
        if (text.includes('view code')) return 'view-code';
        if (text.includes('download')) return 'download';
        if (text.includes('edit')) return 'edit';
        
        // Fallback to icon detection
        if (icon?.contains('fa-play')) return 'start';
        if (icon?.contains('fa-info-circle')) return 'view-details';
        if (icon?.contains('fa-eye')) return 'view-results';
        if (icon?.contains('fa-redo')) return 'retake';
        if (icon?.contains('fa-download')) return 'download';
        if (icon?.contains('fa-edit')) return 'edit';
        
        return 'unknown';
    }

    startAssessment(card) {
        const title = card.querySelector('h3')?.textContent;
        this.showNotification(`Starting assessment: ${title}`, 'info');
        
        // Simulate navigation to assessment
        setTimeout(() => {
            this.showNotification('Assessment started! Good luck!', 'success');
        }, 1000);
    }

    viewAssessmentDetails(card) {
        const title = card.querySelector('h3')?.textContent;
        this.showNotification(`Viewing details for: ${title}`, 'info');
    }

    viewResults(card) {
        const title = card.querySelector('h3')?.textContent;
        this.showNotification(`Opening results for: ${title}`, 'info');
    }

    retakeAssessment(card) {
        const title = card.querySelector('h4')?.textContent;
        if (confirm(`Are you sure you want to retake: ${title}?`)) {
            this.showNotification(`Retaking assessment: ${title}`, 'info');
        }
    }

    viewFeedback(card) {
        const title = card.querySelector('h3')?.textContent;
        this.showNotification(`Loading feedback for: ${title}`, 'info');
    }

    viewCode(card) {
        const title = card.querySelector('h3')?.textContent;
        this.showNotification(`Opening code viewer for: ${title}`, 'info');
    }

    downloadExercise(card) {
        const title = card.querySelector('h3')?.textContent;
        this.showNotification(`Downloading: ${title}`, 'info');
        
        // Simulate download
        setTimeout(() => {
            this.showNotification('Download completed!', 'success');
        }, 1500);
    }

    editExercise(card) {
        const title = card.querySelector('h3')?.textContent;
        this.showNotification(`Opening editor for: ${title}`, 'info');
    }

    // Data Loading
    loadInitialData() {
        this.updateStats();
        this.loadTabData(this.currentTab);
    }

    loadTabData(tabName) {
        // Simulate loading different tab data
        switch (tabName) {
            case 'upcoming':
                this.loadUpcomingAssessments();
                break;
            case 'past':
                this.loadPastAssessments();
                break;
            case 'exercises':
                this.loadMyExercises();
                break;
        }
    }

    loadUpcomingAssessments() {
        // Data is already in HTML, but we could fetch fresh data here
        console.log('Loading upcoming assessments...');
    }

    loadPastAssessments() {
        // Data is already in HTML, but we could fetch fresh data here
        console.log('Loading past assessments...');
    }

    loadMyExercises() {
        // Data is already in HTML, but we could fetch fresh data here
        console.log('Loading my exercises...');
    }

    updateStats() {
        // Animate stat numbers
        const statNumbers = document.querySelectorAll('.stat-number');
        statNumbers.forEach(stat => {
            this.animateNumber(stat, parseInt(stat.textContent) || 0);
        });
    }

    animateNumber(element, target) {
        const start = 0;
        const duration = 1000;
        const startTime = Date.now();
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const current = Math.floor(start + (target - start) * progress);
            element.textContent = target.toString().includes('%') ? current + '%' : current;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        animate();
    }

    refreshExercisesTab() {
        if (this.currentTab === 'exercises') {
            this.loadMyExercises();
        }
    }

    // Logout
    handleLogout() {
        if (confirm('Are you sure you want to logout?')) {
            this.showNotification('Logging out...', 'info');
            
            setTimeout(() => {
                // Simulate logout redirect
                window.location.href = 'index.html';
            }, 1000);
        }
    }

    // UI Enhancements
    addHoverEffects() {
        // Add subtle animations to cards
        const cards = document.querySelectorAll('.assessment-card, .exercise-card, .stat-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-5px)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
            });
        });
    }

    handleResponsiveNav() {
        // Handle mobile navigation
        const navItems = document.querySelectorAll('.nav-item');
        
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    // Close mobile menu or handle mobile-specific behavior
                    console.log('Mobile nav clicked');
                }
            });
        });
    }

    initializeLoadingStates() {
        // Initialize loading spinners and states
        this.createLoadingSpinner();
    }

    createLoadingSpinner() {
        if (!document.querySelector('.spinner-template')) {
            const spinnerTemplate = document.createElement('div');
            spinnerTemplate.className = 'spinner-template';
            spinnerTemplate.innerHTML = '<div class="spinner"></div>';
            spinnerTemplate.style.display = 'none';
            document.body.appendChild(spinnerTemplate);
        }
    }

    setLoadingState(element, loading) {
        const button = element.querySelector('button[type="submit"]') || element;
        
        if (loading) {
            button.disabled = true;
            button.style.opacity = '0.6';
            
            const originalContent = button.innerHTML;
            button.setAttribute('data-original-content', originalContent);
            button.innerHTML = '<div class="spinner"></div> Processing...';
        } else {
            button.disabled = false;
            button.style.opacity = '1';
            
            const originalContent = button.getAttribute('data-original-content');
            if (originalContent) {
                button.innerHTML = originalContent;
                button.removeAttribute('data-original-content');
            }
        }
    }

    initializeAnimations() {
        // Add entrance animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, observerOptions);

        // Observe elements for animation
        const animatedElements = document.querySelectorAll('.assessment-card, .exercise-card, .stat-card');
        animatedElements.forEach(el => observer.observe(el));
    }

    // Notification System
    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        const icon = this.getNotificationIcon(type);
        
        notification.innerHTML = `
            <i class="${icon}"></i>
            <span>${message}</span>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;

        document.body.appendChild(notification);

        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        // Auto hide after 5 seconds
        setTimeout(() => {
            this.hideNotification(notification);
        }, 5000);

        // Close button event
        notification.querySelector('.notification-close').addEventListener('click', () => {
            this.hideNotification(notification);
        });
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle',
            warning: 'fas fa-exclamation-circle'
        };
        return icons[type] || icons.info;
    }

    hideNotification(notification) {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }

    // Utility Methods
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Initialize the Assessment Panel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.assessmentPanel = new AssessmentPanel();
});

// Handle window resize for responsive features
window.addEventListener('resize', () => {
    if (window.assessmentPanel) {
        window.assessmentPanel.handleResponsiveNav();
    }
});

// Handle visibility change to pause/resume animations
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause any ongoing animations or processes
        console.log('Page hidden - pausing processes');
    } else {
        // Resume animations or refresh data
        console.log('Page visible - resuming processes');
        if (window.assessmentPanel) {
            window.assessmentPanel.updateStats();
        }
    }
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AssessmentPanel;
}