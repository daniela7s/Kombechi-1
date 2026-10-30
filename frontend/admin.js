const productosIniciales = [
  { id: 1, nombre: "Kombucha de fresa", categoria: "Kombucha", descripcion: "Bebida fermentada con sabor a fresa.", precio: 12000, imagen: "./assets/img/kbid1.png", destacado: true },
  { id: 2, nombre: "Kombucha cítrica", categoria: "Kombucha", descripcion: "Bebida fresca y burbujeante.", precio: 12000, imagen: "./assets/img/Kbid2.jpg", destacado: true },
  { id: 3, nombre: "Kéfir natural", categoria: "Kéfir", descripcion: "Kéfir artesanal de sabor suave.", precio: 10000, imagen: "./assets/img/Kbid3.jpg", destacado: true },
  { id: 4, nombre: "Kéfir de fresa", categoria: "Kéfir", descripcion: "Kéfir con un toque frutal.", precio: 10000, imagen: "./assets/img/Kbid5.jpg", destacado: false }
];

const productosGuardados = sessionStorage.getItem("kombechiProductos");
const productos = productosGuardados ? JSON.parse(productosGuardados) : productosIniciales;
const pedidosGuardados = sessionStorage.getItem("kombechiPedidos");
const pedidos = pedidosGuardados ? JSON.parse(pedidosGuardados) : [];
let productoEditado = null;

if (!productosGuardados) {
  sessionStorage.setItem("kombechiProductos", JSON.stringify(productos));
}

const acceso = document.querySelector("#acceso-admin");
const panel = document.querySelector("#panel-admin");
const formularioAcceso = document.querySelector("#formulario-acceso");
const formularioProducto = document.querySelector("#formulario-producto");
const listaProductos = document.querySelector("#lista-productos-admin");
const listaPedidos = document.querySelector("#lista-solicitudes-admin");

function mostrarProductos() {
  listaProductos.innerHTML = productos.map(function (producto) {
    return `
      <tr>
        <td>${producto.nombre}</td>
        <td>${producto.categoria}</td>
        <td>${producto.descripcion}</td>
        <td>$${producto.precio.toLocaleString("es-CO")}</td>
        <td class="acciones-tabla-producto">
          <button class="boton-secundario" type="button" data-editar="${producto.id}">Editar</button>
          <button class="boton-secundario" type="button" data-eliminar="${producto.id}">Eliminar</button>
        </td>
      </tr>
    `;
  }).join("");

  document.querySelector("#contador-productos").textContent = productos.length;
  document.querySelector("#contador-categorias").textContent =
    new Set(productos.map(function (producto) { return producto.categoria; })).size;
}

function mostrarPedidos() {
  document.querySelector("#contador-solicitudes").textContent = pedidos.filter(function (pedido) {
    return pedido.estado === "Pendiente";
  }).length;

  if (pedidos.length === 0) {
    listaPedidos.innerHTML = '<p class="nota-vacia">Todavía no hay pedidos de prueba.</p>';
    return;
  }

  listaPedidos.innerHTML = pedidos.map(function (pedido) {
    return `
      <article class="tarjeta-solicitud">
        <div class="encabezado-solicitud">
          <strong>${pedido.nombre} — ${pedido.producto} x ${pedido.cantidad}</strong>
          <span>${pedido.estado}</span>
        </div>
        <p>${pedido.correo} · ${pedido.telefono}</p>
        <p>${pedido.mensaje || "Sin mensaje adicional."}</p>
        <button class="boton-secundario" type="button" data-atender="${pedido.id}">
          Marcar como atendido
        </button>
        <button class="boton-secundario" type="button" data-borrar-pedido="${pedido.id}">
          Eliminar
        </button>
      </article>
    `;
  }).join("");
}

formularioAcceso.addEventListener("submit", function (evento) {
  evento.preventDefault();

  const correo = document.querySelector("#correo-admin").value;
  const clave = document.querySelector("#clave-admin").value;
  const estado = document.querySelector("#estado-acceso");

  if (correo === "admin@kombechi.com" && clave === "1234") {
    acceso.hidden = true;
    panel.hidden = false;
    estado.textContent = "Sesión de demostración iniciada.";
    mostrarProductos();
    mostrarPedidos();
  } else {
    estado.textContent = "Correo o contraseña incorrectos. Para probar: admin@kombechi.com / 1234";
  }
});

document.querySelector("#boton-cerrar-sesion").addEventListener("click", function () {
  panel.hidden = true;
  acceso.hidden = false;
  formularioAcceso.reset();
  document.querySelector("#estado-acceso").textContent = "Sesión cerrada.";
});

formularioProducto.addEventListener("submit", function (evento) {
  evento.preventDefault();

  const datos = new FormData(formularioProducto);
  const producto = {
    id: productoEditado === null ? Date.now() : productoEditado,
    nombre: datos.get("nombre"),
    categoria: datos.get("categoria"),
    descripcion: datos.get("descripcion"),
    precio: Number(datos.get("precio")),
    imagen: datos.get("imagen"),
    destacado: datos.has("destacado")
  };

  if (productoEditado === null) {
    productos.push(producto);
    document.querySelector("#estado-producto").textContent = "Producto agregado de prueba.";
  } else {
    const posicion = productos.findIndex(function (item) { return item.id === productoEditado; });
    productos[posicion] = producto;
    document.querySelector("#estado-producto").textContent = "Producto actualizado de prueba.";
  }

  sessionStorage.setItem("kombechiProductos", JSON.stringify(productos));

  productoEditado = null;
  formularioProducto.reset();
  document.querySelector("#boton-guardar-producto").textContent = "Agregar producto";
  document.querySelector("#boton-cancelar-edicion").hidden = true;
  mostrarProductos();
});

document.querySelector("#boton-cancelar-edicion").addEventListener("click", function () {
  productoEditado = null;
  formularioProducto.reset();
  document.querySelector("#boton-guardar-producto").textContent = "Agregar producto";
  document.querySelector("#boton-cancelar-edicion").hidden = true;
});

listaProductos.addEventListener("click", function (evento) {
  const idEditar = Number(evento.target.dataset.editar);
  const idEliminar = Number(evento.target.dataset.eliminar);

  if (idEditar) {
    const producto = productos.find(function (item) { return item.id === idEditar; });
    productoEditado = producto.id;
    formularioProducto.elements.nombre.value = producto.nombre;
    formularioProducto.elements.categoria.value = producto.categoria;
    formularioProducto.elements.descripcion.value = producto.descripcion;
    formularioProducto.elements.precio.value = producto.precio;
    formularioProducto.elements.imagen.value = producto.imagen;
    formularioProducto.elements.destacado.checked = producto.destacado;
    document.querySelector("#boton-guardar-producto").textContent = "Guardar cambios";
    document.querySelector("#boton-cancelar-edicion").hidden = false;
    formularioProducto.scrollIntoView({ behavior: "smooth" });
  }

  if (idEliminar) {
    const posicion = productos.findIndex(function (producto) { return producto.id === idEliminar; });
    productos.splice(posicion, 1);
    sessionStorage.setItem("kombechiProductos", JSON.stringify(productos));
    mostrarProductos();
  }
});

listaPedidos.addEventListener("click", function (evento) {
  const idAtender = Number(evento.target.dataset.atender);
  const idBorrar = Number(evento.target.dataset.borrarPedido);

  if (idAtender) {
    const pedido = pedidos.find(function (item) { return item.id === idAtender; });
    pedido.estado = "Atendido";
    sessionStorage.setItem("kombechiPedidos", JSON.stringify(pedidos));
    mostrarPedidos();
  }

  if (idBorrar) {
    const posicion = pedidos.findIndex(function (item) { return item.id === idBorrar; });
    pedidos.splice(posicion, 1);
    sessionStorage.setItem("kombechiPedidos", JSON.stringify(pedidos));
    mostrarPedidos();
  }
});

mostrarProductos();
mostrarPedidos();
