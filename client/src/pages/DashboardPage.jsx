import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { StatCards } from '../components/StatCards';
import { UserTable } from '../components/UserTable';
import { UserDetailDrawer } from '../components/UserDetailDrawer';
import { CreateUserModal } from '../components/CreateUserModal';
import { ConfirmModal } from '../components/ConfirmModal';
import { Toast } from '../components/Toast';
import { UserPlus, RefreshCw, Filter } from 'lucide-react';

export const DashboardPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('users');

  // Theme state ('dark' or 'light')
  const [theme, setTheme] = useState(localStorage.getItem('admin_theme') || 'dark');

  // Modal / Drawer state
  const [selectedUser, setSelectedUser] = useState(null); // For Detail Drawer
  const [userToDelete, setUserToDelete] = useState(null); // For Confirm Modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Toast feedback state
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Toggle Dark/Light Theme
  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('admin_theme', nextTheme);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Fetch users from Backend API
  const fetchUsers = useCallback(async (searchQuery = '') => {
    setLoading(true);
    try {
      const data = await api.getUsers(searchQuery);
      setUsers(data.users || []);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      showToast(err.message || 'Error fetching user directory', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced live search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, fetchUsers]);

  // Handler: Create User
  const handleCreateUserSubmit = async (formData) => {
    const res = await api.createUser(formData);
    showToast(`User "${res.user.full_name}" created successfully!`, 'success');
    fetchUsers(searchTerm);
  };

  // Handler: Delete User Confirm
  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    setDeleting(true);
    try {
      await api.deleteUser(userToDelete.id);
      showToast(`User "${userToDelete.full_name}" deleted successfully.`, 'success');
      setUserToDelete(null);
      fetchUsers(searchTerm);
    } catch (err) {
      showToast(err.message || 'Failed to delete user.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navbar Header */}
      <Navbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      {/* Main Layout Area */}
      <div style={{ display: 'flex', flex: 1 }}>
        {/* Navigation Sidebar */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Content Workspace */}
        <main style={{ flex: 1, padding: '28px', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
          {/* Top Section Banner */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '24px',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            <div>
              <h2 style={{ fontSize: '1.6rem', color: 'var(--text-primary)', margin: '0 0 4px' }}>
                User Records Directory
              </h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0 }}>
                Manage administrator privileges, user credentials, roles, and account statuses.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => fetchUsers(searchTerm)}
                className="btn btn-secondary"
                title="Refresh user directory"
              >
                <RefreshCw size={16} className={loading ? 'spin' : ''} />
                Refresh
              </button>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="btn btn-primary"
              >
                <UserPlus size={18} />
                Add New User
              </button>
            </div>
          </div>

          {/* Metric Stat Cards */}
          <StatCards users={users} />

          {/* User Management Data Table */}
          <UserTable
            users={users}
            loading={loading}
            onSelectUser={(user) => setSelectedUser(user)}
            onDeleteUser={(user) => setUserToDelete(user)}
          />
        </main>
      </div>

      {/* Slide-out User Detail Drawer */}
      <UserDetailDrawer
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
      />

      {/* Add New User Modal */}
      <CreateUserModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateUserSubmit}
      />

      {/* Delete User Confirmation Dialog */}
      <ConfirmModal
        isOpen={!!userToDelete}
        user={userToDelete}
        title="Confirm User Deletion"
        message="Are you sure you want to permanently delete this user record from the SQLite database?"
        onClose={() => setUserToDelete(null)}
        onConfirm={handleConfirmDelete}
        loading={deleting}
      />

      {/* Floating Notification Toast */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
};
