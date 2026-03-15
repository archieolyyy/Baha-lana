import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GlassCard from './GlassCard';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';
import { formatDateTime } from '../utils/helpers';

const AlertCard = ({ alert }) => {
  const { level, message, timestamp, read } = alert;

  return (
    <GlassCard style={[styles.card, !read && { borderColor: level.color }]}>
      <View style={styles.row}>
        <View style={[styles.iconWrap, { backgroundColor: level.glow }]}>
          <Ionicons name={level.icon} size={20} color={level.color} />
        </View>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={[styles.tag, { color: level.color }]}>
              Level {level.level} — {level.label}
            </Text>
            {!read && <View style={[styles.dot, { backgroundColor: level.color }]} />}
          </View>
          <Text style={styles.message}>{message}</Text>
          <Text style={styles.time}>{formatDateTime(timestamp)}</Text>
        </View>
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  tag: {
    ...Typography.caption,
    fontWeight: '700',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  message: {
    ...Typography.body,
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  time: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
});

export default AlertCard;
