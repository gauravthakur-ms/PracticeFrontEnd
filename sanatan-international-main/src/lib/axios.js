import axios from "axios";
import useAuthStore from "../store/authStore";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const attachAuth = (config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
};

export const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export const multipartApi = axios.create({
  baseURL,
  withCredentials: true,
});

api.interceptors.request.use(attachAuth);
multipartApi.interceptors.request.use(attachAuth);

// Single-flight refresh-token
let refreshPromise = null;

const refresh = async () => {
  if (refreshPromise) return refreshPromise;
  refreshPromise = axios
    .post(`${baseURL}/auth/refresh-token`, {}, { withCredentials: true })
    .then((res) => {
      const token = res.data?.data?.accessToken;
      const user = res.data?.data?.user;
      if (token) {
        useAuthStore.getState().setAccessToken(token);
        if (user) useAuthStore.getState().setUser(user, token);
      }
      return token;
    })
    .finally(() => {
      refreshPromise = null;
    });
  return refreshPromise;
};

const installResponseInterceptor = (instance) => {
  instance.interceptors.response.use(
    (r) => r,
    async (error) => {
      const original = error.config;
      const status = error.response?.status;
      const url = original?.url || "";
      if (
        status === 401 &&
        !original._retry &&
        !url.includes("/auth/refresh-token") &&
        !url.includes("/auth/login")
      ) {
        // If there's no access token in memory, the caller is a guest browsing
        // a protected endpoint (e.g. course subjects on the public detail page).
        // Don't try to refresh or force a logout/redirect — just propagate the
        // 401 so the caller can handle it gracefully.
        const hadToken = !!useAuthStore.getState().accessToken;
        if (!hadToken) {
          return Promise.reject(error);
        }
        original._retry = true;
        try {
          const token = await refresh();
          if (!token) throw error;
          original.headers.Authorization = `Bearer ${token}`;
          return instance(original);
        } catch (e) {
          useAuthStore.getState().logout();
          if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
            window.location.href = "/login";
          }
          return Promise.reject(e);
        }
      }
      return Promise.reject(error);
    },
  );
};

installResponseInterceptor(api);
installResponseInterceptor(multipartApi);

export default api;
