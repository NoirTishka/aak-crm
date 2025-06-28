export type Kursant = {
  id: number;
  fio: string;
  iin: string;
  phone: string;
  category: string;
  payment: number;
  registeredDate: string;
  avtomektep_start: string;
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
    payment?: string;
    idCard?: string;
  };
  group: string;
  access: {
    video: { open: boolean; until?: string };
    tests: { open: boolean; until?: string };
    autodrome: { open: boolean; until?: string };
  };
  examPassed: boolean;
};

export type KursantInput = Omit<Kursant, 'id'>;

export type FileKey = "idCard" | "payment";