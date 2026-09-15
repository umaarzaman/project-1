const { store, verifyAuth, setCors } = require('../_db');

module.exports = (req, res) => {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const adminPayload = verifyAuth(req);
  if (!adminPayload) {
    return res.status(401).json({ error: 'Unauthorized', message: 'Authentication required.' });
  }

  // GET /api/users
  if (req.method === 'GET') {
    const search = req.query.search;
    let results = [...store.users];

    if (search && String(search).trim()) {
      const q = String(search).trim().toLowerCase();
      results = results.filter(u => u.full_name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
    }

    return res.status(200).json({ count: results.length, users: results });
  }

  // POST /api/users
  if (req.method === 'POST') {
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
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
};
