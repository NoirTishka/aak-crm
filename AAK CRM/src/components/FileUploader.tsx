import { useState } from 'react';

interface FileUploaderProps {
  label: string;
  fileKey: string;
  kursantId: number | null;
  onFileSelected: (filePath: string, fileKey: string) => void;
}

export function FileUploader({
  label,
  fileKey,
  kursantId,
  onFileSelected
}: FileUploaderProps) {
  const [uploading, setUploading] = useState(false);
  if (!kursantId) return null;

 const handleUploadClick = async () => {
  setUploading(true);
  const savedPath = await window.api.saveKursantFile(kursantId, fileKey);
  if (savedPath) {
    onFileSelected(savedPath, fileKey);
  }
  setUploading(false);
};

  return (
    <div className="flex items-center gap-4 mt-2">
      <label className="text-sm">{label}</label>
      <button
        onClick={handleUploadClick}
        className="px-3 py-1 !bg-blue-600 text-white rounded text-sm"
        disabled={uploading}
      >
        {uploading ? 'Загрузка...' : 'Выбрать файл'}
      </button>
    </div>
  );
}

