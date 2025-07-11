import { useState, useEffect } from "react";
import { PDFViewer } from "./PDFViewer";
import type { FileKey } from "../electron/types/kursant";

interface FileViewerProps {
  filePaths: Partial<Record<FileKey, string>>;
  onDeleteFile?: (key: FileKey) => Promise<boolean>;
}

export function FileViewer({ filePaths, onDeleteFile }: FileViewerProps) {
  const keys = Object.entries(filePaths)
    .filter(([, path]) => !!path)
    .map(([key]) => key as FileKey);

  const [activeKey, setActiveKey] = useState<FileKey | null>(keys[0] ?? null);
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const activePath = activeKey ? filePaths[activeKey] ?? null : null;

  const getFileExtension = (filePath: string): string =>
    filePath.split(".").pop()?.toLowerCase() || "";

  const getMimeType = (path: string): string => {
    const ext = path.split(".").pop()?.toLowerCase();
    switch (ext) {
      case "pdf":
        return "application/pdf";
      case "png":
        return "image/png";
      case "jpg":
      case "jpeg":
        return "image/jpeg";
      case "webp":
        return "image/webp";
      default:
        return "application/octet-stream";
    }
  };

  useEffect(() => {
    if (!activePath) return;

    let objectUrl: string | undefined;

    const loadFile = async () => {
      try {
        setIsLoading(true);
        const fullPath = window.api.getFullPath(activePath);
        const buffer: Uint8Array = await window.api.readFile(fullPath);
        const mime = getMimeType(activePath);
        const blob = new Blob([buffer], { type: mime });
        objectUrl = URL.createObjectURL(blob);
        setDataUrl(objectUrl);
      } catch (err) {
        console.error("Ошибка при чтении файла:", err);
        setDataUrl(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadFile();

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [activePath]);

  const fileExt = activePath ? getFileExtension(activePath) : "";

  const handleDelete = async (key: FileKey) => {
    if (!confirm("Удалить этот документ?") || !onDeleteFile) return;

    const success = await onDeleteFile(key);
    if (success && activeKey === key) {
      setActiveKey(null);
      console.log("Loaded file:", {
        path: activePath,
      });

      setDataUrl(null);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Кнопки переключения */}
      <div className="flex gap-2 mb-4">
        {keys.map((key) => (
          <button
            key={key}
            onClick={() => setActiveKey(key)}
            className={`px-4 py-1 rounded ${
              key === activeKey ? "!bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            {key === "payment" ? "Чек об оплате" : "Удостоверение"}
          </button>
        ))}
      </div>

      {/* Просмотрщик */}
      <div className="flex-grow overflow-auto flex items-center justify-center bg-gray-100 rounded">
        {isLoading ? (
          <div className="flex items-center gap-2 text-blue-500">
            <svg
              className="!animate-spin h-6 w-6 !text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
            Загрузка...
          </div>
        ) : (
          <>
            {dataUrl && fileExt === "pdf" && <PDFViewer fileData={dataUrl} />}
            {dataUrl && ["png", "jpg", "jpeg", "webp"].includes(fileExt) && (
              <img
                src={dataUrl}
                alt="Документ"
                className="max-h-full max-w-full object-contain"
              />
            )}
            {!dataUrl && (
              <p className="text-gray-600">
                Невозможно отобразить данный тип файла
              </p>
            )}
          </>
        )}
      </div>

      {/* Кнопка удаления */}
      {activeKey && (
        <div className="flex justify-center mt-4">
          <button
            onClick={() => handleDelete(activeKey)}
            className="px-4 py-2 !bg-red-600 text-white rounded hover:bg-red-700"
          >
            Удалить файл
          </button>
        </div>
      )}
    </div>
  );
}
