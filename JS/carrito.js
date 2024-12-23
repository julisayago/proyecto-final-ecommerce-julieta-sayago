document.addEventListener("DOMContentLoaded", () => {
    cargarCarrito();

    const vaciarCarritoBtn = document.getElementById("vaciar-carrito");
    vaciarCarritoBtn?.addEventListener("click", vaciarCarrito);

    actualizarContadorCarrito();
    actualizarPrecioTotal();
});

function addProduct(event) {
    const button = event.target.closest("button");
    const productId = button.getAttribute("data-id");
    const productName = button.getAttribute("data-name");
    const productPrice = parseFloat(button.getAttribute("data-price"));

    const carrito = obtenerCarrito();
    const existingProduct = carrito.find((item) => item.id === productId);

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        carrito.push({ id: productId, name: productName, price: productPrice, quantity: 1 });
    }

    actualizarCarrito(carrito);
    mostrarMensajeExito("Producto agregado con éxito");
}

function obtenerCarrito() {
    return JSON.parse(localStorage.getItem("carrito")) || [];
}

function guardarCarrito(carrito) {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

function cargarCarrito() {
    actualizarVistaCarrito();
    actualizarContadorCarrito();
    actualizarPrecioTotal();
}

function actualizarVistaCarrito() {
    const listaCarrito = document.getElementById("lista-carrito");
    if (!listaCarrito) return;

    const carrito = obtenerCarrito();
    listaCarrito.innerHTML = carrito.map(item => `
        <li>
            <div class="producto-name">${item.name}</div>
            <div class="producto-quantity"><strong>| Cantidad:</strong> ${item.quantity}</div>
            <div class="producto-buttons">
                <button class="aumentar" data-id="${item.id}">+</button>
                <button class="disminuir" data-id="${item.id}">-</button>
                <button class="eliminar" data-id="${item.id}">Eliminar</button>
            </div>
            <div class="producto-price"><strong>Total del producto:</strong> $${(item.price * item.quantity)}</div>
        </li>
    `).join('');

    actualizarEventosBotones();
}

function actualizarEventosBotones() {
    document.querySelectorAll(".aumentar").forEach((button) => {
        button.addEventListener("click", (e) => modificarCantidad(e, 1));
    });
    document.querySelectorAll(".disminuir").forEach((button) => {
        button.addEventListener("click", (e) => modificarCantidad(e, -1));
    });
    document.querySelectorAll(".eliminar").forEach((button) => {
        button.addEventListener("click", eliminarProducto);
    });
}

function modificarCantidad(event, delta) {
    const productId = event.target.getAttribute("data-id");
    const carrito = obtenerCarrito();
    const product = carrito.find((item) => item.id === productId);

    if (product) {
        product.quantity += delta;
        if (product.quantity <= 0) eliminarProducto(event);
        else actualizarCarrito(carrito);
    }
}

function eliminarProducto(event) {
    const productId = event.target.getAttribute("data-id");
    const carrito = obtenerCarrito().filter((item) => item.id !== productId);
    actualizarCarrito(carrito);
}

function vaciarCarrito() {
    localStorage.removeItem("carrito");
    cargarCarrito();
}

function actualizarCarrito(carrito) {
    guardarCarrito(carrito);
    actualizarVistaCarrito();
    actualizarContadorCarrito();
    actualizarPrecioTotal();
}

function actualizarContadorCarrito() {
    const carrito = obtenerCarrito();
    const contador = carrito.reduce((acc, item) => acc + item.quantity, 0);
    const contadorElemento = document.getElementById("carrito-contador");
    if (contadorElemento) contadorElemento.textContent = contador;
}

function actualizarPrecioTotal() {
    const carrito = obtenerCarrito();
    const total = carrito.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const totalElemento = document.getElementById("precio-total");
    if (totalElemento) totalElemento.textContent = `Total: $${total.toFixed(2)}`;
}

function mostrarMensajeExito(mensaje) {
    const mensajeElemento = document.createElement("div");
    mensajeElemento.textContent = mensaje;
    mensajeElemento.classList.add("mensaje-exito");
    document.body.appendChild(mensajeElemento);
    setTimeout(() => mensajeElemento.remove(), 3000);
}
