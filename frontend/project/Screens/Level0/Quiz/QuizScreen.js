import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import * as Font from 'expo-font';

const QuizScreen = ({ navigation }) => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showAnswers, setShowAnswers] = useState(false);

  
  const quizData = [
    {
      word: "Bat",
      image: require('../../../assets/Level0 Assets/b.png'),
      options: ["Bat", "Bit", "Ball"],
      correctOption: "Bat",
    },
    {
      word: "Dog",
      image: require('../../../assets/Level0 Assets/d.png'),
      options: ["Dig", "Dog", "Dag"],
      correctOption: "Dog",
    },
    {
      word: "Apple",
      image: require('../../../assets/Level0 Assets/a.png'),
      options: ["Apple", "Pineapple", "Aeroplane"],
      correctOption: "Apple",
    },
  ];

  
  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'OpenDyslexic': require('../../../assets/fonts/OpenDyslexic-Regular.otf'), 
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return null; 
  }

  const handleAnswer = (option) => {
    setSelectedOption(option);
    setShowAnswers(true);

    if (option === quizData[currentQuestion].correctOption) {
      setScore(score + 1);
    }

    
    
    setTimeout(() => {
      if (currentQuestion < quizData.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedOption(null);
        setShowAnswers(false);
      } else {
        navigation.navigate('ResultScreen', {
          score: score + (option === quizData[currentQuestion].correctOption ? 1 : 0),
          totalQuestions: quizData.length,
        });
      }
    }, 2000);
  };

  return (
    <View style={styles.container}>
      {/* Header with Progress */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Quiz Progress</Text>
        <View style={styles.progressBar}>
          <View
            style={{
              ...styles.progressFill,
              width: `${((currentQuestion + 1) / quizData.length) * 100}%`,
            }}
          />
        </View>
      </View>

      {/* Question Card */}
      <View style={styles.card}>
        <Text style={styles.question}>What is this?</Text>
        <Image source={quizData[currentQuestion].image} style={styles.image} />
      </View>

      {/* Options */}
      <View style={styles.optionsContainer}>
        {quizData[currentQuestion].options.map((option, index) => {
          let buttonStyle = styles.optionButton;
          if (showAnswers) {
            if (option === quizData[currentQuestion].correctOption) {
              buttonStyle = { ...buttonStyle, backgroundColor: '#32CD32' }; 
            } else if (option === selectedOption) {
              buttonStyle = { ...buttonStyle, backgroundColor: '#FF6347' }; 
              
            }
          }

          return (
            <TouchableOpacity
              key={index}
              style={buttonStyle}
              onPress={() => !showAnswers && handleAnswer(option)}
              disabled={showAnswers} 
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F8FF',
    padding: 20,
    alignItems: 'center',
  },
  header: {
    width: '100%',
    marginTop:40,
    marginBottom: 20,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    fontFamily: 'OpenDyslexic',
    marginBottom: 10,
    color: '#333',
  },
  progressBar: {
    width: '90%',
    height: 10,
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#32CD32',
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    width: '90%',
    elevation: 5,
  },
  question: {
    fontSize: 24,
    fontFamily: 'OpenDyslexic',
    color: '#555',
    marginBottom: 10,
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  optionsContainer: {
    width: '100%',
    alignItems: 'center',
  },
  optionButton: {
    backgroundColor: '#FFD700',
    padding: 15,
    borderRadius: 25,
    marginVertical: 8,
    width: '80%',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  optionText: {
    fontSize: 18,
    fontFamily: 'OpenDyslexic',
    color: '#333',
  },
});

export default QuizScreen;
