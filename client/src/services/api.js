import axios from 'axios';

// This uses the proxy we set up in vite.config.js
const API = axios.create({
  baseURL: '/api',
});

export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
};

export default API;