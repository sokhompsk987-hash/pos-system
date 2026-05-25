import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api', // អាសយដ្ឋាន Laravel Backend របស់បង
});

export const request = async (url, method = 'get', data = null) => {
    try {
        const token = localStorage.getItem('token');
        const config = {
            method,
            url,
            data,
            headers: {
                Authorization: token ? `Bearer ${token}` : '',
                'Content-Type': 'application/json',
            },
        };
        const response = await api(config);
        return response.data;
    } catch (error) {
        return { errors: true, data: error.response?.data || { message: 'Network Error' } };
    }
};