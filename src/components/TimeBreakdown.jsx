import "./TimeBreakdown.css";

function TimeBreakdown({ timeBreakdown, activityBreakdown }) {
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

      {activityBreakdown && (
        <div className="activity-section">
          <h4>What You Could Do With This Time</h4>
          <div className="activity-grid">
            <div className="activity-item">
              <span className="activity-icon">📚</span>
              <div className="activity-value">
                {activityBreakdown.books.toLocaleString()}
              </div>
              <div className="activity-label">Books Read</div>
            </div>

            <div className="activity-item">
              <span className="activity-icon">🎬</span>
              <div className="activity-value">
                {activityBreakdown.movies.toLocaleString()}
              </div>
              <div className="activity-label">Movies Watched</div>
            </div>

            <div className="activity-item">
              <span className="activity-icon">✈️</span>
              <div className="activity-value">
                {activityBreakdown.vacations.toLocaleString()}
              </div>
              <div className="activity-label">Week-long Vacations</div>
            </div>

            <div className="activity-item">
              <span className="activity-icon">🌙</span>
              <div className="activity-value">
                {activityBreakdown.sleepWeeks.toLocaleString()}
              </div>
              <div className="activity-label">Weeks of Sleep</div>
            </div>

            <div className="activity-item">
              <span className="activity-icon">📅</span>
              <div className="activity-value">
                {activityBreakdown.weekends.toLocaleString()}
              </div>
              <div className="activity-label">Weekends</div>
            </div>

            <div className="activity-item">
              <span className="activity-icon">☀️</span>
              <div className="activity-value">
                {activityBreakdown.days.toLocaleString()}
              </div>
              <div className="activity-label">Days</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TimeBreakdown;
