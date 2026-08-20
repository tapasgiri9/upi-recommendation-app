import { PaymentRecord } from '../types/paymentRecord';
import { STORAGE_KEYS } from '../storage/storageKeys';

/**
 * Storage service providing safe, resilient persistence for payment records.
 * Supports web localStorage and seamlessly bridges to React Native AsyncStorage patterns.
 */
class UsageStorageService {
  private memoryCache: PaymentRecord[] | null = null;
  private listeners: Set<() => void> = new Set();

  /**
   * Subscribe to payment history changes
   */
  public subscribe(callback: () => void): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  private notify() {
    this.listeners.forEach((cb) => {
      try {
        cb();
      } catch (err) {
        console.error('Error in storage listener', err);
      }
    });
  }

  /**
   * Retrieves all payment history from persistent storage
   */
  public async getPaymentHistory(): Promise<PaymentRecord[]> {
    if (this.memoryCache !== null) {
      return [...this.memoryCache];
    }

    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const raw = window.localStorage.getItem(STORAGE_KEYS.PAYMENT_HISTORY);
        if (!raw) {
          this.memoryCache = [];
          return [];
        }

        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          // Validate record shape
          const validated = parsed.filter(
            (item): item is PaymentRecord =>
              item &&
              typeof item.id === 'string' &&
              typeof item.appId === 'string' &&
              typeof item.amountPaise === 'number' &&
              typeof item.timestamp === 'number' &&
              typeof item.recommendationType === 'string'
          );
          this.memoryCache = validated;
          return [...validated];
        }
      }
    } catch (err) {
      console.error('Failed to parse stored payment history. Recovering with empty state.', err);
    }

    this.memoryCache = [];
    return [];
  }

  /**
   * Appends a new payment recommendation record to history
   */
  public async addPaymentRecord(record: PaymentRecord): Promise<void> {
    const current = await this.getPaymentHistory();
    const updated = [record, ...current];
    this.memoryCache = updated;

    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(STORAGE_KEYS.PAYMENT_HISTORY, JSON.stringify(updated));
      }
    } catch (err) {
      console.error('Unable to save payment history to storage', err);
    }

    this.notify();
  }

  /**
   * Clears all stored payment history
   */
  public async clearPaymentHistory(): Promise<void> {
    this.memoryCache = [];
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(STORAGE_KEYS.PAYMENT_HISTORY);
      }
    } catch (err) {
      console.error('Failed to clear payment history', err);
    }
    this.notify();
  }

  /**
   * Overwrites history with supplied records (for restore/seeding)
   */
  public async setPaymentHistory(records: PaymentRecord[]): Promise<void> {
    this.memoryCache = [...records];
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(STORAGE_KEYS.PAYMENT_HISTORY, JSON.stringify(records));
      }
    } catch (err) {
      console.error('Failed to set payment history', err);
    }
    this.notify();
  }

  /**
   * Seeds demo/sample records across multiple days to easily verify dashboard filters and distribution
   */
  public async seedSampleHistory(): Promise<void> {
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    const oneHour = 60 * 60 * 1000;

    const sampleRecords: PaymentRecord[] = [
      // Today
      {
        id: 'sample-1',
        appId: 'bhim_lite',
        amountPaise: 3500, // ₹35.00
        timestamp: now - 30 * 60 * 1000,
        recommendationType: 'bhim_lite',
      },
      {
        id: 'sample-2',
        appId: 'navi',
        amountPaise: 7500, // ₹75.00
        timestamp: now - 2 * oneHour,
        recommendationType: 'balanced',
      },
      {
        id: 'sample-3',
        appId: 'kiwi',
        amountPaise: 25000, // ₹250.00
        timestamp: now - 5 * oneHour,
        recommendationType: 'kiwi',
        rupayAccepted: true,
      },
      // 2-3 Days ago (7 days window)
      {
        id: 'sample-4',
        appId: 'super_money',
        amountPaise: 8000, // ₹80.00
        timestamp: now - 2 * oneDay,
        recommendationType: 'balanced',
      },
      {
        id: 'sample-5',
        appId: 'paytm',
        amountPaise: 12000, // ₹120.00
        timestamp: now - 3 * oneDay,
        recommendationType: 'balanced',
        rupayAccepted: false,
      },
      {
        id: 'sample-6',
        appId: 'bhim',
        amountPaise: 6500, // ₹65.00
        timestamp: now - 4 * oneDay,
        recommendationType: 'balanced',
      },
      {
        id: 'sample-7',
        appId: 'kiwi',
        amountPaise: 15000, // ₹150.00
        timestamp: now - 5 * oneDay,
        recommendationType: 'kiwi',
        rupayAccepted: true,
      },
      // 10-25 Days ago (30 days window)
      {
        id: 'sample-8',
        appId: 'navi',
        amountPaise: 9000,
        timestamp: now - 12 * oneDay,
        recommendationType: 'balanced',
      },
      {
        id: 'sample-9',
        appId: 'super_money',
        amountPaise: 18000,
        timestamp: now - 18 * oneDay,
        recommendationType: 'balanced',
        rupayAccepted: false,
      },
      {
        id: 'sample-10',
        appId: 'bhim_lite',
        amountPaise: 2000,
        timestamp: now - 22 * oneDay,
        recommendationType: 'bhim_lite',
      },
    ];

    await this.setPaymentHistory(sampleRecords);
  }
}

export const usageStorageService = new UsageStorageService();
