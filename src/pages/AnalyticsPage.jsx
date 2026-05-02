import AnalyticsChart from "../components/AnalyticsChart";

function AnalyticsPage({
  annotations,
  goalBlocks,
  customTags,
  annotationTags,
}) {
  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Analytics</h2>
        <p className="page-description">
          Visualize your life distribution across different categories based on
          your annotations and tags.
        </p>
      </div>
      <AnalyticsChart
        annotations={annotations}
        goalBlocks={goalBlocks}
        customTags={customTags}
        annotationTags={annotationTags}
      />
    </div>
  );
}

export default AnalyticsPage;
