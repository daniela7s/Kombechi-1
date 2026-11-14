
import React, { lazy, Suspense, useEffect, useRef, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import { pedir } from "./api";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProductCard from "./components/ProductCard";
import ContactForm from "./components/ContactForm";
import FAQ from "./components/FAQ";
import "./styles.css";

const imagenes = "/assets/img/";

// El panel se carga cuando se visita la ruta /admin.
const Admin = lazy(() => import("./components/Admin"));

function Tienda() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [busqueda, setBusqueda] = useState("");

  const [categoria, setCategoria] = useState(
    () =>
      new URLSearchParams(window.location.search).get("categoria") || ""
  );

  const [orden, setOrden] = useState("destacados");

  const [productoSeleccionado, setProductoSeleccionado] = useState({
    nombre: "",
    version: 0
  });

  // Referencia al formulario de contacto.
  const contactoRef = useRef(null);

  useEffect(() => {
    async function cargarProductos() {
      try {
        const datos = await pedir("/productos");
        setProductos(datos);
      } catch (errorCarga) {
        setError(
          `${errorCarga.message} Comprueba que el servidor de Node.js esté iniciado.`
        );
      } finally {
        setCargando(false);
      }
    }

    cargarProductos();
  }, []);

  const productosFiltrados = productos.filter((producto) => {
    const coincideNombre = producto.nombre
      .toLowerCase()
      .includes(busqueda.toLowerCase());

    const coincideCategoria =
      !categoria || producto.categoria === categoria;

    return coincideNombre && coincideCategoria;
  });

  productosFiltrados.sort((a, b) => {
    if (orden === "nombre") {
      return a.nombre.localeCompare(b.nombre, "es");
    }

    if (orden === "precio-menor-mayor") {
      return a.precio - b.precio;
    }

    if (orden === "precio-mayor-menor") {
      return b.precio - a.precio;
    }

    return Number(b.destacado) - Number(a.destacado);
  });

  const destacados = productos
    .filter((producto) => producto.destacado)
    .slice(0, 3);

  function prepararPedido(nombreProducto) {
    setProductoSeleccionado((seleccionActual) => ({
      nombre: nombreProducto,
      version: seleccionActual.version + 1
    }));

    contactoRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }

  function elegirCategoria(nombreCategoria) {
    setCategoria(nombreCategoria);

    const consulta = new URLSearchParams(window.location.search);

    if (nombreCategoria) {
      consulta.set("categoria", nombreCategoria);
    } else {
      consulta.delete("categoria");
    }

    const nuevaUrl = consulta.toString()
      ? `?${consulta.toString()}#catalogo`
      : "#catalogo";

    window.history.replaceState({}, "", nuevaUrl);
  }

  return (
    <>
      <Header />

      <main>
        {/* Banner principal */}
        <section className="banner" id="inicio">
          <div className="texto-banner">
            <h1>Fermentos vivos, frescos y hechos con cuidado</h1>
            <h2>Kombucha y kéfir artesanal Kombechi.</h2>
            <p>
              Sabores únicos, cultivos vivos y bioquímica aplicada para acompañar tus días.
            </p>
            <a className="boton-banner" href="#catalogo">
              Ver productos
            </a>
          </div>

          <div className="imagen-banner">
            <img
              src={`${imagenes}banner.avif`}
              alt="Bebidas fermentadas artesanales de Kombechi"
            />
          </div>
        </section>

        {/* Categorías */}
        <section
          id="categorias"
          className="seccion-categorias contenedor"
        >
          <div className="encabezado-seccion">
            <div>
              <span className="aviso">ENCUENTRA LO QUE BUSCAS</span>
              <h2>Explora por categorías</h2>
            </div>
          </div>

          <div className="cuadricula-categorias">
            <a
              className="tarjeta-categoria categoria-1"
              href="#catalogo"
              onClick={() => elegirCategoria("Kombucha")}
            >
              <span className="icono-categoria">
                <img
                  src={`${imagenes}kommenta.jpg`}
                  alt="Botella de kombucha"
                  loading="lazy"
                />
              </span>
              <strong>Kombucha</strong>
              <span>Ver productos →</span>
            </a>

            <a
              className="tarjeta-categoria categoria-2"
              href="#catalogo"
              onClick={() => elegirCategoria("Kéfir")}
            >
              <span className="icono-categoria">
                <img
                  src={`${imagenes}kenat.jpg`}
                  alt="Vaso de kéfir"
                  loading="lazy"
                />
              </span>
              <strong>Kéfir</strong>
              <span>Ver productos →</span>
            </a>
          </div>
        </section>

        {/* Productos destacados */}
        <section className="seccion-destacados">
          <div className="contenedor">
            <div className="encabezado-seccion">
              <div className="encabezado-destacados">
                <span className="texto-superior">LOS MÁS VENDIDOS</span>
                <h2>Productos destacados</h2>
                <p>Una selección para ti</p>
              </div>
            </div>

            <div className="cuadricula-destacados">
              {destacados.map((producto) => (
                <ProductCard
                  key={producto._id}
                  producto={producto}
                  destacado
                  alPedir={prepararPedido}
                />
              ))}

              {!cargando && !error && destacados.length === 0 && (
                <p className="sin-resultados">
                  Todavía no hay productos destacados.
                </p>
              )}
            </div>

            <div className="boton-centrado">
              <a className="boton-catalogo" href="#catalogo">
                Ver catálogo completo
              </a>
            </div>
          </div>
        </section>

        {/* Catálogo */}
        <section
          id="catalogo"
          className="seccion-catalogo pagina-catalogo contenedor"
        >
          <label
            className="contenedor-busqueda"
            htmlFor="buscador-productos"
          >
            <span aria-hidden="true">🔍</span>
            <input
              id="buscador-productos"
              className="campo-busqueda"
              type="search"
              placeholder="Buscar productos..."
              value={busqueda}
              onChange={(evento) => setBusqueda(evento.target.value)}
            />
          </label>

          <div className="encabezado-catalogo">
            <span className="texto-superior">CATÁLOGO</span>
            <h2>Todos los productos</h2>
            <p>
              Explora nuestros fermentos artesanales y elige tu sabor favorito.
            </p>
          </div>

          <div className="filtros-catalogo">
            <label htmlFor="filtro-categoria">
              Categoría
              <select
                id="filtro-categoria"
                value={categoria}
                onChange={(evento) =>
                  elegirCategoria(evento.target.value)
                }
              >
                <option value="">Todas las categorías</option>
                <option value="Kombucha">Kombucha</option>
                <option value="Kéfir">Kéfir</option>
              </select>
            </label>

            <label htmlFor="orden-productos">
              Ordenar por
              <select
                id="orden-productos"
                value={orden}
                onChange={(evento) => setOrden(evento.target.value)}
              >
                <option value="destacados">Destacados</option>
                <option value="nombre">Nombre: A-Z</option>
                <option value="precio-menor-mayor">
                  Precio: menor a mayor
                </option>
                <option value="precio-mayor-menor">
                  Precio: mayor a menor
                </option>
              </select>
            </label>
          </div>

          <p className="estado-catalogo" aria-live="polite">
            {cargando
              ? "Cargando productos..."
              : error || `${productosFiltrados.length} productos`}
          </p>

          <div className="catalogo" aria-live="polite">
            {productosFiltrados.map((producto) => (
              <ProductCard
                key={producto._id}
                producto={producto}
                alPedir={prepararPedido}
              />
            ))}

            {!cargando && !error && productosFiltrados.length === 0 && (
              <p className="sin-resultados">
                No encontramos productos.
              </p>
            )}
          </div>
        </section>

        {/* Sobre nosotros */}
        <section
          id="nosotros"
          className="seccion-nosotros contenedor"
        >
          <div className="imagen-nosotros logo-nosotros">
            <img
              src={`${imagenes}logo.png`}
              alt="Logo de Kombechi"
              loading="lazy"
            />
          </div>

          <div className="contenido-nosotros">
            <span className="texto-superior">SOBRE NOSOTROS</span>
            <h2>Fermentación artesanal con ciencia y cuidado.</h2>

            <p>
              Kombechi es un emprendimiento de bebidas fermentadas que combina
              frescura, calidad y bioquímica aplicada. Elaboramos kombucha con
              SCOBY y kéfir con gránulos vivos para ofrecer sabores únicos,
              preparados con atención en cada etapa.
            </p>

            <p className="firma-desarrollador">
              dev by{" "}
              <a
                href="https://www.linkedin.com/in/joselin-suarez-8b34b644b"
                target="_blank"
                rel="noopener noreferrer"
              >
                Joselin Suarez
              </a>
            </p>
          </div>
        </section>

        {/* Formulario de contacto */}
        <div ref={contactoRef}>
          <ContactForm
            productoInicial={productoSeleccionado.nombre}
            versionProducto={productoSeleccionado.version}
            alEnviar={() =>
              setProductoSeleccionado((seleccionActual) => ({
                ...seleccionActual,
                nombre: ""
              }))
            }
          />
        </div>

        {/* Preguntas frecuentes */}
        <FAQ />
      </main>

      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<p>Cargando panel...</p>}>
        <Routes>
          <Route path="/" element={<Tienda />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
