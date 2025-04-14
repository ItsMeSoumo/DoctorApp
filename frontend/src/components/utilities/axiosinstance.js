import axios from "axios"; 

export const axiosinstance = axios.create({
  baseURL: import.meta.env.VITE_DB_URL || 'http://localhost:5000/api/v1',
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
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle unauthorized errors
axiosinstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);