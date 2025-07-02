/**
 * Date utility functions for consistent date handling across the application
 */

// Common date format for display
export const DATE_FORMATS = {
  INPUT: 'YYYY-MM-DD',           // For HTML date inputs
  DISPLAY: 'MM/DD/YYYY',        // For display to users
  ISO: 'YYYY-MM-DDTHH:mm:ss.sssZ', // For API/database
  SHORT: 'MM/DD/YY',            // Short display format
} as const;

/**
 * Convert various date formats to string for form inputs
 */
export function formatDateForInput(date: any): string {
  if (!date) return "";
  if (typeof date === 'string') {
    // If it's already a string, assume it's in the correct format
    if (date.includes('T')) {
      // ISO string, extract date part
      return date.split('T')[0];
    }
    return date;
  }
  if (date instanceof Date) {
    return date.toISOString().split('T')[0];
  }
  // Try to parse as Date
  const parsed = new Date(date);
  if (!isNaN(parsed.getTime())) {
    return parsed.toISOString().split('T')[0];
  }
  return "";
}

/**
 * Format date for display to users
 */
export function formatDateForDisplay(date: any): string {
  if (!date) return "";
  const parsed = parseDate(date);
  if (!parsed) return "";
  
  return parsed.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
}

/**
 * Parse various date formats into Date object
 */
export function parseDate(date: any): Date | null {
  if (!date) return null;
  if (date instanceof Date) return date;
  
  const parsed = new Date(date);
  if (isNaN(parsed.getTime())) return null;
  
  return parsed;
}

/**
 * Check if a date is valid
 */
export function isValidDate(date: any): boolean {
  return parseDate(date) !== null;
}

/**
 * Get current date in input format
 */
export function getCurrentDateForInput(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Calculate age from birth date
 */
export function calculateAge(birthDate: any): number {
  const birth = parseDate(birthDate);
  if (!birth) return 0;
  
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
}

/**
 * Get date range (e.g., for filtering)
 */
export function getDateRange(days: number): { start: string; end: string } {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - days);
  
  return {
    start: formatDateForInput(start),
    end: formatDateForInput(end)
  };
}

/**
 * Check if date is in the past
 */
export function isDateInPast(date: any): boolean {
  const parsed = parseDate(date);
  if (!parsed) return false;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  parsed.setHours(0, 0, 0, 0);
  
  return parsed < today;
}

/**
 * Check if date is in the future
 */
export function isDateInFuture(date: any): boolean {
  const parsed = parseDate(date);
  if (!parsed) return false;
  
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  
  return parsed > today;
}
