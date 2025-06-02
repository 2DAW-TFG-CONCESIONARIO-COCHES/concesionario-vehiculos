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
      <h2>{isEditing ? "Editar Modelo" : "Nuevo Modelo"}</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nombre">Nombre</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            className="form-control"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="anio">Año</label>
          <input
            type="number"
            id="anio"
            name="anio"
            className="form-control"
            value={formData.anio}
            onChange={handleChange}
            min="1900"
            max="2100"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="tipo">Tipo</label>
          <select id="tipo" name="tipo" className="form-control" value={formData.tipo} onChange={handleChange} required>
            <option value="sedan">Sedán</option>
            <option value="suv">SUV</option>
            <option value="hatchback">Hatchback</option>
            <option value="pickup">Pickup</option>
            <option value="deportivo">Deportivo</option>
            <option value="otro">Otro</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="marcaId">Marca</label>
          <select
            id="marcaId"
            name="marcaId"
            className="form-control"
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
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Guardando..." : "Guardar"}
        </button>
      </form>
    </div>
  )
}

export default ModeloForm
