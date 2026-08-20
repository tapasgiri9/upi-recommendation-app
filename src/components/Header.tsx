import React from 'react';
import { ShieldCheck, Smartphone } from 'lucide-react';

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({
  title = 'UPI Assistant',
  subtitle = 'Personal Payment Router',
}) => {
  return (
    <header className="w-full bg-white/95 backdrop-blur border-b border-stone-200 sticky top-0 z-20 px-4 py-3 sm:px-6">
      <div className="max-w-md mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-stone-900 text-white flex items-center justify-center shadow-sm">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-extrabold text-stone-900 leading-tight">
              {title}
            </h1>
            <p className="text-[11px] text-stone-500 font-medium">{subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>100% Offline</span>
        </div>
      </div>
    </header>
  );
};
