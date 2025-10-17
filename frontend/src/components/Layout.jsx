import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuthInterceptor, getToken, clearToken, parseJwt } from '../api/http.js';

export default function Layout(){
  useAuthInterceptor();
  const nav = useNavigate();
  const token = getToken();
  const payload = token ? parseJwt(token) : null;
  const linkClass = ({ isActive }) => `nav-link${isActive ? ' active' : ''}`;

  return (
    <div>
      <header className="navbar">
        <h2>Vino Costero</h2>
        <nav>
          <NavLink to="/" className={linkClass} end>Inicio</NavLink>
          <NavLink to="/parcels" className={linkClass}>Parcelas</NavLink>
          <NavLink to="/grapes" className={linkClass}>Uvas</NavLink>
          <NavLink to="/diseases" className={linkClass}>Enfermedades</NavLink>
          <NavLink to="/plantings" className={linkClass}>Siembras</NavLink>
          <NavLink to="/harvests" className={linkClass}>Cosechas</NavLink>
        </nav>
        <div style={{marginLeft:'auto', display:'flex', gap:8, alignItems:'center'}}>
          {payload && <span style={{opacity:.8, fontSize:13}}>{payload.email} ({payload.role})</span>}
          <button className="secondary" onClick={()=>{ clearToken(); nav('/login'); }}>
            Salir
          </button>
        </div>
      </header>
      <main className="container"><div className="card"><Outlet /></div></main>
    </div>
  );
}
