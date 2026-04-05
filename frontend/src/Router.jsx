import { createBrowserRouter } from "react-router-dom";
import Authentication from "./pages/Authentication";
import App from "./App";
import ProtectedRoute from "./components/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Authentication />
  },
  {
    path: "/register",
    element: <Authentication />
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
    element: <Authentication />
  }
]);

export default router;