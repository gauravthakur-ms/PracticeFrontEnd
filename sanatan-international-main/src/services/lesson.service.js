import api, { multipartApi } from "../lib/axios";

const base = (courseId, subjectId) =>
  `/courses/${courseId}/subjects/${subjectId}/lessons`;

const lesson = {
  getLessons: (courseId, subjectId) => api.get(base(courseId, subjectId)),
  getLesson: (courseId, subjectId, lessonId) =>
    api.get(`${base(courseId, subjectId)}/${lessonId}`),
  createLesson: (courseId, subjectId, data, onUploadProgress) =>
    data instanceof FormData
      ? multipartApi.post(base(courseId, subjectId), data, { onUploadProgress })
      : api.post(base(courseId, subjectId), data),
  updateLesson: (courseId, subjectId, lessonId, data, onUploadProgress) =>
    data instanceof FormData
      ? multipartApi.put(`${base(courseId, subjectId)}/${lessonId}`, data, {
          onUploadProgress,
        })
      : api.put(`${base(courseId, subjectId)}/${lessonId}`, data),
  deleteLesson: (courseId, subjectId, lessonId) =>
    api.delete(`${base(courseId, subjectId)}/${lessonId}`),
  reorder: (courseId, subjectId, items) =>
    api.put(`${base(courseId, subjectId)}/reorder`, { items }),
};

export default lesson;
