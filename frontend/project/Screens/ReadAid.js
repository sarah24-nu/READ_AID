import React, { useEffect } from 'react';
import { View, StyleSheet,KeyboardAvoidingView,Platform,ScrollView, Image } from 'react-native';
import globalStyles from '../styles/globalStyles';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('SignIn'); 
    }, 3000);

    return () => clearTimeout(timer); 
  }, [navigation]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={globalStyles.circle1}></View>
        <View style={globalStyles.circle2}></View>
        <Image
          source={require('../assets/final_logo-removebg-preview.png')} 
          style={styles.logo}
        />
        <View style={globalStyles.circle3}></View>
        <View style={globalStyles.circle4}></View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
     padding:20,
    backgroundColor: '#F5F5F5',
  },
  
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
});

export default SplashScreen;
