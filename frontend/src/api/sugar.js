import API from './axios';

export const logSugarEvent = (data) => API.post('/sugar/log', data);


export const logSugarImage = (formData) =>
  API.post('/sugar/log-image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const completeAction = (sugarEventId) =>
  API.post('/sugar/action/complete', { sugarEventId });