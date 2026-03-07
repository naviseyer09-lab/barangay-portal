const express = require('express');
const { body, validationResult } = require('express-validator');
const { db } = require('../config/database');

const router = express.Router();

// Middleware to verify resident token
const authenticateResident = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token required' });
  }

  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

    if (decoded.type !== 'resident') {
      return res.status(403).json({ success: false, message: 'Resident access required' });
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ success: false, message: 'Invalid or expired token' });
  }
};

// Get resident profile
router.get('/profile', authenticateResident, (req, res) => {
  db.get('SELECT id, username, email, full_name, address, contact_number, birthdate, gender, civil_status, voter_status, account_status, profile_picture, created_at FROM residents WHERE id = ?',
    [req.user.id], (err, resident) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Database error' });
    }

    if (!resident) {
      return res.status(404).json({ success: false, message: 'Resident not found' });
    }

    res.json({ success: true, data: resident });
  });
});

// Update resident profile
router.put('/profile', authenticateResident, [
  body('fullName').optional().notEmpty().withMessage('Full name cannot be empty'),
  body('address').optional().notEmpty().withMessage('Address cannot be empty'),
  body('contactNumber').optional().isMobilePhone().withMessage('Please provide a valid phone number'),
  body('email').optional().isEmail().withMessage('Please provide a valid email'),
  body('birthdate').optional().isDate().withMessage('Please provide a valid birthdate'),
  body('gender').optional().isIn(['Male', 'Female', 'Other']).withMessage('Please select a valid gender'),
  body('civilStatus').optional().isIn(['Single', 'Married', 'Widowed', 'Divorced']).withMessage('Please select a valid civil status')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const { fullName, address, contactNumber, email, birthdate, gender, civilStatus } = req.body;

  // Build update query dynamically
  const updates = [];
  const params = [];

  if (fullName !== undefined) {
    updates.push('full_name = ?');
    params.push(fullName);
  }
  if (address !== undefined) {
    updates.push('address = ?');
    params.push(address);
  }
  if (contactNumber !== undefined) {
    updates.push('contact_number = ?');
    params.push(contactNumber);
  }
  if (email !== undefined) {
    updates.push('email = ?');
    params.push(email);
  }
  if (birthdate !== undefined) {
    updates.push('birthdate = ?');
    params.push(birthdate);
  }
  if (gender !== undefined) {
    updates.push('gender = ?');
    params.push(gender);
  }
  if (civilStatus !== undefined) {
    updates.push('civil_status = ?');
    params.push(civilStatus);
  }

  if (updates.length === 0) {
    return res.status(400).json({ success: false, message: 'No fields to update' });
  }

  updates.push('updated_at = CURRENT_TIMESTAMP');
  params.push(req.user.id);

  const query = `UPDATE residents SET ${updates.join(', ')} WHERE id = ?`;

  db.run(query, params, function(err) {
    if (err) {
      return res.status(500).json({ success: false, message: 'Database error' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ success: false, message: 'Resident not found' });
    }

    res.json({ success: true, message: 'Profile updated successfully' });
  });
});

// Get resident's service requests
router.get('/service-requests', authenticateResident, (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  db.all(`SELECT sr.*, a.first_name || ' ' || a.last_name as processed_by_name
          FROM service_requests sr
          LEFT JOIN admins a ON sr.processed_by = a.id
          WHERE sr.resident_id = ?
          ORDER BY sr.created_at DESC LIMIT ? OFFSET ?`,
    [req.user.id, limit, offset], (err, requests) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Database error' });
    }

    // Get total count
    db.get('SELECT COUNT(*) as total FROM service_requests WHERE resident_id = ?',
      [req.user.id], (err, result) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Database error' });
      }

      res.json({
        success: true,
        data: requests,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: result.total,
          pages: Math.ceil(result.total / limit)
        }
      });
    });
  });
});

// Create service request
router.post('/service-requests', authenticateResident, [
  body('serviceName').notEmpty().withMessage('Service name is required'),
  body('purpose').notEmpty().withMessage('Purpose is required')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const { serviceName, purpose } = req.body;

  // Get service details for processing time
  db.get('SELECT processing_time FROM services WHERE name = ? AND is_active = 1',
    [serviceName], (err, service) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Database error' });
    }

    if (!service) {
      return res.status(400).json({ success: false, message: 'Service not found or not available' });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    db.run(`INSERT INTO service_requests (resident_id, service_name, purpose, otp_code, estimated_processing)
            VALUES (?, ?, ?, ?, ?)`,
      [req.user.id, serviceName, purpose, otp, service.processing_time], function(err) {
      if (err) {
        return res.status(500).json({ success: false, message: 'Failed to create service request' });
      }

      res.status(201).json({
        success: true,
        message: 'Service request created successfully',
        data: {
          id: this.lastID,
          serviceName,
          purpose,
          otp,
          estimatedProcessing: service.processing_time,
          status: 'Pending'
        }
      });
    });
  });
});

// Get available services
router.get('/services', authenticateResident, (req, res) => {
  db.all('SELECT id, name, description, requirements, processing_time, fee FROM services WHERE is_active = 1 ORDER BY name',
    [], (err, services) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Database error' });
    }

    res.json({ success: true, data: services });
  });
});

// Get announcements
router.get('/announcements', authenticateResident, (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  db.all(`SELECT a.*, ad.first_name || ' ' || ad.last_name as created_by_name
          FROM announcements a
          LEFT JOIN admins ad ON a.created_by = ad.id
          WHERE a.status = 'Published'
          ORDER BY a.created_at DESC LIMIT ? OFFSET ?`,
    [limit, offset], (err, announcements) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Database error' });
    }

    // Get total count
    db.get("SELECT COUNT(*) as total FROM announcements WHERE status = 'Published'",
      [], (err, result) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Database error' });
      }

      res.json({
        success: true,
        data: announcements,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: result.total,
          pages: Math.ceil(result.total / limit)
        }
      });
    });
  });
});

module.exports = router;