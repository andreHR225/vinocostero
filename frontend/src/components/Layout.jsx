import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

export default function Layout(){
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
      </header>
      <main className="container">
        <div className="card">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
