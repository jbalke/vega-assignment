import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: id => {
          // Split node_modules into vendor chunks
          if (id.includes('node_modules')) {
            // Recharts is large, split it into its own chunk
            if (id.includes('recharts')) {
              return 'recharts';
            }
            // React and React DOM together
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            // React Router
            if (id.includes('react-router')) {
              return 'router';
            }
            // TanStack Query
            if (id.includes('@tanstack/react-query')) {
              return 'react-query';
            }
            // i18next and related
            if (id.includes('i18next') || id.includes('react-i18next')) {
              return 'i18n';
            }
            // All other node_modules
            return 'vendor';
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000, // Increase limit since we're splitting chunks
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    css: true,
    include: ['src/**/*.{test,spec}.{js,jsx,ts,tsx}'],
    exclude: ['node_modules/**', 'dist/**', 'e2e/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json-summary'],
      exclude: [
        'node_modules/**',
        'dist/**',
        'e2e/**',
        '**/*.test.{js,jsx,ts,tsx}',
        '**/*.spec.{js,jsx,ts,tsx}',
        '**/setupTests.ts',
        '**/*.d.ts',
        '**/*.config.{js,ts}',
        '**/types/**',
        '**/mocks/**',
        'src/i18n/translations/*.json',
        'src/i18n/i18n.ts',
        'src/data/**',
        'src/main.tsx',
      ],
      include: ['src/**/*.{js,jsx,ts,tsx}'],
      clean: true,
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
});
