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
