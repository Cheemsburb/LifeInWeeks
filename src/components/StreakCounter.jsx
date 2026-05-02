import { useState, useEffect } from "react";
import { loadLoggedWeeks, saveLoggedWeeks } from "../utils/storage";
import "./StreakCounter.css";

function StreakCounter({ currentWeek, annotations, goalBlocks }) {
  const [streak, setStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);

  useEffect(() => {
    calculateStreaks();
  }, [currentWeek, annotations, goalBlocks]);

  const calculateStreaks = () => {
    // Get all logged weeks from annotations and goal blocks
    const loggedWeeks = new Set();

    // Add weeks from annotations
    if (annotations) {
      annotations.forEach((ann) => loggedWeeks.add(ann.weekNumber));
    }

    // Add weeks from goal blocks
    if (goalBlocks) {
      goalBlocks.forEach((block) => {
        for (let w = block.startWeek; w <= block.endWeek; w++) {
          loggedWeeks.add(w);
        }
      });
    }

    // Calculate current streak (consecutive weeks ending at or near current week)
    let currentStreak = 0;
    for (let w = currentWeek - 1; w >= 0; w--) {
      if (loggedWeeks.has(w)) {
        currentStreak++;
      } else {
        break;
      }
    }

    // Calculate longest streak
    let longest = 0;
    let tempStreak = 0;
    for (let w = 0; w < currentWeek; w++) {
      if (loggedWeeks.has(w)) {
        tempStreak++;
        longest = Math.max(longest, tempStreak);
      } else {
        tempStreak = 0;
      }
    }

    setStreak(currentStreak);
    setLongestStreak(longest);

    // Save logged weeks
    saveLoggedWeeks(Array.from(loggedWeeks));
  };

  const getStreakMessage = () => {
    if (streak === 0) return "Start logging to build your streak!";
    if (streak === 1) return "1 week logged - keep going!";
    if (streak < 5) return `${streak} weeks in a row! 🔥`;
    if (streak < 10) return `${streak} weeks! You're on fire! 🔥🔥`;
    if (streak < 26) return `${streak} weeks! Incredible dedication! 🌟`;
    if (streak < 52) return `${streak} weeks! Half a year strong! 💪`;
    return `${streak} weeks! You're a legend! 🏆`;
  };

  return (
    <div className="streak-counter">
      <div className="streak-main">
        <span className="streak-fire">{streak > 0 ? "🔥" : "💫"}</span>
        <div className="streak-info">
          <span className="streak-number">{streak}</span>
          <span className="streak-label">week streak</span>
        </div>
      </div>
      <p className="streak-message">{getStreakMessage()}</p>
      {longestStreak > 0 && (
        <p className="streak-best">Longest streak: {longestStreak} weeks</p>
      )}
    </div>
  );
}

export default StreakCounter;
