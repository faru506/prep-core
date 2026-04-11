const BaseModal = ({ title, children, onClose }) => {

  return (

    <div className="fixed inset-0 z-50">

      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />

      <div className="relative flex justify-center pt-16">

        <div className="bg-slate-900 text-white p-6 rounded-xl shadow-xl w-[75vw] max-w-[1200px] mx-4">

          <div className="flex justify-between items-center mb-4">

            <h2 className="text-lg font-semibold">
              {title}
            </h2>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white"
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