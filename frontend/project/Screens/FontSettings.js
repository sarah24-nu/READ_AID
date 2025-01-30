import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import * as Font from 'expo-font';

const FontSettingScreen = ({ navigation }) => {
  const handleFontSelection = async (size) => {
    try {
      await AsyncStorage.setItem('fontSize', size.toString());
      await AsyncStorage.setItem('isFontSet', 'true'); 
      navigation.replace('InitialSetup'); 
    } catch (error) {
      console.error('Error saving font size:', error);
      Alert.alert('Error', 'An error occurred while saving font size.');
    }
  };

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          OpenDyslexic: require('../assets/fonts/OpenDyslexic-Regular.otf'),
        });
        console.log('Font loaded');
      } catch (error) {
        console.error('Font loading error:', error);
      }
    }
    loadFonts();
  }, []);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        {/* Back Button */}
        <TouchableOpacity style={styles.backArrow} onPress={() => navigation.replace('Configuration')}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        {/* Title */}
        <Text style={styles.title}>Choose Font Size</Text>

        {/* Font Size Options */}
        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={styles.fontButton}
            onPress={() => handleFontSelection(14)}
          >
            <Text style={[styles.previewText, { fontSize: 20 }]}>AaBbCc</Text>
            <Text style={styles.optionLabel}>Small</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.fontButton}
            onPress={() => handleFontSelection(18)}
          >
            <Text style={[styles.previewText, { fontSize: 24 }]}>AaBbCc</Text>
            <Text style={styles.optionLabel}>Medium</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.fontButton}
            onPress={() => handleFontSelection(22)}
          >
            <Text style={[styles.previewText, { fontSize: 28 }]}>AaBbCc</Text>
            <Text style={styles.optionLabel}>Large</Text>
          </TouchableOpacity>
        </View>

        {/* Next Button */}
        <TouchableOpacity
          style={styles.nextButton}
          onPress={() => navigation.replace('InitialSetup')}
        >
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F4E7FF',
    paddingHorizontal: 30,
    paddingVertical: 40,
    alignItems: 'center',
  },
  backArrow: {
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  title: {
    fontFamily: 'OpenDyslexic',
    color: '#000000', 
    fontSize: 28,
    textAlign: 'center',
    marginVertical: 20,
  },
  optionsContainer: {
    width: '100%',
    maxWidth: 300,
    alignItems: 'center',
    marginVertical: 20,
  },
  fontButton: {
    width: '80%',
    paddingVertical: 15,
    marginVertical: 10,
    backgroundColor: '#D4F1F4',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  previewText: {
    fontFamily: 'OpenDyslexic',
    fontWeight: 'bold',
    color: '#000',
  },
  optionLabel: {
    marginTop: 5,
    fontFamily: 'OpenDyslexic',
    color: '#6A5ACD', 
    fontSize: 14,
  },
  nextButton: {
    width: '50%',
    paddingVertical: 15,
    backgroundColor: '#66BBFF',
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
    marginVertical: 30,
  },
  buttonText: {
    fontFamily: 'OpenDyslexic',
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default FontSettingScreen;
