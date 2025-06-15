"use client"

import { useState, useEffect, useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import { marcaService } from "../../services/api"
import { AuthContext } from "../../context/AuthContext"

const MarcasPublic = () => {
  const [marcas, setMarcas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { isAdmin } = useContext(AuthContext)
  const navigate = useNavigate()

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

  const handleVerVehiculos = (marcaNombre) => {
    // Redirigir a vehículos con filtro de marca
    navigate(`/vehiculos?marca=${encodeURIComponent(marcaNombre)}`)
  }

  if (loading) {
    return (
      <div className="marcas-public-container">
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
      <div className="marcas-public-container">
        <div className="container">
          <div className="alert alert-danger">{error}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="marcas-public-container">
      <div className="container">
        <div className="marcas-public-header">
          <h1 className="marcas-public-title">Nuestras Marcas</h1>
          <p className="marcas-public-subtitle">
            Descubre todas las marcas de vehículos que tenemos disponibles en nuestro concesionario
          </p>
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
            <h3>No hay marcas disponibles</h3>
            <p className="text-muted">Actualmente no tenemos marcas registradas en nuestro sistema.</p>
          </div>
        ) : (
          <div className="marcas-public-grid">
            {marcas.map((marca) => (
              <div key={marca.id} className="marca-public-card">
                <div className="marca-public-logo">
                  {marca.logo ? (
                    <img
                      src={marca.logo || "/placeholder.svg"}
                      alt={`Logo de ${marca.nombre}`}
                      className="marca-logo-image"
                      onError={(e) => {
                        e.target.style.display = "none"
                        e.target.nextSibling.style.display = "flex"
                      }}
                    />
                  ) : null}
                  <div className="marca-logo-placeholder" style={{ display: marca.logo ? "none" : "flex" }}>
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
                      <path d="M7 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
                      <path d="M17 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
                      <path d="M5 17h-2v-6l2-5h9l4 5h1a2 2 0 0 1 2 2v4h-2m-4 0h-6m-6 -6h15m-6 0v-5"></path>
                    </svg>
                  </div>
                </div>
                <div className="marca-public-content">
                  <h3 className="marca-public-name">{marca.nombre}</h3>
                  <div className="marca-public-info">
                    <div className="marca-info-item">
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
                        <circle cx="12" cy="10" r="3"></circle>
                        <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 7 8 11.7z"></path>
                      </svg>
                      <span className="marca-info-label">País de origen:</span>
                      <span className="marca-info-value">{marca.pais || "No especificado"}</span>
                    </div>
                    <div className="marca-info-item">
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
                        <path d="M19 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"></path>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                      <span className="marca-info-label">Registrada:</span>
                      <span className="marca-info-value">{new Date(marca.createdAt).toLocaleDateString("es-ES")}</span>
                    </div>
                  </div>
                  <div className="marca-public-actions">
                    <button className="btn-ver-vehiculos" onClick={() => handleVerVehiculos(marca.nombre)}>
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
                        style={{ marginRight: "8px" }}
                      >
                        <path d="M7 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
                        <path d="M17 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
                        <path d="M5 17h-2v-6l2-5h9l4 5h1a2 2 0 0 1 2 2v4h-2m-4 0h-6m-6 -6h15m-6 0v-5"></path>
                      </svg>
                      Ver Vehículos
                    </button>

                    {isAdmin() && (
                      <Link to={`/marcas/editar/${marca.id}`} className="btn-editar-marca">
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
                          style={{ marginRight: "8px" }}
                        >
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                        Editar Marca
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MarcasPublic
