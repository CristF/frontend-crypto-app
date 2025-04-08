import api from '../utils/api';

export const authService = {
    async login(userName, password) {
        const response = await api.post('/user/login', { userName, password });
        return response.data;
    },

    async register(userData) {
        const response = await api.post('/user/register', userData);
        return response.data;
    },

    async forgotPassword(email) {
        const response = await api.post('/user/forgot-password', { email });
        return response.data;
    }
};