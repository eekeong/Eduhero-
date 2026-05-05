const StudentPage = {
    render() {
        return `
            <div class="space-y-6 fade-in">
                <div>
                    <h2 class="text-2xl font-bold text-gray-800">My Learning Dashboard</h2>
                    <p class="text-gray-500 text-sm">Welcome back! Continue learning your assigned subjects.</p>
                </div>

                <div id="student-subjects" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <!-- Subject cards -->
                </div>

                <div id="student-subject-view" class="hidden space-y-6">
                    <!-- Subject detail view -->
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

        const container = document.getElementById('student-subjects');
        const detailView = document.getElementById('student-subject-view');
        
        detailView.classList.add('hidden');
        container.classList.remove('hidden');

        if (mySubjects.length === 0) {
            container.innerHTML = `
                <div class="col-span-full bg-white rounded-xl p-10 text-center shadow-sm border border-gray-100">
                    <div class="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-5">
                        <i class="fas fa-book-reader text-3xl text-blue-500"></i>
                    </div>
                    <h3 class="text-xl font-bold text-gray-800 mb-2">No Subjects Yet</h3>
                    <p class="text-gray-500">You haven't been assigned any subjects yet. Check back later!</p>
                </div>
            `;
            return;
        }

        const html = mySubjects.map(subject => {
            const videoCount = allVideos.filter(v => v.subjectId === subject.id).length;
            return `
            <div class="bg-white border border-gray-200 rounded-xl mb-3 overflow-hidden transition-all shadow-sm hover:shadow-md">
                <div class="p-4 flex items-center justify-between cursor-pointer transition-colors" style="border-left: 4px solid ${subject.color || '#4f46e5'}" onclick="StudentPage.toggleSubject('${subject.id}')">
                    <div class="flex items-center gap-4">
                        <div class="w-10 h-10 rounded-lg flex items-center justify-center shadow-sm" style="background-color: ${(subject.color || '#4f46e5')}20; color: ${subject.color || '#4f46e5'}">
                            <i class="fas fa-book text-lg"></i>
                        </div>
                        <div>
                            <h4 class="font-bold text-gray-800">${subject.name}</h4>
                            <p class="text-xs text-gray-500 mt-1">${subject.level} &bull; ${subject.category}</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-4">
                        <span class="text-xs font-medium px-3 py-1 rounded-full border hidden md:inline-block" style="background-color: ${(subject.color || '#4f46e5')}10; color: ${subject.color || '#4f46e5'}; border-color: ${(subject.color || '#4f46e5')}30">${videoCount} Lessons</span>
                        <div class="w-8 h-8 rounded-full flex items-center justify-center bg-white border border-gray-200 text-gray-500 shadow-sm ml-2">
                            <i class="fas fa-chevron-down transition-transform duration-300" id="student-subj-icon-${subject.id}"></i>
                        </div>
                    </div>
                </div>
                <div id="student-subj-content-${subject.id}" class="hidden border-t border-gray-100 p-6 bg-white"></div>
            </div>
            `;
        }).join('');

        container.innerHTML = html;
        container.classList.remove('grid', 'grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3', 'gap-6');
    },

    toggleSubject(subjectId) {
        const allContents = document.querySelectorAll('[id^="student-subj-content-"]');
        const allIcons = document.querySelectorAll('[id^="student-subj-icon-"]');
        
        const content = document.getElementById(`student-subj-content-${subjectId}`);
        const icon = document.getElementById(`student-subj-icon-${subjectId}`);
        
        const isHidden = content.classList.contains('hidden');
        
        allContents.forEach(c => c.classList.add('hidden'));
        allIcons.forEach(i => i.classList.remove('rotate-180'));
        
        if (isHidden) {
            content.classList.remove('hidden');
            icon.classList.add('rotate-180');
            this.openSubject(subjectId);
        }
    },

    openSubject(subjectId) {
        const subject = store.getSubjects().find(s => s.id === subjectId);
        const videos = store.getVideos().filter(v => v.subjectId === subjectId);
        const detailView = document.getElementById(`student-subj-content-${subjectId}`);

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
                    <div class="bg-white border border-gray-200 rounded-xl p-5 hover:border-indigo-300 transition-colors cursor-pointer flex items-center shadow-sm" onclick="StudentPage.openSubjectTeacher('${subjectId}', '${tId}')">
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
        const detailView = document.getElementById(`student-subj-content-${subjectId}`);

        const monthsMap = {};
        videos.forEach(v => {
            const m = v.month || new Date(v.date).toLocaleDateString('default', { month: 'long', year: 'numeric' });
            if (!monthsMap[m]) monthsMap[m] = { name: m, videos: [] };
            monthsMap[m].videos.push(v);
        });

        let contentHtml = Object.keys(monthsMap).map(key => {
            const m = monthsMap[key];
            return `
                <div class="bg-white border border-gray-200 rounded-xl p-5 hover:border-indigo-300 transition-colors cursor-pointer flex items-center shadow-sm" onclick="StudentPage.openSubjectTeacherMonth('${subjectId}', '${teacherId}', '${key}')">
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
                <button onclick="StudentPage.openSubject('${subjectId}')" class="flex items-center text-indigo-600 font-medium hover:text-indigo-800 transition mr-4 bg-indigo-50 px-3 py-1.5 rounded-lg text-sm">
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

        const detailView = document.getElementById(`student-subj-content-${subjectId}`);

        let videosHtml = videos.map(video => `
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-4">
                <div class="p-4 flex flex-col md:flex-row gap-4 items-center cursor-pointer hover:bg-gray-50 transition-colors group" onclick="StudentPage.playVideo('${video.id}', '${video.url}')">
                    <div class="w-full md:w-48 h-28 bg-gray-200 rounded-lg overflow-hidden relative flex-shrink-0">
                        <img src="${ui.getVideoThumbnail(video.url)}" class="w-full h-full object-cover" alt="Thumbnail">
                        <div class="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center group-hover:bg-opacity-40 transition-all">
                            <i class="fas fa-play-circle text-white text-3xl opacity-90 group-hover:scale-110 transition-transform"></i>
                        </div>
                    </div>
                    <div class="flex-grow">
                        <h4 class="text-lg font-bold text-gray-800">${video.title}</h4>
                        <p class="text-gray-600 text-sm mt-1 line-clamp-2">${video.description || 'No description provided.'}</p>
                    </div>
                    <div class="text-xs text-gray-400 font-medium md:text-right whitespace-nowrap min-w-[120px]">
                        <div class="mb-1"><i class="fas fa-calendar-alt mr-1"></i> ${new Date(video.date).toLocaleDateString()}</div>
                        <div>${new Date(video.date).toLocaleTimeString()}</div>
                    </div>
                </div>
                <div id="video-container-${video.id}" class="bg-gray-900 hidden w-full"></div>
            </div>
        `).join('');

        detailView.innerHTML = `
            <div class="flex items-center mb-4">
                <button onclick="StudentPage.openSubjectTeacher('${subjectId}', '${teacherId}')" class="flex items-center text-indigo-600 font-medium hover:text-indigo-800 transition mr-4 bg-indigo-50 px-3 py-1.5 rounded-lg text-sm">
                    <i class="fas fa-arrow-left mr-2"></i> Back
                </button>
                <p class="text-sm font-medium text-gray-500">Teacher: <span class="text-gray-800">${teacher ? teacher.name : 'Unknown'}</span> &bull; Month: <span class="text-gray-800">${monthKey}</span></p>
            </div>
            <div class="space-y-4 mt-4">
                ${videosHtml}
            </div>
        `;
    },

    playVideo(videoId, url) {
        store.incrementVideoView(videoId);
        
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

        ui.showToast('Enjoy learning!');
        
        if (url.includes('youtube.com') || url.includes('youtu.be')) {
            this.setupProgressTracking(videoId);
        }
    },

    setupProgressTracking(videoId) {
        if (!window.YT || !window.YT.Player) {
            if (!document.getElementById('yt-api-script')) {
                const tag = document.createElement('script');
                tag.id = 'yt-api-script';
                tag.src = "https://www.youtube.com/iframe_api";
                const firstScriptTag = document.getElementsByTagName('script')[0];
                firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
            }
            const checkYt = setInterval(() => {
                if (window.YT && window.YT.Player) {
                    clearInterval(checkYt);
                    this.initPlayer(videoId);
                }
            }, 500);
        } else {
            this.initPlayer(videoId);
        }
    },

    initPlayer(videoId) {
        const studentId = auth.getCurrentUser().id;
        let progressInterval;
        
        new YT.Player(`ytplayer-${videoId}`, {
            events: {
                'onStateChange': (event) => {
                    if (event.data === YT.PlayerState.PLAYING) {
                        progressInterval = setInterval(() => {
                            if (event.target && event.target.getCurrentTime) {
                                const current = event.target.getCurrentTime();
                                const duration = event.target.getDuration();
                                if (duration > 0) {
                                    let percentage = Math.floor((current / duration) * 100);
                                    if (percentage > 100) percentage = 100;
                                    const currentSaved = store.getProgress(studentId, videoId);
                                    if (percentage > currentSaved) {
                                        store.updateProgress(studentId, videoId, percentage);
                                    }
                                }
                            }
                        }, 5000);
                    } else {
                        if (progressInterval) clearInterval(progressInterval);
                    }
                }
            }
        });
    }
};
