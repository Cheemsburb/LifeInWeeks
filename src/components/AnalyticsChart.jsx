import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import "./AnalyticsChart.css";

function AnalyticsChart({
  annotations,
  goalBlocks,
  customTags,
  annotationTags,
}) {
  // Calculate time distribution by category
  const calculateDistribution = () => {
    const distribution = {};

    // Count by custom tags
    if (annotationTags && annotationTags.length > 0 && customTags) {
      customTags.forEach((tag) => {
        distribution[tag.name] = { count: 0, color: tag.color };
      });

      annotationTags.forEach((at) => {
        at.tagIds.forEach((tagId) => {
          const tag = customTags.find((t) => t.id === tagId);
          if (tag && distribution[tag.name]) {
            distribution[tag.name].count++;
          }
        });
      });
    }

    // Also count by annotation colors as fallback
    if (annotations && annotations.length > 0) {
      annotations.forEach((ann) => {
        const colorKey = ann.label || "Other";
        if (!distribution[colorKey]) {
          distribution[colorKey] = { count: 0, color: ann.color };
        }
        distribution[colorKey].count++;
      });
    }

    // Convert to array for chart
    const total = Object.values(distribution).reduce(
      (sum, item) => sum + item.count,
      0,
    );

    return Object.entries(distribution)
      .filter(([, value]) => value.count > 0)
      .map(([name, data]) => ({
        name,
        value: data.count,
        percentage: total > 0 ? ((data.count / total) * 100).toFixed(1) : 0,
        color: data.color,
      }))
      .sort((a, b) => b.value - a.value);
  };

  const data = calculateDistribution();
  const totalWeeks = data.reduce((sum, item) => sum + item.value, 0);

  if (data.length === 0) {
    return (
      <div className="analytics-chart">
        <h3>Life Category Distribution</h3>
        <p className="no-data">
          Add annotations and tags to your weeks to see your life distribution
          analysis.
        </p>
      </div>
    );
  }

  return (
    <div className="analytics-chart">
      <h3>Life Category Distribution</h3>
      <p className="chart-subtitle">
        Based on {totalWeeks} annotated weeks across {data.length} categories
      </p>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
              label={({ name, percentage }) => `${percentage}%`}
              labelLine={{ stroke: "#6B7280", strokeWidth: 1 }}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name, props) => [
                `${value} weeks (${props.payload.percentage}%)`,
                name,
              ]}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value, entry) => (
                <span style={{ color: "#4B5563" }}>
                  {entry.payload.name} ({entry.payload.percentage}%)
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="analytics-summary">
        {data.map((item, idx) => (
          <div key={idx} className="summary-item">
            <span
              className="summary-color"
              style={{ backgroundColor: item.color }}
            />
            <span className="summary-name">{item.name}</span>
            <span className="summary-stats">
              {item.value} weeks ({item.percentage}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AnalyticsChart;
