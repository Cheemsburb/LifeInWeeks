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
