import { ALL_PAYMENT_APPS } from './recommendationService';
import { AppUsageStats, DashboardPeriod, DashboardSummary, PaymentRecord } from '../types/paymentRecord';
import { filterRecordsByPeriod } from '../utils/dateUtils';
import { PaymentAppId } from '../types/paymentApp';

/**
 * Derives comprehensive statistics from payment records dynamically.
 * All aggregations are derived on-the-fly from stored records to prevent data inconsistency.
 */
export class DashboardService {
  /**
   * Filters records for the given time period
   */
  public getPaymentsForPeriod(
    records: PaymentRecord[],
    period: DashboardPeriod,
    refTime = Date.now()
  ): PaymentRecord[] {
    return filterRecordsByPeriod(records, period, refTime);
  }

  /**
   * Calculates total payment count
   */
  public getTotalPaymentCount(records: PaymentRecord[]): number {
    return records.length;
  }

  /**
   * Calculates total amount in paise
   */
  public getTotalPaymentAmount(records: PaymentRecord[]): number {
    return records.reduce((sum, r) => sum + r.amountPaise, 0);
  }

  /**
   * Calculates average payment amount in paise
   */
  public getAveragePaymentAmount(records: PaymentRecord[]): number {
    if (records.length === 0) return 0;
    return Math.round(this.getTotalPaymentAmount(records) / records.length);
  }

  /**
   * Calculates per-app usage counts
   */
  public getAppUsageCount(records: PaymentRecord[], appId: PaymentAppId): number {
    return records.filter((r) => r.appId === appId).length;
  }

  /**
   * Calculates per-app usage total amount in paise
   */
  public getAppUsageAmount(records: PaymentRecord[], appId: PaymentAppId): number {
    return records
      .filter((r) => r.appId === appId)
      .reduce((sum, r) => sum + r.amountPaise, 0);
  }

  /**
   * Calculates usage percentage (0 to 100)
   */
  public getUsagePercentage(records: PaymentRecord[], appId: PaymentAppId): number {
    if (records.length === 0) return 0;
    const count = this.getAppUsageCount(records, appId);
    return Math.round((count / records.length) * 100);
  }

  /**
   * Computes full dashboard summary for a set of records
   */
  public computeSummary(records: PaymentRecord[]): DashboardSummary {
    const totalCount = this.getTotalPaymentCount(records);
    const totalAmountPaise = this.getTotalPaymentAmount(records);
    const averageAmountPaise = this.getAveragePaymentAmount(records);

    const appStats: AppUsageStats[] = ALL_PAYMENT_APPS.map((app) => {
      const count = this.getAppUsageCount(records, app.id);
      const appTotalPaise = this.getAppUsageAmount(records, app.id);
      const appAvgPaise = count > 0 ? Math.round(appTotalPaise / count) : 0;
      const percentage = totalCount > 0 ? (count / totalCount) * 100 : 0;

      return {
        appId: app.id,
        appName: app.name,
        count,
        totalAmountPaise: appTotalPaise,
        averageAmountPaise: appAvgPaise,
        percentageOfTotal: percentage,
      };
    });

    return {
      totalCount,
      totalAmountPaise,
      averageAmountPaise,
      appStats,
    };
  }
}

export const dashboardService = new DashboardService();
