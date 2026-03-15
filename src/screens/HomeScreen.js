import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import WaterLevelGauge from '../components/WaterLevelGauge';
import FloodStatusBar from '../components/FloodStatusBar';
import WeeklyChart from '../components/WeeklyChart';
import GlassCard from '../components/GlassCard';
import { useFloodData } from '../hooks/useFloodData';
import { Colors, Gradients } from '../constants/colors';
import { Typography } from '../constants/typography';
import { getGreeting } from '../utils/helpers';

const { width } = Dimensions.get('window');

const HomeScreen = () => {
  const insets = useSafeAreaInsets();
  const {
    currentCm,
    currentPercent,
    currentLevel,
    weeklyData,
    loading,
    refresh,
  } = useFloodData();

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
          <View>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.title}>Flood Monitor</Text>
          </View>
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
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
            180 <Text style={styles.cmUnit}>cm</Text>
          </Text>
        </View>

        {/* Status bar */}
        <GlassCard style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <View style={styles.statusRow}>
              <Ionicons name={currentLevel.icon} size={18} color={currentLevel.color} />
              <Text style={[styles.statusLabel, { color: currentLevel.color }]}>
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
            <Ionicons name="water-outline" size={20} color={Colors.primaryLight} />
            <Text style={styles.statValue}>{currentCm} cm</Text>
            <Text style={styles.statLabel}>Water Level</Text>
          </GlassCard>
          <GlassCard style={styles.statCard}>
            <Ionicons name="speedometer-outline" size={20} color={Colors.primaryLight} />
            <Text style={styles.statValue}>{Math.round(currentPercent)}%</Text>
            <Text style={styles.statLabel}>Capacity</Text>
          </GlassCard>
          <GlassCard style={styles.statCard}>
            <Ionicons name="pulse-outline" size={20} color={Colors.primaryLight} />
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
  greeting: {
    ...Typography.caption,
    color: Colors.textDarkSecondary,
    marginBottom: 2,
  },
  title: {
    ...Typography.h1,
    color: Colors.textDark,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(34,197,94,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginTop: 4,
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: Colors.safe,
    marginRight: 5,
  },
  liveText: {
    ...Typography.label,
    color: Colors.safe,
    fontSize: 10,
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
  statusLabel: {
    ...Typography.bodyBold,
  },
  levelBadgeText: {
    ...Typography.label,
    color: Colors.textMuted,
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
    color: Colors.textPrimary,
    marginTop: 8,
  },
  statLabel: {
    ...Typography.caption,
    color: Colors.textMuted,
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
    color: Colors.textPrimary,
  },
  sectionSub: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginTop: 2,
  },
});

export default HomeScreen;
