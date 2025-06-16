"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { modeloService, marcaService } from "../../services/api"

const ModelosList = () => {
  const [modelos, setModelos] = useState([])
  const [marcas, setMarcas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filtroMarca, setFiltroMarca] = useState("") // Estado para el filtro de marca

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Cargar modelos y marcas en paralelo
        const [modelosResponse, marcasResponse] = await Promise.all([modeloService.getAll(), marcaService.getAll()])

        setModelos(modelosResponse.data)
        setMarcas(marcasResponse.data)
        setLoading(false)
      } catch (err) {
        setError("Error al cargar los datos")
        setLoading(false)
        console.error(err)
      }
    }

    fetchData()
  }, [])

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este modelo?")) {
      try {
        await modeloService.delete(id)
        setModelos(modelos.filter((modelo) => modelo.id !== id))
      } catch (err) {
        setError("Error al eliminar el modelo")
        console.error(err)
      }
    }
  }

  const handleFiltroMarcaChange = (e) => {
    setFiltroMarca(e.target.value)
  }

  const limpiarFiltro = () => {
    setFiltroMarca("")
  }

  // Filtrar modelos basándose en la marca seleccionada
  const modelosFiltrados = filtroMarca
    ? modelos.filter((modelo) => modelo.Marca?.id.toString() === filtroMarca)
    : modelos

  const getTipoLabel = (tipo) => {
    const tipos = {
      sedan: "Sedán",
      suv: "SUV",
      hatchback: "Hatchback",
      pickup: "Pickup",
      deportivo: "Deportivo",
      otro: "Otro",
    }
    return tipos[tipo] || tipo
  }

  const getTipoClass = (tipo) => {
    return `tipo-${tipo}`
  }

  if (loading) {
    return (
      <div className="modelos-list">
        <div className="container">
          <div className="text-center py-5">
            <div className="loading-spinner" style={{ width: "40px", height: "40px", borderWidth: "4px" }}></div>
            <p className="mt-3">Cargando modelos...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="modelos-list">
        <div className="container">
          <div className="alert alert-danger">{error}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="modelos-list">
      <div className="container">
        <div className="modelos-header">
          <h1 className="modelos-title">Gestión de Modelos</h1>
          <p className="modelos-subtitle">Administra los modelos de vehículos disponibles en el concesionario</p>
          <Link to="/modelos/nuevo" className="btn btn-primary">
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
            Añadir Nuevo Modelo
          </Link>
        </div>

        {/* Filtro por marca */}
        <div className="modelos-filtro">
          <div className="filtro-marca-container">
            <div className="filtro-marca-header">
              <div className="filtro-marca-icon">
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
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                </svg>
              </div>
              <h3 className="filtro-marca-title">Filtrar por Marca</h3>
              {filtroMarca && (
                <button onClick={limpiarFiltro} className="filtro-limpiar-btn">
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
                  Limpiar
                </button>
              )}
            </div>

            <div className="filtro-marca-content">
              <select value={filtroMarca} onChange={handleFiltroMarcaChange} className="filtro-marca-select">
                <option value="">Todas las marcas ({modelos.length} modelos)</option>
                {marcas.map((marca) => {
                  const modelosCount = modelos.filter((modelo) => modelo.Marca?.id === marca.id).length
                  return (
                    <option key={marca.id} value={marca.id}>
                      {marca.nombre} ({modelosCount} modelo{modelosCount !== 1 ? "s" : ""})
                    </option>
                  )
                })}
              </select>

              {filtroMarca && (
                <div className="filtro-resultado">
                  <span className="filtro-resultado-texto">
                    Mostrando {modelosFiltrados.length} de {modelos.length} modelos
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {modelosFiltrados.length === 0 ? (
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
            <h3>{filtroMarca ? `No hay modelos para la marca seleccionada` : "No hay modelos registrados"}</h3>
            <p className="text-muted">
              {filtroMarca
                ? "Prueba seleccionando otra marca o limpia el filtro para ver todos los modelos."
                : "Los modelos aparecerán aquí cuando se registren en el sistema."}
            </p>
            {filtroMarca ? (
              <button onClick={limpiarFiltro} className="btn btn-secondary mt-3">
                Ver Todos los Modelos
              </button>
            ) : (
              <Link to="/modelos/nuevo" className="btn btn-primary mt-3">
                Crear Primer Modelo
              </Link>
            )}
          </div>
        ) : (
          <div className="modelos-grid">
            {modelosFiltrados.map((modelo) => (
              <div key={modelo.id} className="modelo-card">
                <div className="modelo-header">
                  <div className="modelo-icon">
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
                  <div className={`modelo-tipo-badge ${getTipoClass(modelo.tipo)}`}>{getTipoLabel(modelo.tipo)}</div>
                </div>

                <div className="modelo-content">
                  <h3 className="modelo-name">{modelo.nombre}</h3>
                  <p className="modelo-marca">{modelo.Marca?.nombre || "Marca no especificada"}</p>
                  <p className="modelo-year">Año {modelo.anio}</p>

                  <div className="modelo-specs">
                    <div className="modelo-spec">
                      <div className="modelo-spec-label">Marca</div>
                      <div className="modelo-spec-value">{modelo.Marca?.nombre || "N/A"}</div>
                    </div>
                    <div className="modelo-spec">
                      <div className="modelo-spec-label">Año</div>
                      <div className="modelo-spec-value">{modelo.anio}</div>
                    </div>
                    <div className="modelo-spec">
                      <div className="modelo-spec-label">Tipo</div>
                      <div className="modelo-spec-value">{getTipoLabel(modelo.tipo)}</div>
                    </div>
                    <div className="modelo-spec">
                      <div className="modelo-spec-label">Creado</div>
                      <div className="modelo-spec-value">{new Date(modelo.createdAt).toLocaleDateString("es-ES")}</div>
                    </div>
                  </div>

                  <div className="modelo-actions">
                    <Link to={`/modelos/editar/${modelo.id}`} className="btn btn-primary">
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
                    <button onClick={() => handleDelete(modelo.id)} className="btn btn-danger">
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
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ModelosList
