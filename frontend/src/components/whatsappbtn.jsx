import React from "react";
import { FaWhatsapp } from "react-icons/fa";
import "./whatsappbtn.css";

export default function WhatsappButton() {
  const phoneNumber = "5492944585451";
  const whatsappUrl = `https://wa.me/${phoneNumber}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-button"
      aria-label="Contactar por WhatsApp"
    >
      <FaWhatsapp className="whatsapp-icon" />
    </a>
  );
}