import React, { useState, useEffect } from 'react';
import {View,Text,TextInput,TouchableOpacity,StyleSheet,Alert,ActivityIndicator,KeyboardAvoidingView,Platform,ScrollView,} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as Font from 'expo-font';
import Icon from 'react-native-vector-icons/Ionicons';
import globalStyles from '../styles/globalStyles';
import { apiClient, ENDPOINTS } from '../config/api';

const SignInScreen = ({ navigation, setIsAuthenticated }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        OpenDyslexic: require('../assets/fonts/OpenDyslexic-Regular.otf'),
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="#66BBFF" />;
  }

  const handleSignIn = async (isGuest = false) => {
    if (isGuest) {
      setIsAuthenticated(true);
      navigation.replace('Configuration'); 
      return;
    }
  
    if (!username.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both username and password.');
      return;
    }
  
    setLoading(true);
  
    try {
      const response = await apiClient.post(ENDPOINTS.signin, {
        email: username,
        password: password,
      });
  
      await AsyncStorage.setItem('token', response.data.token);
      setIsAuthenticated(true);
      navigation.replace('Configuration');
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Login failed. Please try again.';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container}>
    <View style={styles.container}>
      <View style={globalStyles.circle1}></View>
      <View style={globalStyles.circle2}></View>
      <Text style={styles.title}>READ AID</Text>

      <Text style={styles.subtitle}>Sign in</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter email or username"
        value={username}
        onChangeText={setUsername}
      />

      <View style={styles.passwordContainer}>
        <TextInput
          style={[styles.passwordInput, { flex: 1 }]}
          placeholder="Password"
          secureTextEntry={secureTextEntry}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          onPress={() => setSecureTextEntry(!secureTextEntry)}
          style={styles.eyeIcon}
        >
          <Icon
            name={secureTextEntry ? 'eye-off' : 'eye'}
            size={20}
            color="gray"
          />
        </TouchableOpacity>
      </View>

      {loading && <ActivityIndicator size="large" color="#66BBFF" />}

      <TouchableOpacity
  onPress={() => {
    if (!username.trim()) {
      Alert.alert('Error', 'Please enter your email or username to proceed.');
      return;
    }
    navigation.navigate('ForgetPassword', { email: username });
  }}
>
  <Text style={styles.forgotPassword}>Forgot password?</Text>
</TouchableOpacity>
      <TouchableOpacity style={styles.signInButton} onPress={() => handleSignIn(false)}>
        <Text style={styles.signInButtonText}>Sign In</Text>
      </TouchableOpacity>

      <Text style={styles.orText}>Or sign in with:</Text>

      <TouchableOpacity style={styles.googleIcon} onPress={() => navigation.navigate('SignInWithGoogle')}>
        <Icon name="logo-google" size={40} color="black" />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.signUpText}>Don't have an Account? Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handleSignIn(true)}>
        <Text style={styles.guestText}>Or Use as a Guest</Text>
      </TouchableOpacity>

      <View style={globalStyles.circle3}></View>
      <View style={globalStyles.circle4}></View>
    </View>
    </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F1E7FF',
    justifyContent: 'center',
  },
  
  title: {
    fontSize: 30,
    marginVertical: 15,
    fontFamily: 'OpenDyslexic',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 24,
    marginVertical: 15,
    fontFamily: 'OpenDyslexic',
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    marginBottom: 15,
    fontFamily: 'OpenDyslexic',
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  passwordInput: {
    fontFamily: 'OpenDyslexic',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: 'gray',
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  eyeIcon: {
    marginLeft: 10,
    alignItems: 'center',
  },
  forgotPassword: {
    color: 'blue',
    fontFamily: 'OpenDyslexic',
    textAlign: 'center',
    marginVertical: 10,
  },
  orText: {
    textAlign: 'center',
    fontFamily: 'OpenDyslexic',
    marginVertical: 10,
    marginTop: 20,
  },
  googleIcon: {
    width: 40,
    height: 40,
    alignSelf: 'center',
    margin: 10,
  },
  signUpText: {
    textAlign: 'center',
    marginVertical: 10,
    fontFamily: 'OpenDyslexic',
    color:'blue',
  },
  guestText: {
    textAlign: 'center',
    marginVertical: 10,
    fontFamily: 'OpenDyslexic',
    color:'blue',
  },
  signInButton: {
    backgroundColor: '#66BBFF',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 40,
    elevation: 3,
    alignSelf: 'center',
  },
  signInButtonText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'OpenDyslexic',
  },
});

export default SignInScreen; 