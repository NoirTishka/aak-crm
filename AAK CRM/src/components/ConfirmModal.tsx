type ConfirmModalProps = {
  onConfirm: () => void;
  onCancel: () => void;
  message: string;
};

export default function ConfirmModal({ onConfirm, onCancel, message }: ConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Подтверждение</h2>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-800"
          >
            Отмена
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded !bg-red-500 hover:!bg-red-600 text-white"
          >
            Удалить
          </button>
        </div>
      </div>
    </div>
  );
}
