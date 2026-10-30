const productosIniciales = [
  {
    nombre: "Kombucha de fresa",
    categoria: "Kombucha",
    descripcion: "Bebida fermentada con sabor a fresa.",
    precio: 12000,
    imagen: "./assets/img/kbid1.png",
    destacado: true
  },
  {
    nombre: "Kombucha cítrica",
    categoria: "Kombucha",
    descripcion: "Bebida fresca y burbujeante.",
    precio: 12000,
    imagen: "./assets/img/Kbid2.jpg",
    destacado: true
  },
  {
    nombre: "Kéfir natural",
    categoria: "Kéfir",
    descripcion: "Kéfir artesanal de sabor suave.",
    precio: 10000,
    imagen: "./assets/img/Kbid3.jpg",
    destacado: true
  },
  {
    nombre: "Kéfir de fresa",
    categoria: "Kéfir",
    descripcion: "Kéfir con un toque frutal.",
    precio: 10000,
    imagen: "./assets/img/Kbid5.jpg",
    destacado: false
  }
];

const productosGuardados = sessionStorage.getItem("kombechiProductos");
let productos = productosGuardados ? JSON.parse(productosGuardados) : productosIniciales;

if (!productosGuardados) {
  sessionStorage.setItem("kombechiProductos", JSON.stringify(productos));
}

const catalogo = document.querySelector("#cuadricula-productos");
const destacados = document.querySelector("#cuadricula-destacados");
const buscador = document.querySelector("#buscador-productos");
const filtroCategoria = document.querySelector("#filtro-categoria");
const ordenProductos = document.querySelector("#orden-productos");
const estadoCatalogo = document.querySelector("#estado-catalogo");

function crearTarjeta(producto, esDestacado) {
  let claseTarjeta = "tarjeta-producto";
  let claseImagen = "imagen-producto";
  let claseInfo = "info-producto";
  let claseBoton = "boton-tarjeta";

  if (esDestacado) {
    claseTarjeta = "tarjeta-destacada";
    claseImagen = "imagen-destacada";
    claseInfo = "info-destacada";
    claseBoton = "boton-destacado";
  }

  return `
    <article class="${claseTarjeta}">
      <div class="${claseImagen}">
        <img src="${producto.imagen}" alt="${producto.nombre}" loading="lazy">
        <span class="etiqueta-producto">${producto.categoria}</span>
      </div>
      <div class="${claseInfo}">
        <div class="fila-destacada">
          <h3>${producto.nombre}</h3>
          <span class="precio">$${producto.precio.toLocaleString("es-CO")}</span>
        </div>
        <p class="descripcion-producto">${producto.descripcion}</p>
      </div>
      <button class="${claseBoton}" type="button" data-producto="${producto.nombre}">
        Pedir este producto
      </button>
    </article>
  `;
}

function mostrarProductos() {
  const texto = buscador.value.toLowerCase();
  const categoria = filtroCategoria.value;

  let productosFiltrados = productos.filter(function (producto) {
    const coincideTexto = producto.nombre.toLowerCase().includes(texto);
    const coincideCategoria = categoria === "" || producto.categoria === categoria;

    return coincideTexto && coincideCategoria;
  });

  if (ordenProductos.value === "nombre") {
    productosFiltrados.sort(function (a, b) {
      return a.nombre.localeCompare(b.nombre);
    });
  }

  if (ordenProductos.value === "precio-menor-mayor") {
    productosFiltrados.sort(function (a, b) {
      return a.precio - b.precio;
    });
  }

  if (ordenProductos.value === "precio-mayor-menor") {
    productosFiltrados.sort(function (a, b) {
      return b.precio - a.precio;
    });
  }

  if (ordenProductos.value === "destacados") {
    productosFiltrados.sort(function (a, b) {
      return b.destacado - a.destacado;
    });
  }

  if (productosFiltrados.length === 0) {
    catalogo.innerHTML = '<p class="sin-resultados">No encontramos productos.</p>';
  } else {
    catalogo.innerHTML = productosFiltrados
      .map(function (producto) {
        return crearTarjeta(producto, false);
      })
      .join("");
  }

  estadoCatalogo.textContent = productosFiltrados.length + " productos";

  const listaDestacados = productos.filter(function (producto) {
    return producto.destacado;
  });

  destacados.innerHTML = listaDestacados
    .slice(0, 3)
    .map(function (producto) {
      return crearTarjeta(producto, true);
    })
    .join("");
}

buscador.addEventListener("input", mostrarProductos);
filtroCategoria.addEventListener("change", mostrarProductos);
ordenProductos.addEventListener("change", mostrarProductos);

catalogo.addEventListener("click", function (evento) {
  const boton = evento.target.closest("[data-producto]");

  if (boton) {
    document.querySelector("#producto-seleccionado").value = boton.dataset.producto;
    document.querySelector("#contacto").scrollIntoView({ behavior: "smooth" });
  }
});

destacados.addEventListener("click", function (evento) {
  const boton = evento.target.closest("[data-producto]");

  if (boton) {
    document.querySelector("#producto-seleccionado").value = boton.dataset.producto;
    document.querySelector("#contacto").scrollIntoView({ behavior: "smooth" });
  }
});

const formulario = document.querySelector("#formulario-contacto");

formulario.addEventListener("submit", function (evento) {
  evento.preventDefault();

  const datos = new FormData(formulario);
  const pedido = {
    id: Date.now(),
    nombre: datos.get("nombre"),
    correo: datos.get("correo"),
    telefono: datos.get("telefono"),
    producto: datos.get("producto"),
    cantidad: datos.get("cantidad"),
    mensaje: datos.get("mensaje"),
    estado: "Pendiente"
  };

  const pedidosGuardados = sessionStorage.getItem("kombechiPedidos");
  const pedidos = pedidosGuardados ? JSON.parse(pedidosGuardados) : [];
  pedidos.push(pedido);
  sessionStorage.setItem("kombechiPedidos", JSON.stringify(pedidos));

  console.log("Hola, tu pedido fue guardado:", pedido);
  document.querySelector("#estado-contacto").textContent =
    "Pedido de prueba recibido. Todavía no se ha enviado al servidor.";

  alert("Hola, tu pedido fue guardado.");
  formulario.reset();
  document.querySelector("#cantidad-pedida").value = 1;
});

const parametros = new URLSearchParams(window.location.search);
const categoriaURL = parametros.get("categoria");

if (categoriaURL === "Kombucha" || categoriaURL === "Kéfir") {
  filtroCategoria.value = categoriaURL;
}

mostrarProductos();
