const { Pool } = require('pg');

// ✅ Línea temporal para depuración:
console.log("🌐 DATABASE_URL:", process.env.DATABASE_URL);

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
};

exports.handler = async (event) => {
    // GET: Devuelve todos los productos
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
            return { statusCode: 500, headers, body: JSON.stringify({ error: 'Error interno al obtener productos.' }) };
        }
    }

    // POST: Crea un nuevo producto
    if (event.httpMethod === 'POST') {
        try {
            const { name, description, image_url } = JSON.parse(event.body);
            if (!name || !description || !image_url) {
                return { statusCode: 400, headers, body: JSON.stringify({ error: 'Nombre, descripción e imagen son requeridos.' }) };
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
            return { statusCode: 500, headers, body: JSON.stringify({ error: 'Error interno al crear el producto.' }) };
        }
    }

    return {
        statusCode: 405,
        headers,
        body: JSON.stringify({ error: 'Método no permitido' })
    };
};
