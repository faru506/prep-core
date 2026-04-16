import { Link } from "react-router-dom";

const features = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: "Curated Q&A",
    description: "Handpicked interview questions with detailed answers from industry experts across various domains."
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    title: "Programming Practice",
    description: "Master coding challenges and improve your problem-solving skills with our structured learning paths."
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: "Track Progress",
    description: "Stay organized and monitor your growth as you prepare for your next big career move."
  }
];

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
      {/* Simple Public Navbar */}
      <nav className="w-full bg-slate-900/95 backdrop-blur-sm border-b border-slate-800 px-4 md:px-6 py-4 sticky top-0 z-[100]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="text-xl md:text-2xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            PrepCore
          </div>
          <div className="flex items-center gap-4">
            <Link 
              to="/login" 
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link 
              to="/register" 
              className="text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg transition-all"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-slate-950 to-cyan-900/10" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36">
          <div className="text-center">
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-extrabold tracking-tight mb-8">
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Master Your 
                <br className="hidden md:block" /> 
                Technical Interview
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed">
              The all-in-one platform designed to help developers ace their interviews. 
              Access curated Q&As, practice coding challenges, and track your progress across 
              Ruby, Rails, React, and System Design.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link 
                to="/register" 
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-2xl transition-all duration-200 hover:scale-105 hover:shadow-xl hover:shadow-indigo-500/25"
              >
                Start Your Journey
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              
              <Link 
                to="/login" 
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-2xl transition-all duration-200 hover:scale-105"
              >
                Sign In to Account
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Everything you need to succeed
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            We provide the tools and content you need to move from "I think I know" to "I can explain it perfectly".
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group p-8 rounded-3xl bg-slate-900/40 border border-slate-800 hover:border-indigo-500/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/10"
            >
              <div className="inline-flex p-4 rounded-2xl bg-indigo-500/10 text-indigo-400 mb-6 group-hover:bg-indigo-500/20 group-hover:text-indigo-300 transition-colors">
                {feature.icon}
              </div>
              
              <h3 className="text-2xl font-semibold text-slate-100 mb-3">
                {feature.title}
              </h3>
              
              <p className="text-slate-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-indigo-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
          <div className="text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Ready to land your dream job?
            </h2>
            <p className="text-indigo-100 mb-10 max-w-2xl mx-auto text-lg">
              Join the community of developers mastering their technical interviews with PrepMaster.
            </p>
            <Link 
              to="/register" 
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-indigo-600 bg-white hover:bg-slate-100 rounded-2xl transition-all hover:scale-105 shadow-xl"
            >
              Create Your Free Account
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            PrepCore
          </div>
          <div className="text-slate-500 text-sm">
            © {new Date().getFullYear()} PrepMaster. All rights reserved.
          </div>
          <div className="flex gap-6">
            <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Terms</a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
