const Programs = () => {

  const programTopics = [
    "Strings",
    "Arrays",
    "Stacks",
    "Queues",
    "Linked List",
    "Trees",
    "Graphs",
    "Dynamic Programming"
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {programTopics.map((topic) => (
        <div
          key={topic}
          className="bg-slate-800 border border-slate-700 rounded-lg p-4 hover:border-indigo-500 transition cursor-pointer"
        >
          {topic}
        </div>
      ))}

    </div>
  );
};

export default Programs;