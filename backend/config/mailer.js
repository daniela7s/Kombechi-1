
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function enviarNotificacionPedido(pedido) {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: process.env.ADMIN_EMAIL,
    replyTo: pedido.correo,
    subject: `Nuevo pedido Kombechi: ${pedido.producto}`,
    text: `
Nuevo pedido recibido.

Cliente: ${pedido.nombre}
Correo: ${pedido.correo}
Teléfono: ${pedido.telefono}
Producto: ${pedido.producto}
Cantidad: ${pedido.cantidad}
Mensaje: ${pedido.mensaje || "Sin mensaje"}
ID: ${pedido._id}
    `
  });
}

module.exports = enviarNotificacionPedido;
