import { useParams } from "react-router-dom";
import { useInterviewQuestions } from "../../hooks/useInterview";

export default function InterviewTopicPage() {

  const { topicSlug } = useParams();

  const {
    data: questions,
    isLoading,
  } = useInterviewQuestions(topicSlug || "");

  if (isLoading) {
    return (
      <div className="p-6">
        Loading questions...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">

      <h1 className="text-2xl font-bold mb-6">
        {topicSlug} Questions
      </h1>

      <div className="space-y-4">

        {questions?.map((q: any) => (

          <div
            key={q.id}
            className="border rounded-lg p-4"
          >

            <h2 className="font-semibold text-lg">
              {q.question}
            </h2>

            <p className="mt-2 text-gray-700">
              {q.answer}
            </p>

          </div>

        ))}

      </div>

    </div>
  );
}