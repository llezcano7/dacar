import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { HiOutlineMenu } from "react-icons/hi";
import { FiX } from "react-icons/fi";
import { FaInstagram, FaFacebookSquare } from "react-icons/fa";
import "./header.css";

const links = [
    { to: "/", label: "Inicio" },
    { to: "/flota", label: "Flota" },
    { to: "/adicionales", label: "Adicionales" },
    { to: "/preguntas-frecuentes", label: "FAQ" },
    { to: "/contacto", label: "Contacto" },
];

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const navRef = useRef(null);

    const toggleMenu = () => setIsOpen((prev) => !prev);
    const closeMenu = () => setIsOpen(false);

    // Bloquea el scroll del body mientras el menú está abierto
    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    // Cierra con la tecla Escape
    useEffect(() => {
        const handleKey = (e) => e.key === "Escape" && setIsOpen(false);
        document.addEventListener("keydown", handleKey);
        return () => document.removeEventListener("keydown", handleKey);
    }, []);

    return (
        <>
            <div className="top-header">
                <p>20% OFF en toda la flota - mínimo 3 días de alquiler</p>
            </div>

            <header className="header-section container" ref={navRef}>
                <Link to="/" onClick={closeMenu}>
                    <img
                        className="logo"
                        src="/dacar-logo.png"
                        alt="logo principal de Da'car rent a car"
                    />
                </Link>

                {/* Fondo oscuro detrás del menú (solo mobile) */}
                <div
                    className={`nav-overlay ${isOpen ? "open" : ""}`}
                    onClick={closeMenu}
                />

                <nav id="main-nav" className={`navigator ${isOpen ? "open" : ""}`}>
                    {links.map((link, i) => (
                        <Link
                            key={link.to}
                            to={link.to}
                            onClick={closeMenu}
                            style={{ "--i": i }}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                <div className="media-wrapper">
                    <a
                        href="https://www.instagram.com/dacarrentacar/"
                        target="_blank"
                        rel="noreferrer"
                        aria-label="Instagram"
                    >
                        <FaInstagram className="media-icons" />
                    </a>
                    <a
                        href="https://www.facebook.com/profile.php?id=61563255663766"
                        target="_blank"
                        rel="noreferrer"
                        aria-label="Facebook"
                    >
                        <FaFacebookSquare className="media-icons" />
                    </a>
                </div>

                <button
                    className="hamburger"
                    onClick={toggleMenu}
                    aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
                    aria-expanded={isOpen}
                    aria-controls="main-nav"
                >
                    {/* key fuerza a React a remontar el ícono y reiniciar la animación */}
                    {isOpen ? (
                        <FiX key="close" size={30} className="hamburger-icon" />
                    ) : (
                        <HiOutlineMenu key="open" size={30} className="hamburger-icon" />
                    )}
                </button>
            </header>
        </>
    );
}