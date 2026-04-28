import api from "../lib/axios";

const subject = {
  getSubjects: (courseId) => api.get(`/courses/${courseId}/subjects`),
  getSubject: (courseId, subjectId) =>
    api.get(`/courses/${courseId}/subjects/${subjectId}`),
  createSubject: (courseId, data) =>
    api.post(`/courses/${courseId}/subjects`, data),
  updateSubject: (courseId, subjectId, data) =>
    api.put(`/courses/${courseId}/subjects/${subjectId}`, data),
  deleteSubject: (courseId, subjectId) =>
    api.delete(`/courses/${courseId}/subjects/${subjectId}`),
  reorder: (courseId, items) =>
    api.put(`/courses/${courseId}/subjects/reorder`, { items }),
};

export default subject;
