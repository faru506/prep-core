const Sidebar = ({
  topics,
  selectedTopic,
  setSelectedTopic
}) => {
  return (
    <div className="
      w-64
      bg-slate-900
      border-r border-slate-800
      p-4
      h-full
      overflow-y-auto
    ">

      <div className="flex flex-col gap-2">

        {topics.map((topic) => (
          <button
            key={topic.name}
            onClick={() => setSelectedTopic(topic)}
            className={`
              text-left px-4 py-2 rounded-lg
              hover:bg-slate-800
              transition
              ${
                selectedTopic.name === topic.name
                  ? "bg-slate-800"
                  : ""
              }
            `}
          >
            {topic.name}
          </button>
        ))}

      </div>

    </div>
  );
};

export default Sidebar;