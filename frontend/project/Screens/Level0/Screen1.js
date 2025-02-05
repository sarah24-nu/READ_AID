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
import { apiClient, ENDPOINTS } from '../../config/api';

const InitialSetupTwoScreen = ({ navigation, route }) => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [wordList, setWordList] = useState([]); 
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [phoneticBreakdown, setPhoneticBreakdown] = useState("");  // Store phonetic breakdown

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

  const fetchPhoneticBreakdown = async (word) => {
    try {
      const response = await apiClient.post(ENDPOINTS.phonetic, { word: word });
      setPhoneticBreakdown(response.data.phonetic_breakdown.join(' '));
    } catch (error) {
      console.error("Error fetching phonetic breakdown:", error);
      setPhoneticBreakdown("Phonetic breakdown not available.");
    }
  };

  const handleNextWord = () => {
    if (currentIndex < wordList.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      Alert.alert("End of Level", "You have reached the end of the level!");
    }
  };

  useEffect(() => {
    // Fetch phonetic breakdown for the current word
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
        <ActivityIndicator size="large" color="#000" />
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

  // Safely extract word and imageUrl using optional chaining
  const currentWord = wordList[currentIndex];

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.circle1}></View>
          <View style={styles.circle2}></View>

          {/* Back Arrow */}
          <TouchableOpacity
            style={styles.backArrow}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>

          {/* Title and Subtitle */}
          <Text style={styles.title}>Tap microphone and</Text>
          <Text style={styles.subtitle}>read aloud</Text>

          {/* Word Card */}
          <View style={styles.card}>
            <Image
              source={{ uri: currentWord?.imageUrl }}
              style={styles.image}
            />
            {/* <Text style={styles.sentence}>{currentWord?.word}</Text> */}
            <Text style={styles.sentence}> {phoneticBreakdown || currentWord?.word} </Text>
            {/* Phonetic Breakdown inside the Card */}
            {/* <Text style={styles.phoneticBreakdown}>{phoneticBreakdown}</Text> */}
          </View>

          {/* Microphone Button */}
          <TouchableOpacity style={styles.micButton}>
            <Icon name="mic" size={24} color="black" />
          </TouchableOpacity>

          {/* Next Button */}
          <TouchableOpacity style={styles.nextButton} onPress={handleNextWord}>
            <Icon name="arrow-forward" size={24} color="#000" />
          </TouchableOpacity>

          <View style={styles.circle3}></View>
          <View style={styles.circle4}></View>
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
    marginVertical: 20,
  },
  phoneticBreakdown: {
    fontSize: 40,
    fontFamily: 'OpenDyslexic',
    color: '#17A2B8', // Bold color
    fontWeight: 'bold', // Bold text
    marginVertical: 20,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4E7FF',
  },
});

export default InitialSetupTwoScreen;
