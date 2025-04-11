import React, { useState } from 'react';
import { createCryptoList } from '../utils/api';
import { useNavigate } from 'react-router-dom';

function CreateListModal({ isOpen, onClose, cryptos, selectedCryptos = [], onSuccess }) {
    const [listName, setListName] = useState('');
    const [error, setError] = useState('');
    const [creating, setCreating] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        
        if (!token) {
            navigate('/login', { replace: true });
            return;
        }

        if (!listName.trim()) {
            setError('List name is required');
            return;
        }
        
        try {
            setCreating(true);
            setError(''); // Reset error state
            const response = await createCryptoList({
                listName: listName,
                cryptoIds: selectedCryptos.map(crypto => crypto._id)
            });
            onSuccess(response);
            setListName('');
            onClose();
            navigate('/home', { replace: true });
        } catch (error) {
            console.error('Error creating list:', error);
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                navigate('/login', { replace: true });
            } else {
                setError(error.response?.data?.message || 'Failed to create list');
            }
        } finally {
            setCreating(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Create New Crypto List</h2>
                
                {error && (
                    <p className="text-red-500 mb-4">{error}</p>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">List Name</label>
                        <input
                            type="text"
                            value={listName}
                            onChange={(e) => setListName(e.target.value)}
                            className="w-full p-2 border rounded"
                            placeholder="Enter list name"
                        />
                    </div>

                    <div className="mb-4">
                        <p className="font-medium mb-2">Selected Cryptocurrencies ({selectedCryptos.length}):</p>
                        <div className="max-h-40 overflow-y-auto">
                            {selectedCryptos.map(crypto => (
                                <div key={crypto._id} className="py-1">
                                    {crypto.name} ({crypto.symbol})
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border rounded hover:bg-gray-100"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={creating || !listName.trim()}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                        >
                            {creating ? 'Creating...' : 'Create List'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateListModal;