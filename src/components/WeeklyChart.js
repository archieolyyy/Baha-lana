import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getLevelForCm, TOTAL_HEIGHT_CM } from '../constants/floodLevels';
import { Colors, Gradients } from '../constants/colors';
import { Typography } from '../constants/typography';

const MAX_BAR_HEIGHT = 120;

const WeeklyChart = ({ data = [] }) => {
  return (
    <View style={styles.container}>
      <View style={styles.barsRow}>
        {data.map((item, i) => {
          const ratio = Math.min(item.cm / TOTAL_HEIGHT_CM, 1);
          const barH = ratio * MAX_BAR_HEIGHT || 4;
          const level = getLevelForCm(item.cm);

          return (
            <View key={i} style={styles.barCol}>
              <View style={styles.barTrack}>
                <LinearGradient
                  colors={item.cm > 0 ? level.gradient : ['rgba(255,255,255,0.06)', 'rgba(255,255,255,0.03)']}
                  start={{ x: 0, y: 1 }}
                  end={{ x: 0, y: 0 }}
                  style={[
                    styles.barFill,
                    {
                      height: barH,
                      shadowColor: level.color,
                      shadowOpacity: item.isToday ? 0.6 : 0,
                      shadowRadius: 8,
                    },
                  ]}
                />
              </View>
              <Text style={[styles.dayLabel, item.isToday && styles.todayLabel]}>
                {item.day}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  barsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 4,
  },
  barCol: {
    alignItems: 'center',
    flex: 1,
  },
  barTrack: {
    width: 18,
    height: MAX_BAR_HEIGHT,
    justifyContent: 'flex-end',
    borderRadius: 9,
    backgroundColor: 'rgba(255,255,255,0.04)',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderRadius: 9,
    minHeight: 4,
  },
  dayLabel: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginTop: 8,
    fontSize: 11,
  },
  todayLabel: {
    color: Colors.primaryLight,
    fontWeight: '700',
  },
});

export default WeeklyChart;
