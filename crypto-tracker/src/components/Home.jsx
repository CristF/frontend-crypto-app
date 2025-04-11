import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserLists } from '../utils/api';
import api from '../utils/api';

function Home() {
    const [search, setSearch] = useState('');
    const [userLists, setUserLists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [listToDelete, setListToDelete] = useState(null);
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        const fetchUserLists = async () => {
            try {
                setLoading(true);
                const response = await getUserLists();
                console.log('User lists response:', response);
                setUserLists(Array.isArray(response) ? response : []);
            } catch (error) {
                console.error('Error fetching user lists:', error);
                setError('Failed to fetch lists');
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchUserLists();
        }
    }, [user]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (search.trim()) {
            navigate(`/search?q=${search}`);
        }
    };

    const handleDeleteList = async (listId) => {
        try {
            await api.delete(`/crypto/delete-list/${listId}`);
            setUserLists((prev) => prev.filter((list) => list._id !== listId));
            setListToDelete(null);
            setShowDeleteModal(false);
        } catch (error) {
            console.error('Error deleting list:', error);
            setError('Failed to delete list');
        }
    };

    const handleSignOut = () => {
        localStorage.removeItem('token');
        navigate('/login', { replace: true });
    };

    const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
        if (!isOpen) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-md">
                    <h2 className="text-xl font-bold mb-4">Delete List</h2>
                    <p className="mb-6 text-gray-600">Are you sure you want to delete this list? This action cannot be undone.</p>
                    <div className="flex justify-end gap-2">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 border rounded hover:bg-gray-100"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-[#0864c7] px-4 py-6">
            <div className="max-w-7xl mx-auto flex justify-end mb-4">
                <button
                    onClick={handleSignOut}
                    className="bg-white text-red-600 px-4 py-2 rounded hover:bg-red-50 transition-colors"
                >
                    Sign Out
                </button>
            </div>

            <h1 className="text-white text-4xl font-semibold text-center mb-8 drop-shadow">
                Crypto Tracker
            </h1>

            <form
                onSubmit={handleSearch}
                className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center gap-4"
            >
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search for a cryptocurrency..."
                    className="flex-grow p-3 rounded-lg border border-gray-300 w-full sm:w-auto"
                />
                <button
                    type="submit"
                    className="bg-white text-blue-700 px-6 py-3 rounded hover:bg-gray-100"
                >
                    Search
                </button>
            </form>

            <div className="flex items-center justify-center my-6">
                <hr className="w-1/4 border-t border-gray-300" />
                <span className="mx-4 text-white font-bold">Or</span>
                <hr className="w-1/4 border-t border-gray-300" />
            </div>

            <div className="flex justify-center">
                <button
                    onClick={() => navigate('/database')}
                    className="bg-white text-black px-6 py-3 rounded hover:bg-gray-100"
                >
                    View Entire Database
                </button>
            </div>

            <h2 className="text-white text-2xl font-semibold text-center mb-8 mt-12 drop-shadow">
                Your Crypto Lists
            </h2>

            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 mt-12">
                {loading ? (
                    <p className="text-gray-600 text-center">Loading your lists...</p>
                ) : error ? (
                    <p className="text-red-500 text-center">{error}</p>
                ) : !userLists || userLists.length === 0 ? (
                    <p className="text-gray-600 text-center">You have no lists created</p>
                ) : (
                    <div className="space-y-4">
                        {userLists.map((list) => (
                            <div 
                                key={list._id} 
                                className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                                onClick={() => navigate(`/list/${list._id}`)}
                            >
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="font-semibold text-lg">{list.listName}</h3>
                                        <p className="text-gray-600">
                                            {list.cryptos?.length || 0} cryptocurrencies
                                        </p>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button 
                                            className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/list/${list._id}/edit`);
                                            }}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="p-1 text-gray-500 hover:text-red-600"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setListToDelete(list);
                                                setShowDeleteModal(true);
                                            }}
                                        >
                                            <svg 
                                                className="w-5 h-5" 
                                                fill="none" 
                                                stroke="currentColor" 
                                                viewBox="0 0 24 24"
                                            >
                                                <path 
                                                    strokeLinecap="round" 
                                                    strokeLinejoin="round" 
                                                    strokeWidth={2} 
                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <DeleteConfirmationModal 
                isOpen={showDeleteModal}
                onClose={() => {
                    setShowDeleteModal(false);
                    setListToDelete(null);
                }}
                onConfirm={() => handleDeleteList(listToDelete?._id)}
            />
        </div>
    );
}

export default Home;
