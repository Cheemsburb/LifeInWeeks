/**
 * Calculate the number of weeks lived from birthdate to today
 * @param {string | Date} birthdate - ISO date string or Date object
 * @returns {number} - Number of weeks lived
 */
export const calculateWeeksLived = (birthdate) => {
  const bd = new Date(birthdate);
  const today = new Date();
  const diffMs = today - bd;
  const weeks = Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000));
  return Math.max(0, weeks);
};

/**
 * Calculate total weeks in a lifetime
 * @param {number} lifeExpectancyYears - Expected lifespan in years
 * @returns {number} - Total weeks in lifetime
 */
export const calculateTotalWeeks = (lifeExpectancyYears) => {
  return Math.floor(lifeExpectancyYears * 52);
};

/**
 * Calculate remaining weeks
 * @param {string | Date} birthdate - ISO date string or Date object
 * @param {number} lifeExpectancyYears - Expected lifespan in years
 * @returns {number} - Weeks remaining
 */
export const calculateWeeksRemaining = (birthdate, lifeExpectancyYears) => {
  const weeksLived = calculateWeeksLived(birthdate);
  const totalWeeks = calculateTotalWeeks(lifeExpectancyYears);
  return Math.max(0, totalWeeks - weeksLived);
};

/**
 * Calculate current age in years
 * @param {string | Date} birthdate - ISO date string or Date object
 * @returns {number} - Age in years (rounded down)
 */
export const calculateAge = (birthdate) => {
  const bd = new Date(birthdate);
  const today = new Date();
  let age = today.getFullYear() - bd.getFullYear();
  const monthDiff = today.getMonth() - bd.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < bd.getDate())) {
    age--;
  }
  return Math.max(0, age);
};

/**
 * Calculate years remaining
 * @param {number} lifeExpectancyYears - Expected lifespan in years
 * @param {number} currentAge - Current age in years
 * @returns {number} - Years remaining (rounded)
 */
export const calculateYearsRemaining = (lifeExpectancyYears, currentAge) => {
  return Math.max(0, lifeExpectancyYears - currentAge);
};

/**
 * Calculate percentage of life lived
 * @param {number} weeksLived - Weeks lived
 * @param {number} totalWeeks - Total weeks in lifetime
 * @returns {number} - Percentage (0-100)
 */
export const calculatePercentageLived = (weeksLived, totalWeeks) => {
  if (totalWeeks === 0) return 0;
  return Math.round((weeksLived / totalWeeks) * 100);
};

/**
 * Calculate time breakdown of remaining weeks
 * @param {number} weeksRemaining - Weeks remaining
 * @returns {object} - Hours, days, months, and years remaining
 */
export const calculateTimeBreakdown = (weeksRemaining) => {
  const hoursRemaining = weeksRemaining * 7 * 24;
  const daysRemaining = weeksRemaining * 7;
  const monthsRemaining = Math.floor(weeksRemaining / 4.33);
  const yearsRemaining = Math.floor(weeksRemaining / 52);

  return {
    hours: Math.floor(hoursRemaining),
    days: Math.floor(daysRemaining),
    months: Math.floor(monthsRemaining),
    years: Math.floor(yearsRemaining),
  };
};

/**
 * Identify milestone weeks
 * Key milestones: 50% of life, round decades (80, 90, etc)
 * @param {number} totalWeeks - Total weeks in lifetime
 * @param {number} lifeExpectancyYears - Expected lifespan
 * @returns {array} - Array of milestone week numbers
 */
export const calculateMilestoneWeeks = (totalWeeks, lifeExpectancyYears) => {
  const milestones = [];

  // 50% of life milestone
  milestones.push(Math.floor(totalWeeks / 2));

  // Round decade ages: 80, 90, 100 (if applicable)
  const weeksPerYear = 52;
  for (let age = 80; age <= lifeExpectancyYears; age += 10) {
    milestones.push(age * weeksPerYear);
  }

  return milestones.filter((w) => w > 0 && w < totalWeeks);
};

/**
 * Calculate activity breakdown - converting weeks into tangible activities
 * @param {number} weeksRemaining - Weeks remaining
 * @returns {object} - Various activity equivalents
 */
export const calculateActivityBreakdown = (weeksRemaining) => {
  // Average estimates for various activities
  const booksPerYear = 12; // Average reader
  const moviesPerYear = 52; // One per week
  const vacationsPerYear = 2; // Two week-long vacations
  const daysPerWeek = 7;
  const hoursPerDay = 24;

  const yearsRemaining = weeksRemaining / 52;

  return {
    books: Math.floor(yearsRemaining * booksPerYear),
    movies: Math.floor(yearsRemaining * moviesPerYear),
    vacations: Math.floor(yearsRemaining * vacationsPerYear),
    days: Math.floor(weeksRemaining * daysPerWeek),
    hours: Math.floor(weeksRemaining * daysPerWeek * hoursPerDay),
    weekends: Math.floor(weeksRemaining), // Each week has one weekend
    sleepWeeks: Math.floor(weeksRemaining * 0.33), // Assuming 8 hours sleep = 1/3 of time
  };
};

/**
 * Validate birthdate input
 * @param {string} birthdate - ISO date string
 * @returns {object} - { isValid: boolean, error?: string }
 */
export const validateBirthdate = (birthdate) => {
  if (!birthdate) {
    return { isValid: false, error: "Please select a birthdate" };
  }

  const bd = new Date(birthdate);
  const today = new Date();

  if (isNaN(bd.getTime())) {
    return { isValid: false, error: "Invalid date format" };
  }

  if (bd > today) {
    return { isValid: false, error: "Birthdate cannot be in the future" };
  }

  // Warn if older than 120 (beyond reasonable life expectancy data)
  const age = calculateAge(birthdate);
  if (age > 120) {
    return {
      isValid: false,
      error: "Age exceeds reasonable life expectancy range",
    };
  }

  return { isValid: true };
};
