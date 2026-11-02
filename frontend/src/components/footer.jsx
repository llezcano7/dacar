import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./footer.css";

const NAV_LINKS = [
  { label: "Inicio", to: "/" },
  { label: "Flota", to: "/flota" },
  { label: "FAQ", to: "/preguntas-frecuentes" },
  { label: "Contacto", to: "/contacto" },
];

const LEGAL_LINKS = [
  { label: "Términos y condiciones", to: "/terminos-y-condiciones" },
  { label: "Política de privacidad", to: "/politica-de-privacidad" },
  { label: "Política de cancelación", to: "/politica-de-cancelacion" },
  { label: "Preguntas frecuentes", to: "/preguntas-frecuentes" },
];

// Reemplazá los "#" por las URLs reales
const SOCIALS = [
  { label: "Instagram", href: "https://www.instagram.com/dacarrentacar/", path: "M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm5 5.5A4.5 4.5 0 1 0 12 16.5 4.5 4.5 0 0 0 12 7.5Zm0 2A2.5 2.5 0 1 1 12 14.5 2.5 2.5 0 0 1 12 9.5Zm5.2-3.2a1.1 1.1 0 1 0 0 2.2 1.1 1.1 0 0 0 0-2.2Z" },
  { label: "Facebook", href: "https://www.facebook.com/profile.php?id=61563255663766", path: "M14 8V6.5c0-.8.2-1.2 1.4-1.2H17V2h-2.6C11.2 2 10 3.7 10 6.2V8H7.5v3.3H10V22h4V11.3h2.8L17.2 8H14Z" },
  { label: "WhatsApp", href: "https://api.whatsapp.com/send/?phone=5492944585451&text&type=phone_number&app_absent=0", path: "M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.2 14c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.2-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.8s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.4 0 .6l-.4.6c-.2.2-.3.4-.1.7.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.1.5.1.6-.1l.9-1.1c.2-.3.4-.2.6-.1l2 .9c.3.1.5.2.5.4.1.2.1.8-.1 1.4Z" },
];


function Icon({ path, size = 20 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d={path} />
    </svg>
  );
}

export default function Footer() {
  const footerRef = useRef(null);
  const [visible, setVisible] = useState(false);

  // Dispara la animación de entrada cuando el footer aparece en pantalla
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    if (footerRef.current) observer.observe(footerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <footer ref={footerRef} className={`footer  ${visible ? "footer--visible" : ""}`}>
      {/* Ruta animada con autito */}
      <div className="footer-road" aria-hidden="true">
        <svg className="footer-car" viewBox="0 0 64 28" width="56" height="24">
          <path
            fill="currentColor"
            d="M6 20v-5c0-1.5 1-2.8 2.4-3.2l6-1.8 5-5.5c.6-.7 1.5-1 2.4-1h13c1 0 1.900.4 2.500 1.100L44 10l9 1.600c1.700.3 3 1.800 3 3.500V20h-3.300a5 5 0 0 0-9.400 0H19.700a5 5 0 0 0-9.400 0H6Z"
          />
          <circle cx="15" cy="21" r="4" fill="#262626" stroke="currentColor" strokeWidth="2" />
          <circle cx="48" cy="21" r="4" fill="#262626" stroke="currentColor" strokeWidth="2" />
        </svg>
      </div>

      {/* Franja de beneficios */}
      <ul className="footer-perks container">
        <li>Km ilimitado</li>
        <li>Promociones todo el año</li>
        <li>Seguro incluido</li>
        <li>Atención por WhatsApp</li>
      </ul>

      <div className="footer-grid container">
        <div className="footer-col footer-col--brand" style={{ "--i": 0 }}>
          <div className="footer-logo">
            <img src="/dacar-logoALT.png" alt="logo da'car rent a car footer" srcset="" />
          </div>
          <p className="footer-text">
            Alquiler de autos en San Carlos de Bariloche.
            <br />
            Recorré la Patagonia con libertad y  a tu ritmo.
          </p>
          <div className="footer-socials">
            {SOCIALS.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="footer-social">
                <Icon path={s.path} />
              </a>
            ))}
          </div>
        </div>

        <nav className="footer-col" style={{ "--i": 1 }} aria-label="Navegación">
          <h3 className="footer-title uppercase">Navegación</h3>
          <ul className="footer-list">
            {NAV_LINKS.map((l) => (
              <li key={l.label}><Link to={l.to} className="footer-link">{l.label}</Link></li>
            ))}
          </ul>
        </nav>

        <nav className="footer-col" style={{ "--i": 2 }} aria-label="Legales">
          <h3 className="footer-title uppercase">Información</h3>
          <ul className="footer-list">
            {LEGAL_LINKS.map((l) => (
              <li key={l.label}><Link to={l.to} className="footer-link">{l.label}</Link></li>
            ))}
            {/* Obligatorios en sitios comerciales de Argentina */}
            <li>
              <a className="footer-link" href="https://www.argentina.gob.ar/produccion/defensadelconsumidor/formulario" target="_blank" rel="noopener noreferrer">
                Defensa del Consumidor
              </a>
            </li>
          </ul>
        </nav>

        <div className="footer-col" style={{ "--i": 3 }}>
          <h3 className="footer-title uppercase">Contacto</h3>
          <ul className="footer-list footer-list--contact">
            <li>San Carlos de Bariloche, Río Negro</li>
            <li> <a href="https://www.google.com/maps/place/Quaglia+161,+San+Carlos+de+Bariloche,+R%C3%ADo+Negro/@-41.306111, -71.548611, 17z/data=!3m1!4b1!4m5!3m4!1s0xb352c9d8d8d8d8d8:0x8d8d8d8d8d8d8d8d!8m2!3d-41.306111!4d-71.548611">Quaglia 161, CP 8400</a></li>
            <li><a className="footer-link" href="tel:+540000000000">+54 9 2944585451</a></li>
            <li><a className="footer-link" href="mailto:info@dacar.com.ar">reservas@dacarrentacar.com</a></li>
            <li>Lun a Dom · 9:00 a 18:00</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom container">
        <p>© {new Date().getFullYear()} DA'CAR rent a car Todos los derechos reservados.</p>
        <p>Design created by <a href="https://www.flexmedia.com.ar">FLEXMEDIA</a></p>
      </div>
    </footer>
  );
}