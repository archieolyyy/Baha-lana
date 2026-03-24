import React, { useEffect, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

/** Outlined-style: floating label sits on the top border (notch), not eating vertical space inside. */
const FloatingLabelInput = ({
  label,
  value,
  onChangeText,
  style,
  lastInGroup,
  onFocus: onFocusProp,
  onBlur: onBlurProp,
  ...rest
}) => {
  const { style: textInputStyle, ...textInputProps } = rest;
  const [focused, setFocused] = useState(false);
  const hasValue = value != null && String(value).trim().length > 0;
  const isFloating = focused || hasValue;
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(isFloating ? 1 : 0, { duration: 200 });
  }, [isFloating, progress]);

  const labelShellStyle = useAnimatedStyle(() => ({
    top: interpolate(progress.value, [0, 1], [17, -8]),
    paddingHorizontal: interpolate(progress.value, [0, 1], [0, 6]),
    paddingVertical: interpolate(progress.value, [0, 1], [0, 2]),
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      ['rgba(255,255,255,0)', '#ffffff'],
    ),
  }));

  const labelTextStyle = useAnimatedStyle(() => ({
    fontSize: interpolate(progress.value, [0, 1], [16, 11]),
    color: interpolateColor(progress.value, [0, 1], ['#94a3b8', '#0f172a']),
  }));

  return (
    <View style={[styles.wrap, lastInGroup && styles.wrapLast, style]}>
      <Animated.View style={[styles.labelShell, labelShellStyle]} pointerEvents="none">
        <Animated.Text style={[styles.labelText, labelTextStyle]}>{label}</Animated.Text>
      </Animated.View>
      <TextInput
        {...textInputProps}
        value={value}
        onChangeText={onChangeText}
        placeholder=""
        onFocus={(e) => {
          setFocused(true);
          onFocusProp?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlurProp?.(e);
        }}
        style={[styles.input, textInputStyle]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    marginTop: 6,
    minHeight: 52,
    marginBottom: 18,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(15,23,42,0.12)',
    backgroundColor: '#ffffff',
    overflow: 'visible',
  },
  wrapLast: {
    marginBottom: 0,
  },
  labelShell: {
    position: 'absolute',
    left: 12,
    zIndex: 2,
    borderRadius: 4,
  },
  labelText: {
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  input: {
    fontSize: 16,
    minHeight: 52,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: '#0f172a',
  },
});

export default FloatingLabelInput;
