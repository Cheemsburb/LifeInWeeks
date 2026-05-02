import { useState, useEffect, useRef } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import "./App.css";
import InputForm from "./components/InputForm";
import HeroSection from "./components/HeroSection";
import StatsPanel from "./components/StatsPanel";
import TimeBreakdown from "./components/TimeBreakdown";
import WeeksGrid from "./components/WeeksGrid";
import AnnotationModal from "./components/AnnotationModal";
import GoalModal from "./components/GoalModal";
import LifestyleFactors from "./components/LifestyleFactors";
import DataExport from "./components/DataExport";
import DarkModeToggle from "./components/DarkModeToggle";
import PINLock from "./components/PINLock";
import ImageExport from "./components/ImageExport";
import ViewToggle from "./components/ViewToggle";
import ReminderNotification from "./components/ReminderNotification";
import StreakCounter from "./components/StreakCounter";
import PrintView from "./components/PrintView";
import AnalyticsPage from "./pages/AnalyticsPage";
import ComparePage from "./pages/ComparePage";
import InspirePage from "./pages/InspirePage";
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
  loadJournals,
  saveJournals,
  loadCustomTags,
  saveCustomTags,
  loadWeekEmojis,
  saveWeekEmojis,
  loadAnnotationTags,
  saveAnnotationTags,
  loadPin,
} from "./utils/storage";

// Navigation component for header links
function NavLinks({ userProfile, showExport, setShowExport }) {
  const location = useLocation();
  const isMainPage = location.pathname === "/";

  return (
    <div className="header-links">
      {userProfile && (
        <>
          <Link
            to="/compare"
            className={`header-link ${location.pathname === "/compare" ? "active" : ""}`}
          >
            Compare
          </Link>
          <Link
            to="/inspire"
            className={`header-link ${location.pathname === "/inspire" ? "active" : ""}`}
          >
            Inspire
          </Link>
          <Link
            to="/analytics"
            className={`header-link ${location.pathname === "/analytics" ? "active" : ""}`}
          >
            Analytics
          </Link>
          {isMainPage && (
            <button
              className={`header-link ${showExport ? "active" : ""}`}
              onClick={() => setShowExport(!showExport)}
            >
              Export
            </button>
          )}
        </>
      )}
    </div>
  );
}

function AppContent() {
  const [userProfile, setUserProfile] = useState(null);
  const [calculatedData, setCalculatedData] = useState(null);
  const [annotations, setAnnotations] = useState([]);
  const [goalBlocks, setGoalBlocks] = useState([]);
  const [lifestyleFactors, setLifestyleFactors] = useState(null);
  const [journals, setJournals] = useState([]);
  const [customTags, setCustomTags] = useState([]);
  const [weekEmojis, setWeekEmojis] = useState([]);
  const [annotationTags, setAnnotationTags] = useState([]);
  const [isAnnotationModalOpen, setIsAnnotationModalOpen] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [selectedGoalRange, setSelectedGoalRange] = useState(null);
  const [showLifestyle, setShowLifestyle] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [currentView, setCurrentView] = useState("life");
  const [isPinSet, setIsPinSet] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const gridRef = useRef(null);
  const location = useLocation();

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
    const savedJournals = loadJournals();
    setJournals(savedJournals);
    const savedTags = loadCustomTags();
    setCustomTags(savedTags);
    const savedEmojis = loadWeekEmojis();
    setWeekEmojis(savedEmojis);
    const savedAnnotationTags = loadAnnotationTags();
    setAnnotationTags(savedAnnotationTags);
    const savedPin = loadPin();
    if (savedPin) {
      setIsPinSet(true);
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

  // Save journals whenever they change
  useEffect(() => {
    if (journals.length > 0) {
      saveJournals(journals);
    }
  }, [journals]);

  // Save emojis whenever they change
  useEffect(() => {
    if (weekEmojis.length > 0) {
      saveWeekEmojis(weekEmojis);
    }
  }, [weekEmojis]);

  // Save annotation tags whenever they change
  useEffect(() => {
    if (annotationTags.length > 0) {
      saveAnnotationTags(annotationTags);
    }
  }, [annotationTags]);

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

  const handleJournalSave = (journal) => {
    setJournals((prev) => {
      const filtered = prev.filter((j) => j.weekNumber !== journal.weekNumber);
      return [...filtered, journal];
    });
  };

  const handleEmojiSave = (emojiData) => {
    setWeekEmojis((prev) => {
      const filtered = prev.filter(
        (e) => e.weekNumber !== emojiData.weekNumber,
      );
      return [...filtered, emojiData];
    });
  };

  const handleTagsSave = (tagData) => {
    setAnnotationTags((prev) => {
      const filtered = prev.filter((t) => t.weekNumber !== tagData.weekNumber);
      return [...filtered, tagData];
    });
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
    setJournals([]);
    setWeekEmojis([]);
    setAnnotationTags([]);
    localStorage.removeItem("lifeInWeeks_profile");
    localStorage.removeItem("lifeInWeeks_annotations");
    localStorage.removeItem("lifeInWeeks_goalBlocks");
    localStorage.removeItem("lifeInWeeks_lifestyle");
    localStorage.removeItem("lifeInWeeks_journals");
    localStorage.removeItem("lifeInWeeks_emojis");
    localStorage.removeItem("lifeInWeeks_annotationTags");
  };

  const getSelectedAnnotation = () => {
    if (selectedWeek === null) return null;
    return annotations.find((a) => a.weekNumber === selectedWeek);
  };

  const getSelectedJournal = () => {
    if (selectedWeek === null) return null;
    return journals.find((j) => j.weekNumber === selectedWeek);
  };

  const getSelectedEmoji = () => {
    if (selectedWeek === null) return null;
    return weekEmojis.find((e) => e.weekNumber === selectedWeek);
  };

  const getSelectedTags = () => {
    if (selectedWeek === null) return null;
    return annotationTags.find((t) => t.weekNumber === selectedWeek);
  };

  const getSelectedGoal = () => {
    if (!selectedGoalRange) return null;
    return goalBlocks.find(
      (g) =>
        g.startWeek === selectedGoalRange.startWeek &&
        g.endWeek === selectedGoalRange.endWeek,
    );
  };

  const handlePinUnlock = () => {
    setIsUnlocked(true);
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  // Check if we're on the main page
  const isMainPage = location.pathname === "/";

  // Show PIN lock if set and not unlocked
  if (isPinSet && !isUnlocked) {
    return (
      <div className="app">
        <PINLock onUnlock={handlePinUnlock} />
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <Link to="/" className="app-title-link">
          <h1>Life in Weeks</h1>
        </Link>
        <div className="header-controls">
          <DarkModeToggle />
          {userProfile && (
            <>
              <NavLinks
                userProfile={userProfile}
                showExport={showExport}
                setShowExport={setShowExport}
              />
              <PINLock onUnlock={handlePinUnlock} />
              <button className="header-link reset-btn" onClick={handleReset}>
                Reset
              </button>
            </>
          )}
        </div>
      </header>

      <main className="app-main">
        <Routes>
          <Route
            path="/analytics"
            element={
              userProfile && calculatedData ? (
                <AnalyticsPage
                  annotations={annotations}
                  goalBlocks={goalBlocks}
                  customTags={customTags}
                  annotationTags={annotationTags}
                />
              ) : (
                <InputForm
                  onSubmit={handleFormSubmit}
                  initialBirthdate=""
                  initialCountry=""
                />
              )
            }
          />
          <Route
            path="/compare"
            element={
              userProfile && calculatedData ? (
                <ComparePage
                  userWeeksLived={calculatedData.weeksLived}
                  userLifeExpectancy={userProfile.lifeExpectancy}
                />
              ) : (
                <InputForm
                  onSubmit={handleFormSubmit}
                  initialBirthdate=""
                  initialCountry=""
                />
              )
            }
          />
          <Route
            path="/inspire"
            element={
              userProfile ? (
                <InspirePage />
              ) : (
                <InputForm
                  onSubmit={handleFormSubmit}
                  initialBirthdate=""
                  initialCountry=""
                />
              )
            }
          />
          <Route
            path="/"
            element={
              <>
                {!userProfile ? (
                  <InputForm
                    onSubmit={handleFormSubmit}
                    initialBirthdate=""
                    initialCountry=""
                  />
                ) : (
                  <>
                    {calculatedData && (
                      <HeroSection
                        weeksRemaining={calculatedData.weeksRemaining}
                        age={calculatedData.age}
                        yearsRemaining={calculatedData.yearsRemaining}
                        userProfile={userProfile}
                      />
                    )}

                    {/* Streak Counter */}
                    {calculatedData && (
                      <StreakCounter
                        currentWeek={calculatedData.weeksLived}
                        annotations={annotations}
                        goalBlocks={goalBlocks}
                      />
                    )}

                    {/* View Toggle */}
                    <ViewToggle onViewChange={handleViewChange} />

                    {showLifestyle && (
                      <LifestyleFactors
                        currentFactors={lifestyleFactors}
                        currentLifeExpectancy={userProfile.lifeExpectancy}
                        currentAge={calculatedData?.age || 0}
                        onSave={handleLifestyleSave}
                        onClose={() => setShowLifestyle(false)}
                      />
                    )}

                    {showExport && (
                      <div className="export-section">
                        <DataExport />
                        <ImageExport gridRef={gridRef} />
                      </div>
                    )}

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
                          ref={gridRef}
                          weeksLived={calculatedData.weeksLived}
                          totalWeeks={calculatedData.totalWeeks}
                          milestoneWeeks={calculatedData.milestoneWeeks}
                          annotations={annotations}
                          goalBlocks={goalBlocks}
                          weekEmojis={weekEmojis}
                          customTags={customTags}
                          annotationTags={annotationTags}
                          currentView={currentView}
                          onWeekClick={handleWeekClick}
                          onGoalSelect={handleGoalSelect}
                          onUpdateGoalBlock={(updatedGoal) => {
                            setGoalBlocks((prev) =>
                              prev.map((g) =>
                                g.startWeek === updatedGoal.startWeek &&
                                g.endWeek === updatedGoal.endWeek
                                  ? updatedGoal
                                  : g,
                              ),
                            );
                          }}
                          onUpdateAnnotation={(updatedAnnotation) => {
                            setAnnotations((prev) =>
                              prev.map((a) =>
                                a.weekNumber === updatedAnnotation.weekNumber
                                  ? updatedAnnotation
                                  : a,
                              ),
                            );
                          }}
                        />

                        <PrintView
                          gridRef={gridRef}
                          userProfile={userProfile}
                          calculatedData={calculatedData}
                        />
                      </>
                    )}
                  </>
                )}
              </>
            }
          />
        </Routes>
      </main>

      <AnnotationModal
        isOpen={isAnnotationModalOpen}
        weekNumber={selectedWeek}
        existingAnnotation={getSelectedAnnotation()}
        existingJournal={getSelectedJournal()}
        existingEmoji={getSelectedEmoji()}
        existingTags={getSelectedTags()}
        customTags={customTags}
        onSave={handleAnnotationSave}
        onSaveJournal={handleJournalSave}
        onSaveEmoji={handleEmojiSave}
        onSaveTags={handleTagsSave}
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

      {/* Reminder Notification */}
      {calculatedData && (
        <ReminderNotification weeksLived={calculatedData.weeksLived} />
      )}

      <footer className="app-footer">
        <p>
          "Life is what happens to you while you're busy making other plans." —
          John Lennon
        </p>
      </footer>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
