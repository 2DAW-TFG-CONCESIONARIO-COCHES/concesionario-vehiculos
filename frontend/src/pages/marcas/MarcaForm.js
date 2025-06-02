"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { marcaService } from "../../services/api"

const MarcaForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    nombre: "",
    pais: "",
    logo: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const isEditing = !!id

  useEffect(() => {
    if (isEditing) {
      const fetchMarca = async () => {
        try {
          setLoading(true)
          const response = await marcaService.getById(id)
          setFormData({
            nombre: response.data.nombre,
            pais: response.data.pais || "",
            logo: response.data.logo || "",
          })
          setLoading(false)
        } catch (err) {
          setError("Error al cargar los datos de la marca")
          setLoading(false)
          console.error(err)
        }
      }

      fetchMarca()
    }
  }, [id, isEditing])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (isEditing) {
        await marcaService.update(id, formData)
      } else {
        await marcaService.create(formData)
      }
      navigate("/marcas")
    } catch (err) {
      setError("Error al guardar la marca")
      setLoading(false)
      console.error(err)
    }
  }

  if (loading && isEditing) return <div>Cargando datos...</div>

  return (
    <div className="marca-form">
      <h2>{isEditing ? "Editar Marca" : "Nueva Marca"}</h2>
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
          <label htmlFor="pais">País</label>
          <input
            type="text"
            id="pais"
            name="pais"
            className="form-control"
            value={formData.pais}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="logo">URL del Logo</label>
          <input
            type="text"
            id="logo"
            name="logo"
            className="form-control"
            value={formData.logo}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Guardando..." : "Guardar"}
        </button>
      </form>
    </div>
  )
}

export default MarcaForm
