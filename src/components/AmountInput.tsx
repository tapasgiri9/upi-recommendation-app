import React, { useRef } from 'react';
import { IndianRupee, X } from 'lucide-react';
import { parseRupeesToPaise, formatPaiseToRupees } from '../utils/amountUtils';

interface AmountInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string | null;
  autoFocus?: boolean;
}

const QUICK_AMOUNTS = [
  { label: '₹30', value: '30', note: 'Lite (≤₹50)' },
  { label: '₹75', value: '75', note: 'Balanced' },
  { label: '₹150', value: '150', note: 'RuPay / Engine' },
  { label: '₹500', value: '500', note: 'Large UPI' },
];

export const AmountInput: React.FC<AmountInputProps> = ({
  value,
  onChange,
  error,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value;
    // Allow digits and up to one decimal point
    raw = raw.replace(/[^0-9.]/g, '');
    const parts = raw.split('.');
    if (parts.length > 2) {
      raw = parts[0] + '.' + parts.slice(1).join('');
    }
    // Limit decimal to 2 places
    if (parts.length === 2 && parts[1].length > 2) {
      raw = parts[0] + '.' + parts[1].slice(0, 2);
    }
    onChange(raw);
  };

  const handleClear = () => {
    onChange('');
    inputRef.current?.focus();
  };

  const validation = value ? parseRupeesToPaise(value) : null;

  return (
    <div className="w-full flex flex-col gap-3" id="amount-input-container">
      <div className="flex items-center justify-between">
        <label
          htmlFor="payment-amount-input"
          className="text-xs font-semibold uppercase tracking-wider text-stone-500"
        >
          Payment Amount
        </label>
        {validation?.isValid && (
          <span className="text-xs font-medium text-stone-500">
            {validation.amountPaise} paise
          </span>
        )}
      </div>

      {/* Input Field Frame */}
      <div
        className={`relative flex items-center bg-white rounded-2xl border-2 transition-all px-4 py-3.5 shadow-sm ${
          error
            ? 'border-rose-400 ring-2 ring-rose-100'
            : value && validation?.isValid
            ? 'border-emerald-500 ring-2 ring-emerald-50'
            : 'border-stone-200 focus-within:border-stone-800'
        }`}
      >
        <div className="flex items-center text-stone-400 mr-2 shrink-0">
          <IndianRupee className="w-6 h-6 stroke-[2.5] text-stone-700" />
        </div>

        <input
          id="payment-amount-input"
          ref={inputRef}
          type="text"
          inputMode="decimal"
          pattern="[0-9]*"
          placeholder="0.00"
          value={value}
          onChange={handleInputChange}
          className="w-full bg-transparent text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 outline-none placeholder:text-stone-300"
          autoComplete="off"
        />

        {value.length > 0 && (
          <button
            type="button"
            id="btn-clear-amount"
            onClick={handleClear}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition"
            aria-label="Clear amount"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Validation Error */}
      {error && (
        <p className="text-xs font-medium text-rose-600 px-1 flex items-center gap-1" id="amount-error-msg">
          <span>•</span> {error}
        </p>
      )}

      {/* Quick Amount Suggestion Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5 no-scrollbar">
        {QUICK_AMOUNTS.map((item) => (
          <button
            key={item.value}
            type="button"
            id={`chip-amount-${item.value}`}
            onClick={() => onChange(item.value)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition shrink-0 flex items-center gap-1 border ${
              value === item.value
                ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                : 'bg-stone-100 text-stone-700 border-stone-200 hover:bg-stone-200/70'
            }`}
          >
            <span>{item.label}</span>
            <span className="text-[10px] opacity-70 font-normal">({item.note})</span>
          </button>
        ))}
      </div>
    </div>
  );
};
