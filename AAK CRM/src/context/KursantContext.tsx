import { createContext, useContext, useState } from "react";
import type { Kursant } from "../electron/types/kursant";

type KursantContextType = {
  selected: Kursant | null;
  setSelected: (kursant: Kursant | null) => void;
  loadKursants: () => Promise<Kursant[]>;
  kursants: Kursant[];
  setKursants: (kursants: Kursant[]) => void;
  selectedFilePath: string | null;
  setSelectedFilePath: (path: string | null) => void;
};

const KursantContext = createContext<KursantContextType | undefined>(undefined);

export function KursantProvider({ children }: { children: React.ReactNode }) {
  const [selected, setSelected] = useState<Kursant | null>(null);
  const [kursants, setKursants] = useState<Kursant[]>([]);
  const [selectedFilePath, setSelectedFilePath] = useState<string | null>(null);

  const loadKursants = async () => {
    const list = await window.api.getAllKursants();
    setKursants(list);
    return list;
  };

  return (
    <KursantContext.Provider
      value={{
        selected,
        setSelected,
        kursants,
        setKursants,
        loadKursants,
        selectedFilePath,
        setSelectedFilePath,
      }}
    >
      {children}
    </KursantContext.Provider>
  );
}

export function useKursantContext() {
  const context = useContext(KursantContext);
  if (!context) {
    throw new Error("useKursantContext must be used within a KursantProvider");
  }
  return context;
}
