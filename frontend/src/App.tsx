import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/layout/Layout";

import InterviewPage from "./pages/interview/InterviewPage";
import InterviewTopicPage from "./pages/interview/InterviewTopicPage";

function App() {
  return (
    <BrowserRouter>

      <Layout>

        <Routes>

          {/* Home Route */}
          <Route
            path="/"
            element={<InterviewPage />}
          />

          {/* Interview Topics */}
          <Route
            path="/interview"
            element={<InterviewPage />}
          />

          {/* Topic Questions */}
          <Route
            path="/interview/:topicSlug"
            element={<InterviewTopicPage />}
          />

        </Routes>

      </Layout>

    </BrowserRouter>
  );
}

export default App;