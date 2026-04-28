import api, { multipartApi } from "../lib/axios";

// Backend login returns data: { user, "Access Token", "Refresh Token" }
// Normalize so callers always get { user, accessToken }
const normalizeLogin = (res) => {
  const d = res?.data?.data || {};
  const accessToken = d.accessToken || d["Access Token"] || null;
  return { user: d.user || null, accessToken, raw: res };
};

const auth = {
  register: (data) => api.post("/auth/register", data),
  loginRaw: (data) => api.post("/auth/login", data),
  login: async (data) => {
    const res = await api.post("/auth/login", data);
    return normalizeLogin(res);
  },
  logout: () => api.post("/auth/logout"),
  getCurrentUser: () => api.get("/auth/current-user"),

  // Accepts plain object (JSON) or FormData (multipart for future avatar)
  updateProfile: (userId, data) =>
    data instanceof FormData
      ? multipartApi.put(`/auth/current-user/${userId}`, data)
      : api.put(`/auth/current-user/${userId}`, data),

  deleteProfile: (userId) => api.delete(`/auth/current-user/${userId}`),
  changePassword: (data) => api.post("/auth/change-password", data),
  forgotPassword: (data) => api.post("/auth/forgot-password", data),
  resetPassword: (token, data) => api.post(`/auth/reset-password/${token}`, data),
  verifyEmail: (token) => api.get(`/auth/verify-email/${token}`),
  resendVerification: () => api.post("/auth/resend-email-verification"),
  refreshToken: () => api.post("/auth/refresh-token"),

  // admin-request lives under /auth in this backend
  submitAdminRequest: (data) => api.post("/auth/admin-request", data),
  getAdminRequests: () => api.get("/auth/admin-request"),
  updateAdminRequest: (id, data) => api.put(`/auth/admin-request/${id}`, data),
  deleteAdminRequest: (id) => api.delete(`/auth/admin-request/${id}`),
};

export default auth;
