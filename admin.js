// Admin Dashboard JavaScript
class AdminDashboard {
    constructor() {
        this.users = [];
        this.hackathons = [];
        this.workflowStages = [
            { id: 'profile', name: 'Profile Loaded', icon: 'fas fa-user' },
            { id: 'assessment', name: 'Assessment Completed', icon: 'fas fa-clipboard-check' },
            { id: 'skills', name: 'Skills Evaluated', icon: 'fas fa-brain' },
            { id: 'path', name: 'Learning Path Generated', icon: 'fas fa-route' }
        ];
        this.currentSection = 'dashboard';
        this.init();
    }

    init() {
        this.generateSampleData();
        this.setupEventListeners();
        this.populateUserTable();
        this.updateWorkflowProgress();
        this.updateDashboardStats();
        this.populateHackathons();
        this.startRealTimeUpdates();
    }

    generateSampleData() {
        // Generate sample users
        const skills = ['JavaScript', 'React', 'Node.js', 'Python', 'Java', 'Angular', 'Vue.js', 'PHP'];
        const paths = ['Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'Data Scientist'];
        const names = ['John Doe', 'Sarah Wilson', 'Mike Johnson', 'Emily Davis', 'Chris Brown', 'Lisa Garcia', 'David Miller', 'Anna Taylor'];

        this.users = names.map((name, index) => ({
            id: index + 1,
            name: name,
            email: name.toLowerCase().replace(' ', '.') + '@email.com',
            skills: this.getRandomSkills(skills, 2, 4),
            assessmentScore: Math.floor(Math.random() * 40) + 60,
            learningPath: paths[Math.floor(Math.random() * paths.length)],
            lastUpdated: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
            workflowStatus: {
                profile: { completed: true, timestamp: new Date(Date.now() - Math.random() * 2 * 60 * 60 * 1000), details: 'Profile loaded successfully' },
                assessment: { completed: Math.random() > 0.2, timestamp: new Date(Date.now() - Math.random() * 1 * 60 * 60 * 1000), details: `Assessment took ${Math.floor(Math.random() * 20) + 10} minutes` },
                skills: { completed: Math.random() > 0.3, timestamp: new Date(Date.now() - Math.random() * 30 * 60 * 1000), details: `Score: ${Math.floor(Math.random() * 40) + 60}%` },
                path: { completed: Math.random() > 0.4, timestamp: new Date(Date.now() - Math.random() * 15 * 60 * 1000), details: 'Learning path generated' }
            }
        }));

        // Generate sample hackathons
        this.hackathons = [
            {
                id: 1,
                name: 'Web Innovation Challenge',
                description: 'Build innovative web applications using modern technologies',
                startDate: new Date('2025-08-01'),
                endDate: new Date('2025-08-15'),
                maxParticipants: 100,
                currentParticipants: 78,
                status: 'active',
                submissions: 45
            },
            {
                id: 2,
                name: 'AI/ML Hackathon',
                description: 'Create AI-powered solutions for real-world problems',
                startDate: new Date('2025-08-10'),
                endDate: new Date('2025-08-20'),
                maxParticipants: 80,
                currentParticipants: 23,
                status: 'upcoming',
                submissions: 0
            },
            {
                id: 3,
                name: 'Mobile App Contest',
                description: 'Develop mobile applications for iOS and Android',
                startDate: new Date('2025-07-15'),
                endDate: new Date('2025-07-20'),
                maxParticipants: 60,
                currentParticipants: 60,
                status: 'completed',
                submissions: 42
            }
        ];
    }

    getRandomSkills(skillsArray, min, max) {
        const count = Math.floor(Math.random() * (max - min + 1)) + min;
        const shuffled = [...skillsArray].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = e.currentTarget.dataset.section;
                this.showSection(section);
            });
        });

        // User search and filters
        const userSearch = document.getElementById('userSearch');
        if (userSearch) {
            userSearch.addEventListener('input', () => this.filterUsers());
        }

        const filters = ['skillFilter', 'scoreFilter', 'pathFilter'];
        filters.forEach(filterId => {
            const filter = document.getElementById(filterId);
            if (filter) {
                filter.addEventListener('change', () => this.filterUsers());
            }
        });

        // Modal controls
        document.querySelectorAll('.modal-close').forEach(closeBtn => {
            closeBtn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                if (modal) this.closeModal(modal.id);
            });
        });

        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                if (confirm('Are you sure you want to logout?')) {
                    alert('Logged out successfully');
                     window.location.href = 'index.html';
                }
            });
        }

        // Add user button
        const addUserBtn = document.getElementById('addUserBtn');
        if (addUserBtn) {
            addUserBtn.addEventListener('click', () => this.showAddUserModal());
        }

        // Create hackathon button
        const createHackathonBtn = document.getElementById('createHackathonBtn');
        if (createHackathonBtn) {
            createHackathonBtn.addEventListener('click', () => this.openModal('createHackathonModal'));
        }

        // Refresh workflow
        const refreshWorkflow = document.getElementById('refreshWorkflow');
        if (refreshWorkflow) {
            refreshWorkflow.addEventListener('click', () => this.refreshWorkflowData());
        }

        // Export report
        const exportReportBtn = document.getElementById('exportReportBtn');
        if (exportReportBtn) {
            exportReportBtn.addEventListener('click', () => this.exportReport());
        }

        // Create hackathon form
        const createHackathonForm = document.getElementById('createHackathonForm');
        if (createHackathonForm) {
            createHackathonForm.addEventListener('submit', (e) => this.handleCreateHackathon(e));
        }
    }

    showSection(sectionName) {
        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
        document.querySelectorAll('.section-content').forEach(content => content.classList.remove('active'));

        const activeNavItem = document.querySelector(`[data-section="${sectionName}"]`).parentElement;
        const activeContent = document.getElementById(`${sectionName}-content`);

        if (activeNavItem) activeNavItem.classList.add('active');
        if (activeContent) activeContent.classList.add('active');

        this.currentSection = sectionName;

        // Load section-specific data
        switch (sectionName) {
            case 'users':
                this.populateUserTable();
                break;
            case 'workflow':
                this.updateWorkflowProgress();
                this.populateActiveWorkflows();
                break;
            case 'hackathons':
                this.populateHackathons();
                break;
            case 'reports':
                this.loadReportsData();
                break;
        }
    }

    populateUserTable() {
        const tbody = document.getElementById('userTableBody');
        if (!tbody) return;

        tbody.innerHTML = '';

        this.users.forEach(user => {
            const row = document.createElement('tr');
            row.className = 'user-row';
            row.dataset.userId = user.id;
            
            row.innerHTML = `
                <td>
                    <div class="user-info">
                        <div class="user-avatar">
                            <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random&size=32" alt="${user.name}">
                        </div>
                        <span class="user-name">${user.name}</span>
                    </div>
                </td>
                <td>${user.email}</td>
                <td>
                    <div class="skill-tags">
                        ${user.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                    </div>
                </td>
                <td>
                    <div class="score-badge ${this.getScoreClass(user.assessmentScore)}">
                        ${user.assessmentScore}%
                    </div>
                </td>
                <td>
                    <span class="learning-path">${user.learningPath}</span>
                </td>
                <td>${this.formatDate(user.lastUpdated)}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-icon" onclick="adminDashboard.viewUserDetails(${user.id})" title="View Details">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-icon" onclick="adminDashboard.reassessUser(${user.id})" title="Re-assess">
                            <i class="fas fa-redo"></i>
                        </button>
                        <button class="btn-icon" onclick="adminDashboard.updateUserProfile(${user.id})" title="Update Profile">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon" onclick="adminDashboard.generateUserReport(${user.id})" title="Generate Report">
                            <i class="fas fa-file-alt"></i>
                        </button>
                    </div>
                </td>
            `;

            // Add click event for row expansion
            row.addEventListener('click', (e) => {
                if (!e.target.closest('.action-buttons')) {
                    this.toggleUserDetails(user.id, row);
                }
            });

            tbody.appendChild(row);
        });
    }

    toggleUserDetails(userId, row) {
        const existingDetails = row.nextElementSibling;
        
        if (existingDetails && existingDetails.classList.contains('user-details-row')) {
            existingDetails.remove();
            row.classList.remove('expanded');
            return;
        }

        // Remove any other expanded rows
        document.querySelectorAll('.user-details-row').forEach(detailRow => detailRow.remove());
        document.querySelectorAll('.user-row').forEach(userRow => userRow.classList.remove('expanded'));

        const user = this.users.find(u => u.id === userId);
        if (!user) return;

        const detailsRow = document.createElement('tr');
        detailsRow.className = 'user-details-row';
        detailsRow.innerHTML = `
            <td colspan="7">
                <div class="user-details-panel">
                    <div class="workflow-progress-container">
                        <h4>Workflow Progress</h4>
                        <div class="user-workflow-progress">
                            ${this.renderUserWorkflowProgress(user)}
                        </div>
                    </div>
                    <div class="user-metadata">
                        <h4>User Metadata</h4>
                        <div class="metadata-grid">
                            <div class="metadata-item">
                                <span class="metadata-label">User ID:</span>
                                <span class="metadata-value">${user.id}</span>
                            </div>
                            <div class="metadata-item">
                                <span class="metadata-label">Registration:</span>
                                <span class="metadata-value">${this.formatDate(user.lastUpdated)}</span>
                            </div>
                            <div class="metadata-item">
                                <span class="metadata-label">Assessment Score:</span>
                                <span class="metadata-value">${user.assessmentScore}%</span>
                            </div>
                            <div class="metadata-item">
                                <span class="metadata-label">Learning Path:</span>
                                <span class="metadata-value">${user.learningPath}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </td>
        `;

        row.parentNode.insertBefore(detailsRow, row.nextSibling);
        row.classList.add('expanded');
    }

    renderUserWorkflowProgress(user) {
        return this.workflowStages.map(stage => {
            const status = user.workflowStatus[stage.id];
            const isCompleted = status && status.completed;
            const timestamp = status && status.timestamp ? this.formatTimestamp(status.timestamp) : '';
            const details = status && status.details ? status.details : '';

            return `
                <div class="workflow-node ${isCompleted ? 'completed' : 'pending'}" 
                     title="${details}${timestamp ? ' - ' + timestamp : ''}">
                    <div class="node-icon">
                        <i class="${stage.icon}"></i>
                    </div>
                    <div class="node-label">${stage.name}</div>
                    <div class="node-timestamp">${timestamp}</div>
                </div>
            `;
        }).join('');
    }

    updateWorkflowProgress() {
        const progressBar = document.getElementById('workflowProgressBar');
        if (!progressBar) return;

        const stats = this.calculateWorkflowStats();
        
        progressBar.innerHTML = this.workflowStages.map(stage => {
            const count = stats[stage.id] || 0;
            const percentage = this.users.length > 0 ? (count / this.users.length * 100).toFixed(1) : 0;
            
            return `
                <div class="workflow-stage-overview">
                    <div class="stage-icon ${count > 0 ? 'has-data' : ''}">
                        <i class="${stage.icon}"></i>
                    </div>
                    <div class="stage-info">
                        <div class="stage-name">${stage.name}</div>
                        <div class="stage-stats">
                            <span class="stage-count">${count}</span>
                            <span class="stage-percentage">(${percentage}%)</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    populateActiveWorkflows() {
        const workflowList = document.getElementById('workflowList');
        if (!workflowList) return;

        const activeUsers = this.users.filter(user => {
            const stages = Object.values(user.workflowStatus);
            return stages.some(stage => !stage.completed);
        });

        workflowList.innerHTML = activeUsers.map(user => {
            const currentStage = this.getCurrentWorkflowStage(user);
            return `
                <div class="workflow-item">
                    <div class="workflow-user">
                        <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random&size=32" alt="${user.name}">
                        <div class="user-details">
                            <div class="user-name">${user.name}</div>
                            <div class="user-email">${user.email}</div>
                        </div>
                    </div>
                    <div class="workflow-status">
                        <div class="current-stage">
                            <i class="${currentStage.icon}"></i>
                            <span>${currentStage.name}</span>
                        </div>
                        <div class="workflow-progress-mini">
                            ${this.renderMiniWorkflowProgress(user)}
                        </div>
                    </div>
                    <div class="workflow-actions">
                        <button class="btn-small btn-primary" onclick="adminDashboard.viewUserDetails(${user.id})">
                            View Details
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    getCurrentWorkflowStage(user) {
        for (let stage of this.workflowStages) {
            if (!user.workflowStatus[stage.id].completed) {
                return stage;
            }
        }
        return this.workflowStages[this.workflowStages.length - 1]; // All completed
    }

    renderMiniWorkflowProgress(user) {
        return this.workflowStages.map(stage => {
            const isCompleted = user.workflowStatus[stage.id].completed;
            return `<div class="mini-node ${isCompleted ? 'completed' : 'pending'}"></div>`;
        }).join('');
    }

    calculateWorkflowStats() {
        const stats = {};
        this.workflowStages.forEach(stage => {
            stats[stage.id] = this.users.filter(user => 
                user.workflowStatus[stage.id] && user.workflowStatus[stage.id].completed
            ).length;
        });
        return stats;
    }

    updateDashboardStats() {
        // Update total users
        const totalUsersEl = document.querySelector('.stats-card .stat-number');
        if (totalUsersEl) {
            totalUsersEl.textContent = this.users.length.toLocaleString();
        }

        // Update active assessments
        const activeAssessments = this.users.filter(user => 
            user.workflowStatus.assessment.completed && !user.workflowStatus.path.completed
        ).length;
        
        const assessmentEls = document.querySelectorAll('.stats-card .stat-number');
        if (assessmentEls[1]) {
            assessmentEls[1].textContent = activeAssessments;
        }

        // Update live hackathons
        const liveHackathons = this.hackathons.filter(h => h.status === 'active').length;
        if (assessmentEls[2]) {
            assessmentEls[2].textContent = liveHackathons;
        }

        // Update recent activity
        this.updateRecentActivity();
    }

    updateRecentActivity() {
        const activityList = document.querySelector('.activity-list');
        if (!activityList) return;

        const activities = [
            {
                type: 'user',
                icon: 'fas fa-user-plus',
                text: `New user registered: ${this.users[this.users.length - 1]?.email}`,
                time: '2 minutes ago'
            },
            {
                type: 'assessment',
                icon: 'fas fa-clipboard-check',
                text: `Assessment completed by ${this.users[Math.floor(Math.random() * this.users.length)].name.split(' ')[0].toLowerCase()}`,
                time: '5 minutes ago'
            },
            {
                type: 'hackathon',
                icon: 'fas fa-trophy',
                text: 'New hackathon submission received',
                time: '12 minutes ago'
            }
        ];

        activityList.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon ${activity.type}-action">
                    <i class="${activity.icon}"></i>
                </div>
                <div class="activity-content">
                    <span class="activity-text">${activity.text}</span>
                    <span class="activity-time">${activity.time}</span>
                </div>
            </div>
        `).join('');
    }

    populateHackathons() {
        const hackathonGrid = document.getElementById('hackathonGrid');
        if (!hackathonGrid) return;

        hackathonGrid.innerHTML = this.hackathons.map(hackathon => `
            <div class="hackathon-card ${hackathon.status}">
                <div class="hackathon-header">
                    <h3>${hackathon.name}</h3>
                    <span class="status-badge ${hackathon.status}">${hackathon.status}</span>
                </div>
                <div class="hackathon-body">
                    <p>${hackathon.description}</p>
                    <div class="hackathon-dates">
                        <div class="date-item">
                            <i class="fas fa-calendar-start"></i>
                            <span>Start: ${this.formatDate(hackathon.startDate)}</span>
                        </div>
                        <div class="date-item">
                            <i class="fas fa-calendar-end"></i>
                            <span>End: ${this.formatDate(hackathon.endDate)}</span>
                        </div>
                    </div>
                    <div class="participant-info">
                        <div class="participants">
                            <i class="fas fa-users"></i>
                            <span>${hackathon.currentParticipants}/${hackathon.maxParticipants} participants</span>
                        </div>
                        <div class="submissions">
                            <i class="fas fa-file-upload"></i>
                            <span>${hackathon.submissions} submissions</span>
                        </div>
                    </div>
                </div>
                <div class="hackathon-actions">
                    <button class="btn-secondary" onclick="adminDashboard.viewHackathonDetails(${hackathon.id})">
                        View Details
                    </button>
                    <button class="btn-primary" onclick="adminDashboard.manageHackathon(${hackathon.id})">
                        Manage
                    </button>
                </div>
            </div>
        `).join('');
    }

    filterUsers() {
        const searchTerm = document.getElementById('userSearch')?.value.toLowerCase() || '';
        const skillFilter = document.getElementById('skillFilter')?.value || '';
        const scoreFilter = document.getElementById('scoreFilter')?.value || '';
        const pathFilter = document.getElementById('pathFilter')?.value || '';

        const filteredUsers = this.users.filter(user => {
            const matchesSearch = user.name.toLowerCase().includes(searchTerm) || 
                                user.email.toLowerCase().includes(searchTerm);
            
            const matchesSkill = !skillFilter || 
                               user.skills.some(skill => skill.toLowerCase().includes(skillFilter.toLowerCase()));
            
            const matchesScore = !scoreFilter || this.checkScoreRange(user.assessmentScore, scoreFilter);
            
            const matchesPath = !pathFilter || 
                              user.learningPath.toLowerCase().includes(pathFilter.toLowerCase());

            return matchesSearch && matchesSkill && matchesScore && matchesPath;
        });

        this.displayFilteredUsers(filteredUsers);
    }

    checkScoreRange(score, range) {
        switch (range) {
            case '90-100': return score >= 90 && score <= 100;
            case '80-89': return score >= 80 && score < 90;
            case '70-79': return score >= 70 && score < 80;
            case '0-69': return score < 70;
            default: return true;
        }
    }

    displayFilteredUsers(users) {
        const tbody = document.getElementById('userTableBody');
        if (!tbody) return;

        tbody.innerHTML = '';
        
        users.forEach(user => {
            const row = document.createElement('tr');
            row.className = 'user-row';
            row.dataset.userId = user.id;
            
            row.innerHTML = `
                <td>
                    <div class="user-info">
                        <div class="user-avatar">
                            <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random&size=32" alt="${user.name}">
                        </div>
                        <span class="user-name">${user.name}</span>
                    </div>
                </td>
                <td>${user.email}</td>
                <td>
                    <div class="skill-tags">
                        ${user.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                    </div>
                </td>
                <td>
                    <div class="score-badge ${this.getScoreClass(user.assessmentScore)}">
                        ${user.assessmentScore}%
                    </div>
                </td>
                <td>
                    <span class="learning-path">${user.learningPath}</span>
                </td>
                <td>${this.formatDate(user.lastUpdated)}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-icon" onclick="adminDashboard.viewUserDetails(${user.id})" title="View Details">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-icon" onclick="adminDashboard.reassessUser(${user.id})" title="Re-assess">
                            <i class="fas fa-redo"></i>
                        </button>
                        <button class="btn-icon" onclick="adminDashboard.updateUserProfile(${user.id})" title="Update Profile">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon" onclick="adminDashboard.generateUserReport(${user.id})" title="Generate Report">
                            <i class="fas fa-file-alt"></i>
                        </button>
                    </div>
                </td>
            `;

            row.addEventListener('click', (e) => {
                if (!e.target.closest('.action-buttons')) {
                    this.toggleUserDetails(user.id, row);
                }
            });

            tbody.appendChild(row);
        });
    }

    // Manual Override Functions
    viewUserDetails(userId) {
        const user = this.users.find(u => u.id === userId);
        if (!user) return;

        const modal = document.getElementById('userDetailsModal');
        const content = document.getElementById('userDetailsContent');
        
        if (modal && content) {
            content.innerHTML = `
                <div class="user-details-full">
                    <div class="user-header">
                        <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random&size=64" alt="${user.name}">
                        <div class="user-info">
                            <h3>${user.name}</h3>
                            <p>${user.email}</p>
                        </div>
                    </div>
                    <div class="user-workflow-full">
                        <h4>Workflow Progress</h4>
                        <div class="workflow-timeline">
                            ${this.renderFullWorkflowTimeline(user)}
                        </div>
                    </div>
                    <div class="user-details-grid">
                        <div class="detail-section">
                            <h4>Skills</h4>
                            <div class="skill-tags">
                                ${user.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                            </div>
                        </div>
                        <div class="detail-section">
                            <h4>Assessment</h4>
                            <div class="score-display">
                                <div class="score-circle ${this.getScoreClass(user.assessmentScore)}">
                                    ${user.assessmentScore}%
                                </div>
                            </div>
                        </div>
                        <div class="detail-section">
                            <h4>Learning Path</h4>
                            <p class="learning-path-desc">${user.learningPath}</p>
                        </div>
                    </div>
                </div>
            `;
            this.openModal('userDetailsModal');
        }
    }

    renderFullWorkflowTimeline(user) {
        return this.workflowStages.map(stage => {
            const status = user.workflowStatus[stage.id];
            const isCompleted = status && status.completed;
            
            return `
                <div class="timeline-item ${isCompleted ? 'completed' : 'pending'}">
                    <div class="timeline-marker">
                        <i class="${stage.icon}"></i>
                    </div>
                    <div class="timeline-content">
                        <h5>${stage.name}</h5>
                        <p class="timeline-details">${status.details || 'Pending'}</p>
                        <span class="timeline-time">
                            ${status.timestamp ? this.formatTimestamp(status.timestamp) : 'Not started'}
                        </span>
                    </div>
                </div>
            `;
        }).join('');
    }

    reassessUser(userId) {
        const user = this.users.find(u => u.id === userId);
        if (!user) return;

        if (confirm(`Re-assess ${user.name}? This will reset their assessment progress.`)) {
            // Reset assessment status
            user.workflowStatus.assessment.completed = false;
            user.workflowStatus.skills.completed = false;
            user.workflowStatus.path.completed = false;
            
            // Simulate re-assessment process
            setTimeout(() => {
                user.workflowStatus.assessment.completed = true;
                user.workflowStatus.assessment.timestamp = new Date();
                user.assessmentScore = Math.floor(Math.random() * 40) + 60;
                this.populateUserTable();
                this.updateWorkflowProgress();
                alert(`Re-assessment completed for ${user.name}. New score: ${user.assessmentScore}%`);
            }, 2000);

            alert(`Re-assessment started for ${user.name}...`);
            this.populateUserTable();
        }
    }

    updateUserProfile(userId) {
        const user = this.users.find(u => u.id === userId);
        if (!user) return;

        const newName = prompt('Enter new name:', user.name);
        if (newName && newName.trim()) {
            user.name = newName.trim();
            user.lastUpdated = new Date();
            this.populateUserTable();
            alert('User profile updated successfully!');
        }
    }

    generateUserReport(userId) {
        const user = this.users.find(u => u.id === userId);
        if (!user) return;

        const completedStages = Object.values(user.workflowStatus).filter(stage => stage.completed).length;
        const progressPercentage = (completedStages / this.workflowStages.length * 100).toFixed(1);

        const reportData = {
            user: user,
            generatedAt: new Date(),
            workflowProgress: progressPercentage,
            completedStages: completedStages,
            totalStages: this.workflowStages.length
        };

        // Simulate report generation
        const reportContent = `
=== USER REPORT ===
Name: ${user.name}
Email: ${user.email}
Assessment Score: ${user.assessmentScore}%
Learning Path: ${user.learningPath}
Skills: ${user.skills.join(', ')}
Workflow Progress: ${progressPercentage}% (${completedStages}/${this.workflowStages.length})
Last Updated: ${this.formatDate(user.lastUpdated)}
Report Generated: ${this.formatDate(reportData.generatedAt)}
        `;

        // Create and download report
        const blob = new Blob([reportContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${user.name.replace(/\s+/g, '_')}_report.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        alert(`Report generated for ${user.name}`);
    }

    // Hackathon Management
    handleCreateHackathon(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const hackathonData = {
            id: this.hackathons.length + 1,
            name: formData.get('hackathonName') || document.getElementById('hackathonName').value,
            description: formData.get('hackathonDescription') || document.getElementById('hackathonDescription').value,
            startDate: new Date(formData.get('startDate') || document.getElementById('startDate').value),
            endDate: new Date(formData.get('endDate') || document.getElementById('endDate').value),
            maxParticipants: parseInt(formData.get('maxParticipants') || document.getElementById('maxParticipants').value),
            currentParticipants: 0,
            status: 'upcoming',
            submissions: 0
        };

        this.hackathons.push(hackathonData);
        this.populateHackathons();
        this.closeModal('createHackathonModal');
        e.target.reset();
        alert('Hackathon created successfully!');
    }

    viewHackathonDetails(hackathonId) {
        const hackathon = this.hackathons.find(h => h.id === hackathonId);
        if (!hackathon) return;

        alert(`Hackathon Details:\n\nName: ${hackathon.name}\nDescription: ${hackathon.description}\nParticipants: ${hackathon.currentParticipants}/${hackathon.maxParticipants}\nSubmissions: ${hackathon.submissions}\nStatus: ${hackathon.status}`);
    }

    manageHackathon(hackathonId) {
        const hackathon = this.hackathons.find(h => h.id === hackathonId);
        if (!hackathon) return;

        const action = prompt(`Manage "${hackathon.name}":\n\n1. Change Status\n2. Update Participants\n3. View Submissions\n\nEnter your choice (1-3):`);
        
        switch (action) {
            case '1':
                const newStatus = prompt('Enter new status (upcoming/active/completed):', hackathon.status);
                if (['upcoming', 'active', 'completed'].includes(newStatus)) {
                    hackathon.status = newStatus;
                    this.populateHackathons();
                    alert('Status updated successfully!');
                }
                break;
            case '2':
                const newParticipants = prompt('Enter current participant count:', hackathon.currentParticipants);
                const count = parseInt(newParticipants);
                if (!isNaN(count) && count >= 0 && count <= hackathon.maxParticipants) {
                    hackathon.currentParticipants = count;
                    this.populateHackathons();
                    alert('Participant count updated!');
                }
                break;
            case '3':
                alert(`${hackathon.name} has ${hackathon.submissions} submissions.`);
                break;
        }
    }

    // Reports and Analytics
    loadReportsData() {
        this.generateProgressChart();
        this.generateSkillChart();
        this.updatePlatformMetrics();
    }

    generateProgressChart() {
        const canvas = document.getElementById('progressChartCanvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        canvas.width = canvas.offsetWidth;
        canvas.height = 300;

        // Simple line chart simulation
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 2;
        ctx.beginPath();

        const points = [
            {x: 50, y: 250}, {x: 100, y: 200}, {x: 150, y: 180},
            {x: 200, y: 150}, {x: 250, y: 120}, {x: 300, y: 100}
        ];

        points.forEach((point, index) => {
            if (index === 0) {
                ctx.moveTo(point.x, point.y);
            } else {
                ctx.lineTo(point.x, point.y);
            }
        });

        ctx.stroke();

        // Add labels
        ctx.fillStyle = '#374151';
        ctx.font = '12px Arial';
        ctx.fillText('User Progress Over Time', 20, 30);
        ctx.fillText('Jan', 40, 280);
        ctx.fillText('Mar', 140, 280);
        ctx.fillText('May', 240, 280);
    }

    generateSkillChart() {
        const canvas = document.getElementById('skillChartCanvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        canvas.width = canvas.offsetWidth;
        canvas.height = 300;

        // Simple pie chart simulation
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = 80;

        const skills = ['JavaScript', 'React', 'Node.js', 'Python'];
        const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];
        const angles = [0, Math.PI/2, Math.PI, 3*Math.PI/2];

        skills.forEach((skill, index) => {
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, angles[index], angles[index] + Math.PI/2);
            ctx.lineTo(centerX, centerY);
            ctx.fillStyle = colors[index];
            ctx.fill();
        });

        // Add legend
        skills.forEach((skill, index) => {
            ctx.fillStyle = colors[index];
            ctx.fillRect(20, 20 + index * 25, 15, 15);
            ctx.fillStyle = '#374151';
            ctx.font = '12px Arial';
            ctx.fillText(skill, 45, 32 + index * 25);
        });
    }

    updatePlatformMetrics() {
        const metricsData = {
            dailyActiveUsers: 1247,
            avgSessionTime: '24 min',
            completionRate: '78%',
            userSatisfaction: '4.6/5'
        };

        const metricItems = document.querySelectorAll('.metric-value');
        const values = Object.values(metricsData);
        
        metricItems.forEach((item, index) => {
            if (values[index]) {
                item.textContent = values[index];
            }
        });
    }

    exportReport() {
        const reportData = {
            totalUsers: this.users.length,
            activeHackathons: this.hackathons.filter(h => h.status === 'active').length,
            workflowStats: this.calculateWorkflowStats(),
            generatedAt: new Date()
        };

        const csvContent = [
            'Metric,Value',
            `Total Users,${reportData.totalUsers}`,
            `Active Hackathons,${reportData.activeHackathons}`,
            `Profile Completed,${reportData.workflowStats.profile || 0}`,
            `Assessments Completed,${reportData.workflowStats.assessment || 0}`,
            `Skills Evaluated,${reportData.workflowStats.skills || 0}`,
            `Paths Generated,${reportData.workflowStats.path || 0}`,
            `Report Generated,${this.formatDate(reportData.generatedAt)}`
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `platform_report_${new Date().getTime()}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        alert('Report exported successfully!');
    }

    // Workflow Management
    refreshWorkflowData() {
        // Simulate refreshing workflow data
        this.users.forEach(user => {
            // Randomly update some workflow statuses
            if (Math.random() > 0.7) {
                const stages = Object.keys(user.workflowStatus);
                const randomStage = stages[Math.floor(Math.random() * stages.length)];
                if (!user.workflowStatus[randomStage].completed) {
                    user.workflowStatus[randomStage].completed = true;
                    user.workflowStatus[randomStage].timestamp = new Date();
                }
            }
        });

        this.updateWorkflowProgress();
        this.populateActiveWorkflows();
        this.updateDashboardStats();
        
        // Show refresh animation
        const refreshBtn = document.getElementById('refreshWorkflow');
        if (refreshBtn) {
            const icon = refreshBtn.querySelector('i');
            icon.classList.add('fa-spin');
            setTimeout(() => {
                icon.classList.remove('fa-spin');
            }, 1000);
        }

        alert('Workflow data refreshed!');
    }

    showAddUserModal() {
        const name = prompt('Enter user name:');
        const email = prompt('Enter user email:');
        
        if (name && email) {
            const skills = ['JavaScript', 'React', 'Node.js', 'Python', 'Java'];
            const paths = ['Frontend Developer', 'Backend Developer', 'Full Stack Developer'];
            
            const newUser = {
                id: this.users.length + 1,
                name: name,
                email: email,
                skills: this.getRandomSkills(skills, 1, 3),
                assessmentScore: Math.floor(Math.random() * 40) + 60,
                learningPath: paths[Math.floor(Math.random() * paths.length)],
                lastUpdated: new Date(),
                workflowStatus: {
                    profile: { completed: true, timestamp: new Date(), details: 'Profile created' },
                    assessment: { completed: false, timestamp: null, details: 'Pending assessment' },
                    skills: { completed: false, timestamp: null, details: 'Pending evaluation' },
                    path: { completed: false, timestamp: null, details: 'Pending path generation' }
                }
            };

            this.users.push(newUser);
            this.populateUserTable();
            this.updateDashboardStats();
            alert('User added successfully!');
        }
    }

    // Real-time Updates
    startRealTimeUpdates() {
        setInterval(() => {
            // Simulate real-time workflow updates
            if (Math.random() > 0.8) {
                const randomUser = this.users[Math.floor(Math.random() * this.users.length)];
                const incompleteStages = Object.keys(randomUser.workflowStatus).filter(
                    stage => !randomUser.workflowStatus[stage].completed
                );
                
                if (incompleteStages.length > 0) {
                    const stageToComplete = incompleteStages[0];
                    randomUser.workflowStatus[stageToComplete].completed = true;
                    randomUser.workflowStatus[stageToComplete].timestamp = new Date();
                    
                    if (this.currentSection === 'workflow') {
                        this.updateWorkflowProgress();
                        this.populateActiveWorkflows();
                    }
                    
                    if (this.currentSection === 'dashboard') {
                        this.updateDashboardStats();
                    }
                }
            }
        }, 5000); // Update every 5 seconds

        // Update timestamps
        setInterval(() => {
            this.updateRecentActivity();
        }, 30000); // Update activity every 30 seconds
    }

    // Utility Functions
    getScoreClass(score) {
        if (score >= 90) return 'excellent';
        if (score >= 80) return 'good';
        if (score >= 70) return 'average';
        return 'needs-improvement';
    }

    formatDate(date) {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    formatTimestamp(date) {
        if (!date) return '';
        return new Date(date).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }
}

// Initialize the dashboard when the page loads
let adminDashboard;

document.addEventListener('DOMContentLoaded', function() {
    adminDashboard = new AdminDashboard();
    
    // Close modals when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
});

// Global functions for button callbacks
window.showSection = function(sectionName) {
    if (adminDashboard) {
        adminDashboard.showSection(sectionName);
    }
};

window.closeModal = function(modalId) {
    if (adminDashboard) {
        adminDashboard.closeModal(modalId);
    }
};