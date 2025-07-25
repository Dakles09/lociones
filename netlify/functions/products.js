const { Pool } = require('pg');

// 🔧 Usa la variable correcta proporcionada por Neon para Netlify
const pool = new Pool({
    connectionString: process.env.NETLIFY_DATABASE_URL,
    ssl: { rejectUnauthorized: false }, // Requerido para conexiones seguras a Neon
    // max: 1, // Opcional para Netlify Functions
    // idleTimeoutMillis: 30000,
    // connectionTimeoutMillis: 2000,
});

const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
};

exports.handler = async (event) => {
    if (event.httpMethod === 'GET') {
        try {
            const { rows } = await pool.query('SELECT * FROM products ORDER BY id DESC');
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify(rows),
            };
        } catch (error) {
            console.error('❌ Error de base de datos (GET):', error);
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ error: 'Error interno al obtener productos.' })
            };
        }
    }

    if (event.httpMethod === 'POST') {
        try {
            const { name, description, image_url } = JSON.parse(event.body);

            if (!name || !description || !image_url) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'Nombre, descripción e imagen son requeridos.' })
                };
            }

            const query = 'INSERT INTO products(name, description, image_url) VALUES($1, $2, $3) RETURNING *';
            const values = [name, description, image_url];
            const { rows } = await pool.query(query, values);

            return {
                statusCode: 201,
                headers,
                body: JSON.stringify(rows[0]),
            };
        } catch (error) {
            console.error('❌ Error de base de datos (POST):', error);
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ error: 'Error interno al crear el producto.' })
            };
        }
    }

    return {
        statusCode: 405,
        headers,
        body: JSON.stringify({ error: 'Método no permitido' })
    };
};
