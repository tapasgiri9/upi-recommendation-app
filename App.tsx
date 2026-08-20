import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, Platform, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { Header } from './src/components/Header';
import { BottomNav, NavTab } from './src/components/BottomNav';
import { PayScreen } from './src/screens/PayScreen';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';

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
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <ExpoStatusBar style="dark" />
        <View style={styles.container}>
          {/* Top Header */}
          <Header title="UPI Assistant" subtitle="Personal Payment Router" />

          {/* Main Screen Content */}
          <View style={styles.content}>
            <View style={styles.screenWrapper}>{renderActiveScreen()}</View>
          </View>

          {/* Bottom Persistent Navigation */}
          <BottomNav currentTab={currentTab} onTabChange={setCurrentTab} />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f4',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  screenWrapper: {
    flex: 1,
    maxWidth: 500,
    width: '100%',
    alignSelf: 'center',
  },
});
