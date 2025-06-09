"use client"

import { useState, useContext, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"

const Register = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellidos: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [validationErrors, setValidationErrors] = useState({})
  const [success, setSuccess] = useState(false)
  const { register, isAuthenticated } = useContext(AuthContext)
  const navigate = useNavigate()

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/")
    }
  }, [isAuthenticated, navigate])

  const validateForm = () => {
    const errors = {}

    // Validar nombre
    if (!formData.nombre.trim()) {
      errors.nombre = "El nombre es obligatorio"
    } else if (formData.nombre.trim().length < 2) {
      errors.nombre = "El nombre debe tener al menos 2 caracteres"
    }

    // Validar apellidos
    if (!formData.apellidos.trim()) {
      errors.apellidos = "Los apellidos son obligatorios"
    } else if (formData.apellidos.trim().length < 2) {
      errors.apellidos = "Los apellidos deben tener al menos 2 caracteres"
    }

    // Validar email
    if (!formData.email) {
      errors.email = "El email es obligatorio"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "El formato del email no es válido"
    }

    // Validar contraseña
    if (!formData.password) {
      errors.password = "La contraseña es obligatoria"
    } else if (formData.password.length < 6) {
      errors.password = "La contraseña debe tener al menos 6 caracteres"
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      errors.password = "La contraseña debe contener al menos una mayúscula, una minúscula y un número"
    }

    // Validar confirmación de contraseña
    if (!formData.confirmPassword) {
      errors.confirmPassword = "Debes confirmar la contraseña"
    } else if (formData.password !== formData.confirmPassword) {
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

    // Limpiar errores de validación cuando el usuario empiece a escribir
    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: "",
      })
    }

    // Limpiar error general
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

    const userData = {
      nombre: formData.nombre.trim(),
      apellidos: formData.apellidos.trim(),
      email: formData.email.trim(),
      password: formData.password,
    }

    try {
      const result = await register(userData)

      if (result.success) {
        setSuccess(true)
        setTimeout(() => {
          navigate("/login")
        }, 2000)
      } else {
        setError(result.message || "Error al registrar usuario")
      }
    } catch (err) {
      setError("Error de conexión. Por favor, inténtalo de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1 className="auth-title">¡Registro Exitoso!</h1>
            <p className="auth-subtitle">Tu cuenta ha sido creada correctamente</p>
          </div>
          <div className="alert alert-success">Te estamos redirigiendo a la página de inicio de sesión...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Crear Cuenta</h1>
          <p className="auth-subtitle">Únete a nuestro sistema de gestión</p>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className={`form-group ${validationErrors.nombre ? "has-error" : ""}`}>
            <label htmlFor="nombre">Nombre</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              className={`form-control ${validationErrors.nombre ? "error" : ""}`}
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Tu nombre"
              disabled={loading}
            />
            {validationErrors.nombre && <span className="error-message">{validationErrors.nombre}</span>}
          </div>

          <div className={`form-group ${validationErrors.apellidos ? "has-error" : ""}`}>
            <label htmlFor="apellidos">Apellidos</label>
            <input
              type="text"
              id="apellidos"
              name="apellidos"
              className={`form-control ${validationErrors.apellidos ? "error" : ""}`}
              value={formData.apellidos}
              onChange={handleChange}
              placeholder="Tus apellidos"
              disabled={loading}
            />
            {validationErrors.apellidos && <span className="error-message">{validationErrors.apellidos}</span>}
          </div>

          <div className={`form-group ${validationErrors.email ? "has-error" : ""}`}>
            <label htmlFor="email">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              name="email"
              className={`form-control ${validationErrors.email ? "error" : ""}`}
              value={formData.email}
              onChange={handleChange}
              placeholder="tu@email.com"
              disabled={loading}
            />
            {validationErrors.email && <span className="error-message">{validationErrors.email}</span>}
          </div>

          <div className={`form-group ${validationErrors.password ? "has-error" : ""}`}>
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

          <div className={`form-group ${validationErrors.confirmPassword ? "has-error" : ""}`}>
            <label htmlFor="confirmPassword">Confirmar Contraseña</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className={`form-control ${validationErrors.confirmPassword ? "error" : ""}`}
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Repite tu contraseña"
              disabled={loading}
            />
            {validationErrors.confirmPassword && (
              <span className="error-message">{validationErrors.confirmPassword}</span>
            )}
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading && <span className="loading-spinner"></span>}
            {loading ? "Creando cuenta..." : "Crear Cuenta"}
          </button>
        </form>

        <div className="auth-links">
          <p>¿Ya tienes una cuenta?</p>
          <Link to="/login">Inicia sesión aquí</Link>
        </div>
      </div>
    </div>
  )
}

export default Register
