import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const token = localStorage.getItem('token');
        return token ? { token } : null;
    });

    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token && user) {
            setUser(null);
        }
        setIsInitialized(true);
    }, []);

    const login = useCallback(async (userData) => {
        setUser(userData);
        localStorage.setItem('token', userData.token);
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        localStorage.removeItem('token');
    }, []);

    if (!isInitialized) {
        return <div className="min-h-screen bg-[#0864c7] flex items-center justify-center">
            <div className="text-white text-xl">Loading...</div>
        </div>;
    }

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);