// src/components/ToastNotification.jsx
import React from "react";
import "./ToastNotification.css"; // Estilos (lo creamos más abajo)

export default function ToastNotification({ show, message }) {
  return (
    <div className={`toast-container ${show ? "show" : ""}`}>
      <div className="toast-message">
        {message}
      </div>
    </div>
  );
}
