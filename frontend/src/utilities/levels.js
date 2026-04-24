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

export const getLevelLabel = (level) => {
  switch (level) {
    case "low":
      return "Low";
    case "hard":
      return "Hard";
    case "medium":
    default:
      return "Medium";
  }
};

export const getLevelChipClasses = (level) => {
  switch (level) {
    case "low":
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-200";
    case "hard":
      return "border-rose-500/20 bg-rose-500/10 text-rose-200";
    case "medium":
    default:
      return "border-amber-500/20 bg-amber-500/10 text-amber-200";
  }
};

export const getQuestionNumberBgClasses = (level) => {
  switch (level) {
    case "low":
      return "bg-gradient-to-br from-emerald-500/90 to-emerald-600 text-white";
    case "hard":
      return "bg-gradient-to-br from-rose-500/90 to-rose-600 text-white";
    case "medium":
    default:
      return "bg-gradient-to-br from-amber-500/90 to-amber-600 text-white";
  }
};
