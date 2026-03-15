import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Defs, ClipPath, Path, Rect } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  withRepeat,
  Easing,
} from 'react-native-reanimated';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedRect = Animated.createAnimatedComponent(Rect);

const SIZE = 200;
const STROKE = 6;
const RADIUS = (SIZE - STROKE) / 2;
const CENTER = SIZE / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const WaterLevelGauge = ({ percent = 0, levelColor = Colors.primary, label = '' }) => {
  const fillHeight = useSharedValue(0);
  const waveOffset = useSharedValue(0);

  useEffect(() => {
    fillHeight.value = withTiming(percent / 100, {
      duration: 1200,
      easing: Easing.out(Easing.cubic),
    });
    waveOffset.value = withRepeat(
      withTiming(1, { duration: 2500, easing: Easing.linear }),
      -1,
      false,
    );
  }, [percent]);

  const waterProps = useAnimatedProps(() => {
    const h = fillHeight.value * SIZE;
    const y = SIZE - h;
    return { y, height: h };
  });

  const wave1Props = useAnimatedProps(() => {
    const h = fillHeight.value * SIZE;
    const y = SIZE - h;
    const shift = waveOffset.value * SIZE * 2;
    const d = `
      M ${-SIZE + shift} ${y}
      Q ${-SIZE * 0.75 + shift} ${y - 12}, ${-SIZE * 0.5 + shift} ${y}
      Q ${-SIZE * 0.25 + shift} ${y + 12}, ${0 + shift} ${y}
      Q ${SIZE * 0.25 + shift} ${y - 12}, ${SIZE * 0.5 + shift} ${y}
      Q ${SIZE * 0.75 + shift} ${y + 12}, ${SIZE + shift} ${y}
      L ${SIZE + shift} ${SIZE}
      L ${-SIZE + shift} ${SIZE}
      Z
    `;
    return { d };
  });

  const wave2Props = useAnimatedProps(() => {
    const h = fillHeight.value * SIZE;
    const y = SIZE - h + 5;
    const shift = waveOffset.value * SIZE * 2 - SIZE * 0.5;
    const d = `
      M ${-SIZE + shift} ${y}
      Q ${-SIZE * 0.75 + shift} ${y + 10}, ${-SIZE * 0.5 + shift} ${y}
      Q ${-SIZE * 0.25 + shift} ${y - 10}, ${0 + shift} ${y}
      Q ${SIZE * 0.25 + shift} ${y + 10}, ${SIZE * 0.5 + shift} ${y}
      Q ${SIZE * 0.75 + shift} ${y - 10}, ${SIZE + shift} ${y}
      L ${SIZE + shift} ${SIZE}
      L ${-SIZE + shift} ${SIZE}
      Z
    `;
    return { d };
  });

  return (
    <View style={styles.container}>
      <Svg width={SIZE} height={SIZE}>
        <Defs>
          <ClipPath id="circleClip">
            <Circle cx={CENTER} cy={CENTER} r={RADIUS - 4} />
          </ClipPath>
        </Defs>

        {/* Background circle */}
        <Circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={STROKE}
          fill="rgba(10,22,40,0.6)"
        />

        {/* Water fill clipped to circle */}
        <AnimatedPath
          animatedProps={wave2Props}
          fill={`${levelColor}33`}
          clipPath="url(#circleClip)"
        />
        <AnimatedPath
          animatedProps={wave1Props}
          fill={`${levelColor}88`}
          clipPath="url(#circleClip)"
        />
        <AnimatedRect
          animatedProps={waterProps}
          x={0}
          width={SIZE}
          fill={`${levelColor}55`}
          clipPath="url(#circleClip)"
        />

        {/* Outer ring accent */}
        <Circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          stroke={levelColor}
          strokeWidth={STROKE}
          fill="none"
          opacity={0.35}
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE * (1 - percent / 100)}
          strokeLinecap="round"
          transform={`rotate(-90 ${CENTER} ${CENTER})`}
        />
      </Svg>

      {/* Center text overlay */}
      <View style={styles.centerText}>
        <Text style={[styles.percentValue, { color: Colors.textPrimary }]}>
          {Math.round(percent)}
          <Text style={styles.percentSign}>%</Text>
        </Text>
        <Text style={[styles.levelLabel, { color: levelColor }]}>{label}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: SIZE,
    height: SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerText: {
    position: 'absolute',
    alignItems: 'center',
  },
  percentValue: {
    ...Typography.hero,
    fontSize: 44,
  },
  percentSign: {
    fontSize: 22,
    fontWeight: '400',
  },
  levelLabel: {
    ...Typography.label,
    marginTop: -2,
  },
});

export default WaterLevelGauge;
