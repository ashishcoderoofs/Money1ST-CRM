/**
 * Security utilities for input sanitization and validation
 */

// Sanitize string inputs to prevent XSS
export function sanitizeString(input: string): string {
  if (!input || typeof input !== 'string') return '';
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential script tags
    .slice(0, 1000); // Limit length
}

// Sanitize email addresses
export function sanitizeEmail(email: string): string {
  if (!email || typeof email !== 'string') return '';
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const sanitized = sanitizeString(email).toLowerCase();
  
  return emailRegex.test(sanitized) ? sanitized : '';
}

// Sanitize phone numbers
export function sanitizePhone(phone: string): string {
  if (!phone || typeof phone !== 'string') return '';
  
  // Keep only digits, spaces, dashes, parentheses, and plus
  return phone.replace(/[^0-9\s\-\(\)\+]/g, '').slice(0, 20);
}

// Validate and sanitize numeric inputs
export function sanitizeNumeric(value: string | number): number {
  if (typeof value === 'number') return isNaN(value) ? 0 : value;
  if (typeof value !== 'string') return 0;
  
  const parsed = parseFloat(value.replace(/[^0-9.-]/g, ''));
  return isNaN(parsed) ? 0 : parsed;
}

// Rate limiting helper (simple client-side implementation)
const requestCounts = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(key: string, maxRequests: number = 10, windowMs: number = 60000): boolean {
  const now = Date.now();
  const record = requestCounts.get(key);
  
  if (!record || now > record.resetTime) {
    requestCounts.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (record.count >= maxRequests) {
    return false;
  }
  
  record.count++;
  return true;
}
