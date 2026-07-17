// Islamic App Design Tokens — Dynamic Theme Support
export const DarkColors = {
  // Primary Brand
  primary: '#1B4D3E',
  primaryLight: '#2D6B57',
  primaryDark: '#0F2E25',

  // Accent
  gold: '#C9A84C',
  goldLight: '#E8C87A',
  goldDark: '#A07830',

  // Surface
  background: '#0D1F1A',
  surface: '#152B24',
  surfaceElevated: '#1E3D33',
  card: '#1A3028',
  cardBorder: '#2A4A3E',

  // Text
  textPrimary: '#F5F0E8',
  textSecondary: '#A8C4BB',
  textMuted: '#6B8F84',
  textArabic: '#F0E6D0',

  // Semantic
  success: '#4CAF7D',
  warning: '#E8A94C',
  error: '#E85C4A',
  info: '#4A9BE8',

  // Sajdah, Ruku indicators
  sajdah: '#C9A84C',
  ruku: '#4A9BE8',
  hizb: '#9B59B6',

  // Prayer times
  fajr: '#4A6B8A',
  sunrise: '#E8C87A',
  dhuhr: '#F5A623',
  asr: '#E8803A',
  maghrib: '#C96B4A',
  isha: '#2D3B7A',

  // Overlay
  overlay: 'rgba(0,0,0,0.6)',
  overlayLight: 'rgba(0,0,0,0.3)',

  // AI Chat
  aiMessage: '#1E3D33',
  userMessage: '#0F3D2D',
  chatInput: '#1A3028',
};

export const LightColors = {
  // Primary Brand
  primary: '#1B4D3E',
  primaryLight: '#2D6B57',
  primaryDark: '#0F2E25',

  // Accent
  gold: '#A07830',
  goldLight: '#C9A84C',
  goldDark: '#7A5C20',

  // Surface
  background: '#F5F0E8',
  surface: '#FFFFFF',
  surfaceElevated: '#F0EAE0',
  card: '#FAFAF5',
  cardBorder: '#E0D8C8',

  // Text
  textPrimary: '#1A2E28',
  textSecondary: '#4A6B62',
  textMuted: '#8A9E99',
  textArabic: '#2A3E35',

  // Semantic
  success: '#2E7D52',
  warning: '#B8772A',
  error: '#C0392B',
  info: '#2A6BB0',

  // Sajdah, Ruku indicators
  sajdah: '#A07830',
  ruku: '#2A6BB0',
  hizb: '#7B2D8B',

  // Prayer times
  fajr: '#2D4A6A',
  sunrise: '#B8772A',
  dhuhr: '#C5841C',
  asr: '#B85E2A',
  maghrib: '#9B4A2E',
  isha: '#1C2A6A',

  // Overlay
  overlay: 'rgba(0,0,0,0.4)',
  overlayLight: 'rgba(0,0,0,0.15)',

  // AI Chat
  aiMessage: '#EBF5F0',
  userMessage: '#D4EDE4',
  chatInput: '#FFFFFF',
};

// Default export — dark mode (for components that don't use theme context)
export const Colors = DarkColors;

export function getColors(theme: 'dark' | 'light') {
  return theme === 'light' ? LightColors : DarkColors;
}

export const Fonts = {
  arabic: 'System',
  body: 'System',
  sizes: {
    arabic_xl: 32,
    arabic_lg: 28,
    arabic_md: 24,
    arabic_sm: 20,
    h1: 28,
    h2: 24,
    h3: 20,
    h4: 18,
    body: 16,
    small: 14,
    xs: 12,
  },
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  round: 100,
};

export const Shadow = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  gold: {
    shadowColor: '#C9A84C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
};
