import { useState, useEffect } from "react";
import { loadViewPreference, saveViewPreference } from "../utils/storage";
import "./ViewToggle.css";

function ViewToggle({ onViewChange }) {
  const [view, setView] = useState("life");

  useEffect(() => {
    const saved = loadViewPreference();
    setView(saved);
  }, []);

  const handleViewChange = (newView) => {
    setView(newView);
    saveViewPreference(newView);
    if (onViewChange) onViewChange(newView);
  };

  return (
    <div className="view-toggle">
      <button
        className={`view-btn ${view === "life" ? "active" : ""}`}
        onClick={() => handleViewChange("life")}
        title="Full Life Grid"
      >
        Life
      </button>
      <button
        className={`view-btn ${view === "decade" ? "active" : ""}`}
        onClick={() => handleViewChange("decade")}
        title="Decade View"
      >
        Decade
      </button>
      <button
        className={`view-btn ${view === "year" ? "active" : ""}`}
        onClick={() => handleViewChange("year")}
        title="Year View"
      >
        Year
      </button>
    </div>
  );
}

export default ViewToggle;
