import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';

const GlassCard = ({ children, style, dark }) => (
  <View style={[styles.card, dark && styles.dark, style]}>
    {children}
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.glass,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    padding: 20,
    overflow: 'hidden',
  },
  dark: {
    backgroundColor: Colors.glassDark,
  },
});

export default GlassCard;
