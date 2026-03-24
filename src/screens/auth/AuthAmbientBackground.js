import React, { useEffect } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Gradients } from '../../constants/colors';

const BLOBS_DEEP = [
  'rgba(96, 165, 250, 0.45)',
  'rgba(59, 130, 246, 0.35)',
  'rgba(147, 197, 253, 0.3)',
];

const BLOBS_AIRY = [
  'rgba(255, 255, 255, 0.5)',
  'rgba(148, 197, 255, 0.18)',
  'rgba(15, 35, 70, 0.45)',
];

const BLOBS_LOGIN = [
  'rgba(30, 58, 138, 0.4)',
  'rgba(148, 197, 255, 0.18)',
  'rgba(255, 255, 255, 0.42)',
];

const BLOBS_WELCOME = [
  'rgba(255, 255, 255, 0.4)',
  'rgba(148, 197, 255, 0.14)',
  'rgba(15, 35, 70, 0.38)',
];

const Blob = ({ style, color }) => (
  <Animated.View style={[styles.blobBase, { backgroundColor: color }, style]} />
);

/** @param {{ tone?: 'deep' | 'airy' | 'login' | 'welcome' }} props */
const AuthAmbientBackground = ({ tone = 'deep' }) => {
  const { width: W, height: H } = useWindowDimensions();
  const drift = useSharedValue(0);
  const drift2 = useSharedValue(0);
  const shimmer = useSharedValue(0);

  useEffect(() => {
    drift.value = withRepeat(
      withTiming(1, { duration: 9000, easing: Easing.inOut(Easing.quad) }),
      -1,
      true,
    );
    drift2.value = withRepeat(
      withTiming(1, { duration: 12000, easing: Easing.inOut(Easing.quad) }),
      -1,
      true,
    );
    shimmer.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 3500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 3500, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      false,
    );
  }, [drift, drift2, shimmer]);

  const blobA = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(drift.value, [0, 1], [-W * 0.06, W * 0.08]) },
      { translateY: interpolate(drift.value, [0, 1], [H * 0.02, -H * 0.05]) },
      { scale: interpolate(drift.value, [0, 1], [1, 1.12]) },
    ],
    opacity: interpolate(drift.value, [0, 1], [0.28, 0.42]),
  }));

  const blobB = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(drift2.value, [0, 1], [W * 0.04, -W * 0.1]) },
      { translateY: interpolate(drift2.value, [0, 1], [-H * 0.08, H * 0.06]) },
      { scale: interpolate(drift2.value, [0, 1], [1.05, 0.95]) },
    ],
    opacity: interpolate(drift2.value, [0, 1], [0.2, 0.38]),
  }));

  const blobC = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(shimmer.value, [0, 1], [0, W * 0.03]) },
      { translateY: interpolate(shimmer.value, [0, 1], [0, -H * 0.04]) },
    ],
    opacity: interpolate(
      shimmer.value,
      [0, 1],
      tone === 'airy' || tone === 'login' || tone === 'welcome'
        ? [0.2, 0.42]
        : [0.12, 0.28],
    ),
  }));

  const gradientColors =
    tone === 'airy'
      ? Gradients.authBgLight
      : tone === 'login'
        ? Gradients.authBgLogin
        : tone === 'welcome'
          ? Gradients.authBgWelcome
          : Gradients.screenBg;
  const gradientLocations =
    tone === 'airy' || tone === 'login'
      ? [0, 0.18, 0.36, 0.48, 0.62, 1]
      : tone === 'welcome'
        ? [0, 0.12, 0.28, 0.42, 0.52, 0.72, 1]
        : [0, 0.32, 0.62, 1];
  const blobColors =
    tone === 'airy'
      ? BLOBS_AIRY
      : tone === 'login'
        ? BLOBS_LOGIN
        : tone === 'welcome'
          ? BLOBS_WELCOME
          : BLOBS_DEEP;

  return (
    <>
      <LinearGradient
        colors={gradientColors}
        style={StyleSheet.absoluteFill}
        locations={gradientLocations}
        start={
          tone === 'welcome' ? { x: 0.5, y: 0 } : { x: 0.1, y: 0 }
        }
        end={tone === 'welcome' ? { x: 0.5, y: 1 } : { x: 0.9, y: 1 }}
      />
      <Blob
        color={blobColors[0]}
        style={[
          styles.blobLg,
          { top: -H * 0.12, left: -W * 0.2, width: W * 0.85, height: W * 0.85 },
          blobA,
        ]}
      />
      <Blob
        color={blobColors[1]}
        style={[
          styles.blobMd,
          { bottom: H * 0.08, right: -W * 0.15, width: W * 0.7, height: W * 0.7 },
          blobB,
        ]}
      />
      <Blob
        color={blobColors[2]}
        style={[
          styles.blobSm,
          { top: H * 0.35, right: W * 0.05, width: W * 0.45, height: W * 0.45 },
          blobC,
        ]}
      />
    </>
  );
};

const styles = StyleSheet.create({
  blobBase: {
    position: 'absolute',
    borderRadius: 9999,
  },
  blobLg: {},
  blobMd: {},
  blobSm: {},
});

export default AuthAmbientBackground;
