import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Users, UserCheck, UserX, Shield, ArrowRight, Activity, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

export const OverviewPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await api.getUsers();
        setUsers(res.users || []);
      } catch (err) {
        console.error('Failed to load overview metrics:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.status === 'Active').length;
  const inactiveUsers = users.filter((u) => u.status === 'Inactive').length;
  const adminCount = users.filter((u) => u.role === 'Administrator' || u.role === 'Manager').length;

  const recentUsers = [...users].sort((a, b) => b.id - a.id).slice(0, 5);

  // Calculate role breakdown
  const rolesMap = {};
  users.forEach((u) => {
    rolesMap[u.role] = (rolesMap[u.role] || 0) + 1;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Page Title Header */}
      <div>
        <h2 style={{ fontSize: '1.3rem', color: 'var(--text-primary)', margin: '0 0 4px' }}>
          System Overview
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
          Live summary of database records, user account statuses, and system metrics.
        </p>
      </div>

      {/* Metric Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
        }}
      >
        <StatCard title="Total Users" value={totalUsers} label="Registered records" icon={Users} />
        <StatCard title="Active Accounts" value={activeUsers} label={`${Math.round((activeUsers / (totalUsers || 1)) * 100)}% of directory`} icon={UserCheck} />
        <StatCard title="Inactive Accounts" value={inactiveUsers} label="Disabled or pending" icon={UserX} />
        <StatCard title="Admins & Managers" value={adminCount} label="Privileged access" icon={Shield} />
      </div>

      {/* Main Grid: Recent Users & Role Summary */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '20px',
        }}
        className="overview-grid"
      >
        {/* Recent Users List */}
        <div className="card-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)', margin: 0 }}>
                Recently Registered Users
              </h3>
              <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                Latest 5 accounts added to SQLite
              </span>
            </div>

            <Link to="/users" className="btn btn-secondary" style={{ fontSize: '0.775rem', padding: '4px 10px' }}>
              View All Directory <ArrowRight size={13} />
            </Link>
          </div>

          {loading ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Loading recent records...</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)', background: '#f8fafc' }}>
                    <th style={{ padding: '8px 12px', fontSize: '0.725rem', color: 'var(--text-muted)', fontWeight: 600 }}>NAME</th>
                    <th style={{ padding: '8px 12px', fontSize: '0.725rem', color: 'var(--text-muted)', fontWeight: 600 }}>ROLE</th>
                    <th style={{ padding: '8px 12px', fontSize: '0.725rem', color: 'var(--text-muted)', fontWeight: 600 }}>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.map((u) => (
                    <tr key={u.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '10px 12px' }}>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{u.full_name}</div>
                        <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>{u.email}</div>
                      </td>
                      <td style={{ padding: '10px 12px' }}>
                        <span className="badge badge-role">{u.role}</span>
                      </td>
                      <td style={{ padding: '10px 12px' }}>
                        <span className={`badge ${u.status === 'Active' ? 'badge-active' : u.status === 'Inactive' ? 'badge-inactive' : 'badge-pending'}`}>
                          {u.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Status & Role Distribution Breakdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Status Summary Panel */}
          <div className="card-panel" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '14px' }}>
              System Health & Status
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Activity size={15} color="var(--success)" /> Database Connection
                </span>
                <span className="badge badge-active">Online</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Calendar size={15} color="var(--text-muted)" /> Total Records
                </span>
                <strong style={{ color: 'var(--text-primary)' }}>{totalUsers}</strong>
              </div>
            </div>
          </div>

          {/* Role Breakdown Panel */}
          <div className="card-panel" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '12px' }}>
              Role Distribution
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {Object.entries(rolesMap).map(([role, count]) => {
                const percentage = Math.round((count / (totalUsers || 1)) * 100);
                return (
                  <div key={role}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '3px' }}>
                      <span style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>{role}</span>
                      <span style={{ color: 'var(--text-muted)' }}>{count} ({percentage}%)</span>
                    </div>
                    <div style={{ height: '6px', width: '100%', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${percentage}%`, background: '#1e293b' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .overview-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

const StatCard = ({ title, value, label, icon: Icon }) => (
  <div className="card-panel" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
    <div>
      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
        {title}
      </span>
      <h3 style={{ fontSize: '1.6rem', fontWeight: 700, margin: '2px 0 4px', color: 'var(--text-primary)' }}>
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
        color: '#1e293b',
      }}
    >
      <Icon size={20} />
    </div>
  </div>
);
