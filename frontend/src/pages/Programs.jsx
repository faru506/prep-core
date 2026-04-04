const Programs = () => {

  const programTopics = [
    "Strings",
    "Arrays",
    "Stacks",
    "Queues",
    "Linked List",
    "Trees",
    "Graphs",
    "Dynamic Programming",
    "Strings1",
    "Arrays1",
    "Stacks1",
    "Queues1",
    "Linked List1",
    "Trees1",
    "Graphs1",
    "Dynamic Programming1"
  ];

  return (
    <div className="sticky top-[64px] bg-slate-950 z-40 px-6 py-3 border-b border-slate-800">

      <div
        className="flex gap-4 overflow-x-auto
                  [&::-webkit-scrollbar]:hidden
                  [-ms-overflow-style:none]
                  [scrollbar-width:none]"
      >

        {programTopics.map((topic) => (
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

export default Programs;