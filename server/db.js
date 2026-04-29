const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'perkeso_db',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
});

const createDatabaseIfNotExists = async () => {
  const dbName = process.env.DB_NAME || 'perkeso_db';
  const adminPool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    port: process.env.DB_PORT || 5432,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
  });

  try {
    const result = await adminPool.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [dbName]
    );
    if (result.rowCount === 0) {
      await adminPool.query(`CREATE DATABASE "${dbName}"`);
      console.log(`Database "${dbName}" created successfully.`);
    } else {
      console.log(`Database "${dbName}" already exists.`);
    }
  } catch (err) {
    console.error('Error checking/creating database:', err);
  } finally {
    await adminPool.end();
  }
};

const initDB = async () => {
  await createDatabaseIfNotExists();

  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS proposals (
        id SERIAL PRIMARY KEY,
        tajuk TEXT,
        tarikh_tempat TEXT,
        masa TEXT,
        pengenalan TEXT,
        kehadiran TEXT,
        jenis_aktiviti TEXT,
        kumpulan_sasaran TEXT,
        penceramah TEXT,
        tentatif_program TEXT,
        kos_perbelanjaan NUMERIC,
        lain_lain_perbelanjaan NUMERIC,
        implikasi_anggota TEXT,
        roi_kuantitatif TEXT,
        disediakan_oleh TEXT,
        tarikh_disediakan TEXT,
        disemak_oleh TEXT,
        tarikh_disemak TEXT,
        bajet_disokong NUMERIC,
        kod_bajet TEXT,
        disahkan_oleh TEXT,
        tarikh_disahkan TEXT,
        diluluskan_oleh TEXT,
        tarikh_lulus TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS objectives (
        id SERIAL PRIMARY KEY,
        proposal_id INTEGER REFERENCES proposals(id) ON DELETE CASCADE,
        objective_text TEXT
      );

      CREATE TABLE IF NOT EXISTS attachments (
        id SERIAL PRIMARY KEY,
        proposal_id INTEGER REFERENCES proposals(id) ON DELETE CASCADE,
        file_name TEXT,
        file_path TEXT,
        file_type TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("Database tables initialized successfully.");
  } catch (err) {
    console.error("Error initializing database tables:", err);
  }
};

module.exports = {
  query: (text, params) => pool.query(text, params),
  initDB,
  pool
};
