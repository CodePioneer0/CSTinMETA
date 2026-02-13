import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_APP_URL + "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["authToken"] = token;
  }
  return config;
});

// Handle 401 responses
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("anonymousId");

      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/welcome";
      }
    }
    return Promise.reject(error);
  }
);

export default API;