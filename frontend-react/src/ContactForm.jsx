import React, { useEffect, useState } from "react";
import { pedir } from "./api";

export default function ContactForm({ productoInicial = "", alEnviar }) {
  const [producto, setProducto] = useState(productoInicial);
  const [mensajeEstado, setMensajeEstado] = useState("");
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    if (productoInicial) setProducto(productoInicial);
  }, [productoInicial]);

  async function enviarPedido(evento) {
    evento.preventDefault();
    const formulario = evento.currentTarget;
    const datos = new FormData(formulario);
    const pedido = {
      nombre: datos.get("nombre").trim(),
      correo: datos.get("correo").trim(),
      telefono: datos.get("telefono").trim(),
      producto: producto.trim(),
      cantidad: Number(datos.get("cantidad")),
      mensaje: datos.get("mensaje").trim()
    };

    setEnviando(true);
    setMensajeEstado("");

    try {
      await pedir("/pedidos", {
        method: "POST",
        body: JSON.stringify(pedido)
      });
      setMensajeEstado("¡Listo! Recibimos tu pedido y pronto nos pondremos en contacto.");
      formulario.reset();
      setProducto("");
      alEnviar?.();
      window.alert("Tu pedido fue enviado correctamente.");
    } catch (error) {
      setMensajeEstado(error.message || "No se pudo enviar el pedido. Inténtalo de nuevo.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <section id="contacto" className="seccion-contacto">
      <div className="texto-contacto">
        <span>CONTACTO Y PEDIDOS</span>
        <h2>¿Te gustó algo?<br />Pide ahora.</h2>
        <p>Déjanos tus datos y el producto que te interesa. Guardaremos tu pedido para que podamos ponernos en contacto contigo.</p>
      </div>
      <form className="tarjeta-formulario" onSubmit={enviarPedido}>
        <h3>Solicita tu pedido</h3>
        <label>Nombre completo<input name="nombre" required maxLength="100" autoComplete="name" placeholder="Tu nombre" /></label>
        <label>Correo electrónico<input name="correo" type="email" required maxLength="120" autoComplete="email" placeholder="tu@correo.com" /></label>
        <label>Teléfono<input name="telefono" type="tel" required maxLength="30" autoComplete="tel" placeholder="Tu número de teléfono" /></label>
        <label>Producto<input name="producto" required maxLength="100" value={producto} onChange={(evento) => setProducto(evento.target.value)} placeholder="Producto que te interesa" /></label>
        <label>Cantidad<input name="cantidad" type="number" min="1" step="1" defaultValue="1" required /></label>
        <label>Mensaje<textarea name="mensaje" rows="4" maxLength="500" placeholder="Instrucciones o comentario adicional (opcional)" /></label>
        <button className="boton-formulario" type="submit" disabled={enviando}>{enviando ? "Enviando..." : "Enviar pedido"}</button>
        <p className="nota-formulario" role="status">{mensajeEstado}</p>
      </form>
    </section>
  );
}
