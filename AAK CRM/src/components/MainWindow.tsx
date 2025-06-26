import { SideBar } from './Sidebar';
import { KursantDetails } from './KursantDetails';
import { FileViewer } from './FileViewer';
import { useKursantContext } from '../context/KursantContext';
import type { FileKey } from "../electron/types/kursant";



export function MainWindow() {
  const { selected, setSelected } = useKursantContext();

    const handleDeleteFile = async (key: FileKey): Promise<boolean> => {
        if (!selected?.id) return false;

        const success = await window.api.deleteKursantFile(selected.id, key);
        if (success) {
            const updatedPaths = { ...selected.filePaths };
            delete updatedPaths[key];

            setSelected({ ...selected, filePaths: updatedPaths });
            return true;
        }

            return false;
        };

  return (
    <div className="flex w-full h-full bg-blue-50 overflow-hidden">
      <div className="w-[25%] h-full overflow-y-auto">
        <SideBar />
      </div>
      <div className="w-[35%] h-full overflow-y-auto p-4">
          <KursantDetails />
      </div>
      <div className="w-[40%] h-full overflow-y-auto p-4">
        <div className="bg-white rounded-2xl shadow-lg h-full p-4 flex flex-col">
          {selected?.filePaths && (
            <FileViewer
              filePaths={Object.entries(selected.filePaths).reduce((acc, [path, key]) => {
                if (key) acc[key as FileKey] = path;
                return acc;
              }, {} as Record<FileKey, string>)}
              onDeleteFile={handleDeleteFile}
            />
          )}
        </div>
      </div>
    </div>
  );
}
