import React from 'react';

export default function Table({ columns, data, rowKey='id', actions }){
  return (
    <table className="table">
      <thead>
        <tr>
          {columns.map(c => <th key={c.key}>{c.header}</th>)}
          {actions && <th style={{ width: 180 }}></th>}
        </tr>
      </thead>
      <tbody>
        {data.map(row => (
          <tr key={row[rowKey]}>
            {columns.map(c => (
              <td key={c.key}>{c.render ? c.render(row) : row[c.key]}</td>
            ))}
            {actions && <td>{actions(row)}</td>}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
