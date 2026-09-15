import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, BarChart2, Settings, Shield, X } from 'lucide-react';

export const Sidebar = ({ isMobileOpen, closeMobileSidebar }) => {
  const navItems = [
    { path: '/', label: 'Overview', icon: LayoutDashboard },
    { path: '/users', label: 'User Directory', icon: Users },
    { path: '/metrics', label: 'System Metrics', icon: BarChart2 },
    { path: '/settings', label: 'Configuration', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={closeMobileSidebar}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.4)',
            zIndex: 190,
          }}
        />
      )}

      <aside
        className={`sidebar-container ${isMobileOpen ? 'mobile-open' : ''}`}
        style={{
          width: '230px',
          background: '#ffffff',
          borderRight: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
          boxShadow: '1px 0 3px rgba(15, 23, 42, 0.03)',
          zIndex: 200,
        }}
      >
        {/* Sidebar Brand Header */}
        <div
          style={{
            height: '60px',
            padding: '0 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '30px',
                height: '30px',
                borderRadius: 'var(--radius-sm)',
                background: '#1e293b',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Shield size={18} />
            </div>
            <div>
              <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block', lineHeight: 1.1 }}>
                NexusAdmin
              </span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                Internal Operations
              </span>
            </div>
          </div>

          <button onClick={closeMobileSidebar} className="btn-icon mobile-close-btn" style={{ display: 'none' }}>
            <X size={18} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav style={{ padding: '16px 12px', flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', paddingLeft: '8px', marginBottom: '4px' }}>
            Navigation
          </span>

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                onClick={closeMobileSidebar}
                className={({ isActive }) => `nav-item-link ${isActive ? 'active' : ''}`}
                style={{
                  textDecoration: 'none',
                }}
              >
                {({ isActive }) => (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '9px 12px',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.875rem',
                      fontWeight: isActive ? 600 : 500,
                      color: isActive ? '#0f172a' : 'var(--text-secondary)',
                      background: isActive ? '#f1f5f9' : 'transparent',
                      borderLeft: isActive ? '3px solid #1e293b' : '3px solid transparent',
                      boxShadow: isActive ? 'var(--shadow-inset)' : 'none',
                      transition: 'all 0.1s ease',
                    }}
                  >
                    <Icon size={18} color={isActive ? '#1e293b' : '#64748b'} />
                    <span>{item.label}</span>
                  </div>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer info */}
        <div style={{ padding: '16px', borderTop: '1px solid var(--border-subtle)', fontSize: '0.725rem', color: 'var(--text-muted)' }}>
          <div>Database: <strong style={{ color: 'var(--text-secondary)' }}>SQLite 3</strong></div>
          <div>Version: <strong style={{ color: 'var(--text-secondary)' }}>v2.4.0</strong></div>
        </div>
      </aside>

      <style>{`
        @media (max-width: 768px) {
          .sidebar-container {
            position: fixed;
            top: 0;
            bottom: 0;
            left: 0;
            transform: translateX(-100%);
            transition: transform 0.2s ease-in-out;
          }
          .sidebar-container.mobile-open {
            transform: translateX(0);
          }
          .mobile-close-btn {
            display: flex !important;
          }
        }
      `}</style>
    </>
  );
};
