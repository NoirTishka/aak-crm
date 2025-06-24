import ConfirmModal from "./ConfirmModal";
import { useState } from "react";
import type { Kursant } from '../types/kursant';

export function KursantDetails() {
    const [selected, setSelected] = useState<Kursant | null>(null);
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);    
    const today = new Date().toLocaleDateString('ru-RU');
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [kursants, setKursants] = useState<Kursant[]>([]);
    async function loadKursants() {
        const list = await window.api.getAllKursants();
        setKursants(list);
        return list;
    }
return (    
    <div className="basis-2/3 h-screen p-8 bg-green-50 overflow-hidden">
        {!selected ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-gray-500">
            <div className="text-3xl mb-2">Выберите курсанта</div>
            <div>Выберите курсанта из списка, чтобы увидеть подробную информацию</div>
            </div>
        ) : (
            <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col gap-4 max-w-2xl mx-auto">
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
                className="!bg-blue-600 hover:!bg-blue-700 text-white px-4 py-1 !rounded-xl flex items-center gap-2"
                >
                ✏️ Редактировать
                </button>
                <button
                onClick={() => setConfirmDeleteOpen(true)}
                className="!bg-red-600 hover:!bg-red-700 text-white px-4 py-1 !rounded-xl flex items-center gap-2"
                >
                🗑️ Удалить
                </button>
            </div>

            {/* Модальное окно подтверждения удаления */}
            {confirmDeleteOpen && (
                <ConfirmModal
                message={`Вы уверены, что хотите удалить курсанта ${selected.fio}?`}
                onConfirm={async () => {
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