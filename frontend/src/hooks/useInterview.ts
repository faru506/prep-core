import { useQuery } from "@tanstack/react-query";
import { interviewApi } from "../utils/api";

export function useInterviewTopics() {
  return useQuery({
    queryKey: ["interview-topics"],

    queryFn: async () => {
      const { data } =
        await interviewApi.topics();

      return data.data;
    },

    staleTime: 10 * 60 * 1000,
  });
}

export function useInterviewQuestions(
  topicSlug: string,
  params?: object
) {
  return useQuery({
    queryKey: [
      "interview-questions",
      topicSlug,
      params,
    ],

    queryFn: async () => {
      const { data } =
        await interviewApi.questions(
          topicSlug,
          params
        );

      return data.data;
    },

    enabled: !!topicSlug,
  });
}