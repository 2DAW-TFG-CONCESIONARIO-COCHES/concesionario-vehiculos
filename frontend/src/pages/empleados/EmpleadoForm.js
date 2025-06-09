"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { empleadoService } from "../../services/api"

const EmpleadoForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    nombre: "",
    apellidos: "",
    email: "",
    password: "",
    rol: "empleado",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [validationErrors, setValidationErrors] = useState({})
  const isEditing = !!id

  useEffect(() => {
    if (isEditing) {
      const fetchEmpleado = async () => {
        try {
          setLoading(true)
          const response = await empleadoService.getById(id)
          setFormData({
            nombre: response.data.nombre,
            apellidos: response.data.apellidos,
            email: response.data.email,
            password: "", // Para no mostrar la contraseña actual
            rol: response.data.rol,
          })
          setLoading(false)
        } catch (err) {
          setError("Error al cargar los datos del empleado")
          setLoading(false)
          console.error(err)
        }
      }

      fetchEmpleado()
    }
  }, [id, isEditing])

  const validateForm = () => {
    const errors = {}

    if (!formData.nombre.trim()) {
      errors.nombre = "El nombre es obligatorio"
    }

    if (!formData.apellidos.trim()) {
      errors.apellidos = "Los apellidos son obligatorios"
    }

    if (!formData.email.trim()) {
      errors.email = "El email es obligatorio"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "El formato del email no es válido"
    }

    if (!isEditing && !formData.password) {
      errors.password = "La contraseña es obligatoria"
    } else if (!isEditing && formData.password.length < 6) {
      errors.password = "La contraseña debe tener al menos 6 caracteres"
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    // Limpiar errores de validación
    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: "",
      })
    }

    if (error) {
      setError("")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)
    setError("")

    try {
      const dataToSend = { ...formData }

      // Si estamos editando y no se cambió la contraseña, no la enviamos
      if (isEditing && !dataToSend.password) {
        delete dataToSend.password
      }

      if (isEditing) {
        await empleadoService.update(id, dataToSend)
      } else {
        await empleadoService.create(dataToSend)
      }

      navigate("/empleados")
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message)
      } else {
        setError("Error al guardar el empleado")
      }
      setLoading(false)
      console.error(err)
    }
  }

  if (loading && isEditing) return <div>Cargando datos...</div>

  return (
    <div className="empleado-form">
      <h2>{isEditing ? "Editar Empleado" : "Nuevo Empleado"}</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="nombre">Nombre</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              className={`form-control ${validationErrors.nombre ? "error" : ""}`}
              value={formData.nombre}
              onChange={handleChange}
              disabled={loading}
            />
            {validationErrors.nombre && <span className="error-message">{validationErrors.nombre}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="apellidos">Apellidos</label>
            <input
              type="text"
              id="apellidos"
              name="apellidos"
              className={`form-control ${validationErrors.apellidos ? "error" : ""}`}
              value={formData.apellidos}
              onChange={handleChange}
              disabled={loading}
            />
            {validationErrors.apellidos && <span className="error-message">{validationErrors.apellidos}</span>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            className={`form-control ${validationErrors.email ? "error" : ""}`}
            value={formData.email}
            onChange={handleChange}
            disabled={loading}
          />
          {validationErrors.email && <span className="error-message">{validationErrors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="rol">Rol</label>
          <select
            id="rol"
            name="rol"
            className="form-control"
            value={formData.rol}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="empleado">Empleado</option>
            <option value="admin">Administrador</option>
          </select>
        </div>

        {!isEditing && (
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              className={`form-control ${validationErrors.password ? "error" : ""}`}
              value={formData.password}
              onChange={handleChange}
              placeholder="Mínimo 6 caracteres"
              disabled={loading}
            />
            {validationErrors.password && <span className="error-message">{validationErrors.password}</span>}
          </div>
        )}

        {isEditing && (
          <div className="form-group">
            <label htmlFor="password">Nueva Contraseña (opcional)</label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-control"
              value={formData.password}
              onChange={handleChange}
              placeholder="Dejar vacío para mantener la actual"
              disabled={loading}
            />
            <small className="form-text">Deja este campo vacío si no quieres cambiar la contraseña</small>
          </div>
        )}

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Guardando..." : "Guardar"}
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate("/empleados")} disabled={loading}>
            Cancelar
          </button>
        </div>
      </form>

      <style jsx>{`
        .empleado-form {
          max-width: 600px;
          margin: 0 auto;
          padding: 2rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          margin-top: 2rem;
        }

        .form-text {
          color: #666;
          font-size: 0.875rem;
          margin-top: 0.25rem;
        }

        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 1fr;
          }
          
          .form-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  )
}

export default EmpleadoForm
