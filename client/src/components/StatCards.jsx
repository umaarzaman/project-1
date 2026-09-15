import React from 'react';
import { Users, UserCheck, Shield, Clock } from 'lucide-react';

export const StatCards = ({ users = [] }) => {
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'Active').length;
  const adminCount = users.filter(u => u.role === 'Administrator' || u.role === 'Manager').length;
  const pendingUsers = users.filter(u => u.status === 'Pending').length;

  const stats = [
    {
      label: 'Total Users',
      value: totalUsers,
      change: '+12% this month',
      icon: Users,
      color: '#6366f1',
      bgColor: 'rgba(99, 102, 241, 0.12)'
    },
    {
      label: 'Active Accounts',
      value: activeUsers,
      change: `${Math.round((activeUsers / (totalUsers || 1)) * 100)}% of total`,
      icon: UserCheck,
      color: '#10b981',
      bgColor: 'rgba(16, 185, 129, 0.12)'
    },
    {
      label: 'Admins & Managers',
      value: adminCount,
      change: 'Privileged accounts',
      icon: Shield,
      color: '#3b82f6',
      bgColor: 'rgba(59, 130, 246, 0.12)'
    },
    {
      label: 'Pending Approvals',
      value: pendingUsers,
      change: pendingUsers > 0 ? 'Requires review' : 'All clear',
      icon: Clock,
      color: '#f59e0b',
      bgColor: 'rgba(245, 158, 11, 0.12)'
    }
  ];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px',
        marginBottom: '28px',
      }}
    >
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className="glass-card"
            style={{
              padding: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'transform 0.2s ease, border-color 0.2s ease',
            }}
          >
            <div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0, fontWeight: 500 }}>
                {stat.label}
              </p>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 700, margin: '4px 0', color: 'var(--text-primary)' }}>
                {stat.value}
              </h3>
              <span style={{ fontSize: '0.75rem', color: stat.color, fontWeight: 500 }}>
                {stat.change}
              </span>
            </div>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: 'var(--radius-md)',
                background: stat.bgColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon size={24} color={stat.color} />
            </div>
          </div>
        );
      })}
    </div>
  );
};
