"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { vehiculoService } from "../../services/api"

const VehiculoDetail = () => {
  const { id } = useParams()
  const [vehiculo, setVehiculo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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

  if (loading) return <div>Cargando detalles del vehículo...</div>
  if (error) return <div className="alert alert-danger">{error}</div>
  if (!vehiculo) return <div>No se encontró el vehículo</div>

  return (
    <div className="vehiculo-detail">
      <h2>
        {vehiculo.Modelo?.Marca?.nombre} {vehiculo.Modelo?.nombre} ({vehiculo.Modelo?.anio})
      </h2>

      <div className="row">
        <div className="col-md-6">
          {vehiculo.imagenes && vehiculo.imagenes.length > 0 ? (
            <div className="vehiculo-imagenes">
              <img
                src={vehiculo.imagenes[0] || "/placeholder.svg"}
                alt={`${vehiculo.Modelo?.Marca?.nombre} ${vehiculo.Modelo?.nombre}`}
                className="img-fluid mb-3"
              />
              <div className="row">
                {vehiculo.imagenes.slice(1).map((imagen, index) => (
                  <div key={index} className="col-4 mb-2">
                    <img src={imagen || "/placeholder.svg"} alt={`Vista ${index + 2}`} className="img-fluid" />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="no-imagen">
              <p>No hay imágenes disponibles</p>
            </div>
          )}
        </div>

        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title">Detalles del Vehículo</h3>
              <p>
                <strong>VIN:</strong> {vehiculo.vin}
              </p>
              <p>
                <strong>Color:</strong> {vehiculo.color}
              </p>
              <p>
                <strong>Precio:</strong> €{vehiculo.precio}
              </p>
              <p>
                <strong>Kilometraje:</strong> {vehiculo.kilometraje} km
              </p>
              <p>
                <strong>Combustible:</strong> {getCombustibleLabel(vehiculo.combustible)}
              </p>
              <p>
                <strong>Transmisión:</strong> {getTransmisionLabel(vehiculo.transmision)}
              </p>
              <p>
                <strong>Estado:</strong> {getEstadoLabel(vehiculo.estado)}
              </p>

              <h4 className="mt-4">Características del Modelo</h4>
              <p>
                <strong>Marca:</strong> {vehiculo.Modelo?.Marca?.nombre}
              </p>
              <p>
                <strong>Modelo:</strong> {vehiculo.Modelo?.nombre}
              </p>
              <p>
                <strong>Año:</strong> {vehiculo.Modelo?.anio}
              </p>
              <p>
                <strong>Tipo:</strong> {vehiculo.Modelo?.tipo}
              </p>

              {vehiculo.descripcion && (
                <>
                  <h4 className="mt-4">Descripción</h4>
                  <p>{vehiculo.descripcion}</p>
                </>
              )}

              <div className="mt-4">
                <Link to="/vehiculos" className="btn btn-secondary me-2">
                  Volver al Listado
                </Link>
                <Link to={`/vehiculos/editar/${vehiculo.id}`} className="btn btn-primary">
                  Editar Vehículo
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
