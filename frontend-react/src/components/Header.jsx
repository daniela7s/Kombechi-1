import React from "react";
import { Link } from "react-router";

const imagenes = "/assets/img/";

export default function Header() {
  return (
    <header className="encabezado-tienda">
      <a className="marca-logo" href="#inicio" aria-label="Kombechi, inicio">
        <img src={`${imagenes}logo.png`} alt="Logo de Kombechi" />
      </a>
      <nav className="navegacion" aria-label="Navegación principal">
        <a href="#inicio">Inicio</a><a href="#categorias">Categorías</a><a href="#catalogo">Productos</a><a href="#nosotros">Nosotros</a><a href="#contacto">Contacto</a>
      </nav>
      {/* Link cambia a la ruta del panel sin recargar el documento. */}
      <Link to="/admin" className="enlace-admin">Admin</Link>
    </header>
  );
}
