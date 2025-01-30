import React, { useState } from 'react';  
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
} from 'react-native';  
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';

const SignUpScreen = ({ navigation }) => {  
  const [email, setEmail] = useState('');  
  const [name, setUsername] = useState('');  
  const [password, setPassword] = useState('');  
  const [confirmPassword, setConfirmPassword] = useState('');  
  const [secureTextEntry, setSecureTextEntry] = useState(true); 
  const [secureConfirmTextEntry, setSecureConfirmTextEntry] = useState(true);  
  const [securityQuestion, setSecurityQuestion] = useState('');  
  const [securityAnswer, setSecurityAnswer] = useState('');  
  const [modalVisible, setModalVisible] = useState(false);  

  const questions = [
    'What is your favorite color?',
    "What is your pet's name?",
    "What is your mother's middle name?",
    'What is the name of your first school?',
    'What is your favorite food?',
  ];

  const handleSignUp = async () => {  
    if (!email || !password || !securityQuestion || !securityAnswer) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    try {
      
      const response = await axios.post('http://10.100.20.136:5000/api/signup', {
        email,
        password,
        name,
        securityQuestion,
        securityAnswer,
      });

      
      Alert.alert('Success', 'Registration successful! Please log in.');
      navigation.navigate('SignIn');
    } catch (error) {
      
      const errorMessage = error.response?.data?.error || 'Registration failed. Please try again.';
      Alert.alert('Error', errorMessage);
    }
  };

  const handleSelectQuestion = (question) => {
    setSecurityQuestion(question);
    setModalVisible(false);
  };

  return (  
    <View style={styles.container}> 
      <View style={styles.circle1}></View>
      <View style={styles.circle2}></View>

      <Text style={styles.title}>READ AID</Text>  
      <Text style={styles.subtitle}>Sign Up</Text> 
      
      <TextInput  
        style={styles.input}  
        placeholder="Enter Username"  
        value={name}  
        onChangeText={setUsername}  
      />  
      <TextInput  
        style={styles.input}  
        placeholder="Enter Email"  
        value={email}  
        onChangeText={setEmail}  
      />  
      <View style={styles.passwordContainer}>
        <TextInput
          style={[styles.passwordInput, { flex: 1 }]}
          placeholder="Password"
          secureTextEntry={secureTextEntry}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          onPress={() => setSecureTextEntry(!secureTextEntry)}
          style={styles.eyeIcon}
        >
          <Icon
            name={secureTextEntry ? 'eye-off' : 'eye'}
            size={20}
            color="gray"
          />
        </TouchableOpacity>
      </View> 
      <View style={styles.passwordContainer}>
        <TextInput
          style={[styles.passwordInput, { flex: 1 }]}
          placeholder="Confirm Password"
          secureTextEntry={secureConfirmTextEntry}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <TouchableOpacity
          onPress={() => setSecureConfirmTextEntry(!secureConfirmTextEntry)}
          style={styles.eyeIcon}
        >
          <Icon
            name={secureConfirmTextEntry ? 'eye-off' : 'eye'}
            size={20}
            color="gray"
          />
        </TouchableOpacity>
      </View> 

      {/* Security Question */}
      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.dropdownText}>
          {securityQuestion || 'Select a Security Question'}
        </Text>
      </TouchableOpacity>

      <TextInput  
        style={styles.input}  
        placeholder="Answer to Security Question"  
        value={securityAnswer}  
        onChangeText={setSecurityAnswer}  
      />  

      <TouchableOpacity style={styles.signInButton} onPress={handleSignUp}>  
        <Text style={styles.signInButtonText}>Sign Up</Text>  
      </TouchableOpacity>   
      <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>  
        <Text style={styles.signUpText}>Already have an account? Sign in</Text>  
      </TouchableOpacity>  

      {/* Modal for selecting a security question */}
      <Modal
        transparent={true}
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <FlatList
              data={questions}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => handleSelectQuestion(item)}
                >
                  <Text style={styles.modalItemText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.circle3}></View>
      <View style={styles.circle4}></View>
    </View>  
  );  
};  

const styles = StyleSheet.create({  
  container: {  
    flex: 1,  
    padding: 20,  
    backgroundColor: '#F1E7FF',  
    justifyContent: 'center', 
  },  
  title: {  
    fontSize: 32,  
    textAlign: 'center',   
    fontFamily: 'OpenDyslexic',
    marginVertical: 0,  
  },  
  subtitle: {  
    fontSize: 20,
    marginVertical: 10,   
    fontFamily: 'OpenDyslexic',  
    textAlign: 'center',  
  }, 
  input: {  
    height: 50,  
    borderColor: 'gray',  
    borderWidth: 0.5,  
    marginBottom: 15,  
    fontFamily: 'OpenDyslexic',   
    paddingHorizontal: 10,  
    borderRadius: 10,  
  },  
  passwordInput: {
    fontFamily: 'OpenDyslexic',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: 'gray',
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  dropdown: {
    height: 50,
    borderWidth: 0.5,
    borderColor: 'gray',
    borderRadius: 10,
    marginBottom: 15,
    justifyContent: 'center',
    paddingHorizontal: 10,
    backgroundColor: '#F1E7FF',
  },
  dropdownText: {
    backgroundColor: '#F1E7FF',
    color: 'gray',
    fontSize: 14,
    fontFamily: 'OpenDyslexic',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
  },
  modalItem: {
    padding: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: 'gray',
  },
  modalItemText: {
    fontSize: 14,
    fontFamily: 'OpenDyslexic',
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: '#66BBFF',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontFamily: 'OpenDyslexic',
  },
  signInButton: {  
    backgroundColor: '#66BBFF', 
    borderRadius: 25, 
    paddingVertical: 10, 
    paddingHorizontal: 40,
    elevation: 3, 
    alignSelf: 'center', 
  },  
  signInButtonText: {  
    color: 'white',  
    fontSize: 14, 
    fontFamily: 'OpenDyslexic',  
  }, 
  signUpText: {  
    textAlign: 'center',  
    marginVertical: 10,  
    fontFamily: 'OpenDyslexic',
    marginTop: 20,  
  },    
});  

export default SignUpScreen;
