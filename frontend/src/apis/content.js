import { DOMAIN, apiFetch } from "./config";
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
  return apiFetch(`${DOMAIN}/api/v1/courses`);
};

export const fetchTopicsApi = async (courseId) => {
  return apiFetch(`${DOMAIN}/api/v1/courses/${courseId}/topics`);
};

export const fetchQuestionsApi = async (topicId, filter, page = 1) => {
  const params = new URLSearchParams();
  if (filter === "upvote") {
    params.append("sort", "upvotes");
  } else if (filter) {
    params.append("level", filter);
  }
  params.append("page", page);
  params.append("per_page", "10");

  return apiFetch(
    `${DOMAIN}/api/v1/topics/${topicId}/questions?${params.toString()}`,
    {
      headers: authHeaders()
    }
  );
};

export const fetchBookmarkedItemsApi = async () =>
  apiFetch(`${DOMAIN}/api/v1/bookmarks`, {
    headers: authHeaders()
  });

export const createBookmarkApi = async (questionId) =>
  apiFetch(`${DOMAIN}/api/v1/questions/${questionId}/bookmark`, {
    method: "POST",
    headers: authHeaders()
  });

export const deleteBookmarkApi = async (questionId) =>
  apiFetch(`${DOMAIN}/api/v1/questions/${questionId}/bookmark`, {
    method: "DELETE",
    headers: authHeaders()
  });

export const createUpvoteApi = async (questionId) =>
  apiFetch(`${DOMAIN}/api/v1/questions/${questionId}/upvote`, {
    method: "POST",
    headers: authHeaders()
  });

export const deleteUpvoteApi = async (questionId) =>
  apiFetch(`${DOMAIN}/api/v1/questions/${questionId}/upvote`, {
    method: "DELETE",
    headers: authHeaders()
  });
