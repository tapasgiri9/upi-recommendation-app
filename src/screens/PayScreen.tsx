import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Sparkles, ArrowRight, Zap, Scale, CreditCard } from 'lucide-react-native';
import { AmountInput } from '../components/AmountInput';
import { RupaySelector } from '../components/RupaySelector';
import { RecommendationCard } from '../components/RecommendationCard';
import { parseRupeesToPaise, formatPaiseToRupees } from '../utils/amountUtils';
import { PAYMENT_THRESHOLDS } from '../constants/paymentRules';
import { recommendationService } from '../services/recommendationService';
import { RecommendationResult } from '../types/recommendation';

export const PayScreen: React.FC = () => {
  const [amountText, setAmountText] = useState<string>('');
  const [rupayAccepted, setRupayAccepted] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [recommendationResult, setRecommendationResult] = useState<RecommendationResult | null>(null);

  const validation = amountText ? parseRupeesToPaise(amountText) : null;
  const isAmountValid = validation?.isValid ?? false;
  const amountPaise = validation?.amountPaise ?? 0;

  const isRupayRequired = isAmountValid && amountPaise >= PAYMENT_THRESHOLDS.KIWI_MIN_PAISE;
  const isRupaySpecified = !isRupayRequired || rupayAccepted !== null;
  const canRecommend = isAmountValid && isRupaySpecified;

  useEffect(() => {
    if (amountPaise < PAYMENT_THRESHOLDS.KIWI_MIN_PAISE && rupayAccepted !== null) {
      setRupayAccepted(null);
    }
  }, [amountPaise, rupayAccepted]);

  const handleGetRecommendation = async () => {
    if (!amountText) {
      setError('Please enter a payment amount.');
      return;
    }

    if (!isAmountValid) {
      setError(validation?.errorMessage || 'Please enter a valid amount.');
      return;
    }

    if (isRupayRequired && rupayAccepted === null) {
      setError('Please select whether RuPay is accepted.');
      return;
    }

    setError(null);
    setIsEvaluating(true);

    try {
      const { recommendation } = await recommendationService.getRecommendationAndRecord({
        amountPaise,
        rupayAccepted: isRupayRequired ? (rupayAccepted ?? false) : undefined,
      });

      setRecommendationResult(recommendation);
    } catch (err: any) {
      setError(err?.message || 'Unable to compute recommendation.');
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleReset = () => {
    setAmountText('');
    setRupayAccepted(null);
    setError(null);
    setRecommendationResult(null);
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {recommendationResult ? (
        <RecommendationCard result={recommendationResult} onReset={handleReset} />
      ) : (
        <View style={styles.formContainer}>
          {/* Intro Card */}
          <View style={styles.heroCard}>
            <View style={styles.heroBadge}>
              <Sparkles size={13} color="#facc15" />
              <Text style={styles.heroBadgeText}>Smart Payment Router</Text>
            </View>
            <Text style={styles.heroTitle}>Which app should you use?</Text>
            <Text style={styles.heroSubtitle}>
              Enter the amount below. We balance your usage across BHIM, Navi, Paytm, super.money, and Kiwi.
            </Text>
          </View>

          {/* Main Card */}
          <View style={styles.mainCard}>
            <AmountInput
              value={amountText}
              onChange={(val) => {
                setAmountText(val);
                if (error) setError(null);
              }}
              error={error}
            />

            {/* Conditional RuPay Selector */}
            {isRupayRequired && (
              <RupaySelector value={rupayAccepted} onChange={setRupayAccepted} />
            )}

            {/* Dynamic Rule Preview Indicator */}
            {isAmountValid && (
              <View style={styles.rulePreview}>
                {amountPaise <= PAYMENT_THRESHOLDS.BHIM_LITE_MAX_PAISE ? (
                  <>
                    <View style={[styles.ruleIconWrapper, { backgroundColor: '#e0e7ff' }]}>
                      <Zap size={16} color="#4338ca" />
                    </View>
                    <View style={styles.ruleTextColumn}>
                      <Text style={styles.ruleTitle}>Micro-payment Rule (≤ ₹50)</Text>
                      <Text style={styles.ruleDesc}>
                        Will recommend <Text style={{ color: '#4f46e5', fontWeight: '700' }}>BHIM UPI Lite</Text> instantly.
                      </Text>
                    </View>
                  </>
                ) : amountPaise < PAYMENT_THRESHOLDS.KIWI_MIN_PAISE ? (
                  <>
                    <View style={[styles.ruleIconWrapper, { backgroundColor: '#e0f2fe' }]}>
                      <Scale size={16} color="#0369a1" />
                    </View>
                    <View style={styles.ruleTextColumn}>
                      <Text style={styles.ruleTitle}>Mid-range Rule (₹50.01 – ₹99.99)</Text>
                      <Text style={styles.ruleDesc}>
                        Balances usage across Navi, super.money, Paytm, and BHIM.
                      </Text>
                    </View>
                  </>
                ) : rupayAccepted === true ? (
                  <>
                    <View style={[styles.ruleIconWrapper, { backgroundColor: '#dcfce7' }]}>
                      <CreditCard size={16} color="#15803d" />
                    </View>
                    <View style={styles.ruleTextColumn}>
                      <Text style={styles.ruleTitle}>RuPay Credit on UPI (≥ ₹100)</Text>
                      <Text style={styles.ruleDesc}>
                        Will recommend <Text style={{ color: '#16a34a', fontWeight: '700' }}>Kiwi</Text> for rewards.
                      </Text>
                    </View>
                  </>
                ) : (
                  <>
                    <View style={[styles.ruleIconWrapper, { backgroundColor: '#f3e8ff' }]}>
                      <Scale size={16} color="#7e22ce" />
                    </View>
                    <View style={styles.ruleTextColumn}>
                      <Text style={styles.ruleTitle}>Standard UPI (≥ ₹100)</Text>
                      <Text style={styles.ruleDesc}>
                        Balances usage across Navi, super.money, Paytm, and BHIM.
                      </Text>
                    </View>
                  </>
                )}
              </View>
            )}

            {/* Recommendation Submit Button */}
            <TouchableOpacity
              onPress={handleGetRecommendation}
              disabled={!canRecommend || isEvaluating}
              activeOpacity={0.8}
              style={[
                styles.submitButton,
                canRecommend && !isEvaluating
                  ? styles.submitButtonEnabled
                  : styles.submitButtonDisabled,
              ]}
            >
              {isEvaluating ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <>
                  <Text
                    style={[
                      styles.submitButtonText,
                      canRecommend ? styles.submitButtonTextEnabled : styles.submitButtonTextDisabled,
                    ]}
                  >
                    {isAmountValid
                      ? `Recommend for ${formatPaiseToRupees(amountPaise)}`
                      : 'Enter Amount to Recommend'}
                  </Text>
                  <ArrowRight
                    size={16}
                    color={canRecommend ? '#ffffff' : '#a8a29e'}
                  />
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 40,
    gap: 16,
  },
  formContainer: {
    gap: 16,
  },
  heroCard: {
    backgroundColor: '#1c1917',
    borderRadius: 24,
    padding: 18,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  heroBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#facc15',
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -0.4,
  },
  heroSubtitle: {
    fontSize: 12,
    color: '#d6d3d1',
    lineHeight: 17,
  },
  mainCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e7e5e4',
    borderRadius: 24,
    padding: 18,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  rulePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#fafaf9',
    borderWidth: 1,
    borderColor: '#e7e5e4',
    padding: 12,
    borderRadius: 16,
  },
  ruleIconWrapper: {
    padding: 8,
    borderRadius: 10,
  },
  ruleTextColumn: {
    flex: 1,
  },
  ruleTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1c1917',
  },
  ruleDesc: {
    fontSize: 11,
    color: '#78716c',
    marginTop: 1,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 16,
  },
  submitButtonEnabled: {
    backgroundColor: '#1c1917',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  submitButtonDisabled: {
    backgroundColor: '#e7e5e4',
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: '700',
  },
  submitButtonTextEnabled: {
    color: '#ffffff',
  },
  submitButtonTextDisabled: {
    color: '#a8a29e',
  },
});
