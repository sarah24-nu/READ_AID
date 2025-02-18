// _mocks_/expo-av.js
export const Audio = {
    requestPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
    setAudioModeAsync: jest.fn(() => Promise.resolve()),
    Recording: {
      createAsync: jest.fn(() => Promise.resolve({
        recording: {
          stopAndUnloadAsync: jest.fn(),
          getURI: jest.fn(() => 'test-uri')
        }
      }))
    },
    Sound: {
      createAsync: jest.fn(() => Promise.resolve({
        sound: {
          playAsync: jest.fn(),
          unloadAsync: jest.fn(),
          stopAsync: jest.fn(),
          setOnPlaybackStatusUpdate: jest.fn()
        }
      }))
    }
  };
  
  export default {
    Audio
  };