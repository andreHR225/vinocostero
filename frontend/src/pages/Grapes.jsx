import React from 'react';
import Table from '../components/Table.jsx';
import { get, post, put, del as delReq, getToken, parseJwt } from '../api/http.js';

export default function Grapes(){
  const [rows, setRows] = React.useState([]);
  const [form, setForm] = React.useState({ name:'', notes:'' });
  const [editing, setEditing] = React.useState(null);

  const token = getToken();
  const payload = token ? parseJwt(token) : null;
  const isAdmin = payload?.role === 'admin';

  const load = async () => setRows(await get('/grapes'));
  React.useEffect(()=>{ load(); }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    if(!form.name) return;
    if(editing){
      await put(`/grapes/${editing.id}`, form);
      setEditing(null);
    }else{
      await post('/grapes', form);
    }
    setForm({ name:'', notes:'' });
    load();
  };

  const columns = [
    { key:'id', header:'ID' },
    { key:'name', header:'Nombre' },
    { key:'notes', header:'Notas' }
  ];

  return (
    <div>
      <h3>Tipos de Uva</h3>

      {isAdmin ? (
        <form onSubmit={onSubmit} style={{ display:'flex', gap:8, marginBottom:16 }}>
          <input placeholder="Nombre" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
          <input placeholder="Notas" value={form.notes} onChange={e=>setForm({...form, notes:e.target.value})} />
          <button>{editing ? 'Actualizar' : 'Crear'}</button>
          {editing && <button type="button" className="secondary" onClick={()=>{ setEditing(null); setForm({name:'', notes:''}) }}>Cancelar</button>}
        </form>
      ) : <p style={{opacity:.7, marginBottom:16}}>Solo lectura (inicia como <b>admin</b> para crear/editar).</p>}

      <Table
        columns={columns}
        data={rows}
        actions={isAdmin ? (row)=>(
          <>
            <button onClick={()=>{ setEditing(row); setForm({ name: row.name, notes: row.notes || '' }) }} style={{ marginRight:8 }}>Editar</button>
            <button className="danger" onClick={async()=>{ if(confirm('¿Eliminar?')){ await delReq(`/grapes/${row.id}`); load(); } }}>Eliminar</button>
          </>
        ) : null}
      />
    </div>
  );
}
