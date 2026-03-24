import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAuth } from '../context/AuthContext';
import { isFirebaseConfigured } from '../config/env';
import { Colors } from '../constants/colors';

import MainTabNavigator from './MainTabNavigator';
import WelcomeScreen from '../screens/auth/WelcomeScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';

const AuthStack = createNativeStackNavigator();

const AuthNavigator = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: false }}>
    <AuthStack.Screen name="Welcome" component={WelcomeScreen} />
    <AuthStack.Screen name="Login" component={LoginScreen} />
    <AuthStack.Screen name="SignUp" component={SignUpScreen} />
  </AuthStack.Navigator>
);

const RootNavigator = () => {
  const { user, loading } = useAuth();
  const firebaseOn = isFirebaseConfigured();

  if (firebaseOn && loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primaryLight} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {firebaseOn && !user ? <AuthNavigator /> : <MainTabNavigator />}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.bgBottom,
  },
});

export default RootNavigator;
