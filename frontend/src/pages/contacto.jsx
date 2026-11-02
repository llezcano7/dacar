import { useState } from "react";
import { contacto, waLink } from "../config/contacto.js";
import SeccionAnimada from "../components/seccionanimada.jsx"
import "./contacto.css";


const MOTIVOS = ["Consulta general", "Cotización", "Reserva existente", "Otro"];

const Icon = ({ children }) => (
   <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>
);

const Medio = ({ icono, titulo, valor, href }) => (
   <li className="contact-medio">
      <span className="contact-icon">{icono}</span>
      <div>
         <div className="contact-medio-title">{titulo}</div>
         {href ? <a href={href}>{valor}</a> : <div className="contact-medio-value">{valor}</div>}
      </div>
   </li>
);

const INICIAL = { nombre: "", email: "", telefono: "", motivo: MOTIVOS[0], mensaje: "", web: "" };

export default function Contacto() {
   console.log(import.meta.env);

   const [f, setF] = useState(INICIAL);
   const [estado, setEstado] = useState("idle"); // idle | enviando | ok | error
   const onChange = (e) => setF((p) => ({ ...p, [e.target.name]: e.target.value }));


   const onSubmit = async (e) => {
      e.preventDefault();
      setEstado("enviando");
      try {
         const res = await fetch(`${import.meta.env.VITE_API_URL}/contacto`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(f),
         });
         if (res.ok) { setEstado("ok"); setF(INICIAL); }
         else setEstado("error");
      } catch {
         setEstado("error");
      }
   };

   return (
      <section className="contact-section container" id="contacto">
         <SeccionAnimada
                 id="servicios-adicionales"
                 sobretitulo="Preguntas frecuentes"
                 titulo="Hablemos de"
                 destacado="tu viaje"
                 subtitulo="Escribinos y te ayudamos a elegir el auto que necesitás."
               ></SeccionAnimada>
         <div className="contact-content">
            <div className="contact-grilla">
               <ul className="contact-medios">
                  <Medio icono={<Icon><path d="M4 5h16v11H9l-5 4V5z" /></Icon>} titulo="WhatsApp" valor={contacto.whatsappTexto} href={waLink()} />
                  <Medio icono={<Icon><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></Icon>} titulo="Email" valor={contacto.email} />
                  <Medio icono={<Icon><path d="M12 21s7-6.2 7-11a7 7 0 10-14 0c0 4.8 7 11 7 11z" /><circle cx="12" cy="10" r="2.5" /></Icon>} titulo="Dirección" valor={contacto.direccion} />
                  <Medio icono={<Icon><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></Icon>} titulo="Horarios de atención comercial" valor={contacto.horarioAtencion} />
               </ul>

               <form className="contact-form" onSubmit={onSubmit}>
                  <label className="contact-field">Nombre
                     <input name="nombre" value={f.nombre} onChange={onChange} required autoComplete="name" />
                  </label>
                  <div className="contact-dos">
                     <label className="contact-field">Email
                        <input type="email" name="email" value={f.email} onChange={onChange} required autoComplete="email" />
                     </label>
                     <label className="contact-field">Teléfono
                        <input type="tel" name="telefono" value={f.telefono} onChange={onChange} autoComplete="tel" />
                     </label>
                  </div>
                  <label className="contact-field">Motivo
                     <select name="motivo" value={f.motivo} onChange={onChange}>
                        {MOTIVOS.map((m) => <option key={m}>{m}</option>)}
                     </select>
                  </label>
                  <label className="contact-field">Mensaje
                     <textarea name="mensaje" rows="4" value={f.mensaje} onChange={onChange} required />
                  </label>
                  <input name="web" value={f.web} onChange={onChange} tabIndex={-1}
                     autoComplete="off" className="contact-hp" aria-hidden="true" />
                  <button type="submit" className="contact-btn contact-send" disabled={estado === "enviando"}>
                     {estado === "enviando" ? "Enviando..." : "Enviar consulta"}
                  </button>
                  {estado === "ok" && (
                     <p className="contact-status contact-status-ok">¡Listo! Recibimos tu consulta, revisá tu email.</p>
                  )}
                  {estado === "error" && (
                     <p className="contact-status contact-status-error">
                        No pudimos enviarla. Probá de nuevo o escribinos por <a href={waLink()}>WhatsApp</a>.
                     </p>
                  )}
                  <p className="contact-note">Respondemos en {contacto.tiempoRespuesta}.</p>
               </form>
            </div>

            <div className="contact-map">
               <iframe
                  src={contacto.mapaUrl}
                  title="Ubicación de Da'car en Bariloche"
                  className="contact-map"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
               />
            </div>
         </div>
      </section>
   );
}