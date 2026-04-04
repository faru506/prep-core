import Navbar from './components/Navbar.jsx'
import MainContent from "./components/MainContent";
import Footer from './components/Footer.jsx'

function App() {

  return (
   <div className="min-h-screen flex flex-col bg-slate-950">

      <Navbar />

      <main className="flex-grow">
        <MainContent />
      </main>

      <Footer />

    </div>
  )
}

export default App
