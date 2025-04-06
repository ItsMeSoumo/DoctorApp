import axios from "axios"; 

const DB_URL = import.meta.env.VITE_DB_URL;

export const axiosinstance = axios.create({
  baseURL: DB_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  }
});

// Add request interceptor to include token
axiosinstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Token being sent:', token); // Debug log
    }
    console.log('Request Config:', config); // Debug log
    return config;
  },
  (error) => {
    console.error('Request Error:', error); // Debug log
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
axiosinstance.interceptors.response.use(
  (response) => {
    console.log('Response:', response); // Debug log
    return response;
  },
  (error) => {
    console.error('Response Error:', error.response || error); // Debug log
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);