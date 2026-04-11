/**
 * Calculates the end date based on a start date and duration in days.
 * @param startDate - The start date in YYYY-MM-DD format.
 * @param durationDays - Number of days to add.
 * @returns The end date in YYYY-MM-DD format.
 */
export const calculateEndDate = (startDate: string, durationDays: number | string): string => {
  if (!startDate || !durationDays) return "";
  
  const days = typeof durationDays === 'string' ? parseInt(durationDays) : durationDays;
  if (isNaN(days)) return "";

  try {
    const start = new Date(startDate);
    if (isNaN(start.getTime())) return "";
    
    const end = new Date(start);
    end.setDate(start.getDate() + days);
    
    // Format back to YYYY-MM-DD
    const yyyy = end.getFullYear();
    const mm = String(end.getMonth() + 1).padStart(2, '0');
    const dd = String(end.getDate()).padStart(2, '0');
    
    return `${yyyy}-${mm}-${dd}`;
  } catch (error) {
    console.error("Error calculating end date:", error);
    return "";
  }
};
