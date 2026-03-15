import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GlassCard from './GlassCard';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';
import { formatDateTime } from '../utils/helpers';

const HistoryCard = ({ entry }) => {
  const { level, cm, percent, timestamp } = entry;

  return (
    <GlassCard style={styles.card}>
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
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 14,
    marginBottom: 10,
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
    color: Colors.textPrimary,
  },
  tag: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  time: {
    ...Typography.caption,
    color: Colors.textMuted,
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
    color: Colors.textMuted,
  },
});

export default HistoryCard;
