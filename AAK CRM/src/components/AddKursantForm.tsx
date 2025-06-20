import { useState, useRef } from "react";
import type { Kursant } from "../types/kursant";

type Props = {
  onAdded: () => void;
  onClose: () => void;
};


export function AddKursantForm({ onAdded, onClose }: Props) {
 const [fio, setFio] = useState("");
  const [iin, setIin] = useState("");
  const [phone, setPhone] = useState("");
  const [payment, setPayment] = useState<number | "">("");
  const [bookBought, setBookBought] = useState(false);
  const [bookGiven, setBookGiven] = useState<"yes" | "no" | null>(null);
  const [video, setVideo] = useState(true);
  const [tests, setTests] = useState(true);
  const [autodrome, setAutodrome] = useState(true);
  const [practiceTaken, setPracticeTaken] = useState(false);
  const [practiceCount, setPracticeCount] = useState("");
  const [avtomektep_start, setAvtomektepStart] = useState(Date);

  const iinRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const paymentRef = useRef<HTMLInputElement>(null);
  const fioRef = useRef<HTMLInputElement>(null);

  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const today = new Date().toISOString().split("T")[0];

    const newKursant: Omit<Kursant, "id"> = {
      fio,
      iin,
      phone,
      payment: Number(payment),
      registered_at: today,
      avtomektep_start: today,
      bookBought,
      bookGiven,
      materials: {
        video,
        tests,
        autodrome,
      },
      practice: {
        taken: practiceTaken,
        count: Number(practiceCount),
      },
    };

    await window.api.addKursant(newKursant);
      onAdded();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">

        <button
          type="button"
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
        >
          ✕
        </button>

        <input
          ref={fioRef}
          value={fio}
          onChange={e => setFio(e.target.value)}
          onKeyDown={e => {
            if (e.key === "ArrowDown") iinRef.current?.focus();
          }}
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

       <input
          ref={paymentRef}
          value={payment}
          onChange={e => setPayment(Number(e.target.value))}
          onKeyDown={(e) => {
            if (e.key === "ArrowUp") {
              e.preventDefault(); // ← запрещаем увеличение
              phoneRef.current?.focus();
            }
            if (e.key === "ArrowDown") {
              e.preventDefault(); // ← запрещаем уменьшение
            }
          }}
          placeholder="Сумма оплаты"
          type="number"
          className="border p-1 w-full"
        />

        <label className="block">
          <input type="checkbox" checked={bookBought} onChange={e => setBookBought(e.target.checked)} />
          Купил книгу?
        </label>

        {bookBought && (
          <div className="text-sm space-x-2">
            <label>
              <input type="radio" name="bookGiven" value="yes" checked={bookGiven === "yes"} onChange={() => setBookGiven("yes")} />
              Выдана
            </label>
            <label>
              <input type="radio" name="bookGiven" value="no" checked={bookGiven === "no"} onChange={() => setBookGiven("no")} />
              Не выдана
            </label>
          </div>
        )}

        <fieldset className="text-sm">
          <legend className="font-semibold">Материалы</legend>
          <label><input type="checkbox" checked={video} onChange={e => setVideo(e.target.checked)} /> Видеоуроки</label><br />
          <label><input type="checkbox" checked={tests} onChange={e => setTests(e.target.checked)} /> Тесты</label><br />
          <label><input type="checkbox" checked={autodrome} onChange={e => setAutodrome(e.target.checked)} /> Автодром</label>
        </fieldset>

        <label className="block">
          <input type="checkbox" checked={practiceTaken} onChange={e => setPracticeTaken(e.target.checked)} />
          Берёт практику?
        </label>

        {practiceTaken && (
         <input
            type="number"
            inputMode="numeric"
            value={practiceCount}
            onFocus={e => e.target.select()}
            onChange={e => setPracticeCount(e.target.value)}
            onKeyDown={e => {
              if (e.key === "ArrowUp" || e.key === "ArrowDown") e.preventDefault();
            }}
            placeholder="Кол-во занятий"
            className="border p-1 w-full"
          />
        )}

      <div className="flex justify-end mt-auto">
        <button
          type="submit"
          className="!bg-blue-600 !text-white px-4 py-2 rounded hover:!bg-blue-700"
        >
          Добавить
        </button>
      </div>
    </form>
  );
}
