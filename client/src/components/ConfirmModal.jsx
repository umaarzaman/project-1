import React from 'react';
import { AlertTriangle } from 'lucide-react';

export const ConfirmModal = ({ isOpen, title, message, user, onClose, onConfirm, loading }) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1050,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(15, 23, 42, 0.4)',
        padding: '16px',
      }}
      onClick={onClose}
    >
      <div
        className="card-panel"
        style={{
          width: '100%',
          maxWidth: '420px',
          padding: '24px',
          background: '#ffffff',
          boxShadow: 'var(--shadow-dropdown)',
          textAlign: 'center',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: 'var(--danger-bg)',
            border: '1px solid #fecaca',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 14px',
          }}
        >
          <AlertTriangle size={22} color="var(--danger)" />
        </div>

        <h3 style={{ fontSize: '1.15rem', marginBottom: '6px', color: 'var(--text-primary)' }}>
          {title || 'Confirm Deletion'}
        </h3>

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '16px', lineHeight: 1.5 }}>
          {message || 'Are you sure you want to delete this record?'}
        </p>

        {user && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-input)',
              border: '1px solid var(--border-subtle)',
              marginBottom: '20px',
              textAlign: 'left',
              fontSize: '0.85rem',
            }}
          >
            <span style={{ fontWeight: 600, color: 'var(--text-primary)', display: 'block' }}>
              {user.full_name}
            </span>
            <span style={{ color: 'var(--text-muted)' }}>
              {user.email} (ID #{user.id})
            </span>
          </div>
        )}

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button onClick={onClose} className="btn btn-secondary" style={{ flex: 1 }}>
            Cancel
          </button>
          <button onClick={onConfirm} disabled={loading} className="btn btn-danger" style={{ flex: 1 }}>
            {loading ? 'Deleting...' : 'Delete Record'}
          </button>
        </div>
      </div>
    </div>
  );
};
