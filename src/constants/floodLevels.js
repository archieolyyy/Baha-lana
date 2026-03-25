import { Colors } from './colors';

// Your enclosure height is 13.5 cm, split into 3 zones:
// - Safe:    0   to < 4.5 cm
// - Warning: 4.5 to < 9.0 cm
// - Danger:  9.0 to 13.5 cm
export const TOTAL_HEIGHT_CM = 13.5;

const SAFE_MAX_CM = 4.5;
const WARN_MAX_CM = 9.0;

// Softer green so it doesn't look too saturated.
const SAFE_COLOR = '#64b88a';
const SAFE_GLOW = 'rgba(100, 184, 138, 0.25)';
const SAFE_GRADIENT = ['#64b88a', '#3f8f6c'];

export const FLOOD_LEVELS = [
  {
    level: 1,
    label: 'Low',
    tag: 'Safe / Normal',
    minCm: 0,
    maxCm: SAFE_MAX_CM,
    color: SAFE_COLOR,
    glow: SAFE_GLOW,
    gradient: SAFE_GRADIENT,
    icon: 'water-outline',
  },
  {
    level: 2,
    label: 'Warning',
    tag: 'Yellow Warning',
    minCm: SAFE_MAX_CM,
    maxCm: WARN_MAX_CM,
    color: Colors.warning,
    glow: Colors.warningGlow,
    gradient: ['rgba(234,179,8,0.95)', 'rgba(202,140,4,0.95)'],
    icon: 'water',
  },
  {
    level: 3,
    label: 'Danger',
    tag: 'Red Alert / Dangerous',
    minCm: WARN_MAX_CM,
    maxCm: TOTAL_HEIGHT_CM,
    color: Colors.overflow,
    glow: Colors.overflowGlow,
    gradient: ['rgba(239,68,68,0.95)', 'rgba(220,38,38,0.95)'],
    icon: 'alert-circle',
  },
];

export const getLevelForCm = (cm) => {
  for (let i = FLOOD_LEVELS.length - 1; i >= 0; i--) {
    if (cm >= FLOOD_LEVELS[i].minCm) return FLOOD_LEVELS[i];
  }
  return FLOOD_LEVELS[0];
};

export const cmToPercent = (cm) => {
  // Requirement: 100% when the water is near the very top (approx 12–13 cm).
  const FULL_TRIGGER_CM = 12.0;
  if (cm >= FULL_TRIGGER_CM) return 100;
  return Math.min(100, Math.max(0, (cm / TOTAL_HEIGHT_CM) * 100));
};
