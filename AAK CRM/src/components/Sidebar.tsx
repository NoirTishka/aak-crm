import { AddKursantForm } from './AddKursantForm';
import { useEffect, useState } from 'react';
import type { ChangeEvent } from 'react';
import type { Kursant } from '../electron/types/kursant';
import { useKursantContext } from '../context/KursantContext';

export function SideBar() {
    const {
    selected,
    setSelected,
    kursants,
    loadKursants
  } = useKursantContext();

    const handleSearch = async (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (value.trim() === '') {
        setSearchResults([]);
        return;
        }

        const results = await window.api.searchKursants(value);
        setSearchResults(results);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!searchResults.length) return;

        if (e.key === 'ArrowDown') {
        setHighlightedIndex((prev) => Math.min(prev + 1, searchResults.length - 1));
        } else if (e.key === 'ArrowUp') {
        setHighlightedIndex((prev) => Math.max(prev - 1, 0));
        } else if (e.key === 'Enter' || e.key === 'Tab' && highlightedIndex >= 0) {
        const selected = searchResults[highlightedIndex];
        setSelected(selected);
        setSearchTerm('');
        setIsFocused(true);
        }
    };

    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<Kursant[]>([]);
    const [isFocused, setIsFocused] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const [showModal, setShowModal] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);

    useEffect(() => {
        loadKursants();
    }, []);

return (
    <div className="flex flex-col h-full w-full px-4 py-2 bg-blue-50">
        <div className="bg-white rounded-2xl shadow-lg flex flex-col h-full overflow-hidden">
            {/* Фиксированная верхушка */}
            <div className="p-4 flex-shrink-0">
                <h1 className="text-xl font-bold mb-4">АAK CRM</h1>

                <div className="relative w-full">
                <input
                    type="text"
                    placeholder="Поиск по ИИН, ФИО или телефону"
                    value={searchTerm}
                    onChange={handleSearch}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setTimeout(() => setIsFocused(false), 150)}
                    className="border border-gray-300 rounded-t-md px-2 py-1 w-full focus:outline-none mb-2"
                />
                {isFocused && searchTerm && (
                    <div className="absolute top-full left-0 right-0 bg-white border border-t-0 border-gray-300 rounded-b-md shadow max-h-60 overflow-y-auto z-10">
                    {searchResults.length > 0 ? (
                        searchResults.map((k, index) => (
                        <div
                            key={k.id}
                            onClick={() => {
                            setSelected(k);
                            setSearchTerm('');
                            setIsFocused(false);
                            setSearchResults([]);
                            }}
                            className={`p-2 cursor-pointer ${
                            highlightedIndex === index ? 'bg-blue-100' : 'hover:bg-gray-100'
                            }`}
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
                </div>

                <div className="flex space-x-2 mb-4 text-sm">
                <button className="!bg-blue-600 text-white font-semibold">Активные</button>
                <button className="!bg-amber-500 text-white">Архив</button>
                </div>

                <button
                onClick={() => setShowModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-black py-2 rounded text-sm w-full"
                >
                + Добавить курсанта
                </button>
            </div>
            {showModal && (
            <div className="fixed inset-0 backdrop-blur-sm bg-black/10 flex items-center justify-center z-50">
                <AddKursantForm
                    onClose={() => setShowModal(false)}
                    onAdded={async (newKursant) => {
                        setShowModal(false);
                        const updatedList = await loadKursants();
                        const added = updatedList.find(k => k.id === newKursant.id);
                        if (added) setSelected(added);
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

            {/* Прокручиваемая часть */}
            <div className="flex-grow overflow-y-auto p-4 space-y-3">
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
                    <div className="text-xs text-gray-500">Записан: {k.registeredDate}</div>
                    <span className="mt-1 inline-block text-green-600 text-xs font-semibold">Активный</span>
                </div>
                ))}
            </div>
        </div>
    </div>    
    )
}