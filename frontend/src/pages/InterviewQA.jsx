const InterviewQA = () => {
  const interviewTopics = [
    "Ruby",
    "Rails",
    "React",
    "HTML",
    "CSS",
    "JavaScript",
    "MongoDB",
    "System Design",
    "Ruby1",
    "Rails1",
    "React1",
    "HTML1",
    "CSS1",
    "JavaScript1",
    "MongoDB1",
    "System Design1"
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
            key={topic}
            className="whitespace-nowrap px-5 py-2 rounded-lg 
                      bg-slate-800 border border-slate-700 
                      hover:border-indigo-500 
                      text-slate-300 hover:text-white 
                      transition"
          >
            {topic}
          </button>
        ))}

      </div>

    </div>
  );
};

export default InterviewQA;