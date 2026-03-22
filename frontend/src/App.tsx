import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

function Home() {
  return (
    <div style={{ padding: "40px" }}>
      <h1>Interview Prep Platform 🚀</h1>
    </div>
  );
}

function Dashboard() {
  return <h2>Dashboard 🔐</h2>;
}

function App() {
  return (
    <BrowserRouter>

      <Navbar />

      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;