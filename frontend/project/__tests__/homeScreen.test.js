// __tests__/HomeScreen.test.js
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import HomeScreen from '../Screens/HomeScreen';
import * as Font from 'expo-font';

// Mock dependencies
jest.mock('expo-font');
jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');

describe('HomeScreen', () => {
  const mockNavigation = {
    navigate: jest.fn(),
  };

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();

    // Mock font loading
    Font.loadAsync.mockResolvedValue(true);
  });

  describe('Component Initialization', () => {
    it('renders loading state initially', async () => {
      // Create a never-resolving promise to simulate fonts loading
      Font.loadAsync.mockImplementationOnce(() => new Promise(() => {}));

      const { toJSON } = render(<HomeScreen navigation={mockNavigation} />);
      
      // Check that nothing is rendered while fonts are loading
      expect(toJSON()).toBeNull();
    });

    it('renders screen after fonts are loaded', async () => {
      const { getByText } = render(<HomeScreen navigation={mockNavigation} />);
      
      await waitFor(() => {
        // Check for key elements that should be present
        expect(getByText('Hey, Welcome!')).toBeTruthy();
        expect(getByText('Let\'s Play!')).toBeTruthy();
      });
    });
  });

  describe('Level Navigation', () => {
    it('navigates to correct screen when level is selected', async () => {
      const { getByText } = render(<HomeScreen navigation={mockNavigation} />);
      
      await waitFor(() => {
        // Test navigation for multiple levels
        const levelTestCases = [
          { text: 'Level 0', expectedLevel: 0 },
          { text: 'Level 1', expectedLevel: 1 },
          { text: 'Level 2', expectedLevel: 2 },
          { text: 'Level 10', expectedLevel: 10 }
        ];

        levelTestCases.forEach(({ text, expectedLevel }) => {
          const levelButton = getByText(text);
          fireEvent.press(levelButton);
          expect(mockNavigation.navigate).toHaveBeenCalledWith('Screen1', { level: expectedLevel });
        });
      });
    });
  });

  describe('Footer Navigation', () => {
    it('navigates to HomeScreen when home icon is pressed', async () => {
      const { getByText } = render(<HomeScreen navigation={mockNavigation} />);
      
      await waitFor(() => {
        const homeButton = getByText('Home');
        fireEvent.press(homeButton);
        expect(mockNavigation.navigate).toHaveBeenCalledWith('HomeScreen');
      });
    });

    it('navigates to ProfileScreen when profile icon is pressed', async () => {
      const { getByText } = render(<HomeScreen navigation={mockNavigation} />);
      
      await waitFor(() => {
        const profileButton = getByText('Profile');
        fireEvent.press(profileButton);
        expect(mockNavigation.navigate).toHaveBeenCalledWith('ProfileScreen');
      });
    });
  });

  describe('Screen Content', () => {
    it('renders all level cards', async () => {
      const { getByText } = render(<HomeScreen navigation={mockNavigation} />);
      
      await waitFor(() => {
        const levelTexts = [
          'Level 0', 'Level 1', 'Level 2', 'Level 3', 'Level 4', 
          'Level 5', 'Level 6', 'Level 7', 'Level 8', 'Level 9', 
          'Level 10', 'Level 11', 'Level 12', 'Level 13', 'Level 14'
        ];

        levelTexts.forEach(levelText => {
          expect(getByText(levelText)).toBeTruthy();
        });
      });
    });

    it('renders header elements', async () => {
      const { getByText } = render(<HomeScreen navigation={mockNavigation} />);
      
      await waitFor(() => {
        expect(getByText('Hey, Welcome!')).toBeTruthy();
        expect(getByText('Let\'s Play!')).toBeTruthy();
      });
    });
  });
});