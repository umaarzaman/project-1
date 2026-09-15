import React from 'react';
import { Eye, Edit2, Trash2, UserX, Calendar, Mail } from 'lucide-react';

export const UserTable = ({ users, loading, onSelectUser, onEditUser, onDeleteUser }) => {
  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return <span className="badge badge-active">Active</span>;
      case 'inactive':
        return <span className="badge badge-inactive">Inactive</span>;
      case 'pending':
        return <span className="badge badge-pending">Pending</span>;
      default:
        return <span className="badge badge-role">{status}</span>;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="card-panel" style={{ padding: '32px', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Loading user directory data...</p>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="card-panel" style={{ padding: '48px 20px', textAlign: 'center' }}>
        <UserX size={32} color="var(--text-muted)" style={{ marginBottom: '12px' }} />
        <h3 style={{ fontSize: '1.1rem', marginBottom: '6px' }}>No User Records Found</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          No records match your query. Try resetting your search filter or add a new user.
        </p>
      </div>
    );
  }

  return (
    <div className="card-panel" style={{ overflow: 'hidden' }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--border-subtle)' }}>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Full Name</th>
              <th style={thStyle}>Email Address</th>
              <th style={thStyle}>Role</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Created</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                style={{
                  borderBottom: '1px solid var(--border-subtle)',
                  transition: 'background-color 0.1s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                {/* ID */}
                <td style={tdStyle}>
                  <span style={{ fontFamily: 'monospace', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    #{user.id}
                  </span>
                </td>

                {/* Name */}
                <td style={tdStyle}>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                    {user.full_name}
                  </span>
                </td>

                {/* Email */}
                <td style={tdStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
                    <Mail size={13} color="var(--text-muted)" />
                    {user.email}
                  </div>
                </td>

                {/* Role */}
                <td style={tdStyle}>
                  <span className="badge badge-role">
                    {user.role}
                  </span>
                </td>

                {/* Status */}
                <td style={tdStyle}>
                  {getStatusBadge(user.status)}
                </td>

                {/* Created */}
                <td style={tdStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.825rem' }}>
                    <Calendar size={13} />
                    {formatDate(user.created_at)}
                  </div>
                </td>

                {/* Actions */}
                <td style={{ ...tdStyle, textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', gap: '6px' }}>
                    <button
                      onClick={() => onSelectUser(user)}
                      className="btn btn-secondary"
                      style={{ padding: '4px 8px', fontSize: '0.775rem' }}
                      title="View user details"
                    >
                      <Eye size={13} />
                      View
                    </button>
                    <button
                      onClick={() => onEditUser(user)}
                      className="btn btn-secondary"
                      style={{ padding: '4px 8px', fontSize: '0.775rem' }}
                      title="Edit user details"
                    >
                      <Edit2 size={13} />
                      Edit
                    </button>
                    <button
                      onClick={() => onDeleteUser(user)}
                      className="btn btn-danger"
                      style={{ padding: '4px 8px', fontSize: '0.775rem' }}
                      title="Delete user record"
                    >
                      <Trash2 size={13} />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const thStyle = {
  padding: '10px 16px',
  fontSize: '0.75rem',
  fontWeight: 600,
  color: 'var(--text-muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
};

const tdStyle = {
  padding: '12px 16px',
  verticalAlign: 'middle',
};
