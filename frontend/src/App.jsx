import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Body from './components/Body.jsx'

function App() {

  return (
   <div className="min-h-screen flex flex-col bg-slate-950">

      <Navbar />
      <main className="flex-1 overflow-hidden">
        <Body />
      </main>
      <Footer />

    </div>
  )
}

export default App
