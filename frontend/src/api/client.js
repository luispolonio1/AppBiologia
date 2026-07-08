// Cliente HTTP minimo contra la API del backend.
import Constants from 'expo-constants';

const extra = Constants?.expoConfig?.extra || {};
// En emulador Android: 10.0.2.2 mapea al host. En iOS sim y web: localhost.
// Para un dispositivo fisico, cambia esto a la IP de tu PC.
export const API_URL =
  extra.apiUrl || 'http://localhost:3000';

async function request(path, options = {}) {
  const url = `${API_URL}${path}`;
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch (e) {
    data = text;
  }
  if (!res.ok) {
    const message = (data && data.error) || `Error ${res.status}`;
    throw new Error(message);
  }
  return data;
}

export const api = {
  baseUrl: API_URL,
  getStats: (period = 'day') => request(`/api/stats?period=${period}`),
  feed: (animal, amount) =>
    request(`/api/feed/${animal}`, {
      method: 'POST',
      body: JSON.stringify(amount != null ? { amount } : {}),
    }),
  getFeedings: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/api/feedings${qs ? `?${qs}` : ''}`);
  },
  reset: () => request('/api/feedings', { method: 'DELETE' }),
  getSchedules: () => request('/api/schedules'),
  getSchedule: (animal) => request(`/api/schedules/${animal}`),
  setSchedule: (animal, times, amount) =>
    request(`/api/schedules/${animal}`, {
      method: 'PUT',
      body: JSON.stringify({ times, amount }),
    }),
  deleteSchedule: (animal) =>
    request(`/api/schedules/${animal}`, { method: 'DELETE' }),
};
