import React from 'react';
import { post, setToken } from '../api/http.js';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Login(){
  const nav = useNavigate();
  const location = useLocation();
  const [form, setForm] = React.useState({ email:'', password:'' });
  const [err, setErr] = React.useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      const res = await post('/auth/login', form);
      setToken(res.token);
      const to = location.state?.from?.pathname || '/';
      nav(to, { replace: true });
    } catch {
      setErr('Credenciales inválidas');
    }
  };

  return (
  <div style={{ maxWidth: 520, margin: '60px auto' }}>
    <div className="card" style={{ padding: 24 }}>
      <h3>Iniciar sesión</h3>
      <form onSubmit={onSubmit} style={{ display:'grid', gap:12 }}>
        <input type="email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} placeholder="email" required />
        <input type="password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} placeholder="password" required />
        {err && <div style={{ color:'salmon' }}>Credenciales inválidas</div>}
        <button>Entrar</button>
      </form>
    </div>
  </div>
);

}
