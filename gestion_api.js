// OBTENER PRODUCTOS DISPONIBLES
fetch('http://localhost:3000/products')
  .then(response => response.json())
  .then(data => console.log("Products available:", data))
  .catch(error => console.error("Error getting product:", error));

// CREACIÓN DE NUEVO PRODUCTO sin ID manual
const newProduct = { name: "Monitor", price: 500 };

fetch('http://localhost:3000/products', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(newProduct)
})
  .then(response => response.json())
  .then(data => {
    console.log("Product add:", data);
    
    // ACTUALIZACIÓN USANDO EL ID QUE RECIBÍ
    const updateProduct = { name: "Monitor Pro", price: 750 };
    
    fetch(`http://localhost:3000/products/${data.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateProduct)
    })
    .then(response => response.json())
    .then(updated => console.log("Updated product:", updated))
    .catch(error => console.error("Error updating product:", error));

    // ELIMINACIÓN USANDO EL MISMO ID 
    fetch(`http://localhost:3000/products/${data.id}`, {
      method: 'DELETE'
    })
    .then(response => {
      if (!response.ok) throw new Error('Could not delete');
      console.log("Product removed:", data.id);
    })
    .catch(error => console.error("Error when deleting product:", error));
  })
  .catch(error => console.error("Error adding producto:", error));

// VALIDACIÓN DE PRODUCTO
function validateProduct(product) {
  if (!product.name || typeof product.price !== "number") {
    console.error("Invalid product data");
    return false;
  }
  return true;
}
