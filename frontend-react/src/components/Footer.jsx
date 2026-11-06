import React from "react";

const imagenes = "/assets/img/";

export default function Footer() {
  return (
    <footer className="pie-pagina">
      <div className="marca-pie">
        <a href="#inicio" aria-label="Volver al inicio"><img className="logo-pie" src={`${imagenes}logo.png`} alt="Logo de Kombechi" /></a>
        <span className="firma-pie">by Alison S.</span>
        <span>© 2026 · Todos los derechos reservados</span>
      </div>
      <div className="info-pie"><h3>Información</h3><a href="#catalogo">Ver catálogo</a><a href="#nosotros">Sobre nosotros</a></div>
      <div className="info-pie"><h3>Contacto</h3><a href="#contacto">Escríbenos desde el formulario de pedidos</a></div>
    </footer>
  );
}
