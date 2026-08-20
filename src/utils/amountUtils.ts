/**
 * Utility functions for precise currency and paise calculations.
 * Avoids JavaScript floating-point errors by parsing strings directly into integer paise.
 */

export interface AmountValidationResult {
  isValid: boolean;
  amountPaise: number;
  errorMessage?: string;
}

/**
 * Validates and converts user input string to integer paise.
 * Accepts formats: "50", "50.5", "50.50", "0.50", "125"
 * Rejects: "", "0", "-10", "abc", "50.123", "50."
 */
export function parseRupeesToPaise(input: string | number): AmountValidationResult {
  if (typeof input === 'number') {
    if (isNaN(input) || !isFinite(input) || input <= 0) {
      return { isValid: false, amountPaise: 0, errorMessage: 'Amount must be greater than ₹0.' };
    }
    input = input.toString();
  }

  const trimmed = input.trim();
  if (!trimmed) {
    return { isValid: false, amountPaise: 0, errorMessage: 'Please enter a valid amount.' };
  }

  // Check for negative numbers
  if (trimmed.startsWith('-')) {
    return { isValid: false, amountPaise: 0, errorMessage: 'Amount must be greater than ₹0.' };
  }

  // Validate decimal pattern: optional decimal point with up to 2 digits
  // Allows 100, 100.5, 100.50
  const validPattern = /^\d+(\.\d{1,2})?$/;
  if (!validPattern.test(trimmed)) {
    if (/^\d+\.\d{3,}$/.test(trimmed)) {
      return {
        isValid: false,
        amountPaise: 0,
        errorMessage: 'Please enter an amount with up to two decimal places.',
      };
    }
    return { isValid: false, amountPaise: 0, errorMessage: 'Please enter a valid amount.' };
  }

  const parts = trimmed.split('.');
  const wholePart = parseInt(parts[0], 10);
  const decimalPart = parts[1] || '';

  if (isNaN(wholePart)) {
    return { isValid: false, amountPaise: 0, errorMessage: 'Please enter a valid amount.' };
  }

  const paddedDecimal = (decimalPart + '00').slice(0, 2);
  const centsPart = parseInt(paddedDecimal, 10);

  const totalPaise = wholePart * 100 + centsPart;

  if (totalPaise <= 0) {
    return { isValid: false, amountPaise: 0, errorMessage: 'Amount must be greater than ₹0.' };
  }

  return {
    isValid: true,
    amountPaise: totalPaise,
  };
}

/**
 * Formats an amount in paise to Indian Rupee display format (e.g. ₹1,250.00 or ₹50)
 */
export function formatPaiseToRupees(paise: number, includeDecimals = true): string {
  if (isNaN(paise) || paise === null || paise === undefined) return '₹0';
  const rupees = paise / 100;
  
  if (!includeDecimals && Number.isInteger(rupees)) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(rupees);
  }

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(rupees);
}

/**
 * Simple formatted rupee display without currency symbol (e.g. "125.00")
 */
export function formatPaiseValue(paise: number): string {
  if (isNaN(paise)) return '0.00';
  return (paise / 100).toFixed(2);
}
