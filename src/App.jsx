import { useState, useEffect } from "react";
import "./App.css";
import InputForm from "./components/InputForm";
import StatsPanel from "./components/StatsPanel";
import TimeBreakdown from "./components/TimeBreakdown";
import WeeksGrid from "./components/WeeksGrid";
import AnnotationModal from "./components/AnnotationModal";
import GoalModal from "./components/GoalModal";
import LifestyleFactors from "./components/LifestyleFactors";
import DataExport from "./components/DataExport";
import {
  calculateWeeksLived,
  calculateTotalWeeks,
  calculateWeeksRemaining,
  calculateAge,
  calculateYearsRemaining,
  calculatePercentageLived,
  calculateTimeBreakdown,
  calculateMilestoneWeeks,
  calculateActivityBreakdown,
} from "./utils/calculations";
import {
  loadProfile,
  saveProfile,
  loadAnnotations,
  saveAnnotations,
  loadGoalBlocks,
  saveGoalBlocks,
  loadLifestyleFactors,
  saveLifestyleFactors,
} from "./utils/storage";

function App() {
  const [userProfile, setUserProfile] = useState(null);
  const [calculatedData, setCalculatedData] = useState(null);
  const [annotations, setAnnotations] = useState([]);
  const [goalBlocks, setGoalBlocks] = useState([]);
  const [lifestyleFactors, setLifestyleFactors] = useState(null);
  const [isAnnotationModalOpen, setIsAnnotationModalOpen] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [selectedGoalRange, setSelectedGoalRange] = useState(null);
  const [showLifestyle, setShowLifestyle] = useState(false);
  const [showExport, setShowExport] = useState(false);

  // Load saved data on component mount
  useEffect(() => {
    const saved = loadProfile();
    if (saved) {
      setUserProfile(saved);
      calculateAndSetData(saved);
    }
    const savedAnnotations = loadAnnotations();
    setAnnotations(savedAnnotations);
    const savedGoalBlocks = loadGoalBlocks();
    setGoalBlocks(savedGoalBlocks);
    const savedLifestyle = loadLifestyleFactors();
    if (savedLifestyle) {
      setLifestyleFactors(savedLifestyle);
    }
  }, []);

  // Save annotations whenever they change
  useEffect(() => {
    if (
      annotations.length > 0 ||
      localStorage.getItem("lifeInWeeks_annotations")
    ) {
      saveAnnotations(annotations);
    }
  }, [annotations]);

  // Save goal blocks whenever they change
  useEffect(() => {
    if (
      goalBlocks.length > 0 ||
      localStorage.getItem("lifeInWeeks_goalBlocks")
    ) {
      saveGoalBlocks(goalBlocks);
    }
  }, [goalBlocks]);

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
    const activityBreakdown = calculateActivityBreakdown(weeksRemaining);

    setCalculatedData({
      weeksLived,
      totalWeeks,
      weeksRemaining,
      age,
      yearsRemaining,
      percentageLived,
      timeBreakdown,
      milestoneWeeks,
      activityBreakdown,
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

  const handleWeekClick = (weekNum) => {
    // Only open annotation modal for past weeks
    if (weekNum < calculatedData.weeksLived) {
      setSelectedWeek(weekNum);
      setIsAnnotationModalOpen(true);
    }
  };

  const handleAnnotationSave = (annotation, isDelete = false) => {
    if (isDelete || annotation.label === null) {
      // Delete annotation
      setAnnotations((prev) =>
        prev.filter((a) => a.weekNumber !== annotation.weekNumber),
      );
    } else {
      // Add or update annotation
      setAnnotations((prev) => {
        const filtered = prev.filter(
          (a) => a.weekNumber !== annotation.weekNumber,
        );
        return [...filtered, annotation];
      });
    }
    setIsAnnotationModalOpen(false);
    setSelectedWeek(null);
  };

  const handleGoalSelect = (startWeek, endWeek) => {
    setSelectedGoalRange({ startWeek, endWeek });
    setIsGoalModalOpen(true);
  };

  const handleGoalSave = (goal, isDelete = false) => {
    if (isDelete || goal.label === null) {
      // Delete goal block - remove any overlapping blocks
      setGoalBlocks((prev) =>
        prev.filter(
          (g) => !(goal.startWeek <= g.endWeek && goal.endWeek >= g.startWeek),
        ),
      );
    } else {
      // Add or update goal block - remove overlapping first
      setGoalBlocks((prev) => {
        const filtered = prev.filter(
          (g) => !(goal.startWeek <= g.endWeek && goal.endWeek >= g.startWeek),
        );
        return [...filtered, goal];
      });
    }
    setIsGoalModalOpen(false);
    setSelectedGoalRange(null);
  };

  const handleLifestyleSave = (factors) => {
    setLifestyleFactors(factors);
    saveLifestyleFactors(factors);
    // Recalculate with new life expectancy
    if (userProfile) {
      const updatedProfile = {
        ...userProfile,
        lifeExpectancy: factors.adjustedLifeExpectancy,
      };
      setUserProfile(updatedProfile);
      saveProfile(updatedProfile);
      calculateAndSetData(updatedProfile);
    }
    setShowLifestyle(false);
  };

  const handleReset = () => {
    setUserProfile(null);
    setCalculatedData(null);
    setAnnotations([]);
    setGoalBlocks([]);
    setLifestyleFactors(null);
    localStorage.removeItem("lifeInWeeks_profile");
    localStorage.removeItem("lifeInWeeks_annotations");
    localStorage.removeItem("lifeInWeeks_goalBlocks");
    localStorage.removeItem("lifeInWeeks_lifestyle");
  };

  const getSelectedAnnotation = () => {
    if (selectedWeek === null) return null;
    return annotations.find((a) => a.weekNumber === selectedWeek);
  };

  const getSelectedGoal = () => {
    if (!selectedGoalRange) return null;
    return goalBlocks.find(
      (g) =>
        g.startWeek === selectedGoalRange.startWeek &&
        g.endWeek === selectedGoalRange.endWeek,
    );
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
            <div className="action-buttons">
              <button
                className="action-btn"
                onClick={() => setShowLifestyle(!showLifestyle)}
              >
                Lifestyle Factors
              </button>
              <button
                className="action-btn"
                onClick={() => setShowExport(!showExport)}
              >
                Export/Import Data
              </button>
              <button className="reset-btn" onClick={handleReset}>
                Change Profile
              </button>
            </div>

            {showLifestyle && (
              <LifestyleFactors
                currentFactors={lifestyleFactors}
                currentLifeExpectancy={userProfile.lifeExpectancy}
                currentAge={calculatedData?.age || 0}
                onSave={handleLifestyleSave}
                onClose={() => setShowLifestyle(false)}
              />
            )}

            {showExport && <DataExport />}

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
                  {lifestyleFactors && (
                    <span className="profile-detail lifestyle-badge">
                      Personalized
                    </span>
                  )}
                </div>

                <StatsPanel
                  weeksLived={calculatedData.weeksLived}
                  totalWeeks={calculatedData.totalWeeks}
                  age={calculatedData.age}
                  yearsRemaining={calculatedData.yearsRemaining}
                  percentageLived={calculatedData.percentageLived}
                />

                <TimeBreakdown
                  timeBreakdown={calculatedData.timeBreakdown}
                  activityBreakdown={calculatedData.activityBreakdown}
                />

                <WeeksGrid
                  weeksLived={calculatedData.weeksLived}
                  totalWeeks={calculatedData.totalWeeks}
                  milestoneWeeks={calculatedData.milestoneWeeks}
                  annotations={annotations}
                  goalBlocks={goalBlocks}
                  onWeekClick={handleWeekClick}
                  onGoalSelect={handleGoalSelect}
                />
              </>
            )}
          </>
        )}
      </main>

      <AnnotationModal
        isOpen={isAnnotationModalOpen}
        weekNumber={selectedWeek}
        existingAnnotation={getSelectedAnnotation()}
        onSave={handleAnnotationSave}
        onCancel={() => {
          setIsAnnotationModalOpen(false);
          setSelectedWeek(null);
        }}
      />

      <GoalModal
        isOpen={isGoalModalOpen}
        startWeek={selectedGoalRange?.startWeek}
        endWeek={selectedGoalRange?.endWeek}
        weeksLived={calculatedData?.weeksLived}
        existingGoal={getSelectedGoal()}
        onSave={handleGoalSave}
        onCancel={() => {
          setIsGoalModalOpen(false);
          setSelectedGoalRange(null);
        }}
      />

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
