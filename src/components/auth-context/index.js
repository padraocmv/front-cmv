
import React, { createContext, useContext, useState } from 'react';
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [unidadeId, setUnidadeId] = useState(null);
    const [userId, setUserId] = useState(null); 

    const login = (id) => { 
        setIsAuthenticated(true);
        setUserId(id); 
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUnidadeId(null);
        setUserId(null); 
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, unidadeId, setUnidadeId, userId }}> {/* Adicione userId aqui */}
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};