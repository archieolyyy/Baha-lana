import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';
import { formatDateTime } from '../utils/helpers';

const AlertCard = ({ alert }) => {
  const { level, message, timestamp, read } = alert;

  return (
    <View style={[styles.card, !read && styles.cardUnread, !read && { borderColor: level.color }]}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginBottom: 12,
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
  cardUnread: {
    borderWidth: 1.5,
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
    color: Colors.textDark,
    marginBottom: 6,
  },
  time: {
    ...Typography.caption,
    color: Colors.textDarkSecondary,
  },
});

export default AlertCard;
