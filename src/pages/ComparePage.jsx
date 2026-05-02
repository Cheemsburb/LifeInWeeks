import PersonaComparison from "../components/PersonaComparison";

function ComparePage({ userWeeksLived, userLifeExpectancy }) {
  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Compare</h2>
        <p className="page-description">
          See how your life journey compares with statistical norms from
          different demographics and professions.
        </p>
      </div>
      <PersonaComparison
        userWeeksLived={userWeeksLived}
        userLifeExpectancy={userLifeExpectancy}
      />
    </div>
  );
}

export default ComparePage;
