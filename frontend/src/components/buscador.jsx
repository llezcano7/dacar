import { useState } from "react";
import "./buscador.css";
import { LUGARES, HORAS, hoy, sumarDias, dias, validarBusqueda } from "../config/busqueda.js";
import {
    avisosAdicionales,
    leerAdicionales,
    escribirAdicionales,
    normalizarSeleccion,
} from "../config/calculoAdicionales.js";
import SelectorAdicionales from "./selectoradicionales.jsx";

const Campo = ({ label, children }) => (
    <label className="bflota-field">
        <span>{label}</span>
        {children}
    </label>
);

// Arma el estado del formulario a partir de los datos de la URL (con valores por defecto)
const valoresIniciales = (v = {}) => ({
    lugarRetiro: v.lugarRetiro || LUGARES[0],
    fechaRetiro: v.fechaRetiro || "",
    horaRetiro: v.horaRetiro || "10:00",
    lugarDevolucion: v.lugarDevolucion || v.lugarRetiro || LUGARES[0],
    fechaDevolucion: v.fechaDevolucion || "",
    horaDevolucion: v.horaDevolucion || "10:00",
    adicionales: normalizarSeleccion(leerAdicionales(v.adicionales)),
});

// busqueda:     datos ya formateados para mostrar (o null si no hay búsqueda)
// valores:      parámetros crudos de la URL, para precargar el formulario
// minDias:      mínimo de días de alquiler
// onActualizar: recibe los nuevos valores del formulario
export default function BuscadorFlota({ busqueda, valores, minDias = 3, onActualizar }) {
    const [editando, setEditando] = useState(false);
    const [mismoLugar, setMismoLugar] = useState(true);
    const [error, setError] = useState("");
    const [f, setF] = useState(() => valoresIniciales(valores));

    const abrir = () => {
        const inicial = valoresIniciales(valores);
        setF(inicial);
        setMismoLugar(inicial.lugarRetiro === inicial.lugarDevolucion);
        setError("");
        setEditando(true);
    };

    const cancelar = () => {
        setEditando(false);
        setError("");
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

    // En el formulario de edición los adicionales se aplican con "Actualizar búsqueda"
    const onAdicionales = (adicionales) => setF((prev) => ({ ...prev, adicionales }));

    // En la barra de búsqueda se aplican al instante: actualizan la URL y las cards recalculan
    const aplicarAdicionales = (adicionales) => {
        const { adicionales: _anteriores, ...resto } = valores;
        const texto = escribirAdicionales(adicionales);
        onActualizar({ ...resto, ...(texto && { adicionales: texto }) });
    };

    const onSubmit = (e) => {
        e.preventDefault();
        const mensaje = validarBusqueda(f, minDias);
        if (mensaje) {
            setError(mensaje);
            return;
        }
        setError("");
        const { adicionales, ...resto } = f;
        const texto = escribirAdicionales(adicionales);
        onActualizar({
            ...resto,
            lugarDevolucion: mismoLugar ? f.lugarRetiro : f.lugarDevolucion,
            ...(texto && { adicionales: texto }),
        });
        setEditando(false);
    };

    const avisos = avisosAdicionales({
        ...f,
        lugarDevolucion: mismoLugar ? f.lugarRetiro : f.lugarDevolucion,
    });

    return (
        <section className="bflota">
            <div className="bflota-wrap container">
                {!editando ? (
                    <div className="bflota-fila">
                        <div className="bflota-info">
                            <span className="bflota-eyebrow">Tu búsqueda</span>
                            {busqueda ? (
                                <>
                                <div className="bflota-datas">
                                    <div className="bflota-data">
                                        <span>Retiro</span>
                                        <strong>{busqueda.lugarRetiro} · {busqueda.retiro}</strong>
                                    </div>
                                    <div className="bflota-data">
                                        <span>Devolución</span>
                                        <strong>{busqueda.lugarDevolucion} · {busqueda.devolucion}</strong>
                                    </div>
                                    <div className="bflota-data">
                                        <span>Duración</span>
                                        <strong>{dias(busqueda.dias)}</strong>
                                    </div>
                                </div>
                                <div className="bflota-adicionales">
                                    <span className="bflota-adicionales-titulo">Adicionales</span>
                                    <SelectorAdicionales
                                        tema="oscuro"
                                        valor={busqueda.seleccionados}
                                        onChange={aplicarAdicionales}
                                    />
                                </div>
                                </>
                            ) : (
                                <p className="bflota-empty">
                                    Todavía no elegiste fechas. Elegilas para ver el total de tu viaje.
                                </p>
                            )}
                        </div>

                        <button type="button" className="bflota-btn-contorno" onClick={abrir}>
                            <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                            >
                                <path d="M12 20h9" />
                                <path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
                            </svg>
                            {busqueda ? "Modificar fechas" : "Elegir fechas"}
                        </button>
                    </div>
                ) : (
                    <form className="bflota-form" onSubmit={onSubmit}>
                        <div className="bflota-form-top">
                            <span className="bflota-eyebrow">
                                {busqueda ? "Modificar fechas" : "Elegir fechas"}
                            </span>
                            <label className="bflota-check">
                                <input type="checkbox" checked={mismoLugar} onChange={onMismoLugar} />
                                Devolver en el mismo lugar
                            </label>
                        </div>

                        <div className="bflota-groups">
                            <div className="bflota-group" role="group" aria-label="Retiro">
                                <div className="bflota-group-title">Retiro</div>
                                <div className="bflota-fields">
                                    <Campo label="Lugar de retiro">
                                        <select name="lugarRetiro" value={f.lugarRetiro} onChange={onChange}>
                                            {LUGARES.map((l) => (
                                                <option key={l}>{l}</option>
                                            ))}
                                        </select>
                                    </Campo>
                                    <Campo label="Fecha de retiro">
                                        <input
                                            type="date"
                                            name="fechaRetiro"
                                            value={f.fechaRetiro}
                                            min={hoy()}
                                            onChange={onChange}
                                            required
                                        />
                                    </Campo>
                                    <Campo label="Hora de retiro">
                                        <select name="horaRetiro" value={f.horaRetiro} onChange={onChange}>
                                            {HORAS.map((h) => (
                                                <option key={h}>{h}</option>
                                            ))}
                                        </select>
                                    </Campo>
                                </div>
                            </div>

                            <div className="bflota-group" role="group" aria-label="Devolución">
                                <div className="bflota-group-title">
                                    Devolución <small>mínimo {dias(minDias)}</small>
                                </div>
                                <div className="bflota-fields">
                                    {!mismoLugar && (
                                        <Campo label="Lugar de devolución">
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
                                    <Campo label="Fecha de devolución">
                                        <input
                                            type="date"
                                            name="fechaDevolucion"
                                            value={f.fechaDevolucion}
                                            min={f.fechaRetiro ? sumarDias(f.fechaRetiro, minDias) : hoy()}
                                            onChange={onChange}
                                            required
                                        />
                                    </Campo>
                                    <Campo label="Hora de devolución">
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
                        </div>

                        <div className="bflota-extras" role="group" aria-label="Adicionales">
                            <div className="bflota-group-title">
                                Adicionales <small>opcionales</small>
                            </div>
                            <SelectorAdicionales tema="oscuro" valor={f.adicionales} onChange={onAdicionales} />
                        </div>

                        {avisos.length > 0 && (
                            <ul className="bflota-avisos">
                                {avisos.map((t) => (
                                    <li key={t}>{t}</li>
                                ))}
                            </ul>
                        )}

                        {error && (
                            <p className="bflota-error" role="alert">
                                {error}
                            </p>
                        )}

                        <div className="bflota-actions">
                            <button type="submit" className="bflota-btn">
                                Actualizar búsqueda
                            </button>
                            <button type="button" className="bflota-btn-contorno" onClick={cancelar}>
                                Cancelar
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </section>
    );
}