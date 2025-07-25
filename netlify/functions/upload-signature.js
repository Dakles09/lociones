const cloudinary = require('cloudinary').v2;

// ✅ Verifica si las variables están presentes y muestra el estado en los logs
console.log("🔐 Cloudinary API Key cargada:", !!process.env.CLOUDINARY_API_KEY);
console.log("🔐 Cloudinary API Secret cargada:", !!process.env.CLOUDINARY_API_SECRET);
console.log("☁️ Cloud Name cargado:", !!process.env.CLOUDINARY_CLOUD_NAME);

// ⚠️ Validación rápida antes de continuar
if (!process.env.CLOUDINARY_API_SECRET || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_CLOUD_NAME) {
  console.error("❌ Error: Faltan variables de entorno de Cloudinary.");
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.handler = async (event) => {
  const timestamp = Math.floor(Date.now() / 1000);

  try {
    const signature = cloudinary.utils.api_sign_request(
      { timestamp },
      process.env.CLOUDINARY_API_SECRET
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ signature, timestamp }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // por si necesitas acceso desde frontend local
      },
    };

  } catch (error) {
    console.error("❌ Error al generar la firma:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'No se pudo generar la firma para la subida.' }),
    };
  }
};
