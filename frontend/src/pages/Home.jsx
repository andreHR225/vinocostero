import React from 'react';
import dayjs from 'dayjs';
import { get } from '../api/http.js';

function Kpi({ label, value, sub }) {
  return (
    <div className="card" style={{ padding: 16 }}>
      <div style={{ fontSize: 12, opacity: .7 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700, lineHeight: 1.2 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, opacity: .7, marginTop: 6 }}>{sub}</div>}
    </div>
  );
}

export default function Home() {
  const [parcels, setParcels] = React.useState([]);
  const [grapes, setGrapes] = React.useState([]);
  const [plantings, setPlantings] = React.useState([]);
  const [harvests, setHarvests] = React.useState([]);

  React.useEffect(() => {
    (async () => {
      const [pacs, grs, pls, hvs] = await Promise.all([
        get('/parcels'),
        get('/grapes'),
        get('/plantings'), // incluye Parcel, GrapeType, harvests
        get('/harvests'),
      ]);
      setParcels(pacs);
      setGrapes(grs);
      setPlantings(pls);
      setHarvests(hvs);
    })();
  }, []);

  // KPIs
  const totalParcels = parcels.length;
  const totalGrapes = grapes.length;
  const totalPlantings = plantings.length;
  const kActive = plantings.filter(p => p.status === 'ACTIVE').length;
  const kSick = plantings.filter(p => p.status === 'SICK').length;
  const kHarvested = plantings.filter(p => p.status === 'HARVESTED').length;
  const totalHarvests = harvests.length;

  // Próximas a cosechar (regla: Brix ≥ 22 y aún sin cosecha)
  const readyToHarvest = plantings
    .filter(p => (p.labBrix ?? 0) >= 22 && (!p.harvests || p.harvests.length === 0))
    .sort((a, b) => (b.labBrix ?? 0) - (a.labBrix ?? 0))
    .slice(0, 5);

  // Cosechas recientes (top 5)
  const recentHarvests = [...harvests]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <div>
      <h3>Resumen</h3>

      {/* KPIs */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: 12,
        marginBottom: 16
      }}>
        <Kpi label="Parcelas" value={totalParcels} />
        <Kpi label="Tipos de uva" value={totalGrapes} />
        <Kpi label="Siembras (totales)" value={totalPlantings} sub={`Activas ${kActive} · Enfermas ${kSick} · Cosechadas ${kHarvested}`} />
        <Kpi label="Cosechas" value={totalHarvests} />
      </div>

      <div className="card" style={{ padding: 16, marginBottom: 16 }}>
        <h4 style={{ marginBottom: 12 }}>Próximas a cosechar</h4>
        {readyToHarvest.length === 0 ? (
          <div style={{ opacity: .7 }}>Sin siembras listas por Brix (≥ 22).</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>ID</th><th>Parcela</th><th>Uva</th><th>Brix</th><th>Fecha siembra</th>
              </tr>
            </thead>
            <tbody>
              {readyToHarvest.map(p => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.Parcel?.name}</td>
                  <td>{p.GrapeType?.name}</td>
                  <td>{p.labBrix}</td>
                  <td>{dayjs(p.sowDate).format('YYYY-MM-DD')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="card" style={{ padding: 16 }}>
        <h4 style={{ marginBottom: 12 }}>Cosechas recientes</h4>
        {recentHarvests.length === 0 ? (
          <div style={{ opacity: .7 }}>Aún no hay cosechas registradas.</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>ID</th><th>Siembra</th><th>Fecha</th><th>Kg</th><th>Calidad</th>
              </tr>
            </thead>
            <tbody>
              {recentHarvests.map(h => (
                <tr key={h.id}>
                  <td>{h.id}</td>
                  <td>{h.plantingId}</td>
                  <td>{dayjs(h.date).format('YYYY-MM-DD')}</td>
                  <td>{h.quantityKg}</td>
                  <td>{h.quality || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

