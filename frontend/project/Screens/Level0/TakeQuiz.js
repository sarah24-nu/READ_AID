import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const TakeQuiz = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Gradient background or design enhancement */}
      <View style={styles.decorativeBackground} />

      {/* Card container */}
      <View >
        {/* Congratulatory Image */}
        <Image 
          source={require('../../assets/Level0 Assets/confetti.png')} 
          style={styles.congratulationsImage}
        />

        {/* Title - "Congratulations" text */}
        <Text style={styles.title}>Congratulations!</Text>
        <Text style={styles.subTitle}>You have completed Level 0 </Text>
      </View>

      {/* Button to go to the Quiz Screen */}
      <TouchableOpacity
        style={styles.quizButton}
        onPress={() => navigation.navigate('QuizScreen')}
        accessible={true}
        accessibilityLabel="Take Quiz"
      >
        <Text style={styles.quizButtonText}>Take Quiz</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4E7FF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  decorativeBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '40%',
    backgroundColor: 'linear-gradient(135deg, #FF7F50, #FF6347)',
    borderBottomRightRadius: 100,
    zIndex: -1,
  },
  
  congratulationsImage: {
    width: 300,
    height: 300,
    marginBottom: 20,
    left:20,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 28,
    fontFamily: 'OpenDyslexic',
    color: 'purple',
    textAlign: 'center',
    marginBottom: 10,
    textShadowColor: 'purple',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 2,
    elevation: 4,
  },
  subTitle: {
    fontSize: 18,
    fontFamily: 'OpenDyslexic',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  quizButton: {
    backgroundColor: '#B876DD',
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    marginTop: 10,
  },
  quizButtonText: {
    fontSize: 18,
    fontFamily: 'OpenDyslexic',
    color: '#333',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});

export default TakeQuiz;
