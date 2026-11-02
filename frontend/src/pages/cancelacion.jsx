import { Link } from "react-router-dom";
import { Cancelacion as policies } from "../config/cancelacion";
import "./cancelacion.css";

export default function Cancelacion() {
    return (
        <>
            <section className="cancel-hero container">
                <div className="cancel-hero-crumbs">
                    <Link to="/">Inicio</Link>
                    <span>/</span>
                    <span>Política de cancelación</span>
                </div>
                <p className="cancel-hero-eyebrow uppercase">Antes de reservar</p>
                <h1 className="cancel-hero-title">Política de cancelación</h1>
                <p className="cancel-hero-lead">
                    El costo de cancelar depende de cuándo avisás respecto de la fecha de
                    entrega del vehículo.
                </p>
                <div className="cancel-body">
                    <ol className="cancel-list">
                        {policies.map((policy) => (
                            <li
                                className={`cancel-card cancel-level-${policy.number}`}
                                key={policy.number}
                            >
                                <div className="cancel-card-head">
                                    <div className="cancel-meter" aria-hidden="true">
                                        {policies.map((item) => (
                                            <span
                                                className={
                                                    item.number <= policy.number
                                                        ? "cancel-meter-step cancel-meter-step-on"
                                                        : "cancel-meter-step"
                                                }
                                                key={item.number}
                                            />
                                        ))}
                                    </div>
                                    <span className="cancel-badge">{policy.subtitle}</span>
                                </div>
                                <h2 className="cancel-card-title">{policy.title}</h2>
                                <p className="cancel-card-text">{policy.text}</p>
                            </li>
                        ))}
                    </ol>
                </div>
            </section>
        </>
    );
}