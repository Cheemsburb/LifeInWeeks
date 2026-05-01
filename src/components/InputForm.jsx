import { useState, useEffect } from "react";
import countryData from "../data/countryLifeExpectancy.json";
import { validateBirthdate } from "../utils/calculations";
import "./InputForm.css";

function InputForm({ onSubmit, initialBirthdate, initialCountry }) {
  const [birthdate, setBirthdate] = useState(initialBirthdate || "");
  const [country, setCountry] = useState(initialCountry || "");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Validate birthdate
    const validation = validateBirthdate(birthdate);
    if (!validation.isValid) {
      setError(validation.error);
      return;
    }

    // Validate country selection
    if (!country) {
      setError("Please select a country");
      return;
    }

    // Find selected country's life expectancy
    const selectedCountry = countryData.countries.find(
      (c) => c.name === country,
    );
    if (!selectedCountry) {
      setError("Country not found");
      return;
    }

    // Trigger callback with form data
    onSubmit({
      birthdate,
      country,
      lifeExpectancy: selectedCountry.lifeExpectancy,
    });
  };

  const countries = countryData.countries.map((c) => c.name).sort();

  return (
    <div className="input-form">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="birthdate">When were you born?</label>
          <input
            type="date"
            id="birthdate"
            value={birthdate}
            onChange={(e) => setBirthdate(e.target.value)}
            max={new Date().toISOString().split("T")[0]}
          />
        </div>

        <div className="form-group">
          <label htmlFor="country">What country are you from?</label>
          <select
            id="country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          >
            <option value="">-- Select a country --</option>
            {countries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {error && <div className="error-message">{error}</div>}

        <button type="submit" className="submit-btn">
          Calculate My Weeks
        </button>
      </form>
    </div>
  );
}

export default InputForm;
