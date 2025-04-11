import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api', // Hardcode for now
    headers: {
        'Content-Type': 'application/json'
    }
});

api.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    response => response,
    error => {
        console.error('Response error:', error.response?.data || error.message);
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            // Use window.location.replace instead of window.location.href
            if (!window.location.pathname.includes('/login')) {
                window.location.replace('/login');
            }
        }
        return Promise.reject(error);
    }
);

export const fetchAllCryptos = async () => {
    try {
        const response = await api.get('/crypto/saved-cryptos');
        return response.data;
    } catch (error) {
        console.error('Error fetching all cryptos:', error);
        throw error;
    }
};

// All these routes require authentication in the backend
export const searchCrypto = async (query) => {
    try {
        // First get search results
        const searchResponse = await api.post('/crypto/search', { query });
        const searchResults = searchResponse.data;
        
        if (!searchResults.length) {
            return [];
        }

        // Get market data for each crypto sequentially
        const marketData = await Promise.all(
            searchResults.map(async (coin) => {
                try {
                    const marketResponse = await api.get(`/crypto/search/market/${coin.id}`);
                    return {
                        ...marketResponse.data,
                        images: {
                            thumb: marketResponse.data.image
                        },
                        // Fix market cap mapping
                        marketCap: marketResponse.data.market_cap, // Map from market_cap to marketCap
                        current_price: marketResponse.data.current_price,
                        price_change_24h: marketResponse.data.price_change_percentage_24h,
                        total_volume: marketResponse.data.total_volume,
                        _id: marketResponse.data.id // Ensure we have a unique ID
                    };
                } catch (error) {
                    console.error(`Error fetching market data for ${coin.id}:`, error);
                    return null;
                }
            })
        );

        // Debug log to check the transformed data
        console.log('Transformed market data:', marketData.filter(data => data !== null));

        // Filter out any failed requests and return the results
        return marketData.filter(data => data !== null);
    } catch (error) {
        console.error('Error searching cryptos:', error);
        throw error;
    }
};

export const getSavedCryptos = async (userId) => {
    try {
        const response = await api.get(`/crypto/saved/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error getting saved cryptos:', error);
        throw error;
    }
};

export const createCryptoList = async (listData) => {
    try {
        const response = await api.post('/crypto/create-list', listData);
        return response.data;
    } catch (error) {
        console.error('Error creating crypto list:', error);
        throw error;
    }
};

export const getUserLists = async () => {
    try {
        const response = await api.get('/crypto/get-list');
        console.log('API response:', response); // Debug log
        return response.data || [];
    } catch (error) {
        console.error('Error getting user lists:', error);
        throw error;
    }
};

export const addToList = async (listId, cryptoIds) => {
    try {
        const response = await api.post(`/crypto/add-to-list/${listId}`, { cryptoIds });
        return response.data;
    } catch (error) {
        console.error('Error adding to list:', error);
        throw error;
    }
};

export const removeFromList = async (listId, cryptoId) => {
    try {
        const response = await api.delete(`/crypto/remove-from-list/${listId}/${cryptoId}`);
        return response.data;
    } catch (error) {
        console.error('Error removing from list:', error);
        throw error;
    }
};

export const findListById = async (listId) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await api.get(`/crypto/findListBy/${listId}`);
        console.log('Raw list data:', response.data); // Debug log
        
        if (!response.data || !Array.isArray(response.data.cryptos)) {
            throw new Error('Invalid data format received from server');
        }

        return response.data;
    } catch (error) {
        console.error('Error fetching list:', error.response?.data || error.message);
        throw error;
    }
};

// Add this function to handle list deletion
export const deleteList = async (listId) => {
    try {
        const response = await api.delete(`/crypto/delete-list/${listId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting list:', error);
        throw error;
    }
};

export default api;