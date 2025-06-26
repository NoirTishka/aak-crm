import { useState, useEffect, useRef } from "react";
import type { Kursant } from "../electron/types/kursant";
import { FileUploader } from "./FileUploader";

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
  const [selected, setSelected] = useState<Kursant | null>(null);
  const [bookBought, setBookBought] = useState(initialData?.bookBought || false);
  const [bookGiven, setBookGiven] = useState<"yes" | "no" | null>(initialData?.bookGiven || null);
  const [video, setVideo] = useState(initialData?.materials?.video ?? true);
  const [tests, setTests] = useState(initialData?.materials?.tests ?? true);
  const [autodrome, setAutodrome] = useState(initialData?.materials?.autodrome ?? true);
  const [practiceTaken, setPracticeTaken] = useState(initialData?.practice?.taken || false);
  const [practiceCount, setPracticeCount] = useState(initialData?.practice?.count?.toString() || "");
  const [category, setCategory] = useState(initialData?.category || "");
  const [_kursantId, setKursantId] = useState<number | null>(null);
  const [tempFiles, setTempFiles] = useState<{
    payment?: string;
    idCard?: string;
  }>({});
  
   useEffect(() => {
      console.log('📌 useEffect triggered — editMode:', editMode, 'initialData.id:', initialData?.id);
      if (editMode && initialData?.id !== undefined) {
        setKursantId(initialData.id);
      }
    }, [editMode, initialData]);


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
      await window.api.updateKursant({ ...kursant, id: initialData.id, filePaths: tempFiles });
      onUpdated?.();
    } else {
      const newKursantId = await window.api.addKursant(kursant);
      setKursantId(newKursantId);
      onAdded?.();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative bg-white rounded-xl shadow-lg p-6 w-full max-w-xl space-y-5">
      <button type="button" onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl">✕</button>

      <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">
        {editMode ? 'Редактировать курсанта' : 'Добавить курсанта'}
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">ФИО</label>
          <input ref={fioRef} value={fio} onChange={e => setFio(e.target.value)} placeholder="ФИО"
            className="w-full rounded border px-4 py-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">ИИН</label>
          <input ref={iinRef} value={iin} onChange={e => setIin(e.target.value)} placeholder="ИИН"
            className="w-full rounded border px-4 py-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400" />
        </div>

        <FileUploader
          label="Удостоверение личности"
          fileKey="idCard"
          kursantId={_kursantId}
          onFileSelected={(fileKey, path) => {
            const newFiles = { ...tempFiles, [fileKey]: path };
              setTempFiles(newFiles);
                if (selected) {
                  setSelected({
                    ...selected,
                    filePaths: {
                      ...(selected.filePaths || {}),
                      [fileKey]: path,
                    },
                  });
                }
              }}
        />



        <div>
          <label className="block text-sm font-medium text-gray-700">Телефон</label>
          <input ref={phoneRef} value={phone} onChange={e => setPhone(e.target.value)} placeholder="Телефон"
            className="w-full rounded border px-4 py-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Категория</label>
          <select value={category} onChange={e => setCategory(e.target.value)}
            className="w-full rounded border px-4 py-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400">
            <option value="">Выберите категорию</option>
            {["B", "A", "A1", "C1", "C", "D1", "D", "BE", "C1E", "CE", "D1E", "DE"].map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Сумма оплаты</label>
          <input ref={paymentRef} value={payment} onChange={e => setPayment(Number(e.target.value))} type="number" placeholder="Сумма"
            className="w-full rounded border px-4 py-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400" />
        </div>

        <FileUploader
          label="Документ об оплате"
          fileKey="payment"
          kursantId={_kursantId}
          onFileSelected={(fileKey, path) => {
            const newFiles = { ...tempFiles, [fileKey]: path };
              setTempFiles(newFiles);
                if (selected) {
                  setSelected({
                    ...selected,
                    filePaths: {
                      ...(selected.filePaths || {}),
                      [fileKey]: path,
                    },
                  });
                }
              }}
        />


        <label className="inline-flex items-center gap-2">
          <input type="checkbox" checked={bookBought} onChange={e => setBookBought(e.target.checked)} /> Купил книгу?
        </label>

        {bookBought && (
          <div className="flex gap-6 text-sm">
            <label><input type="radio" name="bookGiven" value="yes" checked={bookGiven === "yes"} onChange={() => setBookGiven("yes")} /> Выдана</label>
            <label><input type="radio" name="bookGiven" value="no" checked={bookGiven === "no"} onChange={() => setBookGiven("no")} /> Не выдана</label>
          </div>
        )}

        <fieldset className="space-y-2">
          <legend className="font-medium text-gray-700">Материалы</legend>
          <div className="flex flex-wrap gap-4">
            <label><input type="checkbox" checked={video} onChange={e => setVideo(e.target.checked)} /> Видеоуроки</label>
            <label><input type="checkbox" checked={tests} onChange={e => setTests(e.target.checked)} /> Тесты</label>
            <label><input type="checkbox" checked={autodrome} onChange={e => setAutodrome(e.target.checked)} /> Автодром</label>
          </div>
        </fieldset>

        <label className="inline-flex items-center gap-2">
          <input type="checkbox" checked={practiceTaken} onChange={e => setPracticeTaken(e.target.checked)} /> Берёт практику?
        </label>

        {practiceTaken && (
          <input type="number" inputMode="numeric" value={practiceCount} onChange={e => setPracticeCount(e.target.value)} placeholder="Кол-во занятий"
            className="w-full rounded border px-4 py-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400" />
        )}
      </div>

      <div className="flex justify-end pt-4">
        <button type="submit" className="!bg-blue-600 hover:!bg-blue-700 text-white px-6 py-2 rounded-md transition">
          {editMode ? 'Редактировать' : 'Добавить'}
        </button>
      </div>

    </form>
  );
};

export default AddKursantForm;