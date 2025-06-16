"use client"

import { useState, useEffect, useContext } from "react"
import { Link } from "react-router-dom"
import { marcaService } from "../../services/api"
import { AuthContext } from "../../context/AuthContext"

const MarcasList = () => {
  const [marcas, setMarcas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { isAdmin } = useContext(AuthContext)

  useEffect(() => {
    const fetchMarcas = async () => {
      try {
        const response = await marcaService.getAll()
        setMarcas(response.data)
        setLoading(false)
      } catch (err) {
        setError("Error al cargar las marcas")
        setLoading(false)
        console.error(err)
      }
    }

    fetchMarcas()
  }, [])

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta marca?")) {
      try {
        await marcaService.delete(id)
        setMarcas(marcas.filter((marca) => marca.id !== id))
      } catch (err) {
        setError("Error al eliminar la marca")
        console.error(err)
      }
    }
  }

  if (loading) {
    return (
      <div className="marcas-list">
        <div className="container">
          <div className="text-center py-5">
            <div className="loading-spinner" style={{ width: "40px", height: "40px", borderWidth: "4px" }}></div>
            <p className="mt-3">Cargando marcas...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="marcas-list">
        <div className="container">
          <div className="alert alert-danger">{error}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="marcas-list">
      <div className="container">
        <div className="marcas-header">
          <h1 className="marcas-title">{isAdmin() ? "Gestión de Marcas" : "Marcas de Vehículos"}</h1>
          <p className="marcas-subtitle">
            {isAdmin()
              ? "Administra las marcas de vehículos disponibles en el concesionario"
              : "Explora las marcas de vehículos disponibles en el concesionario"}
          </p>
          {isAdmin() && (
            <Link to="/marcas/nueva" className="btn btn-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Añadir Nueva Marca
            </Link>
          )}
        </div>

        {marcas.length === 0 ? (
          <div className="text-center py-5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#667eea"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ marginBottom: "1rem" }}
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <h3>No hay marcas registradas</h3>
            <p className="text-muted">Las marcas aparecerán aquí cuando se registren en el sistema.</p>
            {isAdmin() && (
              <Link to="/marcas/nueva" className="btn btn-primary mt-3">
                Crear Primera Marca
              </Link>
            )}
          </div>
        ) : (
          <div className="marcas-grid">
            {marcas.map((marca) => (
              <div key={marca.id} className="marca-card">
                <div className="marca-logo-container">
                  {marca.logo && marca.logo.trim() !== "" ? (
                    <img
                      src={marca.logo || "/placeholder.svg"}
                      alt={`Logo de ${marca.nombre}`}
                      className="marca-logo"
                      onError={(e) => {
                        e.target.style.display = "none"
                        e.target.nextSibling.style.display = "flex"
                      }}
                    />
                  ) : null}
                  <div
                    className="marca-logo-placeholder"
                    style={{ display: marca.logo && marca.logo.trim() !== "" ? "none" : "flex" }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="48"
                      height="48"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <circle cx="8.5" cy="8.5" r="1.5"></circle>
                      <polyline points="21 15 16 10 5 21"></polyline>
                    </svg>
                  </div>
                </div>

                <div className="marca-content">
                  <h3 className="marca-name">{marca.nombre}</h3>

                  <div className="marca-info">
                    <div className="marca-info-item">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="2" y1="12" x2="22" y2="12"></line>
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                      </svg>
                      <span className="marca-info-label">País:</span>
                      <span className="marca-info-value">{marca.pais || "No especificado"}</span>
                    </div>

                    <div className="marca-info-item">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                      <span className="marca-info-label">Creada:</span>
                      <span className="marca-info-value">{new Date(marca.createdAt).toLocaleDateString("es-ES")}</span>
                    </div>
                  </div>

                  {isAdmin() && (
                    <div className="marca-actions">
                      <Link to={`/marcas/editar/${marca.id}`} className="btn btn-primary">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                        Editar
                      </Link>
                      <button onClick={() => handleDelete(marca.id)} className="btn btn-danger">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          <line x1="10" y1="11" x2="10" y2="17"></line>
                          <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>
                        Eliminar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MarcasList
