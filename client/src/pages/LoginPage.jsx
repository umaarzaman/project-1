import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, Mail, Lock, Key, ArrowRight, AlertCircle } from 'lucide-react';

export const LoginPage = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleQuickDemoFill = () => {
    setEmail('admin@example.com');
    setPassword('admin123');
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await login(email, password);
    } catch (err) {
      setError(err.message || 'Invalid administrator login credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-app)',
        padding: '20px',
      }}
    >
      <div
        className="card-panel"
        style={{
          width: '100%',
          maxWidth: '420px',
          padding: '36px 28px',
          background: '#ffffff',
          boxShadow: 'var(--shadow-dropdown)',
          borderRadius: 'var(--radius-lg)',
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: 'var(--radius-md)',
              background: '#1e293b',
              color: '#ffffff',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '12px',
              boxShadow: '0 2px 4px rgba(15, 23, 42, 0.15)',
            }}
          >
            <Shield size={26} />
          </div>
          <h1 style={{ fontSize: '1.5rem', margin: '0 0 4px', color: 'var(--text-primary)' }}>
            NexusAdmin
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
            Enterprise Internal Operations Console
          </p>
        </div>

        {/* Demo Credentials Callout Box */}
        <div
          style={{
            padding: '12px 14px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-input)',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-inset)',
            marginBottom: '20px',
            fontSize: '0.825rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Key size={13} color="#1e293b" /> Demo Admin Access
            </span>
            <button
              onClick={handleQuickDemoFill}
              style={{
                background: 'none',
                border: 'none',
                color: '#2563eb',
                fontWeight: 600,
                fontSize: '0.775rem',
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              Auto-Fill
            </button>
          </div>
          <div style={{ color: 'var(--text-secondary)', fontFamily: 'monospace', fontSize: '0.8rem' }}>
            <div>Email: <strong style={{ color: 'var(--text-primary)' }}>admin@example.com</strong></div>
            <div>Pass: <strong style={{ color: 'var(--text-primary)' }}>admin123</strong></div>
          </div>
        </div>

        {/* Error notification */}
        {error && (
          <div
            style={{
              padding: '10px 12px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--danger-bg)',
              border: '1px solid #fecaca',
              color: 'var(--danger)',
              fontSize: '0.825rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              marginBottom: '16px',
            }}
          >
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Administrator Email</label>
            <input
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label className="form-label">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '10px', fontSize: '0.925rem' }}
          >
            {loading ? 'Signing in...' : 'Sign In to Dashboard'}
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
            Protected Internal Operations &bull; SQLite JWT Auth
          </p>
        </div>
      </div>
    </div>
  );
};
