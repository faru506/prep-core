const ActionIconButton = ({
  label,
  onClick,
  tone = "default",
  children
}) => {

  const toneClasses = {
    default: "text-slate-300 hover:text-white hover:bg-slate-700/80 hover:ring-1 hover:ring-slate-500/50",
    primary: "text-indigo-300 hover:text-white hover:bg-indigo-500/20 hover:ring-1 hover:ring-indigo-400/40",
    danger: "text-rose-300 hover:text-white hover:bg-rose-500/20 hover:ring-1 hover:ring-rose-400/40"
  };

  return (

    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={`flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.02] transition duration-150 active:scale-95 ${toneClasses[tone]}`}
    >
      {children}
    </button>

  );

};

export default ActionIconButton;
