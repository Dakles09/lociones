// admin.js

document.addEventListener('DOMContentLoaded', () => {
    const productForm = document.getElementById('add-product-form');
    const statusMessage = document.getElementById('status-message');

    if (productForm) {
        productForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            statusMessage.innerHTML = '<div class="alert alert-info">Procesando...</div>';

            try {
                const imageFile = document.getElementById('product-image-file').files[0];
                if (!imageFile) {
                    statusMessage.innerHTML = '<div class="alert alert-danger">Por favor, selecciona una imagen.</div>';
                    return;
                }

                statusMessage.innerHTML = '<div class="alert alert-info">Obteniendo firma para la subida...</div>';
                const signatureResponse = await fetch('/.netlify/functions/upload-signature');
                const { signature, timestamp } = await signatureResponse.json();

                const formData = new FormData();
                formData.append('file', imageFile);
                formData.append('timestamp', timestamp);
                formData.append('signature', signature);
                formData.append('api_key', '572478633839659'); // <-- Reemplaza con tu API Key real si cambia

                const cloudName = 'dketljaul';
                const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

                statusMessage.innerHTML = '<div class="alert alert-info">Subiendo imagen...</div>';
                const cloudinaryResponse = await fetch(cloudinaryUrl, { method: 'POST', body: formData });
                if (!cloudinaryResponse.ok) {
                    const errorData = await cloudinaryResponse.json();
                    throw new Error(`Error de Cloudinary: ${errorData.error.message}`);
                }
                
                const cloudinaryData = await cloudinaryResponse.json();
                const imageUrl = cloudinaryData.secure_url;

                statusMessage.innerHTML = '<div class="alert alert-info">Guardando producto...</div>';
                const name = document.getElementById('product-name').value;
                const description = document.getElementById('product-description').value;
                
                const dbResponse = await fetch('/.netlify/functions/products', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, description, image_url: imageUrl })
                });

                if (!dbResponse.ok) {
                    const errorData = await dbResponse.json();
                    throw new Error(errorData.error || 'El producto no se pudo guardar.');
                }

                statusMessage.innerHTML = '<div class="alert alert-success">¡Producto agregado con éxito!</div>';
                this.reset();

            } catch (error) {
                console.error('Error detallado:', error);
                statusMessage.innerHTML = `<div class="alert alert-danger">Error: ${error.message}</div>`;
            }
        });
    }
});
