const toneClasses = {
  danger: {
    badge: "bg-rose-500/12 text-rose-300 ring-1 ring-rose-500/20",
    button: "bg-rose-600 hover:bg-rose-500 focus-visible:outline-rose-400"
  },
  primary: {
    badge: "bg-indigo-500/12 text-indigo-300 ring-1 ring-indigo-500/20",
    button: "bg-indigo-600 hover:bg-indigo-500 focus-visible:outline-indigo-400"
  }
};

const ConfirmDialog = ({
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  tone = "danger",
  onConfirm,
  onCancel
}) => {

  const palette = toneClasses[tone] || toneClasses.danger;

  return (

    <div className="fixed inset-0 z-[60]">

      <div
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
        onClick={onCancel}
      />

      <div className="relative flex min-h-full items-center justify-center p-4">

        <div className="w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-2xl shadow-black/50">

          <div className="flex gap-4 px-6 py-5">

            <div className={`mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${palette.badge}`}>
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="2">
                <path d="M12 8v5" strokeLinecap="round" />
                <path d="M12 16h.01" strokeLinecap="round" />
                <path d="M10.3 3.84 2.82 16.5A2 2 0 0 0 4.53 19.5h14.94a2 2 0 0 0 1.71-3L13.7 3.84a2 2 0 0 0-3.4 0Z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <div className="min-w-0">

              <h2 className="text-lg font-semibold text-white">
                {title}
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-300">
                {description}
              </p>

            </div>

          </div>

          <div className="flex justify-end gap-3 border-t border-white/10 bg-slate-900/80 px-6 py-4">

            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg border border-white/10 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-700"
            >
              {cancelLabel}
            </button>

            <button
              type="button"
              onClick={onConfirm}
              className={`rounded-lg px-4 py-2 text-sm font-semibold text-white transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${palette.button}`}
            >
              {confirmLabel}
            </button>

          </div>

        </div>

      </div>

    </div>

  );

};

export default ConfirmDialog;
