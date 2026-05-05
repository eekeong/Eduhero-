// Reusable UI Components and Utilities

const ui = {
    showToast(message, type = 'success') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        
        const colors = {
            success: 'bg-green-100 text-green-800 border-green-200',
            error: 'bg-red-100 text-red-800 border-red-200',
            info: 'bg-blue-100 text-blue-800 border-blue-200'
        };
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            info: 'fa-info-circle'
        };

        toast.className = `flex items-center p-4 mb-2 rounded-lg border shadow-sm fade-in ${colors[type]}`;
        toast.innerHTML = `
            <i class="fas ${icons[type]} flex-shrink-0 w-5 h-5 mr-3"></i>
            <div class="text-sm font-medium">${message}</div>
            <button class="ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 inline-flex h-8 w-8 hover:bg-white/20 transition-colors" onclick="this.parentElement.remove()">
                <i class="fas fa-times text-current"></i>
            </button>
        `;
        
        container.appendChild(toast);
        setTimeout(() => {
            if (toast.parentElement) {
                toast.style.opacity = '0';
                toast.style.transform = 'translateY(-10px)';
                toast.style.transition = 'all 0.3s ease';
                setTimeout(() => toast.remove(), 300);
            }
        }, 3000);
    },

    showModal(id, content) {
        const container = document.getElementById('modals-container');
        const modal = document.createElement('div');
        modal.id = id;
        modal.className = `fixed inset-0 z-50 flex items-center justify-center fade-in bg-gray-900 bg-opacity-50 backdrop-blur-sm px-4`;
        modal.innerHTML = `
            <div class="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all">
                ${content}
            </div>
        `;
        container.appendChild(modal);

        // Click outside to close
        modal.addEventListener('mousedown', (e) => {
            if (e.target === modal) this.closeModal(id);
        });
    },

    closeModal(id) {
        const modal = document.getElementById(id);
        if (modal) {
            modal.style.opacity = '0';
            setTimeout(() => modal.remove(), 200);
        }
    },

    // Convert YouTube or other video links to embed URL
    getEmbedUrl(url) {
        if (!url) return '';
        let embedUrl = url;
        try {
            let cleanUrl = url;
            if (!cleanUrl.startsWith('http')) cleanUrl = 'https://' + cleanUrl;
            
            const origin = window.location.origin !== 'null' ? window.location.origin : 'https://eduhero.com';
            const params = `rel=0&modestbranding=1&showinfo=0&fs=1&enablejsapi=1&autoplay=1&cc_load_policy=0&iv_load_policy=3&playsinline=1&origin=${encodeURIComponent(origin)}`;
            
            if (cleanUrl.includes('youtube.com/watch')) {
                const urlObj = new URL(cleanUrl);
                const videoId = urlObj.searchParams.get('v');
                if (videoId) embedUrl = `https://www.youtube.com/embed/${videoId}?${params}`;
            } else if (cleanUrl.includes('youtu.be/')) {
                const videoId = cleanUrl.split('youtu.be/')[1].split('?')[0];
                if (videoId) embedUrl = `https://www.youtube.com/embed/${videoId}?${params}`;
            } else if (cleanUrl.includes('vimeo.com/')) {
                const videoId = cleanUrl.split('vimeo.com/')[1].split('/')[0];
                if (videoId) embedUrl = `https://player.vimeo.com/video/${videoId}`;
            } else if (cleanUrl.includes('youtube.com/embed/')) {
                embedUrl = cleanUrl;
                embedUrl = embedUrl.replace('fs=0', 'fs=1');
                if (!embedUrl.includes('fs=1')) embedUrl += (embedUrl.includes('?') ? '&' : '?') + 'fs=1';
                if (!embedUrl.includes('enablejsapi=1')) embedUrl += '&enablejsapi=1';
                if (!embedUrl.includes('autoplay=1')) embedUrl += '&autoplay=1';
                if (!embedUrl.includes('playsinline=1')) embedUrl += '&playsinline=1';
                if (!embedUrl.includes('origin=')) embedUrl += `&origin=${encodeURIComponent(origin)}`;
            }
        } catch (e) {
            console.error("Invalid URL", e);
        }
        return embedUrl;
    },

    getVideoThumbnail(url) {
        if (!url) return '';
        try {
            let cleanUrl = url;
            if (!cleanUrl.startsWith('http')) cleanUrl = 'https://' + cleanUrl;
            
            if (cleanUrl.includes('youtube.com/watch')) {
                const urlObj = new URL(cleanUrl);
                const videoId = urlObj.searchParams.get('v');
                if (videoId) return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
            } else if (cleanUrl.includes('youtu.be/')) {
                const videoId = cleanUrl.split('youtu.be/')[1].split('?')[0];
                if (videoId) return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
            } else if (cleanUrl.includes('youtube.com/embed/')) {
                const videoId = cleanUrl.split('youtube.com/embed/')[1].split('?')[0];
                if (videoId) return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
            }
        } catch (e) {
            console.error("Invalid URL for thumbnail", e);
        }
        return 'https://via.placeholder.com/320x180.png?text=Video';
    },

    renderVideoPlayer(url, videoId = 'default') {
        const embedUrl = this.getEmbedUrl(url);
        if (!embedUrl || !embedUrl.includes('embed') && !embedUrl.includes('video')) {
            return `
                <div class="video-container bg-gray-900 rounded-lg shadow-md flex items-center justify-center">
                    <div class="text-center p-6">
                        <i class="fas fa-exclamation-triangle text-4xl text-yellow-500 mb-3"></i>
                        <h3 class="text-white font-bold">Invalid Video Link</h3>
                        <p class="text-gray-400 text-sm mt-2">Please ask your teacher to check the video URL.</p>
                    </div>
                </div>
            `;
        }

        return `
            <div id="video-wrapper-${videoId}" class="video-container bg-black rounded-lg shadow-md relative w-full aspect-video overflow-hidden group">
                <iframe id="ytplayer-${videoId}" class="w-full h-full absolute inset-0" src="${embedUrl}" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    allowfullscreen>
                </iframe>
                <!-- Block top bar (Channel icon, Title, Share) -->
                <div class="absolute top-0 left-0 w-full h-[80px] z-20" oncontextmenu="return false;" title="Protected"></div>
                
                <!-- Block bottom-left 'Watch on YouTube' / 'Copy Link' pill (appears when paused) -->
                <div class="absolute bottom-[50px] left-0 w-[280px] h-[90px] z-20" oncontextmenu="return false;" title="Protected"></div>
                
                <!-- Block bottom-right youtube watermark -->
                <div class="absolute bottom-[50px] right-0 w-[140px] h-[90px] z-20" oncontextmenu="return false;" title="Protected"></div>
                
                <!-- Block YouTube logo on the control bar -->
                <div class="absolute bottom-0 right-[45px] w-[55px] h-[50px] z-20 hidden md:block" oncontextmenu="return false;" title="Protected"></div>
            </div>
        `;
    },

    showChangePasswordModal() {
        const modalHtml = `
            <div class="p-6">
                <div class="flex justify-between items-center mb-5">
                    <h3 class="text-xl font-bold text-gray-800">Change Password</h3>
                    <button onclick="ui.closeModal('change-pw-modal')" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times"></i></button>
                </div>
                <form id="change-pw-form" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                        <input type="password" id="cpw-new" required class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                        <input type="password" id="cpw-confirm" required class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none">
                    </div>
                    <button type="submit" class="w-full bg-indigo-600 text-white font-medium py-2.5 rounded-lg hover:bg-indigo-700 transition mt-4 shadow-sm">Update Password</button>
                </form>
            </div>
        `;
        this.showModal('change-pw-modal', modalHtml);

        document.getElementById('change-pw-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const newPw = document.getElementById('cpw-new').value;
            const confirmPw = document.getElementById('cpw-confirm').value;
            
            if (newPw !== confirmPw) {
                this.showToast('Passwords do not match!', 'error');
                return;
            }

            const user = auth.getCurrentUser();
            store.updateUser(user.id, { password: newPw });
            this.closeModal('change-pw-modal');
            this.showToast('Password updated successfully');
        });
    },

    showForceChangePasswordModal() {
        const modalHtml = `
            <div class="p-6">
                <div class="flex justify-between items-center mb-5">
                    <h3 class="text-xl font-bold text-gray-800">Welcome! Please Change Your Password</h3>
                </div>
                <p class="text-sm text-gray-600 mb-4">For security reasons, you must change your default password before continuing.</p>
                <form id="force-change-pw-form" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                        <input type="password" id="fcpw-new" required class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                        <input type="password" id="fcpw-confirm" required class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none">
                    </div>
                    <button type="submit" class="w-full bg-indigo-600 text-white font-medium py-2.5 rounded-lg hover:bg-indigo-700 transition mt-4 shadow-sm">Update Password</button>
                </form>
            </div>
        `;
        // Use showModal but remove click outside to close
        const container = document.getElementById('modals-container');
        const modal = document.createElement('div');
        modal.id = 'force-change-pw-modal';
        modal.className = `fixed inset-0 z-50 flex items-center justify-center fade-in bg-gray-900 bg-opacity-80 backdrop-blur-sm px-4`;
        modal.innerHTML = `
            <div class="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all">
                ${modalHtml}
            </div>
        `;
        container.appendChild(modal);

        document.getElementById('force-change-pw-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const newPw = document.getElementById('fcpw-new').value;
            const confirmPw = document.getElementById('fcpw-confirm').value;
            
            if (newPw !== confirmPw) {
                this.showToast('Passwords do not match!', 'error');
                return;
            }

            const user = auth.getCurrentUser();
            store.updateUser(user.id, { password: newPw });
            this.closeModal('force-change-pw-modal');
            this.showToast('Password updated successfully');
            
            // Re-render app view
            App.setupAppView();
        });
    }
};
