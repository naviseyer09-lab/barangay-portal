const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { db } = require('../config/database');

const router = express.Router();

// Generate JWT token
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '24h'
  });
};

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Admin Login
router.post('/admin/login', [
  body('username').notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { username, password } = req.body;

    // Find admin
    db.get('SELECT * FROM admins WHERE username = ?', [username], async (err, admin) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Database error' });
      }

      if (!admin) {
        return res.status(401).json({ success: false, message: 'Invalid username or password' });
      }

      // Check if admin account is approved
      if (admin.status !== 'approved') {
        return res.status(403).json({
          success: false,
          message: admin.status === 'pending'
            ? 'Your account is pending approval. Please contact the barangay administrator.'
            : 'Your account has been rejected. Please contact the barangay administrator.'
        });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, admin.password);
      if (!isValidPassword) {
        return res.status(401).json({ success: false, message: 'Invalid username or password' });
      }

      // Generate token
      const token = generateToken({
        id: admin.id,
        username: admin.username,
        role: admin.role,
        type: 'admin'
      });

      res.json({
        success: true,
        message: 'Login successful',
        token,
        user: {
          id: admin.id,
          username: admin.username,
          email: admin.email,
          firstName: admin.first_name,
          lastName: admin.last_name,
          role: admin.role
        }
      });
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Admin Registration
router.post('/admin/register', [
  body('username').isLength({ min: 4 }).withMessage('Username must be at least 4 characters'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('phone').optional().isMobilePhone().withMessage('Please provide a valid phone number'),
  body('position').notEmpty().withMessage('Position is required'),
  body('employeeId').notEmpty().withMessage('Employee ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { username, password, email, firstName, lastName, phone, position, employeeId } = req.body;

    // Check if username or email already exists
    db.get('SELECT id FROM admins WHERE username = ? OR email = ? OR employee_id = ?',
      [username, email, employeeId], async (err, existing) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Database error' });
      }

      if (existing) {
        return res.status(409).json({ success: false, message: 'Username, email, or employee ID already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Check if this is the first admin registration
      db.get('SELECT COUNT(*) as count FROM admins', [], (err, result) => {
        if (err) {
          return res.status(500).json({ success: false, message: 'Database error' });
        }

        const isFirstAdmin = result.count === 0;
        const role = isFirstAdmin ? 'Super Admin' : 'Staff';
        const status = isFirstAdmin ? 'approved' : 'pending';

        // Insert new admin
        db.run(`INSERT INTO admins (username, password, email, first_name, last_name, phone, position, employee_id, role, status)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [username, hashedPassword, email, firstName, lastName, phone, position, employeeId, role, status],
          function(err) {
            if (err) {
              return res.status(500).json({ success: false, message: 'Failed to create account' });
            }

            const message = isFirstAdmin
              ? 'Registration successful! You are the first administrator and your account has been approved.'
              : 'Registration submitted successfully. Your account is pending approval from the barangay administrator.';

            res.status(201).json({
              success: true,
              message: message,
              isFirstAdmin
            });
          });
      });
    });
  } catch (error) {
    console.error('Admin registration error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Resident Login
router.post('/resident/login', [
  body('username').notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { username, password } = req.body;

    // Find resident
    db.get('SELECT * FROM residents WHERE username = ?', [username], async (err, resident) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Database error' });
      }

      if (!resident) {
        return res.status(401).json({ success: false, message: 'Invalid username or password' });
      }

      // Check if resident account is active
      if (resident.account_status !== 'Active') {
        return res.status(403).json({
          success: false,
          message: 'Your account is inactive. Please contact the barangay administrator.'
        });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, resident.password);
      if (!isValidPassword) {
        return res.status(401).json({ success: false, message: 'Invalid username or password' });
      }

      // Generate token
      const token = generateToken({
        id: resident.id,
        username: resident.username,
        type: 'resident'
      });

      res.json({
        success: true,
        message: 'Login successful',
        token,
        user: {
          id: resident.id,
          username: resident.username,
          fullName: resident.full_name,
          email: resident.email,
          address: resident.address,
          contactNumber: resident.contact_number,
          voterStatus: resident.voter_status,
          accountStatus: resident.account_status,
          profilePicture: resident.profile_picture,
          birthdate: resident.birthdate,
          gender: resident.gender,
          civilStatus: resident.civil_status
        }
      });
    });
  } catch (error) {
    console.error('Resident login error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Resident Registration
router.post('/resident/register', [
  body('username').isLength({ min: 4 }).withMessage('Username must be at least 4 characters'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('fullName').notEmpty().withMessage('Full name is required'),
  body('address').notEmpty().withMessage('Address is required'),
  body('contactNumber').isMobilePhone().withMessage('Please provide a valid phone number'),
  body('birthdate').optional().isDate().withMessage('Please provide a valid birthdate'),
  body('gender').optional().isIn(['Male', 'Female', 'Other']).withMessage('Please select a valid gender'),
  body('civilStatus').optional().isIn(['Single', 'Married', 'Widowed', 'Divorced']).withMessage('Please select a valid civil status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { username, password, email, fullName, address, contactNumber, birthdate, gender, civilStatus } = req.body;

    // Check if username or email already exists
    db.get('SELECT id FROM residents WHERE username = ? OR email = ?',
      [username, email], async (err, existing) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Database error' });
      }

      if (existing) {
        return res.status(409).json({ success: false, message: 'Username or email already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Insert new resident
      db.run(`INSERT INTO residents (username, password, email, full_name, address, contact_number, birthdate, gender, civil_status)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [username, hashedPassword, email, fullName, address, contactNumber, birthdate, gender, civilStatus],
        function(err) {
          if (err) {
            return res.status(500).json({ success: false, message: 'Failed to create account' });
          }

          res.status(201).json({
            success: true,
            message: 'Registration successful! You can now log in to access resident services.'
          });
        });
    });
  } catch (error) {
    console.error('Resident registration error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Verify token endpoint
router.get('/verify', authenticateToken, (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

module.exports = router;