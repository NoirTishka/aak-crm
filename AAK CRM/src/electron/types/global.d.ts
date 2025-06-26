import type { Kursant, KursantInput } from "./kursant";

export {};

declare global {
  interface Window {
    api: {
      getAllKursants: () => Promise<any[]>;
      updateKursant: (kursant: Kursant) => Promise<void>;
      deleteKursant: (id: number) => Promise<void>;
      searchKursants: (query: string) => Promise<Kursant[]>;
      addKursant: (kursant: Kursant) => Promise<number>;
      saveFileDialog: (kursantId: number) => Promise<string>;
      saveKursantFile: (kursantId: number, key: string) => Promise<string | undefined>;
      pickLocalFile: () => Promise<File | null>;
      readFile: (path: string) => Promise<Uint8Array>;
      minimize: () => void;
      maximize: () => void;
      close: () => void;
    };
  }
}
