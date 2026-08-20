import paymentAppsConfig from '../config/paymentApps.json';
import {
  ELIGIBLE_BALANCED_APP_IDS,
  PAYMENT_THRESHOLDS,
  RECOMMENDATION_REASONS,
} from '../constants/paymentRules';
import { PaymentApp, PaymentAppId } from '../types/paymentApp';
import { PaymentRecord, RecommendationType } from '../types/paymentRecord';
import {
  RecommendationInput,
  RecommendationResult,
  RecommendationStrategy,
} from '../types/recommendation';
import { usageStorageService } from './usageStorageService';

export const ALL_PAYMENT_APPS: PaymentApp[] = (paymentAppsConfig.apps as PaymentApp[]);

export const PAYMENT_APPS_MAP: Record<PaymentAppId, PaymentApp> = ALL_PAYMENT_APPS.reduce(
  (acc, app) => {
    acc[app.id] = app;
    return acc;
  },
  {} as Record<PaymentAppId, PaymentApp>
);

/**
 * Balanced Usage Strategy:
 * Assigns weight = 1 / (usageCount + 1) for each eligible app from complete local history.
 * Normalizes into probabilities and uses weighted random selection.
 */
export class BalancedUsageStrategy implements RecommendationStrategy {
  public readonly name = 'BalancedUsageStrategy';

  public recommend(
    apps: PaymentApp[],
    history: PaymentRecord[],
    randomFn: () => number = Math.random
  ): {
    appId: PaymentAppId;
    weights: Record<PaymentAppId, number>;
    probabilities: Record<PaymentAppId, number>;
  } {
    if (!apps.length) {
      throw new Error('No eligible apps provided for recommendation');
    }

    // 1. Calculate usage counts from complete history for the eligible apps
    const usageCounts: Record<string, number> = {};
    apps.forEach((app) => {
      usageCounts[app.id] = 0;
    });

    history.forEach((record) => {
      if (usageCounts[record.appId] !== undefined) {
        usageCounts[record.appId]++;
      }
    });

    // 2. Compute weights: weight = 1 / (count + 1)
    const weights: Record<PaymentAppId, number> = {} as Record<PaymentAppId, number>;
    let totalWeight = 0;

    apps.forEach((app) => {
      const count = usageCounts[app.id] || 0;
      const weight = 1 / (count + 1);
      weights[app.id] = weight;
      totalWeight += weight;
    });

    // 3. Compute normalized probabilities
    const probabilities: Record<PaymentAppId, number> = {} as Record<PaymentAppId, number>;
    apps.forEach((app) => {
      probabilities[app.id] = weights[app.id] / totalWeight;
    });

    // 4. Weighted random selection
    const rand = randomFn();
    let cumulative = 0;
    let selectedAppId: PaymentAppId = apps[0].id;

    for (const app of apps) {
      cumulative += probabilities[app.id];
      if (rand <= cumulative) {
        selectedAppId = app.id;
        break;
      }
    }

    return {
      appId: selectedAppId,
      weights,
      probabilities,
    };
  }
}

/**
 * Primary Recommendation Engine Service
 */
export class RecommendationService {
  private strategy: RecommendationStrategy;

  constructor(strategy: RecommendationStrategy = new BalancedUsageStrategy()) {
    this.strategy = strategy;
  }

  public setStrategy(strategy: RecommendationStrategy) {
    this.strategy = strategy;
  }

  /**
   * Pure recommendation evaluator based on amount and RuPay flag.
   */
  public evaluateRecommendation(
    input: RecommendationInput,
    history: PaymentRecord[],
    randomFn: () => number = Math.random
  ): RecommendationResult {
    const { amountPaise, rupayAccepted = false } = input;

    if (amountPaise <= 0) {
      throw new Error('Amount must be greater than 0 paise.');
    }

    // Rule 1: <= ₹50 (5000 paise) -> BHIM UPI Lite
    if (amountPaise <= PAYMENT_THRESHOLDS.BHIM_LITE_MAX_PAISE) {
      const app = PAYMENT_APPS_MAP['bhim_lite'];
      return {
        app,
        appId: 'bhim_lite',
        recommendationType: 'bhim_lite',
        reason: RECOMMENDATION_REASONS.BHIM_LITE,
        amountPaise,
      };
    }

    // Rule 3: >= ₹100 (10000 paise) AND RuPay accepted = YES -> Kiwi
    if (amountPaise >= PAYMENT_THRESHOLDS.KIWI_MIN_PAISE && rupayAccepted) {
      const app = PAYMENT_APPS_MAP['kiwi'];
      return {
        app,
        appId: 'kiwi',
        recommendationType: 'kiwi',
        reason: RECOMMENDATION_REASONS.KIWI,
        amountPaise,
        rupayAccepted: true,
      };
    }

    // Rule 2 & Rule 4:
    // - ₹50.01 to ₹99.99
    // - >= ₹100 with RuPay = NO
    // -> Balanced Recommendation Engine
    const eligibleApps = ALL_PAYMENT_APPS.filter((a) =>
      ELIGIBLE_BALANCED_APP_IDS.includes(a.id as (typeof ELIGIBLE_BALANCED_APP_IDS)[number])
    );

    const { appId, weights, probabilities } = this.strategy.recommend(
      eligibleApps,
      history,
      randomFn
    );
    const app = PAYMENT_APPS_MAP[appId];

    return {
      app,
      appId,
      recommendationType: 'balanced',
      reason: RECOMMENDATION_REASONS.BALANCED,
      amountPaise,
      rupayAccepted: amountPaise >= PAYMENT_THRESHOLDS.KIWI_MIN_PAISE ? rupayAccepted : undefined,
      weightsSnapshot: weights,
      probabilitiesSnapshot: probabilities,
    };
  }

  /**
   * Generates recommendation AND automatically records it in payment history.
   */
  public async getRecommendationAndRecord(
    input: RecommendationInput,
    randomFn?: () => number
  ): Promise<{ recommendation: RecommendationResult; record: PaymentRecord }> {
    const history = await usageStorageService.getPaymentHistory();
    const recommendation = this.evaluateRecommendation(input, history, randomFn);

    const record: PaymentRecord = {
      id: generateRecordId(),
      appId: recommendation.appId,
      amountPaise: recommendation.amountPaise,
      timestamp: Date.now(),
      recommendationType: recommendation.recommendationType,
      ...(recommendation.rupayAccepted !== undefined && {
        rupayAccepted: recommendation.rupayAccepted,
      }),
    };

    await usageStorageService.addPaymentRecord(record);

    return { recommendation, record };
  }
}

/**
 * Platform-safe unique ID generator
 */
function generateRecordId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    try {
      return crypto.randomUUID();
    } catch {
      // fallback
    }
  }
  return `rec_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

export const recommendationService = new RecommendationService();
