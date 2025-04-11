import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { searchCrypto } from '../utils/api';

function Search() {
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();
    const query = new URLSearchParams(location.search).get('q');

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

    useEffect(() => {
        const fetchSearchResults = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await searchCrypto(query);
                console.log('Search results:', data);
                setSearchResults(data);
            } catch (error) {
                console.error('Search error:', error);
                setError('Failed to fetch search results');
            } finally {
                setLoading(false);
            }
        };

        if (query) {
            fetchSearchResults();
        }
    }, [query]);

    return (
        <div className="min-h-screen bg-[#0864c7] px-4 py-10">
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
            </div>

            <h1 className="text-white text-4xl font-semibold text-center mb-8 drop-shadow">
                Search Results for "{query}"
            </h1>

            <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md p-6">
                {loading ? (
                    <p className="text-center text-gray-600">Loading results...</p>
                ) : error ? (
                    <p className="text-center text-red-500">{error}</p>
                ) : searchResults.length === 0 ? (
                    <p className="text-center text-gray-600">No results found</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name/Symbol</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Price</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">24h Change</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Market Cap</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Volume</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {searchResults.map((crypto) => (
                                    <tr 
                                        key={crypto._id} 
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center space-x-3">
                                                {crypto.images?.thumb && (
                                                    <img 
                                                        src={crypto.images.thumb} 
                                                        alt={`${crypto.name} logo`}
                                                        className="w-8 h-8 rounded-full"
                                                    />
                                                )}
                                                <div>
                                                    <div className="font-medium text-gray-900">{crypto.name}</div>
                                                    <div className="text-sm text-gray-500">{crypto.symbol.toUpperCase()}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            {formatNumber(crypto.current_price)}
                                        </td>
                                        <td className={`px-6 py-4 whitespace-nowrap text-right text-sm font-medium ${
                                            crypto.price_change_24h >= 0 ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                            {crypto.price_change_24h >= 0 ? '+' : ''}
                                            {crypto.price_change_24h?.toFixed(2)}%
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                                            {formatNumber(crypto.marketCap)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                                            {formatNumber(crypto.total_volume)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Search;
