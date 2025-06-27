import ConfirmModal from "./ConfirmModal";
import { useState } from "react";
import { useKursantContext } from '../context/KursantContext';
import AddKursantForm from "./AddKursantForm";


export function KursantDetails() {
   const {
    selected,
    setSelected,
    loadKursants,
  } = useKursantContext();

  const today = new Date().toLocaleDateString('ru-RU');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);


  return (    
    <div className="w-full h-full">
        {!selected ? (
            <div className="w-full h-full bg-white rounded-2xl shadow-lg p-6 overflow-y-auto flex justify-center items-center">
                 <div className="flex flex-col items-center text-center">
                    <div className="text-3xl mb-2">Выберите курсанта</div>
                    <div className="text-gray-600 max-w-md">
                    Выберите курсанта из списка, чтобы увидеть подробную информацию
                    </div>
                </div>
            </div>
        ) : (
            <div className="w-full h-full bg-white rounded-2xl shadow-lg p-6 overflow-y-auto">
            {/* Верх: фото + ФИО */}
            <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded bg-gray-200 flex items-center justify-center text-2xl text-gray-500 font-bold">
                {selected.fio?.charAt(0)}
                </div>
                <div>
                <div className="text-lg font-semibold text-gray-800">{selected.fio}</div>
                <div className="text-sm text-gray-500">ИИН: {selected.iin}</div>
                <div className="text-sm text-gray-500">Телефон: {selected.phone}</div>
                </div>
            </div>

            {/* Инфо-блоки */}
            <div className="text-sm text-gray-700 space-y-1">
                <div><span className="font-medium">Категория:</span> {selected.category}</div>
                <div><span className="font-medium">Записан:</span> {today}</div>
                <div><span className="font-medium">Старт в Автомектеп:</span> {today}</div>
                <div><span className="font-medium">Оплата:</span> <span className="font-bold">{selected.payment} ₸</span></div>
                <div><span className="font-medium">Книга:</span> {selected.bookBought ? "Выдана" : "Не куплена"}</div>
                <div>
                <span className="font-medium">Материалы:</span>{" "}
                {[selected.materials?.video && "Видеоуроки", selected.materials?.tests && "Тесты", selected.materials?.autodrome && "Автодром"]
                    .filter(Boolean)
                    .join(", ") || "Нет"}
                </div>
                <div><span className="font-medium">Практика:</span> {selected.practice?.taken ? `${selected.practice.count} занятий` : "Не берёт"}</div>
            </div>

            {/* Кнопки */}
            <div className="flex justify-end gap-3 mt-4">
                <button
                onClick={() => setEditModalOpen(true)}
                className="!bg-[#0066ff] hover:!bg-[#0052cc] text-white px-4 py-1 !rounded-xl flex items-center gap-2"
                >
                ✏️ Редактировать
                </button>
                <button
                onClick={() => setConfirmDeleteOpen(true)}
                className="!bg-[#ff3b3b] hover:!bg-[#cc2e2e] text-white px-4 py-1 !rounded-xl flex items-center gap-2"
                >
                🗑️ Удалить
                </button>
            </div>

            {editModalOpen && selected && (
                <div className="fixed inset-0 backdrop-blur-sm bg-black/10 flex items-center justify-center z-50">
                    <AddKursantForm
                    initialData={selected}
                    editMode={true}
                    onClose={() => setEditModalOpen(false)}
                    onUpdated={async () => {
                        setEditModalOpen(false);
                        const all = await loadKursants();
                        const updated = all.find(k => k.id === selected.id);
                        if (updated) setSelected(updated);
                    }}
                    />
                </div>
                )}

            {/* Модальное окно подтверждения удаления */}
            {confirmDeleteOpen && (
                <ConfirmModal
                message={`Вы уверены, что хотите удалить курсанта ${selected.fio}?`}
                onConfirm={async () => {
                    if (!selected?.id) return;
                    await window.api.deleteKursant(selected.id);
                    setSelected(null);
                    loadKursants();
                    setConfirmDeleteOpen(false);
                }}
                onCancel={() => setConfirmDeleteOpen(false)}
                />
            )}
            </div>
        )}
    </div>
  );
}