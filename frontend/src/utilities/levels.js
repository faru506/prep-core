export const LEVEL_OPTIONS = [
  {
    value: "low",
    label: "Low"
  },
  {
    value: "medium",
    label: "Medium"
  },
  {
    value: "hard",
    label: "Hard"
  }
];

export const getLevelDotClasses = (level) => {
  switch (level) {
    case "low":
      return "bg-emerald-400/90 shadow-[0_0_0_4px_rgba(52,211,153,0.10)]";
    case "hard":
      return "bg-rose-400/90 shadow-[0_0_0_4px_rgba(251,113,133,0.10)]";
    case "medium":
    default:
      return "bg-amber-400/90 shadow-[0_0_0_4px_rgba(251,191,36,0.10)]";
  }
};
