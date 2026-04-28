import api from "../lib/axios";

const review = {
  getCourseReviews: (courseId, params = {}) =>
    api.get(`/courses/${courseId}/reviews`, { params }),
  getAllReviews: (params = {}) => api.get("/reviews", { params }),
  postReview: (courseId, data) =>
    api.post(`/courses/${courseId}/reviews`, data),
  updateReviewStatus: (courseId, reviewId, data) =>
    api.put(`/courses/${courseId}/reviews/${reviewId}`, data),
  deleteReview: (courseId, reviewId) =>
    api.delete(`/courses/${courseId}/reviews/${reviewId}`),
};

export default review;
