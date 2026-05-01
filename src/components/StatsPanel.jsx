import "./StatsPanel.css";

function StatsPanel({
  weeksLived,
  totalWeeks,
  age,
  yearsRemaining,
  percentageLived,
}) {
  const weeksRemaining = totalWeeks - weeksLived;

  return (
    <div className="stats-panel">
      <div className="stat-card">
        <div className="stat-label">Age</div>
        <div className="stat-value">{age} years</div>
      </div>

      <div className="stat-card">
        <div className="stat-label">Weeks Lived</div>
        <div className="stat-value">{weeksLived.toLocaleString()}</div>
      </div>

      <div className="stat-card">
        <div className="stat-label">Weeks Remaining</div>
        <div className="stat-value">{weeksRemaining.toLocaleString()}</div>
      </div>

      <div className="stat-card">
        <div className="stat-label">Life Lived</div>
        <div className="stat-value">{percentageLived}%</div>
        <div className="stat-bar">
          <div
            className="stat-bar-fill"
            style={{ width: `${percentageLived}%` }}
          ></div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-label">Years Remaining</div>
        <div className="stat-value">{yearsRemaining}</div>
      </div>
    </div>
  );
}

export default StatsPanel;
