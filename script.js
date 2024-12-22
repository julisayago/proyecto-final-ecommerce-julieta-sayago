document.addEventListener("DOMContentLoaded", () => {
    const productContainer = document.getElementById('productos-container');
    console.log("Product container:", productContainer);

    if (!productContainer) {
        console.error("No se encontró el contenedor de productos en el DOM.");
        return;
    }

    listProducts(productContainer);
});

function listProducts(productContainer) {
    fetch('/Data/productos.json')
        .then((response) => {
            console.log("Response:", response);
            if (!response.ok) {
                throw new Error('Error al cargar el archivo JSON');
            }
            return response.json();
        })
        .then((products) => {
            console.log(products);
            products.forEach((product) => {
                const productCard = `
                <div class="producto">
                    <img src="${product.imagen}" alt="${product.nombre}">
                    <h3>${product.nombre}</h3>
                    <p>$${product.precio}</p>
                    <button id="agregarButton" 
                        data-id="${product.id}" 
                        data-name="${product.nombre}" 
                        data-price="${product.precio}" 
                        onclick="addProduct(event)">
                        Agregar al carrito <i class="fas fa-shopping-cart"></i>
                    </button>
                    <button id="verMasButton" 
                        data-id="${product.id}" 
                        data-name="${product.nombre}" 
                        data-description="${product.descripcion}" 
                        data-price="${product.precio}"
                        onclick="verMas(event)">
                        Ver más
                    </button>
                </div>`;
                productContainer.innerHTML += productCard;
            });
        })
}

function verMas(event) {
    const button = event.target;
    const productName = button.getAttribute('data-name');
    const productDescription = button.getAttribute('data-description');

    const modal = document.getElementById('modal');
    const modalHeader = document.getElementById('modal-header');
    const modalBody = document.getElementById('modal-body');

    modalHeader.textContent = productName;
    modalBody.innerHTML = `
    <p>${productDescription}</p>
`;
    modal.style.display = "block";
}

document.getElementById('close-modal').addEventListener('click', () => {
    const modal = document.getElementById('modal');
    modal.style.display = "none";
});
