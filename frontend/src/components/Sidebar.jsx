const Sidebar = ({
  topics,
  selectedTopic,
  setSelectedTopic
}) => {
  return (
    <div className="
      w-64
      bg-slate-900/60
      backdrop-blur-md
      border-r border-white/10
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
               hover:bg-white/10
               transition
               ${
                 selectedTopic.name === topic.name
                   ? "bg-white/10"
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