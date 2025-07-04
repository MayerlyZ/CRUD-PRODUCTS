// OBTENER PRODUCTOS DISPONIBLES
fetch('http://localhost:3000/products') // Hace una petición GET para obtener los productos
  .then(response => response.json()) // Convierte la respuesta a formato JSON
  .then(data => console.log("Products available:", data)) 
  .catch(error => console.error("Error getting product:", error)); 

// CREACIÓN DE NUEVO PRODUCTO sin ID manual
const newProduct = { name: "Monitor", price: 500 }; 

fetch('http://localhost:3000/products', { // Hace una petición POST para crear el producto
  method: 'POST', // Especifica el método HTTP POST
  headers: { 'Content-Type': 'application/json' }, // Indica que el cuerpo de la petición es JSON
  body: JSON.stringify(newProduct) // Convierte el objeto producto a una cadena JSON
})
  .then(response => response.json()) // Convierte la respuesta a JSON.
  .then(data => { 
    console.log("Product add:", data); 
    
    // ACTUALIZACIÓN USANDO EL ID QUE RECIBÍ
    const updateProduct = { name: "Monitor Pro", price: 750 }; // Define los nuevos datos para actualizar el producto
    
    fetch(`http://localhost:3000/products/${data.id}`, { // Hace una petición PUT para actualizar el producto usando el ID que recibe
      method: 'PUT', // Especifica el método PUT
      headers: { 'Content-Type': 'application/json' }, // Indica que el cuerpo es JSON
      body: JSON.stringify(updateProduct) // Convierte el objeto actualizado a JSON
    })
    .then(response => response.json()) // Convierte la respuesta a JSON
    .then(updated => console.log("Updated product:", updated)) 
    .catch(error => console.error("Error updating product:", error)); 

    // ELIMINACIÓN USANDO EL MISMO ID 
    fetch(`http://localhost:3000/products/${data.id}`, { // Hace una petición DELETE para eliminar el producto usando el ID
      method: 'DELETE' // Especifica el método DELETE.
    })
    .then(response => {
      if (!response.ok) throw new Error('Could not delete'); // Si la respuesta no es exitosa lanza un error
      console.log("Product removed:", data.id); 
    })
    .catch(error => console.error("Error when deleting product:", error)); // Muestra un error si la eliminación falla
  })
  .catch(error => console.error("Error adding producto:", error)); // Muestra un error si la creación falla

// VALIDACIÓN DE PRODUCTO
function validateProduct(product) { 
  if (!product.name || typeof product.price !== "number") { // Verifica que tenga nombre y que el precio sea un número
    console.error("Invalid product data"); 
    return false; // Retorna falso si la validación falla
  }
  return true; // Retorna verdadero si el producto es válido
}