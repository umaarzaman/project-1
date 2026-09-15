const { store, bcrypt, jwt, JWT_SECRET, setCors } = require('../_db');

module.exports = (req, res) => {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

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
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Internal Error', message: err.message || 'Login failed' });
  }
};
