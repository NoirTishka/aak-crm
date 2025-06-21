export {};

declare global {
  interface Window {
    api: {
      getAllKursants: () => Promise<any[]>;
      updateKursant: (kursant: Kursant) => Promise<void>;
      deleteKursant: (d) => Promise<void>;

      addKursant: (data: {
        fio: string;
        iin: string;
        phone: string;
        payment: number;
        bookBought: boolean;
        bookGiven: 'yes' | 'no' | null;
        materials: {
          video: boolean;
          tests: boolean;
          autodrome: boolean;
        };
        practice: {
          taken: boolean;
          count: number;
        };
      }) => Promise<void>;
      minimize: () => void;
      maximize: () => void;
      close: () => void;
    };
  }
}
