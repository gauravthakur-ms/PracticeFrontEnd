import api, { multipartApi } from "../lib/axios";

const course = {
  getAllCourses: (params = {}) => api.get("/courses", { params }),
  getCourseById: (courseId) => api.get(`/courses/${courseId}`),
  // backend route currently lacks multer for thumbnail; send JSON. multipart still works (extra files ignored)
  createCourse: (data) =>
    data instanceof FormData
      ? multipartApi.post("/courses", data)
      : api.post("/courses", data),
  updateCourse: (courseId, data) =>
    data instanceof FormData
      ? multipartApi.put(`/courses/${courseId}`, data)
      : api.put(`/courses/${courseId}`, data),
  deleteCourse: (courseId) => api.delete(`/courses/${courseId}`),

  // purchased
  getMyCourses: () => api.get("/purchased/my-course"),
  getUserCourses: (userId) => api.get(`/purchased/users/${userId}/courses`),
  updateCourseStatus: (userId, courseId, data) =>
    api.put(`/purchased/users/${userId}/courses/${courseId}`, data),
  getMostlyPurchased: () => api.get("/purchased/mostly-purchased-course"),
};

export default course;
