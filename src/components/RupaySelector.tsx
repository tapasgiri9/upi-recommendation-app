import React from 'react';
import { CreditCard, Check, X } from 'lucide-react';

interface RupaySelectorProps {
  value: boolean | null;
  onChange: (val: boolean) => void;
}

export const RupaySelector: React.FC<RupaySelectorProps> = ({ value, onChange }) => {
  return (
    <div
      id="rupay-selector-container"
      className="w-full bg-stone-50 border border-stone-200/80 rounded-2xl p-4 flex flex-col gap-3 transition-all"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
            <CreditCard className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-stone-900 leading-tight">
              Does merchant accept RuPay on UPI?
            </h4>
            <p className="text-xs text-stone-500">
              Required for transactions of ₹100 or more
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-1">
        <button
          type="button"
          id="btn-rupay-yes"
          onClick={() => onChange(true)}
          className={`py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 border transition-all active:scale-[0.98] ${
            value === true
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm ring-2 ring-emerald-200'
              : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
          }`}
        >
          <Check className="w-4 h-4 stroke-[3]" />
          <span>YES (RuPay)</span>
        </button>

        <button
          type="button"
          id="btn-rupay-no"
          onClick={() => onChange(false)}
          className={`py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 border transition-all active:scale-[0.98] ${
            value === false
              ? 'bg-stone-900 text-white border-stone-900 shadow-sm ring-2 ring-stone-300'
              : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
          }`}
        >
          <X className="w-4 h-4 stroke-[3]" />
          <span>NO (Standard)</span>
        </button>
      </div>
    </div>
  );
};
