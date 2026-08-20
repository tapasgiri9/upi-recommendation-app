import { PaymentAppId } from './paymentApp';

export type RecommendationType = 'bhim_lite' | 'kiwi' | 'balanced';

export interface PaymentRecord {
  id: string;
  appId: PaymentAppId;
  amountPaise: number;
  timestamp: number;
  recommendationType: RecommendationType;
  rupayAccepted?: boolean;
}

export type DashboardPeriod = 'today' | '7days' | '30days' | 'all';

export interface AppUsageStats {
  appId: PaymentAppId;
  appName: string;
  count: number;
  totalAmountPaise: number;
  averageAmountPaise: number;
  percentageOfTotal: number;
}

export interface DashboardSummary {
  totalCount: number;
  totalAmountPaise: number;
  averageAmountPaise: number;
  appStats: AppUsageStats[];
}
