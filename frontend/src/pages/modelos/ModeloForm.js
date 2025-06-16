"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { modeloService, marcaService } from "../../services/api"

const ModeloForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    nombre: "",
    anio: new Date().getFullYear(),
    tipo: "sedan",
    marcaId: "",
  })
  const [marcas, setMarcas] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const isEditing = !!id

  useEffect(() => {
    const fetchMarcas = async () => {
      try {
        const response = await marcaService.getAll()
        setMarcas(response.data)
      } catch (err) {
        setError("Error al cargar las marcas")
        console.error(err)
      }
    }

    fetchMarcas()

    if (isEditing) {
      const fetchModelo = async () => {
        try {
          setLoading(true)
          const response = await modeloService.getById(id)
          setFormData({
            nombre: response.data.nombre,
            anio: response.data.anio,
            tipo: response.data.tipo,
            marcaId: response.data.marcaId,
          })
          setLoading(false)
        } catch (err) {
          setError("Error al cargar los datos del modelo")
          setLoading(false)
          console.error(err)
        }
      }

      fetchModelo()
    }
  }, [id, isEditing])

  const handleChange = (e) => {
    const value = e.target.type === "number" ? Number.parseInt(e.target.value) : e.target.value
    setFormData({
      ...formData,
      [e.target.name]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (isEditing) {
        await modeloService.update(id, formData)
      } else {
        await modeloService.create(formData)
      }
      navigate("/modelos")
    } catch (err) {
      setError("Error al guardar el modelo")
      setLoading(false)
      console.error(err)
    }
  }

  if (loading && isEditing) return <div>Cargando datos...</div>

  return (
    <div className="modelo-form">
      <div className="modelo-form-container">
        <div className="modelo-form-card">
          <div className="modelo-form-header">
            <div className="modelo-form-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
              </svg>
            </div>
            <h1 className="modelo-form-title">{isEditing ? "Editar Modelo" : "Nuevo Modelo"}</h1>
            <p className="modelo-form-subtitle">
              {isEditing ? "Actualiza la información del modelo" : "Añade un nuevo modelo al catálogo"}
            </p>
          </div>

          <div className="modelo-form-body">
            {error && (
              <div className="modelo-alert modelo-alert-danger">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="modelo-form-section">
                <h3 className="modelo-section-title">
                  <div className="modelo-section-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </div>
                  Información Básica
                </h3>

                <div className="modelo-form-grid">
                  <div className="modelo-form-group">
                    <label htmlFor="nombre">Nombre del Modelo</label>
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      className="modelo-form-control"
                      value={formData.nombre}
                      onChange={handleChange}
                      placeholder="Ej: Corolla, Civic, Focus"
                      required
                    />
                  </div>

                  <div className="modelo-form-group">
                    <label htmlFor="anio">Año</label>
                    <input
                      type="number"
                      id="anio"
                      name="anio"
                      className="modelo-form-control"
                      value={formData.anio}
                      onChange={handleChange}
                      min="1900"
                      max="2100"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="modelo-form-section">
                <h3 className="modelo-section-title">
                  <div className="modelo-section-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                  </div>
                  Clasificación
                </h3>

                <div className="modelo-form-grid">
                  <div className="modelo-form-group">
                    <label htmlFor="tipo">Tipo de Vehículo</label>
                    <div className="modelo-select-wrapper">
                      <select
                        id="tipo"
                        name="tipo"
                        className="modelo-form-control"
                        value={formData.tipo}
                        onChange={handleChange}
                        required
                      >
                        <option value="sedan">Sedán</option>
                        <option value="suv">SUV</option>
                        <option value="hatchback">Hatchback</option>
                        <option value="pickup">Pickup</option>
                        <option value="deportivo">Deportivo</option>
                        <option value="otro">Otro</option>
                      </select>
                    </div>
                  </div>

                  <div className="modelo-form-group">
                    <label htmlFor="marcaId">Marca</label>
                    <div className="modelo-select-wrapper">
                      <select
                        id="marcaId"
                        name="marcaId"
                        className="modelo-form-control"
                        value={formData.marcaId}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Selecciona una marca</option>
                        {marcas.map((marca) => (
                          <option key={marca.id} value={marca.id}>
                            {marca.nombre}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modelo-form-actions">
                <button
                  type="button"
                  className="modelo-btn modelo-btn-secondary"
                  onClick={() => navigate("/modelos")}
                  disabled={loading}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
                  </svg>
                  Cancelar
                </button>

                <button type="submit" className="modelo-btn modelo-btn-primary" disabled={loading}>
                  {loading ? (
                    <>
                      <div className="modelo-loading-spinner"></div>
                      Guardando...
                    </>
                  ) : (
                    <>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z" />
                      </svg>
                      {isEditing ? "Actualizar" : "Guardar"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ModeloForm
