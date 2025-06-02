import { Link } from "react-router-dom"

const NotFound = () => {
  return (
    <div className="not-found">
      <h1>404 - Página no encontrada</h1>
      <p>La página que estás buscando no existe.</p>
      <Link to="/" className="btn btn-primary">
        Volver al inicio
      </Link>
    </div>
  )
}

export default NotFound
