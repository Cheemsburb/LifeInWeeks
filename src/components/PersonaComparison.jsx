import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import "./PersonaComparison.css";
import personasData from "../data/personas.json";

const categoryColors = {
  life: "#6B7280",
  education: "#3B82F6",
  career: "#10B981",
  family: "#EC4899",
  achievement: "#F59E0B",
};

const personaColors = {
  "avg-filipino": "#EF4444",
  "avg-american": "#3B82F6",
  "avg-japanese": "#10B981",
  "avg-office-worker": "#8B5CF6",
};

function PersonaComparison({ userWeeksLived, userLifeExpectancy }) {
  const [selectedPersonas, setSelectedPersonas] = useState([
    "avg-filipino",
    "avg-american",
  ]);
  const [showMilestones, setShowMilestones] = useState(true);
  const [showEras, setShowEras] = useState(true);

  const togglePersona = (personaId) => {
    setSelectedPersonas((prev) =>
      prev.includes(personaId)
        ? prev.filter((id) => id !== personaId)
        : [...prev, personaId],
    );
  };

  const generateChartData = () => {
    const maxWeeks = Math.max(
      userLifeExpectancy * 52,
      ...selectedPersonas.map(
        (id) =>
          personasData.personas.find((p) => p.id === id)?.lifeExpectancy * 52 ||
          0,
      ),
    );

    const data = [];
    const totalPoints = Math.min(Math.ceil(maxWeeks / 52), 100);

    for (let i = 0; i <= totalPoints; i++) {
      const age = Math.round((i / totalPoints) * (maxWeeks / 52));
      const weekNum = age * 52;
      const point = { age };

      // User's progress
      if (weekNum <= userWeeksLived) {
        point.user = 100;
      } else if (weekNum <= userLifeExpectancy * 52) {
        point.user = (userWeeksLived / (userLifeExpectancy * 52)) * 100;
      }

      // Each selected persona's progress
      selectedPersonas.forEach((personaId) => {
        const persona = personasData.personas.find((p) => p.id === personaId);
        if (persona) {
          const personaTotalWeeks = persona.lifeExpectancy * 52;
          if (weekNum <= personaTotalWeeks) {
            point[personaId] = (weekNum / personaTotalWeeks) * 100;
          }
        }
      });

      data.push(point);
    }

    return data;
  };

  const getPersonaMilestones = (personaId) => {
    const persona = personasData.personas.find((p) => p.id === personaId);
    return persona?.milestones || [];
  };

  const getPersonaEras = (personaId) => {
    const persona = personasData.personas.find((p) => p.id === personaId);
    return persona?.eras || [];
  };

  const selectedPersonasList = personasData.personas.filter((p) =>
    selectedPersonas.includes(p.id),
  );

  return (
    <div className="persona-comparison">
      <h2>Compare with Life Trajectories</h2>
      <p className="comparison-description">
        See how your life journey compares with statistical norms from different
        demographics and professions.
      </p>

      <div className="comparison-controls">
        <div className="persona-selector">
          <h4>Select Personas to Compare:</h4>
          <div className="persona-checkboxes">
            {personasData.personas.map((persona) => (
              <label key={persona.id} className="persona-checkbox">
                <input
                  type="checkbox"
                  checked={selectedPersonas.includes(persona.id)}
                  onChange={() => togglePersona(persona.id)}
                />
                <span
                  className="color-dot"
                  style={{ backgroundColor: personaColors[persona.id] }}
                />
                {persona.name}
              </label>
            ))}
          </div>
        </div>

        <div className="toggle-options">
          <label className="toggle-option">
            <input
              type="checkbox"
              checked={showMilestones}
              onChange={() => setShowMilestones(!showMilestones)}
            />
            Show Milestones
          </label>
          <label className="toggle-option">
            <input
              type="checkbox"
              checked={showEras}
              onChange={() => setShowEras(!showEras)}
            />
            Show Life Eras
          </label>
        </div>
      </div>

      {selectedPersonas.length > 0 && (
        <div className="comparison-chart-container">
          <h3>Life Progress Comparison</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={generateChartData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="age"
                  label={{
                    value: "Age",
                    position: "insideBottom",
                    offset: -5,
                  }}
                />
                <YAxis
                  label={{
                    value: "Life Progress (%)",
                    angle: -90,
                    position: "insideLeft",
                  }}
                  domain={[0, 100]}
                />
                <Tooltip
                  formatter={(value, name) => [`${value?.toFixed(1)}%`, name]}
                />
                <Legend />
                <ReferenceLine
                  stroke="#EF4444"
                  strokeDasharray="5 5"
                  label="You"
                />
                <Line
                  type="monotone"
                  dataKey="user"
                  name="You"
                  stroke="#EF4444"
                  strokeWidth={3}
                  dot={false}
                />
                {selectedPersonas.map((personaId) => {
                  const persona = personasData.personas.find(
                    (p) => p.id === personaId,
                  );
                  return (
                    <Line
                      key={personaId}
                      type="monotone"
                      dataKey={personaId}
                      name={persona?.name}
                      stroke={personaColors[personaId]}
                      strokeWidth={2}
                      dot={false}
                    />
                  );
                })}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {showMilestones && selectedPersonasList.length > 0 && (
        <div className="milestones-section">
          <h3>Key Life Milestones</h3>
          <div className="milestones-grid">
            {selectedPersonasList.map((persona) => (
              <div key={persona.id} className="persona-milestones">
                <h4 style={{ color: personaColors[persona.id] }}>
                  {persona.name}
                </h4>
                <p className="persona-description">{persona.description}</p>
                <ul className="milestone-list">
                  {persona.milestones.map((milestone, idx) => (
                    <li
                      key={idx}
                      style={{
                        borderLeftColor: categoryColors[milestone.category],
                      }}
                    >
                      <span className="milestone-age">
                        Age {Math.floor(milestone.week / 52)}
                      </span>
                      <span className="milestone-label">{milestone.label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {showEras && selectedPersonasList.length > 0 && (
        <div className="eras-section">
          <h3>Life Eras Comparison</h3>
          <div className="eras-grid">
            {selectedPersonasList.map((persona) => (
              <div key={persona.id} className="persona-eras">
                <h4 style={{ color: personaColors[persona.id] }}>
                  {persona.name}
                </h4>
                <div className="eras-bar">
                  {persona.eras.map((era, idx) => (
                    <div
                      key={idx}
                      className="era-segment"
                      style={{
                        backgroundColor: era.color,
                        width: `${((era.endWeek - era.startWeek) / (persona.lifeExpectancy * 52)) * 100}%`,
                      }}
                      title={`${era.label}: Age ${Math.floor(era.startWeek / 52)}-${Math.floor(era.endWeek / 52)}`}
                    />
                  ))}
                </div>
                <div className="eras-legend">
                  {persona.eras.map((era, idx) => (
                    <span key={idx} className="era-label">
                      <span
                        className="era-color"
                        style={{ backgroundColor: era.color }}
                      />
                      {era.label}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default PersonaComparison;
