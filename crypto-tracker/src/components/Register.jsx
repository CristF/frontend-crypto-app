import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

function Register() {
    const [formData, setFormData] = useState({
        userName: '',
        email: '',
        password: '',
        firstName: '',
        lastName: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/user/register', formData);
            navigate('/login');
        } catch (error) {
            setError(error.response?.data?.message || 'Registration failed');
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#0864c7]">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-lg shadow-md border border-gray-300 text-center w-80">

                <h2 className="text-2xl font-bold mb-6">Create Account</h2>
                {error && <div className="text-red-500 mb-4">{error}</div>}

                {/* Text boxes to input info */}
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    className="w-full p-2 mb-3 border rounded"/>
                <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="First Name"
                    className="w-full p-2 mb-3 border rounded"/>
                <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Last Name"
                    className="w-full p-2 mb-3 border rounded"/>
                <input
                    type="text"
                    name="userName"
                    value={formData.userName}
                    onChange={handleChange}
                    placeholder="Username"
                    className="w-full p-2 mb-3 border rounded"/>
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    className="w-full p-2 mb-4 border rounded"/>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                    Create Account
                </button>

                {/* Or Divider */}
                <div className="flex items-center my-6">
                    <hr className="flex-grow border-t border-gray-300" />
                    <span className="mx-2 text-gray-600 font-bold">Or</span>
                    <hr className="flex-grow border-t border-gray-300" />
                </div>

                {/* Back to Login */}
                <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="w-full bg-gray-100 text-gray-800 p-2 rounded hover:bg-gray-200"
                >
                    Back to Login
                </button>
            </form>
        </div>
    );
}

export default Register;
