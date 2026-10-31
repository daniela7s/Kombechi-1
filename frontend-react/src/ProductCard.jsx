import React from "react";

function precioCOP(precio) {
  return Number(precio || 0).toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0
  });
}

export default function ProductCard({ producto, destacado = false, alPedir }) {
  const claseTarjeta = destacado ? "tarjeta-destacada" : "tarjeta-producto";
  const claseImagen = destacado ? "imagen-destacada" : "imagen-producto";
  const claseInfo = destacado ? "info-destacada" : "info-producto";
  const claseBoton = destacado ? "boton-destacado" : "boton-tarjeta";

  return (
    <article className={claseTarjeta}>
      <div className={claseImagen}>
        {producto.imagen ? (
          <img src={producto.imagen} alt={producto.nombre} loading="lazy" />
        ) : null}
        {!destacado && <span className="etiqueta-producto">{producto.categoria}</span>}
      </div>
      <div className={claseInfo}>
        <div className="fila-destacada">
          <h3>{producto.nombre}</h3>
          <span className="precio">{precioCOP(producto.precio)}</span>
        </div>
        <p className="descripcion-producto">{producto.descripcion}</p>
      </div>
      <button className={claseBoton} type="button" onClick={() => alPedir(producto.nombre)}>
        Pedir este producto
      </button>
    </article>
  );
}

