
const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

async function enviarNotificacionPedido(pedido) {
  const { data, error } = await resend.emails.send({
    from: "Kombechi <onboarding@resend.dev>",
    to: ["jsuarezds7@gmail.com"],
    replyTo: pedido.correo,
    subject: `Nuevo pedido Kombechi: ${pedido.producto}`,
    html: `
      <h2>Nuevo pedido recibido</h2>
      <p><strong>Cliente:</strong> ${pedido.nombre}</p>
      <p><strong>Correo:</strong> ${pedido.correo}</p>
      <p><strong>Teléfono:</strong> ${pedido.telefono}</p>
      <p><strong>Producto:</strong> ${pedido.producto}</p>
      <p><strong>Cantidad:</strong> ${pedido.cantidad}</p>
      <p><strong>Mensaje:</strong> ${pedido.mensaje || "Sin mensaje"}</p>
      <p><strong>ID:</strong> ${pedido._id}</p>
    `
  });

  if (error) {
    throw new Error(error.message);
  }

  console.log("Correo enviado correctamente:", data.id);
}

module.exports = enviarNotificacionPedido;
