import "./WeeksGrid.css";

function WeeksGrid({ weeksLived, totalWeeks, milestoneWeeks }) {
  const weeks = [];
  for (let i = 0; i < totalWeeks; i++) {
    weeks.push(i);
  }

  const isMilestone = (weekNum) => milestoneWeeks.includes(weekNum);
  const isLived = (weekNum) => weekNum < weeksLived;

  return (
    <div className="weeks-grid-container">
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
      </p>

      <div className="weeks-grid">
        {weeks.map((weekNum) => (
          <div
            key={weekNum}
            className={`week-box ${isLived(weekNum) ? "lived" : "remaining"} ${
              isMilestone(weekNum) ? "milestone" : ""
            }`}
            title={`Week ${weekNum + 1}${isMilestone(weekNum) ? " - Milestone" : ""}`}
          />
        ))}
      </div>

      <p className="grid-info">
        Total: {totalWeeks} weeks (~{Math.floor(totalWeeks / 52)} years)
      </p>
    </div>
  );
}

export default WeeksGrid;
