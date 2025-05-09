
/**
 * Formats minutes from midnight to HH:MM AM/PM format
 * @param minutes Minutes from midnight (0-1439)
 * @returns Formatted time string
 */
export const formatMinutesToTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  
  return `${displayHours}:${mins.toString().padStart(2, '0')} ${period}`;
};

/**
 * Converts time string (HH:MM) to minutes from midnight
 * @param timeStr Time string in HH:MM format (24-hour)
 * @returns Minutes from midnight
 */
export const timeToMinutes = (timeStr: string): number => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

/**
 * Gets current time in minutes from midnight
 */
export const getCurrentTimeInMinutes = (): number => {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
};

/**
 * Format duration in minutes to human readable string
 * @param minutes Duration in minutes
 * @returns Formatted duration string (e.g., "1h 30m")
 */
export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (mins === 0) {
    return `${hours}h`;
  }
  
  return `${hours}h ${mins}m`;
};

/**
 * Format day of week (0-6) to string
 * @param dayOfWeek Day of week (0 = Sunday, 6 = Saturday)
 * @returns Day name string
 */
export const formatDayOfWeek = (dayOfWeek: number): string => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[dayOfWeek] || '';
};
