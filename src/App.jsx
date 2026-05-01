import { useState, useEffect } from "react";
import "./App.css";
import InputForm from "./components/InputForm";
import StatsPanel from "./components/StatsPanel";
import TimeBreakdown from "./components/TimeBreakdown";
import WeeksGrid from "./components/WeeksGrid";
import {
  calculateWeeksLived,
  calculateTotalWeeks,
  calculateWeeksRemaining,
  calculateAge,
  calculateYearsRemaining,
  calculatePercentageLived,
  calculateTimeBreakdown,
  calculateMilestoneWeeks,
} from "./utils/calculations";
import { loadProfile, saveProfile } from "./utils/storage";

function App() {
  const [userProfile, setUserProfile] = useState(null);
  const [calculatedData, setCalculatedData] = useState(null);

  // Load saved profile on component mount
  useEffect(() => {
    const saved = loadProfile();
    if (saved) {
      setUserProfile(saved);
      calculateAndSetData(saved);
    }
  }, []);

  const calculateAndSetData = (profile) => {
    const weeksLived = calculateWeeksLived(profile.birthdate);
    const totalWeeks = calculateTotalWeeks(profile.lifeExpectancy);
    const weeksRemaining = calculateWeeksRemaining(
      profile.birthdate,
      profile.lifeExpectancy,
    );
    const age = calculateAge(profile.birthdate);
    const yearsRemaining = calculateYearsRemaining(profile.lifeExpectancy, age);
    const percentageLived = calculatePercentageLived(weeksLived, totalWeeks);
    const timeBreakdown = calculateTimeBreakdown(weeksRemaining);
    const milestoneWeeks = calculateMilestoneWeeks(
      totalWeeks,
      profile.lifeExpectancy,
    );

    setCalculatedData({
      weeksLived,
      totalWeeks,
      weeksRemaining,
      age,
      yearsRemaining,
      percentageLived,
      timeBreakdown,
      milestoneWeeks,
    });
  };

  const handleFormSubmit = (formData) => {
    const profile = {
      birthdate: formData.birthdate,
      country: formData.country,
      lifeExpectancy: formData.lifeExpectancy,
    };
    setUserProfile(profile);
    saveProfile(profile);
    calculateAndSetData(profile);
  };

  const handleReset = () => {
    setUserProfile(null);
    setCalculatedData(null);
    localStorage.removeItem("lifeInWeeks_profile");
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Life in Weeks</h1>
        <p className="header-subtitle">
          Visualize your lifetime and make every week count
        </p>
      </header>

      <main className="app-main">
        {!userProfile ? (
          <InputForm
            onSubmit={handleFormSubmit}
            initialBirthdate=""
            initialCountry=""
          />
        ) : (
          <>
            <button className="reset-btn" onClick={handleReset}>
              Change Profile
            </button>

            {calculatedData && (
              <>
                <div className="profile-info">
                  <span className="profile-detail">
                    <strong>{userProfile.country}</strong>
                  </span>
                  <span className="profile-detail">
                    Life expectancy:{" "}
                    <strong>{userProfile.lifeExpectancy} years</strong>
                  </span>
                </div>

                <StatsPanel
                  weeksLived={calculatedData.weeksLived}
                  totalWeeks={calculatedData.totalWeeks}
                  age={calculatedData.age}
                  yearsRemaining={calculatedData.yearsRemaining}
                  percentageLived={calculatedData.percentageLived}
                />

                <TimeBreakdown timeBreakdown={calculatedData.timeBreakdown} />

                <WeeksGrid
                  weeksLived={calculatedData.weeksLived}
                  totalWeeks={calculatedData.totalWeeks}
                  milestoneWeeks={calculatedData.milestoneWeeks}
                />
              </>
            )}
          </>
        )}
      </main>

      <footer className="app-footer">
        <p>
          "Life is what happens to you while you're busy making other plans." —
          John Lennon
        </p>
      </footer>
    </div>
  );
}

export default App;
