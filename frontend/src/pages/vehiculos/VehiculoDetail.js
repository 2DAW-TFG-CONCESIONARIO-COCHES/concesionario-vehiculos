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
          <div className="vehiculo-detail-header">
            <div
              className={`vehiculo-badge ${getBadgeClass(vehiculo.estado)}`}
              style={{ position: "absolute", top: "1rem", left: "2rem" }}
            >
              {getEstadoLabel(vehiculo.estado)}
            </div>
            <h1 className="vehiculo-detail-title">
              {vehiculo.Modelo?.Marca?.nombre} {vehiculo.Modelo?.nombre}
            </h1>
            <p className="vehiculo-detail-subtitle">
              {vehiculo.Modelo?.anio} - {vehiculo.color}
            </p>
            <div className="vehiculo-detail-price">€{Number(vehiculo.precio).toLocaleString()}</div>
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

            {/* Especificaciones */}
            <div className="vehiculo-detail-section">
              <h2 className="vehiculo-detail-section-title">Especificaciones</h2>
              <div className="vehiculo-detail-specs">
                <div className="vehiculo-detail-spec">
                  <span className="vehiculo-detail-spec-label">Marca</span>
                  <span className="vehiculo-detail-spec-value">{vehiculo.Modelo?.Marca?.nombre}</span>
                </div>
                <div className="vehiculo-detail-spec">
                  <span className="vehiculo-detail-spec-label">Modelo</span>
                  <span className="vehiculo-detail-spec-value">{vehiculo.Modelo?.nombre}</span>
                </div>
                <div className="vehiculo-detail-spec">
                  <span className="vehiculo-detail-spec-label">Año</span>
                  <span className="vehiculo-detail-spec-value">{vehiculo.Modelo?.anio}</span>
                </div>
                <div className="vehiculo-detail-spec">
                  <span className="vehiculo-detail-spec-label">Color</span>
                  <span className="vehiculo-detail-spec-value">{vehiculo.color}</span>
                </div>
                <div className="vehiculo-detail-spec">
                  <span className="vehiculo-detail-spec-label">Combustible</span>
                  <span className="vehiculo-detail-spec-value">{getCombustibleLabel(vehiculo.combustible)}</span>
                </div>
                <div className="vehiculo-detail-spec">
                  <span className="vehiculo-detail-spec-label">Transmisión</span>
                  <span className="vehiculo-detail-spec-value">{getTransmisionLabel(vehiculo.transmision)}</span>
                </div>
                <div className="vehiculo-detail-spec">
                  <span className="vehiculo-detail-spec-label">Kilometraje</span>
                  <span className="vehiculo-detail-spec-value">{vehiculo.kilometraje.toLocaleString()} km</span>
                </div>
                <div className="vehiculo-detail-spec">
                  <span className="vehiculo-detail-spec-label">VIN</span>
                  <span className="vehiculo-detail-spec-value">{vehiculo.vin}</span>
                </div>
                <div className="vehiculo-detail-spec">
                  <span className="vehiculo-detail-spec-label">Estado</span>
                  <span className="vehiculo-detail-spec-value">{getEstadoLabel(vehiculo.estado)}</span>
                </div>
                <div className="vehiculo-detail-spec">
                  <span className="vehiculo-detail-spec-label">Tipo</span>
                  <span className="vehiculo-detail-spec-value">{vehiculo.Modelo?.tipo}</span>
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
