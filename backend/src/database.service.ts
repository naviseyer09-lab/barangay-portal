import { Injectable, OnModuleInit } from '@nestjs/common';
import * as sqlite3 from 'sqlite3';
import * as path from 'path';

@Injectable()
export class DatabaseService implements OnModuleInit {
  private db: sqlite3.Database;

  onModuleInit() {
    this.initDatabase();
  }

  private initDatabase() {
    const dbPath = path.join(__dirname, '..', 'database.sqlite');
    this.db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Error opening database:', err.message);
      } else {
        console.log('Connected to SQLite database.');
      }
    });

    // Enable foreign keys
    this.db.run('PRAGMA foreign_keys = ON');

    this.createTables();
  }

  private createTables() {
    // Create admins table
    this.db.run(`
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
    `);

    // Create residents table
    this.db.run(`
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
        status TEXT DEFAULT 'pending',
        profile_picture TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create announcements table
    this.db.run(`
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
    `);

    // Create services table
    this.db.run(`
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
    `);

    // Create service_requests table
    this.db.run(`
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
    `);

    // Insert default services if not exist
    this.insertDefaultServices();
  }

  private insertDefaultServices() {
    const defaultServices = [
      {
        name: 'Barangay Clearance',
        description: 'Certificate of Barangay Clearance',
        requirements: 'Valid ID, Proof of address',
        processing_time: '1-2 business days',
        fee: 50.00
      },
      {
        name: 'Barangay Certificate',
        description: 'Certificate of Residency/Indigency',
        requirements: 'Valid ID, Proof of address',
        processing_time: '1 business day',
        fee: 30.00
      },
      {
        name: 'Business Permit',
        description: 'Barangay Business Permit',
        requirements: 'DTI Registration, Valid ID',
        processing_time: '3-5 business days',
        fee: 100.00
      }
    ];

    defaultServices.forEach(service => {
      this.db.get('SELECT id FROM services WHERE name = ?', [service.name], (err, row) => {
        if (!row) {
          this.db.run(
            'INSERT INTO services (name, description, requirements, processing_time, fee) VALUES (?, ?, ?, ?, ?)',
            [service.name, service.description, service.requirements, service.processing_time, service.fee]
          );
        }
      });
    });
  }

  getDb(): sqlite3.Database {
    return this.db;
  }

  query(sql: string, params: any[] = []): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  queryOne(sql: string, params: any[] = []): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  run(sql: string, params: any[] = []): Promise<{ lastID: number; changes: number }> {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ lastID: this.lastID, changes: this.changes });
        }
      });
    });
  }
}
