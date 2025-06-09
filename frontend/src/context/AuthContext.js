"use client"

import { createContext, useState, useEffect } from "react"
import axios from "axios"

export const AuthContext = createContext()

// Configurar la URL base para las peticiones de autenticación
const API_BASE_URL = "http://localhost:5000/api"

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem("token") || null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar si hay un token en localStorage
    const storedToken = localStorage.getItem("token")
    if (storedToken) {
      setToken(storedToken)
      fetchUserProfile(storedToken)
    } else {
      setLoading(false)
    }
  }, [])

  const fetchUserProfile = async (authToken) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      setUser(response.data)
      setLoading(false)
    } catch (error) {
      console.error("Error al obtener el perfil del usuario:", error)
      logout()
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      console.log("Intentando login con:", { email }) // debug

      const response = await axios.post(`${API_BASE_URL}/auth/signin`, { email, password })
      const { token, usuario } = response.data

      // Guardar token en localStorage
      localStorage.setItem("token", token)

      // Actualizar estado
      setToken(token)
      setUser(usuario)

      return { success: true }
    } catch (error) {
      console.error("Error al iniciar sesión:", error)

      if (error.response) {
        console.error("Respuesta del servidor:", error.response.data)
        return {
          success: false,
          message: error.response.data?.message || "Credenciales incorrectas",
        }
      } else if (error.request) {
        // Por si la petición se ha hecho pero no hubo respuesta
        console.error("No hay respuesta del servidor:", error.request)
        return {
          success: false,
          message: "No se pudo conectar con el servidor. Verifica tu conexión.",
        }
      } else {
        console.error("Error inesperado:", error.message)
        return {
          success: false,
          message: "Error inesperado. Por favor, inténtalo de nuevo.",
        }
      }
    }
  }

  const register = async (userData) => {
    try {
      // console.log("Intentando registro con:", userData) // Para debug
      // console.log("URL de registro:", `${API_BASE_URL}/auth/signup`) // Para debug

      const response = await axios.post(`${API_BASE_URL}/auth/signup`, userData)
      // console.log("Respuesta del registro:", response.data) // Para debug

      return { success: true, data: response.data }
    } catch (error) {
      console.error("Error al registrar usuario:", error)

      // Manejar diferentes tipos de errores
      if (error.response) {
        console.error("Respuesta del servidor:", error.response.data)
        console.error("Status:", error.response.status)
        return {
          success: false,
          message: error.response.data?.message || "Error al registrar usuario",
        }
      } else if (error.request) {
        console.error("No hay respuesta del servidor:", error.request)
        return {
          success: false,
          message: "No se pudo conectar con el servidor. Verifica que esté funcionando.",
        }
      } else {
        console.error("Error inesperado:", error.message)
        return {
          success: false,
          message: "Error inesperado. Por favor, inténtalo de nuevo.",
        }
      }
    }
  }

  const logout = () => {
    // Eliminar token de localStorage
    localStorage.removeItem("token")

    // Actualizar estado
    setToken(null)
    setUser(null)
  }

  const isAuthenticated = () => {
    return !!token && !!user
  }

  const isAdmin = () => {
    return user && user.rol === "admin"
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
