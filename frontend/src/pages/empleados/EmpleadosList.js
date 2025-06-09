"use client"

import { useState, useEffect, useContext } from "react"
import { Link } from "react-router-dom"
import { empleadoService } from "../../services/api"
import { AuthContext } from "../../context/AuthContext"

const EmpleadosList = () => {
  const [empleados, setEmpleados] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user } = useContext(AuthContext)

  useEffect(() => {
    const fetchEmpleados = async () => {
      try {
        const response = await empleadoService.getAll()
        setEmpleados(response.data)
        setLoading(false)
      } catch (err) {
        setError("Error al cargar los empleados")
        setLoading(false)
        console.error(err)
      }
    }

    fetchEmpleados()
  }, [])

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este empleado?")) {
      try {
        await empleadoService.delete(id)
        setEmpleados(empleados.filter((empleado) => empleado.id !== id))
      } catch (err) {
        if (err.response?.status === 400) {
          setError(err.response.data.message)
        } else {
          setError("Error al eliminar el empleado")
        }
        console.error(err)
      }
    }
  }

  const getRolLabel = (rol) => {
    return rol === "admin" ? "Administrador" : "Empleado"
  }

  const getRolBadgeClass = (rol) => {
    return rol === "admin" ? "badge-admin" : "badge-empleado"
  }

  if (loading) return <div>Cargando empleados...</div>
  if (error) return <div className="alert alert-danger">{error}</div>

  return (
    <div className="empleados-list">
      <div className="page-header">
        <h2>Gestión de Empleados</h2>
        <Link to="/empleados/nuevo" className="btn btn-primary">
          Añadir Nuevo Empleado
        </Link>
      </div>

      {empleados.length === 0 ? (
        <p>No hay empleados registrados.</p>
      ) : (
        <div className="empleados-grid">
          {empleados.map((empleado) => (
            <div key={empleado.id} className="empleado-card">
              <div className="empleado-header">
                <h3 className="empleado-name">
                  {empleado.nombre} {empleado.apellidos}
                </h3>
                <span className={`badge ${getRolBadgeClass(empleado.rol)}`}>{getRolLabel(empleado.rol)}</span>
              </div>

              <div className="empleado-info">
                <p>
                  <strong>Email:</strong> {empleado.email}
                </p>
                <p>
                  <strong>Fecha de registro:</strong> {new Date(empleado.createdAt).toLocaleDateString()}
                </p>
                {empleado.id === user?.id && <span className="current-user-badge">Eres tú</span>}
              </div>

              <div className="empleado-actions">
                <Link to={`/empleados/editar/${empleado.id}`} className="btn btn-sm btn-primary">
                  Editar
                </Link>
                <Link to={`/empleados/password/${empleado.id}`} className="btn btn-sm btn-secondary">
                  Cambiar Contraseña
                </Link>
                {empleado.id !== user?.id && (
                  <button onClick={() => handleDelete(empleado.id)} className="btn btn-sm btn-danger">
                    Eliminar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .empleados-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 1.5rem;
        }

        .empleado-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }

        .empleado-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }

        .empleado-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .empleado-name {
          font-size: 1.2rem;
          margin: 0;
          color: #333;
        }

        .badge {
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .badge-admin {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .badge-empleado {
          background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
          color: white;
        }

        .empleado-info {
          margin-bottom: 1.5rem;
        }

        .empleado-info p {
          margin: 0.5rem 0;
          color: #666;
        }

        .current-user-badge {
          background: #ffc107;
          color: #212529;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .empleado-actions {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .empleado-actions .btn {
          flex: 1;
          min-width: 80px;
        }
      `}</style>
    </div>
  )
}

export default EmpleadosList
