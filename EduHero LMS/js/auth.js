// Authentication Logic
const auth = {
    SESSION_KEY: 'eduhero_session',

    login(email, password) {
        const user = store.getUserByEmail(email);
        if (user && user.password === password) {
            const sessionId = Date.now().toString(36) + Math.random().toString(36).substr(2);
            store.updateUser(user.id, { sessionId: sessionId });
            
            const sessionData = {
                id: user.id,
                role: user.role,
                name: user.name,
                sessionId: sessionId,
                loginTime: new Date().toISOString()
            };
            sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionData));
            return true;
        }
        return false;
    },

    logout() {
        sessionStorage.removeItem(this.SESSION_KEY);
        window.location.reload();
    },

    getCurrentUser() {
        const session = sessionStorage.getItem(this.SESSION_KEY);
        if (!session) return null;
        const sessionData = JSON.parse(session);
        
        const users = store.getUsers();
        const dbUser = users.find(u => u.id === sessionData.id);
        
        if (!dbUser) return null;

        // Single device check for students
        if (dbUser.role === 'student' && dbUser.sessionId && dbUser.sessionId !== sessionData.sessionId) {
            sessionStorage.removeItem(this.SESSION_KEY);
            setTimeout(() => {
                alert('You have been logged out because your account was accessed from another device.');
                window.location.reload();
            }, 100);
            return null;
        }

        return dbUser;
    },

    isAuthenticated() {
        return !!this.getCurrentUser();
    },

    hasRole(role) {
        const user = this.getCurrentUser();
        return user && user.role === role;
    }
};
