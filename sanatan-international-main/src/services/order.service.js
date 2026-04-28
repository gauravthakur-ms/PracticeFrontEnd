import api from "../lib/axios";

const order = {
  createOrder: (courseId) => api.post(`/courses/${courseId}/orders`),
  getOrders: (courseId, params = {}) =>
    api.get(`/courses/${courseId}/orders`, { params }),
  getRecentOrders: (courseId) =>
    api.get(`/courses/${courseId}/orders/recent-orders`),
  getUserOrders: (courseId, userId) =>
    api.get(`/courses/${courseId}/orders/users/${userId}`),
};

export default order;
