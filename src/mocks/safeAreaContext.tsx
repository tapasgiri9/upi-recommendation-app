import React, { createContext, useContext } from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';

const defaultInsets = { top: 0, bottom: 0, left: 0, right: 0 };
const defaultFrame = { x: 0, y: 0, width: 0, height: 0 };

export const SafeAreaInsetsContext = createContext(defaultInsets);
export const SafeAreaFrameContext = createContext(defaultFrame);

export interface SafeAreaProviderProps {
  children?: React.ReactNode;
  initialMetrics?: any;
  initialSafeAreaInsets?: any;
  style?: any;
}

export function SafeAreaProvider({
  children,
  style,
}: SafeAreaProviderProps) {
  return (
    <SafeAreaInsetsContext.Provider value={defaultInsets}>
      <SafeAreaFrameContext.Provider value={defaultFrame}>
        <View style={[styles.fill, style]}>{children}</View>
      </SafeAreaFrameContext.Provider>
    </SafeAreaInsetsContext.Provider>
  );
}

export function SafeAreaView({
  children,
  style,
  ...props
}: ViewProps & { children?: React.ReactNode; edges?: any; mode?: any }) {
  return (
    <View style={style} {...props}>
      {children}
    </View>
  );
}

export function useSafeAreaInsets() {
  const insets = useContext(SafeAreaInsetsContext);
  return insets || defaultInsets;
}

export function useSafeAreaFrame() {
  const frame = useContext(SafeAreaFrameContext);
  return frame || defaultFrame;
}

export function withSafeAreaInsets(WrappedComponent: any) {
  return function WithSafeAreaInsets(props: any) {
    const insets = useSafeAreaInsets();
    return <WrappedComponent {...props} insets={insets} />;
  };
}

export const initialWindowMetrics = {
  insets: defaultInsets,
  frame: defaultFrame,
};

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
});

export default {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets,
  useSafeAreaFrame,
  withSafeAreaInsets,
  initialWindowMetrics,
  SafeAreaInsetsContext,
  SafeAreaFrameContext,
};
