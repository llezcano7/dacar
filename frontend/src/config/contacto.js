export const contacto = {
    whatsapp: "5492944585451", // solo dígitos, con código de país (549 + área + número)
    whatsappTexto: "+54 9 294 4585451",
    telefono: "5492944585451",
    email: "reservas@dacarrentacar.com",
    direccion: "Quaglia 161, San Carlos de Bariloche",
    horarioAtencion: "9 a 18hs",
    tiempoRespuesta: "15min",
    mapaUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3005.0585085057537!2d-71.308463!3d-41.1332487!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x961a7bc18778370f%3A0x3682fd2578d283a3!2sDa'%20car%20rent%20a%20car!5e0!3m2!1ses!2sar!4v1793389615036!5m2!1ses!2sar",
}

export const waLink = (texto = "") =>
    `https://wa.me/${contacto.whatsapp}${texto ? `?text=${encodeURIComponent(texto)}` : ""}`;