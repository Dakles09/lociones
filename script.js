document.addEventListener('DOMContentLoaded', () => {
  const productListContainer = document.getElementById('product-list');

  // Cargar productos
  async function loadProducts() {
    if (!productListContainer) return;

    productListContainer.innerHTML = '<p class="text-center text-muted">Cargando nuestra colección...</p>';
    try {
      const response = await fetch('/.netlify/functions/products');
      if (!response.ok) throw new Error('No se pudieron cargar los productos.');
      
      const products = await response.json();

      if (products.length === 0) {
        productListContainer.innerHTML = '<p class="text-center text-muted">Aún no hay fragancias disponibles. ¡Vuelve pronto!</p>';
        return;
      }

      const allProductsHTML = products.map(product => `
        <div class="col-lg-4 col-md-6 mb-4">
          <div class="card h-100 product-card shadow-sm">
            <img src="${product.image_url}" class="card-img-top" alt="${product.name}">
            <div class="card-body">
              <h5 class="card-title">${product.name}</h5>
              <p class="card-text text-muted">${product.description}</p>
            </div>
          </div>
        </div>
      `).join('');

      productListContainer.innerHTML = allProductsHTML;

    } catch (error) {
      console.error('Error al cargar productos:', error);
      productListContainer.innerHTML = '<p class="text-center text-danger">Error al cargar la colección.</p>';
    }
  }

  loadProducts();

  try { feather.replace(); } catch (e) {}

  // Manejo del formulario de registro
  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = registerForm.querySelector('#register-name').value.trim();
      const email = registerForm.querySelector('#register-email').value.trim();
      const password = registerForm.querySelector('#register-password').value;
      const messageDiv = document.getElementById('register-message');
      messageDiv.textContent = 'Registrando...';

      try {
        const response = await fetch('/.netlify/functions/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password })
        });

        const result = await response.json();

        if (response.ok) {
          messageDiv.textContent = 'Registro exitoso. Ahora puedes iniciar sesión.';
          registerForm.reset();
        } else {
          messageDiv.textContent = result.message || 'Ocurrió un error al registrar.';
        }

      } catch (error) {
        console.error('Error en registro:', error);
        messageDiv.textContent = 'Error de conexión.';
      }
    });
  }

  // Manejo del formulario de login
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = loginForm.querySelector('#login-email').value.trim();
      const password = loginForm.querySelector('#login-password').value;
      const messageDiv = document.getElementById('login-message');
      messageDiv.textContent = 'Verificando...';

      try {
        const response = await fetch('/.netlify/functions/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        const result = await response.json();

        if (response.ok) {
          messageDiv.textContent = '¡Inicio de sesión exitoso!';
          loginForm.reset();
          // Aquí puedes redirigir o mostrar contenido especial
        } else {
          messageDiv.textContent = result.message || 'Credenciales incorrectas.';
        }

      } catch (error) {
        console.error('Error en login:', error);
        messageDiv.textContent = 'Error de conexión.';
      }
    });
  }
});
