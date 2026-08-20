import { DashboardPeriod, PaymentRecord } from '../types/paymentRecord';

/**
 * Returns the start of today in milliseconds (00:00:00.000 local time)
 */
export function getStartOfToday(): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now.getTime();
}

/**
 * Filter payment records by selected period (today, 7days, 30days, all)
 */
export function filterRecordsByPeriod(
  records: PaymentRecord[],
  period: DashboardPeriod,
  referenceTimestamp = Date.now()
): PaymentRecord[] {
  if (period === 'all') return records;

  const refDate = new Date(referenceTimestamp);
  
  if (period === 'today') {
    const startOfToday = new Date(refDate);
    startOfToday.setHours(0, 0, 0, 0);
    const startTimestamp = startOfToday.getTime();
    return records.filter((r) => r.timestamp >= startTimestamp);
  }

  if (period === '7days') {
    const sevenDaysAgo = referenceTimestamp - 7 * 24 * 60 * 60 * 1000;
    return records.filter((r) => r.timestamp >= sevenDaysAgo);
  }

  if (period === '30days') {
    const thirtyDaysAgo = referenceTimestamp - 30 * 24 * 60 * 60 * 1000;
    return records.filter((r) => r.timestamp >= thirtyDaysAgo);
  }

  return records;
}

/**
 * Formats a timestamp into human-readable relative or exact format
 */
export function formatPaymentTime(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMinutes = Math.floor((now.getTime() - timestamp) / (60 * 1000));

  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  if (isToday) {
    return `Today, ${timeString}`;
  }

  return date.toLocaleDateString([], {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
