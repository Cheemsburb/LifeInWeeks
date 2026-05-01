import { useState, useRef, useEffect } from "react";
import "./WeeksGrid.css";

function WeeksGrid({
  weeksLived,
  totalWeeks,
  milestoneWeeks,
  annotations,
  goalBlocks = [],
  onWeekClick,
  onGoalSelect,
}) {
  const weeks = [];
  for (let i = 0; i < totalWeeks; i++) {
    weeks.push(i);
  }

  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [dragEnd, setDragEnd] = useState(null);
  const gridRef = useRef(null);

  const isMilestone = (weekNum) => milestoneWeeks.includes(weekNum);
  const isLived = (weekNum) => weekNum < weeksLived;
  const getAnnotation = (weekNum) =>
    annotations.find((a) => a.weekNumber === weekNum);
  const getGoalBlock = (weekNum) =>
    goalBlocks.find((g) => weekNum >= g.startWeek && weekNum <= g.endWeek);

  // Check if a week is in the drag selection range
  const isInDragRange = (weekNum) => {
    if (dragStart === null || dragEnd === null) return false;
    const min = Math.min(dragStart, dragEnd);
    const max = Math.max(dragStart, dragEnd);
    return weekNum >= min && weekNum <= max;
  };

  const handleMouseDown = (weekNum, e) => {
    e.preventDefault(); // Prevent text selection
    // Only allow drag selection on future weeks
    if (weekNum >= weeksLived) {
      setIsDragging(true);
      setDragStart(weekNum);
      setDragEnd(weekNum);
    }
  };

  const handleMouseEnter = (weekNum) => {
    if (isDragging && dragStart !== null && weekNum >= weeksLived) {
      setDragEnd(weekNum);
    }
  };

  const handleMouseUp = (weekNum) => {
    if (isDragging && dragStart !== null && weekNum >= weeksLived) {
      setDragEnd(weekNum);
      const start = Math.min(dragStart, dragEnd);
      const end = Math.max(dragStart, dragEnd);
      // Only trigger if we have a valid range (more than 1 week)
      if (end > start && onGoalSelect) {
        onGoalSelect(start, end);
      }
      setIsDragging(false);
      setDragStart(null);
      setDragEnd(null);
    }
  };

  // Handle mouse up globally to catch releases outside grid
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        setDragStart(null);
        setDragEnd(null);
      }
    };

    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => {
      window.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, [isDragging]);

  const getWeekClassName = (weekNum) => {
    const annotation = getAnnotation(weekNum);
    const lived = isLived(weekNum);
    const milestone = isMilestone(weekNum);
    const goalBlock = getGoalBlock(weekNum);
    const inDragRange = isInDragRange(weekNum);

    let className = "week-box";
    className += lived ? " lived" : " remaining";
    if (milestone) className += " milestone";
    if (annotation) className += " annotated";
    if (goalBlock) className += " goal-block";
    if (inDragRange) className += " drag-selection";

    return className;
  };

  const getWeekStyle = (weekNum) => {
    const annotation = getAnnotation(weekNum);
    const goalBlock = getGoalBlock(weekNum);

    if (annotation) {
      return { backgroundColor: annotation.color };
    }
    if (goalBlock) {
      return { backgroundColor: goalBlock.color || "#4CAF50" };
    }
    return {};
  };

  const getWeekTitle = (weekNum) => {
    const annotation = getAnnotation(weekNum);
    const milestone = isMilestone(weekNum);
    const goalBlock = getGoalBlock(weekNum);

    if (annotation) {
      return `Week ${weekNum + 1} - ${annotation.label}`;
    }
    if (goalBlock) {
      return `Week ${weekNum + 1} - Goal: ${goalBlock.label}`;
    }
    return `Week ${weekNum + 1}${milestone ? " - Milestone" : ""}`;
  };

  return (
    <div className="weeks-grid-container" ref={gridRef}>
      <h2>Your Life in Weeks</h2>
      <p className="grid-legend">
        <span className="legend-item">
          <span className="week-box lived"></span> Week Lived
        </span>
        <span className="legend-item">
          <span className="week-box remaining"></span> Week Remaining
        </span>
        <span className="legend-item">
          <span className="week-box milestone"></span> Milestone Week
        </span>
        <span className="legend-item">
          <span className="week-box annotated"></span> Annotated Week
        </span>
        <span className="legend-item">
          <span className="week-box goal-block"></span> Goal Block
        </span>
      </p>

      <div className="weeks-grid">
        {weeks.map((weekNum) => {
          return (
            <div
              key={weekNum}
              className={getWeekClassName(weekNum)}
              style={getWeekStyle(weekNum)}
              onClick={() => onWeekClick(weekNum)}
              onMouseDown={(e) => handleMouseDown(weekNum, e)}
              onMouseEnter={() => handleMouseEnter(weekNum)}
              onMouseUp={() => handleMouseUp(weekNum)}
              title={getWeekTitle(weekNum)}
            />
          );
        })}
      </div>

      <p className="grid-info">
        Total: {totalWeeks} weeks (~{Math.floor(totalWeeks / 52)} years) |{" "}
        {annotations.length} annotated | {goalBlocks.length} goal blocks
      </p>
    </div>
  );
}

export default WeeksGrid;
