import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { findListById, removeFromList } from '../utils/api';

function EditList() {
    const [list, setList] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { listId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        loadList();
    }, [listId]);

    const loadList = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await findListById(listId);
            setList(data);
        } catch (error) {
            console.error('Error loading list:', error);
            setError(error.message || 'Failed to load list details');
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveCrypto = async (cryptoId) => {
        try {
            await removeFromList(listId, cryptoId);
            // Reload the list to show updated data
            await loadList();
        } catch (error) {
            console.error('Error removing crypto:', error);
            setError('Failed to remove cryptocurrency');
        }
    };

    const formatNumber = (num) => {
        if (!num) return '$0';
        if (num < 0.01) return `$${num.toFixed(8)}`;
        if (num < 1) return `$${num.toFixed(4)}`;
        if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
        if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
        return `$${num.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;
    };

    return (
        <div className="min-h-screen bg-[#0864c7] px-4 py-6">
            <div className="max-w-7xl mx-auto">
                <button
                    onClick={() => navigate('/home')}
                    className="flex items-center text-white mb-6 hover:text-gray-200"
                >
                    <svg 
                        className="h-6 w-6 mr-2" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                    >
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M10 19l-7-7m0 0l7-7m-7 7h18" 
                        />
                    </svg>
                    Back to Home
                </button>

                {loading ? (
                    <div className="text-white text-center">Loading list...</div>
                ) : error ? (
                    <div className="text-red-500 text-center">{error}</div>
                ) : list ? (
                    <>
                        <h1 className="text-white text-4xl font-semibold mb-6">
                            Edit List: {list.listName}
                        </h1>

                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name/Symbol</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Price</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">24h Change</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Market Cap</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Volume</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {list.cryptos.map((item) => (
                                            <tr key={item.cryptoId} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center space-x-3">
                                                        {item.images?.thumb && (
                                                            <img 
                                                                src={item.images.thumb} 
                                                                alt={`${item.name} logo`}
                                                                className="w-8 h-8 rounded-full"
                                                            />
                                                        )}
                                                        <div>
                                                            <div className="font-medium text-gray-900">
                                                                {item.name}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {item.symbol?.toUpperCase()}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    {formatNumber(item.current_price)}
                                                </td>
                                                <td className={`px-6 py-4 whitespace-nowrap text-right text-sm font-medium ${
                                                    item.price_change_24h >= 0 ? 'text-green-600' : 'text-red-600'
                                                }`}>
                                                    {item.price_change_24h >= 0 ? '+' : ''}
                                                    {item.price_change_24h?.toFixed(2)}%
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                                                    {formatNumber(item.marketCap)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                                                    {formatNumber(item.total_volume)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                                    <button
                                                        onClick={() => handleRemoveCrypto(item.cryptoId)}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        Remove
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="text-white text-center">List not found</div>
                )}
            </div>
        </div>
    );
}

export default EditList;