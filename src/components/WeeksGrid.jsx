import { useState, useRef, useEffect, useCallback } from "react";
import "./WeeksGrid.css";

function WeeksGrid({
  weeksLived,
  totalWeeks,
  milestoneWeeks,
  annotations,
  goalBlocks = [],
  onWeekClick,
  onGoalSelect,
  onUpdateGoalBlock,
  onUpdateAnnotation,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [dragEnd, setDragEnd] = useState(null);
  const [hoveredWeek, setHoveredWeek] = useState(null);
  const [resizeMode, setResizeMode] = useState(null); // 'start' or 'end'
  const [resizingBlock, setResizingBlock] = useState(null);
  const [selectedBlock, setSelectedBlock] = useState(null);
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

  // Find which block (annotation or goal) a week belongs to
  const findBlockForWeek = useCallback(
    (weekNum) => {
      // Check goal blocks first
      const goalBlock = goalBlocks.find(
        (g) => weekNum >= g.startWeek && weekNum <= g.endWeek,
      );
      if (goalBlock) {
        return { type: "goal", block: goalBlock };
      }

      // Check if it's an annotated week
      const annotation = annotations.find((a) => a.weekNumber === weekNum);
      if (annotation) {
        return { type: "annotation", block: annotation };
      }

      return null;
    },
    [goalBlocks, annotations],
  );

  // Check if a week is at the edge of a block (for resize handle)
  const getResizeHandle = useCallback(
    (weekNum) => {
      // Check goal blocks
      for (const goal of goalBlocks) {
        if (weekNum === goal.startWeek) {
          return { type: "goal", block: goal, handle: "start" };
        }
        if (weekNum === goal.endWeek) {
          return { type: "goal", block: goal, handle: "end" };
        }
      }

      // For annotations, we can extend them to adjacent weeks by converting to goal blocks
      // But for now, annotations are single weeks
      return null;
    },
    [goalBlocks],
  );

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

  // Check if a week is in the resize range
  const isInResizeRange = (weekNum) => {
    if (!resizeMode || !resizingBlock) return false;
    if (resizeMode === "start") {
      return weekNum >= dragEnd && weekNum <= resizingBlock.endWeek;
    } else {
      return weekNum >= resizingBlock.startWeek && weekNum <= dragEnd;
    }
  };

  const handleMouseDown = (weekNum, e) => {
    e.preventDefault();

    // Check if clicking on a resize handle
    const resizeHandle = getResizeHandle(weekNum);
    if (resizeHandle) {
      setResizeMode(resizeHandle.handle);
      setResizingBlock(resizeHandle.block);
      setDragStart(weekNum);
      setDragEnd(weekNum);
      return;
    }

    // Check if clicking inside a block (to move/resize it)
    const blockInfo = findBlockForWeek(weekNum);
    if (blockInfo && blockInfo.type === "goal" && weekNum >= weeksLived) {
      // Start resizing from inside the block
      setResizeMode("end");
      setResizingBlock(blockInfo.block);
      setDragStart(weekNum);
      setDragEnd(weekNum);
      return;
    }

    // Regular drag for creating new goal blocks (only for future weeks)
    if (weekNum >= weeksLived) {
      setIsDragging(true);
      setDragStart(weekNum);
      setDragEnd(weekNum);
    }
  };

  const handleMouseEnter = (weekNum) => {
    setHoveredWeek(weekNum);
    if (resizeMode && resizingBlock && dragStart !== null) {
      setDragEnd(weekNum);
    } else if (isDragging && dragStart !== null && weekNum >= weeksLived) {
      setDragEnd(weekNum);
    }
  };

  const handleMouseUp = (weekNum) => {
    // Handle resize completion
    if (resizeMode && resizingBlock && dragEnd !== null) {
      let newStart = resizingBlock.startWeek;
      let newEnd = resizingBlock.endWeek;

      if (resizeMode === "start") {
        newStart = Math.min(dragStart, dragEnd);
        // Don't allow start to go past end
        if (newStart >= newEnd) {
          newStart = newEnd - 1;
        }
      } else {
        newEnd = Math.max(dragStart, dragEnd);
        // Don't allow end to go before start
        if (newEnd <= newStart) {
          newEnd = newStart + 1;
        }
      }

      // Update the goal block
      if (onUpdateGoalBlock) {
        const updatedGoal = {
          ...resizingBlock,
          startWeek: newStart,
          endWeek: newEnd,
        };
        onUpdateGoalBlock(updatedGoal);
      }

      setResizeMode(null);
      setResizingBlock(null);
      setDragStart(null);
      setDragEnd(null);
      return;
    }

    // Handle new goal block creation
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
      if (resizeMode) {
        // Finalize resize
        handleMouseUp(dragEnd !== null ? dragEnd : dragStart);
      }
    };

    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => {
      window.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, [isDragging, resizeMode, dragEnd, dragStart]);

  const getWeekClassName = (weekNum) => {
    const annotation = getAnnotation(weekNum);
    const lived = isLived(weekNum);
    const milestone = isMilestone(weekNum);
    const goalBlock = getGoalBlock(weekNum);
    const inDragRange = isInDragRange(weekNum);
    const inResizeRange = isInResizeRange(weekNum);
    const current = isCurrentWeek(weekNum);
    const resizeHandle = getResizeHandle(weekNum);
    const isSelected =
      selectedBlock &&
      ((selectedBlock.type === "goal" &&
        weekNum >= selectedBlock.block.startWeek &&
        weekNum <= selectedBlock.block.endWeek) ||
        (selectedBlock.type === "annotation" &&
          weekNum === selectedBlock.block.weekNumber));

    let className = "week-box";
    className += lived ? " lived" : " remaining";
    if (milestone) className += " milestone";
    if (annotation) className += " annotated";
    if (goalBlock) className += " goal-block";
    if (inDragRange) className += " drag-selection";
    if (inResizeRange) className += " resize-selection";
    if (current) className += " current-week";
    if (resizeHandle) className += " resize-handle";
    if (isSelected) className += " selected";

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
    const resizeHandle = getResizeHandle(weekNum);

    let tooltip = `Age ${age}, Week ${weekOfYear}`;

    if (annotation) {
      tooltip += `\n${annotation.label}`;
    }
    if (goalBlock) {
      tooltip += `\nGoal: ${goalBlock.label}`;
      tooltip += `\nWeeks: ${goalBlock.endWeek - goalBlock.startWeek + 1}`;
    }
    if (resizeHandle) {
      tooltip += `\nDrag to resize`;
    }

    return tooltip;
  };

  // Handle double-click on a block to select it
  const handleDoubleClick = (weekNum) => {
    const blockInfo = findBlockForWeek(weekNum);
    if (blockInfo) {
      setSelectedBlock(
        selectedBlock?.block === blockInfo.block ? null : blockInfo,
      );
    }
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
        <span className="legend-item">
          <span className="week-box resize-handle"></span> Resize Handle
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
                  onDoubleClick={() => handleDoubleClick(weekNum)}
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
                {getWeekTooltip(hoveredWeek).split("\n").slice(1).join("\n")}
              </div>
            )}
          </div>
        ))}
      </div>

      <p className="grid-info">
        Total: {totalWeeks} weeks (~{Math.floor(totalWeeks / WEEKS_PER_YEAR)}{" "}
        years) | {annotations.length} annotated | {goalBlocks.length} goal
        blocks
        {selectedBlock && (
          <span className="selected-info">
            {" "}
            | Selected: {selectedBlock.block.label || selectedBlock.type}
          </span>
        )}
      </p>

      {selectedBlock && (
        <div className="block-info-panel">
          <h4>{selectedBlock.type === "goal" ? "Goal Block" : "Annotation"}</h4>
          <p>
            <strong>Label:</strong> {selectedBlock.block.label || "No label"}
          </p>
          {selectedBlock.type === "goal" && (
            <>
              <p>
                <strong>Duration:</strong>{" "}
                {selectedBlock.block.endWeek -
                  selectedBlock.block.startWeek +
                  1}{" "}
                weeks
              </p>
              <p>
                <strong>From:</strong> Week {selectedBlock.block.startWeek} to
                Week {selectedBlock.block.endWeek}
              </p>
            </>
          )}
          <p className="resize-hint">
            💡 Drag the edges of blocks to resize them
          </p>
        </div>
      )}
    </div>
  );
}

export default WeeksGrid;
