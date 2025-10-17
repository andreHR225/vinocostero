import React from 'react';
import Table from '../components/Table.jsx';
import { get, post, put, del as delReq, getToken, parseJwt } from '../api/http.js';

export default function Parcels(){
  const [rows, setRows] = React.useState([]);
  const [form, setForm] = React.useState({ name:'', location:'' });
  const [editing, setEditing] = React.useState(null);

  const token = getToken();
  const payload = token ? parseJwt(token) : null;
  const isAdmin = payload?.role === 'admin';

  const load = async () => setRows(await get('/parcels'));
  React.useEffect(()=>{ load(); }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    if(!form.name) return;
    if(editing){
      await put(`/parcels/${editing.id}`, form);
      setEditing(null);
    }else{
      await post('/parcels', form);
    }
    setForm({ name:'', location:'' });
    load();
  };

  const onEdit = (row) => { setEditing(row); setForm({ name: row.name, location: row.location || '' }); };
  const onDelete = async (row) => { if(confirm('¿Eliminar parcela?')){ await delReq(`/parcels/${row.id}`); load(); } };

  const columns = [
    { key:'id', header:'ID' },
    { key:'name', header:'Nombre' },
    { key:'location', header:'Ubicación' },
    { key:'isActive', header:'Activa', render: r => (r.isActive ? 'Sí' : 'No') },
  ];

  return (
    <div>
      <h3>Parcelas</h3>

      {isAdmin ? (
        <form onSubmit={onSubmit} style={{ display:'flex', gap:8, marginBottom:16 }}>
          <input placeholder="Nombre" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
          <input placeholder="Ubicación" value={form.location} onChange={e=>setForm({...form, location:e.target.value})} />
          <button>{editing ? 'Actualizar' : 'Crear'}</button>
          {editing && <button type="button" className="secondary" onClick={()=>{ setEditing(null); setForm({name:'', location:''}) }}>Cancelar</button>}
        </form>
      ) : <p style={{opacity:.7, marginBottom:16}}>Solo lectura (inicia como <b>admin</b> para crear/editar).</p>}

      <Table
        columns={columns}
        data={rows}
        actions={isAdmin ? (row)=>(
          <>
            <button onClick={()=>onEdit(row)} style={{ marginRight:8 }}>Editar</button>
            <button className="danger" onClick={()=>onDelete(row)}>Eliminar</button>
          </>
        ) : null}
      />
    </div>
  );
}
