"use client"

import { useContext } from "react"
import { Navigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useContext(AuthContext)

  if (loading) {
    return <div>Cargando...</div>
  }

  if (!isAuthenticated() || !isAdmin()) {
    return <Navigate to="/login" />
  }

  return children
}

export default AdminRoute
