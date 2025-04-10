import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

function Login() {
    const [formData, setFormData] = useState({
        userName: '',
        password: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/user/login', formData);
            localStorage.setItem('token', response.data.token);
            navigate('/home'); // Changed from /dashboard to /home
        } catch (error) {
            setError(error.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#0864c7] px-4">
            {/* Header Text */}
            <h1 className="text-white text-4xl font-semibold mb-10 drop-shadow">
                Crypto Tracker
            </h1>

            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-lg shadow-md border border-gray-300 text-center w-80"
            >
                <h2 className="text-2xl font-bold mb-6">Sign in</h2>
                {error && <div className="text-red-500 mb-4">{error}</div>}

                <input
                    type="text"
                    name="userName"
                    value={formData.userName}
                    onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                    placeholder="Username"
                    className="w-full p-2 mb-4 border rounded"
                />
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Password"
                    className="w-full p-2 mb-4 border rounded"
                />
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                >
                    Sign In
                </button>

                {/* Divider */}
                <div className="flex items-center my-6">
                    <hr className="flex-grow border-t border-gray-300" />
                    <span className="mx-2 text-gray-600 font-bold">Or</span>
                    <hr className="flex-grow border-t border-gray-300" />
                </div>

                <button
                    type="button"
                    onClick={() => navigate('/register')}
                    className="w-full bg-gray-100 text-gray-800 p-2 rounded hover:bg-gray-200"
                >
                    Create Account
                </button>
            </form>
        </div>
    );
}

export default Login;
