import axios from "axios"; 

const DB_URL = import.meta.env.VITE_DB_URL;

export const axiosinstance = axios.create({
  baseURL : DB_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",  
  }, 
});

// Add request interceptor to include token
axiosinstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
axiosinstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token"); // Clear invalid token
      window.location.href = "/login"; // Redirect to login
    }
    return Promise.reject(error);
  }
);