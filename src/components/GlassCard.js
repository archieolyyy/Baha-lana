import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

const BLUR = {
  light: { intensity: Platform.OS === 'ios' ? 52 : 42, tint: 'light' },
  dark: { intensity: Platform.OS === 'ios' ? 48 : 38, tint: 'dark' },
};

const GlassCard = ({ children, style, dark }) => {
  const b = dark ? BLUR.dark : BLUR.light;
  return (
    <View style={[styles.shell, dark ? styles.shellDark : styles.shellLight, styles.defaultPad, style]}>
      <BlurView intensity={b.intensity} tint={b.tint} style={styles.blur} pointerEvents="none" />
      <LinearGradient
        colors={
          dark
            ? ['rgba(12, 24, 44, 0.68)', 'rgba(8, 16, 32, 0.46)', 'rgba(6, 12, 24, 0.38)']
            : ['rgba(255, 255, 255, 0.26)', 'rgba(255, 255, 255, 0.08)', 'rgba(230, 238, 250, 0.04)']
        }
        locations={dark ? [0, 0.55, 1] : [0, 0.5, 1]}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={styles.tint}
        pointerEvents="none"
      />
      {!dark ? (
        <LinearGradient
          colors={['rgba(255,255,255,0.2)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.highlight}
          pointerEvents="none"
        />
      ) : (
        <LinearGradient
          colors={['rgba(255,255,255,0.1)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.6, y: 0.7 }}
          style={styles.highlight}
          pointerEvents="none"
        />
      )}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  shell: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth * 2,
    ...Platform.select({
      ios: {
        shadowColor: '#0a1628',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
      },
      android: { elevation: 8 },
    }),
  },
  shellLight: {
    borderColor: 'rgba(255, 255, 255, 0.38)',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  shellDark: {
    borderColor: 'rgba(255, 255, 255, 0.16)',
    backgroundColor: 'rgba(6, 14, 28, 0.35)',
  },
  defaultPad: {
    padding: 20,
  },
  blur: {
    ...StyleSheet.absoluteFillObject,
  },
  tint: {
    ...StyleSheet.absoluteFillObject,
  },
  highlight: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.55,
  },
});

export default GlassCard;
