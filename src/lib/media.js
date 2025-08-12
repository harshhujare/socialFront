import { API_BASE_URL } from './api';

export function toAbsoluteUrl(path, fallback = '/assets/image.png') {
  if (!path || typeof path !== 'string') return fallback;
  if (/^https?:\/\//i.test(path)) return path;
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalized}`;
}


