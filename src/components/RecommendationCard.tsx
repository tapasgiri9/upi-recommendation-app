import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CheckCircle2, ChevronDown, ChevronUp, Sparkles, RefreshCw } from 'lucide-react-native';
import { RecommendationResult } from '../types/recommendation';
import { AppIcon } from './AppIcon';
import { formatPaiseToRupees } from '../utils/amountUtils';
import { PAYMENT_APPS_MAP } from '../services/recommendationService';

interface RecommendationCardProps {
  result: RecommendationResult;
  onReset: () => void;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  result,
  onReset,
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const { app, reason, amountPaise, recommendationType, probabilitiesSnapshot } = result;

  return (
    <View style={styles.card}>
      {/* Header Eyebrow */}
      <View style={styles.eyebrow}>
        <Sparkles size={14} color="#f59e0b" />
        <Text style={styles.eyebrowText}>Recommended App</Text>
      </View>

      {/* Main App Display */}
      <View style={styles.appDisplay}>
        <View style={styles.iconContainer}>
          <AppIcon appId={app.id} size="xl" showBadge={app.id === 'kiwi'} />
        </View>

        <Text style={styles.appName}>{app.name}</Text>
        <Text style={styles.appTagline}>{app.tagline}</Text>
      </View>

      {/* Amount & Reason Box */}
      <View style={styles.detailsBox}>
        <View style={styles.amountRow}>
          <Text style={styles.amountLabel}>Amount</Text>
          <Text style={styles.amountValue}>{formatPaiseToRupees(amountPaise)}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.reasonBlock}>
          <Text style={styles.reasonLabel}>Reason:</Text>
          <Text style={styles.reasonText}>{reason}</Text>
        </View>

        <View style={styles.recordedBanner}>
          <CheckCircle2 size={16} color="#16a34a" />
          <Text style={styles.recordedText}>Recorded in local history</Text>
        </View>
      </View>

      {/* Balancing Transparency for Balanced Rule */}
      {recommendationType === 'balanced' && probabilitiesSnapshot && (
        <View style={styles.weightsSection}>
          <TouchableOpacity
            onPress={() => setShowDetails(!showDetails)}
            activeOpacity={0.7}
            style={styles.weightsToggle}
          >
            <Text style={styles.weightsToggleText}>Algorithm Balancing Weights</Text>
            {showDetails ? (
              <ChevronUp size={16} color="#78716c" />
            ) : (
              <ChevronDown size={16} color="#78716c" />
            )}
          </TouchableOpacity>

          {showDetails && (
            <View style={styles.weightsContent}>
              <Text style={styles.formulaText}>
                Formula: weight = 1 / (usage + 1)
              </Text>
              <View style={styles.weightsList}>
                {Object.entries(probabilitiesSnapshot).map(([id, prob]) => {
                  const itemApp = PAYMENT_APPS_MAP[id as keyof typeof PAYMENT_APPS_MAP];
                  const numProb = Number(prob) || 0;
                  const percent = Math.round(numProb * 100);
                  const isWinner = id === app.id;
                  return (
                    <View key={id} style={styles.weightItem}>
                      <View style={styles.weightItemLeft}>
                        <AppIcon appId={id as any} size="sm" />
                        <Text style={[styles.weightAppName, isWinner && styles.weightAppNameWinner]}>
                          {itemApp?.name || id}
                        </Text>
                        {isWinner && (
                          <View style={styles.winnerBadge}>
                            <Text style={styles.winnerBadgeText}>PICKED</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.weightPercent}>{percent}% chance</Text>
                    </View>
                  );
                })}
              </View>
            </View>
          )}
        </View>
      )}

      {/* Primary Action Button */}
      <TouchableOpacity
        onPress={onReset}
        activeOpacity={0.8}
        style={styles.resetButton}
      >
        <RefreshCw size={18} color="#ffffff" />
        <Text style={styles.resetButtonText}>New Recommendation</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e7e5e4',
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    width: '100%',
  },
  eyebrow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#f5f5f4',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
  },
  eyebrowText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#44403c',
  },
  appDisplay: {
    alignItems: 'center',
    gap: 6,
  },
  iconContainer: {
    padding: 6,
    backgroundColor: '#fafaf9',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#f5f5f4',
  },
  appName: {
    fontSize: 26,
    fontWeight: '900',
    color: '#1c1917',
    letterSpacing: -0.5,
    marginTop: 4,
  },
  appTagline: {
    fontSize: 12,
    color: '#78716c',
    fontWeight: '500',
  },
  detailsBox: {
    width: '100%',
    backgroundColor: '#fafaf9',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e7e5e4',
    gap: 10,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  amountLabel: {
    fontSize: 12,
    color: '#78716c',
    fontWeight: '600',
  },
  amountValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1c1917',
  },
  divider: {
    height: 1,
    backgroundColor: '#e7e5e4',
  },
  reasonBlock: {
    gap: 2,
  },
  reasonLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#44403c',
  },
  reasonText: {
    fontSize: 13,
    color: '#1c1917',
    fontWeight: '600',
    lineHeight: 18,
  },
  recordedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 4,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e7e5e4',
  },
  recordedText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#16a34a',
  },
  weightsSection: {
    width: '100%',
  },
  weightsToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  weightsToggleText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#78716c',
  },
  weightsContent: {
    marginTop: 8,
    padding: 12,
    backgroundColor: '#fafaf9',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e7e5e4',
    gap: 8,
  },
  formulaText: {
    fontSize: 11,
    color: '#78716c',
    fontFamily: 'monospace',
  },
  weightsList: {
    gap: 8,
  },
  weightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  weightItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  weightAppName: {
    fontSize: 12,
    color: '#44403c',
    fontWeight: '600',
  },
  weightAppNameWinner: {
    fontWeight: '800',
    color: '#1c1917',
  },
  winnerBadge: {
    backgroundColor: '#1c1917',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  winnerBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#ffffff',
  },
  weightPercent: {
    fontSize: 12,
    fontWeight: '700',
    color: '#44403c',
  },
  resetButton: {
    width: '100%',
    backgroundColor: '#1c1917',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  resetButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
});
