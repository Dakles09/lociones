const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs'); // ← cambiado aquí

const dbPath = path.resolve(__dirname, '../../db/users.db');
const db = new sqlite3.Database(dbPath);

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Método no permitido' };
  }

  const { email, password } = JSON.parse(event.body);

  if (!email || !password) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Todos los campos son requeridos.' }),
    };
  }

  return new Promise((resolve) => {
    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, row) => {
      if (!row) {
        resolve({ statusCode: 401, body: JSON.stringify({ message: 'Usuario no encontrado.' }) });
      } else {
        const match = await bcrypt.compare(password, row.password);
        if (match) {
          resolve({ statusCode: 200, body: JSON.stringify({ message: 'Inicio de sesión exitoso.' }) });
        } else {
          resolve({ statusCode: 401, body: JSON.stringify({ message: 'Contraseña incorrecta.' }) });
        }
      }
    });
  });
};
