// taxUtils.js - Shared utility functions for tax calculations

// Fetch tax rate from settings or use default
const getTaxRate = () => {
  // In a real implementation, we would fetch from the backend settings API
  // For now, we'll return the consistent tax rate used throughout the app
  return 0.15; // 15% tax rate
};

// Calculate tax amount based on subtotal
export const calculateTax = (subtotal) => {
  const taxRate = getTaxRate();
  return subtotal * taxRate;
};

// Calculate total amount including tax
export const calculateTotalWithTax = (subtotal) => {
  const tax = calculateTax(subtotal);
  return subtotal + tax;
};

// Format tax rate for display (as percentage)
export const formatTaxRate = () => {
  return `${getTaxRate() * 100}%`;
};

// Calculate tax breakdown for display
export const calculateTaxBreakdown = (subtotal) => {
  const tax = calculateTax(subtotal);
  const total = calculateTotalWithTax(subtotal);

  return {
    subtotal: parseFloat(subtotal) || 0,
    tax: parseFloat(tax) || 0,
    total: parseFloat(total) || 0,
    taxRate: getTaxRate(),
    formattedTaxRate: formatTaxRate(),
  };
};
