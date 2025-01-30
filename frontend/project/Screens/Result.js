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
import Icon from 'react-native-vector-icons/Ionicons';


const ResultScreen = ({ route, navigation }) => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

  const { score, totalQuestions } = route.params; 

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
        {/* Result Card */}
        <View >
        <Text style={styles.title}>Level Cleared!</Text>
        <Image 
          source={require('../assets/Level0 Assets/confetti.png')} 
          style={styles.congratulationsImage}
        />
         
          <View style={styles.starsContainer}>
            {/* Display stars based on performance */}
            {Array.from({ length: totalQuestions }).map((_, index) => (
              <Image
                key={index}
                source={
                  index < score
                    ? require('../assets/star-filled.png') 
                    : require('../assets/star-empty.png') 
                }
                style={styles.star}
              />
            ))}
          </View>
          {/* Score Section */}
          <Text style={styles.resultText}>Score: {score}</Text>
          <Text style={styles.resultText}>Total Score: {Math.max(score, totalQuestions)}</Text>
        </View>

        <TouchableOpacity
            style={styles.retryButton}
            onPress={() => navigation.navigate('QuizScreen')}
        >
         <Text style={{ fontFamily: 'OpenDyslexic'}}>Retry Quiz</Text>
        </TouchableOpacity>


        <View style={styles.footer}>
        <TouchableOpacity
          onPress={() => navigation.navigate('HomeScreen')}
          style={styles.footerButton}
        >
          <Icon name="home-outline" size={20} color="#000" />
          <Text style={styles.footerText} >Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('ProfileScreen')}
          style={styles.footerButton}
        >
          <Icon name="person-outline" size={20} color="#000" />
          <Text style={styles.footerText}>Profile</Text>
        </TouchableOpacity>
      </View>
        
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F4E7FF',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
      paddingBottom: 70, 
    },
    title: {
      fontFamily: 'OpenDyslexic',
      fontSize: 28,
      color: '#000',
      textAlign: 'center',
      marginBottom: 10,
      marginTop:15,
    },
    starsContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: 15,
    },
    star: {
      width: 40,
      height: 40,
      marginHorizontal: 5,
      resizeMode: 'contain',
    },
    resultText: {
      fontFamily: 'OpenDyslexic',
      fontSize: 18,
      color: '#333',
      marginBottom: 5,
      textAlign: 'center',
    },
    retryButton: {
      backgroundColor: '#66BBFF',
      borderRadius: 25,
      paddingVertical: 15,
      paddingHorizontal: 40,
      elevation: 5,
      marginTop:50,
      marginBottom: 10,
      alignSelf: 'center',
    },
    congratulationsImage: {
      width: 300,
      height: 300,
      marginBottom: 20,
      left:10,
      resizeMode: 'contain',
    },
    footer: {
      position: 'absolute', 
      bottom: 0,
      width: '120%',
      height: 60, 
      backgroundColor: '#F4E7FF',
      borderTopWidth: 2,
      borderTopColor: '#DDD',
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      
    },
    footerButton: {
      alignItems: 'center',
    },
    footerText: {
      fontSize: 14,
      fontFamily: 'OpenDyslexic',
      color: '#333',
      marginTop: 5,
    },
  });
  
export default ResultScreen;
