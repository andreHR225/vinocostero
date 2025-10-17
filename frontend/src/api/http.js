import React from 'react';
import axios from 'axios';

export const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE });

// ---- token en localStorage ----
const KEY = 'vc_token';
export function setToken(t){ localStorage.setItem(KEY, t); }
export function clearToken(){ localStorage.removeItem(KEY); }
export function getToken(){ return localStorage.getItem(KEY); }

// interceptor para adjuntar Authorization
export function useAuthInterceptor(){
  React.useEffect(() => {
    const id = api.interceptors.request.use((config) => {
      const t = getToken();
      if (t) config.headers.Authorization = `Bearer ${t}`;
      return config;
    });
    return () => api.interceptors.request.eject(id);
  }, []);
}

// decodificar payload (solo para leer role/email en el front)
export function parseJwt(token){
  try { return JSON.parse(atob(token.split('.')[1])); } catch { return {}; }
}

// helpers HTTP
export async function get(u){ const { data } = await api.get(u); return data; }
export async function post(u,b){ const { data } = await api.post(u,b); return data; }
export async function put(u,b){ const { data } = await api.put(u,b); return data; }
export async function del(u){ const { data } = await api.delete(u); return data; }
