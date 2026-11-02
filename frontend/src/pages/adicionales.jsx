import SeccionAnimada from "../components/seccionanimada";
import Card from "../components/card";
import { adicionales as adicionalesPorDefecto } from "../config/adicionales";
import "./adicionales.css";

// Íconos de los servicios. pathLength={1} permite animar el dibujo del trazo.
const Icon = ({ children }) => (
  <svg
    width="30"
    height="30"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
);

const iconos = {
  pin: (
    <Icon>
      <path pathLength={1} d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z" />
      <circle pathLength={1} cx="12" cy="9.5" r="2.5" />
    </Icon>
  ),
  clock: (
    <Icon>
      <circle pathLength={1} cx="12" cy="12" r="9" />
      <path pathLength={1} d="M12 7v5l3 2" />
    </Icon>
  ),
  baby: (
    <Icon>
      <circle pathLength={1} cx="12" cy="8" r="3.5" />
      <path pathLength={1} d="M5 21v-2a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v2" />
    </Icon>
  ),
  snow: (
    <Icon>
      <path pathLength={1} d="M12 2v20M4.2 7l15.6 10M4.2 17 19.8 7" />
    </Icon>
  ),
  shield: (
    <Icon>
      <path pathLength={1} d="M12 3 5 6v5.5c0 4.4 3 8 7 9.5 4-1.5 7-5.1 7-9.5V6l-7-3Z" />
      <path pathLength={1} d="m9 12 2.2 2.2L15.5 10" />
    </Icon>
  ),
  driver: (
  <Icon>
    <circle pathLength={1} cx="9" cy="8" r="3.5" />
    <path pathLength={1} d="M2.5 20v-1a5 5 0 0 1 5-5h3a5 5 0 0 1 5 5v1" />
    <path pathLength={1} d="M19 8v6M16 11h6" />
  </Icon>
),
custom: (
  <Icon>
    <path pathLength={1} d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h4" />
    <path pathLength={1} d="M14 3l5 5v3" />
    <path pathLength={1} d="M14 3v5h5" />
    <path pathLength={1} d="M8.5 12h4" />
    <path pathLength={1} d="M8.5 16h2" />
    <circle pathLength={1} cx="16.5" cy="17" r="4" />
    <path pathLength={1} d="m14.8 17 1.2 1.2 2.2-2.4" />
  </Icon>
),
};

// Desde dónde entra cada card (se repite cada 3: izquierda, centro, derecha)
const DESDE_X = [-50, 0, 50];

const RUTA = "M20 -10C110 120 -20 250 80 340S70 520 130 610";

function RutaLateral({ id, lado, desfase = "0s" }) {
  return (
    <svg
      className={`additional-services-route additional-services-route-${lado}`}
      viewBox="0 0 260 600"
      preserveAspectRatio="xMinYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${id}-beam`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#ffe2b8" stopOpacity=".6" />
          <stop offset="1" stopColor="#ffe2b8" stopOpacity="0" />
        </linearGradient>
      </defs>
      
      <g className="additional-services-contours">
        <ellipse cx="0" cy="170" rx="60" ry="80" />
        <ellipse cx="0" cy="170" rx="105" ry="140" />
        <ellipse cx="0" cy="170" rx="150" ry="200" />
        <ellipse cx="0" cy="520" rx="60" ry="80" />
        <ellipse cx="0" cy="520" rx="105" ry="140" />
        <ellipse cx="0" cy="520" rx="150" ry="200" />
      </g>

      <path id={id} className="additional-services-path" d={RUTA} />

      <g>
        <path d="M15 -5L50 -17V17L15 5Z" fill={`url(#${id}-beam)`} />
        <rect className="additional-services-wheel" x="-11" y="-10" width="7" height="3" rx="1.5" />
        <rect className="additional-services-wheel" x="-11" y="7" width="7" height="3" rx="1.5" />
        <rect className="additional-services-wheel" x="5" y="-10" width="7" height="3" rx="1.5" />
        <rect className="additional-services-wheel" x="5" y="7" width="7" height="3" rx="1.5" />
        <rect className="additional-services-car-body" x="-15" y="-8" width="30" height="16" rx="7" />
        <rect className="additional-services-glass" x="2" y="-6" width="7" height="12" rx="2.5" />
        <rect className="additional-services-glass" x="-10" y="-5.5" width="5" height="11" rx="2" opacity=".6" />
        <circle className="additional-services-light" cx="14" cy="-4.5" r="1.6" />
        <circle className="additional-services-light" cx="14" cy="4.5" r="1.6" />
        <animateMotion dur="14s" begin={desfase} repeatCount="indefinite" rotate="auto">
          <mpath href={`#${id}`} />
        </animateMotion>
      </g>
    </svg>
  );
}

// servicios: lista de adicionales. Hoy viene de config/adicionales.js; luego, del back.
export default function Adicionales({ servicios = adicionalesPorDefecto }) {
  return (
    <section className="additional-services-section container">
      <RutaLateral id="route-left" lado="left" />
      <RutaLateral id="route-right" lado="right" desfase="-7s" />
      <SeccionAnimada
        id="servicios-adicionales"
        sobretitulo="Servicios adicionales"
        titulo="Armá tu viaje"
        destacado="a tu manera"
        subtitulo="Sumá extras a tu reserva y viajá más cómodo, seguro y sin límites por la Patagonia."
      >
        <ul className="additional-services-grid ">
          {servicios.map((s, i) => (
            <Card
              as="li"
              key={s.id}
              delay={(i % 3) * 120}
              fromX={DESDE_X[i % 3]}
              className="additional-services-card"
            >
              <div className="additional-services-head">
                <div className="additional-services-icon">{iconos[s.icono]}</div>
                <span className="additional-services-number">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>

              <span className="additional-services-tag">{s.etiqueta}</span>
              <h3 className="additional-services-title">{s.titulo}</h3>
              <p className="additional-services-text">{s.descripcion}</p>
            </Card>
          ))}
        </ul>
      </SeccionAnimada>
    </section>
  );
}