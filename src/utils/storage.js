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
