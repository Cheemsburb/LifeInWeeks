import { useState } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ZAxis,
} from "recharts";
import "./InspirationalFigures.css";
import figuresData from "../data/inspirationalFigures.json";

const categoryColors = {
  life: "#6B7280",
  education: "#3B82F6",
  career: "#10B981",
  family: "#EC4899",
  achievement: "#F59E0B",
};

const figureColors = {
  mandela: "#EF4444",
  curie: "#8B5CF6",
  gandhi: "#F59E0B",
  einstein: "#3B82F6",
  king: "#EC4899",
  teresa: "#10B981",
};

const reflectionPrompts = [
  "What legacy do you want to leave behind?",
  "What challenge have you overcome that made you stronger?",
  "Who has been your biggest inspiration in life?",
  "What achievement are you most proud of?",
  "How have you helped others in your community?",
  "What difficult decision changed your life for the better?",
  "What would you do if you knew you couldn't fail?",
  "How have you grown in the last 5 years?",
];

function InspirationalFigures() {
  const [selectedFigure, setSelectedFigure] = useState(null);
  const [showChart, setShowChart] = useState(true);
  const [showPrompt, setShowPrompt] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState(reflectionPrompts[0]);

  const getRandomPrompt = () => {
    const randomIdx = Math.floor(Math.random() * reflectionPrompts.length);
    setCurrentPrompt(reflectionPrompts[randomIdx]);
    setShowPrompt(true);
  };

  const getChartData = () => {
    const data = [];
    figuresData.figures.forEach((figure) => {
      figure.milestones.forEach((milestone) => {
        const age = Math.floor(milestone.week / 52);
        data.push({
          id: `${figure.id}-${milestone.week}`,
          figure: figure.name,
          figureId: figure.id,
          age,
          category: milestone.category,
          label: milestone.label,
          z: 100,
        });
      });
    });
    return data;
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <p className="tooltip-name">{data.figure}</p>
          <p className="tooltip-age">Age {data.age}</p>
          <p className="tooltip-event">{data.label}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="inspirational-figures">
      <h2>Inspirational Life Stories</h2>
      <p className="figures-description">
        Explore the milestone timelines of remarkable individuals who changed
        the world. Let their journeys inspire your own path.
      </p>

      <div className="figures-controls">
        <button className="prompt-button" onClick={getRandomPrompt}>
          🪞 Get Reflection Prompt
        </button>
        <label className="toggle-option">
          <input
            type="checkbox"
            checked={showChart}
            onChange={() => setShowChart(!showChart)}
          />
          Show Timeline Chart
        </label>
      </div>

      {showPrompt && (
        <div className="reflection-prompt">
          <h4>🤔 Reflect on this:</h4>
          <p>{currentPrompt}</p>
        </div>
      )}

      {showChart && (
        <div className="timeline-chart-container">
          <h3>Milestones Across Lifetimes</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={400}>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  dataKey="age"
                  name="Age"
                  label={{
                    value: "Age",
                    position: "insideBottom",
                    offset: -5,
                  }}
                  domain={[0, 100]}
                />
                <YAxis
                  type="category"
                  dataKey="category"
                  name="Category"
                  ticks={[
                    "life",
                    "education",
                    "career",
                    "family",
                    "achievement",
                  ]}
                  label={{
                    value: "Life Category",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <ZAxis type="number" dataKey="z" range={[50, 400]} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                {Object.entries(figureColors).map(([id, color]) => {
                  const figure = figuresData.figures.find((f) => f.id === id);
                  if (!figure) return null;
                  const figureData = getChartData().filter(
                    (d) => d.figureId === id,
                  );
                  return (
                    <Scatter
                      key={id}
                      name={figure.name}
                      data={figureData}
                      fill={color}
                      onClick={() =>
                        setSelectedFigure(selectedFigure === id ? null : id)
                      }
                      style={{
                        cursor: "pointer",
                        opacity:
                          selectedFigure && selectedFigure !== id ? 0.3 : 1,
                      }}
                    />
                  );
                })}
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="figures-grid">
        {figuresData.figures.map((figure) => (
          <div
            key={figure.id}
            className={`figure-card ${selectedFigure === figure.id ? "selected" : ""}`}
            onClick={() =>
              setSelectedFigure(selectedFigure === figure.id ? null : figure.id)
            }
          >
            <div className="figure-header">
              <h3 style={{ color: figureColors[figure.id] }}>{figure.name}</h3>
              <span className="figure-lifespan">
                {figure.birthYear} - {figure.deathYear} (Age{" "}
                {figure.lifeExpectancy})
              </span>
            </div>
            <p className="figure-description">{figure.description}</p>

            {(selectedFigure === figure.id || selectedFigure === null) && (
              <div className="figure-timeline">
                <h4>Key Milestones:</h4>
                <ul className="timeline-list">
                  {figure.milestones.map((milestone, idx) => (
                    <li
                      key={idx}
                      style={{
                        borderLeftColor: categoryColors[milestone.category],
                      }}
                    >
                      <span className="timeline-age">
                        Age {Math.floor(milestone.week / 52)}
                      </span>
                      <span className="timeline-label">{milestone.label}</span>
                      <span
                        className="timeline-category"
                        style={{
                          backgroundColor: categoryColors[milestone.category],
                        }}
                      >
                        {milestone.category}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default InspirationalFigures;
