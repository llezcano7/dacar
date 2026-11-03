import { Link } from "react-router-dom";
import { clausulas } from "../config/clausulas";
import "./terminos&condiciones.css";
import { waLink } from "../config/contacto"


export default function Terminos() {
    return (
        <>
            <section className="terms-hero container">
                <div className="terms-hero-crumbs">
                    <Link to="/">Inicio</Link>
                    <span>/</span>
                    <span>Términos y condiciones</span>
                </div>
                <p className="terms-hero-eyebrow uppercase">Condiciones generales de la locación</p>
                <h1 className="terms-hero-title">Términos y condiciones</h1>
                <p className="terms-hero-lead">
                    Leé estas condiciones antes de reservar. La firma del contrato implica la
                    aceptación íntegra de todas ellas.
                </p>
            </section>

            <section className="terms-body container">
                <aside className="terms-index" aria-label="Índice de cláusulas">
                    <p className="terms-index-title uppercase">Cláusulas</p>
                    <ol className="terms-index-list">
                        {clausulas.map((clausulas) => (
                            <li className="terms-index-item" key={clausulas.number}>
                                <a className="terms-index-link" href={`#clause-${clausulas.number}`}>
                                    <span className="terms-index-number">{clausulas.number}</span>
                                    <span className="terms-index-label">{clausulas.title}</span>
                                </a>
                            </li>
                        ))}
                    </ol>
                </aside>

                <div className="terms-content">
                    <p className="terms-note">
                        <strong>LOCADOR</strong> es DA'CAR. <strong>LOCATARIO</strong> es la
                        persona que alquila el vehículo. Las referencias al anverso corresponden
                        a los datos particulares de cada contrato.
                    </p>

                    {clausulas.map((clausulas) => (
                        <article className="clause" id={`clause-${clausulas.number}`} key={clausulas.number}>
                            <div className="clause-head">
                                <span className="clause-number">{clausulas.number}</span>
                                <h2 className="clause-title">{clausulas.title}</h2>
                            </div>
                            <p className="clause-text">{clausulas.text}</p>
                        </article>
                    ))}

                    <div className="terms-help">
                        <div className="terms-help-text">
                            <h2 className="terms-help-title">¿Tenés dudas sobre alguna cláusula?</h2>
                            <p className="terms-help-copy">
                                Escribinos antes de reservar y te respondemos a la brevedad.
                            </p>
                        </div>
                        <a href={waLink("Hola! Tengo una consulta sobre los términos y condiciones.")} className="terms-help-button" target="_blank" rel="noreferrer">
                            Contactanos
                        </a>
                    </div>
                </div>
            </section>
        </>
    );
}