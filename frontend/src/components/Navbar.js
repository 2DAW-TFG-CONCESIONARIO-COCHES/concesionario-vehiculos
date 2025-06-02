"use client"

import { useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"

const Navbar = () => {
  const { isAuthenticated, isAdmin, logout, user } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <nav className="navbar">
      <div className="navbar-container container">
        <div className="navbar-logo">
          <Link to="/">Concesionario</Link>
        </div>
        <div className="navbar-links">
          <Link to="/vehiculos">Vehículos</Link>

          {isAuthenticated() ? (
            <>
              {isAdmin() && (
                <>
                  <Link to="/marcas">Marcas</Link>
                  <Link to="/modelos">Modelos</Link>
                </>
              )}
              <span>Hola, {user?.nombre}</span>
              <button onClick={handleLogout} className="btn btn-link">
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Iniciar sesión</Link>
              <Link to="/register">Registrarse</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
