import { Routes, Route } from "react-router-dom"
import Home from "../pages/Home"
import Contests from "../pages/Contests";
import InterviewQA from "../pages/InterviewQA";
import Programs from "../pages/Programs";

const MainContent = () => {
  return (
    <div className="py-3">

      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/programs" element={<Programs />} />

        <Route path="/contests" element={<Contests />} />

        <Route path="/interview_qa" element={<InterviewQA />} />

      </Routes>

    </div>
  );
};

export default MainContent;