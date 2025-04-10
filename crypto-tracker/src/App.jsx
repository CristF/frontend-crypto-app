import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import Database from './components/Database';

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="min-h-screen bg-gray-100">
                    <Routes>
                        {/* Redirect root path to login */}
                        <Route path="/" element={<Navigate to="/login" replace />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/home" element={<Home />} />
                        <Route path="/database" element={<Database />} />

                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;