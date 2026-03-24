import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AuthAmbientBackground from './AuthAmbientBackground';
import { AUTH_SCREEN_PAD, authStyles } from './authTheme';
import { Colors } from '../../constants/colors';

const AuthLayout = ({
  variant = 'form',
  /** 'deep' = default; 'airy' = sign-up gradient; 'login' = navy top / white bottom; 'welcome' = half white / half navy */
  bgTone = 'deep',
  title,
  subtitle,
  navigation,
  showBack,
  children,
}) => {
  const insets = useSafeAreaInsets();
  const canBack = Boolean(showBack && navigation?.canGoBack?.());

  const padTop = variant === 'welcome' ? insets.top + 16 : insets.top + 4;
  const padBottom = insets.bottom + 32;

  const ambientTone =
    bgTone === 'airy'
      ? 'airy'
      : bgTone === 'login'
        ? 'login'
        : bgTone === 'welcome'
          ? 'welcome'
          : 'deep';
  const headerOnDark = bgTone === 'login';

  return (
    <View
      style={[
        styles.root,
        bgTone === 'airy' && styles.rootAiry,
        bgTone === 'login' && styles.rootLogin,
        bgTone === 'welcome' && styles.rootWelcome,
      ]}
    >
      <View style={styles.bgWrap} pointerEvents="none">
        <AuthAmbientBackground tone={ambientTone} />
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={[
            variant === 'welcome' ? styles.scrollWelcome : styles.scrollForm,
            { paddingTop: padTop, paddingBottom: padBottom },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {variant === 'form' && canBack ? (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backRow}
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 4, right: 8 }}
            >
              <Ionicons
                name="chevron-back"
                size={24}
                color={headerOnDark ? 'rgba(255,255,255,0.92)' : Colors.primaryDark}
              />
              <Text style={headerOnDark ? authStyles.navBackLabelOnDark : authStyles.navBackLabel}>
                Back
              </Text>
            </TouchableOpacity>
          ) : null}
          {title ? (
            <Text style={headerOnDark ? authStyles.screenTitleLogin : authStyles.screenTitle}>
              {title}
            </Text>
          ) : null}
          {subtitle ? (
            <Text style={headerOnDark ? authStyles.screenSubtitleLogin : authStyles.screenSubtitle}>
              {subtitle}
            </Text>
          ) : null}
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bgBottom },
  rootAiry: { backgroundColor: '#ffffff' },
  rootLogin: { backgroundColor: '#ffffff' },
  rootWelcome: { backgroundColor: '#ffffff' },
  bgWrap: { ...StyleSheet.absoluteFillObject },
  flex: { flex: 1 },
  scrollWelcome: {
    flexGrow: 1,
    paddingHorizontal: AUTH_SCREEN_PAD,
  },
  scrollForm: {
    flexGrow: 1,
    paddingHorizontal: AUTH_SCREEN_PAD,
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    alignSelf: 'flex-start',
    minHeight: 44,
  },
});

export default AuthLayout;
