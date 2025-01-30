import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Font from 'expo-font';

const ConfigurationScreen = ({ navigation, setIsAuthenticated }) => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [fontSize, setFontSize] = useState(22);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          OpenDyslexic: require('../assets/fonts/OpenDyslexic-Regular.otf'),
        });
        setFontsLoaded(true);
      } catch (e) {
        Alert.alert('Font Error', 'Failed to load fonts.');
      }
    }
    loadFonts();
  }, []);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await AsyncStorage.removeItem('token');
      setIsAuthenticated(false);
      navigation.replace('SignIn');
    } catch (error) {
      setLoading(false);
      console.error('Error logging out:', error);
      Alert.alert('Error', 'An error occurred while logging out.');
    }
  };

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="#66BBFF" />;
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={[styles.container, { flexGrow: 1 }]}>
        {/* Title and Subtitle */}
        <View style={styles.textContainer}>
          <Text style={[styles.title, { fontSize }]}>Let's Configure</Text>
          <Text style={[styles.subtitle, { fontSize }]}>the app settings</Text>
        </View>
{/* Top Illustration */}
<View style={styles.topContainer}>
<Image
  source={{
    uri: 'https://res.cloudinary.com/duufcc37j/image/upload/v12345678/levels_imgs/odatvyswslvms1ra71u3',
  }}
  style={styles.image}
/>

        </View>
        {/* Next Button */}
        <TouchableOpacity
          style={styles.nextButton}
          onPress={() => {
            navigation.navigate('FontSetting');
            setIsAuthenticated(false);
          }}
        >
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>

       
       
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4E7FF',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontFamily: 'OpenDyslexic',
    fontSize: 28,
    color: '#000000', 
    textAlign: 'center',
    marginBottom: 10,
    marginTop:30,
  },
  subtitle: {
    fontFamily: 'OpenDyslexic',
    fontSize: 18,
    color: '#000000', 
    textAlign: 'center',
    
  },
  image: {
    width: 300,
    height: 400,
    resizeMode: 'contain',
  },
  nextButton: {
    backgroundColor: '#66BBFF',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 40,
    elevation: 5,
    marginBottom: 15,
    alignSelf: 'center',
  },
  logoutButton: {
    backgroundColor: '#FF6666',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 40,
    elevation: 5,
    alignSelf: 'center',
  },
  buttonText: {
    fontFamily: 'OpenDyslexic',
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
  },
  
});

export default ConfigurationScreen;
