//Footer
export default function Footer() {
  return (
    <footer className="bg-dark text-light mt-5">
      <div className="container py-4 d-flex flex-column flex-md-row justify-content-between gap-3">
        <div>
          <h5 className="mb-2">Sabor Perú</h5>
          <small>© {new Date().getFullYear()} Todos los derechos reservados.</small>
        </div>
        <div>
          <ul className="list-unstyled mb-0">
            <li><a className="link-light text-decoration-none" href="/quienes-somos">¿Quiénes somos?</a></li>
            <li><a className="link-light text-decoration-none" href="/productos">Productos</a></li>
            <li><a className="link-light text-decoration-none" href="/login">Ingresar</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
