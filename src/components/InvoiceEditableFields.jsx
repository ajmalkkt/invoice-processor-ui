import React from 'react';

export default function InvoiceEditableFields({ fail, index, onChange, onSave }) {
  return (
    <div style={{display:'flex', gap:8, alignItems:'center', flexWrap:'wrap'}}>
      <input className="input" placeholder="Customer name" value={fail.customerName} onChange={e=>onChange(index,'customerName',e.target.value)} />
      <input className="input" placeholder="Invoice #" value={fail.invoiceNumber} onChange={e=>onChange(index,'invoiceNumber',e.target.value)} />
      <input className="input" type="date" value={fail.invoiceDate||''} onChange={e=>onChange(index,'invoiceDate',e.target.value)} />
      <button className="btn btn-success" onClick={()=>onSave(index)}>Save</button>
    </div>
  );
}