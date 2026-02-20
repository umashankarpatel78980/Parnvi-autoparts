import React, { createContext, useState, useContext, useEffect } from 'react';
import { validateCredentials, initializeUsers, isAdmin } from '../utils/users';

const AuthContext = createContext(null);

const AUTH_STORAGE_KEY = 'parnvi_auth';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Initialize users and check for existing session on mount
    useEffect(() => {
        initializeUsers();
        checkExistingSession();
    }, []);

    const checkExistingSession = () => {
        try {
            const authData = localStorage.getItem(AUTH_STORAGE_KEY);
            if (authData) {
                const userData = JSON.parse(authData);
                // Verify user still has admin role
                if (isAdmin(userData)) {
                    setUser(userData);
                    setIsAuthenticated(true);
                } else {
                    // Clear invalid session
                    localStorage.removeItem(AUTH_STORAGE_KEY);
                }
            }
        } catch (error) {
            console.error('Error checking session:', error);
            localStorage.removeItem(AUTH_STORAGE_KEY);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (username, password) => {
        try {
            const validatedUser = validateCredentials(username, password);

            if (!validatedUser) {
                throw new Error('Invalid username or password');
            }

            // Check if user has admin role
            if (!isAdmin(validatedUser)) {
                throw new Error('Access denied. Admin role required.');
            }

            // Store auth data
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(validatedUser));
            setUser(validatedUser);
            setIsAuthenticated(true);

            return { success: true, user: validatedUser };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const logout = () => {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        setUser(null);
        setIsAuthenticated(false);
    };

    const value = {
        user,
        isAuthenticated,
        isLoading,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;
