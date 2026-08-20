import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { CreditCard, LayoutDashboard, Settings } from 'lucide-react-native';

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
    <View style={styles.navContainer}>
      <View style={styles.navInner}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <TouchableOpacity
              key={tab.id}
              onPress={() => onTabChange(tab.id)}
              activeOpacity={0.7}
              style={styles.tabButton}
            >
              <View
                style={[
                  styles.iconWrapper,
                  isActive ? styles.iconWrapperActive : styles.iconWrapperInactive,
                ]}
              >
                <Icon size={20} color={isActive ? '#ffffff' : '#78716c'} />
              </View>
              <Text style={[styles.tabLabel, isActive ? styles.tabLabelActive : styles.tabLabelInactive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  navContainer: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e7e5e4',
    paddingBottom: Platform.OS === 'ios' ? 24 : 10,
    paddingTop: 8,
    paddingHorizontal: 16,
  },
  navInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    maxWidth: 500,
    width: '100%',
    alignSelf: 'center',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    paddingVertical: 4,
  },
  iconWrapper: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapperActive: {
    backgroundColor: '#1c1917',
  },
  iconWrapperInactive: {
    backgroundColor: 'transparent',
  },
  tabLabel: {
    fontSize: 11,
  },
  tabLabelActive: {
    fontWeight: '800',
    color: '#1c1917',
  },
  tabLabelInactive: {
    fontWeight: '600',
    color: '#78716c',
  },
});
