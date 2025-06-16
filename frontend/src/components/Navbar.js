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
          <Link to="/">Concesionario Batoi</Link>
        </div>
        <div className="navbar-links">
          <Link to="/vehiculos">Vehículos</Link>

          {isAuthenticated() ? (
            <>
              {isAuthenticated() && (
                <>
                  <Link to="/marcas">Marcas</Link>
                  <Link to="/modelos">Modelos</Link>
                  {isAdmin() && <Link to="/usuarios">Usuarios</Link>}
                </>
              )}
              <span className="user-greeting">Hola, {user?.nombre}</span>
              <button onClick={handleLogout} className="btn btn-logout">
                Cerrar sesión
              </button>
            </>
          ) : (
            <Link to="/login" className="btn btn-login">
              Iniciar sesión
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
