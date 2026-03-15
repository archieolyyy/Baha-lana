import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HistoryCard from '../components/HistoryCard';
import { useFloodData } from '../hooks/useFloodData';
import { Colors, Gradients } from '../constants/colors';
import { Typography } from '../constants/typography';

const HistoryScreen = () => {
  const insets = useSafeAreaInsets();
  const { history, loading, refresh } = useFloodData();

  return (
    <LinearGradient colors={Gradients.screenBg} style={styles.root} locations={[0, 0.35, 0.65, 1]}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={styles.title}>History</Text>
        <Text style={styles.subtitle}>Past flood level readings</Text>
      </View>

      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <HistoryCard entry={item} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refresh} tintColor={Colors.primaryLight} />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No history yet</Text>
          </View>
        }
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  title: {
    ...Typography.h1,
    color: Colors.textDark,
  },
  subtitle: {
    ...Typography.caption,
    color: Colors.textDarkSecondary,
    marginTop: 2,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  empty: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: {
    ...Typography.body,
    color: Colors.textMuted,
  },
});

export default HistoryScreen;
