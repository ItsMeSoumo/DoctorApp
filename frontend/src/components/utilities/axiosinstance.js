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
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);