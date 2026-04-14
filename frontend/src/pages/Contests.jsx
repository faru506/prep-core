import { Link } from "react-router-dom";

const contests = [
  {
    id: 1,
    title: "Weekly Coding Challenge",
    description: "Solve algorithmic problems under time pressure.",
    status: "Active",
    participants: 234,
    difficulty: "Medium"
  },
  {
    id: 2,
    title: "System Design Sprint",
    description: "Design scalable systems and get expert feedback.",
    status: "Starting Soon",
    participants: 156,
    difficulty: "Hard"
  },
  {
    id: 3,
    title: "Frontend UI Challenge",
    description: "Build beautiful UI components from scratch.",
    status: "Active",
    participants: 189,
    difficulty: "Easy"
  },
  {
    id: 4,
    title: "Mock Interview Arena",
    description: "Practice real interview scenarios with peers.",
    status: "Active",
    participants: 312,
    difficulty: "All Levels"
  }
];

const Contests = () => {
  
  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-500/10 text-green-400 border-green-500/20";
      case "Starting Soon":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

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
                Coding Contests
              </span>
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Compete with other developers and level up your coding skills.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {contests.map((contest) => (
              <div 
                key={contest.id}
                className="group p-6 md:p-8 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-indigo-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-xl md:text-2xl font-semibold text-slate-100 mb-2 group-hover:text-indigo-400 transition-colors">
                      {contest.title}
                    </h3>
                    <p className="text-slate-400">
                      {contest.description}
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-3 mb-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-lg border text-sm ${getStatusColor(contest.status)}`}>
                    {contest.status}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-lg bg-slate-800 text-slate-300 text-sm">
                    {contest.difficulty}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-lg bg-slate-800 text-slate-300 text-sm">
                    {contest.participants} participants
                  </span>
                </div>
                
                <Link 
                  to="/interview_qa" 
                  className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
                >
                  Join Contest
                </Link>
              </div>
            ))}
            
          </div>
          
        </div>
      </div>

    </div>
  );
};

export default Contests;