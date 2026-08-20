import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Share,
  Platform,
} from 'react-native';
import {
  Trash2,
  Database,
  Sparkles,
  Info,
  ShieldCheck,
  CheckCircle,
  Share2,
  Terminal,
  Smartphone,
} from 'lucide-react-native';
import { usageStorageService } from '../services/usageStorageService';

export const SettingsScreen: React.FC = () => {
  const [recordCount, setRecordCount] = useState<number>(0);
  const [showClearConfirm, setShowClearConfirm] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadCount = async () => {
    const records = await usageStorageService.getPaymentHistory();
    setRecordCount(records.length);
  };

  useEffect(() => {
    loadCount();
    const unsubscribe = usageStorageService.subscribe(loadCount);
    return () => unsubscribe();
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleClearHistory = async () => {
    await usageStorageService.clearPaymentHistory();
    setShowClearConfirm(false);
    triggerToast('Payment history has been cleared.');
  };

  const handleSeedSampleData = async () => {
    await usageStorageService.seedSampleHistory();
    triggerToast('Sample payments seeded successfully.');
  };

  const handleExportData = async () => {
    const records = await usageStorageService.getPaymentHistory();
    const jsonStr = JSON.stringify(records, null, 2);

    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      try {
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `upi_payment_history_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        triggerToast('Payment history JSON downloaded.');
        return;
      } catch {
        // Fallback to Share API
      }
    }

    try {
      await Share.share({
        title: 'UPI Payment History Export',
        message: jsonStr,
      });
      triggerToast('Export shared successfully.');
    } catch {
      triggerToast('Unable to share export data.');
    }
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Toast Alert */}
      {toastMessage && (
        <View style={styles.toast}>
          <CheckCircle size={16} color="#4ade80" />
          <Text style={styles.toastText}>{toastMessage}</Text>
        </View>
      )}

      {/* Screen Title */}
      <View style={styles.titleBlock}>
        <Text style={styles.screenTitle}>Settings</Text>
        <Text style={styles.screenSubtitle}>
          Personal configuration, privacy & offline storage
        </Text>
      </View>

      {/* Application Info Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Info size={16} color="#78716c" />
          <Text style={styles.cardTitle}>Application</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.rowLabel}>App Name</Text>
          <Text style={styles.rowValueBold}>UPI Recommendation Assistant</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.rowLabel}>Version</Text>
          <View style={styles.versionBadge}>
            <Text style={styles.versionText}>v1.0.0</Text>
          </View>
        </View>

        <View style={styles.row}>
          <Text style={styles.rowLabel}>Stored Records</Text>
          <Text style={styles.rowValueBold}>
            {recordCount} {recordCount === 1 ? 'transaction' : 'transactions'}
          </Text>
        </View>

        <View style={[styles.row, { borderBottomWidth: 0 }]}>
          <Text style={styles.rowLabel}>Architecture</Text>
          <View style={styles.offlineBadge}>
            <ShieldCheck size={14} color="#15803d" />
            <Text style={styles.offlineText}>100% Offline</Text>
          </View>
        </View>
      </View>

      {/* Data Storage Management */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Database size={16} color="#78716c" />
          <Text style={styles.cardTitle}>Data Storage</Text>
        </View>

        <Text style={styles.descText}>
          All recommendations are saved to your local device storage. No data is ever transmitted to external servers.
        </Text>

        <View style={styles.actionButtons}>
          {/* Seed Sample Records */}
          <TouchableOpacity
            onPress={handleSeedSampleData}
            activeOpacity={0.7}
            style={styles.actionButton}
          >
            <View style={styles.actionButtonLeft}>
              <Sparkles size={16} color="#f59e0b" />
              <Text style={styles.actionButtonText}>Seed Multi-Day Sample History</Text>
            </View>
            <Text style={styles.badgeSmall}>10 items</Text>
          </TouchableOpacity>

          {/* Export JSON */}
          <TouchableOpacity
            onPress={handleExportData}
            disabled={recordCount === 0}
            activeOpacity={0.7}
            style={[
              styles.actionButton,
              recordCount === 0 && styles.actionButtonDisabled,
            ]}
          >
            <View style={styles.actionButtonLeft}>
              <Share2 size={16} color="#78716c" />
              <Text
                style={[
                  styles.actionButtonText,
                  recordCount === 0 && styles.actionButtonTextDisabled,
                ]}
              >
                Export History (JSON / Share)
              </Text>
            </View>
            <Text style={styles.badgeSmall}>.json</Text>
          </TouchableOpacity>

          {/* Clear History */}
          {!showClearConfirm ? (
            <TouchableOpacity
              onPress={() => setShowClearConfirm(true)}
              disabled={recordCount === 0}
              activeOpacity={0.7}
              style={[
                styles.actionButtonDanger,
                recordCount === 0 && styles.actionButtonDisabled,
              ]}
            >
              <View style={styles.actionButtonLeft}>
                <Trash2 size={16} color="#e11d48" />
                <Text
                  style={[
                    styles.actionButtonDangerText,
                    recordCount === 0 && styles.actionButtonTextDisabled,
                  ]}
                >
                  Clear Payment History
                </Text>
              </View>
              <Text style={styles.badgeDanger}>Reset</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.confirmBox}>
              <Text style={styles.confirmTitle}>
                Are you sure you want to clear all history?
              </Text>
              <Text style={styles.confirmDesc}>
                This will delete all {recordCount} recorded payments. This action cannot be undone.
              </Text>
              <View style={styles.confirmRow}>
                <TouchableOpacity
                  onPress={handleClearHistory}
                  style={styles.confirmBtnYes}
                >
                  <Text style={styles.confirmBtnYesText}>Yes, Clear All</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setShowClearConfirm(false)}
                  style={styles.confirmBtnNo}
                >
                  <Text style={styles.confirmBtnNoText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </View>

      {/* Decision Rules Reference */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Terminal size={16} color="#78716c" />
          <Text style={styles.cardTitle}>Decision Rules Matrix</Text>
        </View>

        <View style={styles.ruleItems}>
          <View style={styles.ruleItem}>
            <Text style={styles.ruleRange}>₹0 – ₹50</Text>
            <View style={[styles.ruleTag, { backgroundColor: '#e0e7ff' }]}>
              <Text style={[styles.ruleTagText, { color: '#4338ca' }]}>
                BHIM UPI Lite
              </Text>
            </View>
          </View>

          <View style={styles.ruleItem}>
            <Text style={styles.ruleRange}>₹50.01 – ₹99.99</Text>
            <View style={[styles.ruleTag, { backgroundColor: '#f5f5f4' }]}>
              <Text style={[styles.ruleTagText, { color: '#292524' }]}>
                Balanced (Navi / super / Paytm / BHIM)
              </Text>
            </View>
          </View>

          <View style={styles.ruleItem}>
            <Text style={styles.ruleRange}>₹100+ (RuPay = YES)</Text>
            <View style={[styles.ruleTag, { backgroundColor: '#dcfce7' }]}>
              <Text style={[styles.ruleTagText, { color: '#166534' }]}>
                Kiwi (RuPay on UPI)
              </Text>
            </View>
          </View>

          <View style={styles.ruleItem}>
            <Text style={styles.ruleRange}>₹100+ (RuPay = NO)</Text>
            <View style={[styles.ruleTag, { backgroundColor: '#f5f5f4' }]}>
              <Text style={[styles.ruleTagText, { color: '#292524' }]}>
                Balanced (Navi / super / Paytm / BHIM)
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* EAS & APK Instructions */}
      <View style={styles.apkCard}>
        <View style={styles.apkHeader}>
          <Smartphone size={16} color="#facc15" />
          <Text style={styles.apkTitle}>Android APK & EAS Build</Text>
        </View>
        <Text style={styles.apkDesc}>
          To build an installable Android APK directly on your phone:
        </Text>
        <View style={styles.codeBox}>
          <Text style={styles.codeComment}># Run EAS Android build</Text>
          <Text style={styles.codeLine}>eas build --platform android --profile preview</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 40,
    gap: 16,
  },
  toast: {
    backgroundColor: '#1c1917',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  toastText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },
  titleBlock: {
    gap: 2,
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
  },
  card: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e7e5e4',
    borderRadius: 24,
    padding: 18,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: '#78716c',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f4',
  },
  rowLabel: {
    fontSize: 12,
    color: '#57534e',
    fontWeight: '500',
  },
  rowValueBold: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1c1917',
  },
  versionBadge: {
    backgroundColor: '#f5f5f4',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  versionText: {
    fontSize: 11,
    fontFamily: 'monospace',
    fontWeight: '700',
    color: '#1c1917',
  },
  offlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  offlineText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#15803d',
  },
  descText: {
    fontSize: 12,
    color: '#78716c',
    lineHeight: 17,
  },
  actionButtons: {
    gap: 8,
    marginTop: 4,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fafaf9',
    borderWidth: 1,
    borderColor: '#e7e5e4',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
  },
  actionButtonLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#292524',
  },
  actionButtonDisabled: {
    opacity: 0.5,
  },
  actionButtonTextDisabled: {
    color: '#a8a29e',
  },
  badgeSmall: {
    fontSize: 10,
    fontWeight: '700',
    color: '#a8a29e',
    textTransform: 'uppercase',
  },
  actionButtonDanger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff1f2',
    borderWidth: 1,
    borderColor: '#fecdd3',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
  },
  actionButtonDangerText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#e11d48',
  },
  badgeDanger: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fb7185',
  },
  confirmBox: {
    backgroundColor: '#fff1f2',
    borderWidth: 1,
    borderColor: '#fecdd3',
    borderRadius: 14,
    padding: 12,
    gap: 8,
  },
  confirmTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#881337',
  },
  confirmDesc: {
    fontSize: 11,
    color: '#9f1239',
  },
  confirmRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  confirmBtnYes: {
    flex: 1,
    backgroundColor: '#e11d48',
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  confirmBtnYesText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },
  confirmBtnNo: {
    flex: 1,
    backgroundColor: '#e7e5e4',
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  confirmBtnNoText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#44403c',
  },
  ruleItems: {
    gap: 8,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fafaf9',
    borderWidth: 1,
    borderColor: '#f5f5f4',
    padding: 10,
    borderRadius: 12,
  },
  ruleRange: {
    fontSize: 12,
    fontWeight: '600',
    color: '#44403c',
  },
  ruleTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  ruleTagText: {
    fontSize: 10,
    fontWeight: '700',
  },
  apkCard: {
    backgroundColor: '#1c1917',
    borderRadius: 24,
    padding: 18,
    gap: 10,
  },
  apkHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  apkTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#facc15',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  apkDesc: {
    fontSize: 12,
    color: '#d6d3d1',
  },
  codeBox: {
    backgroundColor: '#0c0a09',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#292524',
    gap: 4,
  },
  codeComment: {
    fontSize: 11,
    color: '#4ade80',
    fontFamily: 'monospace',
    fontWeight: '600',
  },
  codeLine: {
    fontSize: 11,
    color: '#f5f5f4',
    fontFamily: 'monospace',
  },
});
