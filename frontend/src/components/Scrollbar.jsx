import { Routes, Route } from "react-router-dom"
import Home from "../pages/Home"
import Contests from "../pages/Contests";
import InterviewQA from "../pages/InterviewQA";
import Programs from "../pages/Programs";

const Scrollbar = () => {
  return (
    <Routes>

      <Route path="/" element={<Home />} />

      <Route path="/programs" element={<Programs />} />

      <Route path="/contests" element={<Contests />} />

      <Route path="/interview_qa" element={<InterviewQA />} />

    </Routes>
  );
};

export default Scrollbar;