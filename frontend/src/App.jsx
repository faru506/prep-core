import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950">

      <Navbar />
      <main className="flex-1 overflow-hidden">
        <Outlet />
      </main>
      <Footer />

    </div>
  );
}

export default App;