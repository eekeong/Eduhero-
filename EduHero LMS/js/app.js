// Main Application Logic
const App = {
    init() {
        store.init(); // Ensure store is initialized first
        this.applySystemSettings();
        this.bindEvents();
        this.checkAuthAndRender();
    },

    applySystemSettings() {
        const settings = store.getSettings();
        const logoUrl = settings.logoUrl;
        const systemName = settings.systemName || 'EduHero';

        // Update Names
        const loginSystemName = document.getElementById('login-system-name');
        if (loginSystemName) loginSystemName.textContent = systemName + ' LMS';
        const sidebarSystemName = document.getElementById('sidebar-system-name');
        if (sidebarSystemName) sidebarSystemName.textContent = systemName;
        const mobileSystemName = document.getElementById('mobile-system-name');
        if (mobileSystemName) mobileSystemName.textContent = systemName;
        document.title = systemName + ' LMS';

        // Update Logos
        const setLogo = (wrapperId, iconId) => {
            const wrapper = document.getElementById(wrapperId);
            const icon = document.getElementById(iconId);
            if (!wrapper) return;
            
            // Remove existing image if any
            const existingImg = wrapper.querySelector('img');
            if (existingImg) existingImg.remove();

            if (logoUrl) {
                if (icon) icon.classList.add('hidden');
                const img = document.createElement('img');
                img.src = logoUrl;
                img.className = wrapperId === 'login-logo-container' ? 'w-full h-full object-cover rounded-full' : 'h-8 max-w-[120px] object-contain';
                wrapper.appendChild(img);
            } else {
                if (icon) icon.classList.remove('hidden');
            }
        };

        setLogo('login-logo-container', 'login-logo-icon');
        setLogo('sidebar-logo-wrapper', 'sidebar-logo-icon');
        setLogo('mobile-logo-wrapper', 'mobile-logo-icon');

        // Apply System Theme Color
        const systemColor = settings.systemColor || '#4F46E5';
        const systemColor2 = settings.systemColor2 || '#7C3AED';
        
        const hexToRgb = (h) => {
            let r = 0, g = 0, b = 0;
            if (h.length === 4) { r = parseInt(h[1] + h[1], 16); g = parseInt(h[2] + h[2], 16); b = parseInt(h[3] + h[3], 16); }
            else if (h.length === 7) { r = parseInt(h[1] + h[2], 16); g = parseInt(h[3] + h[4], 16); b = parseInt(h[5] + h[6], 16); }
            return `${r}, ${g}, ${b}`;
        };
        const rgb = hexToRgb(systemColor);
        
        let styleEl = document.getElementById('dynamic-theme-style');
        if (!styleEl) {
            styleEl = document.createElement('style');
            styleEl.id = 'dynamic-theme-style';
            document.head.appendChild(styleEl);
        }
        
        styleEl.textContent = `
            .text-indigo-600 { color: ${systemColor} !important; }
            .bg-indigo-600 { background-color: ${systemColor} !important; }
            .border-indigo-600 { border-color: ${systemColor} !important; }
            .hover\\:bg-indigo-700:hover { background-color: rgba(${rgb}, 0.8) !important; }
            .hover\\:text-indigo-700:hover { color: rgba(${rgb}, 0.9) !important; }
            .hover\\:text-indigo-600:hover { color: ${systemColor} !important; }
            .focus\\:ring-indigo-500:focus { --tw-ring-color: rgba(${rgb}, 0.5) !important; }
            .focus\\:border-indigo-500:focus { border-color: ${systemColor} !important; }
            .bg-indigo-50 { background-color: rgba(${rgb}, 0.1) !important; }
            .bg-indigo-50\\/50 { background-color: rgba(${rgb}, 0.05) !important; }
            .text-indigo-700 { color: rgba(${rgb}, 0.9) !important; }
            .text-indigo-500 { color: rgba(${rgb}, 0.8) !important; }
            .bg-gradient-to-br.from-indigo-600 { --tw-gradient-from: ${systemColor} !important; --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgba(${rgb}, 0)); }
            .bg-gradient-to-r.from-indigo-600 { --tw-gradient-from: ${systemColor} !important; --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgba(${rgb}, 0)); }
            .bg-indigo-100 { background-color: rgba(${rgb}, 0.2) !important; }
            .border-indigo-500 { border-color: rgba(${rgb}, 0.8) !important; }
            .border-indigo-200 { border-color: rgba(${rgb}, 0.3) !important; }
            .text-indigo-800 { color: rgba(${rgb}, 0.95) !important; }
            .to-purple-700 { --tw-gradient-to: ${systemColor2} !important; }
            .to-purple-600 { --tw-gradient-to: ${systemColor2} !important; }
            .to-purple-500 { --tw-gradient-to: ${systemColor2} !important; }
            .from-indigo-400 { --tw-gradient-from: ${systemColor} !important; --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgba(${rgb}, 0)); }
        `;
    },

    bindEvents() {
        document.getElementById('login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            
            if (auth.login(email, password)) {
                ui.showToast('Login successful!');
                this.checkAuthAndRender();
            } else {
                ui.showToast('Invalid email or password', 'error');
            }
        });

        document.getElementById('logout-btn').addEventListener('click', () => {
            auth.logout();
        });

        // Mobile menu toggle
        const mobileBtn = document.getElementById('mobile-menu-btn');
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebar-overlay');

        const toggleMenu = () => {
            const isClosed = sidebar.classList.contains('-translate-x-full');
            if (isClosed) {
                sidebar.classList.remove('-translate-x-full');
                overlay.classList.remove('hidden');
            } else {
                sidebar.classList.add('-translate-x-full');
                overlay.classList.add('hidden');
            }
        };

        mobileBtn.addEventListener('click', toggleMenu);
        overlay.addEventListener('click', toggleMenu);

        // Make sidebar absolute on mobile
        const adjustSidebar = () => {
            if (window.innerWidth < 768) {
                sidebar.classList.add('absolute', '-translate-x-full', 'z-40');
            } else {
                sidebar.classList.remove('absolute', '-translate-x-full', 'z-40');
                overlay.classList.add('hidden');
            }
        };
        window.addEventListener('resize', adjustSidebar);
        adjustSidebar(); // initial call
    },

    checkAuthAndRender() {
        const viewLogin = document.getElementById('view-login');
        const viewApp = document.getElementById('view-app');

        if (auth.isAuthenticated()) {
            viewLogin.classList.remove('active');
            viewApp.classList.add('active');
            this.setupAppView();
        } else {
            viewApp.classList.remove('active');
            viewLogin.classList.add('active');
        }
    },

    setupAppView() {
        const user = auth.getCurrentUser();
        if (!user) return auth.logout();

        if ((user.role === 'student' || user.role === 'teacher') && user.password === 'password') {
            ui.showForceChangePasswordModal();
            return;
        }

        // Set user info
        document.getElementById('user-name').textContent = user.name;
        document.getElementById('user-role').textContent = user.role;
        const initialContainer = document.getElementById('user-initial');
        
        const settings = store.getSettings();
        if (user.role === 'student' && settings.studentAvatarUrl) {
            initialContainer.innerHTML = `<img src="${settings.studentAvatarUrl}" class="w-full h-full object-cover rounded-full" alt="Student Avatar">`;
        } else {
            initialContainer.textContent = user.name.charAt(0).toUpperCase();
        }

        // Set nav menu
        const navMenu = document.getElementById('nav-menu');
        const contentArea = document.getElementById('page-content');
        
        let navItems = [];
        if (user.role === 'admin') {
            navItems = [
                { id: 'dashboard', icon: 'fa-chart-pie', label: 'Dashboard' },
                { id: 'subjects', icon: 'fa-book', label: 'Subjects' }
            ];
            contentArea.innerHTML = AdminPage.render();
            AdminPage.init();
        } else if (user.role === 'teacher') {
            navItems = [
                { id: 'dashboard', icon: 'fa-chalkboard-teacher', label: 'My Subjects' }
            ];
            contentArea.innerHTML = TeacherPage.render();
            TeacherPage.init();
        } else if (user.role === 'student') {
            navItems = [
                { id: 'dashboard', icon: 'fa-book-reader', label: 'My Learning' }
            ];
            contentArea.innerHTML = StudentPage.render();
            StudentPage.init();
        }

        this.renderNavMenu(navItems, 'dashboard');
    },

    renderNavMenu(navItems, activeId) {
        const navMenu = document.getElementById('nav-menu');
        navMenu.innerHTML = navItems.map(item => `
            <a href="#" onclick="App.switchView('${item.id}'); return false;" class="flex items-center px-3 py-2.5 rounded-lg ${item.id === activeId ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-gray-600 hover:bg-gray-50 font-medium'} transition-colors" id="nav-item-${item.id}">
                <i class="fas ${item.icon} w-5 h-5 mr-3 text-center"></i>
                ${item.label}
            </a>
        `).join('');
    },

    switchView(viewId) {
        // Update active nav style
        document.querySelectorAll('#nav-menu a').forEach(a => {
            a.classList.remove('bg-indigo-50', 'text-indigo-700', 'font-bold');
            a.classList.add('text-gray-600', 'hover:bg-gray-50', 'font-medium');
        });
        const activeItem = document.getElementById(`nav-item-${viewId}`);
        if (activeItem) {
            activeItem.classList.remove('text-gray-600', 'hover:bg-gray-50', 'font-medium');
            activeItem.classList.add('bg-indigo-50', 'text-indigo-700', 'font-bold');
        }

        // Specific view logic
        const user = auth.getCurrentUser();
        if (user && user.role === 'admin') {
            if (viewId === 'dashboard') {
                document.getElementById('admin-dashboard-wrapper').classList.remove('hidden');
                document.getElementById('admin-subjects-wrapper').classList.add('hidden');
            } else if (viewId === 'subjects') {
                document.getElementById('admin-dashboard-wrapper').classList.add('hidden');
                document.getElementById('admin-subjects-wrapper').classList.remove('hidden');
            }
        }
    }
};

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
