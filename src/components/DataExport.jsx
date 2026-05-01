import { useState } from "react";
import {
  exportAllData,
  importAllData,
  loadProfile,
  loadAnnotations,
  loadGoalBlocks,
  loadLifestyleFactors,
  saveProfile,
  saveAnnotations,
  saveGoalBlocks,
  saveLifestyleFactors,
} from "../utils/storage";
import "./DataExport.css";

function DataExport() {
  const [importError, setImportError] = useState("");
  const [importSuccess, setImportSuccess] = useState("");

  const handleExport = () => {
    const profile = loadProfile();
    const annotations = loadAnnotations();
    const goalBlocks = loadGoalBlocks();
    const lifestyle = loadLifestyleFactors();

    const jsonData = exportAllData(
      profile || {},
      annotations,
      goalBlocks,
      lifestyle || {},
    );

    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `life-in-weeks-backup-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setImportError("");
    setImportSuccess("Data exported successfully!");
    setTimeout(() => setImportSuccess(""), 3000);
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = importAllData(e.target.result);
        if (data) {
          // Save imported data to localStorage
          if (data.profile) saveProfile(data.profile);
          if (data.annotations) saveAnnotations(data.annotations);
          if (data.goalBlocks) saveGoalBlocks(data.goalBlocks);
          if (data.lifestyle) saveLifestyleFactors(data.lifestyle);

          setImportError("");
          setImportSuccess("Data imported successfully! Refreshing...");
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        } else {
          setImportError(
            "Invalid file format. Please select a valid backup file.",
          );
        }
      } catch (err) {
        setImportError(
          "Failed to parse file. Please select a valid JSON backup.",
        );
      }
    };
    reader.readAsText(file);

    // Reset file input
    event.target.value = "";
  };

  return (
    <div className="data-export">
      <div className="export-card">
        <h4>Backup & Restore</h4>
        <p>
          Export your data to a file for backup, or import a previously saved
          backup file.
        </p>

        <div className="export-actions">
          <button className="btn-export" onClick={handleExport}>
            📥 Download Backup
          </button>

          <label className="btn-import">
            📤 Upload Backup
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              style={{ display: "none" }}
            />
          </label>
        </div>

        {importError && <div className="error-message">{importError}</div>}
        {importSuccess && (
          <div className="success-message">{importSuccess}</div>
        )}
      </div>
    </div>
  );
}

export default DataExport;
