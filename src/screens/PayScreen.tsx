import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Zap, Scale, CreditCard } from 'lucide-react';
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

  // Validate amount on change
  const validation = amountText ? parseRupeesToPaise(amountText) : null;
  const isAmountValid = validation?.isValid ?? false;
  const amountPaise = validation?.amountPaise ?? 0;

  // RuPay condition is only required when amount >= ₹100 (10000 paise)
  const isRupayRequired = isAmountValid && amountPaise >= PAYMENT_THRESHOLDS.KIWI_MIN_PAISE;
  const isRupaySpecified = !isRupayRequired || rupayAccepted !== null;

  const canRecommend = isAmountValid && isRupaySpecified;

  // Clear RuPay choice if amount drops below ₹100
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
    <div id="pay-screen" className="w-full max-w-md mx-auto flex flex-col gap-5 pb-24 pt-2">
      {recommendationResult ? (
        <RecommendationCard result={recommendationResult} onReset={handleReset} />
      ) : (
        <div className="flex flex-col gap-5">
          {/* Intro Card */}
          <div className="bg-gradient-to-br from-stone-900 to-stone-800 rounded-3xl p-5 text-white shadow-md relative overflow-hidden">
            <div className="relative z-10 flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Smart Payment Router</span>
              </div>
              <h2 className="text-xl font-bold tracking-tight text-white">
                Which app should you use?
              </h2>
              <p className="text-xs text-stone-300">
                Enter the amount below. We balance your usage across BHIM, Navi, Paytm, super.money, and Kiwi.
              </p>
            </div>
            {/* Ambient decoration */}
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-stone-700/30 rounded-full blur-2xl" />
          </div>

          {/* Main Input Form */}
          <div className="bg-white border border-stone-200 rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col gap-5">
            <AmountInput
              value={amountText}
              onChange={(val) => {
                setAmountText(val);
                if (error) setError(null);
              }}
              error={error}
            />

            {/* Conditional RuPay Question */}
            {isRupayRequired && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                <RupaySelector value={rupayAccepted} onChange={setRupayAccepted} />
              </div>
            )}

            {/* Dynamic Rule Preview Indicator */}
            {isAmountValid && (
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 text-xs flex items-center gap-3">
                {amountPaise <= PAYMENT_THRESHOLDS.BHIM_LITE_MAX_PAISE ? (
                  <>
                    <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700 shrink-0">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-stone-900 block">
                        Micro-payment Rule (≤ ₹50)
                      </span>
                      <span className="text-stone-500">
                        Will recommend <strong className="text-indigo-600">BHIM UPI Lite</strong> instantly.
                      </span>
                    </div>
                  </>
                ) : amountPaise < PAYMENT_THRESHOLDS.KIWI_MIN_PAISE ? (
                  <>
                    <div className="p-2 rounded-xl bg-sky-100 text-sky-700 shrink-0">
                      <Scale className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-stone-900 block">
                        Mid-range Rule (₹50.01 – ₹99.99)
                      </span>
                      <span className="text-stone-500">
                        Balances usage across Navi, super.money, Paytm, and BHIM.
                      </span>
                    </div>
                  </>
                ) : rupayAccepted === true ? (
                  <>
                    <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700 shrink-0">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-stone-900 block">
                        RuPay Credit on UPI (≥ ₹100)
                      </span>
                      <span className="text-stone-500">
                        Will recommend <strong className="text-emerald-700">Kiwi</strong> for cashback/rewards.
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-2 rounded-xl bg-purple-100 text-purple-700 shrink-0">
                      <Scale className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-stone-900 block">
                        Standard UPI (≥ ₹100)
                      </span>
                      <span className="text-stone-500">
                        Balances usage across Navi, super.money, Paytm, and BHIM.
                      </span>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Recommendation Submit Button */}
            <button
              type="button"
              id="btn-get-recommendation"
              onClick={handleGetRecommendation}
              disabled={!canRecommend || isEvaluating}
              className={`w-full py-4 px-6 rounded-2xl font-bold text-sm tracking-wide shadow transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${
                canRecommend && !isEvaluating
                  ? 'bg-stone-900 hover:bg-black text-white cursor-pointer shadow-md'
                  : 'bg-stone-200 text-stone-400 cursor-not-allowed'
              }`}
            >
              {isEvaluating ? (
                <span>Routing Payment...</span>
              ) : (
                <>
                  <span>
                    {isAmountValid
                      ? `Recommend for ${formatPaiseToRupees(amountPaise)}`
                      : 'Enter Amount to Recommend'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
