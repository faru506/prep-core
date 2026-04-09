import { DOMAIN } from "./config";

export const fetchTopicsApi = async (courseId) => {
  return fetch(
    `${DOMAIN}/api/v1/courses/${courseId}/topics`
  );
};