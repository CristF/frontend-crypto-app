import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
    const [search, setSearch] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        console.log('Searching for:', search); // Placeholder for future API call
    };

    return (
        <div className="min-h-screen bg-[#0864c7] px-4 py-6">
            {/* Page Title */}
            <h1 className="text-white text-4xl font-semibold text-center mb-8 drop-shadow">
                Crypto Tracker
            </h1>

            {/* Search Box */}
            <form
                onSubmit={handleSearch}
                className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center gap-4"
            >
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search for a cryptocurrency..."
                    className="flex-grow p-3 rounded-lg border border-gray-300 w-full sm:w-auto"/>
                <button
                    type="submit"
                    className="bg-white text-blue-700 px-6 py-3 rounded hover:bg-gray-100">
                    Search
                </button>
            </form>
            
            <div className="flex items-center justify-center my-6">
                <hr className="w-1/4 border-t border-gray-300" />
                <span className="mx-4 text-white font-bold">Or</span>
                <hr className="w-1/4 border-t border-gray-300" />
            </div>
            
            {/* Database Button */}
            <div className="flex justify-center">
                <button
                    onClick={() => navigate('/database')}
                    className="bg-white text-black px-6 py-3 rounded hover:bg-gray-100">
                    View Entire Database
                </button>
            </div>

            {/* Saved Cryptocurrencies Placeholder */}
            <h2 className="text-white text-2xl font-semibold text-center mb-8 mt-12 drop-shadow">Saved Cryptocurrencies</h2>
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 mt-12">
                <p className="text-gray-600">You haven’t saved any cryptocurrencies yet.</p>
            </div>
        </div>
    );
}

export default Home;
