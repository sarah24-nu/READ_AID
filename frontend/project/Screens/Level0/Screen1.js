import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import * as Font from 'expo-font';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { Audio } from "expo-av";
import { apiClient, ENDPOINTS } from '../../config/api';

const InitialSetupTwoScreen = ({ navigation, route }) => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [wordList, setWordList] = useState([]); 
  const [currentIndex, setCurrentIndex] = useState(0);
  const [recording, setRecording] = useState(null);
  const [loading, setLoading] = useState(true);
  const [phoneticBreakdown, setPhoneticBreakdown] = useState("");  
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [sound, setSound] = useState(null);
  const volume = 1.0;// Ensure volume is initialized
  const [speechSettings, setSpeechSettings] = useState(null);

  const level = route.params?.level;

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        OpenDyslexic: require('../../assets/fonts/OpenDyslexic-Regular.otf'),
      });
      setFontsLoaded(true);
    }

    async function fetchWords() {
      try {
        const response = await apiClient.get(`${ENDPOINTS.levels}/${level}/words`);
        const words = response.data.words || [];
        if (Array.isArray(words)) {
          setWordList(words);
        } else {
          console.error("Invalid data format received:", response.data);
          setWordList([]);
        }
      } catch (error) {
        console.error("Error fetching words:", error);
        setWordList([]);
      } finally {
        setLoading(false);
      }
    }

    loadFonts();
    fetchWords();
  }, [level]);

  useEffect(() => {
    const fetchSpeechSettings = async () => {
      if (currentWord?._id) {
        try {
          const settings = await getSpeechSettings(currentWord._id);
          setSpeechSettings(settings);
        } catch (error) {
          console.error('Error fetching speech settings:', error);
        }
      }
    };

    fetchSpeechSettings();
  }, [currentIndex, wordList]);

  const fetchPhoneticBreakdown = async (word) => {
    try {
      const response = await apiClient.post(ENDPOINTS.phonetic, { word: word });
      setPhoneticBreakdown(response.data.phonetic_breakdown.join(' '));
    } catch (error) {
      console.error("Error fetching phonetic breakdown:", error);
      Alert.alert("Phonetic breakdown not available.");
    }
  };

  // Cleanup audio on component unmount
  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const handleSpeak = async (text) => {
    if (isSpeaking) return;

    try {
      setIsSpeaking(true);

      // Request audio playback permissions
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        staysActiveInBackground: false,
        playThroughEarpieceAndroid: false,
      });

      // Send request to backend to generate and return audio file
      const response = await fetch('http://192.168.100.14:5000/api/generate_voice_from_db', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        console.log(data);
        throw new Error("Failed to fetch audio");
        
      }

      // Convert response to a blob
      const audioBlob = await response.blob();
      const audioUri = URL.createObjectURL(audioBlob); // Create local URL

      // Stop and unload any previously playing audio
      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
      }

      // Load and play the new audio
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioUri },
        { shouldPlay: true, volume }
      );
      setSound(newSound);

      // Wait for the audio to finish playing
      newSound.setOnPlaybackStatusUpdate(async (status) => {
        if (status.didJustFinish) {
          setIsSpeaking(false);
          await newSound.unloadAsync();
        }
      });
    } catch (error) {
      console.error("Error in handleSpeak:", error);
      
    } finally {
      setIsSpeaking(false);
    }
  };

  

  const handleNextWord = () => {
    if (currentIndex < wordList.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      Alert.alert("End of Level", "You have reached the end of the level!");
    }
  };

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
      const response = await apiClient.post(ENDPOINTS.processAudio, {
        method: 'POST',
        body: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.ok) {
        Alert.alert('Success', 'Audio processed and voice synthesized!');
      } else {
        Alert.alert('Error', 'Audio processing failed.');
      }
    } catch (error) {
      console.error('Error uploading audio:', error);
      Alert.alert('Error', 'Failed to upload audio.');
    }
  };

  useEffect(() => {
    if (wordList.length > 0) {
      const currentWord = wordList[currentIndex]?.word;
      if (currentWord) {
        fetchPhoneticBreakdown(currentWord);
      }
    }
  }, [currentIndex, wordList]);

  if (!fontsLoaded || loading) {
    return (
      <View style={styles.loadingContainer}>
       <ActivityIndicator 
  testID="loading-indicator"
  size="large" 
  color="#000" 
/>

      </View>
    );
  }

  if (wordList.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>No words available for this level.</Text>
      </View>
    );
  }

  const currentWord = wordList[currentIndex];

  return (
    <KeyboardAvoidingView
  style={{ flex: 1 }}
  behavior={Platform.OS === 'ios' ? 'padding' : undefined}
>
  <ScrollView contentContainerStyle={styles.scrollContainer}>
    <View style={styles.container} testID="main-container">
      <View style={styles.circle1}></View>
      <View style={styles.circle2}></View>

      <TouchableOpacity
        testID="back-button"
        style={styles.backArrow}
        onPress={() => navigation.goBack()}
      >
        <Icon name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

      <Text style={styles.title} testID="title-text">
        Tap microphone and
      </Text>
      <Text style={styles.subtitle} testID="subtitle-text">
        read aloud
      </Text>

      <View style={styles.card} testID="word-card">
        <Image
          testID="word-image"
          source={{ uri: currentWord?.imageUrl }}
          style={styles.image}
        />
        <View style={styles.wordContainer}>
          <Text style={styles.sentence} testID="word-text">
            {currentWord?.word}
          </Text>
          <TouchableOpacity 
            testID="speak-button"
            style={styles.speakerButton}
            onPress={() => handleSpeak(currentWord?.word)}
            disabled={isSpeaking}
          >
            <Icon 
              name={isSpeaking ? "volume-high" : "volume-medium"} 
              size={24} 
              color={isSpeaking ? "#4CAF50" : "#000"} 
            />
          </TouchableOpacity>
        </View>
        <View style={styles.phoneticContainer}>
          <Text style={styles.phoneticBreakdown} testID="phonetic-text">
            {phoneticBreakdown}
          </Text>
          <TouchableOpacity 
            testID="phonetic-speak-button"
            style={styles.speakerButton}
            onPress={() => handleSpeak(phoneticBreakdown, true)}
            disabled={isSpeaking}
          >
            <Icon 
              name="volume-low" 
              size={20} 
              color={isSpeaking ? "#4CAF50" : "#000"} 
            />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        testID="mic-button"
        style={styles.micButton}
        onPress={recording ? stopRecording : startRecording}
      >
        <Icon name={recording ? 'stop' : 'mic'} size={24} color="black" />
      </TouchableOpacity>

      {recording && <View testID="recording-indicator" style={styles.recordingIndicator} />}

      <TouchableOpacity 
        testID="next-button" 
        style={styles.nextButton} 
        onPress={handleNextWord}
      >
        <Icon name="arrow-forward" size={24} color="#000" />
      </TouchableOpacity>

      <View style={styles.circle3}></View>
      <View style={styles.circle4}></View>

      {loading && (
        <View style={styles.loadingContainer} testID="loading-container">
          <ActivityIndicator testID="loading-indicator" size="large" color="#000" />
        </View>
      )}
    </View>
  </ScrollView>
</KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#F4E7FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle1: {
    width: 230,
    height: 220,
    backgroundColor: '#BFE5FF',
    borderRadius: 120,
    position: 'absolute',
    top: '-25%',
    left: '-8%',
  },
  circle2: {
    width: 220,
    height: 220,
    backgroundColor: '#C5FF93',
    borderRadius: 120,
    position: 'absolute',
    top: '-23%',
    right: '-5%',
  },
  circle3: {
    width: 220,
    height: 220,
    backgroundColor: '#BFE5FF',
    borderRadius: 120,
    position: 'absolute',
    bottom: '-25%',
    left: '-8%',
  },
  circle4: {
    width: 220,
    height: 220,
    backgroundColor: '#C5FF93',
    borderRadius: 120,
    position: 'absolute',
    bottom: '-24%',
    right: '-5%',
  },
  backArrow: {
    position: 'absolute',
    top: 60,
    left: 20,
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
  wordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  phoneticContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  speakerButton: {
    padding: 10,
    marginLeft: 10,
  },
  title: {
    fontSize: 20,
    fontFamily: 'OpenDyslexic',
    color: '#000',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 20,
    fontFamily: 'OpenDyslexic',
    color: '#000',
    marginBottom: 20,
  },
  card: {
    width: '80%',
    height: '60%',
    backgroundColor: '#E0F3FF',
    borderRadius: 15,
    alignItems: 'center',
    padding: 20,
    elevation: 3,
    justifyContent: 'center',
  },
  image: {
    width: '80%',
    height: '60%',
    resizeMode: 'contain',
    marginVertical: 10,
  },
  sentence: {
    fontSize: 48,
    fontFamily: 'OpenDyslexic',
    color: '#000',
  },
  phoneticBreakdown: {
    fontSize: 30,
    fontFamily: 'OpenDyslexic',
    color: '#17A2B8', // Bold color
    marginVertical: 10,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4E7FF',
  },
});

export default InitialSetupTwoScreen;
