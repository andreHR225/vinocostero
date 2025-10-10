import React from 'react';
import Table from '../components/Table.jsx';
import { get, post, put, del as delReq } from '../api/http.js';

export default function Diseases(){
  const [rows, setRows] = React.useState([]);
  const [form, setForm] = React.useState({ name:'', severity:'', notes:'' });
  const [editing, setEditing] = React.useState(null);

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

  return (
    <div>
      <h3>Enfermedades</h3>
      <form onSubmit={onSubmit} style={{ display:'flex', gap:8, marginBottom:16, flexWrap:'wrap' }}>
        <input placeholder="Nombre" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
        <input placeholder="Severidad" value={form.severity} onChange={e=>setForm({...form, severity:e.target.value})} />
        <input placeholder="Notas" value={form.notes} onChange={e=>setForm({...form, notes:e.target.value})} />
        <button>{editing ? 'Actualizar' : 'Crear'}</button>
        {editing && <button type="button" onClick={()=>{ setEditing(null); setForm({name:'', severity:'', notes:''}) }}>Cancelar</button>}
      </form>
      <Table columns={[
        { key:'id', header:'ID' },
        { key:'name', header:'Nombre' },
        { key:'severity', header:'Severidad' },
        { key:'notes', header:'Notas' }
      ]} data={rows} actions={(row)=>(<>
        <button onClick={()=>{ setEditing(row); setForm({ name: row.name, severity: row.severity || '', notes: row.notes || '' }) }} style={{ marginRight:8 }}>Editar</button>
        <button onClick={async()=>{ if(confirm('¿Eliminar?')){ await delReq(`/diseases/${row.id}`); load(); } }}>Eliminar</button>
      </>)}/>
    </div>
  )
}
