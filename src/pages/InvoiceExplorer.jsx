import React, { useState, useEffect, useRef } from 'react';
import { UploadedTable, FailedTable } from '../components/InvoiceTable';
import { API_BASE_URL, PAGE_SIZE } from '../config';

export default function InvoiceExplorer() {
  const [uploadedInvoices, setUploadedInvoices] = useState([]);
  const [uploadedTotal, setUploadedTotal] = useState(0);
  const [uploadedPage, setUploadedPage] = useState(1);
  const [failedInvoices, setFailedInvoices] = useState([]);
  const [failedTotal, setFailedTotal] = useState(0);
  const [failedPage, setFailedPage] = useState(1);
  // const PAGE_SIZE = 5; // Removed as PAGE_SIZE is now imported
  const [flash, setFlash] = useState(null);
  const flashTimeout = useRef();
  const [uploadFile, setUploadFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [bulkUploading, setBulkUploading] = useState(false);

  // Helper: format date as DMY
  const formatDMY = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d)) return dateStr;
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Fetch data from APIs with pagination
  const fetchTables = async (upPage = uploadedPage, failPage = failedPage) => {
    try {
      const [invoicesRes, failedRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/invoices?page=${upPage}&pageSize=${PAGE_SIZE}`),
        fetch(`${API_BASE_URL}/api/failed-invoices?page=${failPage}&pageSize=${PAGE_SIZE}`),
      ]);
      const invoicesData = await invoicesRes.json();
      const failedData = await failedRes.json();
      setUploadedInvoices(
        (invoicesData.data || invoicesData).map(inv => ({
          invoiceNumber: inv.invoice_number,
          invoiceDate: formatDMY(inv.invoice_date),
          customerName: inv.customer_name || '',
        }))
      );
      setUploadedTotal(invoicesData.totalCount || (invoicesData.length || 0));
      setFailedInvoices(
        (failedData.data || failedData).map(f => ({
          fileName: f.file_name,
          errorMessage: f.error_message,
          date: formatDMY(f.created_at),
          invoiceNumber: f.invoice_number || '',
          invoiceDate: formatDMY(f.invoice_date),
          customerName: f.customer_name || '',
        }))
      );
      setFailedTotal(failedData.totalCount || (failedData.length || 0));
    } catch (e) {
      setFlash({ type: 'error', message: 'Failed to fetch data.' });
    }
  };

  useEffect(() => {
    fetchTables();
    // eslint-disable-next-line
  }, [uploadedPage, failedPage]);

  // Handlers for failed invoice edit/save
  const handleFailedChange = (index, field, value) => {
    const copy = [...failedInvoices];
    copy[index][field] = value;
    setFailedInvoices(copy);
  };
  const handleSave = async (index) => {
    const inv = failedInvoices[index];
    const payload = {
      file_name: inv.fileName,
      invoice_number: inv.invoiceNumber,
      invoice_date: inv.invoiceDate,
      customer_name: inv.customerName,
    };
    try {
      const res = await fetch(`${API_BASE_URL}/api/move-failed-invoice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        setFlash({ type: 'success', message: data.message || 'Invoice moved successfully.' });
        fetchTables();
      } else {
        setFlash({ type: 'error', message: data.error || data.message || 'Failed to move invoice.' });
      }
    } catch (e) {
      setFlash({ type: 'error', message: e.message || 'Failed to move invoice.' });
    }
  };

  // Upload handlers
  const handleFileChange = (e) => setUploadFile(e.target.files[0]);
  const handleUpload = async () => {
    if (!uploadFile) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', uploadFile);
    try {
      const res = await fetch(`${API_BASE_URL}/api/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setFlash({ type: 'success', message: data.message || 'Upload successful.' });
        setUploadFile(null);
        fetchTables();
      } else {
        setFlash({ type: 'error', message: data.error || data.message || 'Upload failed.' });
      }
    } catch (e) {
      setFlash({ type: 'error', message: e.message || 'Upload failed.' });
    } finally {
      setUploading(false);
    }
  };
  const handleBulkUpload = async () => {
    setBulkUploading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/bulk-upload`, {
        method: 'POST',
      });
      const data = await res.json();
      if (res.ok) {
        setFlash({ type: 'success', message: data.message || 'Bulk upload successful.' });
        fetchTables();
      } else {
        setFlash({ type: 'error', message: data.error || data.message || 'Bulk upload failed.' });
      }
    } catch (e) {
      setFlash({ type: 'error', message: e.message || 'Bulk upload failed.' });
    } finally {
      setBulkUploading(false);
    }
  };

  // Flash message effect: clear after 5s
  useEffect(() => {
    if (flash) {
      if (flashTimeout.current) clearTimeout(flashTimeout.current);
      flashTimeout.current = setTimeout(() => setFlash(null), 5000);
    }
    return () => { if (flashTimeout.current) clearTimeout(flashTimeout.current); };
  }, [flash]);

  // Pagination controls
  const renderPagination = (page, total, setPage) => {
    const totalPages = Math.ceil(total / PAGE_SIZE);
    if (totalPages <= 1) return null;
    return (
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'flex-end', margin: '10px 0' }}>
        <button className="btn" disabled={page === 1} onClick={() => setPage(page - 1)}>&lt; Prev</button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i+1}
            className={page === i+1 ? 'btn btn-primary' : 'btn'}
            style={{ minWidth: 32 }}
            onClick={() => setPage(i+1)}
          >
            {i+1}
          </button>
        ))}
        <button className="btn" disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next &gt;</button>
      </div>
    );
  };

  return (
  <div className="container">
      <header
        style={{
          marginBottom: 18,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(90deg, #38bdf8 0%, #0ea5e9 100%)',
          padding: '0 32px',
          minHeight: 64,
          borderRadius: 12,
          boxShadow: '0 4px 16px 0 rgba(34,197,246,0.13)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: 44,
            width: 74,
            marginRight: 16,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.18)',
            boxShadow: '0 0 0 6px #bae6fd, 0 0 24px 4px #38bdf8',
            position: 'relative',
          }}>
            <img src="/meraki-logo.png" alt="Meraki Logo" style={{ height: 34, width: 54, display: 'block', filter: 'drop-shadow(0 0 4px #0ea5e9)' }} />
          </span>
          <span style={{ color: '#fff', fontWeight: 600, fontSize: 22, letterSpacing: 1 }}>Invoice Explorer</span>
        </div>
        <nav style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <a href="#about" style={{ color: '#fff', textDecoration: 'none', fontSize: 16, fontWeight: 500, opacity: 0.92 }}>About Us</a>
          <a href="#contact" style={{ color: '#fff', textDecoration: 'none', fontSize: 16, fontWeight: 500, opacity: 0.92 }}>Contact Us</a>
          <a href="#login" style={{ color: '#fff', textDecoration: 'none', fontSize: 16, fontWeight: 500, opacity: 0.92 }}>Login</a>
        </nav>
      </header>

      <section className="card" style={{marginBottom:18}}>
        <div className="upload-grid">
          <div>
            <h3 style={{marginTop:0}}>Single File Upload</h3>
            <input type="file" accept=".jpg,.png" className="input" onChange={handleFileChange} />
            <div style={{marginTop:12}}>
              <button className="btn btn-primary" onClick={handleUpload} disabled={uploading || !uploadFile}>
                {uploading ? 'Uploading...' : 'Upload Invoice'}
              </button>
            </div>
            <div className="small" style={{marginTop:10}}>Upload a single .jpg or .png file.</div>
          </div>
          <div>
            <h3 style={{marginTop:0}}>Bulk File Upload</h3>
            <div style={{display:'flex', gap:8, alignItems:'center'}}>
              <button className="btn btn-success" onClick={handleBulkUpload} disabled={bulkUploading}>
                {bulkUploading ? 'Processing...' : 'Bulk Process'}
              </button>
              <div className="small">Process multiple files from a server folder. After some time, refresh the page to check uploaded files.</div>
            </div>
          </div>
        </div>
      </section>

      <section className="card" style={{marginBottom:18}}>
        <h3 style={{marginTop:0}}>🗂️ Uploaded Invoices <span className="small">({uploadedTotal} invoices)</span></h3>
        <UploadedTable uploaded={uploadedInvoices} />
        {renderPagination(uploadedPage, uploadedTotal, setUploadedPage)}
      </section>

      <section className="card">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div className="failed-title">✖ Failed Invoices</div>
          {failedInvoices.length > 0 && (
            <div className="small" style={{
              color: '#b71c1c',
              fontWeight: 700,
              background: 'linear-gradient(90deg, #fff3e0 0%, #ffe0e0 100%)',
              borderRadius: 6,
              padding: '6px 16px',
              fontSize: '1.05em',
              boxShadow: '0 1px 4px rgba(183,28,28,0.07)',
              border: '1px solid #ffcdd2',
              marginLeft: 12
            }}>
              <span style={{marginRight:6, fontSize:'1.2em'}}>⚠️</span>
              Please correct missing details and click <span style={{color:'#388e3c'}}>Save</span>.
            </div>
          )}
        </div>
        <FailedTable failed={failedInvoices} onChange={handleFailedChange} onSave={handleSave} />
        {renderPagination(failedPage, failedTotal, setFailedPage)}
      </section>

      {/* Toast/snackbar for flash message */}
      {flash && (
        <div
          style={{
            position: 'fixed',
            right: 32,
            bottom: 32,
            minWidth: 260,
            maxWidth: 400,
            padding: '14px 28px',
            borderRadius: 10,
            background: flash.type === 'success' ? 'linear-gradient(90deg,#e0ffe0,#e0fbe0)' : 'linear-gradient(90deg,#ffe0e0,#fff3e0)',
            color: flash.type === 'success' ? '#256029' : '#b71c1c',
            fontWeight: 600,
            fontSize: 16,
            boxShadow: '0 4px 16px rgba(0,0,0,0.13)',
            border: flash.type === 'success' ? '1px solid #b2dfdb' : '1px solid #ffcdd2',
            textAlign: 'center',
            zIndex: 9999,
            transition: 'opacity 0.3s',
          }}
        >
          {flash.message}
        </div>
      )}
      <footer style={{
        marginTop: 48,
        textAlign: 'center',
        color: '#7c3aed', // professional purple
        fontSize: 15,
        letterSpacing: 0.3,
        opacity: 0.96,
        paddingBottom: 18,
        fontWeight: 500,
        background: 'linear-gradient(90deg, #ede9fe 0%, #f4f7fb 100%)',
        borderTop: '1.5px solid #c4b5fd',
        borderRadius: '0 0 18px 18px',
        boxShadow: '0 -2px 12px 0 rgba(124,58,237,0.07)'
      }}>
        <span style={{display:'inline-block',padding:'0 8px'}}>
          © {new Date().getFullYear()} <span style={{fontWeight:700,letterSpacing:0.5}}>MerakiAi</span>. All rights reserved.
        </span>
      </footer>
    </div>
  );
}