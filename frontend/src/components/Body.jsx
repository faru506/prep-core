import { useState } from "react";
import Sidebar from "./Sidebar";
import TopicContent from "./TopicContent";

const topics = [
  {
    name: "Ruby",
    content: "Ruby is an object-oriented programming language."
  },
  {
    name: "Rails",
    content: "Rails is a web framework built using Ruby."
  },
  {
    name: "React",
    content: "React is a JavaScript library for building UI."
  },
  {
    name: "MongoDB",
    content: "MongoDB is a NoSQL database."
  },
  {
    name: "Ruby1",
    content: "Ruby is an object-oriented programming language."
  },
  {
    name: "Rails1",
    content: "Rails is a web framework built using Ruby."
  },
  {
    name: "React1",
    content: "React is a JavaScript library for building UI."
  },
  {
    name: "MongoDB1",
    content: "MongoDB is a NoSQL database."
  },
  {
    name: "Ruby2",
    content: "Ruby is an object-oriented programming language."
  },
  {
    name: "Rails2",
    content: "Rails is a web framework built using Ruby."
  },
  {
    name: "React2",
    content: "React is a JavaScript library for building UI."
  },
  {
    name: "MongoDB2",
    content: "MongoDB is a NoSQL database."
  },
  {
    name: "Ruby3",
    content: "Ruby is an object-oriented programming language."
  },
  {
    name: "Rails3",
    content: "Rails is a web framework built using Ruby."
  },
  {
    name: "React3",
    content: "React is a JavaScript library for building UI."
  },
  {
    name: "MongoDB3",
    content: "MongoDB is a NoSQL database."
  },
  {
    name: "Ruby4",
    content: "Ruby is an object-oriented programming language."
  },
  {
    name: "Rails4",
    content: "Rails is a web framework built using Ruby."
  },
  {
    name: "React4",
    content: "React is a JavaScript library for building UI."
  },
  {
    name: "MongoDB4",
    content: "MongoDB is a NoSQL database."
  }
];

const Body = () => {
  const [selectedTopic, setSelectedTopic] =
    useState(topics[0]);

  return (
    <div className="flex h-screen bg-slate-950 text-white">

      <Sidebar
        topics={topics}
        selectedTopic={selectedTopic}
        setSelectedTopic={setSelectedTopic}
      />

      <TopicContent
        selectedTopic={selectedTopic}
      />

    </div>
  );
};

export default Body;