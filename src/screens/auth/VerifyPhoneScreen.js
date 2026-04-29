import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AuthLayout from './AuthLayout';
import FloatingLabelInput from '../../components/FloatingLabelInput';
import StatusModal from '../../components/StatusModal';
import { useAuth } from '../../context/AuthContext';
import { authStyles } from './authTheme';
import { Colors, Gradients } from '../../constants/colors';
import { formatPhoneDisplay } from '../../utils/phone';

const VerifyPhoneScreen = () => {
  const { profile, firebaseReady, verifyPhoneOtp, sendPhoneVerificationOtp, signOut } = useAuth();
  const [otpCode, setOtpCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [resending, setResending] = useState(false);
  const [sentOnce, setSentOnce] = useState(false);
  const [modal, setModal] = useState({ visible: false, title: '', message: '', type: 'info' });
  const phoneE164 = useMemo(() => profile?.phoneE164 || '', [profile?.phoneE164]);
  const openModal = (title, message, type = 'info') =>
    setModal({ visible: true, title, message, type });

  useEffect(() => {
    if (!firebaseReady || !phoneE164 || sentOnce) return;
    setSentOnce(true);
    sendPhoneVerificationOtp(phoneE164).catch(() => {
      openModal('Could not send OTP', 'Please tap Resend OTP to try again.', 'error');
    });
  }, [firebaseReady, phoneE164, sentOnce, sendPhoneVerificationOtp, openModal]);

  const onVerify = async () => {
    if (!phoneE164) {
      openModal('Missing number', 'No phone number is available for this account.', 'warning');
      return;
    }
    if (!otpCode.trim()) {
      openModal('Missing code', 'Enter the 6-digit OTP code.', 'warning');
      return;
    }
    setBusy(true);
    try {
      await verifyPhoneOtp({ phoneRaw: phoneE164, otpCode });
      openModal('Verified', 'Your mobile number is now verified.', 'success');
    } catch (e) {
      openModal('Verification failed', e.message || 'Please check your OTP and try again.', 'error');
    } finally {
      setBusy(false);
    }
  };

  const onResend = async () => {
    if (!phoneE164) return;
    setResending(true);
    try {
      await sendPhoneVerificationOtp(phoneE164);
      openModal('OTP sent', `A new code was sent to ${formatPhoneDisplay(phoneE164)}.`, 'success');
    } catch (e) {
      openModal('Could not send OTP', e.message || 'Please try again.', 'error');
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthLayout
      bgTone="airy"
      title="Verify your mobile"
      subtitle="Enter the OTP sent to your phone to continue to your dashboard."
    >
      <View style={authStyles.authForm}>
        <Text style={{ color: Colors.textDarkSecondary, marginBottom: 14 }}>
          Number: {formatPhoneDisplay(phoneE164 || 'Not set')}
        </Text>
        <FloatingLabelInput
          label="6-digit OTP"
          value={otpCode}
          onChangeText={setOtpCode}
          keyboardType="number-pad"
          lastInGroup
        />
      </View>

      <TouchableOpacity
        style={authStyles.primaryBtn}
        onPress={onVerify}
        disabled={busy}
        activeOpacity={0.88}
      >
        <LinearGradient colors={Gradients.bluePill} style={authStyles.btnGrad}>
          {busy ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Text style={authStyles.primaryText}>Verify OTP</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity onPress={onResend} style={authStyles.link} activeOpacity={0.8} disabled={resending}>
        <Text style={authStyles.linkTextSignUp}>
          {resending ? 'Resending OTP...' : 'Didn’t get code? '}
          {!resending ? <Text style={authStyles.linkBoldSignUp}>Resend OTP</Text> : null}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={signOut} style={authStyles.link} activeOpacity={0.8}>
        <Text style={authStyles.linkTextSignUp}>
          Wrong number? <Text style={authStyles.linkBoldSignUp}>Sign out</Text>
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

export default VerifyPhoneScreen;
