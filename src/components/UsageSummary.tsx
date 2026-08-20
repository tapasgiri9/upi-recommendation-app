import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AppUsageStats } from '../types/paymentRecord';
import { AppIcon } from './AppIcon';
import { formatPaiseToRupees } from '../utils/amountUtils';

interface UsageSummaryProps {
  appStats: AppUsageStats[];
  totalCount: number;
}

export const UsageSummary: React.FC<UsageSummaryProps> = ({ appStats, totalCount }) => {
  const sortedStats = [...appStats].sort((a, b) => {
    if (b.count !== a.count) return b.count - a.count;
    return b.totalAmountPaise - a.totalAmountPaise;
  });

  const maxCount = Math.max(...appStats.map((s) => s.count), 1);

  return (
    <View style={styles.container}>
      {/* Distribution Bars */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Usage Distribution</Text>

        {totalCount === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No payments recorded for this period yet.</Text>
          </View>
        ) : (
          <View style={styles.barsList}>
            {sortedStats.map((stat) => {
              const barWidthPercent = totalCount > 0 ? (stat.count / maxCount) * 100 : 0;
              const barColor = getBarColor(stat.appId);

              return (
                <View key={stat.appId} style={styles.barRow}>
                  <View style={styles.barHeader}>
                    <View style={styles.appInfo}>
                      <AppIcon appId={stat.appId} size="sm" />
                      <Text style={styles.appName}>{stat.appName}</Text>
                    </View>
                    <View style={styles.countInfo}>
                      <Text style={styles.countText}>
                        {stat.count} {stat.count === 1 ? 'payment' : 'payments'}
                      </Text>
                      <Text style={styles.percentText}>
                        ({Math.round(stat.percentageOfTotal)}%)
                      </Text>
                    </View>
                  </View>

                  {/* Horizontal Bar Track */}
                  <View style={styles.barTrack}>
                    <View
                      style={[
                        styles.barFill,
                        {
                          width: `${Math.max(barWidthPercent, 4)}%`,
                          backgroundColor: barColor,
                        },
                      ]}
                    />
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </View>

      {/* Per-App Detailed Cards */}
      <View style={styles.cardsGrid}>
        {sortedStats.map((stat) => (
          <View key={`card-${stat.appId}`} style={styles.statCard}>
            <View style={styles.statCardLeft}>
              <AppIcon appId={stat.appId} size="md" />
              <View>
                <Text style={styles.statCardAppName}>{stat.appName}</Text>
                <Text style={styles.statCardCount}>
                  {stat.count} {stat.count === 1 ? 'payment' : 'payments'}
                </Text>
              </View>
            </View>

            <View style={styles.statCardRight}>
              <Text style={styles.statCardTotal}>
                {formatPaiseToRupees(stat.totalAmountPaise)}
              </Text>
              {stat.count > 0 && (
                <Text style={styles.statCardAvg}>
                  avg {formatPaiseToRupees(stat.averageAmountPaise)}
                </Text>
              )}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

function getBarColor(appId: string): string {
  switch (appId) {
    case 'kiwi':
      return '#16a34a';
    case 'navi':
      return '#0284c7';
    case 'super_money':
      return '#db2777';
    case 'paytm':
      return '#00b9f1';
    case 'bhim':
      return '#ea580c';
    case 'bhim_lite':
      return '#4f46e5';
    default:
      return '#78716c';
  }
}

const styles = StyleSheet.create({
  container: {
    gap: 14,
    width: '100%',
  },
  card: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e7e5e4',
    borderRadius: 20,
    padding: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: '#78716c',
  },
  emptyContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 12,
    color: '#a8a29e',
  },
  barsList: {
    gap: 12,
  },
  barRow: {
    gap: 6,
  },
  barHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  appInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  appName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1c1917',
  },
  countInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  countText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#44403c',
  },
  percentText: {
    fontSize: 11,
    color: '#a8a29e',
  },
  barTrack: {
    height: 8,
    backgroundColor: '#f5f5f4',
    borderRadius: 999,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 999,
  },
  cardsGrid: {
    gap: 10,
  },
  statCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e7e5e4',
    borderRadius: 18,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  statCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statCardAppName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1c1917',
  },
  statCardCount: {
    fontSize: 11,
    color: '#78716c',
    marginTop: 1,
  },
  statCardRight: {
    alignItems: 'flex-end',
  },
  statCardTotal: {
    fontSize: 14,
    fontWeight: '900',
    color: '#1c1917',
  },
  statCardAvg: {
    fontSize: 11,
    color: '#a8a29e',
    fontWeight: '500',
    marginTop: 1,
  },
});
