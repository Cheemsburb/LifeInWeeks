import { useState, useEffect } from "react";
import { COLOR_PALETTE, DEFAULT_ANNOTATION_COLOR } from "../constants/colors";
import "./GoalModal.css";

function GoalModal({
  isOpen,
  startWeek,
  endWeek,
  weeksLived,
  existingGoal,
  onSave,
  onCancel,
}) {
  const [label, setLabel] = useState(existingGoal?.label || "");
  const [color, setColor] = useState(
    existingGoal?.color || DEFAULT_ANNOTATION_COLOR,
  );

  useEffect(() => {
    if (existingGoal) {
      setLabel(existingGoal.label || "");
      setColor(existingGoal.color || DEFAULT_ANNOTATION_COLOR);
    } else {
      setLabel("");
      setColor(DEFAULT_ANNOTATION_COLOR);
    }
  }, [existingGoal]);

  const handleSave = () => {
    if (label.trim()) {
      onSave({ startWeek, endWeek, label: label.trim(), color });
      setLabel("");
      setColor(DEFAULT_ANNOTATION_COLOR);
    }
  };

  const handleDelete = () => {
    onSave({ startWeek, endWeek, label: null, color: null }, true);
  };

  const getWeekNumbers = () => {
    const start = Math.floor(startWeek / 52) + 1;
    const end = Math.floor(endWeek / 52) + 1;
    const weeks = endWeek - startWeek + 1;
    return `Weeks ${startWeek + 1} - ${endWeek + 1} (${weeks} weeks | Age ${start} - ${end})`;
  };

  if (!isOpen) return null;

  return (
    <div className="goal-modal-overlay" onClick={onCancel}>
      <div className="goal-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Set Goal for Selected Weeks</h3>
          <button className="modal-close" onClick={onCancel}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="selected-range">
            <strong>Selected Range:</strong> {getWeekNumbers()}
          </div>

          <div className="form-group">
            <label htmlFor="goal-label">
              What's your goal for this period?
            </label>
            <input
              id="goal-label"
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g., Learn React, Write a book, Train for marathon"
              maxLength={50}
              onKeyPress={(e) => e.key === "Enter" && handleSave()}
              autoFocus
            />
            <span className="char-count">{label.length}/50</span>
          </div>

          <div className="form-group">
            <label>Choose a color:</label>
            <div className="color-palette">
              {COLOR_PALETTE.map((c) => (
                <button
                  key={c.value}
                  className={`color-swatch ${color === c.value ? "selected" : ""}`}
                  style={{ backgroundColor: c.value }}
                  onClick={() => setColor(c.value)}
                  title={c.name}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          {existingGoal && (
            <button className="btn-delete" onClick={handleDelete}>
              Delete
            </button>
          )}
          <button className="btn-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button
            className="btn-save"
            onClick={handleSave}
            disabled={!label.trim()}
          >
            Save Goal
          </button>
        </div>
      </div>
    </div>
  );
}

export default GoalModal;
