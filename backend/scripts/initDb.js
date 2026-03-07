const { initDb } = require('../config/database');

async function initializeDatabase() {
  try {
    console.log('Initializing database...');
    await initDb();
    console.log('✅ Database initialized successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
}

initializeDatabase();