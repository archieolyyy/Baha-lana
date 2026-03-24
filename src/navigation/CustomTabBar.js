import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Gradients } from '../constants/colors';
import { Typography } from '../constants/typography';

const TAB_CONFIG = [
  { name: 'Home', icon: 'home', iconActive: 'home' },
  { name: 'History', icon: 'time-outline', iconActive: 'time' },
  { name: 'Weather', icon: 'cloud-outline', iconActive: 'cloud' },
  { name: 'Alerts', icon: 'notifications-outline', iconActive: 'notifications' },
  { name: 'Profile', icon: 'person-outline', iconActive: 'person' },
];

const CustomTabBar = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrapper, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      <View style={styles.container}>
        <BlurView intensity={72} tint="dark" style={StyleSheet.absoluteFill} />
        <View style={styles.containerInner}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const config = TAB_CONFIG[index];

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              activeOpacity={0.7}
              style={styles.tab}
            >
              <View style={styles.iconWrap}>
                <Ionicons
                  name={isFocused ? config.iconActive : config.icon}
                  size={22}
                  color={isFocused ? Colors.primaryLight : Colors.textMuted}
                />
              </View>
              <Text
                style={[
                  styles.label,
                  { color: isFocused ? Colors.primaryLight : Colors.textMuted, fontWeight: isFocused ? '700' : '500' },
                ]}
              >
                {config.name}
              </Text>
              {isFocused && (
                <LinearGradient
                  colors={Gradients.tabPill}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.activePill}
                />
              )}
            </TouchableOpacity>
          );
        })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 12,
    paddingTop: 0,
  },
  container: {
    overflow: 'hidden',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35,
        shadowRadius: 24,
      },
      android: {
        elevation: 24,
      },
    }),
  },
  containerInner: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 6,
    backgroundColor: 'rgba(10, 22, 40, 0.6)',
  },
  tab: {
    flex: 1,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 4,
  },
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  activePill: {
    position: 'absolute',
    bottom: 0,
    width: 24,
    height: 3,
    borderRadius: 2,
    opacity: 0.95,
  },
  label: {
    ...Typography.caption,
    fontSize: 10,
    letterSpacing: 0.3,
  },
});

export default CustomTabBar;
