import API from './axios';

export const logSugarEvent = (data) => API.post('/sugar/log', data);

export const completeAction = (sugarEventId) =>
  API.post('/sugar/action/complete', { sugarEventId });
