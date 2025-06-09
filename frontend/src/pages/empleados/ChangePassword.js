"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { empleadoService } from "../../services/api"

const ChangePassword = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [empleado, setEmpleado] = useState(null)
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [validationErrors, setValidationErrors] = useState({})

  useEffect(() => {
    const fetchEmpleado = async () => {
      try {
        const response = await empleadoService.getById(id)
        setEmpleado(response.data)
      } catch (err) {
        setError("Error al cargar los datos del empleado")
        console.error(err)
      }
    }

    fetchEmpleado()
  }, [id])

  const validateForm = () => {
    const errors = {}

    if (!formData.newPassword) {
      errors.newPassword = "La nueva contraseña es obligatoria"
    } else if (formData.newPassword.length < 6) {
      errors.newPassword = "La contraseña debe tener al menos 6 caracteres"
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = "Debes confirmar la contraseña"
    } else if (formData.newPassword !== formData.confirmPassword) {
      errors.confirmPassword = "Las contraseñas no coinciden"
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
      await empleadoService.changePassword(id, formData.newPassword)
      navigate("/empleados")
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message)
      } else {
        setError("Error al cambiar la contraseña")
      }
      setLoading(false)
      console.error(err)
    }
  }

  if (!empleado) return <div>Cargando...</div>

  return (
    <div className="change-password">
      <h2>Cambiar Contraseña</h2>
      <p>
        Cambiando contraseña para:{" "}
        <strong>
          {empleado.nombre} {empleado.apellidos}
        </strong>
      </p>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="newPassword">Nueva Contraseña</label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            className={`form-control ${validationErrors.newPassword ? "error" : ""}`}
            value={formData.newPassword}
            onChange={handleChange}
            placeholder="Mínimo 6 caracteres"
            disabled={loading}
          />
          {validationErrors.newPassword && <span className="error-message">{validationErrors.newPassword}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirmar Nueva Contraseña</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            className={`form-control ${validationErrors.confirmPassword ? "error" : ""}`}
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Repite la nueva contraseña"
            disabled={loading}
          />
          {validationErrors.confirmPassword && (
            <span className="error-message">{validationErrors.confirmPassword}</span>
          )}
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Cambiando..." : "Cambiar Contraseña"}
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate("/empleados")} disabled={loading}>
            Cancelar
          </button>
        </div>
      </form>

      <style jsx>{`
        .change-password {
          max-width: 500px;
          margin: 0 auto;
          padding: 2rem;
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          margin-top: 2rem;
        }

        @media (max-width: 768px) {
          .form-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  )
}

export default ChangePassword
