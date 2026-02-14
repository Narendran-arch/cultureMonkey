
export default function ConfirmModal({
  isOpen,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmText = "Yes, Delete",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}) {
  return (
    <>
      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/40 z-40"
           
          />

          {/* Modal */}
          <div
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            
          >
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
              <h2 className="text-lg font-semibold mb-2">
                {title}
              </h2>

              <p className="text-sm text-gray-500 mb-6">
                {description}
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={onCancel}
                  className="px-4 py-2 rounded-lg border text-sm"
                >
                  {cancelText}
                </button>

                <button
                  onClick={onConfirm}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm hover:bg-red-700"
                >
                  {confirmText}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
