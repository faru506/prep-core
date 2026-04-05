import { createBrowserRouter, Navigate } from "react-router-dom";

import Authentication from "./pages/Authentication";
import App from "./App";

import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";

import Home from "./pages/Home";
import Programs from "./pages/Programs";
import Contests from "./pages/Contests";
import InterviewQA from "./pages/InterviewQA";

import { getToken } from "./utilities/storage";

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

  // Protected Layout
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),

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
        path: "programs",
        element: <Programs />
      },

      {
        path: "contests",
        element: <Contests />
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