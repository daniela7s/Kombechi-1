import React, { useState } from "react";

// Contenido de las preguntas frecuentes de Kombechi.
const preguntas = [
  {
    pregunta: "¿Qué es la kombucha?",
    respuesta: "Es una bebida fermentada de té (verde o negro) endulzado, elaborada con un cultivo simbiótico de bacterias y levaduras llamado SCOBY. La fermentación le da su sabor ligeramente ácido y burbujeante, además de microorganismos vivos."
  },
  {
    pregunta: "¿Qué es el kéfir?",
    respuesta: "Es un fermento elaborado con gránulos vivos de bacterias y levaduras. En Kombechi lo preparamos con cultivos activos para lograr una bebida fresca, cremosa y llena de microorganismos benéficos."
  },
  {
    pregunta: "¿Qué beneficios tienen estas bebidas?",
    respuesta: "Aportan probióticos que favorecen la flora intestinal y una buena digestión, junto con vitaminas y antioxidantes. Son una alternativa refrescante a las bebidas azucaradas, siempre como parte de una alimentación equilibrada."
  },
  {
    pregunta: "¿Cómo debo conservarlas?",
    respuesta: "En refrigeración, entre 2 °C y 6 °C, y siempre bien cerradas. Al estar vivas, continúan fermentando, así que un manejo limpio y el frío constante conservan su frescura y su sabor."
  },
  {
    pregunta: "¿Cuánto tiempo duran?",
    respuesta: "Recomendamos consumirlas dentro de las 2 a 3 semanas posteriores a su elaboración y mantenerlas refrigeradas. La fecha de elaboración viene indicada en cada producto."
  },
  {
    pregunta: "¿Cómo puedo realizar un pedido?",
    respuesta: "Desde el formulario de contacto de esta página: déjanos tus datos y el producto que te interesa. Guardamos tu pedido y nos ponemos en contacto contigo para confirmar disponibilidad, entrega y pago."
  }
];

export default function FAQ() {
  // Guarda el índice de la pregunta abierta; null cuando todas están cerradas.
  const [abierta, setAbierta] = useState(null);

  function alternar(indice) {
    setAbierta((actual) => (actual === indice ? null : indice));
  }

  return (
    <section id="faq" className="seccion-faq">
      <div className="contenedor">
        <div className="encabezado-seccion encabezado-faq">
          <div>
            <span className="texto-superior">PREGUNTAS FRECUENTES</span>
            <h2>Todo lo que quieres saber</h2>
            <p>Resolvemos las dudas más comunes sobre nuestros fermentos.</p>
          </div>
        </div>
        <div className="lista-faq">
          {preguntas.map((item, indice) => {
            const estaAbierta = abierta === indice;
            return (
              <div className={`item-faq${estaAbierta ? " abierto" : ""}`} key={item.pregunta}>
                <button
                  type="button"
                  className="pregunta-faq"
                  aria-expanded={estaAbierta}
                  aria-controls={`respuesta-faq-${indice}`}
                  onClick={() => alternar(indice)}
                >
                  <span>{item.pregunta}</span>
                  <span className="icono-faq" aria-hidden="true">{estaAbierta ? "−" : "+"}</span>
                </button>
                <div id={`respuesta-faq-${indice}`} className="respuesta-faq" role="region" aria-hidden={!estaAbierta}>
                  <p>{item.respuesta}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
