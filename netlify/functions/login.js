// /netlify/functions/login.js
const sqlite3Login = require('sqlite3').verbose();
const pathLogin = require('path');
const bcryptLogin = require('bcrypt');

const dbLoginPath = pathLogin.resolve(__dirname, '../../db/users.db');
const dbLogin = new sqlite3Login.Database(dbLoginPath);

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Método no permitido' };
  }

  const { email, password } = JSON.parse(event.body);

  if (!email || !password) {
    return { statusCode: 400, body: JSON.stringify({ message: 'Todos los campos son requeridos.' }) };
  }

  return new Promise((resolve) => {
    dbLogin.get('SELECT * FROM users WHERE email = ?', [email], async (err, row) => {
      if (!row) {
        resolve({ statusCode: 401, body: JSON.stringify({ message: 'Usuario no encontrado.' }) });
      } else {
        const match = await bcryptLogin.compare(password, row.password);
        if (match) {
          resolve({ statusCode: 200, body: JSON.stringify({ message: 'Inicio de sesión exitoso.' }) });
        } else {
          resolve({ statusCode: 401, body: JSON.stringify({ message: 'Contraseña incorrecta.' }) });
        }
      }
    });
  });
};