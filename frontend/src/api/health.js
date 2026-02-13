import API from './axios';

export const connectHealth = (data) => API.put('/health/connect', data);

export const getPermissions = () => API.get('/health/permissions');

export const syncHealth = (data) => API.post('/health/sync', data);
