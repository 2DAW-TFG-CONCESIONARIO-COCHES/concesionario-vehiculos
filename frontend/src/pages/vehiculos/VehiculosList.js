"use client"

import { useState, useEffect, useContext } from "react"
import { Link } from "react-router-dom"
import { vehiculoService } from "../../services/api"
import { AuthContext } from "../../context/AuthContext"

const VehiculosList = () => {
  const { user } = useContext(AuthContext)
  const [vehiculos, setVehiculos] = useState([])
  const [vehiculosFiltrados, setVehiculosFiltrados] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showFilters, setShowFilters] = useState(false)
  const [filtros, setFiltros] = useState({
    marca: "",
    modelo: "",
    estado: "",
    combustible: "",
    transmision: "",
    precioMin: "",
    precioMax: "",
  })

  // Verificar si el usuario es administrador
  const isAdmin = user && user.rol === "admin"

  useEffect(() => {
    const fetchVehiculos = async () => {
      try {
        setLoading(true)
        const response = await vehiculoService.getAll()
        setVehiculos(response.data)
        setVehiculosFiltrados(response.data)
        setLoading(false)
      } catch (err) {
        setError("Error al cargar los vehículos")
        setLoading(false)
        console.error(err)
      }
    }

    fetchVehiculos()
  }, [])

  // Efecto para filtrar vehículos cuando cambien los filtros
  useEffect(() => {
    filtrarVehiculos()
  }, [filtros, vehiculos])

  const filtrarVehiculos = () => {
    const vehiculosFiltrados = vehiculos.filter((vehiculo) => {
      // Filtro por marca
      if (filtros.marca && !vehiculo.Modelo?.Marca?.nombre?.toLowerCase().includes(filtros.marca.toLowerCase())) {
        return false
      }

      // Filtro por modelo
      if (filtros.modelo && !vehiculo.Modelo?.nombre?.toLowerCase().includes(filtros.modelo.toLowerCase())) {
        return false
      }

      // Filtro por estado
      if (filtros.estado && vehiculo.estado !== filtros.estado) {
        return false
      }

      // Filtro por combustible
      if (filtros.combustible && vehiculo.combustible !== filtros.combustible) {
        return false
      }

      // Filtro por transmisión
      if (filtros.transmision && vehiculo.transmision !== filtros.transmision) {
        return false
      }

      // Filtro por precio mínimo
      if (filtros.precioMin && Number(vehiculo.precio) < Number(filtros.precioMin)) {
        return false
      }

      // Filtro por precio máximo
      if (filtros.precioMax && Number(vehiculo.precio) > Number(filtros.precioMax)) {
        return false
      }

      return true
    })

    setVehiculosFiltrados(vehiculosFiltrados)
  }

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este vehículo?")) {
      try {
        await vehiculoService.delete(id)
        const nuevosVehiculos = vehiculos.filter((vehiculo) => vehiculo.id !== id)
        setVehiculos(nuevosVehiculos)
        // vehiculosFiltrados se actualizará automáticamente por el useEffect
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

  const aplicarFiltros = () => {
    setShowFilters(false)
    // Los filtros se aplican automáticamente por el useEffect
  }

  const limpiarFiltros = () => {
    setFiltros({
      marca: "",
      modelo: "",
      estado: "",
      combustible: "",
      transmision: "",
      precioMin: "",
      precioMax: "",
    })
    setShowFilters(false)
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
      <div className="vehiculos-container">
        <div className="container">
          <div className="text-center py-5">
            <div className="loading-spinner" style={{ width: "40px", height: "40px", borderWidth: "4px" }}></div>
            <p className="mt-3">Cargando vehículos...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="vehiculos-container">
        <div className="container">
          <div className="alert alert-danger">{error}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="vehiculos-container">
      <div className="container">
        <div className="vehiculos-header">
          <h1 className="vehiculos-title">Catálogo de Vehículos</h1>
          <div className="vehiculos-actions">
            {/* Solo mostrar botón de añadir para administradores */}
            {isAdmin && (
              <Link to="/vehiculos/nuevo" className="btn btn-primary">
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
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Añadir Vehículo
              </Link>
            )}
            <button className="filter-button" onClick={() => setShowFilters(!showFilters)}>
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
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
              </svg>
            </button>
          </div>
        </div>

        <div className={`filtros-panel ${showFilters ? "visible" : "hidden"}`}>
          <div className="filtros-header">
            <h3 className="filtros-title">Filtros de búsqueda</h3>
            <div className="filtros-actions">
              <button onClick={limpiarFiltros} className="btn btn-secondary">
                Limpiar
              </button>
              <button onClick={aplicarFiltros} className="btn btn-primary">
                Aplicar
              </button>
            </div>
          </div>

          <div className="filtros-content">
            <div className="filtros-categories">
              {/* Categoría: Marca y Modelo */}
              <div className="filtro-category">
                <h4 className="filtro-category-title">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
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
                  Marca y Modelo
                </h4>
                <div className="form-group">
                  <label htmlFor="marca">Marca</label>
                  <input
                    type="text"
                    id="marca"
                    name="marca"
                    className="form-control"
                    value={filtros.marca}
                    onChange={handleFiltroChange}
                    placeholder="Ej: Toyota, BMW..."
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="modelo">Modelo</label>
                  <input
                    type="text"
                    id="modelo"
                    name="modelo"
                    className="form-control"
                    value={filtros.modelo}
                    onChange={handleFiltroChange}
                    placeholder="Ej: Corolla, X5..."
                  />
                </div>
              </div>

              {/* Categoría: Estado y Condición */}
              <div className="filtro-category">
                <h4 className="filtro-category-title">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 6L9 17l-5-5"></path>
                  </svg>
                  Estado y Condición
                </h4>
                <div className="form-group">
                  <label htmlFor="estado">Estado</label>
                  <select
                    id="estado"
                    name="estado"
                    className="form-control"
                    value={filtros.estado}
                    onChange={handleFiltroChange}
                  >
                    <option value="">Todos los estados</option>
                    <option value="nuevo">Nuevo</option>
                    <option value="usado">Usado</option>
                    <option value="vendido">Vendido</option>
                  </select>
                </div>
              </div>

              {/* Categoría: Motor y Transmisión */}
              <div className="filtro-category">
                <h4 className="filtro-category-title">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                  </svg>
                  Motor y Transmisión
                </h4>
                <div className="form-group">
                  <label htmlFor="combustible">Combustible</label>
                  <select
                    id="combustible"
                    name="combustible"
                    className="form-control"
                    value={filtros.combustible}
                    onChange={handleFiltroChange}
                  >
                    <option value="">Todos los combustibles</option>
                    <option value="gasolina">Gasolina</option>
                    <option value="diesel">Diésel</option>
                    <option value="electrico">Eléctrico</option>
                    <option value="hibrido">Híbrido</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="transmision">Transmisión</label>
                  <select
                    id="transmision"
                    name="transmision"
                    className="form-control"
                    value={filtros.transmision}
                    onChange={handleFiltroChange}
                  >
                    <option value="">Todas las transmisiones</option>
                    <option value="manual">Manual</option>
                    <option value="automatica">Automática</option>
                  </select>
                </div>
              </div>

              {/* Categoría: Rango de Precio */}
              <div className="filtro-category">
                <h4 className="filtro-category-title">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="12" y1="1" x2="12" y2="23"></line>
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                  </svg>
                  Rango de Precio
                </h4>
                <div className="form-group">
                  <label htmlFor="precioMin">Precio Mínimo (€)</label>
                  <input
                    type="number"
                    id="precioMin"
                    name="precioMin"
                    className="form-control"
                    value={filtros.precioMin}
                    onChange={handleFiltroChange}
                    placeholder="Ej: 10000"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="precioMax">Precio Máximo (€)</label>
                  <input
                    type="number"
                    id="precioMax"
                    name="precioMax"
                    className="form-control"
                    value={filtros.precioMax}
                    onChange={handleFiltroChange}
                    placeholder="Ej: 50000"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {!showFilters &&
          (filtros.marca ||
            filtros.modelo ||
            filtros.estado ||
            filtros.combustible ||
            filtros.transmision ||
            filtros.precioMin ||
            filtros.precioMax) && (
            <div className="vehiculos-filtro-resultado">
              <div className="filtro-resultado-container">
                <span className="filtro-resultado-texto">
                  Mostrando {vehiculosFiltrados.length} de {vehiculos.length} vehículos
                </span>
                <button onClick={limpiarFiltros} className="filtro-limpiar-btn">
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
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                  Limpiar filtros
                </button>
              </div>
            </div>
          )}

        {vehiculosFiltrados.length === 0 ? (
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
            <h3>{vehiculos.length === 0 ? "No hay vehículos disponibles" : "No se encontraron vehículos"}</h3>
            <p className="text-muted">
              {vehiculos.length === 0
                ? "No se encontraron vehículos en el sistema."
                : "No se encontraron vehículos que coincidan con los criterios de búsqueda."}
            </p>
            {vehiculos.length > 0 && (
              <button onClick={limpiarFiltros} className="btn btn-primary mt-3">
                Limpiar filtros
              </button>
            )}
          </div>
        ) : (
          <div className="vehiculos-grid">
            {vehiculosFiltrados.map((vehiculo) => (
              <div key={vehiculo.id} className="vehiculo-card">
                <div className={`vehiculo-badge ${getBadgeClass(vehiculo.estado)}`}>
                  {getEstadoLabel(vehiculo.estado)}
                </div>
                <img
                  src={
                    vehiculo.imagenes && vehiculo.imagenes.length > 0
                      ? vehiculo.imagenes[0]
                      : `/placeholder.svg?height=400&width=600&query=car+${vehiculo.color}`
                  }
                  alt={`${vehiculo.Modelo?.Marca?.nombre} ${vehiculo.Modelo?.nombre}`}
                  className="vehiculo-image"
                />
                <div className="vehiculo-content">
                  <h3 className="vehiculo-title">
                    {vehiculo.Modelo?.Marca?.nombre} {vehiculo.Modelo?.nombre}
                  </h3>
                  <div className="vehiculo-price">€{Number(vehiculo.precio).toLocaleString()}</div>
                  <div className="vehiculo-specs">
                    <div className="vehiculo-spec">
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
                      <span>{vehiculo.Modelo?.anio}</span>
                    </div>
                    <div className="vehiculo-spec">
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
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M12 2a7 7 0 1 0 10 10"></path>
                      </svg>
                      <span>{vehiculo.color}</span>
                    </div>
                    <div className="vehiculo-spec">
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
                        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                      </svg>
                      <span>{getCombustibleLabel(vehiculo.combustible)}</span>
                    </div>
                    <div className="vehiculo-spec">
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
                        <circle cx="12" cy="12" r="3"></circle>
                        <path d="M12 1v6m0 6v6"></path>
                        <path d="M21 12h-6m-6 0H3"></path>
                      </svg>
                      <span>{getTransmisionLabel(vehiculo.transmision)}</span>
                    </div>
                  </div>
                  <div className="vehiculo-actions">
                    <Link to={`/vehiculos/${vehiculo.id}`} className="vehiculo-action-btn view" title="Ver detalles">
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
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    </Link>
                    {/* Mostrar botón de editar para usuarios autenticados */}
                    {user && (
                      <Link to={`/vehiculos/editar/${vehiculo.id}`} className="vehiculo-action-btn edit" title="Editar">
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
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                      </Link>
                    )}
                    {/* Solo mostrar botón de eliminar para administradores */}
                    {isAdmin && (
                      <button
                        onClick={() => handleDelete(vehiculo.id)}
                        className="vehiculo-action-btn delete"
                        title="Eliminar"
                      >
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
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          <line x1="10" y1="11" x2="10" y2="17"></line>
                          <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>
                      </button>
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

export default VehiculosList
