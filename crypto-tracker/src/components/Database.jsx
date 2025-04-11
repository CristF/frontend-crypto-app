import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Add this import
import { fetchAllCryptos } from '../utils/api';
import CreateListModal from './CreateListModal';

function Database() {
    const navigate = useNavigate(); // Add this hook
    const [cryptos, setCryptos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [cryptosPerPage] = useState(50);
    const [selectedCryptos, setSelectedCryptos] = useState([]);
    const [showListModal, setShowListModal] = useState(false);

    useEffect(() => {
        const loadCryptos = async () => {
            try {
                setLoading(true);
                const data = await fetchAllCryptos();
                console.log('Loaded cryptos:', data); // Debug log
                setCryptos(data);
            } catch (error) {
                console.error('Error loading database:', error);
                setError('Failed to load cryptocurrencies');
            } finally {
                setLoading(false);
            }
        };

        loadCryptos();
    }, []);

    const formatNumber = (num) => {
        if (!num) return '$0';
        
        // Handle very small numbers (less than 0.01)
        if (num < 0.01) {
            return `$${num.toFixed(8)}`;
        }
        
        // Handle numbers between 0.01 and 1
        if (num < 1) {
            return `$${num.toFixed(4)}`;
        }
        
        // Handle larger numbers
        if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
        if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
        
        // Handle regular numbers
        return `$${num.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;
    };

    // Calculate pagination values
    const indexOfLastCrypto = currentPage * cryptosPerPage;
    const indexOfFirstCrypto = indexOfLastCrypto - cryptosPerPage;
    const currentCryptos = cryptos.slice(indexOfFirstCrypto, indexOfLastCrypto);
    const totalPages = Math.ceil(cryptos.length / cryptosPerPage);

    // Navigation functions
    const goToFirstPage = () => setCurrentPage(1);
    const goToLastPage = () => setCurrentPage(totalPages);
    const goToNextPage = () => setCurrentPage(page => Math.min(page + 1, totalPages));
    const goToPrevPage = () => setCurrentPage(page => Math.max(page - 1, 1));

    // Generate page numbers for pagination
    const getPageNumbers = () => {
        const delta = 2; // Number of pages to show before and after current page
        const range = [];
        for (
            let i = Math.max(1, currentPage - delta);
            i <= Math.min(totalPages, currentPage + delta);
            i++
        ) {
            range.push(i);
        }
        return range;
    };

    // Handle crypto selection
    const handleCryptoSelect = (crypto) => {
        setSelectedCryptos(prev => {
            const isSelected = prev.some(c => c._id === crypto._id);
            if (isSelected) {
                return prev.filter(c => c._id !== crypto._id);
            } else {
                return [...prev, crypto];
            }
        });
    };

    // Handle list creation success
    const handleListCreated = (newList) => {
        setSelectedCryptos([]);
        // Optionally show a success message or update UI
    };

    return (
        <div className="min-h-screen bg-[#0864c7] px-4 py-10">
            {/* Add back button */}
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

            <h1 className="text-white text-4xl font-semibold text-center mb-6 drop-shadow">
                Cryptocurrency Database
            </h1>

            <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md p-6">
                {loading && (
                    <p className="text-gray-500 text-center">Loading cryptocurrencies...</p>
                )}
                {error && (
                    <p className="text-red-500 text-center">{error}</p>
                )}
                {!loading && !error && cryptos.length === 0 ? (
                    <p className="text-gray-500 text-center">No cryptocurrencies found.</p>
                ) : (
                    <>
                        <div className="mb-4 flex justify-between items-center">
                            <button
                                onClick={() => setShowListModal(true)}
                                disabled={selectedCryptos.length === 0}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                            >
                                Create List ({selectedCryptos.length} selected)
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name/Symbol</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Current Price</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">24h Change</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Market Cap</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">24h High/Low</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Supply Info</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Volume/ATH</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {currentCryptos.map((crypto) => (
                                        <tr 
                                            key={crypto._id} 
                                            className={`hover:bg-gray-50 cursor-pointer ${
                                                selectedCryptos.some(c => c._id === crypto._id) ? 'bg-blue-50' : ''
                                            }`}
                                            onClick={() => handleCryptoSelect(crypto)}
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
                                                <div className="text-green-600">{formatNumber(crypto.high_24h)}</div>
                                                <div className="text-red-600">{formatNumber(crypto.low_24h)}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                                                <div>Circulating: {formatNumber(crypto.circulating_supply)}</div>
                                                <div>Total: {formatNumber(crypto.total_supply)}</div>
                                                <div>Max: {formatNumber(crypto.max_supply)}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                                                <div>Vol: {formatNumber(crypto.total_volume)}</div>
                                                <div>ATH: {formatNumber(crypto.ath)}</div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Controls */}
                        <div className="mt-4 flex justify-center items-center space-x-2">
                            {/* First Page */}
                            <button
                                onClick={goToFirstPage}
                                disabled={currentPage === 1}
                                className="px-3 py-1 rounded border hover:bg-gray-100 disabled:opacity-50"
                            >
                                {'<<'}
                            </button>

                            {/* Previous Page */}
                            <button
                                onClick={goToPrevPage}
                                disabled={currentPage === 1}
                                className="px-3 py-1 rounded border hover:bg-gray-100 disabled:opacity-50"
                            >
                                {'<'}
                            </button>

                            {/* Page Numbers */}
                            {getPageNumbers().map(number => (
                                <button
                                    key={number}
                                    onClick={() => setCurrentPage(number)}
                                    className={`px-3 py-1 rounded border ${
                                        currentPage === number 
                                            ? 'bg-blue-500 text-white' 
                                            : 'hover:bg-gray-100'
                                    }`}
                                >
                                    {number}
                                </button>
                            ))}

                            {/* Next Page */}
                            <button
                                onClick={goToNextPage}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1 rounded border hover:bg-gray-100 disabled:opacity-50"
                            >
                                {'>'}
                            </button>

                            {/* Last Page */}
                            <button
                                onClick={goToLastPage}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1 rounded border hover:bg-gray-100 disabled:opacity-50"
                            >
                                {'>>'}
                            </button>

                            {/* Page Info */}
                            <span className="text-sm text-gray-500">
                                Page {currentPage} of {totalPages}
                            </span>
                        </div>
                    </>
                )}
            </div>

            <CreateListModal
                isOpen={showListModal}
                onClose={() => setShowListModal(false)}
                cryptos={cryptos}
                selectedCryptos={selectedCryptos}
                onSuccess={handleListCreated}
            />
        </div>
    );
}

export default Database;