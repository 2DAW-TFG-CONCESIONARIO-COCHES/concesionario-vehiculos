"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { modeloService } from "../../services/api"

const ModelosList = () => {
  const [modelos, setModelos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchModelos = async () => {
      try {
        const response = await modeloService.getAll()
        setModelos(response.data)
        setLoading(false)
      } catch (err) {
        setError("Error al cargar los modelos")
        setLoading(false)
        console.error(err)
      }
    }

    fetchModelos()
  }, [])

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este modelo?")) {
      try {
        await modeloService.delete(id)
        setModelos(modelos.filter((modelo) => modelo.id !== id))
      } catch (err) {
        setError("Error al eliminar el modelo")
        console.error(err)
      }
    }
  }

  const getTipoLabel = (tipo) => {
    const tipos = {
      sedan: "Sedán",
      suv: "SUV",
      hatchback: "Hatchback",
      pickup: "Pickup",
      deportivo: "Deportivo",
      otro: "Otro",
    }
    return tipos[tipo] || tipo
  }

  if (loading) return <div>Cargando modelos...</div>
  if (error) return <div className="alert alert-danger">{error}</div>

  return (
    <div className="modelos-list">
      <h2>Listado de Modelos</h2>
      <Link to="/modelos/nuevo" className="btn btn-primary mb-3">
        Añadir Nuevo Modelo
      </Link>

      {modelos.length === 0 ? (
        <p>No hay modelos registrados.</p>
      ) : (
        <div className="grid">
          {modelos.map((modelo) => (
            <div key={modelo.id} className="card">
              <div className="card-body">
                <h3 className="card-title">{modelo.nombre}</h3>
                <p>Marca: {modelo.Marca?.nombre || "No especificada"}</p>
                <p>Año: {modelo.anio}</p>
                <p>Tipo: {getTipoLabel(modelo.tipo)}</p>
                <div className="mt-3">
                  <Link to={`/modelos/editar/${modelo.id}`} className="btn btn-sm btn-primary me-2">
                    Editar
                  </Link>
                  <button onClick={() => handleDelete(modelo.id)} className="btn btn-sm btn-danger">
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ModelosList
