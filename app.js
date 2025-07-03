const url = "http://localhost:3000/products";
const container = document.getElementById("products");
const form = document.getElementById("formAdd");
const nameInput = document.getElementById("name");
const priceInput = document.getElementById("price");

// Elementos del modal
const modal = document.getElementById("modal");
const formModal = document.getElementById("formModal");
const modalName = document.getElementById("modalName");
const modalPrice = document.getElementById("modalPrice");
const btnCancel = document.getElementById("btnCancel");

let productActual = null;

// Capitaliza el nombre (ej. "arRoZ" -> "Arroz")
function capitalizeName(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// Cargar productos
function uploadProducts() {
  console.log("Starting loading of products")
  fetch(url)
    .then(res => res.json())
    .then(products => {
      console.log("Loaded products")
      container.innerHTML = "";

      products.forEach(product => {
        const div = document.createElement("div");
        div.classList.add("product");

        div.innerHTML = `
          <p><strong>${product.name}</strong></p>
          <p>Price: $${product.price}</p>
          <p>ID: #${product.id}</p>
          <button class="edit">Edit</button>
          <button class="delete">Delete</button>`;

        // Botón eliminar
        div.querySelector(".delete").addEventListener("click", () => {
          fetch(`${url}/${product.id}`, {
            method: "DELETE"
          }).then(() => uploadProducts());
        });

        // Botón editar
        div.querySelector(".edit").addEventListener("click", () => {
          console.log(`Editing product: ${product.name}`)
          showModal(product);
        });

        container.appendChild(div);
      });
    })
    .catch(error => {
      console.error("Error loading products:", error);
      container.innerHTML = `<p class="error">Error loading products: ${error.message}</p>`;
    });
}

// Agregar producto nuevo
form.addEventListener("submit", async e => {
  e.preventDefault();

  let name = nameInput.value.trim();
  let price = parseFloat(priceInput.value);

  if (!name || isNaN(price) || price <= 0) {
    alert("Invalid name or price must be greater than 0.");
    return;
  }

  name = capitalizeName(name);
  console.log(`Validating new product: ${name}, $${price}`);

  // Validar producto repetido
  const response = await fetch(url);
  const products = await response.json();
  const exists = products.some(p => p.name.toLowerCase() === name.toLowerCase());

  if (exists) {
    alert("There is already a product with that name.");
    return;
  }

  console.log(`Create a new product: ${name}, $${price}`);
  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, price })
  })
    .then(() => {
      form.reset();
      uploadProducts();
    });
});

// Mostrar modal de edición
function showModal(product) {
  productActual = product;
  modalName.value = product.name;
  modalPrice.value = product.price;
  modal.classList.remove("hidden");
}

// Cancelar edición
btnCancel.addEventListener("click", () => {
  modal.classList.add("hidden");
  productActual = null;
});

// Guardar edición
formModal.addEventListener("submit", async e => {
  e.preventDefault();

  let newName = modalName.value.trim();
  let newPrice = parseFloat(modalPrice.value);

  if (!newName || isNaN(newPrice) || newPrice <= 0) {
    alert("Invalid name or price must be greater than 0");
    return;
  }

  newName = capitalizeName(newName);

  // Validar duplicado (excluyendo el mismo producto)
  const response = await fetch(url);
  const products = await response.json();
  const exists = products.some(p =>
    p.name.toLowerCase() === newName.toLowerCase() && p.id !== productActual.id
  );

  if (exists) {
    alert("There is already another product with that name.");
    return;
  }

  fetch(`${url}/${productActual.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: newName,
      price: newPrice
    })
  })
    .then(() => {
      modal.classList.add("hidden");
      productActual = null;
      uploadProducts();
    });
});

// Cargar productos al inicio
uploadProducts();
