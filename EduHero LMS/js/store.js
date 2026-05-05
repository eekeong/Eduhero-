// Simple LocalStorage Database Wrapper
const DB_KEY = 'eduhero_db';

const defaultData = {
    users: [
        { id: 'u_1', name: 'Admin User', email: 'admin@eduhero.com', password: 'password', role: 'admin', subjects: [] },
        { id: 'u_2', name: 'Teacher Ali', email: 'teacher@eduhero.com', password: 'password', role: 'teacher', subjects: ['s_1'] },
        { id: 'u_3', name: 'Student Abu', email: 'student_code', password: 'password', role: 'student', subjects: ['s_1'] },
    ],
    subjects: [
        { id: 's_1', name: 'Math Form 1', level: 'Form 1', category: 'Math' },
        { id: 's_2', name: 'Science Year 5', level: 'Year 5', category: 'Science' },
    ],
    videos: [
        { id: 'v_1', subjectId: 's_1', teacherId: 'u_2', title: 'Math Basics', description: 'Introduction to math.', url: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ', date: new Date().toISOString(), views: 0 }
    ],
    comments: [],
    progress: [],
    settings: {
        logoUrl: '',
        systemName: 'EduHero'
    }
};

const store = {
    init() {
        if (!localStorage.getItem(DB_KEY)) {
            localStorage.setItem(DB_KEY, JSON.stringify(defaultData));
        } else {
            // Migration: fix old broken videos
            const data = JSON.parse(localStorage.getItem(DB_KEY));
            let modified = false;
            if (data.videos) {
                data.videos.forEach(v => {
                    // Replace videos that cause 150/153 embed error with a working video (Big Buck Bunny)
                    if (v.url.includes('t_o-62Tz5jE') || v.url.includes('NybHckSEQBI') || v.url.includes('M7FIvfx5J10') || v.url === 'asdasdas') {
                        v.url = 'https://www.youtube.com/watch?v=aqz-KE-bpKQ';
                        modified = true;
                    }
                });
            }
            // Migration: Seed subjects if missing
            const requiredLevels = ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'Year 6', 'Form 1', 'Form 2', 'Form 3', 'Form 4', 'Form 5'];
            const requiredCategories = ['BC', 'BM', 'BI', 'MM', 'SCI', 'SEJ', 'Short Course'];
            if (!data.subjects) data.subjects = [];
            
            requiredLevels.forEach(level => {
                requiredCategories.forEach(cat => {
                    const exists = data.subjects.find(s => s.level === level && s.category === cat);
                    if (!exists) {
                        data.subjects.push({
                            id: 's_' + Math.random().toString(36).substr(2, 9),
                            name: `${cat} ${level}`,
                            level: level,
                            category: cat
                        });
                        modified = true;
                    }
                });
            });

            // Migration: change student@eduhero.com to student_code
            if (data.users) {
                const studentUser = data.users.find(u => u.email === 'student@eduhero.com');
                if (studentUser) {
                    studentUser.email = 'student_code';
                    modified = true;
                }
            }

            // Migration: Add Year 1 BC April video
            if (data.videos && data.subjects && data.users) {
                const newVideoUrl = 'https://youtu.be/TxuYf1gv9SM';
                const hasVideo = data.videos.find(v => v.url === newVideoUrl);
                if (!hasVideo) {
                    const bcSubject = data.subjects.find(s => s.level === 'Year 1' && s.category === 'BC');
                    if (bcSubject) {
                        data.videos.push({
                            id: 'v_' + Math.random().toString(36).substr(2, 9),
                            subjectId: bcSubject.id,
                            teacherId: 'u_2',
                            title: 'Year 1 BC - April Lesson',
                            month: 'April',
                            description: 'Interactive lesson for Year 1 BC in April.',
                            url: newVideoUrl,
                            date: new Date().toISOString(),
                            views: 0
                        });
                        
                        // Assign this subject to the default student and teacher so it's visible
                        const studentUser = data.users.find(u => u.id === 'u_3' || u.role === 'student');
                        if (studentUser && !studentUser.subjects.includes(bcSubject.id)) {
                            studentUser.subjects.push(bcSubject.id);
                        }
                        const teacherUser = data.users.find(u => u.id === 'u_2' || u.role === 'teacher');
                        if (teacherUser && !teacherUser.subjects.includes(bcSubject.id)) {
                            teacherUser.subjects.push(bcSubject.id);
                        }
                        
                        modified = true;
                    }
                }
            }

            if (modified) {
                localStorage.setItem(DB_KEY, JSON.stringify(data));
            }
        }
    },
    
    getData() {
        return JSON.parse(localStorage.getItem(DB_KEY));
    },

    getSettings() {
        const data = this.getData();
        return data.settings || { logoUrl: '', systemName: 'EduHero' };
    },

    updateSettings(updates) {
        const data = this.getData();
        data.settings = { ...this.getSettings(), ...updates };
        this.saveData(data);
    },

    saveData(data) {
        localStorage.setItem(DB_KEY, JSON.stringify(data));
    },

    generateId(prefix) {
        return prefix + '_' + Math.random().toString(36).substr(2, 9);
    },

    // Users
    getUsers() { return this.getData().users; },
    getUserByEmail(email) { return this.getUsers().find(u => u.email === email); },
    addUser(user) {
        const data = this.getData();
        const newUser = { id: this.generateId('u'), subjects: [], ...user };
        data.users.push(newUser);
        this.saveData(data);
        return newUser;
    },
    updateUser(id, updates) {
        const data = this.getData();
        const idx = data.users.findIndex(u => u.id === id);
        if (idx !== -1) {
            data.users[idx] = { ...data.users[idx], ...updates };
            this.saveData(data);
        }
    },
    deleteUser(id) {
        const data = this.getData();
        data.users = data.users.filter(u => u.id !== id);
        this.saveData(data);
    },

    // Subjects
    getSubjects() { 
        const subjects = this.getData().subjects || [];
        const levelOrder = ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'Year 6', 'Form 1', 'Form 2', 'Form 3', 'Form 4', 'Form 5'];
        return subjects.sort((a, b) => {
            let idxA = levelOrder.indexOf(a.level);
            let idxB = levelOrder.indexOf(b.level);
            if (idxA === -1) idxA = 999;
            if (idxB === -1) idxB = 999;
            if (idxA === idxB) return a.name.localeCompare(b.name);
            return idxA - idxB;
        });
    },
    addSubject(subject) {
        const data = this.getData();
        const newSubject = { id: this.generateId('s'), color: '#4F46E5', ...subject };
        data.subjects.push(newSubject);
        this.saveData(data);
        return newSubject;
    },
    updateSubject(id, updates) {
        const data = this.getData();
        const idx = data.subjects.findIndex(s => s.id === id);
        if (idx !== -1) {
            data.subjects[idx] = { ...data.subjects[idx], ...updates };
            this.saveData(data);
        }
    },
    deleteSubject(id) {
        const data = this.getData();
        data.subjects = data.subjects.filter(s => s.id !== id);
        // Also remove subject from users and delete its videos
        data.users.forEach(u => {
            u.subjects = u.subjects.filter(sid => sid !== id);
        });
        data.videos = data.videos.filter(v => v.subjectId !== id);
        this.saveData(data);
    },

    // Videos
    getVideos() { return this.getData().videos; },
    addVideo(video) {
        const data = this.getData();
        const newVideo = { id: this.generateId('v'), date: new Date().toISOString(), views: 0, ...video };
        data.videos.push(newVideo);
        this.saveData(data);
        return newVideo;
    },
    updateVideo(id, updates) {
        const data = this.getData();
        const idx = data.videos.findIndex(v => v.id === id);
        if (idx !== -1) {
            data.videos[idx] = { ...data.videos[idx], ...updates };
            this.saveData(data);
        }
    },
    incrementVideoView(id) {
        const data = this.getData();
        const idx = data.videos.findIndex(v => v.id === id);
        if (idx !== -1) {
            data.videos[idx].views = (data.videos[idx].views || 0) + 1;
            this.saveData(data);
        }
    },
    deleteVideo(id) {
        const data = this.getData();
        data.videos = data.videos.filter(v => v.id !== id);
        data.comments = (data.comments || []).filter(c => c.videoId !== id);
        this.saveData(data);
    },

    // Comments
    getComments(videoId) { 
        return (this.getData().comments || []).filter(c => c.videoId === videoId); 
    },
    addComment(videoId, userId, text) {
        const data = this.getData();
        if (!data.comments) data.comments = [];
        const newComment = { id: this.generateId('c'), videoId, userId, text, date: new Date().toISOString() };
        data.comments.push(newComment);
        this.saveData(data);
        return newComment;
    },

    // Progress
    updateProgress(studentId, videoId, percentage) {
        const data = this.getData();
        if (!data.progress) data.progress = [];
        const idx = data.progress.findIndex(p => p.studentId === studentId && p.videoId === videoId);
        if (idx !== -1) {
            if (percentage > data.progress[idx].percentage) {
                data.progress[idx].percentage = percentage;
                data.progress[idx].lastUpdated = new Date().toISOString();
                this.saveData(data);
            }
        } else {
            data.progress.push({ studentId, videoId, percentage, lastUpdated: new Date().toISOString() });
            this.saveData(data);
        }
    },
    getProgress(studentId, videoId) {
        const data = this.getData();
        if (!data.progress) return 0;
        const prog = data.progress.find(p => p.studentId === studentId && p.videoId === videoId);
        return prog ? prog.percentage : 0;
    },
    getAllProgressForVideo(videoId) {
        const data = this.getData();
        if (!data.progress) return [];
        return data.progress.filter(p => p.videoId === videoId);
    }
};

store.init();
