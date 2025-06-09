"use client"

import { useContext } from "react"
import { Link } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"

const Home = () => {
  const { isAuthenticated, user, isAdmin } = useContext(AuthContext)

  return (
    <div className="home">
      <h1>Sistema de Gestión de Vehículos</h1>
      <p>
        Bienvenido al sistema integral de gestión para concesionarios de vehículos. Administra tu inventario, marcas,
        modelos y vehículos de manera eficiente.
      </p>

      {isAuthenticated() ? (
        <div>
          <h2>¡Hola, {user?.nombre}!</h2>
          <p>¿Qué te gustaría hacer hoy?</p>
          <div className="home-links">
            <Link to="/vehiculos" className="btn btn-primary" style={{ marginRight: "1rem" }}>
              Ver Vehículos
            </Link>
            {isAdmin() && (
              <>
                <Link to="/marcas" className="btn btn-primary" style={{ marginRight: "1rem" }}>
                  Gestionar Marcas
                </Link>
                <Link to="/modelos" className="btn btn-primary">
                  Gestionar Modelos
                </Link>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="home-links">
          <Link to="/vehiculos" className="btn btn-primary" style={{ marginRight: "1rem" }}>
            Ver Catálogo
          </Link>
          <Link to="/login" className="btn btn-primary">
            Iniciar Sesión
          </Link>
        </div>
      )}
    </div>
  )
}

export default Home
