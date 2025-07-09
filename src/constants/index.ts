/**
 * Application Constants
 * 
 * Centralized constants, enums, and configuration used throughout the CRM application.
 * This file provides a single source of truth for shared values, options, and settings.
 * 
 * Sections:
 * - API Configuration
 * - Client & Consultant Status Options
 * - Form Field Options
 * - Validation Rules
 * - UI Configuration
 * - Error Messages
 */

// ================================
// API CONFIGURATION
// ================================

export const API_CONFIG = {
  BASE_URL: process.env.NODE_ENV === 'production' 
    ? 'https://your-production-api.com' 
    : 'http://localhost:3000',
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  STALE_TIME: 5 * 60 * 1000, // 5 minutes
  CACHE_TIME: 10 * 60 * 1000, // 10 minutes
} as const;

// ================================
// STATUS OPTIONS
// ================================

/**
 * Client status values used in forms and database
 */
export const CLIENT_STATUS_OPTIONS = [
  'draft',
  'submitted', 
  'active',
  'inactive'
] as const;

/**
 * Consultant status values
 */
export const CONSULTANT_STATUS_OPTIONS = [
  'Active',
  'Inactive'
] as const;

// ================================
// FORM FIELD OPTIONS
// ================================

/**
 * Title options for personal information forms
 */
export const TITLE_OPTIONS = [
  'Mr.',
  'Mrs.',
  'Ms.',
  'Dr.',
  'Prof.'
] as const;

/**
 * Name suffix options
 */
export const SUFFIX_OPTIONS = [
  'Jr.',
  'Sr.',
  'II',
  'III',
  'IV',
  'V',
  'MD',
  'PhD'
] as const;

/**
 * Marital status options
 */
export const MARITAL_STATUS_OPTIONS = [
  'Single',
  'Married',
  'Divorced',
  'Widowed',
  'Separated'
] as const;

export const SEX_OPTIONS = [
  'Male',
  'Female',
  'Other',
  'Prefer not to say'
] as const;

export const EMPLOYMENT_STATUS_OPTIONS = [
  'Employed',
  'Self-employed',
  'Unemployed',
  'Retired',
  'Student',
  'Homemaker'
] as const;

export const EDUCATION_LEVEL_OPTIONS = [
  'High School',
  'Some College',
  'Associate Degree',
  'Bachelor\'s Degree',
  'Master\'s Degree',
  'Doctoral Degree',
  'Professional Degree'
] as const;

// Query Keys for React Query
export const QUERY_KEYS = {
  CLIENTS: ['clients'],
  CLIENT_BY_ID: (id: string) => ['clients', id],
  CONSULTANTS: ['consultants'],
  CONSULTANT_BY_ID: (id: string) => ['consultant', id],
  CONSULTANT_STATS: ['consultant-stats'],
  USERS: ['users'],
  DASHBOARD_STATS: ['dashboard-stats'],
} as const;

// Cache Times (in milliseconds)
export const CACHE_TIME = {
  SHORT: 2 * 60 * 1000,  // 2 minutes
  MEDIUM: 5 * 60 * 1000, // 5 minutes
  LONG: 30 * 60 * 1000,  // 30 minutes
} as const;

// Form Validation
export const VALIDATION_RULES = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
  SSN: /^\d{3}-?\d{2}-?\d{4}$/,
  ZIP_CODE: /^\d{5}(-\d{4})?$/,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  AUTHENTICATION_REQUIRED: 'Please log in to access this feature',
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  VALIDATION_ERROR: 'Please check your input and try again',
  GENERIC_ERROR: 'An unexpected error occurred. Please try again.',
  CONSULTANT_LOAD_ERROR: 'Failed to load consultants. Please try again.',
  CLIENT_CREATE_ERROR: 'Failed to create client. Please try again.',
  CLIENT_UPDATE_ERROR: 'Failed to update client. Please try again.',
  CLIENT_DELETE_ERROR: 'Failed to delete client. Please try again.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  CLIENT_CREATED: 'Client created successfully',
  CLIENT_UPDATED: 'Client updated successfully',
  CLIENT_DELETED: 'Client deleted successfully',
  CONSULTANT_CREATED: 'Consultant created successfully',
  CONSULTANT_UPDATED: 'Consultant updated successfully',
  LOGIN_SUCCESS: 'Welcome back!',
  LOGOUT_SUCCESS: 'Logged out successfully',
} as const;

// Route Paths
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  CLIENTS: '/securia/clients',
  CLIENT_DETAILS: (id: string) => `/securia/clients/${id}`,
  CLIENT_EDIT: (id: string) => `/securia/clients/${id}/edit`,
  NEW_CLIENT: '/securia/clients/new',
  CONSULTANTS: '/securia/consultants',
  CONSULTANT_DETAILS: (id: string) => `/securia/consultants/${id}`,
  CONSULTANT_EDIT: (id: string) => `/securia/consultants/edit/${id}`,
  NEW_CONSULTANT: '/securia/consultants/new',
} as const;

export type ClientStatus = typeof CLIENT_STATUS_OPTIONS[number];
export type ConsultantStatus = typeof CONSULTANT_STATUS_OPTIONS[number];
export type Title = typeof TITLE_OPTIONS[number];
export type Suffix = typeof SUFFIX_OPTIONS[number];
export type MaritalStatus = typeof MARITAL_STATUS_OPTIONS[number];
export type Sex = typeof SEX_OPTIONS[number];
export type EmploymentStatus = typeof EMPLOYMENT_STATUS_OPTIONS[number];
export type EducationLevel = typeof EDUCATION_LEVEL_OPTIONS[number];
