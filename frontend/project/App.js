import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from './Screens/ReadAid'; 
import SignInScreen from './Screens/SignIn'; 
import SignUpScreen from './Screens/Signup'; 
import SignInWithGoogleScreen from './Screens/SignIn_with_google';
import ConfigurationScreen from './Screens/Configuration'; 
import ForgetPasswordScreen from './Screens/ForgetPassword'; 
import FontSettingScreen from './Screens/FontSettings'; 
import InitialSetupScreen from './Screens/InitialSetup'; 
import InitialSetupTwoScreen from './Screens/initialSetup2'; 
import HomeScreen from './Screens/HomeScreen';
import Screen1 from './Screens/Level0/Screen1';
import TakeQuiz from './Screens/Level0/TakeQuiz';
import QuizScreen from './Screens/Level0/Quiz/QuizScreen';
import ResultScreen from './Screens/Result';
import Profilescreen from './Screens/profile';
const Stack = createNativeStackNavigator();

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Tracks authentication state
  const [loading, setLoading] = useState(true); // Tracks loading state

  useEffect(() => {
    // Load token and determine authentication state
    const bootstrapAsync = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        console.log('Token retrieved:', token);
        setIsAuthenticated(!!token);
      } catch (error) {
        console.error('Error loading token:', error);
      } finally {
        setLoading(false);
      }
    };
    bootstrapAsync();
  }, []);

  if (loading) {
   
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Unauthenticated Screens */}
        <Stack.Screen name="SignIn">
          {(props) => <SignInScreen {...props} setIsAuthenticated={setIsAuthenticated} />}
        </Stack.Screen>
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="ForgetPassword" component={ForgetPasswordScreen} />
        <Stack.Screen name="SignInWithGoogle" component={SignInWithGoogleScreen} />

        {/* Authenticated Screens */}
        <Stack.Screen name="Configuration">
          {(props) => <ConfigurationScreen {...props} setIsAuthenticated={setIsAuthenticated} />}
        </Stack.Screen>
        <Stack.Screen name="FontSetting" component={FontSettingScreen} />
        <Stack.Screen name="InitialSetup" component={InitialSetupScreen} />
        <Stack.Screen name="InitialSetupTwo" component={InitialSetupTwoScreen} />
        <Stack.Screen name="HomeScreen" component={HomeScreen}/>
        <Stack.Screen name="Screen1" component={Screen1}/>
        <Stack.Screen name="TakeQuiz" component={TakeQuiz}/> 
        <Stack.Screen name="QuizScreen" component={QuizScreen} />
        <Stack.Screen name="ResultScreen" component={ResultScreen}/>
        <Stack.Screen name='ProfileScreen' component={Profilescreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}