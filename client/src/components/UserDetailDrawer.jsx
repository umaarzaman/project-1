import React, { useEffect } from 'react';
import { X, Mail, Phone, MapPin, Calendar, FileText, User } from 'lucide-react';

export const UserDetailDrawer = ({ user, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!user) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'flex-end',
        background: 'rgba(15, 23, 42, 0.35)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          height: '100%',
          background: '#ffffff',
          borderLeft: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-dropdown)',
          overflowY: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div
          style={{
            padding: '20px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User size={18} color="#1e293b" />
            <h2 style={{ fontSize: '1.1rem', margin: 0, color: 'var(--text-primary)' }}>
              User Profile Details
            </h2>
          </div>
          <button onClick={onClose} className="btn-icon">
            <X size={18} />
          </button>
        </div>

        {/* Drawer Content */}
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Summary Box */}
          <div
            style={{
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-input)',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-inset)',
            }}
          >
            <h3 style={{ fontSize: '1.15rem', margin: '0 0 4px', color: 'var(--text-primary)' }}>
              {user.full_name}
            </h3>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: '0 0 10px' }}>
              User ID #{user.id}
            </p>
            <div style={{ display: 'flex', gap: '6px' }}>
              <span className="badge badge-role">{user.role}</span>
              <span
                className={`badge ${
                  user.status === 'Active'
                    ? 'badge-active'
                    : user.status === 'Inactive'
                    ? 'badge-inactive'
                    : 'badge-pending'
                }`}
              >
                {user.status}
              </span>
            </div>
          </div>

          {/* Contact Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <span style={sectionHeaderStyle}>Contact Information</span>

            <div style={infoRowStyle}>
              <Mail size={16} color="var(--text-muted)" />
              <div>
                <span style={labelStyle}>Email Address</span>
                <p style={valueStyle}>{user.email}</p>
              </div>
            </div>

            <div style={infoRowStyle}>
              <Phone size={16} color="var(--text-muted)" />
              <div>
                <span style={labelStyle}>Phone Number</span>
                <p style={valueStyle}>{user.phone || 'Not specified'}</p>
              </div>
            </div>

            <div style={infoRowStyle}>
              <MapPin size={16} color="var(--text-muted)" />
              <div>
                <span style={labelStyle}>Address</span>
                <p style={valueStyle}>{user.address || 'Not specified'}</p>
              </div>
            </div>
          </div>

          {/* Biography */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={sectionHeaderStyle}>Biography & Notes</span>
            <div
              style={{
                padding: '12px 14px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-input)',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.85rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.5,
              }}
            >
              <FileText size={15} color="var(--text-muted)" style={{ float: 'left', marginRight: '6px', marginTop: '2px' }} />
              {user.bio || 'No biography or notes added for this user record.'}
            </div>
          </div>

          {/* Metadata */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={sectionHeaderStyle}>Account Metadata</span>
            <div style={infoRowStyle}>
              <Calendar size={16} color="var(--text-muted)" />
              <div>
                <span style={labelStyle}>Record Created</span>
                <p style={valueStyle}>{formatDate(user.created_at)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            marginTop: 'auto',
            padding: '16px 20px',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <button onClick={onClose} className="btn btn-secondary">
            Close Panel
          </button>
        </div>
      </div>
    </div>
  );
};

const sectionHeaderStyle = {
  fontSize: '0.75rem',
  fontWeight: 700,
  color: 'var(--text-muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
};

const infoRowStyle = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '10px',
  padding: '10px 12px',
  borderRadius: 'var(--radius-md)',
  background: '#ffffff',
  border: '1px solid var(--border-subtle)',
};

const labelStyle = {
  fontSize: '0.725rem',
  color: 'var(--text-muted)',
  display: 'block',
};

const valueStyle = {
  fontSize: '0.875rem',
  fontWeight: 500,
  color: 'var(--text-primary)',
  margin: 0,
};
