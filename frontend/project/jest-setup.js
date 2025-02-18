// jest.setup.js
process.env.EXPO_OS = 'android'; // or 'ios'

// Mock expo-font
jest.mock('expo-font');

// Mock expo-av
jest.mock('expo-av', () => ({
  Audio: {
    requestPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
    setAudioModeAsync: jest.fn().mockResolvedValue(true)
  }
}));

// Mock other Expo modules as needed
jest.mock('expo-file-system', () => ({
  getInfoAsync: jest.fn()
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn()
}));