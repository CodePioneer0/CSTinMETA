import API from './axios';

export const startSession = () => API.post('/users/session/start');

export const completeOnboarding = (data) => API.put('/users/onboarding', data);

export const signup = (data) => API.post('/auth/signup', data);

export const login = (data) => API.post('/auth/login', data);
