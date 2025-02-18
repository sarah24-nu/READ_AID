import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import InitialSetupTwoScreen from '../Screens/Level0/Screen1';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn()
}));

// Create mock functions
const mockGet = jest.fn();
const mockPost = jest.fn();

// Mock API client - using relative path
jest.mock('../config/api', () => ({
  apiClient: {
    get: (...args) => mockGet(...args),
    post: (...args) => mockPost(...args)
  },
  ENDPOINTS: {
    levels: '/api/levels',
    phonetic: '/api/phonetic',
    processAudio: '/api/processAudio'
  }
}));

// Mock FileSystem
jest.mock('expo-file-system', () => ({
  getInfoAsync: jest.fn().mockResolvedValue({ exists: true }),
  readAsStringAsync: jest.fn().mockResolvedValue('test-content')
}));

// Mock Icon
jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');

// Mock expo-av
jest.mock('expo-av', () => ({
  Audio: {
    requestPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
    setAudioModeAsync: jest.fn().mockResolvedValue({}),
    Recording: {
      createAsync: jest.fn().mockImplementation(() => Promise.resolve({
        recording: {
          startAsync: jest.fn(),
          stopAndUnloadAsync: jest.fn(),
          getStatusAsync: jest.fn().mockResolvedValue({ isDoneRecording: true }),
          getURI: jest.fn().mockReturnValue('test-uri')
        }
      }))
    },
    Sound: {
      createAsync: jest.fn().mockImplementation(() => Promise.resolve({
        sound: {
          playAsync: jest.fn(),
          unloadAsync: jest.fn(),
          setOnPlaybackStatusUpdate: jest.fn()
        }
      }))
    }
  }
}));

// Mock fetch
global.fetch = jest.fn(() => 
  Promise.resolve({
    ok: true,
    blob: () => Promise.resolve(new Blob())
  })
);

// Mock FormData for Expo
global.FormData = function() {
  const data = {};
  const parts = [];
  return {
    append: (key, value, filename) => {
      data[key] = value;
      parts.push({ key, value, filename });
    },
    getParts: () => parts,
    [Symbol.iterator]: function* () {
      for (let key in data) {
        yield [key, data[key]];
      }
    }
  };
};

// Console error spy
let consoleErrorSpy;

beforeAll(() => {
  consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(() => {
  consoleErrorSpy.mockRestore();
});

// Mock Alert
jest.spyOn(Alert, 'alert').mockImplementation(() => {});

describe('InitialSetupTwoScreen', () => {
  const mockNavigation = { goBack: jest.fn() };
  const mockRoute = { params: { level: 1 } };
  const mockWordList = [
    { _id: '1', word: 'cat', imageUrl: 'test-url-1' },
    { _id: '2', word: 'dog', imageUrl: 'test-url-2' }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockGet.mockResolvedValue({ data: { words: mockWordList } });
    mockPost.mockResolvedValue({ data: { phonetic_breakdown: ['k', 'æ', 't'] } });
  });

  describe('Component Initialization', () => {
    it('shows loading indicator initially', async () => {
      const { getByTestId } = render(
        <InitialSetupTwoScreen navigation={mockNavigation} route={mockRoute} />
      );
      expect(getByTestId('loading-indicator')).toBeTruthy();
    });

    it('displays words after loading', async () => {
      const { findByTestId } = render(
        <InitialSetupTwoScreen navigation={mockNavigation} route={mockRoute} />
      );

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      const wordText = await findByTestId('word-text');
      expect(wordText.props.children).toBe('cat');
    });
  });

  describe('Audio Recording', () => {
    it('handles recording start and stop', async () => {
      const { findByTestId } = render(
        <InitialSetupTwoScreen navigation={mockNavigation} route={mockRoute} />
      );

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      const micButton = await findByTestId('mic-button');
      await act(async () => {
        fireEvent.press(micButton);
      });

      expect(micButton).toBeTruthy();
    });
  });

  describe('Navigation', () => {
    it('handles next word navigation', async () => {
      const { findByTestId } = render(
        <InitialSetupTwoScreen navigation={mockNavigation} route={mockRoute} />
      );

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      const nextButton = await findByTestId('next-button');
      await act(async () => {
        fireEvent.press(nextButton);
      });

      const wordText = await findByTestId('word-text');
      expect(wordText.props.children).toBe('dog');
    });

    it('goes back when back button is pressed', async () => {
      const { findByTestId } = render(
        <InitialSetupTwoScreen navigation={mockNavigation} route={mockRoute} />
      );

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      const backButton = await findByTestId('back-button');
      await act(async () => {
        fireEvent.press(backButton);
      });

      expect(mockNavigation.goBack).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('handles word fetch error', async () => {
      mockGet.mockRejectedValueOnce(new Error('Network error'));
      
      const { findByText } = render(
        <InitialSetupTwoScreen navigation={mockNavigation} route={mockRoute} />
      );

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      const errorText = await findByText('No words available for this level.');
      expect(errorText).toBeTruthy();
    });
  });
});