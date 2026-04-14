import { Link } from "react-router-dom";

const programs = [
  {
    id: 1,
    title: "Frontend Development",
    description: "Master React, Vue, and modern frontend frameworks.",
    icon: "🎨",
    level: "All Levels",
    duration: "8 weeks"
  },
  {
    id: 2,
    title: "Backend Development",
    description: "Build robust APIs with Node.js, Ruby on Rails, and more.",
    icon: "⚙️",
    level: "Intermediate",
    duration: "10 weeks"
  },
  {
    id: 3,
    title: "Full Stack Mastery",
    description: "Complete end-to-end development with modern tech stacks.",
    icon: "🚀",
    level: "Advanced",
    duration: "16 weeks"
  },
  {
    id: 4,
    title: "System Design",
    description: "Learn to design scalable systems for big tech interviews.",
    icon: "🏗️",
    level: "Advanced",
    duration: "6 weeks"
  }
];

const Programs = () => {
  
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-slate-950 to-cyan-900/10" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        
          <div className="text-center mb-12 md:mb-16">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                Training Programs
              </span>
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Structured learning paths to help you master essential skills for your career.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
            
            {programs.map((program) => (
              <div 
                key={program.id}
                className="group p-6 md:p-8 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-indigo-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="text-4xl mb-4">{program.icon}</div>
                    <h3 className="text-xl md:text-2xl font-semibold text-slate-100 mb-2 group-hover:text-indigo-400 transition-colors">
                      {program.title}
                    </h3>
                    <p className="text-slate-400 mb-4">
                      {program.description}
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-3 mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-lg bg-slate-800 text-slate-300 text-sm">
                    {program.level}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-lg bg-slate-800 text-slate-300 text-sm">
                    {program.duration}
                  </span>
                </div>
                
                <Link 
                  to="/interview_qa" 
                  className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
                >
                  Start Learning
                </Link>
              </div>
            ))}
            
          </div>
          
        </div>
      </div>

    </div>
  );
};

export default Programs;