"use client"

import { useState, useEffect } from "react"
import axios from "axios"

const ConnectionStatus = () => {
  const [status, setStatus] = useState("checking") // checking, connected, error
  const [error, setError] = useState(null)

  useEffect(() => {
    checkConnection()
    // Verificar cada 30 segundos
    const interval = setInterval(checkConnection, 30000)
    return () => clearInterval(interval)
  }, [])

  const checkConnection = async () => {
    try {
      const response = await axios.get("http://localhost:5000/health", {
        timeout: 5000,
      })
      if (response.data.status === "OK") {
        setStatus("connected")
        setError(null)
      }
    } catch (err) {
      setStatus("error")
      if (err.code === "ECONNREFUSED" || err.message.includes("Network Error")) {
        setError("Backend no disponible en puerto 5000")
      } else {
        setError(err.message)
      }
    }
  }

  if (status === "connected") {
    return null // No mostrar nada si está conectado
  }

  return (
    <div className={`connection-status ${status}`}>
      <div className="connection-content">
        {status === "checking" && (
          <>
            <div className="loading-spinner"></div>
            <span>Verificando conexión...</span>
          </>
        )}
        {status === "error" && (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
            <span>Error de conexión: {error}</span>
            <button onClick={checkConnection} className="retry-btn">
              Reintentar
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default ConnectionStatus
