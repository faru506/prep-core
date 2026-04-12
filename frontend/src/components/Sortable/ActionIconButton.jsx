const ActionIconButton = ({
  label,
  onClick,
  tone = "default",
  children
}) => {

  const toneClasses = {
    default: "text-slate-300 hover:text-white hover:bg-slate-700/70",
    primary: "text-indigo-300 hover:text-white hover:bg-indigo-500/20",
    danger: "text-rose-300 hover:text-white hover:bg-rose-500/20"
  };

  return (

    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${toneClasses[tone]}`}
    >
      {children}
    </button>

  );

};

export default ActionIconButton;
