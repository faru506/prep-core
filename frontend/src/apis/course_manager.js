import { DOMAIN } from "./config";

export const createCourseApi =
  (data) =>
    fetch(`${DOMAIN}/api/v1/admin/courses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

export const createTopicApi =
  (data) =>
    fetch(`${DOMAIN}/api/v1/admin/topics`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

export const reorderCoursesApi =
  (courseIds) =>
    fetch(
      `${DOMAIN}/api/v1/admin/courses/reorder`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json"
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
            "application/json"
        },
        body: JSON.stringify({
          topic_ids: topicIds
        })
      }
    );

export const fetchAdminCourses = () =>
  fetch(`${DOMAIN}/api/v1/admin/courses`);

export const fetchAdminTopics = (courseId) =>
  fetch(
    `${DOMAIN}/api/v1/admin/topics?course_id=${courseId}`
  );

export const createQuestionApi = (data) =>
  fetch(`${DOMAIN}/api/v1/admin/questions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

export const fetchAdminQuestions =
  (topicId) =>
    fetch(
      `${DOMAIN}/api/v1/admin/topics/${topicId}/questions`
    );

export const reorderQuestionsApi =
  (questionIds, topicId) =>
    fetch(
      `${DOMAIN}/api/v1/admin/questions/reorder`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json"
        },
        body: JSON.stringify({
          question_ids: questionIds,
          topic_id: topicId
        })
      }
    );