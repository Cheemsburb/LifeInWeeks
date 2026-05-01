import { useState } from "react";
import { COLOR_PALETTE, DEFAULT_ANNOTATION_COLOR } from "../constants/colors";
import "./AnnotationModal.css";

function AnnotationModal({
  isOpen,
  weekNumber,
  existingAnnotation,
  onSave,
  onCancel,
}) {
  const [label, setLabel] = useState(existingAnnotation?.label || "");
  const [color, setColor] = useState(
    existingAnnotation?.color || DEFAULT_ANNOTATION_COLOR,
  );

  const handleSave = () => {
    if (label.trim()) {
      onSave({ weekNumber, label: label.trim(), color });
      setLabel("");
      setColor(DEFAULT_ANNOTATION_COLOR);
    }
  };

  const handleDelete = () => {
    onSave({ weekNumber, label: null, color: null }, true);
  };

  if (!isOpen) return null;

  return (
    <div className="annotation-modal-overlay" onClick={onCancel}>
      <div className="annotation-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Annotate Week {weekNumber + 1}</h3>
          <button className="modal-close" onClick={onCancel}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label htmlFor="label">What happened this week?</label>
            <input
              id="label"
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g., Graduated, Got married, Started new job"
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
          {existingAnnotation && (
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
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default AnnotationModal;
