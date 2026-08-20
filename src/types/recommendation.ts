import { PaymentApp, PaymentAppId } from './paymentApp';
import { PaymentRecord, RecommendationType } from './paymentRecord';

export interface RecommendationInput {
  amountPaise: number;
  rupayAccepted?: boolean;
}

export interface RecommendationResult {
  app: PaymentApp;
  appId: PaymentAppId;
  recommendationType: RecommendationType;
  reason: string;
  amountPaise: number;
  rupayAccepted?: boolean;
  weightsSnapshot?: Record<PaymentAppId, number>;
  probabilitiesSnapshot?: Record<PaymentAppId, number>;
}

export interface RecommendationStrategy {
  name: string;
  recommend(
    apps: PaymentApp[],
    history: PaymentRecord[],
    randomFn?: () => number
  ): { appId: PaymentAppId; weights: Record<PaymentAppId, number>; probabilities: Record<PaymentAppId, number> };
}
