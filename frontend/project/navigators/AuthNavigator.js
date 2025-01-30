import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignInScreen from '../Screens/SignIn';
import SignUpScreen from '../Screens/Signup';
import ForgetPasswordScreen from '../Screens/ForgetPassword';

const Stack = createNativeStackNavigator();

const AuthNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="SignIn" component={SignInScreen} />
    <Stack.Screen name="SignUp" component={SignUpScreen} />
    <Stack.Screen name="ForgetPassword" component={ForgetPasswordScreen} />
  </Stack.Navigator>
);

export default AuthNavigator;
