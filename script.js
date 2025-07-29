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

  // Reemplazar íconos de Feather
  try {
    feather.replace();
  } catch (e) {}
});
