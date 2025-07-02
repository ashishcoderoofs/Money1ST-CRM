import { z } from "zod";

// Common field schemas that can be reused across forms
export const commonFieldSchemas = {
  // Basic identity fields
  email: z.string().email("Invalid email address"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  middleInitial: z.string().optional(),
  
  // Contact fields
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  
  // Common date fields
  dateField: z.string().optional(),
  requiredDate: z.string().min(1, "Date is required"),
  
  // Common number fields
  currency: z.coerce.number().optional().nullable(),
  percentage: z.coerce.number().min(0).max(100).optional(),
  
  // Common enums
  status: z.enum(['Active', 'Inactive']).default('Active'),
  maritalStatus: z.enum(['Single', 'Married', 'Divorced', 'Widowed', 'Separated']).optional(),
  sex: z.enum(['Male', 'Female', 'Other']).optional(),
  educationLevel: z.enum(['High School', 'Associate Degree', 'Bachelor Degree', 'Master Degree', 'Doctorate', 'Other']).optional(),
  employmentStatus: z.enum(['Employed', 'Unemployed', 'Self-Employed', 'Retired', 'Student']).optional(),
  
  // Title options
  title: z.enum(['Mr.', 'Mrs.', 'Ms.', 'Miss', 'Dr.', 'Prof.', 'Rev.']).optional(),
  
  // Position options (specific to consultants)
  consultantPosition: z.enum(['Admin', 'Field Builder', 'Field Trainer', 'Senior BMA', 'BMA', 'IBA']).optional(),
};

// Utility functions for form validation
export const validationUtils = {
  isValidSSN: (ssn: string) => /^\d{3}-\d{2}-\d{4}$/.test(ssn),
  isValidEIN: (ein: string) => /^\d{2}-\d{7}$/.test(ein),
  isValidPhone: (phone: string) => /^\+?[\d\s\-\(\)]+$/.test(phone),
  
  // Date utilities
  formatDateForInput: (date: any): string => {
    if (!date) return "";
    if (typeof date === 'string') return date;
    if (date instanceof Date) return date.toISOString().split('T')[0];
    return "";
  },
  
  // Number formatting
  formatCurrency: (amount: number | null | undefined): string => {
    if (!amount) return "$0.00";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  },
  
  formatPercentage: (value: number | null | undefined): string => {
    if (!value) return "0%";
    return `${value}%`;
  }
};

// Common validation messages
export const validationMessages = {
  required: (field: string) => `${field} is required`,
  email: "Please enter a valid email address",
  phone: "Please enter a valid phone number",
  ssn: "Please enter a valid SSN (XXX-XX-XXXX)",
  ein: "Please enter a valid EIN (XX-XXXXXXX)",
  positiveNumber: "Please enter a positive number",
  percentage: "Please enter a percentage between 0 and 100",
  minLength: (field: string, min: number) => `${field} must be at least ${min} characters`,
  maxLength: (field: string, max: number) => `${field} must not exceed ${max} characters`,
};
