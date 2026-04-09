import { DOMAIN } from "./config";

export const fetchQuestionsApi = async (topicId) => {
  return fetch(
    `${DOMAIN}/api/v1/topics/${topicId}/questions`
  );
};