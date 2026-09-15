import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { UserTable } from '../components/UserTable';
import { UserDetailDrawer } from '../components/UserDetailDrawer';
import { UserFormModal } from '../components/UserFormModal';
import { ConfirmModal } from '../components/ConfirmModal';
import { Toast } from '../components/Toast';
import { UserPlus, Search, RefreshCw, X } from 'lucide-react';

export const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modals & Drawer State
  const [selectedUser, setSelectedUser] = useState(null); // Drawer
  const [userToEdit, setUserToEdit] = useState(null); // Form Modal (Edit)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false); // Form Modal (Create or Edit)
  const [userToDelete, setUserToDelete] = useState(null); // Confirm Modal
  const [deleting, setDeleting] = useState(false);

  // Toast notification
  const [toast, setToast] = useState(null);
  const showToast = (message, type = 'success') => setToast({ message, type });

  const fetchUsers = useCallback(async (query = '') => {
    setLoading(true);
    try {
      const data = await api.getUsers(query);
      setUsers(data.users || []);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      showToast(err.message || 'Error loading user directory.', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers(searchTerm);
    }, 250);
    return () => clearTimeout(timer);
  }, [searchTerm, fetchUsers]);

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setUserToEdit(null);
    setIsFormModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (user) => {
    setUserToEdit(user);
    setIsFormModalOpen(true);
  };

  // Submit Handler for Create or Edit
  const handleFormSubmit = async (formData, editId) => {
    if (editId) {
      const res = await api.updateUser(editId, formData);
      showToast(`User record "${res.user.full_name}" updated successfully.`, 'success');
    } else {
      const res = await api.createUser(formData);
      showToast(`New user "${res.user.full_name}" added to directory!`, 'success');
    }
    fetchUsers(searchTerm);
  };

  // Confirm Delete Handler
  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    setDeleting(true);
    try {
      await api.deleteUser(userToDelete.id);
      showToast(`User "${userToDelete.full_name}" deleted from database.`, 'success');
      setUserToDelete(null);
      fetchUsers(searchTerm);
    } catch (err) {
      showToast(err.message || 'Failed to delete user.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Title & Controls Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.3rem', color: 'var(--text-primary)', margin: '0 0 2px' }}>
            User Directory
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
            Manage user accounts, roles, statuses, and profile information.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => fetchUsers(searchTerm)} className="btn btn-secondary" title="Refresh user table">
            <RefreshCw size={15} />
            Refresh
          </button>
          <button onClick={handleOpenCreateModal} className="btn btn-primary">
            <UserPlus size={16} />
            Add User
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div
        className="card-panel"
        style={{
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
        }}
      >
        <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
          <Search
            size={16}
            color="var(--text-muted)"
            style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            type="text"
            placeholder="Search by full name or email address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '34px', paddingRight: searchTerm ? '32px' : '12px' }}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              style={{
                position: 'absolute',
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '2px',
              }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
          Showing <strong>{users.length}</strong> record{users.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Data Table */}
      <UserTable
        users={users}
        loading={loading}
        onSelectUser={(user) => setSelectedUser(user)}
        onEditUser={(user) => handleOpenEditModal(user)}
        onDeleteUser={(user) => setUserToDelete(user)}
      />

      {/* Slide-out User Profile Drawer */}
      <UserDetailDrawer
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
      />

      {/* Add / Edit User Form Modal */}
      <UserFormModal
        isOpen={isFormModalOpen}
        userToEdit={userToEdit}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!userToDelete}
        user={userToDelete}
        title="Confirm User Deletion"
        message="Are you sure you want to permanently remove this user record from SQLite?"
        onClose={() => setUserToDelete(null)}
        onConfirm={handleConfirmDelete}
        loading={deleting}
      />

      {/* Toast Banner */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
};
