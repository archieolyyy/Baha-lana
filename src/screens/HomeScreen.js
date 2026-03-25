import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import WaterLevelGauge from '../components/WaterLevelGauge';
import FloodStatusBar from '../components/FloodStatusBar';
import WeeklyChart from '../components/WeeklyChart';
import GlassCard from '../components/GlassCard';
import { useFloodData } from '../hooks/useFloodData';
import { Colors, Gradients } from '../constants/colors';
import { Typography } from '../constants/typography';
import { getGreeting } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';
import { TOTAL_HEIGHT_CM } from '../constants/floodLevels';

const HomeScreen = () => {
  const insets = useSafeAreaInsets();
  const { displayName } = useAuth();
  const firstName = displayName ? displayName.trim().split(/\s+/)[0] : 'User';
  const {
    currentCm,
    currentPercent,
    currentLevel,
    weeklyData,
    loading,
    refresh,
  } = useFloodData();
  const statusAccent = currentLevel.level === 1 ? '#64b88a' : currentLevel.color;

  const livePulse = useSharedValue(0);

  useEffect(() => {
    livePulse.value = withRepeat(
      withTiming(1, { duration: 1600, easing: Easing.inOut(Easing.quad) }),
      -1,
      true
    );
  }, []);

  const liveDotAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + livePulse.value * 0.18 }],
    opacity: 0.82 + livePulse.value * 0.18,
  }));

  return (
    <LinearGradient colors={Gradients.screenBg} style={styles.root} locations={[0, 0.35, 0.65, 1]}>
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 16 }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refresh} tintColor={Colors.primaryLight} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.greetingWrap}>
            <Text
              style={styles.title}
              numberOfLines={1}
              ellipsizeMode="tail"
              adjustsFontSizeToFit
              minimumFontScale={0.75}
            >
              {`${getGreeting()}, ${firstName}`}
            </Text>
          </View>
          <View style={styles.liveBadge}>
            <Animated.View style={[styles.liveDot, liveDotAnimStyle]} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        </View>

        {/* Gauge */}
        <View style={styles.gaugeSection}>
          <WaterLevelGauge
            percent={currentPercent}
            levelColor={currentLevel.color}
            label={currentLevel.label}
          />
          <Text style={styles.cmText}>
            {currentCm} <Text style={styles.cmUnit}>cm</Text>
            <Text style={styles.cmDivider}> / </Text>
            {TOTAL_HEIGHT_CM} <Text style={styles.cmUnit}>cm</Text>
          </Text>
        </View>

        {/* Status bar */}
        <GlassCard style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <View style={[styles.statusRow, styles.statusTagPill]}>
              <Ionicons name={currentLevel.icon} size={18} color={statusAccent} />
              <Text style={[styles.statusLabel, { color: statusAccent }]}>
                {currentLevel.tag}
              </Text>
            </View>
            <Text style={styles.levelBadgeText}>Lv{currentLevel.level}</Text>
          </View>
          <FloodStatusBar currentCm={currentCm} />
        </GlassCard>

        {/* Sensor stats */}
        <View style={styles.statsRow}>
          <GlassCard style={styles.statCard}>
            <Ionicons name="water-outline" size={22} color={Colors.iconOnGlass} />
            <Text style={styles.statValue}>{currentCm} cm</Text>
            <Text style={styles.statLabel}>Water Level</Text>
          </GlassCard>
          <GlassCard style={styles.statCard}>
            <Ionicons name="speedometer-outline" size={22} color={Colors.iconOnGlass} />
            <Text style={styles.statValue}>{Math.round(currentPercent)}%</Text>
            <Text style={styles.statLabel}>Capacity</Text>
          </GlassCard>
          <GlassCard style={styles.statCard}>
            <Ionicons name="pulse-outline" size={22} color={Colors.iconOnGlass} />
            <Text style={styles.statValue}>Active</Text>
            <Text style={styles.statLabel}>Sensor</Text>
          </GlassCard>
        </View>

        {/* Weekly chart */}
        <GlassCard dark style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Text style={styles.sectionTitle}>This Week</Text>
            <Text style={styles.sectionSub}>Daily peak levels</Text>
          </View>
          <WeeklyChart data={weeklyData} />
        </GlassCard>

        <View style={{ height: 100 }} />
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scroll: {
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  greetingWrap: {
    flex: 1,
    flexDirection: 'column',
    paddingRight: 12, // keeps text from colliding with the LIVE badge
  },
  // keep title compact so it's always a single line
  title: {
    ...Typography.h1,
    color: Colors.textDark,
    marginBottom: 2,
    fontSize: 24,
    flexShrink: 1,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(34, 197, 94, 0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.22)',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 999,
    marginTop: 4,
    flexShrink: 0,
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOpacity: 0.5,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: 'rgba(74, 222, 128, 0.95)',
    marginRight: 5,
  },
  liveText: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
    color: 'rgba(255, 255, 255, 0.88)',
    textTransform: 'uppercase',
  },
  gaugeSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  cmText: {
    ...Typography.h2,
    color: Colors.textPrimary,
    marginTop: 12,
  },
  cmUnit: {
    ...Typography.body,
    color: Colors.textSecondary,
    fontWeight: '400',
  },
  cmDivider: {
    color: Colors.textMuted,
  },
  statusCard: {
    marginBottom: 16,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusTagPill: {
    backgroundColor: 'rgba(255,255,255,0.28)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  statusLabel: {
    ...Typography.bodyBold,
    textShadowColor: 'rgba(255,255,255,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  levelBadgeText: {
    ...Typography.label,
    color: Colors.textOnGlassSecondary,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  statValue: {
    ...Typography.bodyBold,
    color: Colors.textOnGlass,
    marginTop: 8,
  },
  statLabel: {
    ...Typography.caption,
    color: Colors.textOnGlassSecondary,
    marginTop: 2,
  },
  chartCard: {
    marginBottom: 8,
  },
  chartHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    ...Typography.h3,
    color: Colors.textOnGlass,
  },
  sectionSub: {
    ...Typography.caption,
    color: Colors.textOnGlassMuted,
    marginTop: 2,
  },
});

export default HomeScreen;
