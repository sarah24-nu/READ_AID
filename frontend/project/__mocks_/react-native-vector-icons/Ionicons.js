// __mocks__/react-native-vector-icons/Ionicons.js
export default 'Icon';

// __mocks__/expo-font.js
export const Font = {
  loadAsync: jest.fn().mockResolvedValue(true),
  isLoaded: jest.fn().mockReturnValue(true)
};

// __mocks__/config/api.js
export const apiClient = {
  get: jest.fn(),
  post: jest.fn()
};

export const ENDPOINTS = {
  levels: '/api/levels',
  phonetic: '/api/phonetic',
  processAudio: '/api/processAudio'
};