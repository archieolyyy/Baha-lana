import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';
import { formatDateTime } from '../utils/helpers';

const HistoryCard = ({ entry }) => {
  const { level, cm, percent, timestamp } = entry;

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={[styles.levelBadge, { backgroundColor: level.glow }]}>
          <Ionicons name={level.icon} size={18} color={level.color} />
        </View>

        <View style={styles.info}>
          <Text style={styles.levelText}>
            <Text style={{ color: level.color }}>Lv{level.level}</Text>
            {'  '}
            <Text style={styles.tag}>{level.tag}</Text>
          </Text>
          <Text style={styles.time}>{formatDateTime(timestamp)}</Text>
        </View>

        <View style={styles.values}>
          <Text style={[styles.cm, { color: level.color }]}>{cm} cm</Text>
          <Text style={styles.percent}>{Math.round(percent)}%</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 14,
    marginBottom: 10,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.08)',
    shadowColor: '#0a1628',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  levelBadge: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  levelText: {
    ...Typography.bodyBold,
    color: Colors.textDark,
  },
  tag: {
    ...Typography.caption,
    color: Colors.textDarkSecondary,
  },
  time: {
    ...Typography.caption,
    color: Colors.textDarkSecondary,
    marginTop: 2,
  },
  values: {
    alignItems: 'flex-end',
  },
  cm: {
    ...Typography.bodyBold,
  },
  percent: {
    ...Typography.caption,
    color: Colors.textDarkSecondary,
  },
});

export default HistoryCard;
