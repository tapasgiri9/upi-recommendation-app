import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { ShieldCheck, Smartphone } from 'lucide-react-native';

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({
  title = 'UPI Assistant',
  subtitle = 'Personal Payment Router',
}) => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerInner}>
        <View style={styles.leftRow}>
          <View style={styles.iconWrapper}>
            <Smartphone size={20} color="#ffffff" />
          </View>
          <View style={styles.textColumn}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
          </View>
        </View>

        <View style={styles.badge}>
          <ShieldCheck size={14} color="#15803d" />
          <Text style={styles.badgeText}>100% Offline</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e7e5e4',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 12 : 14,
    paddingBottom: 14,
  },
  headerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    maxWidth: 500,
    width: '100%',
    alignSelf: 'center',
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#1c1917',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textColumn: {
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1c1917',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 11,
    color: '#78716c',
    fontWeight: '500',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#15803d',
  },
});
