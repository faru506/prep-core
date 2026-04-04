const TopicContent = ({ selectedTopic }) => {
  return (
    <div className="
      flex-1
      p-8
      h-full
      overflow-y-auto
    ">

      <h1 className="text-2xl font-bold mb-4">
        {selectedTopic.name}
      </h1>

      <p className="text-slate-300 leading-relaxed">
        {selectedTopic.content}
      </p>

    </div>
  );
};

export default TopicContent;