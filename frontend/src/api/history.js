import API from './axios';

export const getSugarHistory = (days = 7) =>
  API.get(`/sugar/history?days=${days}`);

export const getInsightsHistory = (days = 7) =>
  API.get(`/insights/history?days=${days}`);

export const getBadges = () => API.get('/badges');
