const bcrypt = require('bcryptjs');
const { db } = require('../config/database');

// Wait for database to be ready
setTimeout(async () => {
  try {
    console.log('Seeding database with test users...');
    let completed = 0;

    // Create test admin account
    const adminPassword = await bcrypt.hash('admin123', 12);
    db.run(
      `INSERT OR REPLACE INTO admins (username, password, email, first_name, last_name, phone, position, employee_id, role, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        'admin',
        adminPassword,
        'admin@barangay.gov.ph',
        'Admin',
        'Account',
        '09123456789',
        'Administrator',
        'ADM001',
        'Super Admin',
        'approved'
      ],
      function(err) {
        if (err) {
          console.error('Error inserting admin:', err.message);
        } else {
          console.log('✅ Test admin account created (username: admin, password: admin123)');
        }
        completed++;
        if (completed === 2) {
          console.log('✅ Database seeding completed!');
          process.exit(0);
        }
      }
    );

    // Create test resident account
    const residentPassword = await bcrypt.hash('resident123', 12);
    db.run(
      `INSERT OR REPLACE INTO residents (username, password, email, full_name, address, contact_number, birthdate, gender, civil_status, account_status, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        'resident',
        residentPassword,
        'resident@barangay.gov.ph',
        'Test Resident',
        '123 Aduas Norte Street, Barangay Aduas Norte',
        '09987654321',
        '1990-01-15',
        'Male',
        'Single',
        'Active',
        'approved'
      ],
      function(err) {
        if (err) {
          console.error('Error inserting resident:', err.message);
        } else {
          console.log('✅ Test resident account created (username: resident, password: resident123)');
        }
        completed++;
        if (completed === 2) {
          console.log('✅ Database seeding completed!');
          process.exit(0);
        }
      }
    );
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}, 1500);
