import axios from "axios";

const baseURL = 'https://sufail07.pythonanywhere.com';
const axiosInstance = axios.create({
    baseURL,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refresh = localStorage.getItem('refresh');
                const response = await axios.post(`${baseURL}/api/token/refresh/`, {
                    refresh: refresh
                });

                const newAccess = response.data.access;
                localStorage.setItem('access', newAccess);

                axiosInstance.defaults.headers['Authorization'] = `Bearer ${newAccess}`;
                originalRequest.headers['Authorization'] = `Bearer ${newAccess}`;
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                console.log('Token refresh failed:', refreshError);
                localStorage.clear();
                window.location.href = '/'; // redirect to login
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
