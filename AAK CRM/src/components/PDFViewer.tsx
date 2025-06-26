import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';


interface PDFViewerProps {
  fileData: string;
}
export function PDFViewer({ fileData }: PDFViewerProps) {
  return (
    <iframe
      src={fileData}
      title="PDF Viewer"
      className="w-full h-full"
    />
  );
}

