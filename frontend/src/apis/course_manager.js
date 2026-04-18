import { DOMAIN } from "./config";
import { getToken } from "../utilities/storage";

export const createCourseApi =
  (data) =>
    fetch(`${DOMAIN}/api/v1/admin/courses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`
      },
      body: JSON.stringify(data)
    });

export const updateCourseApi =
  (courseId, data) =>
    fetch(`${DOMAIN}/api/v1/admin/courses/${courseId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`
      },
      body: JSON.stringify(data)
    });

export const deleteCourseApi =
  (courseId) =>
    fetch(`${DOMAIN}/api/v1/admin/courses/${courseId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });

export const createTopicApi =
  (data) =>
    fetch(`${DOMAIN}/api/v1/admin/topics`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`
      },
      body: JSON.stringify(data)
    });

export const updateTopicApi =
  (topicId, data) =>
    fetch(`${DOMAIN}/api/v1/admin/topics/${topicId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`
      },
      body: JSON.stringify(data)
    });

export const deleteTopicApi =
  (topicId) =>
    fetch(`${DOMAIN}/api/v1/admin/topics/${topicId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });

export const reorderCoursesApi =
  (courseIds) =>
    fetch(
      `${DOMAIN}/api/v1/admin/courses/reorder`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
          Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify({
          course_ids: courseIds
        })
      }
    );

export const reorderTopicsApi =
  (topicIds) =>
    fetch(
      `${DOMAIN}/api/v1/admin/topics/reorder`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
          Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify({
          topic_ids: topicIds
        })
      }
    );

export const fetchAdminCourses = () =>
  fetch(`${DOMAIN}/api/v1/admin/courses`, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });

export const fetchAdminTopics = (courseId) =>
  fetch(
    `${DOMAIN}/api/v1/admin/topics?course_id=${courseId}`,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    }
  );

export const createQuestionApi = (data) =>
  fetch(`${DOMAIN}/api/v1/admin/questions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`
    },
    body: JSON.stringify(data)
  });

export const updateQuestionApi =
  (questionId, data) =>
    fetch(`${DOMAIN}/api/v1/admin/questions/${questionId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`
      },
      body: JSON.stringify(data)
    });

export const deleteQuestionApi =
  (questionId) =>
    fetch(`${DOMAIN}/api/v1/admin/questions/${questionId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });

export const fetchAdminQuestions =
  (topicId) =>
    fetch(
      `${DOMAIN}/api/v1/admin/topics/${topicId}/questions`,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      }
    );

export const reorderQuestionsApi =
  (questionIds, topicId) =>
    fetch(
      `${DOMAIN}/api/v1/admin/questions/reorder`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
          Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify({
          question_ids: questionIds,
          topic_id: topicId
        })
      }
    );
