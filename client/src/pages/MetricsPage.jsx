import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Database, CheckCircle2, XCircle, Clock, ShieldCheck, PieChart } from 'lucide-react';

export const MetricsPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await api.getUsers();
        setUsers(res.users || []);
      } catch (err) {
        console.error('Failed to load metrics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  const totalUsers = users.length;
  const activeCount = users.filter((u) => u.status === 'Active').length;
  const inactiveCount = users.filter((u) => u.status === 'Inactive').length;
  const pendingCount = users.filter((u) => u.status === 'Pending').length;

  const activeRatio = Math.round((activeCount / (totalUsers || 1)) * 100);
  const inactiveRatio = Math.round((inactiveCount / (totalUsers || 1)) * 100);
  const pendingRatio = Math.round((pendingCount / (totalUsers || 1)) * 100);

  // Group by Role
  const roleCounts = {};
  users.forEach((u) => {
    roleCounts[u.role] = (roleCounts[u.role] || 0) + 1;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Title Header */}
      <div>
        <h2 style={{ fontSize: '1.3rem', color: 'var(--text-primary)', margin: '0 0 2px' }}>
          System & Database Metrics
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
          Real-time analytics and status ratios calculated directly from the SQLite database.
        </p>
      </div>

      {/* Metrics Summary Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <MetricCard title="Total Directory Records" value={totalUsers} icon={Database} label="SQLite table count" />
        <MetricCard title="Active Ratio" value={`${activeRatio}%`} icon={CheckCircle2} label={`${activeCount} active accounts`} color="var(--success)" />
        <MetricCard title="Inactive Accounts" value={inactiveCount} icon={XCircle} label={`${inactiveRatio}% of directory`} color="var(--danger)" />
        <MetricCard title="Pending Review" value={pendingCount} icon={Clock} label={`${pendingRatio}% pending verification`} color="var(--warning)" />
      </div>

      {/* Detailed Analysis Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="metrics-grid">
        {/* Account Status Distribution Progress Bars */}
        <div className="card-panel" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PieChart size={18} color="#1e293b" /> Account Status Ratios
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Active Accounts</span>
                <span style={{ color: 'var(--success)', fontWeight: 600 }}>{activeCount} ({activeRatio}%)</span>
              </div>
              <div style={{ height: '8px', width: '100%', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${activeRatio}%`, background: 'var(--success)' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Inactive Accounts</span>
                <span style={{ color: 'var(--danger)', fontWeight: 600 }}>{inactiveCount} ({inactiveRatio}%)</span>
              </div>
              <div style={{ height: '8px', width: '100%', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${inactiveRatio}%`, background: 'var(--danger)' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Pending Accounts</span>
                <span style={{ color: 'var(--warning)', fontWeight: 600 }}>{pendingCount} ({pendingRatio}%)</span>
              </div>
              <div style={{ height: '8px', width: '100%', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${pendingRatio}%`, background: 'var(--warning)' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Role Distribution Table */}
        <div className="card-panel" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={18} color="#1e293b" /> Role Breakdown Matrix
          </h3>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', background: '#f8fafc' }}>
                <th style={{ padding: '8px 12px', fontSize: '0.725rem', color: 'var(--text-muted)' }}>ROLE TITLE</th>
                <th style={{ padding: '8px 12px', fontSize: '0.725rem', color: 'var(--text-muted)', textAlign: 'center' }}>RECORD COUNT</th>
                <th style={{ padding: '8px 12px', fontSize: '0.725rem', color: 'var(--text-muted)', textAlign: 'right' }}>PERCENTAGE</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(roleCounts).map(([role, count]) => {
                const pct = Math.round((count / (totalUsers || 1)) * 100);
                return (
                  <tr key={role} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '10px 12px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {role}
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                      {count}
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 600, color: '#1e293b' }}>
                      {pct}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        @media (max-width: 800px) {
          .metrics-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

const MetricCard = ({ title, value, icon: Icon, label, color }) => (
  <div className="card-panel" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
    <div>
      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
        {title}
      </span>
      <h3 style={{ fontSize: '1.6rem', fontWeight: 700, margin: '2px 0 4px', color: color || 'var(--text-primary)' }}>
        {value}
      </h3>
      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
        {label}
      </span>
    </div>
    <div
      style={{
        width: '40px',
        height: '40px',
        borderRadius: 'var(--radius-md)',
        background: 'var(--bg-input)',
        border: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: color || '#1e293b',
      }}
    >
      <Icon size={20} />
    </div>
  </div>
);
