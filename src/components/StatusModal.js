import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Gradients } from '../constants/colors';
import { Typography } from '../constants/typography';

const ICON_BY_TYPE = {
  success: 'checkmark-circle',
  error: 'close-circle',
  warning: 'alert-circle',
  info: 'information-circle',
};

const StatusModal = ({ visible, title, message, type = 'info', onClose, buttonLabel = 'OK' }) => {
  const iconName = ICON_BY_TYPE[type] || ICON_BY_TYPE.info;
  const iconColor =
    type === 'success'
      ? '#22c55e'
      : type === 'error'
        ? '#f87171'
        : type === 'warning'
          ? '#fbbf24'
          : '#60a5fa';

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={onClose} />
        <View style={styles.center} pointerEvents="box-none">
          <LinearGradient colors={['rgba(15,33,63,0.98)', 'rgba(8,21,42,0.98)']} style={styles.card}>
            <View style={styles.glow} />
            <LinearGradient colors={['rgba(37,99,235,0.22)', 'rgba(56,189,248,0.1)']} style={styles.iconWrap}>
              <Ionicons name={iconName} size={26} color={iconColor} />
            </LinearGradient>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>
            <TouchableOpacity onPress={onClose} style={styles.buttonWrap} activeOpacity={0.9}>
              <LinearGradient colors={['#3b82f6', '#1d4ed8']} style={styles.button}>
                <Text style={styles.buttonText}>{buttonLabel}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(3, 12, 24, 0.78)',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  center: {
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
  },
  card: {
    borderRadius: 34,
    paddingHorizontal: 24,
    paddingVertical: 22,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.24)',
    overflow: 'hidden',
  },
  glow: {
    position: 'absolute',
    right: -24,
    top: -20,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(59,130,246,0.14)',
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  title: {
    ...Typography.h2,
    color: Colors.white,
    marginBottom: 10,
    letterSpacing: -0.2,
  },
  message: {
    ...Typography.body,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 20,
    lineHeight: 23,
  },
  buttonWrap: {
    borderRadius: 16,
    overflow: 'hidden',
    alignSelf: 'flex-end',
    minWidth: 120,
    shadowColor: '#1d4ed8',
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  buttonText: {
    ...Typography.bodyBold,
    color: Colors.white,
    fontSize: 14,
    letterSpacing: 0.3,
  },
});

export default StatusModal;
