import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, LogOut, Sun, Moon, Search, User } from 'lucide-react';

export const Navbar = ({ searchTerm, setSearchTerm, theme, toggleTheme }) => {
  const { admin, logout } = useAuth();

  return (
    <header
      style={{
        height: '70px',
        borderBottom: '1px solid var(--border-color)',
        background: 'var(--glass-bg)',
        backdropFilter: 'var(--glass-backdrop)',
        WebkitBackdropFilter: 'var(--glass-backdrop)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 28px',
      }}
    >
      {/* Brand Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)',
          }}
        >
          <ShieldCheck size={24} color="#ffffff" />
        </div>
        <div>
          <h1 style={{ fontSize: '1.2rem', margin: 0, color: 'var(--text-primary)' }}>
            NexusAdmin
          </h1>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
            Enterprise Console
          </p>
        </div>
      </div>

      {/* Global Search Bar */}
      <div style={{ position: 'relative', width: '360px', maxWidth: '100%' }}>
        <Search
          size={18}
          color="var(--text-muted)"
          style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
        />
        <input
          type="text"
          placeholder="Search users by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-input"
          style={{
            paddingLeft: '40px',
            borderRadius: '24px',
            background: 'var(--bg-input)',
            fontSize: '0.88rem',
          }}
        />
      </div>

      {/* Action Controls & Admin User Info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Theme Switcher */}
        <button
          onClick={toggleTheme}
          className="btn-icon"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun size={20} color="#f59e0b" /> : <Moon size={20} color="#6366f1" />}
        </button>

        {/* Admin Profile Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '6px 14px',
            borderRadius: '20px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
          }}
        >
          <div
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              background: 'var(--accent-glow)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <User size={16} color="var(--accent-primary)" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2 }}>
              {admin?.email?.split('@')[0] || 'Admin'}
            </span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              Administrator
            </span>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={logout}
          className="btn btn-secondary"
          style={{ padding: '8px 14px', fontSize: '0.85rem' }}
          title="Sign out of Admin Dashboard"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </header>
  );
};
