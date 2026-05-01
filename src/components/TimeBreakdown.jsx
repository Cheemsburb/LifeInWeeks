import "./TimeBreakdown.css";

// SVG Icon components
const BookIcon = () => (
  <svg
    className="activity-icon-svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

const MovieIcon = () => (
  <svg
    className="activity-icon-svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <rect x="2" y="7" width="20" height="15" rx="2.5" ry="2.5" />
    <path d="M17 2v5M7 2v5" />
  </svg>
);

const VacationIcon = () => (
  <svg
    className="activity-icon-svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h15a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2z" />
    <polyline points="3 10 21 10 12 15 3 10" />
  </svg>
);

const SleepIcon = () => (
  <svg
    className="activity-icon-svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    <circle cx="9" cy="10" r="1" />
    <circle cx="12" cy="10" r="1" />
    <circle cx="15" cy="10" r="1" />
  </svg>
);

const WeekendIcon = () => (
  <svg
    className="activity-icon-svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const DaysIcon = () => (
  <svg
    className="activity-icon-svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

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
              <div className="activity-icon-wrapper">
                <BookIcon />
              </div>
              <div className="activity-value">
                {activityBreakdown.books.toLocaleString()}
              </div>
              <div className="activity-label">Books Read</div>
            </div>

            <div className="activity-item">
              <div className="activity-icon-wrapper">
                <MovieIcon />
              </div>
              <div className="activity-value">
                {activityBreakdown.movies.toLocaleString()}
              </div>
              <div className="activity-label">Movies Watched</div>
            </div>

            <div className="activity-item">
              <div className="activity-icon-wrapper">
                <VacationIcon />
              </div>
              <div className="activity-value">
                {activityBreakdown.vacations.toLocaleString()}
              </div>
              <div className="activity-label">Week-long Vacations</div>
            </div>

            <div className="activity-item">
              <div className="activity-icon-wrapper">
                <SleepIcon />
              </div>
              <div className="activity-value">
                {activityBreakdown.sleepWeeks.toLocaleString()}
              </div>
              <div className="activity-label">Weeks of Sleep</div>
            </div>

            <div className="activity-item">
              <div className="activity-icon-wrapper">
                <WeekendIcon />
              </div>
              <div className="activity-value">
                {activityBreakdown.weekends.toLocaleString()}
              </div>
              <div className="activity-label">Weekends</div>
            </div>

            <div className="activity-item">
              <div className="activity-icon-wrapper">
                <DaysIcon />
              </div>
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
