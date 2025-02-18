// _mocks_/expo-font.js
export const Font = {
    loadAsync: jest.fn(() => Promise.resolve())
  };
  
  export default {
    ...Font
  };