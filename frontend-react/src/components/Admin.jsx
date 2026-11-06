import React, { useEffect, useRef, useState } from "react";
import { pedir } from "../api";
import "../admin.css";

function precioCOP(precio) {
  return Number(precio || 0).toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });
}

export default function Admin() {
  // UseRef permite desplazar la página hasta el formulario sin buscarlo con querySelector.
  const formularioProductoRef = useRef(null);
  const [token, setToken] = useState(() => sessionStorage.getItem("kombechiToken") || "");
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  // React conserva los valores del formulario y los campos los muestran desde este estado.
  const [formularioProducto, setFormularioProducto] = useState({
    nombre: "",
    categoria: "Kombucha",
    descripcion: "",
    precio: "",
    imagen: "",
    destacado: false
  });
  const [productos, setProductos] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [productoEditado, setProductoEditado] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [errorLogin, setErrorLogin] = useState("");
  const [mensajePanel, setMensajePanel] = useState("");

  async function cargarDatos(tokenActual) {
    setCargando(true);
    try {
      const [listaProductos, listaPedidos] = await Promise.all([
        pedir("/productos"),
        pedir("/pedidos", { token: tokenActual })
      ]);
      setProductos(listaProductos);
      setPedidos(listaPedidos);
      return true;
    } catch (error) {
      if (error.message.includes("sesión") || error.message.includes("Inicia sesión")) {
        sessionStorage.removeItem("kombechiToken");
        setToken("");
        setErrorLogin(error.message);
      }
      setMensajePanel(error.message);
      return false;
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    if (token) cargarDatos(token);
  }, []);

  async function iniciarSesion(evento) {
    evento.preventDefault();
    setEnviando(true);
    setErrorLogin("");
    try {
      const resultado = await pedir("/admin/login", {
        method: "POST",
        body: JSON.stringify({ usuario: usuario.trim(), password })
      });
      sessionStorage.setItem("kombechiToken", resultado.token);
      setToken(resultado.token);
      setPassword("");
      await cargarDatos(resultado.token);
    } catch (error) {
      setErrorLogin(error.message);
    } finally {
      setEnviando(false);
    }
  }

  function cerrarSesion() {
    sessionStorage.removeItem("kombechiToken");
    setToken("");
    setProductos([]);
    setPedidos([]);
    setMensajePanel("");
    setProductoEditado(null);
  }

  async function guardarProducto(evento) {
    evento.preventDefault();
    const producto = {
      nombre: formularioProducto.nombre.trim(),
      categoria: formularioProducto.categoria,
      descripcion: formularioProducto.descripcion.trim(),
      precio: Number(formularioProducto.precio),
      imagen: formularioProducto.imagen.trim(),
      destacado: formularioProducto.destacado
    };
    setEnviando(true);
    setMensajePanel("");
    try {
      await pedir(productoEditado ? `/productos/${productoEditado}` : "/productos", {
        method: productoEditado ? "PUT" : "POST",
        token,
        body: JSON.stringify(producto)
      });
      setFormularioProducto({ nombre: "", categoria: "Kombucha", descripcion: "", precio: "", imagen: "", destacado: false });
      setProductoEditado(null);
      setMensajePanel(productoEditado ? "Producto actualizado." : "Producto agregado.");
      await cargarDatos(token);
    } catch (error) {
      setMensajePanel(error.message);
    } finally {
      setEnviando(false);
    }
  }

  function editarProducto(producto) {
    setProductoEditado(producto._id);
    // Al actualizar el estado, React llena los campos controlados con los datos del producto seleccionado para editar
    setFormularioProducto({
      nombre: producto.nombre,
      categoria: producto.categoria,
      descripcion: producto.descripcion,
      precio: String(producto.precio),
      imagen: producto.imagen || "",
      destacado: Boolean(producto.destacado)
    });
    formularioProductoRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  function cancelarEdicion() {
    setProductoEditado(null);
    setFormularioProducto({ nombre: "", categoria: "Kombucha", descripcion: "", precio: "", imagen: "", destacado: false });
  }

  async function eliminarProducto(id) {
    if (!window.confirm("¿Quieres eliminar este producto?")) return;
    try {
      await pedir(`/productos/${id}`, { method: "DELETE", token });
      setMensajePanel("Producto eliminado.");
      await cargarDatos(token);
    } catch (error) {
      setMensajePanel(error.message);
    }
  }

  async function atenderPedido(id) {
    try {
      await pedir(`/pedidos/${id}`, { method: "PUT", token, body: JSON.stringify({ estado: "atendido" }) });
      setMensajePanel("Pedido marcado como atendido.");
      await cargarDatos(token);
    } catch (error) {
      setMensajePanel(error.message);
    }
  }

  async function eliminarPedido(id) {
    if (!window.confirm("¿Quieres eliminar este pedido?")) return;
    try {
      await pedir(`/pedidos/${id}`, { method: "DELETE", token });
      setMensajePanel("Pedido eliminado.");
      await cargarDatos(token);
    } catch (error) {
      setMensajePanel(error.message);
    }
  }

  const pendientes = pedidos.filter((pedido) => pedido.estado === "pendiente").length;
  const categorias = new Set(productos.map((producto) => producto.categoria)).size;

  return (
    <div className="admin-app">
      <header>
        <a className="logo fuente-logo" href="/" aria-label="Kombechi, volver al inicio">Kombechi</a>
        <nav className="enlaces-navegacion"><a href="/">← Volver a la tienda</a></nav>
        <span className="etiqueta-admin">Admin</span>
      </header>

      <main className="contenido-principal-admin">
        {!token ? (
          <section className="tarjeta-acceso" aria-labelledby="titulo-acceso">
            <span className="texto-superior">ZONA PRIVADA</span>
            <h1 id="titulo-acceso">Acceso administrador</h1>
            <p>Ingresa tu usuario y contraseña para gestionar la tienda.</p>
            <form onSubmit={iniciarSesion}>
              <label htmlFor="usuario-admin">Usuario</label>
              <input id="usuario-admin" name="usuario" autoComplete="username" required value={usuario} onChange={(evento) => setUsuario(evento.target.value)} placeholder="Tu usuario administrador" />
              <label htmlFor="clave-admin">Contraseña</label>
              <input id="clave-admin" name="password" type="password" autoComplete="current-password" required value={password} onChange={(evento) => setPassword(evento.target.value)} placeholder="Tu contraseña" />
              <button className="boton-tarjeta" type="submit" disabled={enviando}>{enviando ? "Verificando..." : "Entrar al panel"}</button>
            </form>
            <p className="nota" role="status">{errorLogin}</p>
          </section>
        ) : (
          <section className="panel-admin" aria-labelledby="titulo-panel">
            <div className="encabezado-panel">
              <div><span className="texto-superior">ADMINISTRACIÓN</span><h1 id="titulo-panel">Panel de gestión</h1></div>
              <button onClick={cerrarSesion} className="boton-secundario" type="button">Cerrar sesión</button>
            </div>
            <div className="estructura-panel">
              <aside className="menu-admin"><strong>Panel</strong><a href="#resumen">Resumen</a><a href="#gestion-productos">Productos</a><a href="#solicitudes">Pedidos</a><a href="/">Ver tienda</a></aside>
              <div className="contenido-admin">
                <section id="resumen" className="encabezado-admin"><div><h2>Resumen de la tienda</h2><p>Gestiona los productos y revisa los pedidos de la tienda.</p></div></section>
                <div className="cuadricula-resumen">
                  <article className="tarjeta-resumen"><span>Productos</span><strong>{productos.length}</strong></article>
                  <article className="tarjeta-resumen"><span>Categorías</span><strong>{categorias}</strong></article>
                  <article className="tarjeta-resumen"><span>Pedidos pendientes</span><strong>{pendientes}</strong></article>
                </div>
                {mensajePanel && <p className="nota" role="status">{mensajePanel}</p>}
                {cargando && <p className="nota">Cargando información...</p>}
                <section id="gestion-productos" className="seccion-admin">
                  <div className="titulo-seccion"><div><h3>Productos</h3><p className="ayuda-seccion">Los productos se guardan en MongoDB.</p></div></div>
                  {/* Cada campo muestra y actualiza formularioProducto; React es la fuente de verdad. */}
                  <form id="formulario-producto" ref={formularioProductoRef} className="formulario-producto" onSubmit={guardarProducto}>
                    <label>Nombre del producto<input name="nombre" value={formularioProducto.nombre} onChange={(evento) => setFormularioProducto((actual) => ({ ...actual, nombre: evento.target.value }))} required maxLength="70" placeholder="Ej. Kombucha de mango" /></label>
                    <label>Categoría<select name="categoria" value={formularioProducto.categoria} onChange={(evento) => setFormularioProducto((actual) => ({ ...actual, categoria: evento.target.value }))} required><option value="Kombucha">Kombucha</option><option value="Kéfir">Kéfir</option></select></label>
                    <label className="campo-descripcion">Descripción<textarea name="descripcion" value={formularioProducto.descripcion} onChange={(evento) => setFormularioProducto((actual) => ({ ...actual, descripcion: evento.target.value }))} rows="2" required maxLength="400" placeholder="Descripción breve del producto" /></label>
                    <label>Precio<input name="precio" type="number" value={formularioProducto.precio} onChange={(evento) => setFormularioProducto((actual) => ({ ...actual, precio: evento.target.value }))} min="0" step="1" required placeholder="0" /></label>
                    <label>URL de imagen <span>(opcional)</span><input name="imagen" type="text" value={formularioProducto.imagen} onChange={(evento) => setFormularioProducto((actual) => ({ ...actual, imagen: evento.target.value }))} placeholder="URL o ruta de imagen" /></label>
                    <label className="casilla-destacado"><input name="destacado" type="checkbox" checked={formularioProducto.destacado} onChange={(evento) => setFormularioProducto((actual) => ({ ...actual, destacado: evento.target.checked }))} /> Mostrar en destacados</label>
                    <div className="acciones-formulario"><button className="boton-tarjeta" type="submit" disabled={enviando}>{productoEditado ? "Guardar cambios" : "Agregar producto"}</button>{productoEditado && <button className="boton-secundario" type="button" onClick={cancelarEdicion}>Cancelar edición</button>}</div>
                  </form>
                  <div className="contenedor-tabla"><table><thead><tr><th>Nombre</th><th>Categoría</th><th>Descripción</th><th>Precio</th><th>Acciones</th></tr></thead>
                    <tbody>{productos.map((producto) => <tr key={producto._id}><td>{producto.nombre}</td><td>{producto.categoria}</td><td>{producto.descripcion}</td><td>{precioCOP(producto.precio)}</td><td className="acciones-tabla-producto"><button className="boton-secundario" type="button" onClick={() => editarProducto(producto)}>Editar</button><button className="boton-secundario" type="button" onClick={() => eliminarProducto(producto._id)}>Eliminar</button></td></tr>)}{!productos.length && <tr><td colSpan="5">No hay productos.</td></tr>}</tbody>
                  </table></div>
                </section>
                <section id="solicitudes" className="seccion-admin">
                  <div className="titulo-seccion"><div><h3>Pedidos</h3><p className="ayuda-seccion">Consulta cada pedido y actualiza su estado. Los pedidos se conservan en MongoDB.</p></div></div>
                  <div className="lista-solicitudes">
                    {pedidos.map((pedido) => <article className="tarjeta-solicitud" key={pedido._id}>
                      <div className="encabezado-solicitud"><strong>{pedido.nombre} — {pedido.producto} x {pedido.cantidad}</strong><span>{pedido.estado}</span></div>
                      <p>{pedido.correo} · {pedido.telefono}</p><p>{pedido.mensaje || "Sin mensaje adicional."}</p>
                      {pedido.estado === "pendiente" && <button className="boton-secundario" type="button" onClick={() => atenderPedido(pedido._id)}>Marcar como atendido</button>}
                      <button className="boton-secundario" type="button" onClick={() => eliminarPedido(pedido._id)}>Eliminar</button>
                    </article>)}
                    {!pedidos.length && <p className="nota-vacia">Todavía no hay pedidos guardados.</p>}
                  </div>
                </section>
              </div>
            </div>
          </section>
        )}
      </main>
      <footer><span>© 2026 Kombechi</span><a href="/">Volver a la tienda</a></footer>
    </div>
  );
}




