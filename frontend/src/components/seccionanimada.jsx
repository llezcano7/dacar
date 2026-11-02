import { useEffect, useRef, useState } from "react";
import "./seccionanimada.css";

/*
  Contenedor de sección reutilizable: fondo con parallax, encabezado
  animado (palabras que suben, subtítulo, barra de progreso) y un
  espacio para el contenido (children).

  Props:
    id          id de la sección (para el menú / anclas)
    sobretitulo Texto chico sobre el título
    titulo      Parte normal del título
    destacado   Parte del título resaltada en naranja
    subtitulo   Texto de apoyo
*/
export default function SeccionAnimada({
  id,
  sobretitulo,
  titulo,
  destacado,
  subtitulo,
  children,
}) {
  const seccionRef = useRef(null);
  const encabezadoRef = useRef(null);
  const [encabezadoVisible, setEncabezadoVisible] = useState(false);

  // Revela el encabezado al entrar en pantalla
  useEffect(() => {
    const nodo = encabezadoRef.current;
    if (!nodo) return;

    const observer = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          setEncabezadoVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(nodo);
    return () => observer.disconnect();
  }, []);

  // Progreso del scroll a través de la sección (parallax + barra)
  useEffect(() => {
    const seccion = seccionRef.current;
    if (!seccion) return;

    let pendiente = false;

    const actualizar = () => {
      const rect = seccion.getBoundingClientRect();
      const alto = window.innerHeight;
      const progreso = Math.min(
        1,
        Math.max(0, (alto - rect.top) / (alto + rect.height))
      );
      seccion.style.setProperty("--progress", progreso.toFixed(4));
      pendiente = false;
    };

    const alScrollear = () => {
      if (pendiente) return;
      pendiente = true;
      requestAnimationFrame(actualizar);
    };

    actualizar();
    window.addEventListener("scroll", alScrollear, { passive: true });
    window.addEventListener("resize", actualizar);

    return () => {
      window.removeEventListener("scroll", alScrollear);
      window.removeEventListener("resize", actualizar);
    };
  }, []);

  const palabras = [
    ...titulo.split(" ").map((texto) => ({ texto, destacada: false })),
    ...(destacado
      ? destacado.split(" ").map((texto) => ({ texto, destacada: true }))
      : []),
  ];

  return (
    <section id={id} className="animated-section" ref={seccionRef}>
      <div className="" />
      <span className="animated-section-stain" />
      <span className="animated-section-stain" />

        <header
          className="animated-section-header"
          ref={encabezadoRef}
          style={{ "--visible": encabezadoVisible ? 1 : 0 }}
        >
          {sobretitulo && (
            <span className="animated-section-overtitle">{sobretitulo}</span>
          )}

          <h2 className="animated-section-title">
            {palabras.map((palabra, i) => (
              <span key={i}>
                <span
                  className={
                    "animated-section-word" +
                    (palabra.destacada
                      ? " animated-section-word-salient"
                      : "")
                  }
                >
                  <span
                    className="animated-section-word-intern"
                    style={{ "--i": i }}
                  >
                    {palabra.texto}
                  </span>
                </span>{" "}
              </span>
            ))}
          </h2>

          {subtitulo && (
            <p className="animated-section-subtitle">{subtitulo}</p>
          )}

          <div className="animated-section-progress" aria-hidden="true">
            <span className="animated-section-progress-filled" />
          </div>
        </header>

        {children}
    </section>
  );
}