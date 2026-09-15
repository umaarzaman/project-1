const express = require('express');
const { dbAll, dbGet, dbRun } = require('../db/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Helper: Basic email validation regex
const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// All user management routes require admin authentication
router.use(authenticateToken);

/**
 * GET /api/users?search=
 * Fetch list of users, with optional search filtering by full_name or email.
 */
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;

    let sql = 'SELECT * FROM users';
    let params = [];

    if (search && search.trim() !== '') {
      const query = `%${search.trim().toLowerCase()}%`;
      sql += ' WHERE LOWER(full_name) LIKE ? OR LOWER(email) LIKE ?';
      params = [query, query];
    }

    sql += ' ORDER BY id DESC';

    const users = await dbAll(sql, params);

    return res.status(200).json({
      count: users.length,
      users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve users.'
    });
  }
});

/**
 * GET /api/users/:id
 * Retrieve single user by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);
    if (isNaN(userId)) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Invalid user ID format.'
      });
    }

    const user = await dbGet('SELECT * FROM users WHERE id = ?', [userId]);

    if (!user) {
      return res.status(404).json({
        error: 'Not Found',
        message: `User with ID ${userId} was not found.`
      });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error('Error fetching single user:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve user details.'
    });
  }
});

/**
 * POST /api/users
 * Create a new user record
 */
router.post('/', async (req, res) => {
  try {
    const { full_name, email, role, status, phone, address, bio } = req.body;

    // Validation
    if (!full_name || !full_name.trim()) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Full name is required.'
      });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Email address is required.'
      });
    }

    const trimmedEmail = email.trim().toLowerCase();
    if (!isValidEmail(trimmedEmail)) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Please provide a valid email address.'
      });
    }

    // Check for duplicate email
    const existingUser = await dbGet('SELECT id FROM users WHERE LOWER(email) = ?', [trimmedEmail]);
    if (existingUser) {
      return res.status(409).json({
        error: 'Conflict',
        message: 'A user with this email address already exists.'
      });
    }

    const finalRole = role && role.trim() ? role.trim() : 'Member';
    const finalStatus = status && status.trim() ? status.trim() : 'Active';
    const finalPhone = phone ? phone.trim() : null;
    const finalAddress = address ? address.trim() : null;
    const finalBio = bio ? bio.trim() : null;

    const result = await dbRun(
      `INSERT INTO users (full_name, email, role, status, phone, address, bio)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [full_name.trim(), trimmedEmail, finalRole, finalStatus, finalPhone, finalAddress, finalBio]
    );

    const newUser = await dbGet('SELECT * FROM users WHERE id = ?', [result.lastID]);

    return res.status(201).json({
      message: 'User created successfully',
      user: newUser
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to create user record.'
    });
  }
});

/**
 * PUT /api/users/:id
 * Update an existing user record
 */
router.put('/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);
    if (isNaN(userId)) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Invalid user ID format.'
      });
    }

    const existingUser = await dbGet('SELECT * FROM users WHERE id = ?', [userId]);
    if (!existingUser) {
      return res.status(404).json({
        error: 'Not Found',
        message: `User with ID ${userId} was not found.`
      });
    }

    const { full_name, email, role, status, phone, address, bio } = req.body;

    if (email && email.trim()) {
      const trimmedEmail = email.trim().toLowerCase();
      if (!isValidEmail(trimmedEmail)) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Invalid email format.'
        });
      }
      const duplicate = await dbGet('SELECT id FROM users WHERE LOWER(email) = ? AND id != ?', [trimmedEmail, userId]);
      if (duplicate) {
        return res.status(409).json({
          error: 'Conflict',
          message: 'Another user is already using this email address.'
        });
      }
    }

    const updatedName = full_name !== undefined ? full_name.trim() : existingUser.full_name;
    const updatedEmail = email !== undefined ? email.trim().toLowerCase() : existingUser.email;
    const updatedRole = role !== undefined ? role.trim() : existingUser.role;
    const updatedStatus = status !== undefined ? status.trim() : existingUser.status;
    const updatedPhone = phone !== undefined ? phone.trim() : existingUser.phone;
    const updatedAddress = address !== undefined ? address.trim() : existingUser.address;
    const updatedBio = bio !== undefined ? bio.trim() : existingUser.bio;

    await dbRun(
      `UPDATE users
       SET full_name = ?, email = ?, role = ?, status = ?, phone = ?, address = ?, bio = ?
       WHERE id = ?`,
      [updatedName, updatedEmail, updatedRole, updatedStatus, updatedPhone, updatedAddress, updatedBio, userId]
    );

    const updatedUser = await dbGet('SELECT * FROM users WHERE id = ?', [userId]);

    return res.status(200).json({
      message: 'User updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update user record.'
    });
  }
});

/**
 * DELETE /api/users/:id
 * Delete a user record
 */
router.delete('/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);
    if (isNaN(userId)) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Invalid user ID format.'
      });
    }

    const existingUser = await dbGet('SELECT * FROM users WHERE id = ?', [userId]);
    if (!existingUser) {
      return res.status(404).json({
        error: 'Not Found',
        message: `User with ID ${userId} was not found.`
      });
    }

    await dbRun('DELETE FROM users WHERE id = ?', [userId]);

    return res.status(200).json({
      message: 'User deleted successfully',
      id: userId
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to delete user record.'
    });
  }
});

module.exports = router;
