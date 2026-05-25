import axios from 'axios';

// ស្ពានភ្ជាប់ទៅកាន់ប្រព័ន្ធរបស់មិត្តភក្តិបង
const api = axios.create({
  baseURL: 'http://localhost:8000/api', 
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// អ្នកយាមទ្វារទី១៖ ជួយភ្ជាប់កាតសម្គាល់ខ្លួនមុនពេលផ្ញើសំណើចេញ
api.interceptors.request.use(
  (config) => {
    // ទៅរកមើលកាតដែលយើងទុកពេល Login
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// អ្នកយាមទ្វារទី២៖ ជួយឆែកមើលចម្លើយពេលត្រឡប់មកវិញ
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // បើប្រព័ន្ធគេឆ្លើយមកថា លែងស្គាល់យើងហើយ (លេខ 401 មានន័យថាកាតផុតកំណត់)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token'); // បោះកាតចាស់ចោល
      window.location.href = '/login'; // រុញទៅទំព័រ Login វិញ
    }
    return Promise.reject(error);
  }
);

export default api;