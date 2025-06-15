"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { vehiculoService } from "../../services/api"

const VehiculoDetail = () => {
  const { id } = useParams()
  const [vehiculo, setVehiculo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedImage, setSelectedImage] = useState(0)

  useEffect(() => {
    const fetchVehiculo = async () => {
      try {
        const response = await vehiculoService.getById(id)
        setVehiculo(response.data)
        setLoading(false)
      } catch (err) {
        setError("Error al cargar los detalles del vehículo")
        setLoading(false)
        console.error(err)
      }
    }

    fetchVehiculo()
  }, [id])

  const getEstadoLabel = (estado) => {
    const estados = {
      nuevo: "Nuevo",
      usado: "Usado",
      vendido: "Vendido",
    }
    return estados[estado] || estado
  }

  const getCombustibleLabel = (combustible) => {
    const combustibles = {
      gasolina: "Gasolina",
      diesel: "Diésel",
      electrico: "Eléctrico",
      hibrido: "Híbrido",
    }
    return combustibles[combustible] || combustible
  }

  const getTransmisionLabel = (transmision) => {
    const transmisiones = {
      manual: "Manual",
      automatica: "Automática",
    }
    return transmisiones[transmision] || transmision
  }

  const getBadgeClass = (estado) => {
    const clases = {
      nuevo: "badge-nuevo",
      usado: "badge-usado",
      vendido: "badge-vendido",
    }
    return clases[estado] || ""
  }

  if (loading) {
    return (
      <div className="vehiculo-detail-container">
        <div className="container">
          <div className="text-center py-5">
            <div className="loading-spinner" style={{ width: "40px", height: "40px", borderWidth: "4px" }}></div>
            <p className="mt-3">Cargando detalles del vehículo...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="vehiculo-detail-container">
        <div className="container">
          <div className="alert alert-danger">{error}</div>
        </div>
      </div>
    )
  }

  if (!vehiculo) {
    return (
      <div className="vehiculo-detail-container">
        <div className="container">
          <div className="text-center py-5">
            <h3>No se encontró el vehículo</h3>
            <Link to="/vehiculos" className="btn btn-primary mt-3">
              Volver al listado
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Preparar imágenes
  const images =
    vehiculo.imagenes && vehiculo.imagenes.length > 0
      ? vehiculo.imagenes
      : [
          `/placeholder.svg?height=600&width=800&query=car+${vehiculo.color}+${vehiculo.Modelo?.Marca?.nombre}+${vehiculo.Modelo?.nombre}`,
        ]

  return (
    <div className="vehiculo-detail-container">
      <div className="container">
        <div className="mb-4">
          <Link to="/vehiculos" className="btn btn-secondary">
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
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Volver al listado
          </Link>
        </div>

        <div className="vehiculo-detail-card">
          {/* Header más compacto */}
          <div className="vehiculo-detail-header-compact">
            <div className="vehiculo-detail-header-content-compact">
              <div className="vehiculo-detail-info-compact">
                <div className="vehiculo-detail-title-compact">
                  <h1>
                    {vehiculo.Modelo?.Marca?.nombre} {vehiculo.Modelo?.nombre}
                  </h1>
                  <p className="vehiculo-detail-subtitle-compact">
                    {vehiculo.Modelo?.anio} - {vehiculo.color}
                  </p>
                </div>
                <div className="vehiculo-detail-price-compact">€{Number(vehiculo.precio).toLocaleString()}</div>
              </div>
              <div className="vehiculo-detail-badge-compact">
                <div className={`vehiculo-badge-compact ${getBadgeClass(vehiculo.estado)}`}>
                  {getEstadoLabel(vehiculo.estado)}
                </div>
              </div>
            </div>
          </div>

          <div className="vehiculo-detail-body">
            {/* Galería de imágenes */}
            <div className="vehiculo-gallery">
              <img
                src={images[selectedImage] || "/placeholder.svg"}
                alt={`${vehiculo.Modelo?.Marca?.nombre} ${vehiculo.Modelo?.nombre}`}
                className="vehiculo-main-image"
              />

              {images.length > 1 && (
                <div className="vehiculo-thumbnails">
                  {images.map((image, index) => (
                    <img
                      key={index}
                      src={image || "/placeholder.svg"}
                      alt={`Vista ${index + 1}`}
                      className={`vehiculo-thumbnail ${selectedImage === index ? "active" : ""}`}
                      onClick={() => setSelectedImage(index)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Especificaciones mejoradas */}
            <div className="vehiculo-detail-section">
              <h2 className="vehiculo-detail-section-title">Especificaciones Técnicas</h2>
              <div className="vehiculo-detail-specs-enhanced">
                <div className="vehiculo-detail-spec-enhanced">
                  <div className="spec-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
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
                  <div className="spec-content">
                    <span className="spec-label">Marca</span>
                    <span className="spec-value">{vehiculo.Modelo?.Marca?.nombre}</span>
                  </div>
                </div>

                <div className="vehiculo-detail-spec-enhanced">
                  <div className="spec-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                    </svg>
                  </div>
                  <div className="spec-content">
                    <span className="spec-label">Modelo</span>
                    <span className="spec-value">{vehiculo.Modelo?.nombre}</span>
                  </div>
                </div>

                <div className="vehiculo-detail-spec-enhanced">
                  <div className="spec-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
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
                  </div>
                  <div className="spec-content">
                    <span className="spec-label">Año</span>
                    <span className="spec-value">{vehiculo.Modelo?.anio}</span>
                  </div>
                </div>

                <div className="vehiculo-detail-spec-enhanced">
                  <div className="spec-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M12 2a7 7 0 1 0 10 10"></path>
                    </svg>
                  </div>
                  <div className="spec-content">
                    <span className="spec-label">Color</span>
                    <span className="spec-value">{vehiculo.color}</span>
                  </div>
                </div>

                <div className="vehiculo-detail-spec-enhanced">
                  <div className="spec-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="3" y1="22" x2="21" y2="22"></line>
                      <line x1="6" y1="18" x2="6" y2="11"></line>
                      <line x1="10" y1="18" x2="10" y2="11"></line>
                      <line x1="14" y1="18" x2="14" y2="11"></line>
                      <line x1="18" y1="18" x2="18" y2="13"></line>
                    </svg>
                  </div>
                  <div className="spec-content">
                    <span className="spec-label">Combustible</span>
                    <span className="spec-value">{getCombustibleLabel(vehiculo.combustible)}</span>
                  </div>
                </div>

                <div className="vehiculo-detail-spec-enhanced">
                  <div className="spec-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="3"></circle>
                      <path d="M12 1v6m0 6v6"></path>
                      <path d="M21 12h-6m-6 0H3"></path>
                    </svg>
                  </div>
                  <div className="spec-content">
                    <span className="spec-label">Transmisión</span>
                    <span className="spec-value">{getTransmisionLabel(vehiculo.transmision)}</span>
                  </div>
                </div>

                <div className="vehiculo-detail-spec-enhanced">
                  <div className="spec-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
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
                  </div>
                  <div className="spec-content">
                    <span className="spec-label">Kilometraje</span>
                    <span className="spec-value">{vehiculo.kilometraje.toLocaleString()} km</span>
                  </div>
                </div>

                <div className="vehiculo-detail-spec-enhanced">
                  <div className="spec-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                    </svg>
                  </div>
                  <div className="spec-content">
                    <span className="spec-label">VIN</span>
                    <span className="spec-value">{vehiculo.vin}</span>
                  </div>
                </div>

                <div className="vehiculo-detail-spec-enhanced">
                  <div className="spec-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 6L9 17l-5-5"></path>
                    </svg>
                  </div>
                  <div className="spec-content">
                    <span className="spec-label">Estado</span>
                    <span className="spec-value">{getEstadoLabel(vehiculo.estado)}</span>
                  </div>
                </div>

                <div className="vehiculo-detail-spec-enhanced">
                  <div className="spec-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
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
                  <div className="spec-content">
                    <span className="spec-label">Tipo</span>
                    <span className="spec-value">{vehiculo.Modelo?.tipo}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Descripción */}
            {vehiculo.descripcion && (
              <div className="vehiculo-detail-section">
                <h2 className="vehiculo-detail-section-title">Descripción</h2>
                <p className="vehiculo-detail-description">{vehiculo.descripcion}</p>
              </div>
            )}

            {/* Acciones */}
            <div className="vehiculo-detail-section">
              <div className="d-flex gap-3">
                <Link to={`/vehiculos/editar/${vehiculo.id}`} className="btn btn-primary">
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
                  Editar Vehículo
                </Link>
                <Link to="/vehiculos" className="btn btn-secondary">
                  Volver al Listado
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VehiculoDetail
