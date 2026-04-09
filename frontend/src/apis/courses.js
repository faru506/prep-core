import { DOMAIN } from "./config";

export const fetchCoursesApi = async () => {
  return fetch(`${DOMAIN}/api/v1/courses`);
};