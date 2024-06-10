/**
 * Get a date subtracted from the current date based on the specified number of days, months, and years.
 * @param {Object} options - Object containing the number of days, months, and years to subtract.
 * @param {number} options.days - Number of days to subtract.
 * @param {number} options.months - Number of months to subtract.
 * @param {number} options.years - Number of years to subtract.
 * @returns {Date} - Date object representing the subtracted date.
 */
export const getSubtractedDateFromCurrent = ({ days, months, years }) => {
  var date = new Date();
  if (days) date.setDate(date.getDate() - days);
  if (months) date.setMonth(date.getMonth() - months);
  if (years) date.setFullYear(date.getFullYear() - years);
  return date;
};
