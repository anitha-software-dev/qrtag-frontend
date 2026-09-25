import axios from 'axios';
import Config from './config.json';

const baseURL = process.env.REACT_APP_API_URL || process.env.REACT_APP_BASE_URL || Config.BASE_URL;

const Axios = axios.create({
  baseURL,
  headers: {
    accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

Axios.interceptors.request.use(function (config) {
  return new Promise((resolve, reject) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    if (config.data instanceof FormData) {
      config.headers['Content-Type'] = '';
    }

    resolve(config);
  });
});

// Add a response interceptor
Axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.setItem('isLoggedIn', 'false');
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = '/'
    }
    return Promise.reject(error);
  }
);

export default Axios;
