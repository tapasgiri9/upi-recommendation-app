import React from 'react';
import { AppUsageStats } from '../types/paymentRecord';
import { AppIcon } from './AppIcon';
import { formatPaiseToRupees } from '../utils/amountUtils';

interface UsageSummaryProps {
  appStats: AppUsageStats[];
  totalCount: number;
}

export const UsageSummary: React.FC<UsageSummaryProps> = ({ appStats, totalCount }) => {
  // Sort by count descending, then total amount descending
  const sortedStats = [...appStats].sort((a, b) => {
    if (b.count !== a.count) return b.count - a.count;
    return b.totalAmountPaise - a.totalAmountPaise;
  });

  const maxCount = Math.max(...appStats.map((s) => s.count), 1);

  return (
    <div id="usage-distribution-container" className="w-full flex flex-col gap-4">
      {/* Distribution Bars */}
      <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm flex flex-col gap-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
          Usage Distribution
        </h4>

        {totalCount === 0 ? (
          <div className="py-6 text-center text-xs text-stone-400">
            No payments recorded for this period yet.
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {sortedStats.map((stat) => {
              const barWidthPercent = totalCount > 0 ? (stat.count / maxCount) * 100 : 0;

              return (
                <div key={stat.appId} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <div className="flex items-center gap-2">
                      <AppIcon appId={stat.appId} size="sm" />
                      <span className="text-stone-800">{stat.appName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-stone-600">
                      <span>{stat.count} {stat.count === 1 ? 'payment' : 'payments'}</span>
                      <span className="text-stone-400 font-normal">
                        ({Math.round(stat.percentageOfTotal)}%)
                      </span>
                    </div>
                  </div>

                  {/* Horizontal Bar */}
                  <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden flex">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${barWidthPercent}%`,
                        backgroundColor: getBarColor(stat.appId),
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Per-App Detailed Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {sortedStats.map((stat) => (
          <div
            key={`card-${stat.appId}`}
            className="bg-white border border-stone-200 rounded-2xl p-3.5 shadow-sm flex items-center justify-between hover:border-stone-300 transition"
          >
            <div className="flex items-center gap-3">
              <AppIcon appId={stat.appId} size="md" />
              <div>
                <h5 className="text-sm font-bold text-stone-900 leading-tight">
                  {stat.appName}
                </h5>
                <p className="text-xs text-stone-500">
                  {stat.count} {stat.count === 1 ? 'payment' : 'payments'}
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-sm font-extrabold text-stone-900 block">
                {formatPaiseToRupees(stat.totalAmountPaise)}
              </span>
              {stat.count > 0 && (
                <span className="text-[11px] text-stone-400 font-medium">
                  avg {formatPaiseToRupees(stat.averageAmountPaise)}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

function getBarColor(appId: string): string {
  switch (appId) {
    case 'kiwi':
      return '#16a34a';
    case 'navi':
      return '#0284c7';
    case 'super_money':
      return '#ec4899';
    case 'paytm':
      return '#00b9f1';
    case 'bhim':
      return '#ea580c';
    case 'bhim_lite':
      return '#6366f1';
    default:
      return '#78716c';
  }
}
