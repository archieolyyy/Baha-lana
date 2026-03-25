import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const GlassCard = ({ children, style, dark }) => {
  const colors = dark
    ? ['rgba(20, 38, 62, 0.92)', 'rgba(12, 24, 42, 0.88)']
    : ['rgba(68, 96, 132, 0.9)', 'rgba(34, 59, 92, 0.86)'];

  return (
    <View style={[styles.shell, dark ? styles.shellDark : styles.shellLight, styles.defaultPad, style]}>
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.fill}
        pointerEvents="none"
      />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  shell: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: '#0a1628',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.14,
        shadowRadius: 16,
      },
      android: { elevation: 2 },
    }),
  },
  shellLight: {
    borderColor: 'rgba(173, 201, 233, 0.35)',
    backgroundColor: 'rgba(42, 68, 102, 0.88)',
  },
  shellDark: {
    borderColor: 'rgba(255, 255, 255, 0.2)',
    backgroundColor: 'rgba(12, 24, 42, 0.88)',
  },
  defaultPad: {
    padding: 20,
  },
  fill: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default GlassCard;
