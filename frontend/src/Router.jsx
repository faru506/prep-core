import { createBrowserRouter, Navigate } from "react-router-dom";
import Authentication from "./pages/Authentication";
import App from "./App";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";
import { getToken } from "./utilities/storage";

const router = createBrowserRouter([
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
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    )
  },
  {
    path: "*",
    element: getToken()
      ? <Navigate to="/" replace />
      : <Navigate to="/login" replace />
  }
]);

export default router;