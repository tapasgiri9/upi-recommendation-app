import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CreditCard, Check, X } from 'lucide-react-native';

interface RupaySelectorProps {
  value: boolean | null;
  onChange: (val: boolean) => void;
}

export const RupaySelector: React.FC<RupaySelectorProps> = ({ value, onChange }) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.iconContainer}>
          <CreditCard size={18} color="#166534" />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Does merchant accept RuPay on UPI?</Text>
          <Text style={styles.subtitle}>Required for transactions of ₹100 or more</Text>
        </View>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          onPress={() => onChange(true)}
          activeOpacity={0.7}
          style={[
            styles.button,
            value === true ? styles.btnYesActive : styles.btnInactive,
          ]}
        >
          <Check
            size={18}
            color={value === true ? '#ffffff' : '#166534'}
            strokeWidth={3}
          />
          <Text
            style={[
              styles.btnText,
              value === true ? styles.btnTextYesActive : styles.btnTextInactive,
            ]}
          >
            YES (RuPay)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onChange(false)}
          activeOpacity={0.7}
          style={[
            styles.button,
            value === false ? styles.btnNoActive : styles.btnInactive,
          ]}
        >
          <X
            size={18}
            color={value === false ? '#ffffff' : '#44403c'}
            strokeWidth={3}
          />
          <Text
            style={[
              styles.btnText,
              value === false ? styles.btnTextNoActive : styles.btnTextInactive,
            ]}
          >
            NO (Standard)
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fafaf9',
    borderWidth: 1,
    borderColor: '#e7e5e4',
    borderRadius: 20,
    padding: 16,
    gap: 14,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconContainer: {
    padding: 8,
    borderRadius: 10,
    backgroundColor: '#dcfce7',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1c1917',
  },
  subtitle: {
    fontSize: 11,
    color: '#78716c',
    marginTop: 1,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  btnInactive: {
    backgroundColor: '#ffffff',
    borderColor: '#e7e5e4',
  },
  btnYesActive: {
    backgroundColor: '#16a34a',
    borderColor: '#16a34a',
  },
  btnNoActive: {
    backgroundColor: '#1c1917',
    borderColor: '#1c1917',
  },
  btnText: {
    fontSize: 13,
    fontWeight: '700',
  },
  btnTextInactive: {
    color: '#44403c',
  },
  btnTextYesActive: {
    color: '#ffffff',
  },
  btnTextNoActive: {
    color: '#ffffff',
  },
});
