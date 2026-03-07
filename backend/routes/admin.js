const express = require('express');
const { body, validationResult } = require('express-validator');
const { db } = require('../config/database');

const router = express.Router();

// Middleware to verify admin token
const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token required' });
  }

  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

    if (decoded.type !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ success: false, message: 'Invalid or expired token' });
  }
};

// Get all staff accounts
router.get('/staff', authenticateAdmin, (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  let query = 'SELECT id, username, email, first_name, last_name, phone, position, employee_id, role, status, created_at FROM admins WHERE role != "Super Admin"';
  let params = [];

  if (status) {
    query += ' AND status = ?';
    params.push(status);
  }

  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  params.push(limit, offset);

  db.all(query, params, (err, staff) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Database error' });
    }

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM admins WHERE role != "Super Admin"';
    let countParams = [];

    if (status) {
      countQuery += ' AND status = ?';
      countParams.push(status);
    }

    db.get(countQuery, countParams, (err, result) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Database error' });
      }

      res.json({
        success: true,
        staff: staff,
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

// Approve staff account
router.put('/staff/:id/approve', authenticateAdmin, (req, res) => {
  const { id } = req.params;

  db.run('UPDATE admins SET status = "approved", updated_at = CURRENT_TIMESTAMP WHERE id = ? AND role != "Super Admin"',
    [id], function(err) {
    if (err) {
      return res.status(500).json({ success: false, message: 'Database error' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ success: false, message: 'Staff account not found' });
    }

    res.json({ success: true, message: 'Staff account approved successfully' });
  });
});

// Reject staff account
router.put('/staff/:id/reject', authenticateAdmin, (req, res) => {
  const { id } = req.params;

  db.run('UPDATE admins SET status = "rejected", updated_at = CURRENT_TIMESTAMP WHERE id = ? AND role != "Super Admin"',
    [id], function(err) {
    if (err) {
      return res.status(500).json({ success: false, message: 'Database error' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ success: false, message: 'Staff account not found' });
    }

    res.json({ success: true, message: 'Staff account rejected' });
  });
});

// Get all residents
router.get('/residents', authenticateAdmin, (req, res) => {
  const { page = 1, limit = 10, search } = req.query;
  const offset = (page - 1) * limit;

  let query = `SELECT id, username, email, full_name, address, contact_number,
               voter_status, account_status, created_at FROM residents`;
  let params = [];

  if (search) {
    query += ' WHERE full_name LIKE ? OR username LIKE ? OR email LIKE ?';
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  params.push(limit, offset);

  db.all(query, params, (err, residents) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Database error' });
    }

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM residents';
    let countParams = [];

    if (search) {
      countQuery += ' WHERE full_name LIKE ? OR username LIKE ? OR email LIKE ?';
      countParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    db.get(countQuery, countParams, (err, result) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Database error' });
      }

      res.json({
        success: true,
        data: residents,
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

// Update resident status
router.put('/residents/:id/status', authenticateAdmin, [
  body('status').isIn(['Active', 'Inactive']).withMessage('Status must be Active or Inactive')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const { id } = req.params;
  const { status } = req.body;

  db.run('UPDATE residents SET account_status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [status, id], function(err) {
    if (err) {
      return res.status(500).json({ success: false, message: 'Database error' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ success: false, message: 'Resident not found' });
    }

    res.json({ success: true, message: `Resident account ${status.toLowerCase()} successfully` });
  });
});

// Get service requests
router.get('/service-requests', authenticateAdmin, (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  let query = `SELECT sr.*, r.full_name as resident_name, r.email as resident_email,
               a.first_name || ' ' || a.last_name as processed_by_name
               FROM service_requests sr
               LEFT JOIN residents r ON sr.resident_id = r.id
               LEFT JOIN admins a ON sr.processed_by = a.id`;
  let params = [];

  if (status) {
    query += ' WHERE sr.status = ?';
    params.push(status);
  }

  query += ' ORDER BY sr.created_at DESC LIMIT ? OFFSET ?';
  params.push(limit, offset);

  db.all(query, params, (err, requests) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Database error' });
    }

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM service_requests';
    let countParams = [];

    if (status) {
      countQuery += ' WHERE status = ?';
      countParams.push(status);
    }

    db.get(countQuery, countParams, (err, result) => {
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

// Update service request status
router.put('/service-requests/:id', authenticateAdmin, [
  body('status').isIn(['Pending', 'Processing', 'Approved', 'Released', 'Rejected']).withMessage('Invalid status'),
  body('remarks').optional().isString()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const { id } = req.params;
  const { status, remarks } = req.body;
  const processedBy = req.user.id;

  db.run(`UPDATE service_requests SET status = ?, processed_by = ?, processed_date = CURRENT_TIMESTAMP,
          remarks = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
    [status, processedBy, remarks, id], function(err) {
    if (err) {
      return res.status(500).json({ success: false, message: 'Database error' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ success: false, message: 'Service request not found' });
    }

    res.json({ success: true, message: `Service request ${status.toLowerCase()} successfully` });
  });
});

module.exports = router;