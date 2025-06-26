export type Kursant = {
  id?: number;
  fio: string;
  iin: string;
  phone: string;
  category: string;
  payment: number;
  bookBought: boolean;
  bookGiven: "yes" | "no" | null;
  materials: {
    video: boolean;
    tests: boolean;
    autodrome: boolean;
  };
  practice: {
    taken: boolean;
    count: number;
  };
  filePaths?: {
    idCard?: string;
    payment?: string;
  };
  registered_at: string;
  avtomektep_start: string;
};

export type KursantInput = Omit<Kursant, 'id' | 'registered_at'>;

export type FileKey = "idCard" | "payment";