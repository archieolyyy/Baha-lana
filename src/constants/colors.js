export const Colors = {
  // Primary gradient (background)
  bgTop: '#e8edf5',
  bgMid: '#1e3a5f',
  bgBottom: '#0a1628',

  /** Muted steel / ocean blue — matches navy UI, not electric blue */
  primary: '#3d5a73',
  primaryLight: '#8fafc4',
  primaryDark: '#2a4052',

  // Surface / Glass
  glass: 'rgba(255, 255, 255, 0.12)',
  glassBorder: 'rgba(255, 255, 255, 0.18)',
  glassDark: 'rgba(10, 22, 40, 0.55)',

  // Text
  textPrimary: '#ffffff',
  textSecondary: 'rgba(255, 255, 255, 0.7)',
  textMuted: 'rgba(255, 255, 255, 0.45)',
  textDark: '#0f172a',
  textDarkSecondary: '#475569',
  textOnGlass: 'rgba(255, 255, 255, 0.98)',
  textOnGlassSecondary: 'rgba(255, 255, 255, 0.82)',
  textOnGlassMuted: 'rgba(255, 255, 255, 0.72)',
  iconOnGlass: 'rgba(255, 255, 255, 0.96)',

  // Flood risk tiers
  safe: '#22c55e',
  safeGlow: 'rgba(34, 197, 94, 0.25)',
  warning: '#eab308',
  warningGlow: 'rgba(234, 179, 8, 0.25)',
  critical: '#f97316',
  criticalGlow: 'rgba(249, 115, 22, 0.25)',
  overflow: '#ef4444',
  overflowGlow: 'rgba(239, 68, 68, 0.25)',

  // Misc
  white: '#ffffff',
  black: '#000000',
  shadow: 'rgba(0, 0, 0, 0.3)',
  cardBg: 'rgba(255, 255, 255, 0.08)',
  divider: 'rgba(255, 255, 255, 0.1)',
  tabBarBg: 'rgba(10, 22, 40, 0.85)',
};

export const Gradients = {
  /** Auth sign-up: long white top, navy bottom (aligned with main app gradient tail) */
  authBgLight: ['#ffffff', '#ffffff', '#f8fafc', '#e8eef4', '#1e3a5f', '#0a1628'],
  /** Auth login: inverted — navy top, white bottom (mirror of authBgLight) */
  authBgLogin: ['#0a1628', '#1e3a5f', '#e8eef4', '#f8fafc', '#ffffff', '#ffffff'],
  /** Welcome: white/light top → soft blend → navy tail (full vertical gradient) */
  authBgWelcome: [
    '#ffffff',
    '#f8fafc',
    '#e8eef4',
    '#d0dce8',
    '#1e3a5f',
    '#0f1f35',
    '#0a1628',
  ],
  screenBg: ['#dde4f0', '#3b6ea5', '#152742', '#0a1628'],
  cardGlass: ['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.05)'],
  /** Primary CTAs — muted slate-blue */
  bluePill: ['#4a6b82', '#2f4557'],
  waterGauge: ['#4a6b82', '#2f4557'],
  /** Tab bar active pill */
  tabPill: ['#8fafc4', '#5d7a8f', '#3d5a73'],
  safe: ['#22c55e', '#16a34a'],
  warning: ['#eab308', '#ca8a04'],
  critical: ['#f97316', '#ea580c'],
  overflow: ['#ef4444', '#dc2626'],
};
