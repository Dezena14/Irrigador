export const ConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
}) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <div className="card w-full max-w-sm animate-fade-in">
                <h3 className="text-xl font-bold mb-2">{title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                    {message}
                </p>
                <div className="flex justify-end gap-3">
                    <button onClick={onClose} className="btn-secondary">
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg"
                    >
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;