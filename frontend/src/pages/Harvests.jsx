import React from 'react';
import dayjs from 'dayjs';
import Table from '../components/Table.jsx';
import { get, post } from '../api/http.js';

export default function Harvests(){
  const [rows, setRows] = React.useState([]);
  const [plantings, setPlantings] = React.useState([]);
  const [form, setForm] = React.useState({ plantingId:'', date:'', quantityKg:'', quality:'' });

  const load = async () => {
    const [h, p] = await Promise.all([ get('/harvests'), get('/plantings') ]);
    setRows(h); setPlantings(p);
  };
  React.useEffect(()=>{ load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    const body = {
      plantingId: Number(form.plantingId),
      date: form.date || new Date().toISOString().slice(0,10),
      quantityKg: Number(form.quantityKg),
      quality: form.quality || undefined
    };
    await post('/harvests', body);
    setForm({ plantingId:'', date:'', quantityKg:'', quality:'' });
    load();
  };

  const columns = [
    { key:'id', header:'ID' },
    { key:'plantingId', header:'Siembra' },
    { key:'date', header:'Fecha', render: r => dayjs(r.date).format('YYYY-MM-DD') },
    { key:'quantityKg', header:'Kg' },
    { key:'quality', header:'Calidad' }
  ];

  return (
    <div>
      <h3>Cosechas</h3>
      <form onSubmit={submit} style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:8, marginBottom:16 }}>
        <select value={form.plantingId} onChange={e=>setForm({...form, plantingId:e.target.value})} required>
          <option value="">Siembra…</option>
          {plantings.map(p => <option key={p.id} value={p.id}>{p.id} — {p.Parcel?.name} / {p.GrapeType?.name}</option>)}
        </select>
        <input type="date" value={form.date} onChange={e=>setForm({...form, date:e.target.value})} />
        <input type="number" step="0.1" placeholder="Kg" value={form.quantityKg} onChange={e=>setForm({...form, quantityKg:e.target.value})} required />
        <input placeholder="Calidad (opcional)" value={form.quality} onChange={e=>setForm({...form, quality:e.target.value})} />
        <button style={{ gridColumn:'span 4' }}>Registrar cosecha</button>
      </form>

      <Table columns={columns} data={rows} />
    </div>
  )
}
