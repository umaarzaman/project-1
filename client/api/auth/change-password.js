const { store, bcrypt, verifyAuth, setCors } = require('../_db');

module.exports = (req, res) => {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const adminPayload = verifyAuth(req);
  if (!adminPayload) {
    return res.status(401).json({ error: 'Unauthorized', message: 'Invalid token.' });
  }

  const { currentPassword, newPassword } = req.body || {};
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Bad Request', message: 'Both current and new passwords required.' });
  }

  const admin = store.administrators.find(a => a.id === adminPayload.id);
  if (!admin || !bcrypt.compareSync(currentPassword, admin.password_hash)) {
    return res.status(400).json({ error: 'Bad Request', message: 'Incorrect current password.' });
  }

  admin.password_hash = bcrypt.hashSync(newPassword, 10);
  return res.status(200).json({ message: 'Password updated successfully.' });
};
