const AdminPage = {
    render() {
        return `
            <div id="admin-dashboard-wrapper" class="space-y-6 fade-in">
                <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h2 class="text-2xl font-bold text-gray-800">Admin Dashboard</h2>
                        <p class="text-gray-500 text-sm">Manage users and monitor platform activity.</p>
                    </div>
                </div>

                <!-- Stats Grid -->
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4" id="admin-stats"></div>

                <!-- Tabs -->
                <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div class="flex border-b border-gray-200" id="admin-tabs">
                        <button class="flex-1 py-3 px-4 text-sm font-medium text-center border-b-2 border-indigo-600 text-indigo-600 bg-indigo-50/50" data-tab="users">Users Management</button>
                        <button class="flex-1 py-3 px-4 text-sm font-medium text-center border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50" data-tab="videos">Videos Monitored</button>
                        <button class="flex-1 py-3 px-4 text-sm font-medium text-center border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50" data-tab="settings">System Settings</button>
                    </div>
                    
                    <div class="p-6">
                        <!-- Users Tab -->
                        <div id="tab-users" class="tab-content active space-y-4">
                            <div class="flex justify-between items-center mb-4">
                                <h3 class="text-lg font-semibold text-gray-800">All Users</h3>
                                <div class="flex gap-2">
                                    <button onclick="AdminPage.showAddUserModal()" class="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition">
                                        <i class="fas fa-plus mr-1"></i> Add User
                                    </button>
                                    <label class="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition cursor-pointer">
                                        <i class="fas fa-file-import mr-1"></i> Bulk Import
                                        <input type="file" accept=".csv" class="hidden" onchange="AdminPage.handleBulkImport(event)">
                                    </label>
                                </div>
                            </div>

                            <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                                <div class="flex bg-gray-100 p-1 rounded-lg">
                                    <button class="px-4 py-1.5 rounded-md text-sm font-medium bg-white shadow-sm text-indigo-700 admin-user-filter" data-role="all" onclick="AdminPage.filterUsers('all', this)">All</button>
                                    <button class="px-4 py-1.5 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 admin-user-filter" data-role="admin" onclick="AdminPage.filterUsers('admin', this)">Admin</button>
                                    <button class="px-4 py-1.5 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 admin-user-filter" data-role="teacher" onclick="AdminPage.filterUsers('teacher', this)">Teacher</button>
                                    <button class="px-4 py-1.5 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 admin-user-filter" data-role="student" onclick="AdminPage.filterUsers('student', this)">Student</button>
                                </div>
                                <div class="relative w-full md:w-64">
                                    <i class="fas fa-search absolute left-3 top-2.5 text-gray-400"></i>
                                    <input type="text" id="admin-user-search" placeholder="Search by name or email..." class="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500" onkeyup="AdminPage.renderUsers()">
                                </div>
                            </div>

                            <div class="overflow-x-auto rounded-lg border border-gray-200">
                                <table class="w-full text-sm text-left text-gray-500">
                                    <thead class="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th class="px-4 py-3">Name</th>
                                            <th class="px-4 py-3">Email</th>
                                            <th class="px-4 py-3">Role</th>
                                            <th class="px-4 py-3">Subjects</th>
                                            <th class="px-4 py-3 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody id="admin-users-list" class="divide-y divide-gray-100"></tbody>
                                </table>
                            </div>
                            <p class="text-xs text-gray-500 mt-2"><i class="fas fa-info-circle mr-1"></i>CSV Format: Name, Email, Password, Role (student/teacher), AssignedSubjects (comma separated subject IDs)</p>
                        </div>

                        <!-- Videos Tab -->
                        <div id="tab-videos" class="tab-content hidden space-y-4">
                            <h3 class="text-lg font-semibold text-gray-800 mb-4">Monitored Videos</h3>
                            <div class="overflow-x-auto rounded-lg border border-gray-200">
                                <table class="w-full text-sm text-left text-gray-500">
                                    <thead class="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th class="px-4 py-3">Title</th>
                                            <th class="px-4 py-3">Subject</th>
                                            <th class="px-4 py-3">Uploaded By</th>
                                            <th class="px-4 py-3">Date</th>
                                            <th class="px-4 py-3">Views</th>
                                            <th class="px-4 py-3 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody id="admin-videos-list" class="divide-y divide-gray-100"></tbody>
                                </table>
                            </div>
                        </div>

                        <!-- Settings Tab -->
                        <div id="tab-settings" class="tab-content hidden space-y-4">
                            <h3 class="text-lg font-semibold text-gray-800 mb-4">Platform Settings</h3>
                            <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm max-w-2xl">
                                <form id="admin-settings-form" class="space-y-4">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">System Name</label>
                                        <input type="text" id="setting-system-name" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none">
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">System Color (Gradient Start) - Hex Code</label>
                                        <div class="flex items-center gap-3">
                                            <input type="color" id="setting-system-color-picker" class="h-10 w-10 cursor-pointer rounded border border-gray-300 flex-shrink-0">
                                            <input type="text" id="setting-system-color" placeholder="#4F46E5" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none uppercase" pattern="^#[0-9A-Fa-f]{6}$" maxlength="7">
                                        </div>
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">System Color (Gradient End) - Hex Code</label>
                                        <div class="flex items-center gap-3">
                                            <input type="color" id="setting-system-color2-picker" class="h-10 w-10 cursor-pointer rounded border border-gray-300 flex-shrink-0">
                                            <input type="text" id="setting-system-color2" placeholder="#7C3AED" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none uppercase" pattern="^#[0-9A-Fa-f]{6}$" maxlength="7">
                                        </div>
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Logo</label>
                                        <div class="flex items-center gap-4">
                                            <div id="settings-logo-preview" class="w-16 h-16 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden">
                                                <i class="fas fa-image text-gray-400" id="settings-logo-icon"></i>
                                                <img id="settings-logo-img" class="w-full h-full object-cover hidden" alt="Logo Preview">
                                            </div>
                                            <div>
                                                <input type="file" id="setting-logo-file" accept="image/*" class="hidden">
                                                <label for="setting-logo-file" class="cursor-pointer px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">Upload File</label>
                                                <button type="button" id="setting-logo-remove" class="ml-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-red-600 hover:bg-gray-50 hidden">Remove</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Default Student Avatar</label>
                                        <div class="flex items-center gap-4">
                                            <div id="settings-student-avatar-preview" class="w-16 h-16 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden">
                                                <i class="fas fa-user-graduate text-gray-400" id="settings-student-avatar-icon"></i>
                                                <img id="settings-student-avatar-img" class="w-full h-full object-cover hidden" alt="Student Avatar Preview">
                                            </div>
                                            <div>
                                                <input type="file" id="setting-student-avatar-file" accept="image/*" class="hidden">
                                                <label for="setting-student-avatar-file" class="cursor-pointer px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">Upload File</label>
                                                <button type="button" id="setting-student-avatar-remove" class="ml-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-red-600 hover:bg-gray-50 hidden">Remove</button>
                                            </div>
                                        </div>
                                    </div>
                                    <button type="submit" class="bg-indigo-600 text-white font-medium py-2.5 px-6 rounded-lg hover:bg-indigo-700 transition shadow-sm mt-4">Save Settings</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div id="admin-subjects-wrapper" class="space-y-6 fade-in hidden">
                <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h2 class="text-2xl font-bold text-gray-800">Subject Management</h2>
                        <p class="text-gray-500 text-sm">Manage subjects and monitor content by level and category.</p>
                    </div>
                </div>

                <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-6">
                    <div id="admin-subjects-main">
                        <div class="flex justify-between items-center mb-6">
                            <h3 class="text-lg font-semibold text-gray-800">Subjects by Level</h3>
                            <button onclick="AdminPage.showAddSubjectModal()" class="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition">
                                <i class="fas fa-plus mr-1"></i> Add Subject
                            </button>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-4 gap-4" id="admin-levels-list"></div>
                        <div id="admin-level-subjects" class="mt-8 hidden fade-in">
                            <div class="flex items-center mb-6 border-b pb-4">
                                <button onclick="AdminPage.backToLevels()" class="text-indigo-600 mr-3 hover:text-indigo-800"><i class="fas fa-arrow-left"></i></button>
                                <h4 class="text-xl font-bold text-gray-800" id="admin-level-title">Level Subjects</h4>
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-6" id="admin-subjects-list"></div>
                        </div>
                    </div>
                    <div id="admin-subject-detail" class="hidden fade-in">
                        <!-- Student-like view injected here -->
                    </div>
                </div>
            </div>
        `;
    },

    init() {
        this.currentRoleFilter = 'all';
        this.renderStats();
        this.renderUsers();
        this.renderSubjects();
        this.renderVideos();
        this.setupTabs();
        
        const settings = store.getSettings();
        document.getElementById('setting-system-name').value = settings.systemName || 'EduHero';
        document.getElementById('setting-system-color').value = settings.systemColor || '#4F46E5';
        document.getElementById('setting-system-color-picker').value = settings.systemColor || '#4F46E5';
        document.getElementById('setting-system-color2').value = settings.systemColor2 || '#7C3AED';
        document.getElementById('setting-system-color2-picker').value = settings.systemColor2 || '#7C3AED';

        const syncColor = (pickerId, inputId) => {
            const picker = document.getElementById(pickerId);
            const input = document.getElementById(inputId);
            picker.addEventListener('input', (e) => input.value = e.target.value.toUpperCase());
            input.addEventListener('input', (e) => {
                if (/^#[0-9A-Fa-f]{6}$/i.test(e.target.value)) {
                    picker.value = e.target.value;
                }
            });
        };
        syncColor('setting-system-color-picker', 'setting-system-color');
        syncColor('setting-system-color2-picker', 'setting-system-color2');
        
        let currentLogoUrl = settings.logoUrl || '';
        const logoImg = document.getElementById('settings-logo-img');
        const logoIcon = document.getElementById('settings-logo-icon');
        const removeBtn = document.getElementById('setting-logo-remove');

        const updateLogoPreview = (url) => {
            if (url) {
                logoImg.src = url;
                logoImg.classList.remove('hidden');
                logoIcon.classList.add('hidden');
                removeBtn.classList.remove('hidden');
            } else {
                logoImg.src = '';
                logoImg.classList.add('hidden');
                logoIcon.classList.remove('hidden');
                removeBtn.classList.add('hidden');
            }
        };
        
        updateLogoPreview(currentLogoUrl);

        document.getElementById('setting-logo-file').addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                if (file.size > 2 * 1024 * 1024) { // 2MB limit
                    ui.showToast('File size must be less than 2MB', 'error');
                    e.target.value = '';
                    return;
                }
                const reader = new FileReader();
                reader.onload = (event) => {
                    currentLogoUrl = event.target.result;
                    updateLogoPreview(currentLogoUrl);
                };
                reader.readAsDataURL(file);
            }
        });

        document.getElementById('setting-logo-remove').addEventListener('click', () => {
            currentLogoUrl = '';
            document.getElementById('setting-logo-file').value = '';
            updateLogoPreview('');
        });

        let currentStudentAvatar = settings.studentAvatarUrl || '';
        const stuAvatarImg = document.getElementById('settings-student-avatar-img');
        const stuAvatarIcon = document.getElementById('settings-student-avatar-icon');
        const stuRemoveBtn = document.getElementById('setting-student-avatar-remove');

        const updateStudentAvatarPreview = (url) => {
            if (url) {
                stuAvatarImg.src = url;
                stuAvatarImg.classList.remove('hidden');
                stuAvatarIcon.classList.add('hidden');
                stuRemoveBtn.classList.remove('hidden');
            } else {
                stuAvatarImg.src = '';
                stuAvatarImg.classList.add('hidden');
                stuAvatarIcon.classList.remove('hidden');
                stuRemoveBtn.classList.add('hidden');
            }
        };
        
        updateStudentAvatarPreview(currentStudentAvatar);

        document.getElementById('setting-student-avatar-file').addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                if (file.size > 2 * 1024 * 1024) { // 2MB limit
                    ui.showToast('File size must be less than 2MB', 'error');
                    e.target.value = '';
                    return;
                }
                const reader = new FileReader();
                reader.onload = (event) => {
                    currentStudentAvatar = event.target.result;
                    updateStudentAvatarPreview(currentStudentAvatar);
                };
                reader.readAsDataURL(file);
            }
        });

        document.getElementById('setting-student-avatar-remove').addEventListener('click', () => {
            currentStudentAvatar = '';
            document.getElementById('setting-student-avatar-file').value = '';
            updateStudentAvatarPreview('');
        });

        document.getElementById('admin-settings-form').addEventListener('submit', (e) => {
            e.preventDefault();
            store.updateSettings({
                systemName: document.getElementById('setting-system-name').value || 'EduHero',
                systemColor: document.getElementById('setting-system-color').value || '#4F46E5',
                systemColor2: document.getElementById('setting-system-color2').value || '#7C3AED',
                logoUrl: currentLogoUrl,
                studentAvatarUrl: currentStudentAvatar
            });
            ui.showToast('Settings saved successfully');
            App.applySystemSettings();
            AdminPage.init();
        });
    },

    filterUsers(role, btn) {
        this.currentRoleFilter = role;
        
        // Update active button styles
        document.querySelectorAll('.admin-user-filter').forEach(b => {
            b.classList.remove('bg-white', 'shadow-sm', 'text-indigo-700');
            b.classList.add('text-gray-600');
        });
        btn.classList.add('bg-white', 'shadow-sm', 'text-indigo-700');
        btn.classList.remove('text-gray-600');
        
        this.renderUsers();
    },

    setupTabs() {
        const tabs = document.querySelectorAll('#admin-tabs button');
        const contents = document.querySelectorAll('.tab-content');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Reset styles
                tabs.forEach(t => {
                    t.classList.remove('border-indigo-600', 'text-indigo-600', 'bg-indigo-50/50');
                    t.classList.add('border-transparent', 'text-gray-500');
                });
                contents.forEach(c => c.classList.add('hidden'));
                
                // Set active
                tab.classList.add('border-indigo-600', 'text-indigo-600', 'bg-indigo-50/50');
                tab.classList.remove('border-transparent', 'text-gray-500');
                document.getElementById(`tab-${tab.dataset.tab}`).classList.remove('hidden');
                document.getElementById(`tab-${tab.dataset.tab}`).classList.add('fade-in');
            });
        });
    },

    renderStats() {
        const users = store.getUsers();
        const subjects = store.getSubjects();
        const videos = store.getVideos();
        
        const students = users.filter(u => u.role === 'student').length;
        const teachers = users.filter(u => u.role === 'teacher').length;

        const statsHtml = `
            <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center">
                <div class="p-3 bg-blue-50 text-blue-600 rounded-lg"><i class="fas fa-user-graduate text-xl"></i></div>
                <div class="ml-4"><p class="text-sm text-gray-500">Students</p><p class="text-2xl font-bold text-gray-800">${students}</p></div>
            </div>
            <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center">
                <div class="p-3 bg-purple-50 text-purple-600 rounded-lg"><i class="fas fa-chalkboard-teacher text-xl"></i></div>
                <div class="ml-4"><p class="text-sm text-gray-500">Teachers</p><p class="text-2xl font-bold text-gray-800">${teachers}</p></div>
            </div>
            <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center">
                <div class="p-3 bg-emerald-50 text-emerald-600 rounded-lg"><i class="fas fa-book text-xl"></i></div>
                <div class="ml-4"><p class="text-sm text-gray-500">Subjects</p><p class="text-2xl font-bold text-gray-800">${subjects.length}</p></div>
            </div>
            <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center">
                <div class="p-3 bg-rose-50 text-rose-600 rounded-lg"><i class="fas fa-video text-xl"></i></div>
                <div class="ml-4"><p class="text-sm text-gray-500">Videos</p><p class="text-2xl font-bold text-gray-800">${videos.length}</p></div>
            </div>
        `;
        document.getElementById('admin-stats').innerHTML = statsHtml;
    },

    renderUsers() {
        let users = store.getUsers();
        const subjectsMap = store.getSubjects().reduce((acc, s) => { acc[s.id] = s.name; return acc; }, {});

        // Filter by role
        if (this.currentRoleFilter && this.currentRoleFilter !== 'all') {
            users = users.filter(u => u.role === this.currentRoleFilter);
        }

        // Filter by search
        const searchInput = document.getElementById('admin-user-search');
        if (searchInput && searchInput.value.trim() !== '') {
            const query = searchInput.value.toLowerCase().trim();
            users = users.filter(u => u.name.toLowerCase().includes(query) || u.email.toLowerCase().includes(query));
        }

        if (users.length === 0) {
            document.getElementById('admin-users-list').innerHTML = `<tr><td colspan="5" class="px-4 py-8 text-center text-gray-500">No users found.</td></tr>`;
            return;
        }

        const settings = store.getSettings();
        const html = users.map(user => {
            const avatarHtml = (user.role === 'student' && settings.studentAvatarUrl) ? 
                `<img src="${settings.studentAvatarUrl}" class="w-full h-full object-cover">` : 
                user.name.charAt(0).toUpperCase();

            return `
            <tr class="hover:bg-gray-50 transition-colors">
                <td class="px-4 py-3 font-medium text-gray-900 flex items-center">
                    <div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3 text-xs font-bold text-gray-600 overflow-hidden">
                        ${avatarHtml}
                    </div>
                    ${user.name}
                </td>
                <td class="px-4 py-3">${user.email}</td>
                <td class="px-4 py-3 capitalize"><span class="px-2 py-1 bg-${user.role==='admin'?'rose':(user.role==='teacher'?'purple':'blue')}-100 text-${user.role==='admin'?'rose':(user.role==='teacher'?'purple':'blue')}-800 rounded-full text-xs font-medium">${user.role}</span></td>
                <td class="px-4 py-3 text-xs">${user.role === 'admin' ? 'All' : (user.subjects || []).map(sid => subjectsMap[sid] || sid).join(', ') || '-'}</td>
                <td class="px-4 py-3 text-right">
                    <button onclick="AdminPage.editUser('${user.id}')" class="text-indigo-600 hover:text-indigo-900 mr-2" title="Edit/Assign Subjects"><i class="fas fa-edit"></i></button>
                    ${user.role !== 'admin' ? `<button onclick="AdminPage.deleteUser('${user.id}')" class="text-red-600 hover:text-red-900"><i class="fas fa-trash"></i></button>` : ''}
                </td>
            </tr>
        `}).join('');
        document.getElementById('admin-users-list').innerHTML = html;
    },

    renderSubjects() {
        const subjects = store.getSubjects();
        const levels = [...new Set(subjects.map(s => s.level))];
        const videos = store.getVideos();
        
        const html = levels.map(level => {
            const levelSubjects = subjects.filter(s => s.level === level);
            const count = levelSubjects.length;

            const subjectsHtml = levelSubjects.map(s => {
                const videoCount = videos.filter(v => v.subjectId === s.id).length;
                return `
                <div class="bg-white border border-gray-200 rounded-xl mb-3 overflow-hidden transition-all shadow-sm hover:shadow-md">
                    <div class="p-4 flex items-center justify-between cursor-pointer transition-colors" style="border-left: 4px solid ${s.color || '#4f46e5'}" onclick="AdminPage.toggleSubject('${s.id}')">
                        <div class="flex items-center gap-4">
                            <div class="w-10 h-10 rounded-lg flex items-center justify-center shadow-sm" style="background-color: ${(s.color || '#4f46e5')}20; color: ${s.color || '#4f46e5'}">
                                <i class="fas fa-book text-lg"></i>
                            </div>
                            <div>
                                <h4 class="font-bold text-gray-800">${s.name}</h4>
                                <p class="text-xs text-gray-500 mt-1">${s.category}</p>
                            </div>
                        </div>
                        <div class="flex items-center gap-2 md:gap-4">
                            <span class="text-xs font-medium px-3 py-1 rounded-full border hidden md:inline-block" style="background-color: ${(s.color || '#4f46e5')}10; color: ${s.color || '#4f46e5'}; border-color: ${(s.color || '#4f46e5')}30">${videoCount} Videos</span>
                            <button onclick="event.stopPropagation(); AdminPage.showEditSubjectModal('${s.id}')" class="text-indigo-500 hover:text-indigo-700 bg-indigo-50 rounded-full w-8 h-8 flex items-center justify-center shadow-sm"><i class="fas fa-edit text-sm"></i></button>
                            <button onclick="event.stopPropagation(); AdminPage.deleteSubject('${s.id}')" class="text-red-500 hover:text-red-700 bg-red-50 rounded-full w-8 h-8 flex items-center justify-center shadow-sm"><i class="fas fa-trash text-sm"></i></button>
                            <div class="w-8 h-8 rounded-full flex items-center justify-center bg-white border border-gray-200 text-gray-500 shadow-sm ml-2">
                                <i class="fas fa-chevron-down transition-transform duration-300" id="admin-subj-icon-${s.id}"></i>
                            </div>
                        </div>
                    </div>
                    <div id="admin-subj-content-${s.id}" class="hidden border-t border-gray-100 p-6 bg-white"></div>
                </div>
                `;
            }).join('');

            const safeLevel = level.replace(/\s+/g, '-');

            return `
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-3">
                <div class="p-4 flex justify-between items-center bg-gray-50/50 cursor-pointer hover:bg-gray-100 transition" onclick="AdminPage.toggleLevel('${safeLevel}')">
                    <div class="flex items-center gap-4">
                        <div class="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center">
                            <i class="fas fa-layer-group text-lg"></i>
                        </div>
                        <div>
                            <h3 class="font-bold text-gray-800 text-lg">${level}</h3>
                            <p class="text-xs text-gray-500 mt-1">${count} Subjects</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-3">
                        <button onclick="event.stopPropagation(); AdminPage.editLevelName('${level}')" class="text-indigo-500 hover:text-indigo-700 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-sm border border-gray-200" title="Edit Level Name"><i class="fas fa-edit text-sm"></i></button>
                        <i class="fas fa-chevron-down text-gray-400 transition-transform duration-300 transform" id="admin-lvl-icon-${safeLevel}"></i>
                    </div>
                </div>
                <div id="admin-lvl-content-${safeLevel}" class="hidden p-6 border-t border-gray-100 bg-gray-50/30">
                    ${subjectsHtml}
                </div>
            </div>
            `;
        }).join('');
        
        document.getElementById('admin-levels-list').innerHTML = html;
        document.getElementById('admin-levels-list').className = 'space-y-4';
        
        // Hide unused sections
        document.getElementById('admin-level-subjects').classList.add('hidden');
        document.getElementById('admin-subject-detail').classList.add('hidden');
        document.getElementById('admin-subjects-main').classList.remove('hidden');
    },

    editLevelName(oldLevelName) {
        const modalHtml = `
            <div class="p-6">
                <div class="flex justify-between items-center mb-5">
                    <h3 class="text-xl font-bold text-gray-800">Edit Level Name</h3>
                    <button onclick="ui.closeModal('edit-level-modal')" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times"></i></button>
                </div>
                <form id="edit-level-form" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Level Name</label>
                        <input type="text" id="el-name" value="${oldLevelName}" required class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none">
                    </div>
                    <div class="flex gap-4">
                        <button type="button" onclick="AdminPage.deleteLevel('${oldLevelName}')" class="w-1/3 bg-red-50 text-red-600 font-medium py-2.5 rounded-lg hover:bg-red-100 transition mt-4"><i class="fas fa-trash mr-1"></i> Delete</button>
                        <button type="submit" class="w-2/3 bg-indigo-600 text-white font-medium py-2.5 rounded-lg hover:bg-indigo-700 transition mt-4">Save Changes</button>
                    </div>
                </form>
            </div>
        `;
        ui.showModal('edit-level-modal', modalHtml);

        document.getElementById('edit-level-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const newName = document.getElementById('el-name').value.trim();
            if (newName && newName !== oldLevelName) {
                const subjects = store.getSubjects();
                let updated = 0;
                subjects.forEach(s => {
                    if (s.level === oldLevelName) {
                        store.updateSubject(s.id, { level: newName });
                        updated++;
                    }
                });
                ui.closeModal('edit-level-modal');
                ui.showToast(`Level name updated for ${updated} subjects`);
                AdminPage.init();
            } else {
                ui.closeModal('edit-level-modal');
            }
        });
    },

    deleteLevel(levelName) {
        if (confirm(`Are you sure you want to delete the level "${levelName}"? This will permanently delete ALL subjects under this level and their videos.`)) {
            const subjects = store.getSubjects().filter(s => s.level === levelName);
            subjects.forEach(s => store.deleteSubject(s.id));
            ui.closeModal('edit-level-modal');
            ui.showToast(`Deleted level and its ${subjects.length} subjects`);
            AdminPage.init();
        }
    },

    toggleLevel(levelId) {
        const allContents = document.querySelectorAll('[id^="admin-lvl-content-"]');
        const allIcons = document.querySelectorAll('[id^="admin-lvl-icon-"]');
        
        const content = document.getElementById(`admin-lvl-content-${levelId}`);
        const icon = document.getElementById(`admin-lvl-icon-${levelId}`);
        
        const isHidden = content.classList.contains('hidden');
        
        allContents.forEach(c => c.classList.add('hidden'));
        allIcons.forEach(i => i.classList.remove('rotate-180'));
        
        if (isHidden) {
            content.classList.remove('hidden');
            icon.classList.add('rotate-180');
        }
    },

    toggleSubject(subjectId) {
        const allContents = document.querySelectorAll('[id^="admin-subj-content-"]');
        const allIcons = document.querySelectorAll('[id^="admin-subj-icon-"]');
        
        const content = document.getElementById(`admin-subj-content-${subjectId}`);
        const icon = document.getElementById(`admin-subj-icon-${subjectId}`);
        
        const isHidden = content.classList.contains('hidden');
        
        allContents.forEach(c => c.classList.add('hidden'));
        allIcons.forEach(i => i.classList.remove('rotate-180'));
        
        if (isHidden) {
            content.classList.remove('hidden');
            icon.classList.add('rotate-180');
            this.openSubject(subjectId);
        }
    },

    backToSubjectList() {
        document.getElementById('admin-subject-detail').classList.add('hidden');
        document.getElementById('admin-subjects-main').classList.remove('hidden');
    },

    openSubject(subjectId) {
        const subject = store.getSubjects().find(s => s.id === subjectId);
        const videos = store.getVideos().filter(v => v.subjectId === subjectId);
        const detailView = document.getElementById(`admin-subj-content-${subjectId}`);

        const teacherIds = [...new Set(videos.map(v => v.teacherId))];
        const users = store.getUsers();

        let contentHtml = '';
        if (teacherIds.length === 0) {
            contentHtml = `
                <div class="bg-gray-50 rounded-xl p-8 text-center border border-gray-100">
                    <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                        <i class="fas fa-chalkboard-teacher text-2xl text-gray-400"></i>
                    </div>
                    <h3 class="text-lg font-bold text-gray-800 mb-1">No teachers found</h3>
                    <p class="text-gray-500">No videos have been uploaded for this subject yet.</p>
                </div>
            `;
        } else {
            contentHtml = teacherIds.map(tId => {
                const t = users.find(u => u.id === tId);
                const tVideos = videos.filter(v => v.teacherId === tId);
                return `
                    <div class="bg-white border border-gray-200 rounded-xl p-5 hover:border-indigo-300 transition-colors cursor-pointer flex items-center shadow-sm" onclick="AdminPage.openSubjectTeacher('${subjectId}', '${tId}')">
                        <div class="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mr-4">
                            <i class="fas fa-chalkboard-teacher text-xl"></i>
                        </div>
                        <div>
                            <h4 class="font-bold text-gray-800">${t ? t.name : 'Unknown Teacher'}</h4>
                            <p class="text-xs text-gray-500 mt-0.5">${tVideos.length} videos available</p>
                        </div>
                        <i class="fas fa-chevron-right ml-auto text-gray-300"></i>
                    </div>
                `;
            }).join('');
            contentHtml = `<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">${contentHtml}</div>`;
        }

        detailView.innerHTML = `
            <div class="mb-4">
                <p class="text-sm font-medium text-gray-500 mb-2">Select a Teacher</p>
            </div>
            ${contentHtml}
        `;
    },

    openSubjectTeacher(subjectId, teacherId) {
        const subject = store.getSubjects().find(s => s.id === subjectId);
        const teacher = store.getUsers().find(u => u.id === teacherId);
        const videos = store.getVideos().filter(v => v.subjectId === subjectId && v.teacherId === teacherId);
        const detailView = document.getElementById(`admin-subj-content-${subjectId}`);

        const monthsMap = {};
        videos.forEach(v => {
            const m = v.month || new Date(v.date).toLocaleDateString('default', { month: 'long', year: 'numeric' });
            if (!monthsMap[m]) monthsMap[m] = { name: m, videos: [] };
            monthsMap[m].videos.push(v);
        });

        let contentHtml = Object.keys(monthsMap).map(key => {
            const m = monthsMap[key];
            return `
                <div class="bg-white border border-gray-200 rounded-xl p-5 hover:border-indigo-300 transition-colors cursor-pointer flex items-center shadow-sm" onclick="AdminPage.openSubjectTeacherMonth('${subjectId}', '${teacherId}', '${key}')">
                    <div class="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mr-4">
                        <i class="fas fa-calendar-alt text-xl"></i>
                    </div>
                    <div>
                        <h4 class="font-bold text-gray-800">${m.name}</h4>
                        <p class="text-xs text-gray-500 mt-0.5">${m.videos.length} videos available</p>
                    </div>
                    <i class="fas fa-chevron-right ml-auto text-gray-300"></i>
                </div>
            `;
        }).join('');
        contentHtml = `<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">${contentHtml}</div>`;

        detailView.innerHTML = `
            <div class="flex items-center mb-4">
                <button onclick="AdminPage.openSubject('${subjectId}')" class="flex items-center text-indigo-600 font-medium hover:text-indigo-800 transition mr-4 bg-indigo-50 px-3 py-1.5 rounded-lg text-sm">
                    <i class="fas fa-arrow-left mr-2"></i> Back
                </button>
                <p class="text-sm font-medium text-gray-500">Teacher: <span class="text-gray-800">${teacher ? teacher.name : 'Unknown'}</span> &bull; Select a Month</p>
            </div>
            ${contentHtml}
        `;
    },

    openSubjectTeacherMonth(subjectId, teacherId, monthKey) {
        const subject = store.getSubjects().find(s => s.id === subjectId);
        const teacher = store.getUsers().find(u => u.id === teacherId);
        
        const videos = store.getVideos().filter(v => {
            if (v.subjectId === subjectId && v.teacherId === teacherId) {
                const m = v.month || new Date(v.date).toLocaleDateString('default', { month: 'long', year: 'numeric' });
                return m === monthKey;
            }
            return false;
        });

        const detailView = document.getElementById(`admin-subj-content-${subjectId}`);

        let videosHtml = videos.map(video => `
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-4">
                <div class="p-4 flex flex-col md:flex-row gap-4 items-center cursor-pointer hover:bg-gray-50 transition-colors group" onclick="AdminPage.playVideo('${video.id}', '${video.url}')">
                    <div class="w-full md:w-48 h-28 bg-gray-200 rounded-lg overflow-hidden relative flex-shrink-0">
                        <img src="${ui.getVideoThumbnail(video.url)}" class="w-full h-full object-cover" alt="Thumbnail">
                        <div class="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center group-hover:bg-opacity-40 transition-all">
                            <i class="fas fa-play-circle text-white text-3xl opacity-90 group-hover:scale-110 transition-transform"></i>
                        </div>
                    </div>
                    <div class="flex-grow">
                        <h4 class="text-lg font-bold text-gray-800">${video.title}</h4>
                        <p class="text-gray-600 text-sm mt-1 line-clamp-2">${video.description || 'No description provided.'}</p>
                        <div class="mt-2 text-xs text-gray-500"><i class="fas fa-eye mr-1"></i> ${video.views || 0} views</div>
                    </div>
                    <div class="text-xs text-gray-400 font-medium md:text-right whitespace-nowrap min-w-[120px]">
                        <div class="mb-1"><i class="fas fa-calendar-alt mr-1"></i> ${new Date(video.date).toLocaleDateString()}</div>
                        <div>${new Date(video.date).toLocaleTimeString()}</div>
                    </div>
                </div>
                <div id="admin-video-container-${video.id}" class="bg-gray-900 hidden w-full"></div>
                <div class="bg-gray-50 p-4 border-t border-gray-100">
                    <h5 class="text-sm font-bold text-gray-700 mb-3"><i class="fas fa-chart-line text-emerald-500 mr-1"></i>Student Progress</h5>
                    <div id="admin-progress-list-${video.id}" class="space-y-2 max-h-32 overflow-y-auto pr-2 custom-scrollbar"></div>
                </div>
            </div>
        `).join('');

        detailView.innerHTML = `
            <div class="flex items-center mb-4">
                <button onclick="AdminPage.openSubjectTeacher('${subjectId}', '${teacherId}')" class="flex items-center text-indigo-600 font-medium hover:text-indigo-800 transition mr-4 bg-indigo-50 px-3 py-1.5 rounded-lg text-sm">
                    <i class="fas fa-arrow-left mr-2"></i> Back
                </button>
                <p class="text-sm font-medium text-gray-500">Teacher: <span class="text-gray-800">${teacher ? teacher.name : 'Unknown'}</span> &bull; Month: <span class="text-gray-800">${monthKey}</span></p>
            </div>
            <div class="space-y-4 mt-4">
                ${videosHtml}
            </div>
        `;

        if (videos.length > 0) {
            videos.forEach(v => {
                this.renderProgress(v.id);
            });
        }
    },

    backToSubjectList() {
        document.getElementById('admin-subject-detail').classList.add('hidden');
        document.getElementById('admin-subjects-main').classList.remove('hidden');
    },

    playVideo(videoId, url) {
        // Ensure any existing modal is removed first
        const existingModal = document.getElementById('video-fullscreen-modal');
        if (existingModal) existingModal.remove();

        const closeScript = "document.getElementById('video-fullscreen-modal').remove(); if(screen.orientation && screen.orientation.unlock) { screen.orientation.unlock(); }";

        const modalHtml = `
            <button onclick="${closeScript}" class="absolute top-4 right-4 md:top-6 md:right-8 z-[100] text-white bg-gray-900 bg-opacity-80 hover:bg-red-600 rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition-colors border border-white/20">
                <i class="fas fa-times text-2xl"></i>
            </button>
            <div class="w-full h-full flex items-center justify-center p-0 md:p-8">
                ${ui.renderVideoPlayer(url, videoId)}
            </div>
        `;
        
        const modal = document.createElement('div');
        modal.id = 'video-fullscreen-modal';
        modal.className = 'fixed inset-0 z-[100] bg-black flex items-center justify-center';
        modal.innerHTML = modalHtml;
        document.body.appendChild(modal);

        if (window.innerWidth <= 768 && screen.orientation && screen.orientation.lock) {
            screen.orientation.lock('landscape').catch(e => console.log('Orientation lock failed:', e));
        }
    },

    renderProgress(videoId) {
        const progressList = store.getAllProgressForVideo(videoId);
        const users = store.getUsers().filter(u => u.role === 'student');
        const video = store.getVideos().find(v => v.id === videoId);
        
        const assignedStudents = users.filter(u => (u.subjects || []).includes(video.subjectId));
        const container = document.getElementById(`admin-progress-list-${videoId}`);
        if (!container) return;

        if (assignedStudents.length === 0) {
            container.innerHTML = `<p class="text-sm text-gray-500 italic">No students assigned to this subject yet.</p>`;
            return;
        }

        container.innerHTML = assignedStudents.map(student => {
            const p = progressList.find(prog => prog.studentId === student.id);
            const percentage = p ? p.percentage : 0;
            return `
                <div class="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <span class="text-sm font-medium text-gray-700 w-1/3 truncate" title="${student.name}">${student.name}</span>
                    <div class="flex items-center w-2/3">
                        <div class="w-full bg-gray-200 rounded-full h-2.5 mr-3">
                            <div class="bg-${percentage === 100 ? 'emerald' : 'indigo'}-600 h-2.5 rounded-full" style="width: ${percentage}%"></div>
                        </div>
                        <span class="text-xs font-bold text-gray-600 w-10 text-right">${percentage}%</span>
                    </div>
                </div>
            `;
        }).join('');
    },

    renderVideos() {
        const videos = store.getVideos();
        const users = store.getUsers();
        const subjects = store.getSubjects();

        const html = videos.map(v => {
            const u = users.find(u => u.id === v.teacherId);
            const s = subjects.find(s => s.id === v.subjectId);
            return `
            <tr class="hover:bg-gray-50 transition-colors">
                <td class="px-4 py-3 font-medium text-gray-900">${v.title}</td>
                <td class="px-4 py-3">${s ? s.name : '-'}</td>
                <td class="px-4 py-3">${u ? u.name : '-'}</td>
                <td class="px-4 py-3">${new Date(v.date).toLocaleString()}</td>
                <td class="px-4 py-3 font-semibold text-indigo-600">${v.views || 0}</td>
                <td class="px-4 py-3 text-right">
                    <a href="${v.url}" target="_blank" class="text-indigo-600 hover:text-indigo-900"><i class="fas fa-external-link-alt"></i> Preview</a>
                </td>
            </tr>
        `}).join('');
        document.getElementById('admin-videos-list').innerHTML = html;
    },

    handleBulkImport(event) {
        const file = event.target.files[0];
        if (!file) return;

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: function(results) {
                let added = 0;
                results.data.forEach(row => {
                    if (row.Name && row.Email) {
                        const existing = store.getUserByEmail(row.Email);
                        if (!existing) {
                            const subjects = row.AssignedSubjects ? row.AssignedSubjects.split(',').map(s => s.trim()).filter(Boolean) : [];
                            store.addUser({
                                name: row.Name,
                                email: row.Email,
                                password: row.Password || 'password',
                                role: row.Role ? row.Role.toLowerCase() : 'student',
                                subjects: subjects
                            });
                            added++;
                        }
                    }
                });
                ui.showToast(`Successfully imported ${added} users.`);
                AdminPage.init();
            }
        });
        event.target.value = ''; // reset
    },

    showAddUserModal() {
        const modalHtml = `
            <div class="p-6">
                <div class="flex justify-between items-center mb-5">
                    <h3 class="text-xl font-bold text-gray-800">Add New User</h3>
                    <button onclick="ui.closeModal('add-user-modal')" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times"></i></button>
                </div>
                <form id="add-user-form" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input type="text" id="au-name" required class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input type="email" id="au-email" required class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input type="text" id="au-password" required class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Role</label>
                        <select id="au-role" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white">
                            <option value="student">Student</option>
                            <option value="teacher">Teacher</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <button type="submit" class="w-full bg-indigo-600 text-white font-medium py-2.5 rounded-lg hover:bg-indigo-700 transition mt-4">Create User</button>
                </form>
            </div>
        `;
        ui.showModal('add-user-modal', modalHtml);

        document.getElementById('add-user-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('au-email').value;
            if (store.getUserByEmail(email)) {
                ui.showToast('Email already exists!', 'error');
                return;
            }
            store.addUser({
                name: document.getElementById('au-name').value,
                email: email,
                password: document.getElementById('au-password').value,
                role: document.getElementById('au-role').value,
                subjects: []
            });
            ui.closeModal('add-user-modal');
            ui.showToast('User added successfully');
            AdminPage.init();
        });
    },

    editUser(userId) {
        const user = store.getUsers().find(u => u.id === userId);
        const subjects = store.getSubjects();
        
        let subjectsHtml = '';
        if (user.role !== 'admin') {
            const levels = [...new Set(subjects.map(s => s.level))];
            subjectsHtml = levels.map(level => {
                const levelSubjects = subjects.filter(s => s.level === level);
                const safeLevel = level.replace(/\s+/g, '-');
                const checks = levelSubjects.map(s => `
                    <label class="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer mb-2 bg-white shadow-sm">
                        <input type="checkbox" class="subject-cb mr-3 h-4 w-4 text-indigo-600 rounded border-gray-300" value="${s.id}" ${user.subjects?.includes(s.id) ? 'checked' : ''}>
                        <div>
                            <div class="font-medium text-sm text-gray-800">${s.name}</div>
                            <div class="text-xs text-gray-500">${s.category}</div>
                        </div>
                    </label>
                `).join('');
                return `
                    <div class="bg-white border border-gray-200 rounded-xl overflow-hidden mb-3">
                        <div class="px-4 py-3 flex justify-between items-center bg-gray-50 cursor-pointer hover:bg-gray-100 transition" onclick="AdminPage.toggleEditUserLevel('${safeLevel}')">
                            <span class="font-bold text-gray-700 text-sm">${level}</span>
                            <i class="fas fa-chevron-down text-gray-400 transition-transform duration-300" id="eu-lvl-icon-${safeLevel}"></i>
                        </div>
                        <div id="eu-lvl-content-${safeLevel}" class="hidden p-3 border-t border-gray-100 bg-gray-50/50">
                            ${checks}
                        </div>
                    </div>
                `;
            }).join('');
            subjectsHtml = `<div class="mt-4"><label class="block text-sm font-medium text-gray-700 mb-2">Assign Subjects</label><div class="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">${subjectsHtml}</div></div>`;
        }

        const modalHtml = `
            <div class="p-6">
                <div class="flex justify-between items-center mb-5">
                    <h3 class="text-xl font-bold text-gray-800">Edit User</h3>
                    <button onclick="ui.closeModal('edit-user-modal')" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times"></i></button>
                </div>
                <form id="edit-user-form" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input type="text" id="eu-name" value="${user.name}" required class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none">
                    </div>
                    ${subjectsHtml}
                    <button type="submit" class="w-full bg-indigo-600 text-white font-medium py-2.5 rounded-lg hover:bg-indigo-700 transition mt-6">Save Changes</button>
                </form>
            </div>
        `;
        ui.showModal('edit-user-modal', modalHtml);

        document.getElementById('edit-user-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const updates = { 
                name: document.getElementById('eu-name').value
            };
            
            if (user.role !== 'admin') {
                const checked = Array.from(document.querySelectorAll('.subject-cb:checked')).map(cb => cb.value);
                updates.subjects = checked;
            }

            store.updateUser(userId, updates);
            ui.closeModal('edit-user-modal');
            ui.showToast('User updated successfully');
            AdminPage.init();
        });
    },

    toggleEditUserLevel(levelId) {
        const content = document.getElementById(`eu-lvl-content-${levelId}`);
        const icon = document.getElementById(`eu-lvl-icon-${levelId}`);
        
        const isHidden = content.classList.contains('hidden');
        if (isHidden) {
            content.classList.remove('hidden');
            icon.classList.add('rotate-180');
        } else {
            content.classList.add('hidden');
            icon.classList.remove('rotate-180');
        }
    },

    deleteUser(userId) {
        if (confirm('Are you sure you want to delete this user?')) {
            store.deleteUser(userId);
            ui.showToast('User deleted');
            AdminPage.init();
        }
    },

    showAddSubjectModal() {
        const modalHtml = `
            <div class="p-6">
                <div class="flex justify-between items-center mb-5">
                    <h3 class="text-xl font-bold text-gray-800">Add New Subject</h3>
                    <button onclick="ui.closeModal('add-subject-modal')" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times"></i></button>
                </div>
                <form id="add-subject-form" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Subject Name</label>
                        <input type="text" id="as-name" placeholder="e.g. Math Form 1" required class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none">
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Level</label>
                            <input type="text" id="as-level" placeholder="e.g. Form 1" required class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <input type="text" id="as-category" placeholder="e.g. Math" required class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none">
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Theme Color</label>
                        <div class="flex items-center gap-3">
                            <input type="color" id="as-color" value="#4F46E5" class="h-10 w-20 cursor-pointer rounded border border-gray-300">
                            <span class="text-sm text-gray-500">Select a color to identify this subject easily.</span>
                        </div>
                    </div>
                    <button type="submit" class="w-full bg-indigo-600 text-white font-medium py-2.5 rounded-lg hover:bg-indigo-700 transition mt-4">Create Subject</button>
                </form>
            </div>
        `;
        ui.showModal('add-subject-modal', modalHtml);

        document.getElementById('add-subject-form').addEventListener('submit', (e) => {
            e.preventDefault();
            store.addSubject({
                name: document.getElementById('as-name').value,
                level: document.getElementById('as-level').value,
                category: document.getElementById('as-category').value,
                color: document.getElementById('as-color').value
            });
            ui.closeModal('add-subject-modal');
            ui.showToast('Subject created successfully');
            AdminPage.init();
        });
    },

    showEditSubjectModal(subjectId) {
        const subject = store.getSubjects().find(s => s.id === subjectId);
        if (!subject) return;

        const modalHtml = `
            <div class="p-6">
                <div class="flex justify-between items-center mb-5">
                    <h3 class="text-xl font-bold text-gray-800">Edit Subject</h3>
                    <button onclick="ui.closeModal('edit-subject-modal')" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times"></i></button>
                </div>
                <form id="edit-subject-form" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Subject Name</label>
                        <input type="text" id="es-name" value="${subject.name}" required class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none">
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Level</label>
                            <input type="text" id="es-level" value="${subject.level}" required class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <input type="text" id="es-category" value="${subject.category}" required class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none">
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Theme Color</label>
                        <div class="flex items-center gap-3">
                            <input type="color" id="es-color" value="${subject.color || '#4F46E5'}" class="h-10 w-20 cursor-pointer rounded border border-gray-300">
                            <span class="text-sm text-gray-500">Select a color to identify this subject easily.</span>
                        </div>
                    </div>
                    <button type="submit" class="w-full bg-indigo-600 text-white font-medium py-2.5 rounded-lg hover:bg-indigo-700 transition mt-4">Save Changes</button>
                </form>
            </div>
        `;
        ui.showModal('edit-subject-modal', modalHtml);

        document.getElementById('edit-subject-form').addEventListener('submit', (e) => {
            e.preventDefault();
            store.updateSubject(subjectId, {
                name: document.getElementById('es-name').value,
                level: document.getElementById('es-level').value,
                category: document.getElementById('es-category').value,
                color: document.getElementById('es-color').value
            });
            ui.closeModal('edit-subject-modal');
            ui.showToast('Subject updated successfully');
            AdminPage.init();
        });
    },

    deleteSubject(subjectId) {
        if (confirm('Delete this subject? This will remove all associated videos and unassign it from all users.')) {
            store.deleteSubject(subjectId);
            ui.showToast('Subject deleted');
            AdminPage.init();
        }
    }
};
