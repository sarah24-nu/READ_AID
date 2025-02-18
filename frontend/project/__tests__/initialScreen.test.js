// __tests__/initialScreen.test.js
import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import InitialSetupScreen from '../Screens/InitialSetup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import * as Font from 'expo-font';
import * as ExpoAV from 'expo-av';

// Mock console.error
const originalConsoleError = console.error;
console.error = jest.fn();

// Mock Alert
jest.spyOn(Alert, 'alert').mockImplementation(() => {});

// Mock expo-font
jest.mock('expo-font', () => ({
  loadAsync: jest.fn()
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn()
}));

// Mock expo-av
jest.mock('expo-av', () => ({
  Audio: {
    requestPermissionsAsync: jest.fn(),
    Recording: {
      createAsync: jest.fn()
    }
  }
}));

// Mock font file
jest.mock('../assets/fonts/OpenDyslexic-Regular.otf', () => 'mocked-font-path');

// Mock Vector Icons
jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');

// Mock API configuration
jest.mock('../config/api', () => ({
  apiClient: {
    post: jest.fn().mockResolvedValue({ data: true })
  },
  ENDPOINTS: {
    processAudio: '/process-audio'
  }
}));

describe('InitialSetupScreen', () => {
  const mockNavigation = { 
    navigate: jest.fn(),
    goBack: jest.fn()
  };

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    
    // Reset mocks
    AsyncStorage.getItem.mockResolvedValue('20');
    Font.loadAsync.mockResolvedValue(true);
    ExpoAV.Audio.requestPermissionsAsync.mockResolvedValue({ status: 'granted' });
    ExpoAV.Audio.Recording.createAsync.mockResolvedValue({
      recording: {
        startAsync: jest.fn(),
        stopAndUnloadAsync: jest.fn(),
        getStatusAsync: jest.fn().mockResolvedValue({ isDoneRecording: true }),
        getURI: jest.fn().mockReturnValue('test-uri')
      }
    });
  });

  afterEach(() => {
    // Restore original console.error
    console.error = originalConsoleError;
  });

  describe('Component Initialization', () => {
    it('shows loading screen initially', async () => {
      const { getByText } = render(<InitialSetupScreen navigation={mockNavigation} />);
      
      await waitFor(() => {
        expect(getByText('Loading Fonts...')).toBeTruthy();
      });
    });

    it('loads font size from storage', async () => {
      render(<InitialSetupScreen navigation={mockNavigation} />);
      
      await waitFor(() => {
        expect(AsyncStorage.getItem).toHaveBeenCalledWith('fontSize');
      });
    });
  });

  describe('Audio Recording', () => {
    it('starts recording on mic button press', async () => {
      const { getByTestId } = render(<InitialSetupScreen navigation={mockNavigation} />);
      
      await waitFor(() => {
        const micButton = getByTestId('mic-button');
        expect(micButton).toBeTruthy();
      });
      
      await act(async () => {
        fireEvent.press(getByTestId('mic-button'));
      });
      
      await waitFor(() => {
        expect(ExpoAV.Audio.Recording.createAsync).toHaveBeenCalled();
      });
    });

    it('handles recording permission denial', async () => {
      ExpoAV.Audio.requestPermissionsAsync.mockResolvedValueOnce({ status: 'denied' });

      const { getByTestId } = render(<InitialSetupScreen navigation={mockNavigation} />);
      
      await waitFor(() => {
        const micButton = getByTestId('mic-button');
        expect(micButton).toBeTruthy();
      });
      
      await act(async () => {
        fireEvent.press(getByTestId('mic-button'));
      });
      
      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          'Permission denied',
          'Audio recording permission is required.'
        );
      });
    });

    it('handles recording errors', async () => {
      ExpoAV.Audio.Recording.createAsync.mockRejectedValueOnce(new Error('Recording Error'));

      // Spy on console.error
      const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      const { getByTestId } = render(<InitialSetupScreen navigation={mockNavigation} />);
      
      await waitFor(() => {
        const micButton = getByTestId('mic-button');
        expect(micButton).toBeTruthy();
      });
      
      await act(async () => {
        fireEvent.press(getByTestId('mic-button'));
      });
      
      await waitFor(() => {
        expect(errorSpy).toHaveBeenCalledWith(
          'Failed to start recording',
          expect.any(Error)
        );
      });
      
      // Restore console.error
      errorSpy.mockRestore();
    });
  });

  describe('Navigation', () => {
    it('navigates to FontSetting on back press', async () => {
      const { getByTestId } = render(<InitialSetupScreen navigation={mockNavigation} />);
      
      await waitFor(() => {
        const backButton = getByTestId('back-button');
        expect(backButton).toBeTruthy();
      });
      
      await act(async () => {
        fireEvent.press(getByTestId('back-button'));
      });
      
      expect(mockNavigation.navigate).toHaveBeenCalledWith('FontSetting');
    });

    it('navigates to InitialSetupTwo on next press', async () => {
      const { getByTestId } = render(<InitialSetupScreen navigation={mockNavigation} />);
      
      await waitFor(() => {
        const nextButton = getByTestId('next-button');
        expect(nextButton).toBeTruthy();
      });
      
      await act(async () => {
        fireEvent.press(getByTestId('next-button'));
      });
      
      expect(mockNavigation.navigate).toHaveBeenCalledWith('InitialSetupTwo');
    });
  });

  describe('Font Size', () => {
    it('applies stored font size to text elements', async () => {
      AsyncStorage.getItem.mockResolvedValueOnce('24');
      
      const { getByText } = render(<InitialSetupScreen navigation={mockNavigation} />);
      
      await waitFor(() => {
        const titleText = getByText('Tap microphone and');
        expect(titleText.props.style).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ fontSize: 24 })
          ])
        );
      });
    });

    it('handles font size storage error', async () => {
      // Spy on console.error
      const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      AsyncStorage.getItem.mockRejectedValueOnce(new Error('Storage Error'));
      
      render(<InitialSetupScreen navigation={mockNavigation} />);
      
      await waitFor(() => {
        expect(errorSpy).toHaveBeenCalledWith(
          'Error loading font size:',
          expect.any(Error)
        );
      });
      
      // Restore console.error
      errorSpy.mockRestore();
    });
  });
});