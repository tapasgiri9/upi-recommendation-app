import React from 'react';
import { PaymentAppId } from '../types/paymentApp';

interface AppIconProps {
  appId: PaymentAppId;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showBadge?: boolean;
}

const SIZE_MAP = {
  sm: 'w-7 h-7 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-base',
  xl: 'w-20 h-20 text-xl',
};

const ICON_PIXELS = {
  sm: 28,
  md: 40,
  lg: 56,
  xl: 80,
};

export const AppIcon: React.FC<AppIconProps> = ({
  appId,
  size = 'md',
  className = '',
  showBadge = false,
}) => {
  const pixelSize = ICON_PIXELS[size];

  const renderVectorIcon = () => {
    switch (appId) {
      case 'kiwi':
        return (
          <div
            id={`icon-kiwi-${size}`}
            className="w-full h-full rounded-2xl flex items-center justify-center relative overflow-hidden shadow-sm"
            style={{
              background: 'linear-gradient(135deg, #15803d 0%, #22c55e 60%, #86efac 100%)',
            }}
          >
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:6px_6px]" />
            <div className="relative flex flex-col items-center justify-center text-white">
              {/* Kiwi Fruit/Credit Emblem */}
              <svg width={pixelSize * 0.55} height={pixelSize * 0.55} viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" fill="#166534" fillOpacity="0.4" />
                <circle cx="12" cy="12" r="6" stroke="#bbf7d0" strokeWidth="1.5" />
                <circle cx="12" cy="12" r="2.5" fill="#fef08a" />
                <path d="M12 4V7M12 17V20M4 12H7M17 12H20" stroke="#fef08a" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            {showBadge && (
              <span className="absolute bottom-0.5 right-0.5 text-[8px] font-bold bg-amber-400 text-stone-900 px-1 rounded-sm shadow">
                RUPAY
              </span>
            )}
          </div>
        );

      case 'navi':
        return (
          <div
            id={`icon-navi-${size}`}
            className="w-full h-full rounded-2xl flex items-center justify-center relative overflow-hidden shadow-sm"
            style={{
              background: 'linear-gradient(135deg, #0369a1 0%, #0284c7 50%, #38bdf8 100%)',
            }}
          >
            <div className="relative flex items-center justify-center text-white font-black tracking-tight">
              <svg width={pixelSize * 0.6} height={pixelSize * 0.6} viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 19V5L19 19V5"
                  stroke="white"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="19" cy="5" r="2.5" fill="#38bdf8" />
              </svg>
            </div>
          </div>
        );

      case 'super_money':
        return (
          <div
            id={`icon-super-money-${size}`}
            className="w-full h-full rounded-2xl flex items-center justify-center relative overflow-hidden shadow-sm"
            style={{
              background: 'linear-gradient(135deg, #701a75 0%, #ec4899 50%, #f43f5e 100%)',
            }}
          >
            <div className="relative flex flex-col items-center justify-center text-white font-extrabold leading-none">
              <svg width={pixelSize * 0.6} height={pixelSize * 0.6} viewBox="0 0 24 24" fill="none">
                <path
                  d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
                  fill="#fef08a"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        );

      case 'paytm':
        return (
          <div
            id={`icon-paytm-${size}`}
            className="w-full h-full rounded-2xl flex flex-col items-center justify-center relative overflow-hidden bg-white shadow-sm border border-stone-200"
          >
            <div className="flex items-center justify-center">
              <span className="font-extrabold tracking-tighter text-[#002e6e]" style={{ fontSize: pixelSize * 0.32 }}>
                Pay
              </span>
              <span className="font-extrabold tracking-tighter text-[#00b9f1]" style={{ fontSize: pixelSize * 0.32 }}>
                tm
              </span>
            </div>
          </div>
        );

      case 'bhim':
        return (
          <div
            id={`icon-bhim-${size}`}
            className="w-full h-full rounded-2xl flex items-center justify-center relative overflow-hidden shadow-sm"
            style={{
              background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            }}
          >
            {/* BHIM tricolor chevron motif */}
            <svg width={pixelSize * 0.62} height={pixelSize * 0.62} viewBox="0 0 24 24" fill="none">
              <path d="M4 4L12 12L4 20" stroke="#f97316" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M11 4L19 12L11 20" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="12" cy="12" r="1.5" fill="#38bdf8" />
            </svg>
          </div>
        );

      case 'bhim_lite':
        return (
          <div
            id={`icon-bhim-lite-${size}`}
            className="w-full h-full rounded-2xl flex items-center justify-center relative overflow-hidden shadow-sm"
            style={{
              background: 'linear-gradient(135deg, #3730a3 0%, #4f46e5 50%, #6366f1 100%)',
            }}
          >
            <div className="relative flex flex-col items-center justify-center text-white">
              <svg width={pixelSize * 0.58} height={pixelSize * 0.58} viewBox="0 0 24 24" fill="none">
                <path
                  d="M13 2L4 13H11V22L20 11H13V2Z"
                  fill="#fbbf24"
                  stroke="#ffffff"
                  strokeWidth="1.2"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="absolute bottom-0 inset-x-0 bg-amber-400 text-stone-900 text-[8px] font-black text-center tracking-widest py-0.2">
              LITE
            </div>
          </div>
        );

      default:
        return (
          <div className="w-full h-full rounded-2xl bg-stone-200 flex items-center justify-center text-stone-600 font-bold">
            UPI
          </div>
        );
    }
  };

  return (
    <div
      className={`inline-flex shrink-0 select-none items-center justify-center ${SIZE_MAP[size]} ${className}`}
    >
      {renderVectorIcon()}
    </div>
  );
};
