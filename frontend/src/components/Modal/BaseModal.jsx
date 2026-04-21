const BaseModal = ({ title, children, onClose }) => {

  return (

    <div className="fixed inset-0 z-50">

      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />

      <div className="relative flex justify-center pt-16">

         <div className="w-[86vw] max-w-[1180px] rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-6 text-white shadow-[0_32px_80px_rgba(0,0,0,0.5)] mx-4">

          <div className="flex justify-between items-center mb-4">

            <h2 className="text-lg font-semibold text-slate-100">
              {title}
            </h2>

             <button
               onClick={onClose}
               className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/10 text-slate-400 transition hover:border-white/30 hover:text-white"
             >
              ✕
            </button>

          </div>

          {children}

        </div>

      </div>

    </div>

  );

};

export default BaseModal;
