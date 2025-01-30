import React, { useState, useEffect } from 'react';  
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';  
import axios from 'axios';
import globalStyles from '../styles/globalStyles';

const ForgetPasswordScreen = ({ route, navigation }) => {  
  const { email } = route.params; 
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  
  useEffect(() => {
    const fetchSecurityQuestion = async () => {
      try {
        const response = await axios.post('http://192.168.100.14:5000/api/get-security-question', { email });
        setSecurityQuestion(response.data.securityQuestion);
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch security question. Please try again.');
        navigation.goBack();
      }
    };

    fetchSecurityQuestion();
  }, [email]);

  const handlePasswordReset = async () => {  
    if (!securityAnswer) {  
      Alert.alert('Error', 'Please answer the security question.');  
      return;  
    }  
    if (!password || !confirmPassword) {  
      Alert.alert('Error', 'Please enter and confirm the new password.');  
      return;  
    }  
    if (password !== confirmPassword) {  
      Alert.alert('Error', 'Passwords do not match.');  
      return;  
    }

    try {
     
      const response = await axios.post('http://192.168.100.14:5000/api/reset-password', {
        email,
        securityAnswer,
        newPassword: password,
      });

      if (response.data.success) {
        Alert.alert('Success', 'Password reset successfully!');
        navigation.navigate('SignIn');
      } else {
        Alert.alert('Error', response.data.message || 'Security answer is incorrect.');
      }
    } catch (error) {
      Alert.alert('Error', 'Security answer is incorrect.');
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
          <Text style={styles.subtitle}>Reset Password</Text>  

          {securityQuestion ? (
            <>
              <Text style={styles.securityQuestion}>{securityQuestion}</Text>
              <TextInput  
                style={styles.input}  
                placeholder="Enter your answer"  
                value={securityAnswer}  
                onChangeText={setSecurityAnswer}  
              />  
              <TextInput  
                style={styles.input}  
                placeholder="Enter new Password"  
                secureTextEntry={secureTextEntry}  
                value={password}  
                onChangeText={setPassword}  
              />  
              <TextInput  
                style={styles.input}  
                placeholder="Confirm Password"  
                secureTextEntry={secureTextEntry}  
                value={confirmPassword}  
                onChangeText={setConfirmPassword}  
              />  

              <TouchableOpacity 
                style={styles.toggleSecureText}
                onPress={() => setSecureTextEntry(!secureTextEntry)}
              >
                <Text style={styles.toggleText}>
                  {secureTextEntry ? 'Show Password' : 'Hide Password'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.signInButton} onPress={handlePasswordReset}>  
                <Text style={styles.signInButtonText}>Reset Password</Text>  
              </TouchableOpacity>  
            </>
          ) : (
            <Text style={styles.loadingText}>Fetching security question...</Text>
          )}

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
    fontSize: 32,  
    textAlign: 'center',  
    fontFamily: 'OpenDyslexic',  
    marginVertical: 10,  
  },  
  subtitle: {  
    fontSize: 20,  
    marginVertical: 10,  
    fontFamily: 'OpenDyslexic',  
    textAlign: 'center',  
  },  
  securityQuestion: {
    fontSize: 16,
    fontFamily: 'OpenDyslexic',
    marginVertical: 10,
  },
  input: {  
    height: 50,  
    borderColor: 'gray',  
    borderWidth: 0.5,  
    marginBottom: 15,  
    fontFamily: 'OpenDyslexic',  
    paddingHorizontal: 10,  
    borderRadius: 10,  
    backgroundColor: '#fff',
  },  
  toggleSecureText: {
    marginBottom: 15,
    alignSelf: 'flex-end',
  },
  toggleText: {
    color: '#66BBFF',
    fontFamily: 'OpenDyslexic',
    fontSize: 14,
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
  loadingText: {
    textAlign: 'center',
    fontFamily: 'OpenDyslexic',
    fontSize: 16,
    marginTop: 20,
  },
});

export default ForgetPasswordScreen;
