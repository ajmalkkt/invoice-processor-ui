import React, { useState, useRef, useEffect } from 'react';

export default function InvoiceActionsDropdown({ onView, onDownload }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }} ref={dropdownRef}>
      <button
        className="btn btn-ghost"
        style={{
          padding: 0,
          border: 'none',
          background: 'transparent',
          borderRadius: 6,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: 32,
          minHeight: 32,
        }}
        aria-label="Actions"
        onClick={() => setOpen((v) => !v)}
      >
        <span style={{
          background: '#e3f2fd',
          borderRadius: 4,
          padding: '8px 8px',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
          border: '1px solid #b3c6d4',
          gap: 6,
        }}>
          <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 20 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#1976d2', margin: '2px 0', display: 'block' }}></span>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#1976d2', margin: '2px 0', display: 'block' }}></span>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#1976d2', margin: '2px 0', display: 'block' }}></span>
          </span>
          <span style={{ display: 'flex', alignItems: 'center', height: 20, marginLeft: 2, color: '#1976d2', fontSize: 14 }}>
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 8L10 13L15 8" stroke="#1976d2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </span>
      </button>
      {open && (
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: '100%',
            background: '#fff',
            border: '1px solid #ccc',
            borderRadius: 4,
            zIndex: 10,
            minWidth: 120,
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          }}
        >
          <button
            className="btn btn-ghost"
            style={{ width: '100%', textAlign: 'left', padding: '8px 12px', border: 'none', background: 'none', cursor: 'pointer' }}
            onClick={() => { onView(); setOpen(false); }}
          >
            View
          </button>
          <button
            className="btn btn-ghost"
            style={{ width: '100%', textAlign: 'left', padding: '8px 12px', border: 'none', background: 'none', cursor: 'pointer' }}
            onClick={() => { onDownload(); setOpen(false); }}
          >
            Download
          </button>
        </div>
      )}
    </div>
  );
}