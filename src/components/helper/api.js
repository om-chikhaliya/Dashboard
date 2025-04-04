import axios from "axios";

// Create an Axios instance
const api = axios.create({
  baseURL: "https://backend.brickosys.com/api", // Replace with your actual API URL
});

// Function to get the stored token
const getToken = () => localStorage.getItem("accessToken");

// ✅ Interceptor for GET requests
api.interceptors.request.use((config) => {
  if (config.method === "get") {
    config.headers["Authorization"] = `Bearer ${getToken()}`;
  }
  return config;
}, (error) => Promise.reject(error));

// ✅ Interceptor for POST requests
api.interceptors.request.use((config) => {
  if (config.method === "post") {
    config.headers["Authorization"] = `Bearer ${getToken()}`;
    config.headers["Content-Type"] = "application/json"; // Ensure JSON format
  }
  return config;
}, (error) => Promise.reject(error));

export default api;
