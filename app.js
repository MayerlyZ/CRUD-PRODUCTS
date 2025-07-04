const url = "http://localhost:3000/products"; //URL API
const container = document.getElementById("products"); //Contenedor donde se mostraran los productos
const form = document.getElementById("formAdd");//form para agregar productos
const nameInput = document.getElementById("name");
const priceInput = document.getElementById("price");

// Elementos del modal (Ventana que se abre al hacer click al boton editar)
const modal = document.getElementById("modal");
const formModal = document.getElementById("formModal");
const modalName = document.getElementById("modalName");
const modalPrice = document.getElementById("modalPrice");
const btnCancel = document.getElementById("btnCancel");

let productActual = null; // Variable para guardar el productoo que se esta editando

// Capitaliza el nombre 
function capitalizeName(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase(); //Toma la primera letra en mayus y el resto en min
}

// Cargar productos
function uploadProducts() {
  console.log("Starting loading of products")
  fetch(url) //Solicita los productos al servidor 
    .then(res => res.json()) // Convierte la respuesta a JSON
    .then(products => {
      console.log("Loaded products") 
      container.innerHTML = ""; // Limpia el contenedor

      products.forEach(product => { // Recorre cada producto
        const div = document.createElement("div"); // Crea un div para el producto
        div.classList.add("product"); // Agrega la clase "product"

        // Agrega el contenido HTML del producto
        div.innerHTML = `
          <p><strong>${product.name}</strong></p>
          <p>Price: $${product.price}</p>
          <p>ID: #${product.id}</p>
          <button class="edit">Edit</button>
          <button class="delete">Delete</button>`;

        // Botón eliminar
        div.querySelector(".delete").addEventListener("click", () => {
          // Elimina el producto al hacer click
          fetch(`${url}/${product.id}`, {
            method: "DELETE"
          }).then(() => uploadProducts()); // Recarga los productos después de eliminar
        });

        // Botón editar
        div.querySelector(".edit").addEventListener("click", () => {
          console.log(`Editing product: ${product.name}`) // Mensaje en consola
          showModal(product); // Muestra el modal de edición
        });

        container.appendChild(div); // Agrega el div al contenedor
      });
    })
    .catch(error => {
      // Si hay error, lo muestra en consola y en la página
      console.error("Error loading products:", error);
      container.innerHTML = `<p class="error">Error loading products: ${error.message}</p>`;
    });
}

// Agregar producto nuevo
form.addEventListener("submit", async e => {
  e.preventDefault(); // Evita que el formulario recargue la página

  let name = nameInput.value.trim(); // Obtiene y limpia el nombre
  let price = parseFloat(priceInput.value); // Convierte el precio a número

  // Valida que el nombre no esté vacío y el precio sea válido
  if (!name || isNaN(price) || price <= 0) {
    alert("Invalid name or price must be greater than 0.");
    return;
  }

  name = capitalizeName(name); // Capitaliza el nombre
  console.log(`Validating new product: ${name}, $${price}`); // Mensaje en consola

  // Validar producto repetido
  const response = await fetch(url); // Solicita los productos actuales
  const products = await response.json(); // Convierte la respuesta a JSON
  const exists = products.some(p => p.name.toLowerCase() === name.toLowerCase()); // Verifica si ya existe

  if (exists) {
    alert("There is already a product with that name."); // Alerta si ya existe
    return;
  }

  console.log(`Create a new product: ${name}, $${price}`); 
  fetch(url, {
    method: "POST", // Método para crear
    headers: { "Content-Type": "application/json" }, // Indica que es JSON
    body: JSON.stringify({ name, price }) // Envía el producto
  })
    .then(() => {
      form.reset(); // Limpia el formulario
      uploadProducts(); // Recarga los productos llamando a la funcion 
    });
});

// Mostrar modal de edición
function showModal(product) {
  productActual = product; // Guarda el producto actual
  modalName.value = product.name; 
  modalPrice.value = product.price; 
  modal.classList.remove("hidden"); 
}

// Cancelar edición
btnCancel.addEventListener("click", () => {
  modal.classList.add("hidden"); // Oculta el modal
  productActual = null; // Limpia el producto actual
});

// Guardar edición
formModal.addEventListener("submit", async e => {
  e.preventDefault(); // Evita recarga

  let newName = modalName.value.trim(); // Obtiene y limpia el nuevo nombre
  let newPrice = parseFloat(modalPrice.value); // Convierte el nuevo precio

  // Valida los datos
  if (!newName || isNaN(newPrice) || newPrice <= 0) {
    alert("Invalid name or price must be greater than 0");
    return;
  }

  newName = capitalizeName(newName); // Capitaliza el nombre

  // Validar duplicado (excluyendo el mismo producto)
  const response = await fetch(url); // Solicita los productos
  const products = await response.json(); // Convierte a JSON
  const exists = products.some(p =>
    p.name.toLowerCase() === newName.toLowerCase() && p.id !== productActual.id  // Verifica si existe otro con el mismo nombre
  ); 

  if (exists) {
    alert("There is already another product with that name."); // Alerta si existe duplicado
    return;
  }

  fetch(`${url}/${productActual.id}`, {
    method: "PUT", // Método para actualizar
    headers: { "Content-Type": "application/json" }, // Indica que es JSON
    body: JSON.stringify({
      name: newName,
      price: newPrice
    }) // Envía los nuevos datos
  })
    .then(() => {
      modal.classList.add("hidden"); // Oculta el modal
      productActual = null; // Limpia el producto actual
      uploadProducts(); // Recarga los productos
    });
});

// Cargar productos al inicio
uploadProducts(); // Llama a la función para mostrar los productos al cargar la página