import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, Menu, User, Shield } from 'lucide-react';

export const Header = ({ pageTitle, toggleMobileSidebar }) => {
  const { admin, logout } = useAuth();

  return (
    <header
      style={{
        height: '60px',
        background: '#ffffff',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)',
        position: 'sticky',
        top: 0,
        zIndex: 90,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Mobile Sidebar Hamburger Toggle */}
        <button
          onClick={toggleMobileSidebar}
          className="btn-icon"
          style={{ display: 'none' }}
          id="mobile-menu-btn"
          title="Toggle Navigation Menu"
        >
          <Menu size={20} />
        </button>

        <h1 style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
          {pageTitle || 'Admin Dashboard'}
        </h1>
      </div>

      {/* Admin Profile & Logout */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '4px 10px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-input)',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.825rem',
          }}
        >
          <div
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              background: '#1e293b',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.75rem',
              fontWeight: 600,
            }}
          >
            A
          </div>
          <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>
            {admin?.email || 'admin@example.com'}
          </span>
          <span className="badge badge-role" style={{ fontSize: '0.7rem' }}>
            Admin
          </span>
        </div>

        <button
          onClick={logout}
          className="btn btn-secondary"
          style={{ padding: '6px 12px', fontSize: '0.825rem' }}
          title="Sign out of Admin Dashboard"
        >
          <LogOut size={15} />
          Sign Out
        </button>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </header>
  );
};
