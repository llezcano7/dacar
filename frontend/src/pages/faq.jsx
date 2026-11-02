import { useState } from "react";
import { configPorDefecto } from "../config/configAlquiler.js";
import { preguntas } from "../config/faq.js";
import { waLink } from "../config/contacto.js";
import "./faq.css";

// Resalta los [PLACEHOLDERS] pendientes de completar
const conPendientes = (texto) =>
   texto.split(/(\[[^\]]+\])/).map((t, i) =>
      t.startsWith("[") ? <mark key={i}>{t}</mark> : t
   );

export default function Faq({ config = configPorDefecto }) {
   const items = preguntas(config);
   const [abierta, setAbierta] = useState(items[0]?.id);

   return (
      <section className="faq" id="faq">
         <div className="container faq-content">
            <div className="faq-lateral">
               <span className="faq-eyebrow uppercase faq-eyebrow-clear">Preguntas frecuentes</span>
               <h2>Despejá todas tus dudas antes de contratar</h2>
               <p>Si no encontrás la respuesta a tu preguntas, escribinos y te respondemos a la brevedad.</p>
               <a href={waLink("Hola! Tengo una consulta.")} className="faq-btn" target="_blank" rel="noreferrer">
                  Consultar por WhatsApp
               </a>
            </div>

            <div className="faq-list">
               {items.map((q) => {
                  const open = abierta === q.id;
                  return (
                     <div key={q.id} className={`faq-item${open ? " faq-item-open" : ""}`}>
                        <h3>
                           <button type="button" aria-expanded={open} aria-controls={`faq-${q.id}`}
                              id={`faq-btn-${q.id}`} onClick={() => setAbierta(open ? null : q.id)}>
                              {q.pregunta}
                              <span className="faq-mas" aria-hidden="true" />
                           </button>
                        </h3>
                        <div id={`faq-${q.id}`} role="region" aria-labelledby={`faq-btn-${q.id}`} hidden={!open}>
                           <div>
                              <p>{conPendientes(q.respuesta)}</p>
                           </div>
                        </div>
                     </div>
                  );
               })}
            </div>
         </div>
      </section>
   );
}