import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {
  Layers,
  IndianRupee,
  Activity,
  History,
  TrendingUp,
} from 'lucide-react-native';
import { DashboardPeriod, PaymentRecord } from '../types/paymentRecord';
import { usageStorageService } from '../services/usageStorageService';
import { dashboardService } from '../services/dashboardService';
import { UsageSummary } from '../components/UsageSummary';
import { AppIcon } from '../components/AppIcon';
import { formatPaiseToRupees } from '../utils/amountUtils';
import { formatPaymentTime } from '../utils/dateUtils';
import { PAYMENT_APPS_MAP } from '../services/recommendationService';

const PERIOD_TABS: { id: DashboardPeriod; label: string }[] = [
  { id: 'today', label: 'Today' },
  { id: '7days', label: '7 Days' },
  { id: '30days', label: '30 Days' },
  { id: 'all', label: 'All' },
];

export const DashboardScreen: React.FC = () => {
  const [period, setPeriod] = useState<DashboardPeriod>('all');
  const [allRecords, setAllRecords] = useState<PaymentRecord[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const records = await usageStorageService.getPaymentHistory();
      setAllRecords(records);
    };

    fetchHistory();
    const unsubscribe = usageStorageService.subscribe(fetchHistory);
    return () => unsubscribe();
  }, []);

  const filteredRecords = dashboardService.getPaymentsForPeriod(allRecords, period);
  const summary = dashboardService.computeSummary(filteredRecords);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Header & Period Filters */}
      <View style={styles.headerBlock}>
        <View style={styles.titleRow}>
          <View style={styles.titleColumn}>
            <Text style={styles.screenTitle}>Payment Insights</Text>
            <Text style={styles.screenSubtitle}>
              Derived dynamically from your complete offline history
            </Text>
          </View>
          <View style={styles.trendingIconWrapper}>
            <TrendingUp size={16} color="#44403c" />
          </View>
        </View>

        {/* Period Selector Tabs */}
        <View style={styles.tabContainer}>
          {PERIOD_TABS.map((tab) => {
            const isSelected = period === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                onPress={() => setPeriod(tab.id)}
                activeOpacity={0.7}
                style={[
                  styles.tabButton,
                  isSelected && styles.tabButtonSelected,
                ]}
              >
                <Text
                  style={[
                    styles.tabButtonText,
                    isSelected && styles.tabButtonTextSelected,
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Summary KPI Cards */}
      <View style={styles.kpiRow}>
        {/* Count */}
        <View style={styles.kpiCard}>
          <View style={styles.kpiHeader}>
            <Text style={styles.kpiLabel}>Payments</Text>
            <Layers size={13} color="#a8a29e" />
          </View>
          <Text style={styles.kpiValue}>{summary.totalCount}</Text>
          <Text style={styles.kpiSub}>routed</Text>
        </View>

        {/* Total Amount */}
        <View style={styles.kpiCard}>
          <View style={styles.kpiHeader}>
            <Text style={styles.kpiLabel}>Total</Text>
            <IndianRupee size={13} color="#a8a29e" />
          </View>
          <Text style={styles.kpiValue} numberOfLines={1}>
            {formatPaiseToRupees(summary.totalAmountPaise, false)}
          </Text>
          <Text style={styles.kpiSub}>
            {summary.totalAmountPaise > 0
              ? `₹${(summary.totalAmountPaise / 100).toFixed(0)}`
              : '₹0'}
          </Text>
        </View>

        {/* Avg Amount */}
        <View style={styles.kpiCard}>
          <View style={styles.kpiHeader}>
            <Text style={styles.kpiLabel}>Average</Text>
            <Activity size={13} color="#a8a29e" />
          </View>
          <Text style={styles.kpiValue} numberOfLines={1}>
            {formatPaiseToRupees(summary.averageAmountPaise, false)}
          </Text>
          <Text style={styles.kpiSub}>per tx</Text>
        </View>
      </View>

      {/* App Usage Distribution */}
      <UsageSummary
        appStats={summary.appStats}
        totalCount={summary.totalCount}
      />

      {/* Recent Transactions Feed */}
      <View style={styles.historyCard}>
        <View style={styles.historyHeader}>
          <History size={14} color="#78716c" />
          <Text style={styles.historyTitle}>
            Recent History ({filteredRecords.length})
          </Text>
        </View>

        {filteredRecords.length === 0 ? (
          <View style={styles.historyEmpty}>
            <Text style={styles.historyEmptyText}>No payments in this period.</Text>
          </View>
        ) : (
          <View style={styles.historyList}>
            {filteredRecords.slice(0, 15).map((record, index) => {
              const app = PAYMENT_APPS_MAP[record.appId];
              return (
                <View
                  key={record.id}
                  style={[
                    styles.historyItem,
                    index < filteredRecords.length - 1 && styles.historyItemBorder,
                  ]}
                >
                  <View style={styles.historyItemLeft}>
                    <AppIcon appId={record.appId} size="sm" />
                    <View>
                      <View style={styles.historyItemAppRow}>
                        <Text style={styles.historyAppName}>
                          {app?.name || record.appId}
                        </Text>
                        {record.recommendationType === 'kiwi' && (
                          <View style={styles.tagKiwi}>
                            <Text style={styles.tagKiwiText}>RuPay</Text>
                          </View>
                        )}
                        {record.recommendationType === 'bhim_lite' && (
                          <View style={styles.tagLite}>
                            <Text style={styles.tagLiteText}>Lite</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.historyTime}>
                        {formatPaymentTime(record.timestamp)}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.historyAmount}>
                    {formatPaiseToRupees(record.amountPaise)}
                  </Text>
                </View>
              );
            })}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 40,
    gap: 16,
  },
  headerBlock: {
    gap: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleColumn: {
    flex: 1,
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1c1917',
    letterSpacing: -0.4,
  },
  screenSubtitle: {
    fontSize: 12,
    color: '#78716c',
    marginTop: 2,
  },
  trendingIconWrapper: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#f5f5f4',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f4',
    borderRadius: 16,
    padding: 4,
    borderWidth: 1,
    borderColor: '#e7e5e4',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    borderRadius: 12,
  },
  tabButtonSelected: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  tabButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#78716c',
  },
  tabButtonTextSelected: {
    color: '#1c1917',
    fontWeight: '800',
  },
  kpiRow: {
    flexDirection: 'row',
    gap: 8,
  },
  kpiCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e7e5e4',
    borderRadius: 18,
    padding: 12,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  kpiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  kpiLabel: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: '#78716c',
  },
  kpiValue: {
    fontSize: 16,
    fontWeight: '900',
    color: '#1c1917',
    marginTop: 6,
  },
  kpiSub: {
    fontSize: 10,
    color: '#a8a29e',
    fontWeight: '500',
    marginTop: 2,
  },
  historyCard: {
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
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  historyTitle: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: '#78716c',
  },
  historyEmpty: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  historyEmptyText: {
    fontSize: 12,
    color: '#a8a29e',
  },
  historyList: {
    gap: 2,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  historyItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f4',
  },
  historyItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  historyItemAppRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  historyAppName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1c1917',
  },
  historyTime: {
    fontSize: 11,
    color: '#a8a29e',
    marginTop: 1,
  },
  historyAmount: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1c1917',
  },
  tagKiwi: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  tagKiwiText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#166534',
  },
  tagLite: {
    backgroundColor: '#e0e7ff',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  tagLiteText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#4338ca',
  },
});
