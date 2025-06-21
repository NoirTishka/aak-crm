import { useState, useRef } from "react";
import type { Kursant } from "../types/kursant";

type Props = {
  onAdded?: () => void;
  onUpdated?: () => void;
  onClose: () => void;
  initialData?: Kursant;
  editMode?: boolean;
};


export function AddKursantForm({ onAdded, onUpdated, onClose, initialData, editMode = false }: Props) {
  const [fio, setFio] = useState(initialData?.fio || "");
  const [iin, setIin] = useState(initialData?.iin || "");
  const [phone, setPhone] = useState(initialData?.phone || "");
  const [payment, setPayment] = useState<number | "">(initialData?.payment || "");
  const [bookBought, setBookBought] = useState(initialData?.bookBought || false);
  const [bookGiven, setBookGiven] = useState<"yes" | "no" | null>(initialData?.bookGiven || null);
  const [video, setVideo] = useState(initialData?.materials?.video ?? true);
  const [tests, setTests] = useState(initialData?.materials?.tests ?? true);
  const [autodrome, setAutodrome] = useState(initialData?.materials?.autodrome ?? true);
  const [practiceTaken, setPracticeTaken] = useState(initialData?.practice?.taken || false);
  const [practiceCount, setPracticeCount] = useState(initialData?.practice?.count?.toString() || "");
  const [category, setCategory] = useState(initialData?.category || "");

  const iinRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const paymentRef = useRef<HTMLInputElement>(null);
  const fioRef = useRef<HTMLInputElement>(null);
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const today = new Date().toISOString().split("T")[0];

    const kursant: Omit<Kursant, "id"> = {
      fio,
      iin,
      phone,
      category,
      payment: Number(payment),
      registered_at: initialData?.registered_at || today,
      avtomektep_start: initialData?.avtomektep_start || today,
      bookBought,
      bookGiven,
      materials: { video, tests, autodrome },
      practice: {
        taken: practiceTaken,
        count: Number(practiceCount),
      },
    };
    
    if (editMode && initialData) {
          await window.api.updateKursant({ ...kursant, id: initialData.id });
          onUpdated?.();
        } else {
          await window.api.addKursant(kursant);
          onAdded?.();
        }
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <button type="button" onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl">
        ✕
      </button>

      <input
        ref={fioRef}
        value={fio}
        onChange={e => setFio(e.target.value)}
        onKeyDown={e => { if (e.key === "ArrowDown") iinRef.current?.focus(); }}
        placeholder="ФИО"
        className="border p-1 w-full"
      />

      <input
        ref={iinRef}
        value={iin}
        onChange={e => setIin(e.target.value)}
        onKeyDown={e => {
          if (e.key === "ArrowDown") phoneRef.current?.focus();
          if (e.key === "ArrowUp") fioRef.current?.focus();
        }}
        placeholder="ИИН"
        className="border p-1 w-full"
      />

      <input
        ref={phoneRef}
        value={phone}
        onChange={e => setPhone(e.target.value)}
        onKeyDown={e => {
          if (e.key === "ArrowDown") paymentRef.current?.focus();
          if (e.key === "ArrowUp") iinRef.current?.focus();
        }}
        placeholder="Телефон"
        className="border p-1 w-full"
      />

      <label className="block mb-2 text-sm font-medium text-gray-700">Категория</label>
      <select
        value={category}
        onChange={e => setCategory(e.target.value)}
        className="w-full border border-gray-300 rounded p-2 mb-4 text-sm"
      >
        <option value="">Выберите категорию</option>
        {['B', 'A', 'A1', 'C1', 'C', 'D1', 'D', 'BE', 'C1E', 'CE', 'D1E', 'DE'].map(cat => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>

      <input
        ref={paymentRef}
        value={payment}
        onChange={e => setPayment(Number(e.target.value))}
        placeholder="Сумма оплаты"
        type="number"
        className="border p-1 w-full"
      />

      <label className="block">
        <input type="checkbox" checked={bookBought} onChange={e => setBookBought(e.target.checked)} /> Купил книгу?
      </label>

      {bookBought && (
        <div className="text-sm space-x-2">
          <label><input type="radio" name="bookGiven" value="yes" checked={bookGiven === "yes"} onChange={() => setBookGiven("yes")} /> Выдана</label>
          <label><input type="radio" name="bookGiven" value="no" checked={bookGiven === "no"} onChange={() => setBookGiven("no")} /> Не выдана</label>
        </div>
      )}

      <fieldset className="text-sm">
        <legend className="font-semibold">Материалы</legend>
        <label><input type="checkbox" checked={video} onChange={e => setVideo(e.target.checked)} /> Видеоуроки</label><br />
        <label><input type="checkbox" checked={tests} onChange={e => setTests(e.target.checked)} /> Тесты</label><br />
        <label><input type="checkbox" checked={autodrome} onChange={e => setAutodrome(e.target.checked)} /> Автодром</label>
      </fieldset>

      <label className="block">
        <input type="checkbox" checked={practiceTaken} onChange={e => setPracticeTaken(e.target.checked)} /> Берёт практику?
      </label>

      {practiceTaken && (
        <input
          type="number"
          inputMode="numeric"
          value={practiceCount}
          onChange={e => setPracticeCount(e.target.value)}
          placeholder="Кол-во занятий"
          className="border p-1 w-full"
        />
      )}

      <div className="flex justify-end mt-auto">
        <button type="submit" className="!bg-blue-600 !text-white px-4 py-2 rounded hover:!bg-blue-700">
          {editMode ? 'Редактировать' : 'Добавить'}
        </button>
      </div>
    </form>
  );
  };

   
