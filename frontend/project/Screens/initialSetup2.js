import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Font from 'expo-font';
import Icon from 'react-native-vector-icons/Ionicons';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import globalStyles from '../styles/globalStyles';

const InitialSetupTwoScreen = ({ navigation }) => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [recording, setRecording] = useState(null);
  const [fontSize, setFontSize] = useState(16);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'OpenDyslexic': require('../assets/fonts/OpenDyslexic-Regular.otf'),
      });
      setFontsLoaded(true);
    }

    async function loadFontSize() {
      try {
        const storedFontSize = await AsyncStorage.getItem('fontSize');
        if (storedFontSize) {
          setFontSize(parseInt(storedFontSize, 10));
        }
      } catch (error) {
        console.error('Error loading font size:', error);
      }
    }

    loadFonts();
    loadFontSize();
  }, []);

  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== 'granted') {
        Alert.alert('Permission denied', 'Audio recording permission is required.');
        return;
      }

      const { recording } = await Audio.Recording.createAsync({
        android: {
          extension: '.wav',
          outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_PCM_16BIT,
          audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_PCM_16BIT,
          sampleRate: 44100,
          numberOfChannels: 1,
        },
        ios: {
          extension: '.wav',
          audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
          sampleRate: 44100,
          numberOfChannels: 1,
          bitRate: 128000,
        },
      });
      setRecording(recording);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    if (!recording) {
      Alert.alert('Error', 'No active recording found.');
      return;
    }

    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      const fileInfo = await FileSystem.getInfoAsync(uri);

      if (!fileInfo.exists) {
        Alert.alert('Error', 'Recording failed.');
        return;
      }

      await uploadAudio(uri);
    } catch (error) {
      console.error('Error stopping recording:', error);
    } finally {
      setRecording(null);
    }
  };

  const uploadAudio = async (uri) => {
    const formData = new FormData();
    formData.append('audio', {
      uri,
      name: 'audio.wav',
      type: 'audio/wav',
    });

    try {
      const response = await fetch('http://192.168.161.54:5000/api/process_audio', {
        method: 'POST',
        body: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.ok) {
        const result = await response.json();
        Alert.alert('Success', 'Audio processed and voice synthesized!');
      } else {
        Alert.alert('Error', 'Audio processing failed.');
      }
    } catch (error) {
      console.error('Error uploading audio:', error);
      Alert.alert('Error', 'Failed to upload audio.');
    }
  };

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading Fonts...</Text>
      </View>
    );
  }

  return (
    
    <View style={styles.container}>
      {/* Top decorative shapes */}
      <View style={globalStyles.circle1}></View>
      <View style={globalStyles.circle2}></View>

      {/* Back Arrow */}
      <TouchableOpacity style={styles.backArrow} onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

      {/* Title and Subtitle */}
      <Text style={[styles.title, { fontSize }]}>Tap microphone and</Text>
      <Text style={[styles.subtitle, { fontSize }]}>read aloud</Text>

      {/* Word Card */}
      <View style={styles.card}>
        <Image
          source={require('../assets/image-removebg-preview.png')}
          style={styles.image}
        />
        <Text style={[styles.sentence, { fontSize }]}>The man has </Text>
        <Text style={[styles.sentence, { fontSize }]}>a hat.</Text>
      </View>

      <TouchableOpacity
        style={styles.micButton}
        onPress={recording ? stopRecording : startRecording}
      >
        <Icon name={recording ? 'stop' : 'mic'} size={24} color="black" />
      </TouchableOpacity>

      {/* Next Button */}
      <TouchableOpacity style={styles.nextButton} onPress={() => navigation.navigate('HomeScreen')}>
        <Icon name="arrow-forward" size={24} color="#000" />
      </TouchableOpacity>

      {/* Bottom decorative shapes */}
      <View style={globalStyles.circle3}></View>
      <View style={globalStyles.circle4}></View>
    </View>
   
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
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  backArrow: {
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  title: {
    fontFamily: 'OpenDyslexic',
    color: '#000',
    marginTop: 20,
  },
  subtitle: {
    fontFamily: 'OpenDyslexic',
    color: '#000',
    marginBottom: 20,
  },
  card: {
    width: '80%',
    height: '50%',
    backgroundColor: '#E0F3FF',
    borderRadius: 15,
    alignItems: 'center',
    padding: 15,
    elevation: 3,
  },
  image: {
    width: 150,
    height: 150,
    right: 22,
    marginVertical: 10,
  },
  sentence: {
    fontFamily: 'OpenDyslexic',
    color: '#000',
    marginVertical: 5,
  },
  micButton: {
    width: 50,
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    marginVertical: 20,
  },
  uploadButton: {
   width: 130,
    height: 50,
    backgroundColor: '#66BBFF',
    borderRadius: 20,
    fontSize:20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    marginVertical: 20,
  },
  nextButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    borderRadius: 25,
    width: 50,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default InitialSetupTwoScreen;
