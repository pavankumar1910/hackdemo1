// User Settings JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const elements = {
        // Profile elements
        changeAvatarBtn: document.getElementById('changeAvatarBtn'),
        profileImage: document.getElementById('profileImage'),
        fullNameInput: document.getElementById('fullName'),
        emailInput: document.getElementById('email'),
        bioInput: document.getElementById('bio'),
        skillInput: document.getElementById('skillInput'),
        addSkillBtn: document.getElementById('addSkillBtn'),
        skillsTags: document.getElementById('skillsTags'),
        updateProfileBtn: document.getElementById('updateProfileBtn'),
        cancelProfileBtn: document.getElementById('cancelProfileBtn'),

        // Assessment elements
        reassessBtn: document.getElementById('reassessBtn'),
        requestReviewBtn: document.getElementById('requestReviewBtn'),

        // Account elements
        currentPasswordInput: document.getElementById('currentPassword'),
        newPasswordInput: document.getElementById('newPassword'),
        confirmPasswordInput: document.getElementById('confirmPassword'),
        changePasswordBtn: document.getElementById('changePasswordBtn'),

        // Modal elements
        confirmModal: document.getElementById('confirmModal'),
        modalTitle: document.getElementById('modalTitle'),
        modalMessage: document.getElementById('modalMessage'),
        modalClose: document.getElementById('modalClose'),
        modalCancel: document.getElementById('modalCancel'),
        modalConfirm: document.getElementById('modalConfirm'),

        // Toast elements
        successToast: document.getElementById('successToast'),
        toastMessage: document.getElementById('toastMessage'),

        // Logout button
        logoutBtn: document.getElementById('logoutBtn')
    };

    // Store original profile data for cancel functionality
    let originalProfileData = {
        fullName: elements.fullNameInput.value,
        email: elements.emailInput.value,
        bio: elements.bioInput.value,
        skills: Array.from(elements.skillsTags.children).map(tag => 
            tag.textContent.trim().replace('×', '').trim()
        )
    };

    // Current action for modal confirmation
    let currentAction = null;

    // Profile Management
    function initializeProfileHandlers() {
        // Change Avatar
        elements.changeAvatarBtn.addEventListener('click', function() {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = function(e) {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        elements.profileImage.src = e.target.result;
                        showToast('Profile photo updated successfully!');
                    };
                    reader.readAsDataURL(file);
                }
            };
            input.click();
        });

        // Add Skill
        elements.addSkillBtn.addEventListener('click', addSkill);
        elements.skillInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                addSkill();
            }
        });

        // Update Profile
        elements.updateProfileBtn.addEventListener('click', function() {
            if (validateProfileForm()) {
                showConfirmModal(
                    'Update Profile',
                    'Are you sure you want to update your profile information?',
                    updateProfile
                );
            }
        });

        // Cancel Profile Changes
        elements.cancelProfileBtn.addEventListener('click', function() {
            showConfirmModal(
                'Cancel Changes',
                'Are you sure you want to discard all changes?',
                cancelProfileChanges
            );
        });
    }

    function addSkill() {
        const skillText = elements.skillInput.value.trim();
        if (skillText && !isSkillExists(skillText)) {
            const skillTag = createSkillTag(skillText);
            elements.skillsTags.appendChild(skillTag);
            elements.skillInput.value = '';
            elements.skillInput.focus();
        } else if (isSkillExists(skillText)) {
            showToast('Skill already exists!', 'error');
        }
    }

    function isSkillExists(skillText) {
        const existingSkills = Array.from(elements.skillsTags.children);
        return existingSkills.some(tag => 
            tag.textContent.trim().replace('×', '').trim().toLowerCase() === skillText.toLowerCase()
        );
    }

    function createSkillTag(skillText) {
        const skillTag = document.createElement('span');
        skillTag.className = 'skill-tag';
        skillTag.innerHTML = `
            ${skillText} 
            <button class="remove-skill">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Add remove functionality
        const removeBtn = skillTag.querySelector('.remove-skill');
        removeBtn.addEventListener('click', function() {
            skillTag.remove();
        });
        
        return skillTag;
    }

    function validateProfileForm() {
        const fullName = elements.fullNameInput.value.trim();
        const email = elements.emailInput.value.trim();
        
        if (!fullName) {
            showToast('Please enter your full name', 'error');
            elements.fullNameInput.focus();
            return false;
        }
        
        if (!email || !isValidEmail(email)) {
            showToast('Please enter a valid email address', 'error');
            elements.emailInput.focus();
            return false;
        }
        
        return true;
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function updateProfile() {
        // Simulate API call
        setTimeout(() => {
            // Update original data to current values
            originalProfileData = {
                fullName: elements.fullNameInput.value,
                email: elements.emailInput.value,
                bio: elements.bioInput.value,
                skills: Array.from(elements.skillsTags.children).map(tag => 
                    tag.textContent.trim().replace('×', '').trim()
                )
            };
            
            showToast('Profile updated successfully!');
        }, 1000);
    }

    function cancelProfileChanges() {
        // Restore original values
        elements.fullNameInput.value = originalProfileData.fullName;
        elements.emailInput.value = originalProfileData.email;
        elements.bioInput.value = originalProfileData.bio;
        
        // Restore skills
        elements.skillsTags.innerHTML = '';
        originalProfileData.skills.forEach(skill => {
            if (skill) {
                const skillTag = createSkillTag(skill);
                elements.skillsTags.appendChild(skillTag);
            }
        });
        
        showToast('Changes discarded');
    }

    // Assessment Management
    function initializeAssessmentHandlers() {
        // Re-assess Skills
        elements.reassessBtn.addEventListener('click', function() {
            showConfirmModal(
                'Re-assess Skills',
                'This will start a new complete skill assessment. Your current progress will be saved. This process may take 30-45 minutes. Are you ready to begin?',
                startReassessment
            );
        });

        // Request Manual Review
        elements.requestReviewBtn.addEventListener('click', function() {
            showConfirmModal(
                'Request Manual Review',
                'A human expert will manually review your skills and provide detailed feedback. This process typically takes 2-3 business days. Continue?',
                requestManualReview
            );
        });
    }

    function startReassessment() {
        // Simulate starting reassessment
        showToast('Redirecting to skill assessment...', 'info');
        
        setTimeout(() => {
            // Update assessment status
            updateAssessmentStatus('In Progress');
            showToast('Assessment started successfully!');
            
            // In a real application, redirect to assessment page
            // window.location.href = 'uassignment.html';
        }, 2000);
    }

    function requestManualReview() {
        // Simulate requesting manual review
        showToast('Processing review request...', 'info');
        
        setTimeout(() => {
            updateAssessmentStatus('Under Review');
            showToast('Manual review requested successfully! You will be notified when the review is complete.');
        }, 1500);
    }

    function updateAssessmentStatus(status) {
        const statusDot = document.querySelector('.status-dot');
        const statusText = document.querySelector('.status-text');
        const lastAssessment = document.querySelector('.last-assessment span');
        
        if (status === 'In Progress') {
            statusDot.classList.remove('active');
            statusDot.style.background = '#f59e0b';
            statusText.textContent = 'Assessment Status: In Progress';
            lastAssessment.textContent = 'Assessment started: ' + new Date().toLocaleDateString();
        } else if (status === 'Under Review') {
            statusDot.classList.remove('active');
            statusDot.style.background = '#3b82f6';
            statusText.textContent = 'Assessment Status: Under Manual Review';
            lastAssessment.textContent = 'Review requested: ' + new Date().toLocaleDateString();
        }
    }

    // Account & Security Management
    function initializeAccountHandlers() {
        // Change Password
        elements.changePasswordBtn.addEventListener('click', function() {
            if (validatePasswordForm()) {
                showConfirmModal(
                    'Change Password',
                    'Are you sure you want to change your password?',
                    changePassword
                );
            }
        });
    }

    function validatePasswordForm() {
        const currentPassword = elements.currentPasswordInput.value;
        const newPassword = elements.newPasswordInput.value;
        const confirmPassword = elements.confirmPasswordInput.value;
        
        if (!currentPassword) {
            showToast('Please enter your current password', 'error');
            elements.currentPasswordInput.focus();
            return false;
        }
        
        if (!newPassword) {
            showToast('Please enter a new password', 'error');
            elements.newPasswordInput.focus();
            return false;
        }
        
        if (newPassword.length < 8) {
            showToast('New password must be at least 8 characters long', 'error');
            elements.newPasswordInput.focus();
            return false;
        }
        
        if (newPassword !== confirmPassword) {
            showToast('Passwords do not match', 'error');
            elements.confirmPasswordInput.focus();
            return false;
        }
        
        return true;
    }

    function changePassword() {
        // Simulate password change
        showToast('Changing password...', 'info');
        
        setTimeout(() => {
            // Clear password fields
            elements.currentPasswordInput.value = '';
            elements.newPasswordInput.value = '';
            elements.confirmPasswordInput.value = '';
            
            showToast('Password changed successfully!');
        }, 1500);
    }

    // Modal Management
    function initializeModalHandlers() {
        // Close modal handlers
        elements.modalClose.addEventListener('click', closeModal);
        elements.modalCancel.addEventListener('click', closeModal);
        
        // Confirm action
        elements.modalConfirm.addEventListener('click', function() {
            if (currentAction) {
                currentAction();
                currentAction = null;
            }
            closeModal();
        });

        // Close modal when clicking outside
        elements.confirmModal.addEventListener('click', function(e) {
            if (e.target === elements.confirmModal) {
                closeModal();
            }
        });

        // Close modal with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && elements.confirmModal.style.display === 'block') {
                closeModal();
            }
        });
    }

    function showConfirmModal(title, message, action) {
        elements.modalTitle.textContent = title;
        elements.modalMessage.textContent = message;
        currentAction = action;
        elements.confirmModal.style.display = 'block';
        
        // Focus on confirm button for accessibility
        setTimeout(() => elements.modalConfirm.focus(), 100);
    }

    function closeModal() {
        elements.confirmModal.style.display = 'none';
        currentAction = null;
    }

    // Toast Management
    function showToast(message, type = 'success') {
        elements.toastMessage.textContent = message;
        
        // Update toast styling based on type
        elements.successToast.className = `toast ${type}-toast`;
        if (type === 'error') {
            elements.successToast.style.borderLeftColor = '#ef4444';
            elements.successToast.querySelector('i').style.color = '#ef4444';
        } else if (type === 'info') {
            elements.successToast.style.borderLeftColor = '#3b82f6';
            elements.successToast.querySelector('i').style.color = '#3b82f6';
        } else {
            elements.successToast.style.borderLeftColor = '#10b981';
            elements.successToast.querySelector('i').style.color = '#10b981';
        }
        
        elements.successToast.classList.add('show');
        
        // Auto-hide toast after 3 seconds
        setTimeout(() => {
            elements.successToast.classList.remove('show');
        }, 3000);
    }

    // Logout Management
    function initializeLogoutHandler() {
        elements.logoutBtn.addEventListener('click', function() {
            showConfirmModal(
                'Logout',
                'Are you sure you want to logout?',
                logout
            );
        });
    }

    function logout() {
        showToast('Logging out...', 'info');
        
        setTimeout(() => {
            // In a real application, clear session and redirect
            // sessionStorage.clear();
            // localStorage.clear();
            // window.location.href = 'login.html';
            showToast('Logged out successfully!');
        }, 1000);
    }

    // Preference Toggles Management
    function initializePreferenceHandlers() {
        const toggles = document.querySelectorAll('.switch input[type="checkbox"]');
        
        toggles.forEach(toggle => {
            toggle.addEventListener('change', function() {
                const preferenceTitle = this.closest('.preference-item')
                    .querySelector('.preference-title').textContent;
                const status = this.checked ? 'enabled' : 'disabled';
                
                // Simulate saving preference
                setTimeout(() => {
                    showToast(`${preferenceTitle} ${status}`, 'info');
                }, 200);
            });
        });
    }

    // Form Input Enhancements
    function initializeFormEnhancements() {
        // Add input validation feedback
        const inputs = document.querySelectorAll('.form-input, .form-textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateInput(this);
            });
            
            input.addEventListener('input', function() {
                // Remove error styling when user starts typing
                this.style.borderColor = '';
            });
        });
    }

    function validateInput(input) {
        const value = input.value.trim();
        
        if (input.hasAttribute('required') && !value) {
            input.style.borderColor = '#ef4444';
            return false;
        }
        
        if (input.type === 'email' && value && !isValidEmail(value)) {
            input.style.borderColor = '#ef4444';
            return false;
        }
        
        input.style.borderColor = '#10b981';
        return true;
    }

    // Auto-save functionality for certain fields
    function initializeAutoSave() {
        const autoSaveFields = ['bio'];
        
        autoSaveFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                let saveTimeout;
                
                field.addEventListener('input', function() {
                    clearTimeout(saveTimeout);
                    
                    // Auto-save after 2 seconds of no typing
                    saveTimeout = setTimeout(() => {
                        // Simulate auto-save
                        showToast('Bio auto-saved', 'info');
                    }, 2000);
                });
            }
        });
    }

    // Keyboard Shortcuts
    function initializeKeyboardShortcuts() {
        document.addEventListener('keydown', function(e) {
            // Ctrl/Cmd + S to save profile
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                if (elements.updateProfileBtn && validateProfileForm()) {
                    updateProfile();
                }
            }
            
            // Ctrl/Cmd + R to start reassessment
            if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
                e.preventDefault();
                elements.reassessBtn.click();
            }
        });
    }

    // Initialize all handlers
    function initialize() {
        initializeProfileHandlers();
        initializeAssessmentHandlers();
        initializeAccountHandlers();
        initializeModalHandlers();
        initializeLogoutHandler();
        initializePreferenceHandlers();
        initializeFormEnhancements();
        initializeAutoSave();
        initializeKeyboardShortcuts();
        
        // Add loading states for buttons
        addButtonLoadingStates();
        
        console.log('User Settings page initialized successfully');
    }

    // Add loading states for buttons
    function addButtonLoadingStates() {
        const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .btn-change-password');
        
        buttons.forEach(button => {
            button.addEventListener('click', function() {
                if (!this.disabled) {
                    const originalText = this.innerHTML;
                    this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
                    this.disabled = true;
                    
                    // Re-enable button after action completes
                    setTimeout(() => {
                        this.innerHTML = originalText;
                        this.disabled = false;
                    }, 2000);
                }
            });
        });
    }

    // Initialize the application
    initialize();

    // Expose some functions globally for debugging (remove in production)
    window.settingsDebug = {
        showToast,
        showConfirmModal,
        updateAssessmentStatus
    };
});