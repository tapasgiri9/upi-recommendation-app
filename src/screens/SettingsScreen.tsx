import React, { useState, useEffect } from 'react';
import {
  Trash2,
  Database,
  Sparkles,
  Info,
  ShieldCheck,
  CheckCircle,
  FileDown,
  Terminal,
  Smartphone,
} from 'lucide-react';
import { usageStorageService } from '../services/usageStorageService';
import { PaymentRecord } from '../types/paymentRecord';

export const SettingsScreen: React.FC = () => {
  const [recordCount, setRecordCount] = useState<number>(0);
  const [showClearConfirm, setShowClearConfirm] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadCount = async () => {
    const records = await usageStorageService.getPaymentHistory();
    setRecordCount(records.length);
  };

  useEffect(() => {
    loadCount();
    const unsubscribe = usageStorageService.subscribe(loadCount);
    return () => unsubscribe();
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleClearHistory = async () => {
    await usageStorageService.clearPaymentHistory();
    setShowClearConfirm(false);
    triggerToast('Payment history has been cleared.');
  };

  const handleSeedSampleData = async () => {
    await usageStorageService.seedSampleHistory();
    triggerToast('Sample payments seeded successfully.');
  };

  const handleExportData = async () => {
    const records = await usageStorageService.getPaymentHistory();
    const jsonStr = JSON.stringify(records, null, 2);
    
    // Create download blob
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `upi_payment_history_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    triggerToast('Payment history JSON downloaded.');
  };

  return (
    <div id="settings-screen" className="w-full max-w-md mx-auto flex flex-col gap-5 pb-28 pt-2">
      {/* Toast alert */}
      {toastMessage && (
        <div className="fixed top-16 inset-x-4 max-w-md mx-auto z-50 bg-stone-900 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-3 duration-200">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-stone-900 tracking-tight">Settings</h2>
        <p className="text-xs text-stone-500">
          Personal configuration, privacy & offline storage
        </p>
      </div>

      {/* Application Info */}
      <div className="bg-white border border-stone-200 rounded-3xl p-5 shadow-sm flex flex-col gap-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
          <Info className="w-4 h-4" />
          <span>Application</span>
        </h3>

        <div className="flex items-center justify-between text-xs py-1 border-b border-stone-100">
          <span className="text-stone-600 font-medium">App Name</span>
          <span className="font-bold text-stone-900">UPI Recommendation Assistant</span>
        </div>

        <div className="flex items-center justify-between text-xs py-1 border-b border-stone-100">
          <span className="text-stone-600 font-medium">Version</span>
          <span className="font-mono font-bold text-stone-900 bg-stone-100 px-2 py-0.5 rounded">
            v1.0.0
          </span>
        </div>

        <div className="flex items-center justify-between text-xs py-1 border-b border-stone-100">
          <span className="text-stone-600 font-medium">Stored Records</span>
          <span className="font-bold text-stone-900">
            {recordCount} {recordCount === 1 ? 'transaction' : 'transactions'}
          </span>
        </div>

        <div className="flex items-center justify-between text-xs py-1">
          <span className="text-stone-600 font-medium">Architecture</span>
          <span className="text-emerald-700 font-bold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            100% Local & Offline
          </span>
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-white border border-stone-200 rounded-3xl p-5 shadow-sm flex flex-col gap-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
          <Database className="w-4 h-4" />
          <span>Data Storage</span>
        </h3>

        <p className="text-xs text-stone-500 leading-relaxed">
          All recommendations are saved to your local device storage. No data is ever transmitted to external servers.
        </p>

        <div className="flex flex-col gap-2 pt-2">
          {/* Seed Sample Records */}
          <button
            type="button"
            id="btn-seed-sample-data"
            onClick={handleSeedSampleData}
            className="w-full py-3 px-4 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-800 font-semibold text-xs flex items-center justify-between transition"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Seed Multi-Day Sample History</span>
            </div>
            <span className="text-[10px] text-stone-400 uppercase font-bold">10 items</span>
          </button>

          {/* Export JSON */}
          <button
            type="button"
            id="btn-export-data"
            onClick={handleExportData}
            disabled={recordCount === 0}
            className={`w-full py-3 px-4 rounded-xl border font-semibold text-xs flex items-center justify-between transition ${
              recordCount > 0
                ? 'border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-800'
                : 'border-stone-100 bg-stone-50/50 text-stone-300 cursor-not-allowed'
            }`}
          >
            <div className="flex items-center gap-2">
              <FileDown className="w-4 h-4 text-stone-600" />
              <span>Export History to JSON</span>
            </div>
            <span className="text-[10px] text-stone-400 font-bold">.json</span>
          </button>

          {/* Clear History */}
          {!showClearConfirm ? (
            <button
              type="button"
              id="btn-clear-history"
              onClick={() => setShowClearConfirm(true)}
              disabled={recordCount === 0}
              className={`w-full py-3 px-4 rounded-xl border font-semibold text-xs flex items-center justify-between transition ${
                recordCount > 0
                  ? 'border-rose-200 bg-rose-50/70 hover:bg-rose-100 text-rose-700'
                  : 'border-stone-100 bg-stone-50/50 text-stone-300 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center gap-2">
                <Trash2 className="w-4 h-4 text-rose-600" />
                <span>Clear Payment History</span>
              </div>
              <span className="text-[10px] text-rose-400 font-bold">Reset</span>
            </button>
          ) : (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex flex-col gap-2 animate-in fade-in duration-150">
              <p className="text-xs font-bold text-rose-900">
                Are you sure you want to clear all history?
              </p>
              <p className="text-[11px] text-rose-700">
                This will delete all {recordCount} recorded payments. This action cannot be undone.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  id="btn-confirm-clear"
                  onClick={handleClearHistory}
                  className="flex-1 py-2 px-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-lg shadow-sm"
                >
                  Yes, Clear All
                </button>
                <button
                  type="button"
                  id="btn-cancel-clear"
                  onClick={() => setShowClearConfirm(false)}
                  className="flex-1 py-2 px-3 bg-stone-200 hover:bg-stone-300 text-stone-800 font-semibold text-xs rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Decision Rules Reference */}
      <div className="bg-white border border-stone-200 rounded-3xl p-5 shadow-sm flex flex-col gap-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
          <Terminal className="w-4 h-4" />
          <span>Decision Rules Matrix</span>
        </h3>

        <div className="space-y-2 text-xs">
          <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-between">
            <span className="font-semibold text-stone-700">₹0 – ₹50</span>
            <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
              BHIM UPI Lite
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-between">
            <span className="font-semibold text-stone-700">₹50.01 – ₹99.99</span>
            <span className="font-bold text-stone-800 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
              Balanced (Navi / super / Paytm / BHIM)
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-between">
            <span className="font-semibold text-stone-700">₹100+ (RuPay = YES)</span>
            <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
              Kiwi (RuPay on UPI)
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-between">
            <span className="font-semibold text-stone-700">₹100+ (RuPay = NO)</span>
            <span className="font-bold text-stone-800 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
              Balanced (Navi / super / Paytm / BHIM)
            </span>
          </div>
        </div>
      </div>

      {/* APK & System Build Guide */}
      <div className="bg-stone-900 text-stone-100 rounded-3xl p-5 shadow-md flex flex-col gap-3">
        <div className="flex items-center gap-2 text-amber-400">
          <Smartphone className="w-4 h-4" />
          <h3 className="text-xs font-bold uppercase tracking-wider">
            Android APK & System Build
          </h3>
        </div>

        <p className="text-xs text-stone-300 leading-relaxed">
          You can download this project as a ZIP file from Google AI Studio settings and build the Android APK on your system:
        </p>

        <div className="bg-stone-950 p-3 rounded-xl font-mono text-[11px] text-stone-300 space-y-1 overflow-x-auto border border-stone-800">
          <p className="text-emerald-400 font-semibold"># 1. Install dependencies</p>
          <p className="text-stone-200">npm install</p>
          <p className="text-emerald-400 font-semibold pt-1"># 2. Run EAS Android preview build</p>
          <p className="text-stone-200">npx eas build -p android --profile preview</p>
          <p className="text-emerald-400 font-semibold pt-1"># 3. Or run standalone local web / PWA</p>
          <p className="text-stone-200">npm run build && npm run preview</p>
        </div>
      </div>
    </div>
  );
};
