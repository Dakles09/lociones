const cloudinary = require('cloudinary').v2;

// 👇 AÑADE ESTA LÍNEA PARA DEPURAR
// Esto te permite ver en los logs de Netlify si la variable se está cargando.
console.log("Función iniciada. ¿API Key cargada?", process.env.CLOUDINARY_API_KEY ? "Sí" : "No");

// Configura Cloudinary usando las variables de entorno
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.handler = async (event) => {
  const timestamp = Math.round((new Date()).getTime() / 1000);

  try {
    // Genera la firma segura usando el timestamp y tu API Secret
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp: timestamp,
      },
      cloudinary.config().api_secret
    );

    // Si todo va bien, devuelve la firma y el timestamp
    return {
      statusCode: 200,
      body: JSON.stringify({ signature, timestamp }),
    };

  } catch (error) {
    // Si hay un error, lo registra en los logs y devuelve un error 500
    console.error("Error al generar la firma:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'No se pudo generar la firma para la subida.' }),
    };
  }
};