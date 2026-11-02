import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/header";
import Inicio from "./pages/inicio";
import Flota from "./pages/flota";
import Adicionales from "./pages/adicionales";
import Faq from "./pages/faq"
import Contacto from "./pages/contacto";
import Footer from "./components/footer";
import Terminos from "./pages/terminos&condiciones";
import Cancelacion from "./pages/cancelacion";
import WhatsappButton from "./components/whatsappbtn"
import ScrollToTop from "./components/scrolltotop"
import "./library.css"
import "./reset.css"


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
        <ScrollToTop />
        <Header />
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/flota" element={<Flota />} />
          <Route path="/adicionales" element={<Adicionales />} />
          <Route path="/preguntas-frecuentes" element={<Faq />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/terminos-y-condiciones" element={<Terminos />} />
          <Route path="/politica-de-cancelacion" element={<Cancelacion />} />
        </Routes>
        <Footer />
        <WhatsappButton />
      </BrowserRouter>
    </>
  )
}

export default App
