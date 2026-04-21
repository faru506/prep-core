const BaseModal = ({ title, children, onClose }) => {

  return (

    <div className="fixed inset-0 z-50">

      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />

      <div className="relative flex justify-center pt-16 px-4">
 
          <div className="w-full max-w-[1180px] max-h-[80vh] overflow-y-auto rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-6 text-white shadow-[0_32px_80px_rgba(0,0,0,0.5)]">
 
           <div className="sticky top-0 z-10 flex justify-between items-center mb-4 bg-slate-900/60 backdrop-blur-md py-2">
 
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
