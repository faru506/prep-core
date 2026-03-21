import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3000/api/v1",
});

export const interviewApi = {

  topics: () =>
    api.get("/interview_topics"),

  questions: (
    topicSlug: string,
    params?: object
  ) =>
    api.get(
      `/interview_topics/${topicSlug}/interview_questions`,
      { params }
    ),

  question: (
    topicSlug: string,
    id: string
  ) =>
    api.get(
      `/interview_topics/${topicSlug}/interview_questions/${id}`
    ),

};