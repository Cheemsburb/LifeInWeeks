import { useState, useEffect } from "react";
import "./LifestyleFactors.css";

function LifestyleFactors({
  currentFactors,
  currentLifeExpectancy,
  currentAge,
  onSave,
  onClose,
}) {
  const [factors, setFactors] = useState({
    exercise: currentFactors?.exercise || "moderate",
    diet: currentFactors?.diet || "balanced",
    smoking: currentFactors?.smoking || "never",
    alcohol: currentFactors?.alcohol || "moderate",
    sleep: currentFactors?.sleep || "7-8",
    stress: currentFactors?.stress || "moderate",
    socialConnections: currentFactors?.socialConnections || "good",
  });

  const [adjustment, setAdjustment] = useState(0);

  useEffect(() => {
    calculateAdjustment();
  }, [factors]);

  const calculateAdjustment = () => {
    let total = 0;

    // Exercise
    switch (factors.exercise) {
      case "high":
        total += 3;
        break;
      case "moderate":
        total += 0;
        break;
      case "low":
        total -= 2;
        break;
      case "none":
        total -= 4;
        break;
    }

    // Diet
    switch (factors.diet) {
      case "excellent":
        total += 3;
        break;
      case "balanced":
        total += 0;
        break;
      case "poor":
        total -= 2;
        break;
      case "veryPoor":
        total -= 4;
        break;
    }

    // Smoking
    switch (factors.smoking) {
      case "never":
        total += 0;
        break;
      case "former":
        total -= 1;
        break;
      case "light":
        total -= 3;
        break;
      case "heavy":
        total -= 6;
        break;
    }

    // Alcohol
    switch (factors.alcohol) {
      case "none":
        total += 1;
        break;
      case "light":
        total += 0;
        break;
      case "moderate":
        total -= 1;
        break;
      case "heavy":
        total -= 3;
        break;
    }

    // Sleep
    switch (factors.sleep) {
      case "optimal":
        total += 2;
        break;
      case "7-8":
        total += 0;
        break;
      case "6-7":
        total -= 1;
        break;
      case "lessThan6":
        total -= 3;
        break;
    }

    // Stress
    switch (factors.stress) {
      case "low":
        total += 2;
        break;
      case "moderate":
        total += 0;
        break;
      case "high":
        total -= 2;
        break;
      case "chronic":
        total -= 4;
        break;
    }

    // Social Connections
    switch (factors.socialConnections) {
      case "excellent":
        total += 2;
        break;
      case "good":
        total += 0;
        break;
      case "limited":
        total -= 2;
        break;
      case "isolated":
        total -= 4;
        break;
    }

    setAdjustment(total);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const adjustedLifeExpectancy = Math.max(
      60,
      Math.min(110, currentLifeExpectancy + adjustment),
    );
    onSave({
      ...factors,
      adjustment,
      adjustedLifeExpectancy,
    });
  };

  const getAdjustmentColor = () => {
    if (adjustment > 3) return "excellent";
    if (adjustment > 0) return "good";
    if (adjustment === 0) return "neutral";
    if (adjustment > -3) return "warning";
    return "danger";
  };

  const getAdjustmentText = () => {
    if (adjustment > 3) return "Excellent lifestyle choices!";
    if (adjustment > 0) return "Good lifestyle choices";
    if (adjustment === 0) return "Average lifestyle";
    if (adjustment > -3) return "Room for improvement";
    return "Consider lifestyle changes";
  };

  return (
    <div className="lifestyle-overlay" onClick={onClose}>
      <div className="lifestyle-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Lifestyle Factors</h3>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <p className="lifestyle-description">
            Answer these questions about your lifestyle to get a personalized
            life expectancy estimate. Your answers will adjust your baseline
            life expectancy.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="form-section">
              <h4>Physical Health</h4>

              <div className="form-group">
                <label>How often do you exercise?</label>
                <select
                  value={factors.exercise}
                  onChange={(e) =>
                    setFactors({ ...factors, exercise: e.target.value })
                  }
                >
                  <option value="high">
                    Vigorous exercise 4+ times/week (+3 years)
                  </option>
                  <option value="moderate">
                    Moderate exercise 2-3 times/week (baseline)
                  </option>
                  <option value="low">
                    Light exercise occasionally (-2 years)
                  </option>
                  <option value="none">Sedentary lifestyle (-4 years)</option>
                </select>
              </div>

              <div className="form-group">
                <label>How would you describe your diet?</label>
                <select
                  value={factors.diet}
                  onChange={(e) =>
                    setFactors({ ...factors, diet: e.target.value })
                  }
                >
                  <option value="excellent">
                    Mostly whole foods, lots of vegetables (+3 years)
                  </option>
                  <option value="balanced">
                    Balanced diet with some processed foods (baseline)
                  </option>
                  <option value="poor">
                    High in processed foods and sugar (-2 years)
                  </option>
                  <option value="veryPoor">
                    Poor nutrition, frequent fast food (-4 years)
                  </option>
                </select>
              </div>

              <div className="form-group">
                <label>Do you smoke?</label>
                <select
                  value={factors.smoking}
                  onChange={(e) =>
                    setFactors({ ...factors, smoking: e.target.value })
                  }
                >
                  <option value="never">Never smoked (baseline)</option>
                  <option value="former">Former smoker (-1 year)</option>
                  <option value="light">
                    Light smoker (1-5/day) (-3 years)
                  </option>
                  <option value="heavy">
                    Heavy smoker (10+/day) (-6 years)
                  </option>
                </select>
              </div>
            </div>

            <div className="form-section">
              <h4>Lifestyle Habits</h4>

              <div className="form-group">
                <label>How much alcohol do you consume?</label>
                <select
                  value={factors.alcohol}
                  onChange={(e) =>
                    setFactors({ ...factors, alcohol: e.target.value })
                  }
                >
                  <option value="none">None or rarely (+1 year)</option>
                  <option value="light">
                    Light (1-3 drinks/week) (baseline)
                  </option>
                  <option value="moderate">
                    Moderate (4-10 drinks/week) (-1 year)
                  </option>
                  <option value="heavy">
                    Heavy (11+ drinks/week) (-3 years)
                  </option>
                </select>
              </div>

              <div className="form-group">
                <label>How many hours do you sleep per night?</label>
                <select
                  value={factors.sleep}
                  onChange={(e) =>
                    setFactors({ ...factors, sleep: e.target.value })
                  }
                >
                  <option value="optimal">
                    7-9 hours, good quality (+2 years)
                  </option>
                  <option value="7-8">7-8 hours (baseline)</option>
                  <option value="6-7">6-7 hours (-1 year)</option>
                  <option value="lessThan6">
                    Less than 6 hours (-3 years)
                  </option>
                </select>
              </div>
            </div>

            <div className="form-section">
              <h4>Mental & Social Health</h4>

              <div className="form-group">
                <label>How would you describe your stress levels?</label>
                <select
                  value={factors.stress}
                  onChange={(e) =>
                    setFactors({ ...factors, stress: e.target.value })
                  }
                >
                  <option value="low">Generally low stress (+2 years)</option>
                  <option value="moderate">
                    Moderate, manageable stress (baseline)
                  </option>
                  <option value="high">
                    High stress frequently (-2 years)
                  </option>
                  <option value="chronic">
                    Chronic, overwhelming stress (-4 years)
                  </option>
                </select>
              </div>

              <div className="form-group">
                <label>How strong are your social connections?</label>
                <select
                  value={factors.socialConnections}
                  onChange={(e) =>
                    setFactors({
                      ...factors,
                      socialConnections: e.target.value,
                    })
                  }
                >
                  <option value="excellent">
                    Strong relationships, active social life (+2 years)
                  </option>
                  <option value="good">
                    Good friendships, regular contact (baseline)
                  </option>
                  <option value="limited">
                    Few close relationships (-2 years)
                  </option>
                  <option value="isolated">
                    Often feel lonely or isolated (-4 years)
                  </option>
                </select>
              </div>
            </div>

            <div className="adjustment-summary">
              <div className={`adjustment-badge ${getAdjustmentColor()}`}>
                <span className="adjustment-value">
                  {adjustment > 0 ? "+" : ""}
                  {adjustment} years
                </span>
                <span className="adjustment-text">{getAdjustmentText()}</span>
              </div>
              <div className="adjusted-expectancy">
                Your adjusted life expectancy:{" "}
                <strong>
                  {Math.max(
                    60,
                    Math.min(110, currentLifeExpectancy + adjustment),
                  )}{" "}
                  years
                </strong>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn-cancel" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn-save">
                Update Life Expectancy
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LifestyleFactors;
