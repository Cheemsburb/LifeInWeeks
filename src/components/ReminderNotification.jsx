import { useState, useEffect } from "react";
import { loadLastLogin, saveLastLogin } from "../utils/storage";
import "./ReminderNotification.css";

function ReminderNotification({ weeksLived, onDismiss }) {
  const [showReminder, setShowReminder] = useState(false);
  const [daysSinceLastLogin, setDaysSinceLastLogin] = useState(0);

  useEffect(() => {
    const lastLogin = loadLastLogin();
    if (lastLogin) {
      const lastDate = new Date(lastLogin);
      const now = new Date();
      const diffTime = Math.abs(now - lastDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setDaysSinceLastLogin(diffDays);

      // Show reminder if hasn't logged in for 7+ days
      if (diffDays >= 7) {
        setShowReminder(true);
      }
    }
    // Save current login
    saveLastLogin();
  }, []);

  const handleDismiss = () => {
    setShowReminder(false);
    saveLastLogin();
    if (onDismiss) onDismiss();
  };

  if (!showReminder) return null;

  const unloggedWeeks = Math.min(Math.floor(daysSinceLastLogin / 7), 4);

  return (
    <div className="reminder-notification">
      <div className="reminder-content">
        <span className="reminder-icon">⏰</span>
        <div className="reminder-text">
          <strong>Time to log your weeks!</strong>
          <p>
            You haven't updated your timeline in {daysSinceLastLogin} days.
            {unloggedWeeks > 0 && (
              <span> That's about {unloggedWeeks} week(s) to catch up on!</span>
            )}
          </p>
        </div>
        <button className="reminder-dismiss" onClick={handleDismiss}>
          Got it
        </button>
      </div>
    </div>
  );
}

export default ReminderNotification;
