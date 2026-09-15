const { store, verifyAuth, setCors } = require('../_db');

module.exports = (req, res) => {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const adminPayload = verifyAuth(req);
  if (!adminPayload) {
    return res.status(401).json({ error: 'Unauthorized', message: 'Invalid or missing authentication token.' });
  }

  const admin = store.administrators.find(a => a.id === adminPayload.id);
  if (!admin) {
    return res.status(404).json({ error: 'Not Found', message: 'Administrator record not found.' });
  }

  return res.status(200).json({ admin: { id: admin.id, email: admin.email, created_at: admin.created_at } });
};
