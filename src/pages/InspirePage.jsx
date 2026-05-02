import InspirationalFigures from "../components/InspirationalFigures";

function InspirePage() {
  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Inspire</h2>
        <p className="page-description">
          Explore the milestone timelines of remarkable individuals who changed
          the world. Let their journeys inspire your own path.
        </p>
      </div>
      <InspirationalFigures />
    </div>
  );
}

export default InspirePage;
