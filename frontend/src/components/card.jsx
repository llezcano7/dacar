import { useEffect, useRef, useState } from "react";
import "./card.css";

/*
  Card animada reutilizable.
  - Entra con animación cuando aparece en pantalla (scroll).
  - Se inclina en 3D y muestra una luz que sigue al cursor.
  - Expone la variable CSS --visible (0 → 1) para que el contenido
    pueda animarse junto con la entrada (ej: dibujar un ícono).

  Props:
    as        Etiqueta externa ("div" por defecto, "li" dentro de una lista)
    delay     Retraso de la entrada en ms (para escalonar tarjetas)
    fromX     Desde cuántos px en X entra la tarjeta
    className Clase propia del contenido (se aplica a la tarjeta)
    claseEnvoltura Clase para el elemento exterior (ej: tamaño dentro de un flex/grid)
    --card-padding  Variable CSS opcional para cambiar el padding interno
*/
export default function Card({
  as: Etiqueta = "div",
  delay = 0,
  fromX = 0,
  className = "",
  claseEnvoltura = "",
  style: estilo,
  children,
  ...resto
}) {
  const envolturaRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const nodo = envolturaRef.current;
    if (!nodo) return;

    const observer = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(nodo);
    return () => observer.disconnect();
  }, []);

  const alMoverMouse = (e) => {
    const tarjeta = e.currentTarget;
    const rect = tarjeta.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    tarjeta.style.setProperty("--mx", `${x}px`);
    tarjeta.style.setProperty("--my", `${y}px`);
    tarjeta.style.setProperty("--rx", `${((x / rect.width - 0.5) * 8).toFixed(2)}deg`);
    tarjeta.style.setProperty("--ry", `${((0.5 - y / rect.height) * 8).toFixed(2)}deg`);
  };

  const alSalirMouse = (e) => {
    e.currentTarget.style.setProperty("--rx", "0deg");
    e.currentTarget.style.setProperty("--ry", "0deg");
  };

  return (
    <Etiqueta
      ref={envolturaRef}
      className={`card-animada ${claseEnvoltura}`.trim()}
      style={{
        ...estilo,
        "--visible": visible ? 1 : 0,
        "--delay": `${delay}ms`,
        "--from-x": `${fromX}px`,
      }}
      {...resto}
    >
      <article
        className={`card-animada-tarjeta ${className}`.trim()}
        onMouseMove={alMoverMouse}
        onMouseLeave={alSalirMouse}
      >
        {children}
      </article>
    </Etiqueta>
  );
}