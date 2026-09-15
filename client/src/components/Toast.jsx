import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

export const Toast = ({ toast, onClose }) => {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const isSuccess = toast.type === 'success';

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '10px 16px',
        borderRadius: 'var(--radius-md)',
        background: '#ffffff',
        border: `1px solid ${isSuccess ? '#bbf7d0' : '#fecaca'}`,
        boxShadow: 'var(--shadow-dropdown)',
        color: 'var(--text-primary)',
        minWidth: '260px',
        maxWidth: '400px',
      }}
    >
      {isSuccess ? (
        <CheckCircle size={18} color="var(--success)" />
      ) : (
        <AlertCircle size={18} color="var(--danger)" />
      )}

      <span style={{ flex: 1, fontSize: '0.85rem', fontWeight: 500 }}>
        {toast.message}
      </span>

      <button
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--text-muted)',
          cursor: 'pointer',
          padding: '2px',
          display: 'flex',
        }}
      >
        <X size={14} />
      </button>
    </div>
  );
};
