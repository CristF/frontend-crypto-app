import { Link } from 'react-router-dom';

function Home() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="text-center">
                <h1 className="text-4xl font-bold mb-8">Welcome to Crypto Tracker</h1>
                <div className="space-x-4">
                    <Link 
                        to="/login" 
                        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
                    >
                        Login
                    </Link>
                    <Link 
                        to="/register" 
                        className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
                    >
                        Register
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Home;