const { store, verifyAuth, setCors } = require('../_db');

module.exports = (req, res) => {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const adminPayload = verifyAuth(req);
  if (!adminPayload) {
    return res.status(401).json({ error: 'Unauthorized', message: 'Authentication required.' });
  }

  const { id: queryId } = req.query;
  const id = parseInt(queryId, 10);

  if (isNaN(id)) {
    return res.status(400).json({ error: 'Bad Request', message: 'Invalid user ID format.' });
  }

  const user = store.users.find(u => u.id === id);

  if (req.method === 'GET') {
    if (!user) {
      return res.status(404).json({ error: 'Not Found', message: `User #${id} not found.` });
    }
    return res.status(200).json({ user });
  }

  if (req.method === 'PUT') {
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
  }

  if (req.method === 'DELETE') {
    const index = store.users.findIndex(u => u.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Not Found', message: `User #${id} not found.` });
    }
    store.users.splice(index, 1);
    return res.status(200).json({ message: 'User deleted successfully', id });
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
};
