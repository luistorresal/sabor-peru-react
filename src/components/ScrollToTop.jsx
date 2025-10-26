//src/components/ScrollToTop.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Sube al inicio cada vez que cambia la ruta
    window.scrollTo({ top: 0, left: 0, behavior: "auto" }); // o "smooth"
  }, [pathname]);

  return null;
}
