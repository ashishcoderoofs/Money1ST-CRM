/**
 * Utility functions for mortgage calculations
 */

export const calculateMonthlyPayment = (principal: number, rate: number, term: number): number => {
  if (!principal || !rate || !term) return 0;
  const monthlyRate = rate / 100 / 12;
  const numPayments = term * 12;
  return principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
};

export const calculateLTV = (loanAmount: number, propertyValue: number): number => {
  if (!propertyValue) return 0;
  return (loanAmount / propertyValue) * 100;
};

export const calculatePercentageAmount = (principal: number, percentage: number): number => {
  return (principal * percentage) / 100;
};

export const calculateLoanVolume = (firstLoanAmount: number, secondLoanAmount: number): number => {
  return (firstLoanAmount || 0) + (secondLoanAmount || 0);
};

export const calculateCashToBorrower = (loanVolume: number, existingBalance: number): number => {
  return (loanVolume || 0) - (existingBalance || 0);
};
