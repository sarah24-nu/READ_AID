import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ConfigurationScreen from '../Screens/Configuration';
import FontSettingScreen from '../Screens/FontSettings';
import InitialSetupScreen from '../Screens/InitialSetup';
import InitialSetupTwoScreen from '../Screens/initialSetup2';

const Stack = createNativeStackNavigator();

const MainNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Configuration" component={ConfigurationScreen} />
    <Stack.Screen name="FontSetting" component={FontSettingScreen} />
    <Stack.Screen name="InitialSetup" component={InitialSetupScreen} />
    <Stack.Screen name="InitialSetupTwo" component={InitialSetupTwoScreen} />
  </Stack.Navigator>
);

export default MainNavigator;
