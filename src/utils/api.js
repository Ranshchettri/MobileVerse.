import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
});

// Automatically attach JWT token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        try {
          const res = await api.post("token/refresh/", {
            refresh: refreshToken,
          });
          localStorage.setItem("accessToken", res.data.access);
          api.defaults.headers.common["Authorization"] =
            "Bearer " + res.data.access;
          originalRequest.headers["Authorization"] =
            "Bearer " + res.data.access;
          return api(originalRequest);
        } catch (refreshError) {
          // Refresh failed, logout user
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
