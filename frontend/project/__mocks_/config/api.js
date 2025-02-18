// __mocks__/config/api.js
const mockApiClient = {
  get: jest.fn(),
  post: jest.fn()
};

export const ENDPOINTS = {
  levels: '/api/levels',
  phonetic: '/api/phonetic',
  processAudio: '/api/processAudio',
  generate_voice: '/api/generate_voice_from_db'
};

export const apiClient = mockApiClient;