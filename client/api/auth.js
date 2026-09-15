const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { dbGet, dbRun } = require('./db');
const { authenticateToken, JWT_SECRET } = require('./middleware');

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Both email and password are required.'
      });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const admin = await dbGet('SELECT * FROM administrators WHERE LOWER(email) = ?', [trimmedEmail]);

    if (!admin) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid email or password.'
      });
    }

    const isPasswordValid = bcrypt.compareSync(password, admin.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid email or password.'
      });
    }

    const tokenPayload = {
      id: admin.id,
      email: admin.email
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '24h' });

    return res.status(200).json({
      message: 'Login successful',
      token,
      admin: {
        id: admin.id,
        email: admin.email
      }
    });
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'An error occurred during authentication.'
    });
  }
});

router.get('/me', authenticateToken, async (req, res) => {
  try {
    const admin = await dbGet('SELECT id, email, created_at FROM administrators WHERE id = ?', [req.admin.id]);
    if (!admin) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Administrator account no longer exists.'
      });
    }
    return res.status(200).json({ admin });
  } catch (error) {
    console.error('Auth Check Error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve admin details.'
    });
  }
});

router.post('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Both current password and new password are required.'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'New password must be at least 6 characters long.'
      });
    }

    const admin = await dbGet('SELECT * FROM administrators WHERE id = ?', [req.admin.id]);
    if (!admin) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Administrator account not found.'
      });
    }

    const isMatch = bcrypt.compareSync(currentPassword, admin.password_hash);
    if (!isMatch) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Current password provided is incorrect.'
      });
    }

    const newHash = bcrypt.hashSync(newPassword, 10);
    await dbRun('UPDATE administrators SET password_hash = ? WHERE id = ?', [newHash, req.admin.id]);

    return res.status(200).json({
      message: 'Password changed successfully.'
    });
  } catch (error) {
    console.error('Change Password Error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update password.'
    });
  }
});

module.exports = router;
