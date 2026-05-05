const TeacherPage = {
    render() {
        return `
            <div class="space-y-6 fade-in">
                <div>
                    <h2 class="text-2xl font-bold text-gray-800">Teacher Dashboard</h2>
                    <p class="text-gray-500 text-sm">Manage videos for your assigned subjects.</p>
                </div>

                <div id="teacher-subjects-container" class="space-y-8">
                    <!-- Dynamic subject sections -->
                </div>
            </div>
        `;
    },

    init() {
        this.renderSubjects();
    },

    renderSubjects() {
        const user = auth.getCurrentUser();
        const allSubjects = store.getSubjects();
        const mySubjects = allSubjects.filter(s => (user.subjects || []).includes(s.id));
        const allVideos = store.getVideos();

        if (mySubjects.length === 0) {
            document.getElementById('teacher-subjects-container').innerHTML = `
                <div class="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-100">
                    <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i class="fas fa-folder-open text-2xl text-gray-400"></i>
                    </div>
                    <h3 class="text-lg font-medium text-gray-800 mb-2">No Subjects Assigned</h3>
                    <p class="text-gray-500">Please contact the administrator to get subjects assigned to you.</p>
                </div>
            `;
            return;
        }

        const html = mySubjects.map(subject => {
            const subjectVideos = allVideos.filter(v => v.subjectId === subject.id);
            
            // Group videos by month
            const monthsMap = {};
            subjectVideos.forEach(v => {
                const m = v.month || new Date(v.date).toLocaleDateString('default', { month: 'long', year: 'numeric' });
                if (!monthsMap[m]) monthsMap[m] = [];
                monthsMap[m].push(v);
            });

            let monthsHtml = '';
            if (subjectVideos.length === 0) {
                monthsHtml = `
                    <div class="py-8 text-center border-2 border-dashed border-gray-200 rounded-xl bg-white">
                        <p class="text-gray-500">No videos uploaded yet.</p>
                    </div>
                `;
            } else {
                monthsHtml = Object.keys(monthsMap).map(m => {
                    const mVideos = monthsMap[m];
                    const vHtml = mVideos.map(video => `
                        <div class="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow mb-4">
                            <div class="p-4 flex flex-col md:flex-row gap-4 items-center">
                                <div class="w-full md:w-48 h-28 bg-gray-200 rounded-lg overflow-hidden relative flex-shrink-0 cursor-pointer group" onclick="TeacherPage.playVideo('${video.id}', '${video.url}')">
                                    <img src="${ui.getVideoThumbnail(video.url)}" class="w-full h-full object-cover" alt="Thumbnail">
                                    <div class="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center group-hover:bg-opacity-40 transition-all">
                                        <i class="fas fa-play-circle text-white text-3xl opacity-90 group-hover:scale-110 transition-transform"></i>
                                    </div>
                                </div>
                                <div class="flex-grow">
                                    <h4 class="font-bold text-gray-800 mb-1 truncate" title="${video.title}">${video.title}</h4>
                                    <p class="text-sm text-gray-500 line-clamp-2" title="${video.description}">${video.description || 'No description provided.'}</p>
                                    <div class="mt-2 text-xs text-gray-500"><i class="fas fa-eye mr-1"></i> ${video.views || 0} views</div>
                                </div>
                                <div class="text-xs text-gray-400 font-medium md:text-right whitespace-nowrap min-w-[150px]">
                                    <div class="mb-1"><i class="fas fa-calendar-alt mr-1"></i> ${new Date(video.date).toLocaleDateString()}</div>
                                    <div class="mb-3">${new Date(video.date).toLocaleTimeString()}</div>
                                    <div class="flex gap-2 justify-end">
                                        <button onclick="TeacherPage.editVideo('${video.id}')" class="px-3 py-1.5 rounded bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition shadow-sm"><i class="fas fa-edit"></i> Edit</button>
                                        <button onclick="TeacherPage.deleteVideo('${video.id}')" class="px-3 py-1.5 rounded bg-red-50 text-red-600 hover:bg-red-100 transition shadow-sm"><i class="fas fa-trash"></i></button>
                                    </div>
                                </div>
                            </div>
                            <div id="teacher-video-container-${video.id}" class="bg-gray-900 hidden w-full border-t border-gray-100"></div>
                        </div>
                    `).join('');
                    return `
                        <div class="mb-6">
                            <h5 class="font-bold text-gray-700 mb-3 border-b pb-2"><i class="fas fa-calendar-alt text-indigo-500 mr-2"></i>${m}</h5>
                            ${vHtml}
                        </div>
                    `;
                }).join('');
            }

            return `
                <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-3 transition-all hover:shadow-md">
                    <div class="p-4 flex justify-between items-center cursor-pointer transition-colors" style="border-left: 4px solid ${subject.color || '#4f46e5'}" onclick="TeacherPage.toggleSubject('${subject.id}')">
                        <div class="flex items-center gap-4">
                            <div class="w-10 h-10 rounded-lg flex items-center justify-center" style="background-color: ${(subject.color || '#4f46e5')}20; color: ${subject.color || '#4f46e5'}">
                                <i class="fas fa-book text-lg"></i>
                            </div>
                            <div>
                                <h3 class="font-bold text-gray-800 text-lg">${subject.name}</h3>
                                <p class="text-xs text-gray-500 mt-1">${subject.level} &bull; ${subject.category} &bull; ${subjectVideos.length} Videos</p>
                            </div>
                        </div>
                        <div class="flex items-center gap-4">
                            <button onclick="event.stopPropagation(); TeacherPage.showAddVideoModal('${subject.id}', '${subject.name}')" class="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition shadow-sm">
                                <i class="fas fa-plus mr-1"></i> Add Video
                            </button>
                            <i class="fas fa-chevron-down text-gray-400 transition-transform duration-300 transform" id="teacher-subj-icon-${subject.id}"></i>
                        </div>
                    </div>
                    <div id="teacher-subj-content-${subject.id}" class="hidden p-6 border-t border-gray-100 bg-gray-50/30">
                        ${monthsHtml}
                    </div>
                </div>
            `;
        }).join('');

        document.getElementById('teacher-subjects-container').innerHTML = html;
    },

    showAddVideoModal(subjectId, subjectName) {
        const modalHtml = `
            <div class="p-6">
                <div class="flex justify-between items-center mb-5">
                    <h3 class="text-xl font-bold text-gray-800">Add Video to ${subjectName}</h3>
                    <button onclick="ui.closeModal('add-video-modal')" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times"></i></button>
                </div>
                <form id="add-video-form" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Video Title</label>
                        <input type="text" id="av-title" required class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none">
                        <p class="text-xs text-gray-500 mt-1">EX. 2026 F2 SEJ FEB WEEK 1 - BAB 1.3</p>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Upload Month</label>
                        <select id="av-month" required class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none">
                            <option value="January">January</option>
                            <option value="February">February</option>
                            <option value="March">March</option>
                            <option value="April">April</option>
                            <option value="May">May</option>
                            <option value="June">June</option>
                            <option value="July">July</option>
                            <option value="August">August</option>
                            <option value="September">September</option>
                            <option value="October">October</option>
                            <option value="November">November</option>
                            <option value="December">December</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Video Link (YouTube/Vimeo)</label>
                        <input type="url" id="av-url" placeholder="https://www.youtube.com/watch?v=..." required class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea id="av-desc" rows="3" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"></textarea>
                    </div>
                    <button type="submit" class="w-full bg-indigo-600 text-white font-medium py-2.5 rounded-lg hover:bg-indigo-700 transition mt-4 shadow-sm">Add Video</button>
                </form>
            </div>
        `;
        ui.showModal('add-video-modal', modalHtml);

        document.getElementById('add-video-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const user = auth.getCurrentUser();
            store.addVideo({
                subjectId: subjectId,
                teacherId: user.id,
                title: document.getElementById('av-title').value,
                month: document.getElementById('av-month').value,
                url: document.getElementById('av-url').value,
                description: document.getElementById('av-desc').value
            });
            ui.closeModal('add-video-modal');
            ui.showToast('Video added successfully');
            TeacherPage.init();
        });
    },

    editVideo(videoId) {
        const video = store.getVideos().find(v => v.id === videoId);
        if (!video) return;

        const modalHtml = `
            <div class="p-6">
                <div class="flex justify-between items-center mb-5">
                    <h3 class="text-xl font-bold text-gray-800">Edit Video</h3>
                    <button onclick="ui.closeModal('edit-video-modal')" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times"></i></button>
                </div>
                <form id="edit-video-form" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Video Title</label>
                        <input type="text" id="ev-title" value="${video.title}" required class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none">
                        <p class="text-xs text-gray-500 mt-1">EX. 2026 F2 SEJ FEB WEEK 1 - BAB 1.3</p>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Upload Month</label>
                        <select id="ev-month" required class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none">
                            ${['January','February','March','April','May','June','July','August','September','October','November','December'].map(m => 
                                `<option value="${m}" ${video.month === m ? 'selected' : ''}>${m}</option>`
                            ).join('')}
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Video Link</label>
                        <input type="url" id="ev-url" value="${video.url}" required class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea id="ev-desc" rows="3" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none">${video.description || ''}</textarea>
                    </div>
                    <button type="submit" class="w-full bg-indigo-600 text-white font-medium py-2.5 rounded-lg hover:bg-indigo-700 transition mt-4 shadow-sm">Save Changes</button>
                </form>
            </div>
        `;
        ui.showModal('edit-video-modal', modalHtml);

        document.getElementById('edit-video-form').addEventListener('submit', (e) => {
            e.preventDefault();
            store.updateVideo(videoId, {
                title: document.getElementById('ev-title').value,
                month: document.getElementById('ev-month').value,
                url: document.getElementById('ev-url').value,
                description: document.getElementById('ev-desc').value
            });
            ui.closeModal('edit-video-modal');
            ui.showToast('Video updated successfully');
            TeacherPage.init();
        });
    },

    deleteVideo(videoId) {
        if (confirm('Are you sure you want to delete this video?')) {
            store.deleteVideo(videoId);
            ui.showToast('Video deleted');
            TeacherPage.init();
        }
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

    toggleSubject(subjectId) {
        // close all others
        const allContents = document.querySelectorAll('[id^="teacher-subj-content-"]');
        const allIcons = document.querySelectorAll('[id^="teacher-subj-icon-"]');
        
        const content = document.getElementById(`teacher-subj-content-${subjectId}`);
        const icon = document.getElementById(`teacher-subj-icon-${subjectId}`);
        
        const isHidden = content.classList.contains('hidden');
        
        allContents.forEach(c => c.classList.add('hidden'));
        allIcons.forEach(i => i.classList.remove('rotate-180'));
        
        if (isHidden) {
            content.classList.remove('hidden');
            icon.classList.add('rotate-180');
        }
    }
};
