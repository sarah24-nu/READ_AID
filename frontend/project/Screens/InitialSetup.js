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
import { apiClient, ENDPOINTS } from '../config/api';

const InitialSetupScreen = ({ navigation }) => {
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
      const response = await apiClient.post(ENDPOINTS.processAudio, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
  
      if (response.data) {
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
      <View style={globalStyles.circle1}></View>
      <View style={globalStyles.circle2}></View>

      <TouchableOpacity
  testID="back-button"
  style={styles.backArrow}
  onPress={() => navigation.navigate('FontSetting')}
>
  <Icon name="arrow-back" size={24} color="#000" />
</TouchableOpacity>

      <Text style={[styles.title, { fontSize }]}>Tap microphone and</Text>
      <Text style={[styles.subtitle, { fontSize }]}>read aloud</Text>

      <View style={styles.card}>
        <Image
          source={require('../assets/cute-cat-sitting-room-illustration-with-carpet-as-mat_652419-231-removebg-preview.png')}
          style={styles.image}
        />
        <Text style={[styles.sentence, { fontSize }]}>The cat sat on </Text>
        <Text style={[styles.sentence, { fontSize }]}>a mat.</Text>
      </View>

      {/* Mic button */}
<TouchableOpacity
  testID="mic-button"
  style={styles.micButton}
  onPress={recording ? stopRecording : startRecording}
>
  <Icon name={recording ? 'stop' : 'mic'} size={24} color="black" />
</TouchableOpacity>


      {/* Next button */}
<TouchableOpacity 
  testID="next-button"
  style={styles.nextButton} 
  onPress={() => navigation.navigate('InitialSetupTwo')}
>
  <Icon name="arrow-forward" size={24} color="#000" />
</TouchableOpacity>

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
    paddingVertical: 20,
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    alignSelf: 'flex-start',
    marginTop: 20,
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
    width: '90%',
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

export default InitialSetupScreen;
