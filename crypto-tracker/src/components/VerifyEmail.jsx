import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';

function VerifyEmail() {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState('verifying');
    const navigate = useNavigate();
    const token = searchParams.get('token');

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                await api.get(`/user/verify-email?token=${token}`);
                setStatus('success');
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            } catch (error) {
                setStatus('error');
            }
        };

        if (token) {
            verifyEmail();
        }
    }, [token, navigate]);

    return (
        <div className="min-h-screen bg-[#0864c7] flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
                {status === 'verifying' && <p>Verifying your email...</p>}
                {status === 'success' && (
                    <>
                        <p className="text-green-600">Email verified successfully!</p>
                        <p className="text-gray-600">Redirecting to login...</p>
                    </>
                )}
                {status === 'error' && (
                    <p className="text-red-600">Failed to verify email. Please try again.</p>
                )}
            </div>
        </div>
    );
}

export default VerifyEmail;