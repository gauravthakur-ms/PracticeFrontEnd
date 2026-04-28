export default function ConfirmModal({
  open,
  title = "Are you sure?",
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive = false,
  onConfirm,
  onCancel,
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[1500] flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl max-w-sm w-[90%] p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-2">{title}</h3>
        {message && <p className="text-slate-600 text-sm mb-5">{message}</p>}
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm rounded-md text-white ${
              destructive ? "bg-red-600 hover:bg-red-700" : "bg-orange-500 hover:bg-orange-600"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
