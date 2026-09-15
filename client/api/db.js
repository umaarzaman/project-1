const bcrypt = require('bcryptjs');

let sqlite3;
let useSqlite = true;

try {
  sqlite3 = require('sqlite3').verbose();
} catch (e) {
  console.warn('sqlite3 native binary unavailable on serverless environment. Switching to pure JS storage engine:', e.message);
  useSqlite = false;
}

// Memory / File fallback store for Vercel Serverless
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

let dbInstance = null;

if (useSqlite) {
  try {
    const path = require('path');
    const fs = require('fs');
    let dbPath = path.join('/tmp', 'database.sqlite');
    try {
      if (!fs.existsSync('/tmp')) {
        dbPath = path.join(__dirname, 'database.sqlite');
      }
    } catch (e) {
      dbPath = path.join(__dirname, 'database.sqlite');
    }
    dbInstance = new sqlite3.Database(dbPath);
  } catch (err) {
    console.warn('Failed to initialize sqlite3 database instance:', err.message);
    useSqlite = false;
  }
}

const dbRun = (sql, params = []) => {
  if (useSqlite && dbInstance) {
    return new Promise((resolve, reject) => {
      dbInstance.run(sql, params, function (err) {
        if (err) reject(err);
        else resolve(this);
      });
    });
  }

  // Pure JS Fallback execution
  const sqlLower = sql.toLowerCase().trim();

  if (sqlLower.startsWith('insert into users')) {
    const id = store.nextUserId++;
    const [full_name, email, role, status, phone, address, bio] = params;
    const newUser = {
      id,
      full_name,
      email,
      role: role || 'Member',
      status: status || 'Active',
      phone: phone || null,
      address: address || null,
      bio: bio || null,
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    store.users.unshift(newUser);
    return Promise.resolve({ lastID: id });
  }

  if (sqlLower.startsWith('update users')) {
    const [full_name, email, role, status, phone, address, bio, id] = params;
    const idx = store.users.findIndex(u => u.id === id);
    if (idx !== -1) {
      store.users[idx] = {
        ...store.users[idx],
        full_name,
        email,
        role,
        status,
        phone,
        address,
        bio
      };
    }
    return Promise.resolve({ changes: 1 });
  }

  if (sqlLower.startsWith('delete from users')) {
    const id = params[0];
    store.users = store.users.filter(u => u.id !== id);
    return Promise.resolve({ changes: 1 });
  }

  if (sqlLower.startsWith('update administrators')) {
    const [password_hash, emailOrId] = params;
    const admin = store.administrators.find(a => a.email === emailOrId || a.id === emailOrId);
    if (admin) {
      admin.password_hash = password_hash;
    }
    return Promise.resolve({ changes: 1 });
  }

  return Promise.resolve({});
};

const dbGet = (sql, params = []) => {
  if (useSqlite && dbInstance) {
    return new Promise((resolve, reject) => {
      dbInstance.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  // Pure JS Fallback execution
  const sqlLower = sql.toLowerCase().trim();

  if (sqlLower.includes('from administrators')) {
    const target = params[0];
    const admin = store.administrators.find(a =>
      typeof target === 'string' ? a.email.toLowerCase() === target.toLowerCase() : a.id === target
    );
    return Promise.resolve(admin || null);
  }

  if (sqlLower.includes('from users')) {
    if (sqlLower.includes('count(*)')) {
      return Promise.resolve({ count: store.users.length });
    }

    const target = params[0];
    if (typeof target === 'string') {
      const user = store.users.find(u => u.email.toLowerCase() === target.toLowerCase());
      return Promise.resolve(user || null);
    } else {
      const user = store.users.find(u => u.id === target);
      return Promise.resolve(user || null);
    }
  }

  return Promise.resolve(null);
};

const dbAll = (sql, params = []) => {
  if (useSqlite && dbInstance) {
    return new Promise((resolve, reject) => {
      dbInstance.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  // Pure JS Fallback execution
  const sqlLower = sql.toLowerCase().trim();

  if (sqlLower.includes('from users')) {
    let result = [...store.users];
    if (params.length > 0 && params[0]) {
      const q = params[0].replace(/%/g, '').toLowerCase();
      result = result.filter(u =>
        u.full_name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
      );
    }
    return Promise.resolve(result);
  }

  return Promise.resolve([]);
};

const initDatabase = async () => {
  if (!useSqlite || !dbInstance) return;
  try {
    await dbRun('PRAGMA foreign_keys = ON');

    await dbRun(`
      CREATE TABLE IF NOT EXISTS administrators (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await dbRun(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        full_name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        role TEXT NOT NULL DEFAULT 'Member',
        status TEXT NOT NULL DEFAULT 'Active',
        phone TEXT,
        address TEXT,
        bio TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const adminEmail = 'admin@example.com';
    const existingAdmin = await dbGet('SELECT * FROM administrators WHERE email = ?', [adminEmail]);

    if (!existingAdmin) {
      const passwordHash = bcrypt.hashSync('admin123', 10);
      await dbRun(
        'INSERT INTO administrators (email, password_hash) VALUES (?, ?)',
        [adminEmail, passwordHash]
      );
    }

    const userCountObj = await dbGet('SELECT COUNT(*) as count FROM users');
    if (userCountObj.count < 10) {
      for (const u of store.users) {
        await dbRun(
          `INSERT INTO users (full_name, email, role, status, phone, address, bio, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [u.full_name, u.email, u.role, u.status, u.phone, u.address, u.bio, u.created_at]
        );
      }
    }
  } catch (err) {
    console.warn('SQLite init failed, falling back to pure JS store:', err.message);
    useSqlite = false;
  }
};

module.exports = {
  db: dbInstance,
  dbRun,
  dbGet,
  dbAll,
  initDatabase
};
