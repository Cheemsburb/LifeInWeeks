import { useState, useEffect } from "react";
import { loadDarkMode, saveDarkMode } from "../utils/storage";
import "./DarkModeToggle.css";

function DarkModeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const saved = loadDarkMode();
    setIsDark(saved);
    applyDarkMode(saved);
  }, []);

  const applyDarkMode = (dark) => {
    document.documentElement.setAttribute(
      "data-theme",
      dark ? "dark" : "light",
    );
    saveDarkMode(dark);
  };

  const toggleDarkMode = () => {
    const newVal = !isDark;
    setIsDark(newVal);
    applyDarkMode(newVal);
  };

  return (
    <button
      className="dark-mode-toggle"
      onClick={toggleDarkMode}
      title="Toggle Dark Mode"
    >
      {isDark ? (
        <span className="toggle-icon">☀️</span>
      ) : (
        <span className="toggle-icon">🌙</span>
      )}
    </button>
  );
}

export default DarkModeToggle;
