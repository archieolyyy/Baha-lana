import { Platform } from 'react-native';

const fontFamily = Platform.select({
  ios: 'System',
  android: 'Roboto',
  default: 'System',
});

export const Typography = {
  hero: {
    fontFamily,
    fontSize: 48,
    fontWeight: '700',
    letterSpacing: -1,
  },
  h1: {
    fontFamily,
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  h2: {
    fontFamily,
    fontSize: 22,
    fontWeight: '600',
  },
  h3: {
    fontFamily,
    fontSize: 18,
    fontWeight: '600',
  },
  body: {
    fontFamily,
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 22,
  },
  bodyBold: {
    fontFamily,
    fontSize: 15,
    fontWeight: '600',
  },
  caption: {
    fontFamily,
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  label: {
    fontFamily,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
};
