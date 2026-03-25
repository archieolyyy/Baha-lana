import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FLOOD_LEVELS } from '../constants/floodLevels';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';

const FloodStatusBar = ({ currentCm }) => {
  const isActiveLevel = (lvl) => currentCm >= lvl.minCm && currentCm < lvl.maxCm;

  return (
    <View style={styles.container}>
      <View style={styles.bar}>
        {FLOOD_LEVELS.map((lvl, i) => {
          const isActive = isActiveLevel(lvl);
          const isPast = currentCm >= lvl.maxCm;
          return (
            <View key={lvl.level} style={[styles.segment, { flex: lvl.maxCm - lvl.minCm }]}>
              <LinearGradient
                colors={
                  isActive || isPast
                    ? lvl.gradient
                    : ['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.04)']
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[
                  styles.segmentFill,
                  i === 0 && styles.firstSegment,
                  i === FLOOD_LEVELS.length - 1 && styles.lastSegment,
                ]}
              />
            </View>
          );
        })}
      </View>
      <View style={styles.labels}>
        {FLOOD_LEVELS.map((lvl) => {
          const active = isActiveLevel(lvl);
          return (
          <Text
            key={lvl.level}
            style={[
              styles.label,
              {
                flex: lvl.maxCm - lvl.minCm,
                color: active ? lvl.color : Colors.textOnGlassSecondary,
                fontWeight: active ? '700' : '600',
              },
            ]}
          >
            Lv{lvl.level}
          </Text>
        )})}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  bar: {
    flexDirection: 'row',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    gap: 3,
  },
  segment: {
    overflow: 'hidden',
  },
  segmentFill: {
    flex: 1,
  },
  firstSegment: {
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
  },
  lastSegment: {
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  labels: {
    flexDirection: 'row',
    marginTop: 6,
  },
  label: {
    ...Typography.caption,
    textAlign: 'center',
    fontSize: 10,
  },
});

export default FloodStatusBar;
