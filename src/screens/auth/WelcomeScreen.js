import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, useWindowDimensions, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AuthLayout from './AuthLayout';
import { authStyles } from './authTheme';
import { Gradients } from '../../constants/colors';

const LOGO = require('../../logo.png');

const PLACEHOLDER_FOOTER = 'Sign in to sync your profile and mobile number for alert delivery.';

const WelcomeScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const minH = Math.max(height - insets.top - insets.bottom - 48, 500);
  const pulse = useSharedValue(1);

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.04, { duration: 2400, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 2400, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      false,
    );
  }, [pulse]);

  const heroPulse = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  return (
    <AuthLayout variant="welcome" bgTone="welcome" navigation={navigation}>
      <View style={{ minHeight: minH, justifyContent: 'space-between' }}>
        <View style={{ alignItems: 'center', paddingTop: 8 }}>
          <View style={authStyles.heroWrap}>
            <Animated.View style={[heroPulse, authStyles.heroLogoWrap]}>
              <Image
                source={LOGO}
                style={authStyles.heroLogo}
                resizeMode="contain"
                accessibilityLabel="Baha-lana logo"
              />
            </Animated.View>
            <View style={authStyles.dividerLine} />
            <Text style={authStyles.brandTitle}>Baha-lana</Text>
            <Text style={[authStyles.tagline, authStyles.taglineWelcome]}>
              Flood monitoring and SMS alerts—stay ahead of rising water.
            </Text>
            <View style={authStyles.pill}>
              <Text style={authStyles.pillText}>Sensor · Cloud · Safety</Text>
            </View>
          </View>
        </View>

        <View style={authStyles.welcomeActions}>
          <TouchableOpacity
            style={authStyles.primaryBtn}
            onPress={() => navigation.navigate('SignUp')}
            activeOpacity={0.88}
          >
            <LinearGradient colors={Gradients.bluePill} style={authStyles.btnGrad}>
              <Text style={authStyles.primaryText}>Create account</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            style={authStyles.secondaryBtnWelcome}
            onPress={() => navigation.navigate('Login')}
            activeOpacity={0.88}
          >
            <Text style={authStyles.secondaryTextWelcome}>I already have an account</Text>
          </TouchableOpacity>
          <Text style={authStyles.footerNoteWelcome}>{PLACEHOLDER_FOOTER}</Text>
        </View>
      </View>
    </AuthLayout>
  );
};

export default WelcomeScreen;
