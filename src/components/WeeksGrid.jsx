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
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [dragEnd, setDragEnd] = useState(null);
  const [hoveredWeek, setHoveredWeek] = useState(null);
  const gridRef = useRef(null);

  // Constants for the 52-week grid
  const WEEKS_PER_YEAR = 52;
  const DECADE_SIZE = 10; // 10 years = 1 decade

  const isMilestone = (weekNum) => milestoneWeeks.includes(weekNum);
  const isLived = (weekNum) => weekNum < weeksLived;
  const getAnnotation = (weekNum) =>
    annotations.find((a) => a.weekNumber === weekNum);
  const getGoalBlock = (weekNum) =>
    goalBlocks.find((g) => weekNum >= g.startWeek && weekNum <= g.endWeek);

  // Check if a week is the current week (just lived/turning)
  const isCurrentWeek = (weekNum) => weekNum === weeksLived;

  // Calculate age and week of year for a given week number
  const getWeekInfo = (weekNum) => {
    const yearIndex = Math.floor(weekNum / WEEKS_PER_YEAR);
    const weekOfYear = (weekNum % WEEKS_PER_YEAR) + 1;
    const age = yearIndex;
    return { age, weekOfYear, yearIndex };
  };

  // Check if a week is in the drag selection range
  const isInDragRange = (weekNum) => {
    if (dragStart === null || dragEnd === null) return false;
    const min = Math.min(dragStart, dragEnd);
    const max = Math.max(dragStart, dragEnd);
    return weekNum >= min && weekNum <= max;
  };

  const handleMouseDown = (weekNum, e) => {
    e.preventDefault();
    if (weekNum >= weeksLived) {
      setIsDragging(true);
      setDragStart(weekNum);
      setDragEnd(weekNum);
    }
  };

  const handleMouseEnter = (weekNum) => {
    setHoveredWeek(weekNum);
    if (isDragging && dragStart !== null && weekNum >= weeksLived) {
      setDragEnd(weekNum);
    }
  };

  const handleMouseUp = (weekNum) => {
    if (isDragging && dragStart !== null && weekNum >= weeksLived) {
      setDragEnd(weekNum);
      const start = Math.min(dragStart, dragEnd);
      const end = Math.max(dragStart, dragEnd);
      if (end > start && onGoalSelect) {
        onGoalSelect(start, end);
      }
      setIsDragging(false);
      setDragStart(null);
      setDragEnd(null);
    }
  };

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
    const current = isCurrentWeek(weekNum);

    let className = "week-box";
    className += lived ? " lived" : " remaining";
    if (milestone) className += " milestone";
    if (annotation) className += " annotated";
    if (goalBlock) className += " goal-block";
    if (inDragRange) className += " drag-selection";
    if (current) className += " current-week";

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

  const getWeekTooltip = (weekNum) => {
    const { age, weekOfYear } = getWeekInfo(weekNum);
    const annotation = getAnnotation(weekNum);
    const goalBlock = getGoalBlock(weekNum);

    if (annotation) {
      return `Age ${age}, Week ${weekOfYear}\n${annotation.label}`;
    }
    if (goalBlock) {
      return `Age ${age}, Week ${weekOfYear}\nGoal: ${goalBlock.label}`;
    }
    return `Age ${age}, Week ${weekOfYear}`;
  };

  // Generate rows for the grid (each row = 1 year = 52 weeks)
  const totalYears = Math.ceil(totalWeeks / WEEKS_PER_YEAR);
  const rows = [];

  for (let year = 0; year < totalYears; year++) {
    const yearWeeks = [];
    for (let week = 0; week < WEEKS_PER_YEAR; week++) {
      const weekNum = year * WEEKS_PER_YEAR + week;
      if (weekNum < totalWeeks) {
        yearWeeks.push(weekNum);
      }
    }
    rows.push({
      yearIndex: year,
      age: year,
      weeks: yearWeeks,
      isDecadeStart: year % DECADE_SIZE === 0,
      isDecadeEnd: (year + 1) % DECADE_SIZE === 0,
    });
  }

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
        <span className="legend-item">
          <span className="week-box current-week"></span> Current Week
        </span>
      </p>

      <div className="weeks-grid-wrapper">
        {rows.map((row, rowIdx) => (
          <div
            key={row.yearIndex}
            className={`year-row ${row.isDecadeStart ? "decade-start" : ""} ${row.isDecadeEnd ? "decade-end" : ""}`}
          >
            <div className="year-label">Age {row.age}</div>
            <div className="weeks-row">
              {row.weeks.map((weekNum) => (
                <div
                  key={weekNum}
                  className={getWeekClassName(weekNum)}
                  style={getWeekStyle(weekNum)}
                  onClick={() => onWeekClick(weekNum)}
                  onMouseDown={(e) => handleMouseDown(weekNum, e)}
                  onMouseEnter={() => handleMouseEnter(weekNum)}
                  onMouseLeave={() => setHoveredWeek(null)}
                  onMouseUp={() => handleMouseUp(weekNum)}
                  title={getWeekTooltip(weekNum)}
                  data-week-num={weekNum}
                />
              ))}
            </div>
            {hoveredWeek !== null && row.weeks.includes(hoveredWeek) && (
              <div className="week-tooltip">
                {getWeekTooltip(hoveredWeek).split("\n")[0]}
                <br />
                {getWeekTooltip(hoveredWeek).split("\n")[1]}
              </div>
            )}
          </div>
        ))}
      </div>

      <p className="grid-info">
        Total: {totalWeeks} weeks (~{Math.floor(totalWeeks / WEEKS_PER_YEAR)}{" "}
        years) | {annotations.length} annotated | {goalBlocks.length} goal
        blocks
      </p>
    </div>
  );
}

export default WeeksGrid;
