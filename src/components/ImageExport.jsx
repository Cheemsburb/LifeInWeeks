import { useState, useRef } from "react";
import html2canvas from "html2canvas";
import "./ImageExport.css";

function ImageExport({ gridRef }) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState("png");
  const exportAreaRef = useRef(null);

  const handleExport = async () => {
    if (!gridRef?.current && !exportAreaRef.current) return;

    setIsExporting(true);
    const element = gridRef?.current || exportAreaRef.current;

    try {
      const canvas = await html2canvas(element, {
        backgroundColor: "#ffffff",
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const mimeType = exportFormat === "jpeg" ? "image/jpeg" : "image/png";
      const extension = exportFormat === "jpeg" ? "jpg" : "png";
      const quality = exportFormat === "jpeg" ? 0.95 : undefined;

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.download = `my-life-in-weeks.${extension}`;
            link.href = url;
            link.click();
            URL.revokeObjectURL(url);
          }
          setIsExporting(false);
        },
        mimeType,
        quality,
      );
    } catch (error) {
      console.error("Export failed:", error);
      setIsExporting(false);
    }
  };

  return (
    <div className="image-export">
      <h3>Export as Image</h3>
      <p>Download your life grid as an image to share or print.</p>
      <div className="export-controls">
        <div className="format-selector">
          <label>
            <input
              type="radio"
              value="png"
              checked={exportFormat === "png"}
              onChange={(e) => setExportFormat(e.target.value)}
            />
            PNG (Higher Quality)
          </label>
          <label>
            <input
              type="radio"
              value="jpeg"
              checked={exportFormat === "jpeg"}
              onChange={(e) => setExportFormat(e.target.value)}
            />
            JPEG (Smaller File)
          </label>
        </div>
        <button
          className="export-btn"
          onClick={handleExport}
          disabled={isExporting}
        >
          {isExporting ? "Exporting..." : "📸 Export Image"}
        </button>
      </div>
    </div>
  );
}

export default ImageExport;
