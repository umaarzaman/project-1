const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

// On Vercel / Serverless environments, /tmp directory is writeable
let dbPath = path.join(__dirname, '../../database.sqlite');
if (process.env.VERCEL) {
  const tmpPath = path.join('/tmp', 'database.sqlite');
  if (!fs.existsSync(tmpPath) && fs.existsSync(dbPath)) {
    try {
      fs.copyFileSync(dbPath, tmpPath);
    } catch (e) {
      console.warn('Failed to copy seeded SQLite to /tmp:', e.message);
    }
  }
  dbPath = tmpPath;
}

const db = new sqlite3.Database(dbPath);

// Promisified database helpers
const dbRun = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
};

const dbGet = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

const dbAll = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

const initDatabase = async () => {
  console.log('Initializing SQLite database at:', dbPath);

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

  // Seed Admin Account
  const adminEmail = 'admin@example.com';
  const existingAdmin = await dbGet('SELECT * FROM administrators WHERE email = ?', [adminEmail]);

  if (!existingAdmin) {
    const passwordHash = bcrypt.hashSync('admin123', 10);
    await dbRun(
      'INSERT INTO administrators (email, password_hash) VALUES (?, ?)',
      [adminEmail, passwordHash]
    );
    console.log(`Seeded admin account: ${adminEmail} (password: admin123)`);
  }

  // Seed Sample Users if count < 10
  const userCountObj = await dbGet('SELECT COUNT(*) as count FROM users');
  if (userCountObj.count < 10) {
    console.log('Seeding initial sample users...');
    const sampleUsers = [
      {
        full_name: 'Sarah Jenkins',
        email: 'sarah.jenkins@example.com',
        role: 'Administrator',
        status: 'Active',
        phone: '+1 (555) 234-5678',
        address: '742 Evergreen Terrace, Springfield, OR',
        bio: 'Lead Systems Architect with 8+ years of expertise in cloud infrastructure, microservices, and DevOps automation.',
        created_at: '2026-01-15 08:30:00'
      },
      {
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

    for (const u of sampleUsers) {
      await dbRun(
        `INSERT INTO users (full_name, email, role, status, phone, address, bio, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [u.full_name, u.email, u.role, u.status, u.phone, u.address, u.bio, u.created_at]
      );
    }
    console.log('Sample users seeded successfully.');
  }
};

module.exports = {
  db,
  dbRun,
  dbGet,
  dbAll,
  initDatabase
};
