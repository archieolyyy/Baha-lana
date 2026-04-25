import React, { useState } from 'react';
import { Text, TouchableOpacity, ActivityIndicator, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AuthLayout from './AuthLayout';
import FloatingLabelInput from '../../components/FloatingLabelInput';
import StatusModal from '../../components/StatusModal';
import { useAuth } from '../../context/AuthContext';
import { authStyles } from './authTheme';
import { Colors, Gradients } from '../../constants/colors';

const LoginScreen = ({ navigation }) => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [modal, setModal] = useState({ visible: false, title: '', message: '', type: 'info' });
  const openModal = (title, message, type = 'info') =>
    setModal({ visible: true, title, message, type });

  const onSubmit = async () => {
    if (!email.trim() || !password) {
      openModal('Missing fields', 'Enter email and password.', 'warning');
      return;
    }
    setBusy(true);
    try {
      await signIn(email, password);
    } catch (e) {
      openModal('Sign in failed', e.message || 'Try again.', 'error');
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
      <StatusModal
        visible={modal.visible}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        onClose={() => setModal((m) => ({ ...m, visible: false }))}
      />
    </AuthLayout>
  );
};

export default LoginScreen;
