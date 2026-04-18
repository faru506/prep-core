import { DOMAIN } from "./config";

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
    `${DOMAIN}/api/v1/topics/${topicId}/questions?${params.toString()}`
  );
};
