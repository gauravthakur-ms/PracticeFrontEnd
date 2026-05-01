import api from "../lib/axios";

const course = {
  getAllCourses: (params = {}) => api.get("/courses", { params }),
  getCourseById: (courseId) => api.get(`/courses/${courseId}`),
  // Thumbnails are uploaded separately via uploadService.uploadThumbnail and the
  // resulting metadata is included in the JSON body as `thumbnail`.
  createCourse: (data) => api.post("/courses", data),
  updateCourse: (courseId, data) => api.put(`/courses/${courseId}`, data),
  deleteCourse: (courseId) => api.delete(`/courses/${courseId}`),

  // purchased
  getMyCourses: () => api.get("/purchased/my-course"),
  getUserCourses: (userId) => api.get(`/purchased/users/${userId}/courses`),
  updateCourseStatus: (userId, courseId, data) =>
    api.put(`/purchased/users/${userId}/courses/${courseId}`, data),
  getMostlyPurchased: () => api.get("/purchased/mostly-purchased-course"),
};

export default course;
