"use client"

import { createContext, useState, useEffect } from "react"
import axios from "axios"

export const AuthContext = createContext()

// Configurar axios con la URL base
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api"

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

      // Manejar diferentes tipos de errores
      if (error.response) {
        // El servidor respondió con un código de error
        return {
          success: false,
          message: error.response.data?.message || "Credenciales incorrectas",
        }
      } else if (error.request) {
        // La petición se hizo pero no hubo respuesta
        return {
          success: false,
          message: "No se pudo conectar con el servidor. Verifica que el backend esté ejecutándose en el puerto 5000.",
        }
      } else {
        // Algo más pasó
        return {
          success: false,
          message: "Error inesperado. Por favor, inténtalo de nuevo.",
        }
      }
    }
  }

  const register = async (userData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/signup`, userData)
      return { success: true, data: response.data }
    } catch (error) {
      console.error("Error al registrar usuario:", error)

      // Manejar diferentes tipos de errores
      if (error.response) {
        // El servidor respondió con un código de error
        return {
          success: false,
          message: error.response.data?.message || "Error al registrar usuario",
        }
      } else if (error.request) {
        // La petición se hizo pero no hubo respuesta
        return {
          success: false,
          message: "No se pudo conectar con el servidor. Verifica que el backend esté ejecutándose en el puerto 5000.",
        }
      } else {
        // Algo más pasó
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
