import React, { useState } from 'react';
import { CheckCircle2, ChevronDown, ChevronUp, Sparkles, RefreshCw } from 'lucide-react';
import { RecommendationResult } from '../types/recommendation';
import { AppIcon } from './AppIcon';
import { formatPaiseToRupees } from '../utils/amountUtils';
import { PAYMENT_APPS_MAP } from '../services/recommendationService';

interface RecommendationCardProps {
  result: RecommendationResult;
  onReset: () => void;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  result,
  onReset,
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const { app, reason, amountPaise, recommendationType, weightsSnapshot, probabilitiesSnapshot } = result;

  return (
    <div
      id="recommendation-card"
      className="w-full bg-white border border-stone-200 rounded-3xl p-6 shadow-md flex flex-col items-center text-center gap-5 transition-all animate-in fade-in zoom-in-95 duration-200"
    >
      {/* Header Eyebrow */}
      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 text-stone-600 text-xs font-semibold">
        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
        <span>Recommended App</span>
      </div>

      {/* Main App Display */}
      <div className="flex flex-col items-center gap-3">
        <div className="p-1 rounded-2xl bg-stone-50 border border-stone-100 shadow-inner">
          <AppIcon appId={app.id} size="xl" showBadge={app.id === 'kiwi'} />
        </div>

        <div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight" id="recommended-app-name">
            {app.name}
          </h3>
          <p className="text-xs font-medium text-stone-500 mt-0.5">
            {app.tagline}
          </p>
        </div>
      </div>

      {/* Amount & Reason Box */}
      <div className="w-full bg-stone-50 rounded-2xl p-4 border border-stone-200/70 flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
          <span>Amount</span>
          <span className="text-sm font-bold text-stone-900">
            {formatPaiseToRupees(amountPaise)}
          </span>
        </div>

        <div className="h-px bg-stone-200/80 my-0.5" />

        <div className="text-left">
          <p className="text-xs font-semibold text-stone-700">Reason:</p>
          <p className="text-sm text-stone-800 font-medium mt-0.5" id="recommendation-reason-text">
            {reason}
          </p>
        </div>

        {/* Assumed Recorded Indicator */}
        <div className="flex items-center gap-2 mt-1 pt-2 border-t border-stone-200/60 text-xs text-emerald-700 font-semibold justify-center">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Recorded in local history as completed</span>
        </div>
      </div>

      {/* Algorithm Transparency toggle for balanced recommendations */}
      {recommendationType === 'balanced' && probabilitiesSnapshot && (
        <div className="w-full text-left">
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="text-xs font-semibold text-stone-500 hover:text-stone-800 flex items-center justify-between w-full py-1"
          >
            <span>Algorithm Balancing Weights</span>
            {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showDetails && (
            <div className="mt-2 p-3 bg-stone-50 rounded-xl border border-stone-200/70 text-xs flex flex-col gap-2 animate-in fade-in duration-150">
              <p className="text-[11px] text-stone-500">
                Formula: <code className="bg-stone-200 px-1 py-0.5 rounded font-mono">weight = 1 / (usage + 1)</code>
              </p>
              <div className="space-y-1.5 pt-1">
                {Object.entries(probabilitiesSnapshot).map(([id, prob]) => {
                  const itemApp = PAYMENT_APPS_MAP[id as keyof typeof PAYMENT_APPS_MAP];
                  const numProb = Number(prob) || 0;
                  const percent = Math.round(numProb * 100);
                  const isWinner = id === app.id;
                  return (
                    <div key={id} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <AppIcon appId={id as any} size="sm" />
                        <span className={`font-medium ${isWinner ? 'font-bold text-stone-900' : 'text-stone-600'}`}>
                          {itemApp?.name || id}
                        </span>
                        {isWinner && <span className="text-[10px] bg-stone-900 text-white px-1 rounded font-bold">PICKED</span>}
                      </div>
                      <span className="font-mono text-stone-700 font-semibold">{percent}% chance</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Primary Action Button */}
      <button
        type="button"
        id="btn-recommend-another"
        onClick={onReset}
        className="w-full py-3.5 px-6 rounded-2xl bg-stone-900 hover:bg-black text-white font-bold text-sm tracking-wide shadow transition-all active:scale-[0.98] flex items-center justify-center gap-2"
      >
        <RefreshCw className="w-4 h-4" />
        <span>New Recommendation</span>
      </button>
    </div>
  );
};
