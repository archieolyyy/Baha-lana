import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GlassCard from '../components/GlassCard';
import { Colors, Gradients } from '../constants/colors';
import { Typography } from '../constants/typography';

const MOCK_WEATHER = {
  temp: 29,
  feelsLike: 33,
  condition: 'Partly Cloudy',
  icon: 'partly-sunny',
  humidity: 78,
  windSpeed: 12,
  rainfall: 2.4,
  pressure: 1008,
  visibility: 8,
  uvIndex: 6,
};

const FORECAST = [
  { day: 'Today', icon: 'partly-sunny', high: 31, low: 25, rain: 40 },
  { day: 'Mon', icon: 'rainy', high: 28, low: 24, rain: 80 },
  { day: 'Tue', icon: 'thunderstorm', high: 27, low: 23, rain: 90 },
  { day: 'Wed', icon: 'rainy', high: 28, low: 24, rain: 70 },
  { day: 'Thu', icon: 'cloudy', high: 30, low: 25, rain: 30 },
  { day: 'Fri', icon: 'sunny', high: 32, low: 26, rain: 10 },
  { day: 'Sat', icon: 'partly-sunny', high: 31, low: 25, rain: 20 },
];

const StatItem = ({ icon, label, value }) => (
  <View style={styles.statItem}>
    <Ionicons name={icon} size={18} color={Colors.primaryLight} />
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const WeatherScreen = () => {
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient colors={Gradients.screenBg} style={styles.root} locations={[0, 0.35, 0.65, 1]}>
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 16 }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Weather</Text>
        <Text style={styles.subtitle}>Zamboanga City</Text>

        {/* Current weather */}
        <GlassCard dark style={styles.mainCard}>
          <View style={styles.tempRow}>
            <Ionicons name={MOCK_WEATHER.icon} size={56} color={Colors.primaryLight} />
            <View style={styles.tempInfo}>
              <Text style={styles.tempText}>{MOCK_WEATHER.temp}°</Text>
              <Text style={styles.conditionText}>{MOCK_WEATHER.condition}</Text>
              <Text style={styles.feelsLike}>Feels like {MOCK_WEATHER.feelsLike}°</Text>
            </View>
          </View>
        </GlassCard>

        {/* Stats grid */}
        <GlassCard style={styles.gridCard}>
          <View style={styles.grid}>
            <StatItem icon="water" label="Humidity" value={`${MOCK_WEATHER.humidity}%`} />
            <StatItem icon="speedometer" label="Wind" value={`${MOCK_WEATHER.windSpeed} km/h`} />
            <StatItem icon="rainy" label="Rainfall" value={`${MOCK_WEATHER.rainfall} mm`} />
            <StatItem icon="eye" label="Visibility" value={`${MOCK_WEATHER.visibility} km`} />
            <StatItem icon="arrow-down" label="Pressure" value={`${MOCK_WEATHER.pressure} hPa`} />
            <StatItem icon="sunny" label="UV Index" value={MOCK_WEATHER.uvIndex} />
          </View>
        </GlassCard>

        {/* Forecast */}
        <GlassCard dark style={styles.forecastCard}>
          <Text style={styles.sectionTitle}>7-Day Forecast</Text>
          {FORECAST.map((day, i) => (
            <View key={i} style={[styles.forecastRow, i < FORECAST.length - 1 && styles.forecastBorder]}>
              <Text style={styles.forecastDay}>{day.day}</Text>
              <Ionicons name={day.icon} size={22} color={Colors.primaryLight} />
              <View style={styles.forecastTemps}>
                <Text style={styles.forecastHigh}>{day.high}°</Text>
                <Text style={styles.forecastLow}>{day.low}°</Text>
              </View>
              <View style={styles.rainChance}>
                <Ionicons name="water-outline" size={12} color={Colors.primaryLight} />
                <Text style={styles.rainText}>{day.rain}%</Text>
              </View>
            </View>
          ))}
        </GlassCard>

        <View style={{ height: 100 }} />
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { paddingHorizontal: 20 },
  title: {
    ...Typography.h1,
    color: Colors.textDark,
  },
  subtitle: {
    ...Typography.caption,
    color: Colors.textDarkSecondary,
    marginTop: 2,
    marginBottom: 20,
  },
  mainCard: {
    marginBottom: 16,
    paddingVertical: 28,
  },
  tempRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  tempInfo: { flex: 1 },
  tempText: {
    ...Typography.hero,
    color: Colors.textPrimary,
  },
  conditionText: {
    ...Typography.h3,
    color: Colors.textPrimary,
    marginTop: -4,
  },
  feelsLike: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginTop: 2,
  },
  gridCard: { marginBottom: 16 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  statItem: {
    width: '30%',
    alignItems: 'center',
    paddingVertical: 14,
    flexGrow: 1,
  },
  statValue: {
    ...Typography.bodyBold,
    color: Colors.textPrimary,
    marginTop: 6,
  },
  statLabel: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginTop: 2,
  },
  forecastCard: { marginBottom: 8 },
  sectionTitle: {
    ...Typography.h3,
    color: Colors.textPrimary,
    marginBottom: 14,
  },
  forecastRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 14,
  },
  forecastBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  forecastDay: {
    ...Typography.bodyBold,
    color: Colors.textPrimary,
    width: 50,
  },
  forecastTemps: {
    flex: 1,
    flexDirection: 'row',
    gap: 8,
  },
  forecastHigh: {
    ...Typography.bodyBold,
    color: Colors.textPrimary,
  },
  forecastLow: {
    ...Typography.body,
    color: Colors.textMuted,
  },
  rainChance: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    minWidth: 44,
    justifyContent: 'flex-end',
  },
  rainText: {
    ...Typography.caption,
    color: Colors.primaryLight,
  },
});

export default WeatherScreen;
