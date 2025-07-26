import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://filetool-backend.onrender.com',
  withCredentials: true, // Crucial for sending the httpOnly cookie
});

export default apiClient;









