import axios from 'axios';
export const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE });

// helpers
export async function get(url) { const { data } = await api.get(url); return data; }
export async function post(url, body) { const { data } = await api.post(url, body); return data; }
export async function put(url, body) { const { data } = await api.put(url, body); return data; }
export async function del(url) { const { data } = await api.delete(url); return data; }
