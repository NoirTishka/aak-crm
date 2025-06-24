import type { Kursant, KursantInput } from "./kursant";

export {};

declare global {
  interface Window {
    api: {
      getAllKursants: () => Promise<any[]>;
      updateKursant: (kursant: Kursant) => Promise<void>;
      deleteKursant: (id: number) => Promise<void>;
      searchKursants: (query: string) => Promise<Kursant[]>;
      addKursant: (data: KursantInput) => Promise<void>;
      minimize: () => void;
      maximize: () => void;
      close: () => void;
    };
  }
}
