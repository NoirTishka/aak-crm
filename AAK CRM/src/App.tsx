import './App.css'
import { useEffect, useState } from 'react';
import type { Kursant } from './types/kursant';
import type { ChangeEvent } from 'react';
import { AddKursantForm } from './components/AddKursantForm';
import ConfirmModal from "./components/ConfirmModal";

export default function App() {
  const [selected, setSelected] = useState<Kursant | null>(null);
  const [kursants, setKursants] = useState<Kursant[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const noDrag = {['-webkit-app-region']: 'no-drag'} as React.CSSProperties;
  const drag = {['-webkit-app-region']: 'drag'} as React.CSSProperties;
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Kursant[]>([]);


  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    window.api.searchKursants(value);
  };


  useEffect(() => {
    loadKursants();
  }, []);

  async function loadKursants() {
    const list = await window.api.getAllKursants();
    setKursants(list);
    return list;
  }

  return (
    <div className="h-screen w-screen flex flex-col">
      {/* Верхняя draggable панель */}
      <div
        className="h-10 w-full bg-gray-600 flex items-center justify-between px-4"
        style={drag}
      >
        <div className="text-white font-semibold select-none">T'chnologies</div>

        <div className="flex gap-1" style={noDrag}>
          <button
            onClick={() => window.api.minimize()}
            className="window-button w-10 h-8 flex items-center justify-center text-sm !bg-gray-600 hover:!bg-gray-700 text-black rounded p-0"
          >
            –
          </button>
          <button
            onClick={() => window.api.maximize()}
            className="window-button w-10 h-8 flex items-center justify-center text-sm !bg-gray-600 hover:!bg-gray-700 text-black rounded p-0"
          >
            ▢
          </button>
          <button
            onClick={() => window.api.close()}
            className="window-button w-10 h-8 flex items-center justify-center text-sm !bg-gray-600 hover:!bg-[#cc4c4c] text-black rounded p-0"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Основной контент */}
      <div className="flex flex-1 w-full">
        {/* Левая панель */}
        <div className="basis-1/3 bg-white shadow-md border-r border-gray-200 p-4 flex flex-col">
          <h1 className="text-xl font-bold mb-4">АAK CRM</h1>

          <input
            type="text"
            placeholder="Поиск по ИИН, ФИО или телефону"
            value={searchTerm}
            onChange={handleSearch}
            className="border rounded px-2 py-1 w-full"
          />

          {searchTerm && (
            <div className="w-full mt-1 bg-white border rounded shadow max-h-60 overflow-y-auto z-10">
              {searchResults.length > 0 ? (
                searchResults.map(k => (
                  <div
                    key={k.id}
                    onClick={() => {
                      setSelected(k);
                      setSearchTerm('');
                      setSearchResults([]);
                    }}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                  >
                    <div className="font-semibold">{k.fio}</div>
                    <div className="text-sm text-gray-500">{k.iin} — {k.phone}</div>
                  </div>
                ))
              ) : (
                <div className="p-2 text-gray-500">Совпадений не найдено</div>
              )}
            </div>
          )}




          <div className="flex space-x-2 mb-4 text-sm">
            <button className="text-blue-600 font-semibold">Активные</button>
            <button className="text-gray-400">Архив</button>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-black py-2 rounded mb-4 text-sm"
          >
            + Добавить курсанта
          </button>

          {showModal && (
            <div className="fixed inset-0 backdrop-blur-sm bg-black/10 flex items-center justify-center z-50">
                <AddKursantForm
                  onClose={() => setShowModal(false)}
                  onAdded={async () => {
                    setShowModal(false);
                    await loadKursants();
                  }}
                />
            </div>
          )}
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

          <div className="overflow-auto flex-grow space-y-3">
            {kursants.map(k => (
              <div
                key={k.id}
                onClick={() => setSelected(k)}
                className={`p-3 bg-white border rounded shadow-sm cursor-pointer hover:bg-gray-50 ${
                  selected?.id === k.id ? 'border-blue-500' : ''
                }`}
              >
                <div className="font-semibold text-sm">{k.fio}</div>
                <div className="text-xs text-gray-600">ИИН: {k.iin}</div>
                <div className="text-xs text-gray-600">{k.phone}</div>
                <div className="text-xs text-gray-500">Записан: {k.registered_at}</div>
                <span className="mt-1 inline-block text-green-600 text-xs font-semibold">Активный</span>
              </div>
            ))}
          </div>
        </div>

        {/* Правая панель */}
        <div className="basis-2/3 p-8 bg-green-100 overflow-auto">
          {!selected ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-gray-500">
              <div className="text-3xl mb-2">Выберите курсанта</div>
              <div>Выберите курсанта из списка, чтобы увидеть подробную информацию</div>
            </div>
          ) : (
            <div className="space-y-4 pr-10">
  
              <h2>{selected.fio}</h2>
              <div className="text-sm text-gray-600">ИИН: {selected.iin}</div>
              <div className="text-sm text-gray-600">Телефон: {selected.phone}</div>
              <div className="text-sm text-gray-600">Категория: {selected.category}</div>
              <div className="text-sm text-gray-600">Записан: {selected.registered_at}</div>
              <div className="text-sm text-gray-600">Старт в Avtomektep: {selected.avtomektep_start}</div>
              <div className="pt-4 border-t">
                <div className="text-sm">Оплата: <strong>{selected.payment} ₸</strong></div>
                <div className="text-sm">
                  {selected.bookBought ? (selected.bookGiven === 'yes' ? 'Выдана' : 'Не выдана') : 'Не куплена'}
                </div>
                <div className="text-sm">
                  {selected.materials.video ? ' Видеоуроки,' : ''}
                  {selected.materials.tests ? ' Тесты,' : ''}
                  {selected.materials.autodrome ? ' Автодром' : ''}
                </div>
                <div className="text-sm">
                  {selected.practice.taken ? `${selected.practice.count} занятий` : 'Не берёт'}
                </div>
                <div className="flex justify-end">
                <button
                  onClick={() => setEditModalOpen(true)}
                  className="text-sm px-4 py-2 !bg-blue-500 hover:!bg-blue-600 text-white rounded"
                >
                  ✏️ Редактировать
                </button>

                <button
                  onClick={() => setConfirmDeleteOpen(true)}
                  className="!bg-red-500 hover:!bg-red-600 text-white px-4 py-2 rounded"
                >
                  🗑 Удалить
                </button>

                {confirmDeleteOpen && selected && (
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
            </div>
          </div>
          )}
          
          
        </div>
      </div>
    </div>
  );
}