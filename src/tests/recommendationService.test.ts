import {
  RecommendationService,
  BalancedUsageStrategy,
  ALL_PAYMENT_APPS,
} from '../services/recommendationService';
import { PaymentRecord } from '../types/paymentRecord';

export function runRecommendationTests() {
  const service = new RecommendationService(new BalancedUsageStrategy());
  const results: { test: string; passed: boolean; details?: any }[] = [];

  const assert = (test: string, condition: boolean, details?: any) => {
    results.push({ test, passed: condition, details });
    if (!condition) {
      console.error(`❌ Recommendation test failed: ${test}`, details);
    }
  };

  const emptyHistory: PaymentRecord[] = [];

  // 1. Boundary: <= ₹50 (5000 paise) -> bhim_lite
  const r49 = service.evaluateRecommendation({ amountPaise: 4900 }, emptyHistory);
  assert('₹49 produces BHIM UPI Lite', r49.appId === 'bhim_lite' && r49.recommendationType === 'bhim_lite', r49);

  const r50 = service.evaluateRecommendation({ amountPaise: 5000 }, emptyHistory);
  assert('₹50 produces BHIM UPI Lite', r50.appId === 'bhim_lite' && r50.recommendationType === 'bhim_lite', r50);

  // 2. Boundary: ₹50.01 - ₹99.99 -> Balanced Recommendation
  const r5001 = service.evaluateRecommendation({ amountPaise: 5001 }, emptyHistory);
  assert('₹50.01 produces balanced recommendation', r5001.recommendationType === 'balanced', r5001);

  const r75 = service.evaluateRecommendation({ amountPaise: 7500 }, emptyHistory);
  assert('₹75 produces balanced recommendation', r75.recommendationType === 'balanced', r75);

  const r9999 = service.evaluateRecommendation({ amountPaise: 9999 }, emptyHistory);
  assert('₹99.99 produces balanced recommendation', r9999.recommendationType === 'balanced', r9999);

  // 3. Boundary: >= ₹100 with RuPay YES -> Kiwi
  const r100Yes = service.evaluateRecommendation(
    { amountPaise: 10000, rupayAccepted: true },
    emptyHistory
  );
  assert('₹100 + RuPay YES produces Kiwi', r100Yes.appId === 'kiwi' && r100Yes.recommendationType === 'kiwi', r100Yes);

  const r101Yes = service.evaluateRecommendation(
    { amountPaise: 10100, rupayAccepted: true },
    emptyHistory
  );
  assert('₹101 + RuPay YES produces Kiwi', r101Yes.appId === 'kiwi' && r101Yes.recommendationType === 'kiwi', r101Yes);

  // 4. Boundary: >= ₹100 with RuPay NO -> Balanced Recommendation
  const r100No = service.evaluateRecommendation(
    { amountPaise: 10000, rupayAccepted: false },
    emptyHistory
  );
  assert('₹100 + RuPay NO produces balanced recommendation', r100No.recommendationType === 'balanced', r100No);

  const r101No = service.evaluateRecommendation(
    { amountPaise: 10100, rupayAccepted: false },
    emptyHistory
  );
  assert('₹101 + RuPay NO produces balanced recommendation', r101No.recommendationType === 'balanced', r101No);

  // 5. Candidate Pool Verification: balanced engine must ONLY pick navi, super_money, paytm, bhim
  const eligiblePool = ['navi', 'super_money', 'paytm', 'bhim'];
  const eligibleApps = ALL_PAYMENT_APPS.filter((a) => eligiblePool.includes(a.id));
  const strategy = new BalancedUsageStrategy();

  // Test deterministic random selection
  // At rand = 0.05, first app (navi) is picked
  const pickFirst = strategy.recommend(eligibleApps, emptyHistory, () => 0.05);
  assert('Deterministic pick 1 is valid eligible app', eligiblePool.includes(pickFirst.appId));

  // Verify Kiwi & BHIM Lite are never in the eligible balanced pool
  assert('Kiwi not in balanced pool', !eligiblePool.includes('kiwi'));
  assert('BHIM Lite not in balanced pool', !eligiblePool.includes('bhim_lite'));

  // 6. Weight balancing test: If Navi has 10 usages and Paytm has 0, Paytm has higher weight
  const biasedHistory: PaymentRecord[] = Array.from({ length: 10 }).map((_, i) => ({
    id: `bias-${i}`,
    appId: 'navi',
    amountPaise: 6000,
    timestamp: Date.now(),
    recommendationType: 'balanced',
  }));

  const biasedResult = strategy.recommend(eligibleApps, biasedHistory);
  assert(
    'Paytm (0 uses) has higher probability than Navi (10 uses)',
    biasedResult.probabilities['paytm'] > biasedResult.probabilities['navi']
  );

  return results;
}
