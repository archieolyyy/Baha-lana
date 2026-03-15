import { Colors, Gradients } from './colors';

export const TOTAL_HEIGHT_CM = 180;

export const FLOOD_LEVELS = [
  {
    level: 1,
    label: 'Low',
    tag: 'Safe / Normal',
    minCm: 0,
    maxCm: 90,
    color: Colors.safe,
    glow: Colors.safeGlow,
    gradient: Gradients.safe,
    icon: 'water-outline',
  },
  {
    level: 2,
    label: 'Medium',
    tag: 'Yellow Warning',
    minCm: 90,
    maxCm: 135,
    color: Colors.warning,
    glow: Colors.warningGlow,
    gradient: Gradients.warning,
    icon: 'water',
  },
  {
    level: 3,
    label: 'Critical',
    tag: 'Orange Alert',
    minCm: 135,
    maxCm: 160,
    color: Colors.critical,
    glow: Colors.criticalGlow,
    gradient: Gradients.critical,
    icon: 'warning-outline',
  },
  {
    level: 4,
    label: 'Overflow',
    tag: 'Red Alert / Evacuate',
    minCm: 160,
    maxCm: 180,
    color: Colors.overflow,
    glow: Colors.overflowGlow,
    gradient: Gradients.overflow,
    icon: 'alert-circle',
  },
];

export const getLevelForCm = (cm) => {
  for (let i = FLOOD_LEVELS.length - 1; i >= 0; i--) {
    if (cm >= FLOOD_LEVELS[i].minCm) return FLOOD_LEVELS[i];
  }
  return FLOOD_LEVELS[0];
};

export const cmToPercent = (cm) =>
  Math.min(100, Math.max(0, (cm / TOTAL_HEIGHT_CM) * 100));
