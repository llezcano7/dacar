import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CarGallery from "../components/cargallery";
import { armarBusqueda } from "../config/cotizacion.js";
import {
  LUGARES,
  HORAS,
  hoy,
  sumarDias,
  dias,
  validarBusqueda,
} from "../config/busqueda.js";
import "./inicio.css";

// Página que lista los autos disponibles (misma pestaña)
const FLOTA_URL = "/flota";

const Icon = ({ size = 20, stroke = 2, children }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={stroke}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
);

const Campo = ({ label, className = "", children }) => (
  <label className={`hero-field ${className}`}>
    <span>{label}</span>
    {children}
  </label>
);

// minDias: mínimo de días de alquiler. Hoy es un valor por defecto; más adelante
// va a venir del back (configuración que el cliente edita desde el dashboard):
//   <Hero minDias={config.minDiasAlquiler} />
export default function Hero({ minDias = 3 }) {
  const navigate = useNavigate();
  const [mismoLugar, setMismoLugar] = useState(true);
  const [error, setError] = useState("");
  const [f, setF] = useState({
    lugarRetiro: LUGARES[0],
    fechaRetiro: "",
    horaRetiro: "10:00",
    lugarDevolucion: LUGARES[0],
    fechaDevolucion: "",
    horaDevolucion: "10:00",
  });

  // Datos de la búsqueda con el lugar de devolución ya resuelto
  const datos = {
    ...f,
    lugarDevolucion: mismoLugar ? f.lugarRetiro : f.lugarDevolucion,
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setF((prev) => {
      const next = { ...prev, [name]: value };
      // Al elegir el retiro, la devolución se adelanta sola a la fecha mínima
      if (name === "fechaRetiro" && value) {
        const minima = sumarDias(value, minDias);
        if (!next.fechaDevolucion || next.fechaDevolucion < minima) {
          next.fechaDevolucion = minima;
        }
      }
      return next;
    });
  };

  // Al pedir "otro lugar", el select de devolución arranca en el lugar de retiro
  const onMismoLugar = (e) => {
    const checked = e.target.checked;
    setMismoLugar(checked);
    if (!checked) {
      setF((prev) => ({ ...prev, lugarDevolucion: prev.lugarRetiro }));
    }
  };

  const onSubmit = (e) => {
    e.preventDefault(); // frena el envío nativo del form

    const mensaje = validarBusqueda(datos, minDias);
    if (mensaje) {
      setError(mensaje);
      return;
    }

    setError("");
    navigate(`${FLOTA_URL}?${new URLSearchParams(datos)}`);
  };

  const busqueda = armarBusqueda(datos);

  return (
    <section className="hero">
      <div className="hero-top container">
        <div className="hero-glow" />
        <svg
          className="hero-landscape"
          viewBox="0 0 1440 520"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M0 300 L180 180 L300 250 L470 120 L640 260 L760 200 L960 90 L1150 250 L1290 170 L1440 260 L1440 520 L0 520 Z"
            fill="#353535"
          />
          <path
            d="M0 400 L220 300 L400 380 L620 290 L860 400 L1100 310 L1300 390 L1440 330 L1440 520 L0 520 Z"
            fill="#1e1e1e"
          />
        </svg>

        <div className="hero-content">
          <div className="hero-text">
            <div className="eyebrow-wrapper">
              <div className="live-tag">
                <span className="tag-ping"></span>
              </div>
              <span className="hero-eyebrow">Alquiler de autos en Bariloche</span>
            </div>
            <h1 className="hero-title">
              Viajá <span>a tu ritmo</span>
            </h1>
            <p>
              Autos listos y equipados para recorrer Ruta 40, Circuito Chico, Cerro
              Catedral, Siete Lagos y mucho más.
              <br />
              <br />
              Elegí fechas, lugar y hora, y reservá en menos de un minuto.
            </p>
          </div>
        </div>
      </div>

      <div className="hero-buscador container">
        <form className="hero-card" onSubmit={onSubmit}>
          <div className="hero-card-top">
            <span className="hero-card-title">Buscá tu auto</span>
            <label className="hero-check">
              <input
                type="checkbox"
                checked={mismoLugar}
                onChange={onMismoLugar}
              />
              Devolver en el mismo lugar
            </label>
          </div>

          <div className="hero-fila">
            <div className="hero-group">
              <div className="hero-group-title">
                <span className="hero-dot hero-dot--primary" />
                Retiro
              </div>
              <div className="hero-fields">
                <Campo label="Lugar de retiro" className="hero-field--lugar">
                  <select name="lugarRetiro" value={f.lugarRetiro} onChange={onChange}>
                    {LUGARES.map((l) => (
                      <option key={l}>{l}</option>
                    ))}
                  </select>
                </Campo>
                <Campo label="Fecha de retiro" className="hero-field--fecha">
                  <input
                    type="date"
                    name="fechaRetiro"
                    value={f.fechaRetiro}
                    min={hoy()}
                    onChange={onChange}
                    required
                  />
                </Campo>
                <Campo label="Hora de retiro" className="hero-field--hora">
                  <select name="horaRetiro" value={f.horaRetiro} onChange={onChange}>
                    {HORAS.map((h) => (
                      <option key={h}>{h}</option>
                    ))}
                  </select>
                </Campo>
              </div>
            </div>

            <div className="hero-group">
              <div className="hero-group-title">
                <span className="hero-dot hero-dot--dark" />
                Devolución
                <small className="hero-group-note">mínimo {dias(minDias)}</small>
              </div>
              <div className="hero-fields">
                {!mismoLugar && (
                  <Campo label="Lugar de devolución" className="hero-field--lugar">
                    <select
                      name="lugarDevolucion"
                      value={f.lugarDevolucion}
                      onChange={onChange}
                    >
                      {LUGARES.map((l) => (
                        <option key={l}>{l}</option>
                      ))}
                    </select>
                  </Campo>
                )}
                <Campo label="Fecha de devolución" className="hero-field--fecha">
                  <input
                    type="date"
                    name="fechaDevolucion"
                    value={f.fechaDevolucion}
                    min={f.fechaRetiro ? sumarDias(f.fechaRetiro, minDias) : hoy()}
                    onChange={onChange}
                    required
                  />
                </Campo>
                <Campo label="Hora de devolución" className="hero-field--hora">
                  <select
                    name="horaDevolucion"
                    value={f.horaDevolucion}
                    onChange={onChange}
                  >
                    {HORAS.map((h) => (
                      <option key={h}>{h}</option>
                    ))}
                  </select>
                </Campo>
              </div>
            </div>

            <button type="submit" className="hero-buscar">
              <Icon size={22} stroke={2.5}>
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-4-4" />
              </Icon>
              Buscar autos
            </button>
          </div>

          {error && (
            <p className="hero-error" role="alert">
              {error}
            </p>
          )}
        </form>
      </div>

      <CarGallery busqueda={busqueda} />
    </section>
  );
}
