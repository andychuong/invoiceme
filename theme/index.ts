import { createSystem, defaultConfig } from '@chakra-ui/react';

export const system = createSystem(defaultConfig, {
  theme: {
    tokens: {
      colors: {
        primary: {
          50: { value: '#EFF6FF' },
          100: { value: '#DBEAFE' },
          200: { value: '#BFDBFE' },
          300: { value: '#93C5FD' },
          400: { value: '#60A5FA' },
          500: { value: '#2563EB' },
          600: { value: '#1D4ED8' },
          700: { value: '#1E40AF' },
          800: { value: '#1E3A8A' },
          900: { value: '#1E3A8A' },
        },
        success: {
          50: { value: '#ECFDF5' },
          100: { value: '#D1FAE5' },
          200: { value: '#A7F3D0' },
          300: { value: '#6EE7B7' },
          400: { value: '#34D399' },
          500: { value: '#10B981' },
          600: { value: '#059669' },
          700: { value: '#047857' },
          800: { value: '#065F46' },
          900: { value: '#064E3B' },
        },
        amber: {
          50: { value: '#FFFBEB' },
          100: { value: '#FEF3C7' },
          200: { value: '#FDE68A' },
          300: { value: '#FCD34D' },
          400: { value: '#FBBF24' },
          500: { value: '#F59E0B' },
          600: { value: '#D97706' },
          700: { value: '#B45309' },
          800: { value: '#92400E' },
          900: { value: '#78350F' },
        },
      },
      fonts: {
        heading: { value: `var(--font-geist-sans), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif` },
        body: { value: `var(--font-geist-sans), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif` },
      },
    },
  },
  globalCss: {
    'body': {
      bg: 'gray.50',
      color: 'gray.900',
    },
  },
});

