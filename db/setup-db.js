const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',       // Cambia si tu usuario es diferente
  host: 'localhost',      // O el host de tu base de datos remota
  database: 'lociones',   // Asegúrate de que esta base exista
  password: 'tu_contraseña', // Reemplaza con tu contraseña
  port: 5432              // Puerto por defecto de PostgreSQL
});

async function setupDatabase() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        role TEXT DEFAULT 'user'
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        image_url TEXT,
        price NUMERIC(10, 2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('✅ Tablas creadas correctamente');
  } catch (error) {
    console.error('❌ Error creando las tablas:', error);
  } finally {
    await pool.end();
  }
}

setupDatabase();
