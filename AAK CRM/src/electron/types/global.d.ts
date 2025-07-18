import type { FileKey, Kursant, KursantInput } from "./kursant";

export {};

declare global {
  interface Window {
    api: {
      getAllKursants: () => Promise<any[]>;
      updateKursant: (kursant: Kursant) => Promise<void>;
      deleteKursant: (id: number) => Promise<void>;
      searchKursants: (query: string) => Promise<Kursant[]>;
      addKursant: (kursant: KursantInput) => Promise<number>;
      saveFileDialog: (kursantId: number) => Promise<string>;
      saveKursantFile: (
        kursantId: number,
        key: string
      ) => Promise<string | undefined>;
      deleteKursantFile: (
        kursantId: number,
        key: FileKey
      ) => Promise<{ success: boolean }>;
      pickLocalFile: () => Promise<File | null>;
      readFile: (path: string) => Promise<Uint8Array>;
      getFullPath: (relativePath: string) => string;
      minimize: () => void;
      maximize: () => void;
      close: () => void;
    };
  }
}
