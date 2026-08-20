import * as RNWeb from 'react-native-web';

export const TurboModuleRegistry = {
  get: (_name: string) => null,
  getEnforcing: (_name: string) => null,
};

export const NativeModules = (RNWeb as any).NativeModules || {};

export const UIManager = (RNWeb as any).UIManager || {
  getViewManagerConfig: () => null,
};

// Re-export all standard exports from react-native-web
export * from 'react-native-web';

// Default export combining react-native-web with the native shims
const ReactNativeMock = {
  ...(RNWeb as any),
  TurboModuleRegistry,
  NativeModules,
  UIManager,
};

export default ReactNativeMock;
