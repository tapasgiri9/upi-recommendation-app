import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ImageSourcePropType } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { PaymentAppId } from '../types/paymentApp';

interface AppIconProps {
  appId: PaymentAppId;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showBadge?: boolean;
}

const ICON_DIMENSIONS = {
  sm: 32,
  md: 44,
  lg: 60,
  xl: 84,
};

// Map each payment app ID directly to its corresponding PNG file in the assets/ directory
const APP_ASSET_IMAGES: Record<PaymentAppId, ImageSourcePropType> = {
  kiwi: require('../../assets/kiwi.png'),
  navi: require('../../assets/navi_icon.png'),
  super_money: require('../../assets/super_money.png'),
  paytm: require('../../assets/paytm.png'),
  bhim: require('../../assets/bhim.png'),
  bhim_lite: require('../../assets/bhim_lite.png'),
};

export const AppIcon: React.FC<AppIconProps> = ({
  appId,
  size = 'md',
  showBadge = false,
}) => {
  const dimension = ICON_DIMENSIONS[size];
  const borderRadius = Math.round(dimension * 0.28);
  const [imageError, setImageError] = useState(false);

  // Fallback vector SVG renderer if image is missing or cannot be loaded
  const renderFallbackSvg = () => {
    switch (appId) {
      case 'kiwi':
        return (
          <View
            style={[
              styles.iconBase,
              {
                width: dimension,
                height: dimension,
                borderRadius,
                backgroundColor: '#16a34a',
              },
            ]}
          >
            <Svg width={dimension * 0.58} height={dimension * 0.58} viewBox="0 0 24 24">
              <Circle cx="12" cy="12" r="10" stroke="#ffffff" strokeWidth="2" fill="#14532d" />
              <Circle cx="12" cy="12" r="6" stroke="#86efac" strokeWidth="1.5" />
              <Circle cx="12" cy="12" r="2.5" fill="#fef08a" />
              <Path d="M12 4V7M12 17V20M4 12H7M17 12H20" stroke="#fef08a" strokeWidth="1.5" strokeLinecap="round" />
            </Svg>
          </View>
        );

      case 'navi':
        return (
          <View
            style={[
              styles.iconBase,
              {
                width: dimension,
                height: dimension,
                borderRadius,
                backgroundColor: '#0284c7',
              },
            ]}
          >
            <Svg width={dimension * 0.6} height={dimension * 0.6} viewBox="0 0 24 24">
              <Path
                d="M5 19V5L19 19V5"
                stroke="#ffffff"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Circle cx="19" cy="5" r="2.5" fill="#38bdf8" />
            </Svg>
          </View>
        );

      case 'super_money':
        return (
          <View
            style={[
              styles.iconBase,
              {
                width: dimension,
                height: dimension,
                borderRadius,
                backgroundColor: '#db2777',
              },
            ]}
          >
            <Svg width={dimension * 0.6} height={dimension * 0.6} viewBox="0 0 24 24">
              <Path
                d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
                fill="#fef08a"
                stroke="#ffffff"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </Svg>
          </View>
        );

      case 'paytm':
        return (
          <View
            style={[
              styles.iconBase,
              {
                width: dimension,
                height: dimension,
                borderRadius,
                backgroundColor: '#ffffff',
                borderWidth: 1,
                borderColor: '#e7e5e4',
              },
            ]}
          >
            <View style={styles.paytmRow}>
              <Text style={[styles.paytmPay, { fontSize: dimension * 0.3 }]}>Pay</Text>
              <Text style={[styles.paytmTm, { fontSize: dimension * 0.3 }]}>tm</Text>
            </View>
          </View>
        );

      case 'bhim':
        return (
          <View
            style={[
              styles.iconBase,
              {
                width: dimension,
                height: dimension,
                borderRadius,
                backgroundColor: '#0f172a',
              },
            ]}
          >
            <Svg width={dimension * 0.62} height={dimension * 0.62} viewBox="0 0 24 24">
              <Path d="M4 4L12 12L4 20" stroke="#f97316" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              <Path d="M11 4L19 12L11 20" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              <Circle cx="12" cy="12" r="1.5" fill="#38bdf8" />
            </Svg>
          </View>
        );

      case 'bhim_lite':
        return (
          <View
            style={[
              styles.iconBase,
              {
                width: dimension,
                height: dimension,
                borderRadius,
                backgroundColor: '#4f46e5',
              },
            ]}
          >
            <Svg width={dimension * 0.52} height={dimension * 0.52} viewBox="0 0 24 24">
              <Path
                d="M13 2L4 13H11V22L20 11H13V2Z"
                fill="#fbbf24"
                stroke="#ffffff"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
            </Svg>
          </View>
        );

      default:
        return (
          <View
            style={[
              styles.iconBase,
              {
                width: dimension,
                height: dimension,
                borderRadius,
                backgroundColor: '#e7e5e4',
              },
            ]}
          >
            <Text style={styles.defaultText}>UPI</Text>
          </View>
        );
    }
  };

  const imageSource = APP_ASSET_IMAGES[appId];

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.iconBase,
          {
            width: dimension,
            height: dimension,
            borderRadius,
          },
        ]}
      >
        {imageSource && !imageError ? (
          <Image
            source={imageSource}
            style={{
              width: dimension,
              height: dimension,
              borderRadius,
            }}
            resizeMode="cover"
            onError={() => setImageError(true)}
          />
        ) : (
          renderFallbackSvg()
        )}

        {/* Optional Badges */}
        {showBadge && appId === 'kiwi' && (
          <View style={styles.kiwiBadge}>
            <Text style={styles.kiwiBadgeText}>RUPAY</Text>
          </View>
        )}
        {appId === 'bhim_lite' && (
          <View style={styles.bhimLiteBadge}>
            <Text style={styles.bhimLiteBadgeText}>LITE</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBase: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  paytmRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paytmPay: {
    fontWeight: '900',
    color: '#002e6e',
    letterSpacing: -0.5,
  },
  paytmTm: {
    fontWeight: '900',
    color: '#00b9f1',
    letterSpacing: -0.5,
  },
  kiwiBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: '#facc15',
    paddingHorizontal: 3,
    paddingVertical: 1,
    borderRadius: 2,
    zIndex: 10,
  },
  kiwiBadgeText: {
    fontSize: 7,
    fontWeight: '800',
    color: '#1c1917',
  },
  bhimLiteBadge: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#f59e0b',
    paddingVertical: 1,
    alignItems: 'center',
    zIndex: 10,
  },
  bhimLiteBadgeText: {
    fontSize: 7,
    fontWeight: '900',
    color: '#1c1917',
    letterSpacing: 1,
  },
  defaultText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#57534e',
  },
});
