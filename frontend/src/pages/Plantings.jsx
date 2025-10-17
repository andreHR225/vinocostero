import React from 'react';
import dayjs from 'dayjs';
import Table from '../components/Table.jsx';
import { get, post, put, del as delReq, getToken, parseJwt } from '../api/http.js';

export default function Plantings() {
  const [rows, setRows] = React.useState([]);
  const [parcels, setParcels] = React.useState([]);
  const [grapes, setGrapes] = React.useState([]);
  const [form, setForm] = React.useState({ parcelId: '', grapeTypeId: '', sowDate: '', labBrix: '', status: 'ACTIVE' });
  const [editing, setEditing] = React.useState(null);

  const token = getToken();
  const payload = token ? parseJwt(token) : null;
  const isAdmin = payload?.role === 'admin';

  const load = async () => {
    const [p, g, pl] = await Promise.all([get('/parcels'), get('/grapes'), get('/plantings')]);
    setParcels(p); setGrapes(g); setRows(pl);
  };
  React.useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    const body = {
      parcelId: Number(form.parcelId),
      grapeTypeId: Number(form.grapeTypeId),
      sowDate: form.sowDate || new Date().toISOString().slice(0, 10),
      labBrix: form.labBrix ? Number(form.labBrix) : undefined,
      status: form.status
    };
    if (editing) {
      await put(`/plantings/${editing.id}`, body);
      setEditing(null);
    } else {
      await post('/plantings', body);
    }
    setForm({ parcelId: '', grapeTypeId: '', sowDate: '', labBrix: '', status: 'ACTIVE' });
    load();
  };

  const columns = [
    { key: 'id', header: 'ID' },
    { key: 'Parcel', header: 'Parcela', render: r => r.Parcel?.name },
    { key: 'GrapeType', header: 'Uva', render: r => r.GrapeType?.name },
    { key: 'sowDate', header: 'Fecha Siembra', render: r => dayjs(r.sowDate).format('YYYY-MM-DD') },
    { key: 'labBrix', header: 'Brix' },
    { key: 'status', header: 'Estado' }
  ];

  return (
    <div>
      <h3>Siembras</h3>

      {isAdmin ? (
        <form onSubmit={submit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', gap: 8, marginBottom: 16 }}>
          <select value={form.parcelId} onChange={e => setForm({ ...form, parcelId: e.target.value })} required>
            <option value="">Parcela…</option>
            {parcels.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <select value={form.grapeTypeId} onChange={e => setForm({ ...form, grapeTypeId: e.target.value })} required>
            <option value="">Uva…</option>
            {grapes.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
          </select>
          <input type="date" value={form.sowDate} onChange={e => setForm({ ...form, sowDate: e.target.value })} />
          <input type="number" step="0.1" placeholder="Brix" value={form.labBrix} onChange={e => setForm({ ...form, labBrix: e.target.value })} />
          <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
            <option value="ACTIVE">ACTIVE</option>
            <option value="SICK">SICK</option>
            <option value="HARVESTED">HARVESTED</option>
          </select>
          <button style={{ gridColumn: 'span 5' }}>{editing ? 'Actualizar siembra' : 'Crear siembra'}</button>
          {editing && <button type="button" className="secondary" onClick={() => { setEditing(null); setForm({ parcelId: '', grapeTypeId: '', sowDate: '', labBrix: '', status: 'ACTIVE' }) }}>Cancelar</button>}
        </form>
      ) : <p style={{ opacity: .7, marginBottom: 16 }}>Solo lectura (inicia como <b>admin</b> para crear/editar).</p>}

      <Table
        columns={columns}
        data={rows}
        actions={isAdmin ? (row) => (
          <>
            <button
              onClick={() => {
                setEditing(row);
                setForm({
                  parcelId: String(row.parcelId),
                  grapeTypeId: String(row.grapeTypeId),
                  sowDate: row.sowDate?.slice(0, 10) || '',
                  labBrix: row.labBrix ?? '',
                  status: row.status || 'ACTIVE'
                });
              }}
              style={{ marginRight: 8 }}
            >
              Editar
            </button>
            <button
              className="danger"
              onClick={async () => {
                if (confirm('¿Eliminar siembra? Esto borra también sus cosechas.')) {
                  await delReq(`/plantings/${row.id}`);
                  load();
                }
              }}
            >
              Eliminar
            </button>
          </>
        ) : null}
      />

    </div>
  );
}
