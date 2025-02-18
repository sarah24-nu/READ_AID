// _mocks_/expo-file-system.js
const FileSystem = {
    getInfoAsync: jest.fn(() => Promise.resolve({ exists: true })),
    readAsStringAsync: jest.fn(() => Promise.resolve('')),
    writeAsStringAsync: jest.fn(() => Promise.resolve()),
    deleteAsync: jest.fn(() => Promise.resolve()),
    documentDirectory: 'file://document-directory/',
    cacheDirectory: 'file://cache-directory/'
  };
  
  export default FileSystem;