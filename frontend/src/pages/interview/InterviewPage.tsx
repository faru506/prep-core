import { Link } from "react-router-dom";
import { useInterviewTopics } from "../../hooks/useInterview";

export default function InterviewPage() {

  const { data: topics, isLoading } =
    useInterviewTopics();

  if (isLoading) {
    return (
      <div className="p-6">
        Loading topics...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">

      <h1 className="text-3xl font-bold mb-6">
        Interview Q&A
      </h1>

      <div className="grid md:grid-cols-2 gap-4">

        {topics?.map((topic: any) => (

          <Link
            key={topic.slug}
            to={`/interview/${topic.slug}`}
            className="border rounded-lg p-4 hover:bg-gray-50"
          >

            <h2 className="text-xl font-semibold">
              {topic.name}
            </h2>

            <p className="text-gray-600 mt-1">
              {topic.description}
            </p>

          </Link>

        ))}

      </div>

    </div>
  );
}