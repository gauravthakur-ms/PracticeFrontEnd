import api from "../lib/axios";

// Aggregate admin endpoints (super_admin / customer_panel_admin)
const admin = {
  getUsers: (params = {}) => api.get("/admin/panel/users", { params }),
  getCourses: (params = {}) => api.get("/admin/panel/courses", { params }),
  getSubjects: (params = {}) => api.get("/admin/panel/subjects", { params }),
  getLessons: (params = {}) => api.get("/admin/panel/lessons", { params }),
  getReviews: (params = {}) => api.get("/admin/panel/reviews", { params }),
  getOrders: (params = {}) => api.get("/admin/panel/orders", { params }),
  getAdminRequests: (params = {}) =>
    api.get("/admin/panel/admin-requests", { params }),
};

export default admin;
