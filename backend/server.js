import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import rateLimit from "express-rate-limit";

dotenv.config({ quiet: true });

const {
   GMAIL_USER,
   GMAIL_APP_PASSWORD,
   FRONT_URL,
   NAME = "Da'car rent a car",
   TIEMPO_RESPUESTA = "24 horas",
   PORT = 3001,
} = process.env;

if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
   console.error("Faltan GMAIL_USER o GMAIL_APP_PASSWORD en el .env");
   process.exit(1);
}

const MOTIVOS = ["Consulta general", "Cotización", "Reserva existente", "Otro"];

const app = express();
app.set("trust proxy", 1); // necesario detrás de Render/Railway/Nginx para que el rate limit vea la IP real
app.use(express.json({ limit: "10kb" }));
app.use(cors({ origin: FRONT_URL }));

const transporter = nodemailer.createTransport({
   service: "gmail",
   auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
});

// 5 envíos cada 15 minutos por IP
const limiter = rateLimit({
   windowMs: 15 * 60 * 1000,
   limit: 5,
   message: { ok: false, error: "Demasiados intentos, probá más tarde." },
});

const escapeHtml = (s = "") =>
   String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

// Evita inyección de cabeceras: sin saltos de línea en campos que van a headers
const sinSaltos = (s = "") => String(s).replace(/[\r\n]+/g, " ").trim();

app.get("/health", (_req, res) => res.json({ ok: true }));

app.post("/contacto", limiter, async (req, res) => {
   const { nombre, email, telefono, motivo, mensaje, web } = req.body ?? {};

   // Honeypot: los bots completan este campo oculto
   if (web) return res.json({ ok: true });

   const valido =
      typeof nombre === "string" && nombre.trim() && nombre.length <= 100 &&
      typeof mensaje === "string" && mensaje.trim() && mensaje.length <= 3000 &&
      typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 150 &&
      MOTIVOS.includes(motivo) &&
      (telefono === undefined || (typeof telefono === "string" && telefono.length <= 40));

   if (!valido) return res.status(400).json({ ok: false, error: "Datos inválidos." });

   const nombreLimpio = sinSaltos(nombre);
   const emailLimpio = sinSaltos(email);
   const telLimpio = sinSaltos(telefono || "");

   try {
      // 1) Aviso interno a la casilla de la empresa
      await transporter.sendMail({
         from: `"Web ${NAME}" <${GMAIL_USER}>`,
         to: GMAIL_USER,
         replyTo: `"${nombreLimpio.replace(/"/g, "")}" <${emailLimpio}>`,
         subject: `Consulta web: ${motivo} - ${nombreLimpio}`,
         text:
            `Nombre: ${nombreLimpio}\n` +
            `Email: ${emailLimpio}\n` +
            `Teléfono: ${telLimpio || "-"}\n` +
            `Motivo: ${motivo}\n\n` +
            `${mensaje}`,
      });
   } catch (err) {
      console.error("Error enviando aviso interno:", err);
      return res.status(500).json({ ok: false, error: "No se pudo enviar." });
   }

   // 2) Respuesta automática al cliente.
   // Si falla, igual respondemos ok: la consulta ya llegó a la empresa.
   try {
      await transporter.sendMail({
         from: `"${NAME}" <${GMAIL_USER}>`,
         to: emailLimpio,
         replyTo: GMAIL_USER,
         subject: `Recibimos tu consulta - ${NAME}`,
         text:
            `Hola ${nombreLimpio}!\n\n` +
            `Recibimos tu consulta (${motivo}) y te vamos a responder en ${TIEMPO_RESPUESTA}.\n\n` +
            `Este es un mensaje automático, no hace falta que lo respondas.\n\n` +
            `Saludos,\n${NAME}`,
         html:
            `<div style="font-family:Arial,sans-serif;max-width:480px;line-height:1.5;color:#222">` +
            `<p>Hola <strong>${escapeHtml(nombreLimpio)}</strong>!</p>` +
            `<p>Recibimos tu consulta (<em>${escapeHtml(motivo)}</em>) y te vamos a responder en ${escapeHtml(TIEMPO_RESPUESTA)}.</p>` +
            `<p style="color:#666;font-size:13px">Este es un mensaje automático, no hace falta que lo respondas.</p>` +
            `<p>Saludos,<br>${escapeHtml(NAME)}</p>` +
            `</div>`,
         headers: { "Auto-Submitted": "auto-replied" },
      });
   } catch (err) {
      console.error("Error enviando respuesta automática:", err);
   }

   res.json({ ok: true });
});

app.listen(PORT, () => console.log(`API escuchando en el puerto ${PORT}`));