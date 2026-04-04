const InterviewQA = () => {
const interviewTopics = [
  {
    name: "Ruby",
    topics: [
      "Ruby Basics",
      "OOP Fundamentals",
      "Collections",
      "Blocks & Iterators",
      "Modules & Mixins",
      "Exception Handling",
      "Procs & Lambdas",
      "Metaprogramming",
      "Ruby Object Model",
      "Concurrency",
      "Design Patterns",
      "Testing (RSpec)",
      "Enumerable Deep Dive",
      "Rails Internals",
      "Memory & GC",
      "Advanced Meta",
      "Performance Tuning",
      "System Design",
      "Concurrency Adv",
      "Ruby Internals",
      "Code Quality & Ops"
    ]
  },
  {
    name: "Rails",
    topics: []
  },
  {
    name: "React",
    topics: []
  },
  {
    name: "HTML",
    topics: []
  },
  {
    name: "CSS",
    topics: []
  },
  {
    name: "JavaScript",
    topics: []
  },
  {
    name: "MongoDB",
    topics: []
  },
  {
    name: "System Design",
    topics: []
  },
  {
    name: "Ruby1",
    topics: []
  },
  {
    name: "Rails1",
    topics: []
  },
  {
    name: "React1",
    topics: []
  },
  {
    name: "HTML1",
    topics: []
  },
  {
    name: "CSS1",
    topics: []
  },
  {
    name: "JavaScript1",
    topics: []
  },
  {
    name: "MongoDB1",
    topics: []
  },
  {
    name: "System Design1",
    topics: []
  }
];

  return (

    <div className="sticky top-[64px] bg-slate-950 z-40 px-6 py-3 border-b border-slate-800">

      <div
        className="flex gap-4 overflow-x-auto
                  [&::-webkit-scrollbar]:hidden
                  [-ms-overflow-style:none]
                  [scrollbar-width:none]"
      >

        {interviewTopics.map((topic) => (
          <button
            key={topic.name}
            className="whitespace-nowrap px-5 py-2 rounded-lg 
                      bg-slate-800 border border-slate-700 
                      hover:border-indigo-500 
                      text-slate-300 hover:text-white 
                      transition"
          >
            {topic.name}
          </button>
        ))}

      </div>

    </div>
  );
};

export default InterviewQA;