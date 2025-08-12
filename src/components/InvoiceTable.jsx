import React from 'react';
import InvoiceActionsDropdown from './InvoiceActionsDropdown';
import InvoiceEditableFields from './InvoiceEditableFields';
import { API_BASE_URL } from '../config';

export function UploadedTable({ uploaded }) {
  // Compact style for UploadedTable only
  const cellStyle = { padding: '2px 2px', fontSize: '0.95em', background: '#f8fafc' };
  const headerStyle = { ...cellStyle, height: 12, background: '#bae6fd', fontWeight: 600, color: '#2d3a4a' }; // deeper bluish shade
  const rowStyle = { height: 12, minHeight: 12 };
  // Slightly deeper shade for alternate rows
  const evenRow = '#f8fafc';
  const oddRow = '#e0f2fe'; // light bluish shade for highlighted rows
  return (
    <table className="table table-elevated" style={{ background: '#f4f7fb' }}>
      <thead>
        <tr style={{ height: 36 }}>
          <th style={headerStyle}>Invoice Number</th>
          <th style={headerStyle}>Invoice Date</th>
          <th style={headerStyle}>Customer Name</th>
          <th style={headerStyle}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {uploaded.map((inv, idx) => {
          const rowBg = idx % 2 === 1 ? oddRow : evenRow;
          return (
            <tr key={idx} style={{ ...rowStyle }}>
              <td data-label="Invoice Number" style={{ ...cellStyle, background: rowBg }}>{inv.invoiceNumber}</td>
              <td data-label="Invoice Date" style={{ ...cellStyle, background: rowBg }}>{inv.invoiceDate || 'None'}</td>
              <td data-label="Customer Name" style={{ ...cellStyle, background: rowBg }}>{inv.customerName || 'N/A'}</td>
              <td data-label="Actions" style={{ ...cellStyle, background: rowBg }}>
                <InvoiceActionsDropdown
                  onView={() => {
                    window.open(`${API_BASE_URL}/invoice/${encodeURIComponent(inv.invoiceNumber)}`, '_blank', 'noopener');
                  }}
                  onDownload={() => {
                    window.open(`${API_BASE_URL}/download/${encodeURIComponent(inv.invoiceNumber)}`, '_blank', 'noopener');
                  }}
                />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export function FailedTable({ failed, onChange, onSave }) {
  // Default style for FailedTable (no compact row/cell)
  const cellStyle = { padding: '8px 12px', fontSize: '1em', background: '#f8fafc' };
  const headerStyle = { ...cellStyle, background: '#bae6fd', fontWeight: 600, color: '#2d3a4a' }; // deeper bluish shade
  // Slightly deeper shade for alternate rows
  const evenRow = '#f8fafc';
  const oddRow = '#e0f2fe'; // light bluish shade for highlighted rows
  return (
    <table className="table table-elevated" style={{ background: '#f4f7fb' }}>
      <thead>
        <tr>
          <th style={headerStyle}>File Name</th>
          <th style={headerStyle}>Error Message</th>
          <th style={headerStyle}>Invoice Number</th>
          <th style={headerStyle}>Invoice Date</th>
          <th style={headerStyle}>Customer Name</th>
          <th style={headerStyle}></th>
        </tr>
      </thead>
      <tbody>
        {failed.map((f, idx) => {
          const rowBg = idx % 2 === 1 ? oddRow : evenRow;
          return (
            <tr key={idx}>
              <td data-label="File Name" style={{ ...cellStyle, background: rowBg }}>
                <a
                  href={`${API_BASE_URL}/failed-invoice-image/${encodeURIComponent(f.fileName)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#1976d2', textDecoration: 'underline', fontWeight: 500 }}
                >
                  {f.fileName}
                </a>
              </td>
              <td data-label="Error Message" style={{
                ...cellStyle,
                background: rowBg,
                maxWidth: 120,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                cursor: 'pointer',
              }}
                title={f.errorMessage}
              >
                {f.errorMessage}
              </td>
              <td data-label="Invoice Number" style={{ ...cellStyle, background: rowBg }}>
                <input className="input" placeholder="Invoice #" value={f.invoiceNumber || ''} onChange={e => onChange(idx, 'invoiceNumber', e.target.value)} style={{ width: 100 }} />
              </td>
              <td data-label="Invoice Date" style={{ ...cellStyle, background: rowBg }}>
                <input className="input" type="date" value={f.invoiceDate || ''} onChange={e => onChange(idx, 'invoiceDate', e.target.value)} style={{ width: 120 }} />
              </td>
              <td data-label="Customer Name" style={{ ...cellStyle, background: rowBg }}>
                <input className="input" placeholder="Customer name" value={f.customerName || ''} onChange={e => onChange(idx, 'customerName', e.target.value)} style={{ width: 140 }} />
              </td>
              <td style={{ ...cellStyle, background: rowBg }}>
                <button className="btn btn-success" onClick={() => onSave(idx)}>Save</button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}