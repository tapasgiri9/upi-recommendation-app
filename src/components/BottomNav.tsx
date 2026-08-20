import React from 'react';
import { CreditCard, LayoutDashboard, Settings } from 'lucide-react';

export type NavTab = 'pay' | 'dashboard' | 'settings';

interface BottomNavProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onTabChange }) => {
  const tabs = [
    { id: 'pay' as const, label: 'Pay', icon: CreditCard },
    { id: 'dashboard' as const, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'settings' as const, label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur border-t border-stone-200 z-30 pb-safe">
      <div className="max-w-md mx-auto flex items-center justify-around px-2 py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 py-1.5 px-3 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all ${
                isActive
                  ? 'text-stone-950 font-bold'
                  : 'text-stone-600 hover:text-stone-700 font-medium'
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition-all ${
                  isActive ? 'bg-stone-900 text-white shadow-sm' : 'bg-transparent text-stone-500'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-xs leading-none">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
