import { createBrowserRouter, Navigate } from "react-router-dom";

import Authentication from "./pages/Authentication";
import App from "./App";

import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";
import AdminRoute from "./routes/AdminRoute";

import Home from "./pages/Home";
import Programs from "./pages/Programs";
import Contests from "./pages/Contests";
import InterviewQA from "./pages/InterviewQA";
import Users from "./pages/Users";
import CourseManager from "./pages/CourseManager"
import LandingPage from "./pages/LandingPage";

import { getToken } from "./utilities/storage";

const Root = () => {
  return getToken() ? <App /> : <LandingPage />;
};

const router = createBrowserRouter([

  // Public
  {
    path: "/login",
    element: (
      <PublicRoute>
        <Authentication />
      </PublicRoute>
    )
  },

  {
    path: "/register",
    element: (
      <PublicRoute>
        <Authentication />
      </PublicRoute>
    )
  },

  // Main Layout (Conditional Root)
  {
    path: "/",
    element: <Root />,

    children: [

      {
        index: true,
        element: <Home />
      },

      {
        path: "interview_qa",
        element: <InterviewQA />
      },

      {
        path: "interview_qa/:courseSlug/:topicSlug?",
        element: <InterviewQA />
      },

      {
        path: "programs",
        element: <Programs />
      },

      {
        path: "contests",
        element: <Contests />
      },

      {
        path: "users",
        element: (
          <AdminRoute>
            <Users />
          </AdminRoute>
        )
      },

      {
        path: "course_manager",
        element: (
          <AdminRoute>
            <CourseManager />
          </AdminRoute>
        )
      }

    ]
  },

  // Fallback
  {
    path: "*",
    element: getToken()
      ? <Navigate to="/" replace />
      : <Navigate to="/login" replace />
  }
]);

export default router;
