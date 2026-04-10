const Modal = ({ title, children, onClose }) => {

  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center">

      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />

      <div className="relative bg-slate-900 text-white p-6 rounded-xl w-full max-w-md shadow-xl">

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

  );

};

export default Modal;