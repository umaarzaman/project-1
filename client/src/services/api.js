const API_BASE_URL = '/api';

/**
 * Custom fetch wrapper with automatic JWT header and error parsing
 */
const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem('admin_token');

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  let data;
  try {
    data = await response.json();
  } catch (err) {
    data = null;
  }

  if (!response.ok) {
    const errorMsg = (data && data.message) || (data && data.error) || `HTTP Error ${response.status}`;
    const error = new Error(errorMsg);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
};

export const api = {
  // Auth API
  login: (email, password) => request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  }),

  getMe: () => request('/auth/me', {
    method: 'GET',
  }),

  changePassword: (currentPassword, newPassword) => request('/auth/change-password', {
    method: 'POST',
    body: JSON.stringify({ currentPassword, newPassword }),
  }),

  // Users API
  getUsers: (search = '') => {
    const query = search ? `?search=${encodeURIComponent(search)}` : '';
    return request(`/users${query}`, { method: 'GET' });
  },

  getUserById: (id) => request(`/users/${id}`, { method: 'GET' }),

  createUser: (userData) => request('/users', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),

  updateUser: (id, userData) => request(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(userData),
  }),

  deleteUser: (id) => request(`/users/${id}`, {
    method: 'DELETE',
  }),
};
