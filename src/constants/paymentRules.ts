export const PAYMENT_THRESHOLDS = {
  BHIM_LITE_MAX_PAISE: 5000, // ₹50.00
  KIWI_MIN_PAISE: 10000,      // ₹100.00
} as const;

export const RECOMMENDATION_REASONS = {
  BHIM_LITE: 'Amount is ₹50 or below.',
  KIWI: 'RuPay is accepted and the amount is ₹100 or more.',
  BALANCED: 'Recommended based on your app usage.',
} as const;

export const ELIGIBLE_BALANCED_APP_IDS = [
  'navi',
  'super_money',
  'paytm',
  'bhim',
] as const;
