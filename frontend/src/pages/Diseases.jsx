import React from 'react';
import Table from '../components/Table.jsx';
import { get, post, put, del as delReq, getToken, parseJwt } from '../api/http.js';

export default function Diseases(){
  const [rows, setRows] = React.useState([]);
  const [form, setForm] = React.useState({ name:'', severity:'', notes:'' });
  const [editing, setEditing] = React.useState(null);

  const token = getToken();
  const payload = token ? parseJwt(token) : null;
  const isAdmin = payload?.role === 'admin';

  const load = async () => setRows(await get('/diseases'));
  React.useEffect(()=>{ load(); }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    if(!form.name) return;
    if(editing){
      await put(`/diseases/${editing.id}`, form);
      setEditing(null);
    }else{
      await post('/diseases', form);
    }
    setForm({ name:'', severity:'', notes:'' });
    load();
  };

  const columns = [
    { key:'id', header:'ID' },
    { key:'name', header:'Nombre' },
    { key:'severity', header:'Severidad' },
    { key:'notes', header:'Notas' }
  ];

  return (
    <div>
      <h3>Enfermedades</h3>

      {isAdmin ? (
        <form onSubmit={onSubmit} style={{ display:'flex', gap:8, marginBottom:16, flexWrap:'wrap' }}>
          <input placeholder="Nombre" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
          <input placeholder="Severidad" value={form.severity} onChange={e=>setForm({...form, severity:e.target.value})} />
          <input placeholder="Notas" value={form.notes} onChange={e=>setForm({...form, notes:e.target.value})} />
          <button>{editing ? 'Actualizar' : 'Crear'}</button>
          {editing && <button type="button" className="secondary" onClick={()=>{ setEditing(null); setForm({name:'', severity:'', notes:''}) }}>Cancelar</button>}
        </form>
      ) : <p style={{opacity:.7, marginBottom:16}}>Solo lectura (inicia como <b>admin</b> para crear/editar).</p>}

      <Table
        columns={columns}
        data={rows}
        actions={isAdmin ? (row)=>(
          <>
            <button onClick={()=>{ setEditing(row); setForm({ name: row.name, severity: row.severity || '', notes: row.notes || '' }) }} style={{ marginRight:8 }}>Editar</button>
            <button className="danger" onClick={async()=>{ if(confirm('¿Eliminar?')){ await delReq(`/diseases/${row.id}`); load(); } }}>Eliminar</button>
          </>
        ) : null}
      />
    </div>
  );
}
