import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { defineConfig, Plugin } from 'vite';

function reactNativeWebExtensionsPlugin(): Plugin {
  const webExts = ['.web.tsx', '.web.ts', '.web.jsx', '.web.js'];
  return {
    name: 'react-native-web-extensions',
    enforce: 'pre',
    resolveId(source, importer) {
      if (!importer || source.startsWith('\0')) return null;
      if (source.startsWith('.')) {
        const dir = path.dirname(importer);
        const resolved = path.resolve(dir, source);
        for (const ext of webExts) {
          if (fs.existsSync(resolved + ext)) {
            return resolved + ext;
          }
          const noExt = resolved.replace(/\.(js|jsx|ts|tsx)$/, '');
          if (fs.existsSync(noExt + ext)) {
            return noExt + ext;
          }
        }
      }
      return null;
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [reactNativeWebExtensionsPlugin(), react(), tailwindcss()],
    resolve: {
      alias: [
        {
          find: 'react-native-safe-area-context',
          replacement: path.resolve(__dirname, 'src/mocks/safeAreaContext.tsx'),
        },
        {
          find: 'react-native/Libraries/Utilities/codegenNativeComponent',
          replacement: path.resolve(__dirname, 'src/mocks/codegenNativeComponent.ts'),
        },
        {
          find: '@react-native/assets-registry/registry',
          replacement: path.resolve(__dirname, 'src/mocks/assetsRegistry.ts'),
        },
        {
          find: '@',
          replacement: path.resolve(__dirname, '.'),
        },
        {
          find: 'react-native',
          replacement: path.resolve(__dirname, 'src/mocks/reactNative.ts'),
        },
      ],
      extensions: ['.web.tsx', '.web.ts', '.web.jsx', '.web.js', '.tsx', '.ts', '.jsx', '.js'],
    },
    optimizeDeps: {
      esbuildOptions: {
        resolveExtensions: [
          '.web.tsx',
          '.web.ts',
          '.web.jsx',
          '.web.js',
          '.tsx',
          '.ts',
          '.jsx',
          '.js',
        ],
      },
    },
    define: {
      global: 'window',
      __DEV__: JSON.stringify(process.env.NODE_ENV !== 'production'),
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
