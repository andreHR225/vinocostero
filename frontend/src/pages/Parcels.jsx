import React from 'react';
import Table from '../components/Table.jsx';
import { get, post, put, del as delReq, getToken, parseJwt } from '../api/http.js';

export default function Parcels(){
  const [rows, setRows] = React.useState([]);
  const [form, setForm] = React.useState({ name:'', location:'' });
  const [editing, setEditing] = React.useState(null);

  // estados de validación y errores API
  const [errors, setErrors] = React.useState({});
  const [touched, setTouched] = React.useState({ name: false });
  const [apiError, setApiError] = React.useState(null);

  const token = getToken();
  const payload = token ? parseJwt(token) : null;
  const isAdmin = payload?.role === 'admin';

  const load = async () => {
    setApiError(null);
    const data = await get('/parcels');
    setRows(data);
  };
  React.useEffect(()=>{ load(); }, []);

  const validate = (data = form) => {
    const e = {};
    if (!data.name || !data.name.trim()) e.name = 'El nombre es obligatorio';
    return e;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);

    // valida al enviar
    const v = validate();
    setErrors(v);
    setTouched({ name: true });
    if (Object.keys(v).length) return;

    const body = {
      name: form.name.trim(),
      location: form.location?.trim() || undefined
    };

    try {
      if (editing) {
        await put(`/parcels/${editing.id}`, body);
        setEditing(null);
      } else {
        await post('/parcels', body);
      }
      setForm({ name:'', location:'' });
      setTouched({ name: false });
      setErrors({});
      load();
    } catch (err) {
      const msg = err?.data?.message || err?.message || '';
      if (err?.status === 400) {
        setApiError('Revisa los campos: nombre es obligatorio.');
      } else if (err?.status === 409 || /P2003|foreign key/i.test(msg)) {
        setApiError('No se puede eliminar/guardar: existen relaciones (siembras/cosechas) que lo impiden.');
      } else {
        setApiError('Ocurrió un error. Intenta de nuevo.');
      }
    }
  };

  const onEdit = (row) => {
    setEditing(row);
    setForm({ name: row.name, location: row.location || '' });
    setApiError(null);
    setTouched({ name: false });
    setErrors({});
  };

  const onDelete = async (row) => {
    if (!confirm('¿Eliminar parcela?')) return;
    setApiError(null);
    try {
      await delReq(`/parcels/${row.id}`);
      load();
    } catch (err) {
      const msg = err?.data?.message || err?.message || '';
      if (err?.status === 409 || /P2003|foreign key/i.test(msg)) {
        setApiError('No se puede eliminar: la parcela tiene siembras/cosechas asociadas.');
      } else {
        setApiError('No se pudo eliminar la parcela. Intenta de nuevo.');
      }
    }
  };

  const onChangeName = (val) => {
    const next = { ...form, name: val };
    setForm(next);
    if (touched.name) {
      const v = validate(next);
      setErrors({ ...errors, name: v.name || null });
    }
  };

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
        <form
          onSubmit={onSubmit}
          style={{ display:'grid', gridTemplateColumns:'2fr 2fr auto auto', gap:8, marginBottom:16 }}
          noValidate
        >
          <div style={{ display:'flex', flexDirection:'column' }}>
            <input
              placeholder="Nombre *"
              value={form.name}
              onChange={e => onChangeName(e.target.value)}
              onBlur={()=>{
                setTouched({ ...touched, name: true });
                const v = validate();
                setErrors({ ...errors, name: v.name || null });
              }}
            />
            {touched.name && errors.name && (
              <small className="error-text">{errors.name}</small>
            )}
          </div>

          <input
            placeholder="Ubicación (opcional)"
            value={form.location}
            onChange={e=>setForm({ ...form, location: e.target.value })}
          />

          <button type="submit">
            {editing ? 'Actualizar' : 'Crear'}
          </button>

          {editing && (
            <button
              type="button"
              className="secondary"
              onClick={()=>{
                setEditing(null);
                setForm({ name:'', location:'' });
                setErrors({});
                setTouched({ name: false });
                setApiError(null);
              }}
            >
              Cancelar
            </button>
          )}

          {apiError && (
            <div className="alert-error" style={{ gridColumn:'1 / -1' }}>
              {apiError}
            </div>
          )}
        </form>
      ) : (
        <p style={{ opacity:.7, marginBottom:16 }}>
          Solo lectura (inicia como <b>admin</b> para crear/editar).
        </p>
      )}

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
