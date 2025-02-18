// config/api.js
export const API_CONFIG = {
    development: {
        baseURL: 'http://192.168.100.14:5000',
        timeout: 10000,
    },
    production: {
        baseURL: 'https://your-production-url.com',
        timeout: 10000,
    }
};

export const ENDPOINTS = {
    levels: '/api/levels',
    phonetic: '/api/phonetic',
    auth: '/api/auth',
    quiz: '/api/quiz',
    securityQuestion: '/api/get-security-question',
    resetPassword: '/api/reset-password',
    processAudio: '/api/process_audio',
    signin: '/api/signin',
    signup: '/api/signup',
    generate_voice_from_db: '/api/generate_voice_from_db'
    
    // Add all your endpoints here
};

const ENV = __DEV__ ? 'development' : 'production';

export const getBaseUrl = () => API_CONFIG[ENV].baseURL;
export const getFullUrl = (endpoint) => `${getBaseUrl()}${ENDPOINTS[endpoint]}`;

// Create a pre-configured axios instance
import axios from 'axios';

export const apiClient = axios.create({
    baseURL: getBaseUrl(),
    timeout: API_CONFIG[ENV].timeout,
    headers: {
        'Content-Type': 'application/json',
    },
});