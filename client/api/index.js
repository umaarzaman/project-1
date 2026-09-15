const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_admin_dashboard_jwt_token_key_2026';

// In-Memory Database Store for Vercel Serverless
const store = {
  administrators: [
    {
      id: 1,
      email: 'admin@example.com',
      password_hash: bcrypt.hashSync('admin123', 10),
      created_at: new Date().toISOString()
    }
  ],
  users: [
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
  ],
  nextUserId: 13
};

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// JWT Auth Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized', message: 'No authentication token provided.' });
  }

  jwt.verify(token, JWT_SECRET, (err, adminPayload) => {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized', message: 'Invalid or expired token.' });
    }
    req.admin = adminPayload;
    next();
  });
};

// Health Check
app.get(['/api/health', '/health'], (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// LOGIN Endpoint (matches /api/auth/login, /auth/login, /login)
app.post(['/api/auth/login', '/auth/login', '/login'], (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ error: 'Bad Request', message: 'Both email and password are required.' });
    }

    const trimmedEmail = String(email).trim().toLowerCase();
    const admin = store.administrators.find(a => a.email.toLowerCase() === trimmedEmail);

    if (!admin) {
      return res.status(401).json({ error: 'Unauthorized', message: 'Invalid email or password.' });
    }

    const isMatch = bcrypt.compareSync(String(password), admin.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Unauthorized', message: 'Invalid email or password.' });
    }

    const token = jwt.sign({ id: admin.id, email: admin.email }, JWT_SECRET, { expiresIn: '24h' });

    return res.status(200).json({
      message: 'Login successful',
      token,
      admin: { id: admin.id, email: admin.email }
    });
  } catch (err) {
    console.error('Login Handler Error:', err);
    return res.status(500).json({ error: 'Internal Error', message: err.message || 'Login failed' });
  }
});

// GET ME Endpoint
app.get(['/api/auth/me', '/auth/me', '/me'], authenticateToken, (req, res) => {
  const admin = store.administrators.find(a => a.id === req.admin.id);
  if (!admin) {
    return res.status(404).json({ error: 'Not Found', message: 'Administrator record not found.' });
  }
  return res.status(200).json({ admin: { id: admin.id, email: admin.email, created_at: admin.created_at } });
});

// CHANGE PASSWORD Endpoint
app.post(['/api/auth/change-password', '/auth/change-password', '/change-password'], authenticateToken, (req, res) => {
  const { currentPassword, newPassword } = req.body || {};
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Bad Request', message: 'Both current and new passwords required.' });
  }

  const admin = store.administrators.find(a => a.id === req.admin.id);
  if (!admin || !bcrypt.compareSync(currentPassword, admin.password_hash)) {
    return res.status(400).json({ error: 'Bad Request', message: 'Incorrect current password.' });
  }

  admin.password_hash = bcrypt.hashSync(newPassword, 10);
  return res.status(200).json({ message: 'Password updated successfully.' });
});

// GET USERS Endpoint
app.get(['/api/users', '/users'], authenticateToken, (req, res) => {
  const search = req.query.search;
  let results = [...store.users];

  if (search && String(search).trim()) {
    const q = String(search).trim().toLowerCase();
    results = results.filter(u => u.full_name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
  }

  return res.status(200).json({ count: results.length, users: results });
});

// GET SINGLE USER Endpoint
app.get(['/api/users/:id', '/users/:id'], authenticateToken, (req, res) => {
  const id = parseInt(req.params.id, 10);
  const user = store.users.find(u => u.id === id);
  if (!user) {
    return res.status(404).json({ error: 'Not Found', message: `User #${id} not found.` });
  }
  return res.status(200).json({ user });
});

// CREATE USER Endpoint
app.post(['/api/users', '/users'], authenticateToken, (req, res) => {
  const { full_name, email, role, status, phone, address, bio } = req.body || {};
  if (!full_name || !email) {
    return res.status(400).json({ error: 'Bad Request', message: 'Full name and email are required.' });
  }

  const trimmedEmail = String(email).trim().toLowerCase();
  const exists = store.users.find(u => u.email.toLowerCase() === trimmedEmail);
  if (exists) {
    return res.status(409).json({ error: 'Conflict', message: 'Email address already registered.' });
  }

  const newUser = {
    id: store.nextUserId++,
    full_name: String(full_name).trim(),
    email: trimmedEmail,
    role: role ? String(role).trim() : 'Member',
    status: status ? String(status).trim() : 'Active',
    phone: phone ? String(phone).trim() : null,
    address: address ? String(address).trim() : null,
    bio: bio ? String(bio).trim() : null,
    created_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
  };

  store.users.unshift(newUser);
  return res.status(201).json({ message: 'User created successfully', user: newUser });
});

// UPDATE USER Endpoint
app.put(['/api/users/:id', '/users/:id'], authenticateToken, (req, res) => {
  const id = parseInt(req.params.id, 10);
  const user = store.users.find(u => u.id === id);
  if (!user) {
    return res.status(404).json({ error: 'Not Found', message: `User #${id} not found.` });
  }

  const { full_name, email, role, status, phone, address, bio } = req.body || {};
  if (full_name) user.full_name = String(full_name).trim();
  if (email) user.email = String(email).trim().toLowerCase();
  if (role) user.role = String(role).trim();
  if (status) user.status = String(status).trim();
  if (phone !== undefined) user.phone = phone ? String(phone).trim() : null;
  if (address !== undefined) user.address = address ? String(address).trim() : null;
  if (bio !== undefined) user.bio = bio ? String(bio).trim() : null;

  return res.status(200).json({ message: 'User updated successfully', user });
});

// DELETE USER Endpoint
app.delete(['/api/users/:id', '/users/:id'], authenticateToken, (req, res) => {
  const id = parseInt(req.params.id, 10);
  const index = store.users.findIndex(u => u.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Not Found', message: `User #${id} not found.` });
  }
  store.users.splice(index, 1);
  return res.status(200).json({ message: 'User deleted successfully', id });
});

// Fallback error handler
app.use((err, req, res, next) => {
  console.error('Unhandled API Error:', err);
  res.status(500).json({ error: 'Internal Server Error', message: err.message || 'Server error' });
});

module.exports = app;
