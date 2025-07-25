const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // Opcional: configuración adicional para producción en serverless
    // max: 1, 
    // idleTimeoutMillis: 30000,
    // connectionTimeoutMillis: 2000,
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
            // **MEJORA:** Registrar el error real en los logs de Netlify
            console.error('Error de base de datos (GET):', error);
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
            // **MEJORA:** Registrar el error real en los logs de Netlify
            console.error('Error de base de datos (POST):', error);
            return { statusCode: 500, headers, body: JSON.stringify({ error: 'Error interno al crear el producto.' }) };
        }
    }

    return {
        statusCode: 405,
        headers,
        body: JSON.stringify({ error: 'Método no permitido' })
    };
};