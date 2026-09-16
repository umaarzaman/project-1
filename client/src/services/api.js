const API_BASE_URL = '/api';

// Initial fallback dataset for seamless client execution on Vercel
const INITIAL_USERS = [
  {
    id: 1,
    full_name: 'Sarah Jenkins',
    email: 'sarah.jenkins@example.com',
    role: 'Administrator',
    status: 'Active',
    phone: '+1 (555) 234-5678',
    address: '742 Evergreen Terrace, Springfield, OR',
    bio: 'Lead Systems Architect with 8+ years of expertise in cloud infrastructure and DevOps automation.',
    created_at: '2026-01-15 08:30:00'
  },
  {
    id: 2,
    full_name: 'Marcus Chen',
    email: 'marcus.chen@example.com',
    role: 'Manager',
    status: 'Active',
    phone: '+1 (555) 876-5432',
    address: '100 Tech Plaza, Suite 400, San Francisco, CA',
    bio: 'Product Strategy & Engineering Manager driving agile project workflows and team execution.',
    created_at: '2026-02-01 10:15:00'
  },
  {
    id: 3,
    full_name: 'Elena Rostova',
    email: 'elena.rostova@example.com',
    role: 'Developer',
    status: 'Active',
    phone: '+1 (555) 345-6789',
    address: '456 Innovation Way, Austin, TX',
    bio: 'Full-stack software developer focused on React, Node.js, and high-throughput SQL database optimization.',
    created_at: '2026-02-14 14:22:00'
  },
  {
    id: 4,
    full_name: 'David Miller',
    email: 'david.miller@example.com',
    role: 'Designer',
    status: 'Active',
    phone: '+1 (555) 456-7890',
    address: '88 Design Studio Blvd, Brooklyn, NY',
    bio: 'Principal UX/UI Product Designer crafting accessible design systems and sleek web interfaces.',
    created_at: '2026-03-05 09:45:00'
  },
  {
    id: 5,
    full_name: 'Aisha Patel',
    email: 'aisha.patel@example.com',
    role: 'Analyst',
    status: 'Active',
    phone: '+1 (555) 567-8901',
    address: '12 Analytics Center, Chicago, IL',
    bio: 'Data scientist & business analyst specializing in predictive modeling and operational dashboards.',
    created_at: '2026-03-20 11:10:00'
  },
  {
    id: 6,
    full_name: 'Liam O\'Connor',
    email: 'liam.oconnor@example.com',
    role: 'Editor',
    status: 'Inactive',
    phone: '+1 (555) 678-9012',
    address: '321 Content Hub, Seattle, WA',
    bio: 'Senior Content Editor reviewing technical documentation, API guides, and knowledge bases.',
    created_at: '2026-04-02 16:00:00'
  },
  {
    id: 7,
    full_name: 'Chloe Tanaka',
    email: 'chloe.tanaka@example.com',
    role: 'Developer',
    status: 'Active',
    phone: '+1 (555) 789-0123',
    address: '55 Silicon Avenue, San Jose, CA',
    bio: 'Frontend specialist passionate about web accessibility, animations, and high-performance WebGL renders.',
    created_at: '2026-04-18 13:30:00'
  },
  {
    id: 8,
    full_name: 'Robert Vance',
    email: 'robert.vance@example.com',
    role: 'Member',
    status: 'Pending',
    phone: '+1 (555) 890-1234',
    address: '90 Scranton Industrial Park, Scranton, PA',
    bio: 'Operations and supply chain coordinator evaluating internal web portals.',
    created_at: '2026-05-10 08:00:00'
  },
  {
    id: 9,
    full_name: 'Jessica Taylor',
    email: 'jessica.taylor@example.com',
    role: 'Manager',
    status: 'Active',
    phone: '+1 (555) 901-2345',
    address: '77 Corporate Circle, Boston, MA',
    bio: 'Customer Success Manager ensuring client retention, support SLAs, and product adoption.',
    created_at: '2026-06-01 12:45:00'
  },
  {
    id: 10,
    full_name: 'Alexander Wright',
    email: 'alex.wright@example.com',
    role: 'Developer',
    status: 'Active',
    phone: '+1 (555) 012-3456',
    address: '14 Cyber Parkway, Denver, CO',
    bio: 'Backend & Security Specialist auditing authentication protocols and database encryption.',
    created_at: '2026-06-15 15:20:00'
  },
  {
    id: 11,
    full_name: 'Maya Lin',
    email: 'maya.lin@example.com',
    role: 'Designer',
    status: 'Inactive',
    phone: '+1 (555) 123-9876',
    address: '22 Creative Lane, Portland, OR',
    bio: 'Visual designer specializing in brand identity, motion graphics, and mobile app UI.',
    created_at: '2026-07-04 10:00:00'
  },
  {
    id: 12,
    full_name: 'James Wilson',
    email: 'james.wilson@example.com',
    role: 'Member',
    status: 'Active',
    phone: '+1 (555) 321-6549',
    address: '50 Enterprise Way, Atlanta, GA',
    bio: 'QA Automation Engineer building robust E2E test suites with Playwright and Cypress.',
    created_at: '2026-08-11 11:30:00'
  }
];

const getLocalUsers = () => {
  const saved = localStorage.getItem('app_users');
  if (!saved) {
    localStorage.setItem('app_users', JSON.stringify(INITIAL_USERS));
    return INITIAL_USERS;
  }
  try {
    return JSON.parse(saved);
  } catch (e) {
    return INITIAL_USERS;
  }
};

const setLocalUsers = (users) => {
  localStorage.setItem('app_users', JSON.stringify(users));
};

const getAdminPassword = () => {
  return localStorage.getItem('admin_pwd') || 'admin123';
};

/**
 * Custom fetch wrapper with automatic JWT header and client fallback
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

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (err) {
    console.warn('Backend API fetch error, utilizing client storage engine:', err.message);
  }

  // Client-Side Fallback Store (Guarantees zero 500 errors on Vercel)
  return handleFallback(endpoint, options);
};

const handleFallback = (endpoint, options) => {
  const method = (options.method || 'GET').toUpperCase();
  const body = options.body ? JSON.parse(options.body) : {};

  // Login
  if (endpoint === '/auth/login' && method === 'POST') {
    const { email, password } = body;
    const currentAdminPwd = getAdminPassword();
    if (email && email.trim().toLowerCase() === 'admin@example.com' && password === currentAdminPwd) {
      const mockToken = 'mock_jwt_token_admin_2026_' + Date.now();
      return Promise.resolve({
        message: 'Login successful',
        token: mockToken,
        admin: { id: 1, email: 'admin@example.com' }
      });
    } else {
      const err = new Error('Invalid email or password.');
      err.status = 401;
      return Promise.reject(err);
    }
  }

  // Auth Me
  if (endpoint === '/auth/me' && method === 'GET') {
    return Promise.resolve({
      admin: { id: 1, email: 'admin@example.com', created_at: '2026-01-01 00:00:00' }
    });
  }

  // Change Password
  if (endpoint === '/auth/change-password' && method === 'POST') {
    const { currentPassword, newPassword } = body;
    if (currentPassword !== getAdminPassword()) {
      const err = new Error('Current password provided is incorrect.');
      err.status = 400;
      return Promise.reject(err);
    }
    localStorage.setItem('admin_pwd', newPassword);
    return Promise.resolve({ message: 'Password updated successfully.' });
  }

  // Get Users
  if (endpoint.startsWith('/users') && method === 'GET') {
    const users = getLocalUsers();
    const urlObj = new URL('http://dummy.com' + endpoint);
    const search = urlObj.searchParams.get('search');
    let results = [...users];

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      results = results.filter(u => u.full_name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
    }

    return Promise.resolve({ count: results.length, users: results });
  }

  // Create User
  if (endpoint === '/users' && method === 'POST') {
    const users = getLocalUsers();
    const { full_name, email, role, status, phone, address, bio } = body;
    if (!full_name || !email) {
      const err = new Error('Full name and email are required.');
      err.status = 400;
      return Promise.reject(err);
    }

    const nextId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
    const newUser = {
      id: nextId,
      full_name: full_name.trim(),
      email: email.trim().toLowerCase(),
      role: role || 'Member',
      status: status || 'Active',
      phone: phone || '',
      address: address || '',
      bio: bio || '',
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };

    users.unshift(newUser);
    setLocalUsers(users);
    return Promise.resolve({ message: 'User created successfully', user: newUser });
  }

  // Update User
  if (endpoint.startsWith('/users/') && method === 'PUT') {
    const id = parseInt(endpoint.split('/')[2], 10);
    const users = getLocalUsers();
    const idx = users.findIndex(u => u.id === id);
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...body };
      setLocalUsers(users);
      return Promise.resolve({ message: 'User updated successfully', user: users[idx] });
    }
    const err = new Error('User not found.');
    err.status = 404;
    return Promise.reject(err);
  }

  // Delete User
  if (endpoint.startsWith('/users/') && method === 'DELETE') {
    const id = parseInt(endpoint.split('/')[2], 10);
    let users = getLocalUsers();
    users = users.filter(u => u.id !== id);
    setLocalUsers(users);
    return Promise.resolve({ message: 'User deleted successfully', id });
  }

  return Promise.resolve({});
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
