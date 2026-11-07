const API = import.meta.env.VITE_API_URL || "/api";

export async function pedir(ruta, opciones = {}) {
  const respuesta = await fetch(`${API}${ruta}`, {
    ...opciones,
    headers: {
      "Content-Type": "application/json",
      ...(opciones.token ? { Authorization: `Bearer ${opciones.token}` } : {}),
      ...opciones.headers
    }
  });

  const datos = await respuesta.json().catch(() => ({}));

  if (!respuesta.ok) {
    const error = new Error(datos.mensaje || "No se pudo completar la solicitud.");
    error.status = respuesta.status;
    throw error;
  }

  return datos;
}
