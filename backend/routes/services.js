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

// Get all services
router.get('/', authenticateAdmin, (req, res) => {
  db.all('SELECT * FROM services ORDER BY name', [], (err, services) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Database error' });
    }

    res.json({ success: true, data: services });
  });
});

// Get active services (public)
router.get('/active', (req, res) => {
  db.all('SELECT id, name, description, requirements, processing_time, fee FROM services WHERE is_active = 1 ORDER BY name',
    [], (err, services) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Database error' });
    }

    res.json({ success: true, data: services });
  });
});

// Create service
router.post('/', authenticateAdmin, [
  body('name').notEmpty().withMessage('Service name is required'),
  body('description').optional().isString(),
  body('requirements').optional().isString(),
  body('processingTime').optional().isString(),
  body('fee').optional().isFloat({ min: 0 }).withMessage('Fee must be a positive number')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const { name, description, requirements, processingTime, fee } = req.body;

  db.run(`INSERT INTO services (name, description, requirements, processing_time, fee)
          VALUES (?, ?, ?, ?, ?)`,
    [name, description, requirements, processingTime, fee], function(err) {
    if (err) {
      if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        return res.status(409).json({ success: false, message: 'Service name already exists' });
      }
      return res.status(500).json({ success: false, message: 'Failed to create service' });
    }

    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      data: {
        id: this.lastID,
        name,
        description,
        requirements,
        processingTime,
        fee
      }
    });
  });
});

// Update service
router.put('/:id', authenticateAdmin, [
  body('name').optional().notEmpty().withMessage('Service name cannot be empty'),
  body('description').optional().isString(),
  body('requirements').optional().isString(),
  body('processingTime').optional().isString(),
  body('fee').optional().isFloat({ min: 0 }).withMessage('Fee must be a positive number'),
  body('isActive').optional().isBoolean()
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
  const { name, description, requirements, processingTime, fee, isActive } = req.body;

  // Build update query dynamically
  const updates = [];
  const params = [];

  if (name !== undefined) {
    updates.push('name = ?');
    params.push(name);
  }
  if (description !== undefined) {
    updates.push('description = ?');
    params.push(description);
  }
  if (requirements !== undefined) {
    updates.push('requirements = ?');
    params.push(requirements);
  }
  if (processingTime !== undefined) {
    updates.push('processing_time = ?');
    params.push(processingTime);
  }
  if (fee !== undefined) {
    updates.push('fee = ?');
    params.push(fee);
  }
  if (isActive !== undefined) {
    updates.push('is_active = ?');
    params.push(isActive ? 1 : 0);
  }

  if (updates.length === 0) {
    return res.status(400).json({ success: false, message: 'No fields to update' });
  }

  params.push(id);
  const query = `UPDATE services SET ${updates.join(', ')} WHERE id = ?`;

  db.run(query, params, function(err) {
    if (err) {
      if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        return res.status(409).json({ success: false, message: 'Service name already exists' });
      }
      return res.status(500).json({ success: false, message: 'Database error' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    res.json({ success: true, message: 'Service updated successfully' });
  });
});

// Delete service
router.delete('/:id', authenticateAdmin, (req, res) => {
  const { id } = req.params;

  // Check if service has associated requests
  db.get('SELECT COUNT(*) as count FROM service_requests WHERE service_name = (SELECT name FROM services WHERE id = ?)',
    [id], (err, result) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Database error' });
    }

    if (result.count > 0) {
      return res.status(409).json({
        success: false,
        message: 'Cannot delete service with existing requests. Deactivate it instead.'
      });
    }

    db.run('DELETE FROM services WHERE id = ?', [id], function(err) {
      if (err) {
        return res.status(500).json({ success: false, message: 'Database error' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ success: false, message: 'Service not found' });
      }

      res.json({ success: true, message: 'Service deleted successfully' });
    });
  });
});

module.exports = router;