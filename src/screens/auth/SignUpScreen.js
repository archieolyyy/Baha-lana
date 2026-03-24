import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AuthLayout from './AuthLayout';
import FloatingLabelInput from '../../components/FloatingLabelInput';
import { useAuth } from '../../context/AuthContext';
import { authStyles } from './authTheme';
import { Colors, Gradients } from '../../constants/colors';

const SignUpScreen = ({ navigation }) => {
  const { signUp } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  const onSubmit = async () => {
    const fn = firstName.trim();
    const ln = lastName.trim();
    if (!fn || !ln || !phone.trim() || !email.trim() || !password) {
      Alert.alert('Missing fields', 'Fill in first name, last name, mobile, email, and password.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Password', 'Use at least 6 characters.');
      return;
    }
    const displayName = `${fn} ${ln}`;
    setBusy(true);
    try {
      await signUp(email, password, displayName, phone);
    } catch (e) {
      Alert.alert('Sign up failed', e.message || 'Try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthLayout
      bgTone="airy"
      title="Create your account"
      subtitle="We use your PH mobile for SMS alerts (+63). Use an email you can access."
      navigation={navigation}
      showBack
    >
      <View style={authStyles.authForm}>
        <View style={[authStyles.nameRow, { marginBottom: 18 }]}>
          <FloatingLabelInput
            label="First name"
            value={firstName}
            onChangeText={setFirstName}
            autoCapitalize="words"
            style={{ flex: 1, marginRight: 12, marginBottom: 0 }}
          />
          <FloatingLabelInput
            label="Last name"
            value={lastName}
            onChangeText={setLastName}
            autoCapitalize="words"
            style={{ flex: 1, marginBottom: 0 }}
          />
        </View>

        <FloatingLabelInput
          label="Mobile (PH)"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
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
            <Text style={authStyles.primaryText}>Sign up</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('Login')}
        style={authStyles.link}
        activeOpacity={0.8}
      >
        <Text style={authStyles.linkTextSignUp}>
          Already have an account? <Text style={authStyles.linkBoldSignUp}>Sign in</Text>
        </Text>
      </TouchableOpacity>
    </AuthLayout>
  );
};

export default SignUpScreen;
