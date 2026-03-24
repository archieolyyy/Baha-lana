import React, { useState } from 'react';
import { Text, TouchableOpacity, ActivityIndicator, Alert, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AuthLayout from './AuthLayout';
import FloatingLabelInput from '../../components/FloatingLabelInput';
import { useAuth } from '../../context/AuthContext';
import { authStyles } from './authTheme';
import { Colors, Gradients } from '../../constants/colors';

const LoginScreen = ({ navigation }) => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  const onSubmit = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Missing fields', 'Enter email and password.');
      return;
    }
    setBusy(true);
    try {
      await signIn(email, password);
    } catch (e) {
      Alert.alert('Sign in failed', e.message || 'Try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthLayout
      bgTone="login"
      title="Welcome back"
      subtitle="Sign in with the email and password you used when you registered."
      navigation={navigation}
      showBack
    >
      <View style={authStyles.authForm}>
        <FloatingLabelInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <FloatingLabelInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          lastInGroup
        />
      </View>

      <TouchableOpacity
        style={authStyles.primaryBtn}
        onPress={onSubmit}
        disabled={busy}
        activeOpacity={0.88}
      >
        <LinearGradient colors={Gradients.bluePill} style={authStyles.btnGrad}>
          {busy ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Text style={authStyles.primaryText}>Sign in</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('SignUp')}
        style={authStyles.link}
        activeOpacity={0.8}
      >
        <Text style={authStyles.linkText}>
          No account? <Text style={authStyles.linkBold}>Create one</Text>
        </Text>
      </TouchableOpacity>
    </AuthLayout>
  );
};

export default LoginScreen;
