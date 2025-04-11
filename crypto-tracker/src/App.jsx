import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import Database from './components/Database';
import Search from './components/Search';
import ListDetail from './components/ListDetail';
import EditList from './components/EditList';

function ProtectedRoute({ children }) {
    const { user } = useAuth();
    const [isChecking, setIsChecking] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login', { replace: true });
        }
        setIsChecking(false);
    }, [navigate]);

    if (isChecking) {
        return <div className="min-h-screen bg-[#0864c7] flex items-center justify-center">
            <div className="text-white text-xl">Loading...</div>
        </div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="min-h-screen bg-gray-100">
                    <Routes>
                        <Route path="/" element={<Navigate to="/login" replace />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/home" element={
                            <ProtectedRoute>
                                <Home />
                            </ProtectedRoute>
                        } />
                        <Route path="/database" element={
                            <ProtectedRoute>
                                <Database />
                            </ProtectedRoute>
                        } />
                        <Route path="/list/:listId" element={
                            <ProtectedRoute>
                                <ListDetail />
                            </ProtectedRoute>
                        } />
                        <Route path="/list/:listId/edit" element={
                            <ProtectedRoute>
                                <EditList />
                            </ProtectedRoute>
                        } />
                        <Route path="/search" element={
                            <ProtectedRoute>
                                <Search />
                            </ProtectedRoute>
                        } />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;