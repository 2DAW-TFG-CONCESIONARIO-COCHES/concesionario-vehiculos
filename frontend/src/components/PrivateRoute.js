"use client"

import { useContext } from "react"
import { Navigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext)

  if (loading) {
    return <div>Cargando...</div>
  }

  if (!isAuthenticated()) {
    return <Navigate to="/login" />
  }

  return children
}

export default PrivateRoute
