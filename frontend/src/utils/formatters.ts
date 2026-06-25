/**
 * Formatting utilities for BuildFlow ERP
 */

// Format numbers as currency (Rupees)
export const formatCurrency = (value: number | undefined | null): string => {
  if (value === undefined || value === null) return 'Rs 0';
  
  // Using en-IN for Indian/Pakistani numbering system (lakhs/crores)
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value).replace('₹', 'Rs '); 
};

// Format numbers with commas (lakhs/crores system)
export const formatNumber = (value: number | undefined | null): string => {
  if (value === undefined || value === null) return '0';
  return new Intl.NumberFormat('en-IN').format(value);
};
