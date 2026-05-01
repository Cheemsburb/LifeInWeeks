import "./TimeBreakdown.css";

function TimeBreakdown({ timeBreakdown }) {
  if (!timeBreakdown) return null;

  return (
    <div className="time-breakdown">
      <h3>Time Remaining</h3>
      <div className="breakdown-grid">
        <div className="breakdown-item">
          <div className="breakdown-value">
            {timeBreakdown.hours.toLocaleString()}
          </div>
          <div className="breakdown-label">Hours</div>
        </div>

        <div className="breakdown-item">
          <div className="breakdown-value">
            {timeBreakdown.days.toLocaleString()}
          </div>
          <div className="breakdown-label">Days</div>
        </div>

        <div className="breakdown-item">
          <div className="breakdown-value">
            {timeBreakdown.months.toLocaleString()}
          </div>
          <div className="breakdown-label">Months</div>
        </div>

        <div className="breakdown-item">
          <div className="breakdown-value">
            {timeBreakdown.years.toLocaleString()}
          </div>
          <div className="breakdown-label">Years</div>
        </div>
      </div>
    </div>
  );
}

export default TimeBreakdown;
