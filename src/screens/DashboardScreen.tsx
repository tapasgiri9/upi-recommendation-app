import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Layers,
  IndianRupee,
  Activity,
  History,
  TrendingUp,
} from 'lucide-react';
import { DashboardPeriod, PaymentRecord } from '../types/paymentRecord';
import { usageStorageService } from '../services/usageStorageService';
import { dashboardService } from '../services/dashboardService';
import { UsageSummary } from '../components/UsageSummary';
import { AppIcon } from '../components/AppIcon';
import { formatPaiseToRupees } from '../utils/amountUtils';
import { formatPaymentTime } from '../utils/dateUtils';
import { PAYMENT_APPS_MAP } from '../services/recommendationService';

const PERIOD_TABS: { id: DashboardPeriod; label: string }[] = [
  { id: 'today', label: 'Today' },
  { id: '7days', label: '7 Days' },
  { id: '30days', label: '30 Days' },
  { id: 'all', label: 'All Time' },
];

export const DashboardScreen: React.FC = () => {
  const [period, setPeriod] = useState<DashboardPeriod>('all');
  const [allRecords, setAllRecords] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Load records and subscribe to live changes
  useEffect(() => {
    const fetchHistory = async () => {
      const records = await usageStorageService.getPaymentHistory();
      setAllRecords(records);
      setLoading(false);
    };

    fetchHistory();

    const unsubscribe = usageStorageService.subscribe(fetchHistory);
    return () => unsubscribe();
  }, []);

  // Filter records by selected period
  const filteredRecords = dashboardService.getPaymentsForPeriod(allRecords, period);
  const summary = dashboardService.computeSummary(filteredRecords);

  return (
    <div id="dashboard-screen" className="w-full max-w-md mx-auto flex flex-col gap-5 pb-24 pt-2">
      {/* Header & Period Filters */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-stone-900 tracking-tight">
              Payment Insights
            </h2>
            <p className="text-xs text-stone-500">
              Derived dynamically from your complete offline history
            </p>
          </div>
          <div className="p-2 rounded-xl bg-stone-100 text-stone-700">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>

        {/* Period Selector Tabs */}
        <div className="flex items-center p-1 bg-stone-100 rounded-2xl border border-stone-200/80">
          {PERIOD_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              id={`filter-period-${tab.id}`}
              onClick={() => setPeriod(tab.id)}
              className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-semibold transition-all ${
                period === tab.id
                  ? 'bg-white text-stone-900 shadow-xs font-bold'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="bg-white border border-stone-200 rounded-2xl p-3.5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
              Payments
            </span>
            <Layers className="w-3.5 h-3.5" />
          </div>
          <div className="mt-2">
            <span className="text-xl font-black text-stone-900">
              {summary.totalCount}
            </span>
            <span className="text-[10px] text-stone-400 block mt-0.5 font-medium">
              total routed
            </span>
          </div>
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl p-3.5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
              Total Amount
            </span>
            <IndianRupee className="w-3.5 h-3.5" />
          </div>
          <div className="mt-2">
            <span className="text-xl font-black text-stone-900 truncate block">
              {formatPaiseToRupees(summary.totalAmountPaise, false)}
            </span>
            <span className="text-[10px] text-stone-400 block mt-0.5 font-medium">
              {summary.totalAmountPaise > 0 ? `${(summary.totalAmountPaise / 100).toFixed(0)} INR` : '₹0'}
            </span>
          </div>
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl p-3.5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
              Avg Ticket
            </span>
            <Activity className="w-3.5 h-3.5" />
          </div>
          <div className="mt-2">
            <span className="text-xl font-black text-stone-900 truncate block">
              {formatPaiseToRupees(summary.averageAmountPaise, false)}
            </span>
            <span className="text-[10px] text-stone-400 block mt-0.5 font-medium">
              per transaction
            </span>
          </div>
        </div>
      </div>

      {/* App Usage & Distribution Breakdown */}
      <UsageSummary
        appStats={summary.appStats}
        totalCount={summary.totalCount}
      />

      {/* Recent Transactions Feed */}
      <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
            <History className="w-3.5 h-3.5" />
            <span>Recent History ({filteredRecords.length})</span>
          </h4>
        </div>

        {filteredRecords.length === 0 ? (
          <div className="py-8 text-center text-xs text-stone-400">
            No payments in this period.
          </div>
        ) : (
          <div className="divide-y divide-stone-100 max-h-72 overflow-y-auto pr-1">
            {filteredRecords.slice(0, 15).map((record) => {
              const app = PAYMENT_APPS_MAP[record.appId];
              return (
                <div
                  key={record.id}
                  className="py-2.5 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <AppIcon appId={record.appId} size="sm" />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-stone-900">
                          {app?.name || record.appId}
                        </span>
                        {record.recommendationType === 'kiwi' && (
                          <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                            RuPay
                          </span>
                        )}
                        {record.recommendationType === 'bhim_lite' && (
                          <span className="text-[9px] font-bold bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded">
                            Lite
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-stone-400">
                        {formatPaymentTime(record.timestamp)}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-extrabold text-stone-900 text-sm">
                      {formatPaiseToRupees(record.amountPaise)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
