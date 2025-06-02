"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { vehiculoService } from "../../services/api"

const VehiculosList = () => {
  const [vehiculos, setVehiculos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filtros, setFiltros] = useState({
    marca: "",
    modelo: "",
    estado: "",
    combustible: "",
    transmision: "",
    precioMin: "",
    precioMax: "",
  })

  useEffect(() => {
    const fetchVehiculos = async () => {
      try {
        const response = await vehiculoService.getAll()
        setVehiculos(response.data)
        setLoading(false)
      } catch (err) {
        setError("Error al cargar los vehículos")
        setLoading(false)
        console.error(err)
      }
    }

    fetchVehiculos()
  }, [])

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este vehículo?")) {
      try {
        await vehiculoService.delete(id)
        setVehiculos(vehiculos.filter((vehiculo) => vehiculo.id !== id))
      } catch (err) {
        setError("Error al eliminar el vehículo")
        console.error(err)
      }
    }
  }

  const handleFiltroChange = (e) => {
    setFiltros({
      ...filtros,
      [e.target.name]: e.target.value,
    })
  }

  const aplicarFiltros = async () => {
    try {
      setLoading(true)
      const response = await vehiculoService.search(filtros)
      setVehiculos(response.data)
      setLoading(false)
    } catch (err) {
      setError("Error al aplicar los filtros")
      setLoading(false)
      console.error(err)
    }
  }

  const limpiarFiltros = async () => {
    setFiltros({
      marca: "",
      modelo: "",
      estado: "",
      combustible: "",
      transmision: "",
      precioMin: "",
      precioMax: "",
    })

    try {
      setLoading(true)
      const response = await vehiculoService.getAll()
      setVehiculos(response.data)
      setLoading(false)
    } catch (err) {
      setError("Error al cargar los vehículos")
      setLoading(false)
      console.error(err)
    }
  }

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

  if (loading) return <div>Cargando vehículos...</div>
  if (error) return <div className="alert alert-danger">{error}</div>

  return (
    <div className="vehiculos-list">
      <h2>Listado de Vehículos</h2>
      <Link to="/vehiculos/nuevo" className="btn btn-primary mb-3">
        Añadir Nuevo Vehículo
      </Link>

      <div className="filtros mb-4">
        <h4>Filtros</h4>
        <div className="row">
          <div className="col-md-3">
            <div className="form-group">
              <label htmlFor="marca">Marca</label>
              <input
                type="text"
                id="marca"
                name="marca"
                className="form-control"
                value={filtros.marca}
                onChange={handleFiltroChange}
              />
            </div>
          </div>
          <div className="col-md-3">
            <div className="form-group">
              <label htmlFor="modelo">Modelo</label>
              <input
                type="text"
                id="modelo"
                name="modelo"
                className="form-control"
                value={filtros.modelo}
                onChange={handleFiltroChange}
              />
            </div>
          </div>
          <div className="col-md-3">
            <div className="form-group">
              <label htmlFor="estado">Estado</label>
              <select
                id="estado"
                name="estado"
                className="form-control"
                value={filtros.estado}
                onChange={handleFiltroChange}
              >
                <option value="">Todos</option>
                <option value="nuevo">Nuevo</option>
                <option value="usado">Usado</option>
                <option value="vendido">Vendido</option>
              </select>
            </div>
          </div>
          <div className="col-md-3">
            <div className="form-group">
              <label htmlFor="combustible">Combustible</label>
              <select
                id="combustible"
                name="combustible"
                className="form-control"
                value={filtros.combustible}
                onChange={handleFiltroChange}
              >
                <option value="">Todos</option>
                <option value="gasolina">Gasolina</option>
                <option value="diesel">Diésel</option>
                <option value="electrico">Eléctrico</option>
                <option value="hibrido">Híbrido</option>
              </select>
            </div>
          </div>
        </div>
        <div className="row mt-2">
          <div className="col-md-3">
            <div className="form-group">
              <label htmlFor="transmision">Transmisión</label>
              <select
                id="transmision"
                name="transmision"
                className="form-control"
                value={filtros.transmision}
                onChange={handleFiltroChange}
              >
                <option value="">Todas</option>
                <option value="manual">Manual</option>
                <option value="automatica">Automática</option>
              </select>
            </div>
          </div>
          <div className="col-md-3">
            <div className="form-group">
              <label htmlFor="precioMin">Precio Mínimo</label>
              <input
                type="number"
                id="precioMin"
                name="precioMin"
                className="form-control"
                value={filtros.precioMin}
                onChange={handleFiltroChange}
              />
            </div>
          </div>
          <div className="col-md-3">
            <div className="form-group">
              <label htmlFor="precioMax">Precio Máximo</label>
              <input
                type="number"
                id="precioMax"
                name="precioMax"
                className="form-control"
                value={filtros.precioMax}
                onChange={handleFiltroChange}
              />
            </div>
          </div>
          <div className="col-md-3 d-flex align-items-end">
            <div className="form-group">
              <button onClick={aplicarFiltros} className="btn btn-primary me-2">
                Aplicar Filtros
              </button>
              <button onClick={limpiarFiltros} className="btn btn-secondary">
                Limpiar
              </button>
            </div>
          </div>
        </div>
      </div>

      {vehiculos.length === 0 ? (
        <p>No hay vehículos registrados.</p>
      ) : (
        <div className="grid">
          {vehiculos.map((vehiculo) => (
            <div key={vehiculo.id} className="card">
              <div className="card-body">
                <h3 className="card-title">
                  {vehiculo.Modelo?.Marca?.nombre} {vehiculo.Modelo?.nombre}
                </h3>
                <p>VIN: {vehiculo.vin}</p>
                <p>Color: {vehiculo.color}</p>
                <p>Precio: €{vehiculo.precio}</p>
                <p>Estado: {getEstadoLabel(vehiculo.estado)}</p>
                <p>Combustible: {getCombustibleLabel(vehiculo.combustible)}</p>
                <p>Transmisión: {getTransmisionLabel(vehiculo.transmision)}</p>
                <div className="mt-3">
                  <Link to={`/vehiculos/${vehiculo.id}`} className="btn btn-sm btn-info me-2">
                    Ver Detalles
                  </Link>
                  <Link to={`/vehiculos/editar/${vehiculo.id}`} className="btn btn-sm btn-primary me-2">
                    Editar
                  </Link>
                  <button onClick={() => handleDelete(vehiculo.id)} className="btn btn-sm btn-danger">
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default VehiculosList
