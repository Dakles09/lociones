const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs'); // ← cambiado aquí

const dbPath = path.resolve(__dirname, '../../db/users.db');
const db = new sqlite3.Database(dbPath);

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Método no permitido' };
  }

  const { name, email, password } = JSON.parse(event.body);

  if (!name || !email || !password) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Todos los campos son requeridos.' }),
    };
  }

  return new Promise((resolve) => {
    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, row) => {
      if (row) {
        resolve({ statusCode: 409, body: JSON.stringify({ message: 'El usuario ya existe.' }) });
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        db.run(
          'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
          [name, email, hashedPassword],
          (insertErr) => {
            if (insertErr) {
              resolve({ statusCode: 500, body: JSON.stringify({ message: 'Error al registrar usuario.' }) });
            } else {
              resolve({ statusCode: 200, body: JSON.stringify({ message: 'Usuario registrado correctamente.' }) });
            }
          }
        );
      }
    });
  });
};
