"use client"

import { createContext, useState, useEffect } from "react"
import axios from "axios"

export const AuthContext = createContext()

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
      const response = await axios.get("/api/auth/profile", {
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
      const response = await axios.post("/api/auth/signin", { email, password })
      const { token, usuario } = response.data

      // Guardar token en localStorage
      localStorage.setItem("token", token)

      // Actualizar estado
      setToken(token)
      setUser(usuario)

      return { success: true }
    } catch (error) {
      console.error("Error al iniciar sesión:", error)
      return {
        success: false,
        message: error.response?.data?.message || "Error al iniciar sesión",
      }
    }
  }

  const register = async (userData) => {
    try {
      const response = await axios.post("/api/auth/signup", userData)
      return { success: true, data: response.data }
    } catch (error) {
      console.error("Error al registrar usuario:", error)
      return {
        success: false,
        message: error.response?.data?.message || "Error al registrar usuario",
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
    return !!token
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
