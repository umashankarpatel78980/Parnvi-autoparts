// User management utilities for authentication

const USERS_STORAGE_KEY = 'parnvi_users';
const DEFAULT_ADMIN = {
    id: '1',
    username: 'admin',
    password: 'admin123', // In production, this should be hashed
    role: 'admin',
    name: 'Admin User',
    email: 'admin@parnvi.com'
};

/**
 * Initialize users in localStorage if not present
 */
export const initializeUsers = () => {
    const existingUsers = localStorage.getItem(USERS_STORAGE_KEY);
    if (!existingUsers) {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([DEFAULT_ADMIN]));
    }
};

/**
 * Get all users from localStorage
 */
export const getUsers = () => {
    const users = localStorage.getItem(USERS_STORAGE_KEY);
    return users ? JSON.parse(users) : [];
};

/**
 * Validate user credentials
 * @param {string} username 
 * @param {string} password 
 * @returns {Object|null} User object if valid, null otherwise
 */
export const validateCredentials = (username, password) => {
    const users = getUsers();
    const user = users.find(
        u => u.username === username && u.password === password
    );

    if (user) {
        // Return user without password
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    return null;
};

/**
 * Check if user has admin role
 * @param {Object} user 
 * @returns {boolean}
 */
export const isAdmin = (user) => {
    return user && user.role === 'admin';
};

/**
 * Add a new user (for future expansion)
 * @param {Object} userData 
 * @returns {Object} Created user
 */
export const addUser = (userData) => {
    const users = getUsers();
    const newUser = {
        id: Date.now().toString(),
        ...userData
    };
    users.push(newUser);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
};
