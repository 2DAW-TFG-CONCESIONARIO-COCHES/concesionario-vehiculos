"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { marcaService } from "../../services/api"

const MarcasList = () => {
  const [marcas, setMarcas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchMarcas = async () => {
      try {
        const response = await marcaService.getAll()
        setMarcas(response.data)
        setLoading(false)
      } catch (err) {
        setError("Error al cargar las marcas")
        setLoading(false)
        console.error(err)
      }
    }

    fetchMarcas()
  }, [])

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta marca?")) {
      try {
        await marcaService.delete(id)
        setMarcas(marcas.filter((marca) => marca.id !== id))
      } catch (err) {
        setError("Error al eliminar la marca")
        console.error(err)
      }
    }
  }

  if (loading) return <div>Cargando marcas...</div>
  if (error) return <div className="alert alert-danger">{error}</div>

  return (
    <div className="marcas-list">
      <h2>Listado de Marcas</h2>
      <Link to="/marcas/nueva" className="btn btn-primary mb-3">
        Añadir Nueva Marca
      </Link>

      {marcas.length === 0 ? (
        <p>No hay marcas registradas.</p>
      ) : (
        <div className="grid">
          {marcas.map((marca) => (
            <div key={marca.id} className="card">
              <div className="card-body">
                <h3 className="card-title">{marca.nombre}</h3>
                <p>País: {marca.pais || "No especificado"}</p>
                {marca.logo && (
                  <img
                    src={marca.logo || "/placeholder.svg"}
                    alt={`Logo de ${marca.nombre}`}
                    style={{ maxWidth: "100px" }}
                  />
                )}
                <div className="mt-3">
                  <Link to={`/marcas/editar/${marca.id}`} className="btn btn-sm btn-primary me-2">
                    Editar
                  </Link>
                  <button onClick={() => handleDelete(marca.id)} className="btn btn-sm btn-danger">
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

export default MarcasList
