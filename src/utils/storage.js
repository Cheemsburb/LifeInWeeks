/**
 * Save user profile to localStorage
 * @param {object} profile - { birthdate: string, country: string }
 */
export const saveProfile = (profile) => {
  try {
    localStorage.setItem("lifeInWeeks_profile", JSON.stringify(profile));
  } catch (err) {
    console.error("Failed to save profile:", err);
  }
};

/**
 * Load user profile from localStorage
 * @returns {object | null} - { birthdate: string, country: string } or null if not found
 */
export const loadProfile = () => {
  try {
    const data = localStorage.getItem("lifeInWeeks_profile");
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.error("Failed to load profile:", err);
    return null;
  }
};

/**
 * Clear user profile from localStorage
 */
export const clearProfile = () => {
  try {
    localStorage.removeItem("lifeInWeeks_profile");
  } catch (err) {
    console.error("Failed to clear profile:", err);
  }
};

/**
 * Save week annotations to localStorage
 * @param {array} annotations - Array of { weekNumber, label, color }
 */
export const saveAnnotations = (annotations) => {
  try {
    localStorage.setItem(
      "lifeInWeeks_annotations",
      JSON.stringify(annotations),
    );
  } catch (err) {
    console.error("Failed to save annotations:", err);
  }
};

/**
 * Load week annotations from localStorage
 * @returns {array | []} - Array of annotations or empty array if not found
 */
export const loadAnnotations = () => {
  try {
    const data = localStorage.getItem("lifeInWeeks_annotations");
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error("Failed to load annotations:", err);
    return [];
  }
};

/**
 * Clear all annotations from localStorage
 */
export const clearAnnotations = () => {
  try {
    localStorage.removeItem("lifeInWeeks_annotations");
  } catch (err) {
    console.error("Failed to clear annotations:", err);
  }
};

/**
 * Export all user data as JSON file
 * @param {object} profile - User profile data
 * @param {array} annotations - Week annotations
 * @returns {string} - JSON string of all data
 */
export const exportData = (profile, annotations) => {
  return JSON.stringify(
    {
      exportedAt: new Date().toISOString(),
      profile,
      annotations,
    },
    null,
    2,
  );
};

/**
 * Import user data from JSON
 * @param {string} jsonString - JSON string containing profile and annotations
 * @returns {object | null} - { profile, annotations } or null if invalid
 */
export const importData = (jsonString) => {
  try {
    const data = JSON.parse(jsonString);
    if (data.profile && Array.isArray(data.annotations)) {
      return { profile: data.profile, annotations: data.annotations };
    }
    return null;
  } catch (err) {
    console.error("Failed to import data:", err);
    return null;
  }
};

/**
 * Save goal blocks to localStorage
 * @param {array} goalBlocks - Array of { startWeek, endWeek, label, color }
 */
export const saveGoalBlocks = (goalBlocks) => {
  try {
    localStorage.setItem("lifeInWeeks_goalBlocks", JSON.stringify(goalBlocks));
  } catch (err) {
    console.error("Failed to save goal blocks:", err);
  }
};

/**
 * Load goal blocks from localStorage
 * @returns {array | []} - Array of goal blocks or empty array if not found
 */
export const loadGoalBlocks = () => {
  try {
    const data = localStorage.getItem("lifeInWeeks_goalBlocks");
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error("Failed to load goal blocks:", err);
    return [];
  }
};

/**
 * Clear goal blocks from localStorage
 */
export const clearGoalBlocks = () => {
  try {
    localStorage.removeItem("lifeInWeeks_goalBlocks");
  } catch (err) {
    console.error("Failed to clear goal blocks:", err);
  }
};

/**
 * Save lifestyle factors to localStorage
 * @param {object} factors - { exercise, diet, smoking, alcohol, sleep, stress }
 */
export const saveLifestyleFactors = (factors) => {
  try {
    localStorage.setItem("lifeInWeeks_lifestyle", JSON.stringify(factors));
  } catch (err) {
    console.error("Failed to save lifestyle factors:", err);
  }
};

/**
 * Load lifestyle factors from localStorage
 * @returns {object | null} - Lifestyle factors or null if not found
 */
export const loadLifestyleFactors = () => {
  try {
    const data = localStorage.getItem("lifeInWeeks_lifestyle");
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.error("Failed to load lifestyle factors:", err);
    return null;
  }
};

/**
 * Export all data including goal blocks and lifestyle factors
 * @param {object} profile - User profile data
 * @param {array} annotations - Week annotations
 * @param {array} goalBlocks - Goal blocks
 * @param {object} lifestyle - Lifestyle factors
 * @returns {string} - JSON string of all data
 */
export const exportAllData = (profile, annotations, goalBlocks, lifestyle) => {
  return JSON.stringify(
    {
      exportedAt: new Date().toISOString(),
      version: "2.0",
      profile,
      annotations,
      goalBlocks,
      lifestyle,
    },
    null,
    2,
  );
};

/**
 * Import all data from JSON
 * @param {string} jsonString - JSON string containing all data
 * @returns {object | null} - { profile, annotations, goalBlocks, lifestyle } or null if invalid
 */
export const importAllData = (jsonString) => {
  try {
    const data = JSON.parse(jsonString);
    if (data.profile && Array.isArray(data.annotations)) {
      return {
        profile: data.profile,
        annotations: data.annotations,
        goalBlocks: Array.isArray(data.goalBlocks) ? data.goalBlocks : [],
        lifestyle: data.lifestyle || null,
      };
    }
    return null;
  } catch (err) {
    console.error("Failed to import data:", err);
    return null;
  }
};

// ==================== JOURNAL ENTRIES ====================

/**
 * Save journal entries to localStorage
 * @param {array} journals - Array of { weekNumber, entry, date }
 */
export const saveJournals = (journals) => {
  try {
    localStorage.setItem("lifeInWeeks_journals", JSON.stringify(journals));
  } catch (err) {
    console.error("Failed to save journals:", err);
  }
};

/**
 * Load journal entries from localStorage
 * @returns {array | []} - Array of journal entries or empty array
 */
export const loadJournals = () => {
  try {
    const data = localStorage.getItem("lifeInWeeks_journals");
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error("Failed to load journals:", err);
    return [];
  }
};

// ==================== CUSTOM TAGS ====================

/**
 * Save custom tags to localStorage
 * @param {array} tags - Array of { id, name, color }
 */
export const saveCustomTags = (tags) => {
  try {
    localStorage.setItem("lifeInWeeks_tags", JSON.stringify(tags));
  } catch (err) {
    console.error("Failed to save tags:", err);
  }
};

/**
 * Load custom tags from localStorage
 * @returns {array} - Array of custom tags or default tags
 */
export const loadCustomTags = () => {
  try {
    const data = localStorage.getItem("lifeInWeeks_tags");
    if (data) return JSON.parse(data);
    // Default tags
    return [
      { id: "career", name: "Career", color: "#10B981" },
      { id: "health", name: "Health", color: "#EF4444" },
      { id: "travel", name: "Travel", color: "#3B82F6" },
      { id: "family", name: "Family", color: "#EC4899" },
      { id: "education", name: "Education", color: "#8B5CF6" },
      { id: "personal", name: "Personal", color: "#F59E0B" },
    ];
  } catch (err) {
    console.error("Failed to load tags:", err);
    return [];
  }
};

// ==================== DARK MODE ====================

/**
 * Save dark mode preference
 * @param {boolean} enabled
 */
export const saveDarkMode = (enabled) => {
  try {
    localStorage.setItem("lifeInWeeks_darkMode", JSON.stringify(enabled));
  } catch (err) {
    console.error("Failed to save dark mode:", err);
  }
};

/**
 * Load dark mode preference
 * @returns {boolean}
 */
export const loadDarkMode = () => {
  try {
    const data = localStorage.getItem("lifeInWeeks_darkMode");
    return data ? JSON.parse(data) : false;
  } catch (err) {
    return false;
  }
};

// ==================== PIN LOCK ====================

/**
 * Save PIN hash to localStorage
 * @param {string} pinHash - Hashed PIN
 */
export const savePin = (pinHash) => {
  try {
    localStorage.setItem("lifeInWeeks_pin", pinHash);
  } catch (err) {
    console.error("Failed to save PIN:", err);
  }
};

/**
 * Load PIN hash from localStorage
 * @returns {string | null}
 */
export const loadPin = () => {
  try {
    return localStorage.getItem("lifeInWeeks_pin");
  } catch (err) {
    return null;
  }
};

/**
 * Remove PIN from localStorage
 */
export const removePin = () => {
  try {
    localStorage.removeItem("lifeInWeeks_pin");
  } catch (err) {
    console.error("Failed to remove PIN:", err);
  }
};

/**
 * Simple hash function for PIN
 * @param {string} pin
 * @returns {string}
 */
export const hashPin = (pin) => {
  let hash = 0;
  for (let i = 0; i < pin.length; i++) {
    const char = pin.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return hash.toString(16);
};

// ==================== LAST LOGIN ====================

/**
 * Save last login date
 */
export const saveLastLogin = () => {
  try {
    localStorage.setItem(
      "lifeInWeeks_lastLogin",
      JSON.stringify(new Date().toISOString()),
    );
  } catch (err) {
    console.error("Failed to save last login:", err);
  }
};

/**
 * Load last login date
 * @returns {string | null}
 */
export const loadLastLogin = () => {
  try {
    return localStorage.getItem("lifeInWeeks_lastLogin");
  } catch (err) {
    return null;
  }
};

// ==================== WEEK EMOJIS ====================

/**
 * Save week emojis to localStorage
 * @param {array} emojis - Array of { weekNumber, emoji }
 */
export const saveWeekEmojis = (emojis) => {
  try {
    localStorage.setItem("lifeInWeeks_emojis", JSON.stringify(emojis));
  } catch (err) {
    console.error("Failed to save emojis:", err);
  }
};

/**
 * Load week emojis from localStorage
 * @returns {array | []}
 */
export const loadWeekEmojis = () => {
  try {
    const data = localStorage.getItem("lifeInWeeks_emojis");
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error("Failed to load emojis:", err);
    return [];
  }
};

// ==================== VIEW PREFERENCE ====================

/**
 * Save view preference (life/decade/year)
 * @param {string} view
 */
export const saveViewPreference = (view) => {
  try {
    localStorage.setItem("lifeInWeeks_view", view);
  } catch (err) {
    console.error("Failed to save view preference:", err);
  }
};

/**
 * Load view preference
 * @returns {string}
 */
export const loadViewPreference = () => {
  try {
    return localStorage.getItem("lifeInWeeks_view") || "life";
  } catch (err) {
    return "life";
  }
};

// ==================== LOGGED WEEKS (for streaks) ====================

/**
 * Save logged weeks tracking
 * @param {array} loggedWeeks - Array of week numbers that have been logged/updated
 */
export const saveLoggedWeeks = (loggedWeeks) => {
  try {
    localStorage.setItem(
      "lifeInWeeks_loggedWeeks",
      JSON.stringify({
        weeks: loggedWeeks,
        updatedAt: new Date().toISOString(),
      }),
    );
  } catch (err) {
    console.error("Failed to save logged weeks:", err);
  }
};

/**
 * Load logged weeks tracking
 * @returns {object}
 */
export const loadLoggedWeeks = () => {
  try {
    const data = localStorage.getItem("lifeInWeeks_loggedWeeks");
    return data ? JSON.parse(data) : { weeks: [], updatedAt: null };
  } catch (err) {
    return { weeks: [], updatedAt: null };
  }
};

// ==================== ANNOTATION TAGS (linking annotations to custom tags) ====================

/**
 * Save annotation tags mapping
 * @param {array} annotationTags - Array of { weekNumber, tagIds }
 */
export const saveAnnotationTags = (annotationTags) => {
  try {
    localStorage.setItem(
      "lifeInWeeks_annotationTags",
      JSON.stringify(annotationTags),
    );
  } catch (err) {
    console.error("Failed to save annotation tags:", err);
  }
};

/**
 * Load annotation tags mapping
 * @returns {array}
 */
export const loadAnnotationTags = () => {
  try {
    const data = localStorage.getItem("lifeInWeeks_annotationTags");
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error("Failed to load annotation tags:", err);
    return [];
  }
};
