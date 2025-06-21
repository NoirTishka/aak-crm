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
  registered_at: string;
  avtomektep_start: string;
};
