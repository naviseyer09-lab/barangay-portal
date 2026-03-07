const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database path
const dbPath = path.join(__dirname, '..', 'database.sqlite');

// Create database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
  }
});

// Enable foreign keys
db.run('PRAGMA foreign_keys = ON');

// Database initialization
const initDb = () => {
  return new Promise((resolve, reject) => {
    // Create admins table
    db.run(`
      CREATE TABLE IF NOT EXISTS admins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        phone TEXT,
        position TEXT,
        employee_id TEXT UNIQUE,
        role TEXT DEFAULT 'Staff',
        status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) {
        console.error('Error creating admins table:', err.message);
        reject(err);
        return;
      }
      console.log('Admins table ready.');
    });

    // Create residents table
    db.run(`
      CREATE TABLE IF NOT EXISTS residents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        full_name TEXT NOT NULL,
        address TEXT NOT NULL,
        contact_number TEXT NOT NULL,
        birthdate DATE,
        gender TEXT,
        civil_status TEXT,
        voter_status TEXT DEFAULT 'Not Registered',
        account_status TEXT DEFAULT 'Active',
        profile_picture TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) {
        console.error('Error creating residents table:', err.message);
        reject(err);
        return;
      }
      console.log('Residents table ready.');
    });

    // Create announcements table
    db.run(`
      CREATE TABLE IF NOT EXISTS announcements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        full_content TEXT,
        status TEXT DEFAULT 'Draft',
        created_by INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (created_by) REFERENCES admins (id)
      )
    `, (err) => {
      if (err) {
        console.error('Error creating announcements table:', err.message);
        reject(err);
        return;
      }
      console.log('Announcements table ready.');
    });

    // Create services table
    db.run(`
      CREATE TABLE IF NOT EXISTS services (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        requirements TEXT,
        processing_time TEXT,
        fee DECIMAL(10,2) DEFAULT 0,
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) {
        console.error('Error creating services table:', err.message);
        reject(err);
        return;
      }
      console.log('Services table ready.');
    });

    // Create service_requests table
    db.run(`
      CREATE TABLE IF NOT EXISTS service_requests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        resident_id INTEGER NOT NULL,
        service_name TEXT NOT NULL,
        purpose TEXT,
        status TEXT DEFAULT 'Pending',
        otp_code TEXT,
        estimated_processing TEXT,
        processed_by INTEGER,
        processed_date DATETIME,
        remarks TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (resident_id) REFERENCES residents (id),
        FOREIGN KEY (processed_by) REFERENCES admins (id)
      )
    `, (err) => {
      if (err) {
        console.error('Error creating service_requests table:', err.message);
        reject(err);
        return;
      }
      console.log('Service requests table ready.');
    });

    // Insert default services
    const defaultServices = [
      {
        name: 'Barangay Clearance',
        description: 'Official document certifying good conduct and residency',
        requirements: 'Valid ID, Proof of residency, Birth certificate',
        processing_time: '1-2 business days',
        fee: 50.00
      },
      {
        name: 'Certificate of Indigency',
        description: 'Document certifying financial status for government assistance',
        requirements: 'Valid ID, Proof of income, Community tax certificate',
        processing_time: '1 business day',
        fee: 25.00
      },
      {
        name: 'Business Permit',
        description: 'Permit to operate a business within the barangay',
        requirements: 'DTI registration, Valid ID, Proof of address',
        processing_time: '3-5 business days',
        fee: 150.00
      }
    ];

    const insertService = (service) => {
      return new Promise((resolve, reject) => {
        db.run(`
          INSERT OR IGNORE INTO services (name, description, requirements, processing_time, fee)
          VALUES (?, ?, ?, ?, ?)
        `, [service.name, service.description, service.requirements, service.processing_time, service.fee], function(err) {
          if (err) {
            reject(err);
          } else {
            resolve(this.lastID);
          }
        });
      });
    };

    // Insert default services after all tables are created
    setTimeout(() => {
      Promise.all(defaultServices.map(insertService))
        .then(() => {
          console.log('Default services inserted.');
          resolve();
        })
        .catch(reject);
    }, 100);
  });
};

module.exports = { db, initDb };