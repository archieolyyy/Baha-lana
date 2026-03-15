import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GlassCard from '../components/GlassCard';
import { Colors, Gradients } from '../constants/colors';
import { Typography } from '../constants/typography';

const ProfileScreen = () => {
  const insets = useSafeAreaInsets();
  const [name, setName] = useState('Juan Dela Cruz');
  const [phone, setPhone] = useState('+63 912 345 6789');
  const [editing, setEditing] = useState(false);
  const [notifEnabled, setNotifEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(true);

  const handleSave = () => {
    setEditing(false);
    Alert.alert('Saved', 'Your profile has been updated.');
  };

  const ToggleRow = ({ icon, label, value, onToggle }) => (
    <TouchableOpacity style={styles.toggleRow} onPress={onToggle} activeOpacity={0.7}>
      <View style={styles.toggleLeft}>
        <Ionicons name={icon} size={20} color={Colors.primaryLight} />
        <Text style={styles.toggleLabel}>{label}</Text>
      </View>
      <View style={[styles.toggleTrack, value && styles.toggleTrackActive]}>
        <View style={[styles.toggleThumb, value && styles.toggleThumbActive]} />
      </View>
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={Gradients.screenBg} style={styles.root} locations={[0, 0.35, 0.65, 1]}>
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 16 }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.subtitle}>Manage your account & preferences</Text>

        {/* Avatar */}
        <View style={styles.avatarSection}>
          <LinearGradient colors={Gradients.bluePill} style={styles.avatar}>
            <Ionicons name="person" size={40} color={Colors.white} />
          </LinearGradient>
          <Text style={styles.avatarName}>{name}</Text>
          <Text style={styles.avatarPhone}>{phone}</Text>
        </View>

        {/* Info card */}
        <GlassCard dark style={styles.infoCard}>
          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Full Name</Text>
            {editing ? (
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholderTextColor={Colors.textMuted}
              />
            ) : (
              <Text style={styles.fieldValue}>{name}</Text>
            )}
          </View>

          <View style={styles.divider} />

          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Phone Number</Text>
            {editing ? (
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                placeholderTextColor={Colors.textMuted}
              />
            ) : (
              <Text style={styles.fieldValue}>{phone}</Text>
            )}
          </View>

          <View style={styles.divider} />

          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Location</Text>
            <Text style={styles.fieldValue}>Zamboanga City</Text>
          </View>

          <TouchableOpacity
            style={styles.editBtn}
            onPress={editing ? handleSave : () => setEditing(true)}
            activeOpacity={0.8}
          >
            <LinearGradient colors={Gradients.bluePill} style={styles.editBtnGradient}>
              <Ionicons name={editing ? 'checkmark' : 'create-outline'} size={18} color={Colors.white} />
              <Text style={styles.editBtnText}>{editing ? 'Save' : 'Edit Profile'}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </GlassCard>

        {/* Notification settings */}
        <GlassCard style={styles.settingsCard}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <ToggleRow
            icon="notifications-outline"
            label="Push Notifications"
            value={notifEnabled}
            onToggle={() => setNotifEnabled(!notifEnabled)}
          />
          <ToggleRow
            icon="chatbubble-outline"
            label="SMS Alerts"
            value={smsEnabled}
            onToggle={() => setSmsEnabled(!smsEnabled)}
          />
        </GlassCard>

        {/* About */}
        <GlassCard style={styles.aboutCard}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.aboutText}>
            Flood Monitoring & Alert System v1.0{'\n'}
            Western Mindanao State University{'\n'}
            College of Computing Studies
          </Text>
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
    marginBottom: 24,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarName: {
    ...Typography.h2,
    color: Colors.textPrimary,
  },
  avatarPhone: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  infoCard: {
    marginBottom: 16,
  },
  fieldRow: {
    paddingVertical: 12,
  },
  fieldLabel: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  fieldValue: {
    ...Typography.body,
    color: Colors.textPrimary,
  },
  input: {
    ...Typography.body,
    color: Colors.textPrimary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.primaryLight,
    paddingBottom: 4,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.divider,
  },
  editBtn: {
    marginTop: 18,
    borderRadius: 14,
    overflow: 'hidden',
  },
  editBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    gap: 8,
  },
  editBtnText: {
    ...Typography.bodyBold,
    color: Colors.white,
  },
  settingsCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    ...Typography.h3,
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  toggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  toggleLabel: {
    ...Typography.body,
    color: Colors.textPrimary,
  },
  toggleTrack: {
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.12)',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  toggleTrackActive: {
    backgroundColor: Colors.primary,
  },
  toggleThumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.textMuted,
  },
  toggleThumbActive: {
    backgroundColor: Colors.white,
    alignSelf: 'flex-end',
  },
  aboutCard: {
    marginBottom: 8,
  },
  aboutText: {
    ...Typography.body,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
});

export default ProfileScreen;
