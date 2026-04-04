const Contests = () => {
    const contests = [
    {
      name: "Weekly Coding Contest",
      date: "May 10, 2026",
      duration: "2 Hours"
    },
    {
      name: "Mock Interview Challenge",
      date: "May 15, 2026",
      duration: "3 Hours"
    }
  ];

  return (
    <div className="space-y-4">
      {contests.map((contest, index) => (
        <div
          key={index}
          className="bg-slate-800 border border-slate-700 rounded-lg p-5"
        >
          <h3 className="text-white font-semibold mb-2">
            {contest.name}
          </h3>

          <p className="text-slate-400 text-sm">
            Date: {contest.date}
          </p>

          <p className="text-slate-400 text-sm">
            Duration: {contest.duration}
          </p>

        </div>
      ))}

    </div>
  );
};

export default Contests;