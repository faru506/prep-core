import { DOMAIN, apiFetch } from "./config";
import { getToken } from "../utilities/storage";

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`
});

export const createCourseApi = (data) =>
  apiFetch(`${DOMAIN}/api/v1/admin/courses`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data)
  });

export const updateCourseApi = (courseId, data) =>
  apiFetch(`${DOMAIN}/api/v1/admin/courses/${courseId}`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify(data)
  });

export const deleteCourseApi = (courseId) =>
  apiFetch(`${DOMAIN}/api/v1/admin/courses/${courseId}`, {
    method: "DELETE",
    headers: authHeaders()
  });

export const createTopicApi = (data) =>
  apiFetch(`${DOMAIN}/api/v1/admin/topics`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data)
  });

export const updateTopicApi = (topicId, data) =>
  apiFetch(`${DOMAIN}/api/v1/admin/topics/${topicId}`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify(data)
  });

export const deleteTopicApi = (topicId) =>
  apiFetch(`${DOMAIN}/api/v1/admin/topics/${topicId}`, {
    method: "DELETE",
    headers: authHeaders()
  });

export const reorderCoursesApi = (courseIds) =>
  apiFetch(`${DOMAIN}/api/v1/admin/courses/reorder`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ course_ids: courseIds })
  });

export const reorderTopicsApi = (topicIds) =>
  apiFetch(`${DOMAIN}/api/v1/admin/topics/reorder`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ topic_ids: topicIds })
  });

export const fetchAdminCourses = () =>
  apiFetch(`${DOMAIN}/api/v1/admin/courses`, {
    headers: authHeaders()
  });

export const fetchAdminTopics = (courseId) =>
  apiFetch(`${DOMAIN}/api/v1/admin/topics?course_id=${courseId}`, {
    headers: authHeaders()
  });

export const createQuestionApi = (data) =>
  apiFetch(`${DOMAIN}/api/v1/admin/questions`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data)
  });

export const updateQuestionApi = (questionId, data) =>
  apiFetch(`${DOMAIN}/api/v1/admin/questions/${questionId}`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify(data)
  });

export const deleteQuestionApi = (questionId) =>
  apiFetch(`${DOMAIN}/api/v1/admin/questions/${questionId}`, {
    method: "DELETE",
    headers: authHeaders()
  });

export const fetchAdminQuestions = (topicId) =>
  apiFetch(`${DOMAIN}/api/v1/admin/topics/${topicId}/questions`, {
    headers: authHeaders()
  });

export const reorderQuestionsApi = (questionIds, topicId) =>
  apiFetch(`${DOMAIN}/api/v1/admin/questions/reorder`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ question_ids: questionIds, topic_id: topicId })
  });
