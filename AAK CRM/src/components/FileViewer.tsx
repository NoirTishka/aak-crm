import { useState, useEffect } from "react";
import { PDFViewer } from "./PDFViewer";
import { Buffer } from "buffer";

interface FileViewerProps {
  filePaths: Record<string, string>;
}

export function FileViewer({ filePaths }: FileViewerProps) {
  const [activeKey, setActiveKey] = useState<string | null>(
    Object.keys(filePaths)[0] || null
  );
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  const activePath = activeKey ? filePaths[activeKey] : null;

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

    const loadFile = async () => {
      try {
        const buffer: Uint8Array = await window.api.readFile(activePath);
        const base64 = Buffer.from(buffer).toString("base64");
        const mime = getMimeType(activePath);
        const dataUrl = `data:${mime};base64,${base64}`;
        setDataUrl(dataUrl);
      } catch (err) {
        console.error("Ошибка при чтении файла:", err);
        setDataUrl(null);
      }
    };

    loadFile();
  }, [activePath]);

  const fileExt = activePath ? getFileExtension(activePath) : "";

  return (
    <div className="mt-4">
      <div className="flex gap-2 mb-2">
        {Object.entries(filePaths).map(([key, _]) => (
          <button
            key={key}
            onClick={() => setActiveKey(key)}
            className={`px-3 py-1 rounded ${
              key === activeKey ? "!bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            {key === "payment" ? "Документ об оплате" : "Удостоверение"}
          </button>
        ))}
      </div>

      <div className="w-full border h-[600px] flex justify-center items-center bg-white">
        {dataUrl && fileExt === "pdf" && <PDFViewer fileData={dataUrl} />}
        {dataUrl && ["png", "jpg", "jpeg", "webp"].includes(fileExt) && (
          <img
            src={dataUrl}
            alt="Документ"
            className="max-h-full max-w-full object-contain"
          />
        )}
        {!dataUrl && (
          <p className="text-gray-600">Невозможно отобразить данный тип файла</p>
        )}
      </div>
    </div>
  );
}
