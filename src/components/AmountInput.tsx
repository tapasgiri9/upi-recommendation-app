import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { IndianRupee, X } from 'lucide-react-native';
import { parseRupeesToPaise } from '../utils/amountUtils';

interface AmountInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string | null;
}

const QUICK_AMOUNTS = [
  { label: '₹30', value: '30', note: 'Lite (≤₹50)' },
  { label: '₹75', value: '75', note: 'Balanced' },
  { label: '₹150', value: '150', note: 'RuPay / Kiwi' },
  { label: '₹500', value: '500', note: 'Large UPI' },
];

export const AmountInput: React.FC<AmountInputProps> = ({
  value,
  onChange,
  error,
}) => {
  const handleTextChange = (text: string) => {
    let raw = text.replace(/[^0-9.]/g, '');
    const parts = raw.split('.');
    if (parts.length > 2) {
      raw = parts[0] + '.' + parts.slice(1).join('');
    }
    if (parts.length === 2 && parts[1].length > 2) {
      raw = parts[0] + '.' + parts[1].slice(0, 2);
    }
    onChange(raw);
  };

  const validation = value ? parseRupeesToPaise(value) : null;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.label}>Payment Amount</Text>
        {validation?.isValid && (
          <Text style={styles.paiseText}>{validation.amountPaise} paise</Text>
        )}
      </View>

      {/* Input Field Frame */}
      <View
        style={[
          styles.inputFrame,
          error
            ? styles.inputFrameError
            : value && validation?.isValid
            ? styles.inputFrameValid
            : styles.inputFrameDefault,
        ]}
      >
        <View style={styles.symbolContainer}>
          <IndianRupee size={24} color="#44403c" strokeWidth={2.5} />
        </View>

        <TextInput
          value={value}
          onChangeText={handleTextChange}
          placeholder="0.00"
          placeholderTextColor="#d6d3d1"
          keyboardType="decimal-pad"
          style={styles.textInput}
          autoCorrect={false}
          autoCapitalize="none"
        />

        {value.length > 0 && (
          <TouchableOpacity
            onPress={() => onChange('')}
            style={styles.clearButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <X size={16} color="#78716c" />
          </TouchableOpacity>
        )}
      </View>

      {/* Validation Error */}
      {error && <Text style={styles.errorText}>• {error}</Text>}

      {/* Quick Amount Suggestion Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsScroll}
      >
        {QUICK_AMOUNTS.map((item) => {
          const isSelected = value === item.value;
          return (
            <TouchableOpacity
              key={item.value}
              onPress={() => onChange(item.value)}
              activeOpacity={0.7}
              style={[
                styles.chip,
                isSelected ? styles.chipSelected : styles.chipDefault,
              ]}
            >
              <Text style={[styles.chipText, isSelected ? styles.chipTextSelected : styles.chipTextDefault]}>
                {item.label}
              </Text>
              <Text style={[styles.chipNote, isSelected ? styles.chipNoteSelected : styles.chipNoteDefault]}>
                ({item.note})
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 10,
    width: '100%',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#78716c',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  paiseText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#78716c',
  },
  inputFrame: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 18,
    borderWidth: 2,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  inputFrameDefault: {
    borderColor: '#e7e5e4',
  },
  inputFrameValid: {
    borderColor: '#10b981',
  },
  inputFrameError: {
    borderColor: '#f43f5e',
  },
  symbolContainer: {
    marginRight: 6,
  },
  textInput: {
    flex: 1,
    fontSize: 28,
    fontWeight: '800',
    color: '#1c1917',
    padding: 0,
  },
  clearButton: {
    padding: 6,
    backgroundColor: '#f5f5f4',
    borderRadius: 999,
  },
  errorText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#e11d48',
    paddingHorizontal: 4,
  },
  chipsScroll: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 2,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
  },
  chipDefault: {
    backgroundColor: '#f5f5f4',
    borderColor: '#e7e5e4',
  },
  chipSelected: {
    backgroundColor: '#1c1917',
    borderColor: '#1c1917',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  chipTextDefault: {
    color: '#292524',
  },
  chipTextSelected: {
    color: '#ffffff',
  },
  chipNote: {
    fontSize: 10,
  },
  chipNoteDefault: {
    color: '#78716c',
  },
  chipNoteSelected: {
    color: '#d6d3d1',
  },
});
