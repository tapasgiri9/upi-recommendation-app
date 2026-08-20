import React, { useState } from 'react';
import { Header } from './components/Header';
import { BottomNav, NavTab } from './components/BottomNav';
import { PayScreen } from './screens/PayScreen';
import { DashboardScreen } from './screens/DashboardScreen';
import { SettingsScreen } from './screens/SettingsScreen';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('pay');

  const renderActiveScreen = () => {
    switch (currentTab) {
      case 'pay':
        return <PayScreen />;
      case 'dashboard':
        return <DashboardScreen />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return <PayScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-stone-100/70 text-stone-900 flex flex-col font-sans selection:bg-stone-900 selection:text-white">
      {/* Top App Header */}
      <Header
        title="UPI Recommendation"
        subtitle="Personal Payment Router"
      />

      {/* Main Screen Content Area */}
      <main className="flex-1 w-full max-w-md mx-auto px-4 sm:px-5 pt-4">
        {renderActiveScreen()}
      </main>

      {/* Persistent Bottom Navigation */}
      <BottomNav currentTab={currentTab} onTabChange={setCurrentTab} />
    </div>
  );
}
