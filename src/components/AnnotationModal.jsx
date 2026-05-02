import { useState, useEffect } from "react";
import "./AnnotationModal.css";

const commonEmojis = [
  "🎉",
  "❤️",
  "✈️",
  "🎓",
  "💍",
  "👶",
  "🏠",
  "🎯",
  "🌟",
  "🏆",
  "🎵",
  "📚",
  "🏥",
  "🎂",
  "🌍",
  "🚀",
  "💪",
  "🎨",
  "🍕",
  "🐕",
  "📸",
  "🎮",
  "🏖️",
  "🎄",
];

const defaultColors = [
  "#EF4444",
  "#F59E0B",
  "#10B981",
  "#3B82F6",
  "#8B5CF6",
  "#EC4899",
  "#6B7280",
];

const reflectionPrompts = [
  "What was the highlight of this week?",
  "What challenge did you face and how did you handle it?",
  "What are you grateful for this week?",
  "What did you learn about yourself?",
  "How did you grow this week?",
  "Who did you connect with this week?",
  "What made you smile this week?",
  "What would you do differently next time?",
];

function AnnotationModal({
  isOpen,
  weekNumber,
  existingAnnotation,
  existingJournal,
  existingEmoji,
  existingTags,
  customTags,
  onSave,
  onCancel,
  onSaveJournal,
  onSaveEmoji,
  onSaveTags,
}) {
  const [label, setLabel] = useState("");
  const [color, setColor] = useState("#EF4444");
  const [journalEntry, setJournalEntry] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showReflectionPrompt, setShowReflectionPrompt] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState("");

  useEffect(() => {
    if (isOpen) {
      setLabel(existingAnnotation?.label || "");
      setColor(existingAnnotation?.color || "#EF4444");
      setJournalEntry(existingJournal?.entry || "");
      setSelectedEmoji(existingEmoji?.emoji || "");
      setSelectedTags(existingTags?.tagIds || []);
      setShowEmojiPicker(false);
      setShowReflectionPrompt(false);
    }
  }, [
    isOpen,
    existingAnnotation,
    existingJournal,
    existingEmoji,
    existingTags,
  ]);

  const handleSave = () => {
    if (label.trim() || color) {
      onSave({
        weekNumber,
        label: label.trim() || null,
        color,
      });
    } else {
      onSave({ weekNumber, label: null, color });
    }
  };

  const handleJournalSave = () => {
    if (onSaveJournal && journalEntry.trim()) {
      onSaveJournal({
        weekNumber,
        entry: journalEntry.trim(),
        date: new Date().toISOString(),
      });
    }
  };

  const handleEmojiSave = () => {
    if (onSaveEmoji && selectedEmoji) {
      onSaveEmoji({ weekNumber, emoji: selectedEmoji });
    }
    setShowEmojiPicker(false);
  };

  const handleTagsSave = () => {
    if (onSaveTags) {
      onSaveTags({ weekNumber, tagIds: selectedTags });
    }
  };

  const toggleTag = (tagId) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId],
    );
  };

  const getRandomPrompt = () => {
    const prompt =
      reflectionPrompts[Math.floor(Math.random() * reflectionPrompts.length)];
    setCurrentPrompt(prompt);
    setShowReflectionPrompt(true);
  };

  const insertPromptToJournal = () => {
    if (currentPrompt) {
      setJournalEntry((prev) =>
        prev ? `${currentPrompt}\n${prev}` : currentPrompt,
      );
      setShowReflectionPrompt(false);
    }
  };

  if (!isOpen) return null;

  const age = Math.floor(weekNumber / 52);
  const weekOfYear = (weekNumber % 52) + 1;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onCancel}>
          ×
        </button>

        <h2>
          Week {weekOfYear} of Age {age}
        </h2>
        <p className="modal-subtitle">
          Annotate this week, add a journal entry, or assign an emoji.
        </p>

        {/* Annotation Section */}
        <div className="modal-section">
          <h3>Label & Color</h3>
          <input
            type="text"
            className="annotation-input"
            placeholder="What happened this week?"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            maxLength={100}
          />
          <div className="color-picker">
            {defaultColors.map((c) => (
              <button
                key={c}
                className={`color-option ${color === c ? "selected" : ""}`}
                style={{ backgroundColor: c }}
                onClick={() => setColor(c)}
              />
            ))}
          </div>
        </div>

        {/* Emoji Section */}
        <div className="modal-section">
          <h3>Emoji Marker</h3>
          <div className="emoji-display">
            {selectedEmoji && (
              <div className="current-emoji">
                <span>{selectedEmoji}</span>
                <button
                  className="remove-emoji"
                  onClick={() => setSelectedEmoji("")}
                >
                  ×
                </button>
              </div>
            )}
            <button
              className="emoji-picker-toggle"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              {showEmojiPicker ? "Close" : "Pick an Emoji"}
            </button>
          </div>

          {showEmojiPicker && (
            <div className="emoji-picker">
              <div className="emoji-grid">
                {commonEmojis.map((emoji) => (
                  <button
                    key={emoji}
                    className={`emoji-option ${selectedEmoji === emoji ? "selected" : ""}`}
                    onClick={() => setSelectedEmoji(emoji)}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
              <button className="save-emoji-btn" onClick={handleEmojiSave}>
                Save Emoji
              </button>
            </div>
          )}
        </div>

        {/* Tags Section */}
        <div className="modal-section">
          <h3>Tags</h3>
          <div className="tags-picker">
            {customTags &&
              customTags.map((tag) => (
                <button
                  key={tag.id}
                  className={`tag-option ${selectedTags.includes(tag.id) ? "selected" : ""}`}
                  style={{
                    backgroundColor: selectedTags.includes(tag.id)
                      ? tag.color
                      : "transparent",
                    color: selectedTags.includes(tag.id) ? "white" : tag.color,
                    borderColor: tag.color,
                  }}
                  onClick={() => toggleTag(tag.id)}
                >
                  {tag.name}
                </button>
              ))}
          </div>
          <button className="save-tags-btn" onClick={handleTagsSave}>
            Save Tags
          </button>
        </div>

        {/* Journal Section */}
        <div className="modal-section">
          <div className="journal-header">
            <h3>Journal Entry</h3>
            <button className="prompt-btn" onClick={getRandomPrompt}>
              🪞 Get Prompt
            </button>
          </div>

          {showReflectionPrompt && (
            <div className="reflection-box">
              <p>{currentPrompt}</p>
              <button onClick={insertPromptToJournal}>Add to Journal</button>
            </div>
          )}

          <textarea
            className="journal-input"
            placeholder="Write your thoughts about this week..."
            value={journalEntry}
            onChange={(e) => setJournalEntry(e.target.value)}
            rows={6}
          />
          <div className="journal-footer">
            <span className="char-count">{journalEntry.length} characters</span>
            <button className="save-journal-btn" onClick={handleJournalSave}>
              Save Journal
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="modal-actions">
          <button className="btn-delete" onClick={() => handleSave()}>
            Delete Annotation
          </button>
          <button className="btn-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn-save" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default AnnotationModal;
