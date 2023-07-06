import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/',
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const errorCleanedMessage = error.response.data;
    return Promise.reject(errorCleanedMessage);
  }
);
export default api;
