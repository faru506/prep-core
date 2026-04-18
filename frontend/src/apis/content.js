import { DOMAIN } from "./config";
import { getToken } from "../utilities/storage";

const authHeaders = () => {
  const token = getToken();

  if (!token) {
    return {};
  }

  return {
    Authorization: `Bearer ${token}`
  };
};

export const fetchCoursesApi = async () => {
  return fetch(`${DOMAIN}/api/v1/courses`);
};

export const fetchTopicsApi = async (courseId) => {
  return fetch(`${DOMAIN}/api/v1/courses/${courseId}/topics`);
};

export const fetchQuestionsApi = async (topicId, level, page = 1) => {
  const params = new URLSearchParams();
  if (level) params.append("level", level);
  params.append("page", page);

  return fetch(
    `${DOMAIN}/api/v1/topics/${topicId}/questions?${params.toString()}`,
    {
      headers: authHeaders()
    }
  );
};

export const createBookmarkApi = async (questionId) =>
  fetch(`${DOMAIN}/api/v1/questions/${questionId}/bookmark`, {
    method: "POST",
    headers: authHeaders()
  });

export const deleteBookmarkApi = async (questionId) =>
  fetch(`${DOMAIN}/api/v1/questions/${questionId}/bookmark`, {
    method: "DELETE",
    headers: authHeaders()
  });

export const createUpvoteApi = async (questionId) =>
  fetch(`${DOMAIN}/api/v1/questions/${questionId}/upvote`, {
    method: "POST",
    headers: authHeaders()
  });

export const deleteUpvoteApi = async (questionId) =>
  fetch(`${DOMAIN}/api/v1/questions/${questionId}/upvote`, {
    method: "DELETE",
    headers: authHeaders()
  });
