"use client"

import { useState, useEffect } from "react"
import { usuarioService } from "../../services/api"

const UsuariosAdmin = () => {
  const [usuarios, setUsuarios] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editingUser, setEditingUser] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [passwordUser, setPasswordUser] = useState(null)
  const [newPassword, setNewPassword] = useState("")
  const [newUser, setNewUser] = useState({
    nombre: "",
    apellidos: "",
    email: "",
    password: "",
    rol: "empleado",
  })

  const [filtroNombre, setFiltroNombre] = useState("")
  const [filtroRol, setFiltroRol] = useState("")

  useEffect(() => {
    fetchUsuarios()
    fetchStats()
  }, [])

  const fetchUsuarios = async () => {
    try {
      setLoading(true)
      const response = await usuarioService.getAll()
      setUsuarios(response.data)
      setLoading(false)
    } catch (err) {
      setError("Error al cargar los usuarios")
      setLoading(false)
      console.error(err)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await usuarioService.getStats()
      setStats(response.data)
    } catch (err) {
      console.error("Error al cargar estadísticas:", err)
    }
  }

  const usuariosFiltrados = usuarios.filter((usuario) => {
    const coincideNombre =
      usuario.nombre.toLowerCase().includes(filtroNombre.toLowerCase()) ||
      usuario.apellidos.toLowerCase().includes(filtroNombre.toLowerCase()) ||
      usuario.email.toLowerCase().includes(filtroNombre.toLowerCase())
    const coincideRol = filtroRol === "" || usuario.rol === filtroRol
    return coincideNombre && coincideRol
  })

  const limpiarFiltros = () => {
    setFiltroNombre("")
    setFiltroRol("")
  }

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
      try {
        await usuarioService.delete(id)
        setUsuarios(usuarios.filter((usuario) => usuario.id !== id))
        fetchStats() // Actualizar estadísticas
      } catch (err) {
        setError(err.response?.data?.message || "Error al eliminar el usuario")
        console.error(err)
      }
    }
  }

  const handleEditUser = (usuario) => {
    setEditingUser({ ...usuario })
    setShowEditModal(true)
  }

  const handleUpdateUser = async (e) => {
    e.preventDefault()
    try {
      const response = await usuarioService.update(editingUser.id, editingUser)
      setUsuarios(usuarios.map((u) => (u.id === editingUser.id ? response.data.usuario : u)))
      setShowEditModal(false)
      setEditingUser(null)
    } catch (err) {
      setError(err.response?.data?.message || "Error al actualizar el usuario")
      console.error(err)
    }
  }

  const handleCreateUser = async (e) => {
    e.preventDefault()
    try {
      const response = await usuarioService.create(newUser)
      setUsuarios([response.data.usuario, ...usuarios])
      setShowCreateModal(false)
      setNewUser({
        nombre: "",
        apellidos: "",
        email: "",
        password: "",
        rol: "empleado",
      })
      fetchStats() // Actualizar estadísticas
    } catch (err) {
      setError(err.response?.data?.message || "Error al crear el usuario")
      console.error(err)
    }
  }

  const handleRoleChange = async (userId, newRole) => {
    try {
      const response = await usuarioService.updateRole(userId, newRole)
      setUsuarios(usuarios.map((u) => (u.id === userId ? response.data.usuario : u)))
      fetchStats() // Actualizar estadísticas
    } catch (err) {
      setError(err.response?.data?.message || "Error al cambiar el rol del usuario")
      console.error(err)
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    try {
      await usuarioService.changePassword(passwordUser.id, newPassword)
      setShowPasswordModal(false)
      setPasswordUser(null)
      setNewPassword("")
      alert("Contraseña actualizada correctamente")
    } catch (err) {
      setError(err.response?.data?.message || "Error al cambiar la contraseña")
      console.error(err)
    }
  }

  const openPasswordModal = (usuario) => {
    setPasswordUser(usuario)
    setShowPasswordModal(true)
  }

  const getRoleBadgeClass = (rol) => {
    return rol === "admin" ? "badge-admin" : "badge-empleado"
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="usuarios-container">
        <div className="container">
          <div className="text-center py-5">
            <div className="loading-spinner" style={{ width: "40px", height: "40px", borderWidth: "4px" }}></div>
            <p className="mt-3">Cargando usuarios...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="usuarios-container">
      <div className="container">
        <div className="usuarios-header">
          <h1 className="usuarios-title">Gestión de Usuarios</h1>
          <p className="usuarios-subtitle">Administra los usuarios del sistema Concesionario Batoi</p>

          <button onClick={() => setShowCreateModal(true)} className="btn btn-primary mb-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ marginRight: "8px" }}
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <line x1="19" y1="8" x2="24" y2="13"></line>
              <line x1="21.5" y1="10.5" x2="21.5" y2="10.5"></line>
            </svg>
            Crear Usuario
          </button>
        </div>

        {error && (
          <div className="alert alert-danger">
            {error}
            <button
              onClick={() => setError(null)}
              style={{ float: "right", background: "none", border: "none", color: "inherit" }}
            >
              ×
            </button>
          </div>
        )}

        {/* Filtro de usuarios */}
        <div className="usuarios-filtro">
          <div className="filtro-usuario-container">
            <div className="filtro-usuario-header">
              <div className="filtro-usuario-icon">
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
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="M21 21l-4.35-4.35"></path>
                </svg>
              </div>
              <h3 className="filtro-usuario-title">Filtrar Usuarios</h3>
              {(filtroNombre || filtroRol) && (
                <button onClick={limpiarFiltros} className="filtro-limpiar-btn">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                  Limpiar filtros
                </button>
              )}
            </div>

            <div className="filtro-usuario-content">
              <div className="filtro-busqueda">
                <input
                  type="text"
                  placeholder="Buscar por nombre, apellidos o email..."
                  value={filtroNombre}
                  onChange={(e) => setFiltroNombre(e.target.value)}
                  className="filtro-busqueda-input"
                />
              </div>

              <div className="filtro-rol">
                <select value={filtroRol} onChange={(e) => setFiltroRol(e.target.value)} className="filtro-rol-select">
                  <option value="">Todos los roles</option>
                  <option value="admin">Administradores</option>
                  <option value="empleado">Empleados</option>
                </select>
              </div>

              {(filtroNombre || filtroRol) && (
                <div className="filtro-resultado">
                  <span className="filtro-resultado-texto">
                    {usuariosFiltrados.length} usuario{usuariosFiltrados.length !== 1 ? "s" : ""} encontrado
                    {usuariosFiltrados.length !== 1 ? "s" : ""}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Estadísticas */}
        {stats && (
          <div className="stats-container">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <div className="stat-content">
                  <h3>{stats.totalUsuarios}</h3>
                  <p>Total Usuarios</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon admin">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                  </svg>
                </div>
                <div className="stat-content">
                  <h3>{stats.totalAdmins}</h3>
                  <p>Administradores ({stats.porcentajeAdmins}%)</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon empleado">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <div className="stat-content">
                  <h3>{stats.totalEmpleados}</h3>
                  <p>Empleados ({stats.porcentajeEmpleados}%)</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon recent">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                </div>
                <div className="stat-content">
                  <h3>{stats.usuariosRecientes}</h3>
                  <p>Últimos 30 días</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {usuariosFiltrados.length === 0 ? (
          <div className="text-center py-5">
            {usuarios.length === 0 ? (
              <>
                <h3>No hay usuarios registrados</h3>
                <p className="text-muted">Los usuarios aparecerán aquí cuando se registren en el sistema.</p>
              </>
            ) : (
              <>
                <h3>No se encontraron usuarios</h3>
                <p className="text-muted">No hay usuarios que coincidan con los filtros aplicados.</p>
              </>
            )}
          </div>
        ) : (
          <div className="usuarios-grid">
            {usuariosFiltrados.map((usuario) => (
              <div key={usuario.id} className="usuario-card">
                <div className="usuario-header">
                  <div className="usuario-avatar">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="40"
                      height="40"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </div>
                  <div className={`usuario-badge ${getRoleBadgeClass(usuario.rol)}`}>
                    {usuario.rol === "admin" ? "Administrador" : "Empleado"}
                  </div>
                </div>

                <div className="usuario-content">
                  <h3 className="usuario-name">
                    {usuario.nombre} {usuario.apellidos}
                  </h3>
                  <p className="usuario-email">{usuario.email}</p>
                  <p className="usuario-date">Registrado: {formatDate(usuario.createdAt)}</p>

                  <div className="usuario-role-selector">
                    <label htmlFor={`role-${usuario.id}`}>Rol:</label>
                    <select
                      id={`role-${usuario.id}`}
                      value={usuario.rol}
                      onChange={(e) => handleRoleChange(usuario.id, e.target.value)}
                      className="form-control-sm"
                    >
                      <option value="empleado">Empleado</option>
                      <option value="admin">Administrador</option>
                    </select>
                  </div>

                  <div className="usuario-actions">
                    <button onClick={() => handleEditUser(usuario)} className="btn btn-sm btn-primary">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                      Editar
                    </button>
                    <button onClick={() => openPasswordModal(usuario)} className="btn btn-sm btn-warning">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <circle cx="12" cy="16" r="1"></circle>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                      </svg>
                      Contraseña
                    </button>
                    <button onClick={() => handleDelete(usuario.id)} className="btn btn-sm btn-danger">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal de creación */}
        {showCreateModal && (
          <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Crear Nuevo Usuario</h3>
                <button className="modal-close" onClick={() => setShowCreateModal(false)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>

              <form onSubmit={handleCreateUser}>
                <div className="form-group">
                  <label htmlFor="create-nombre">Nombre</label>
                  <input
                    type="text"
                    id="create-nombre"
                    className="form-control"
                    value={newUser.nombre}
                    onChange={(e) => setNewUser({ ...newUser, nombre: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="create-apellidos">Apellidos</label>
                  <input
                    type="text"
                    id="create-apellidos"
                    className="form-control"
                    value={newUser.apellidos}
                    onChange={(e) => setNewUser({ ...newUser, apellidos: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="create-email">Email</label>
                  <input
                    type="email"
                    id="create-email"
                    className="form-control"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="create-password">Contraseña</label>
                  <input
                    type="password"
                    id="create-password"
                    className="form-control"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    required
                    minLength="6"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="create-rol">Rol</label>
                  <select
                    id="create-rol"
                    className="form-control"
                    value={newUser.rol}
                    onChange={(e) => setNewUser({ ...newUser, rol: e.target.value })}
                  >
                    <option value="empleado">Empleado</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Crear Usuario
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal de edición */}
        {showEditModal && editingUser && (
          <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Editar Usuario</h3>
                <button className="modal-close" onClick={() => setShowEditModal(false)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>

              <form onSubmit={handleUpdateUser}>
                <div className="form-group">
                  <label htmlFor="edit-nombre">Nombre</label>
                  <input
                    type="text"
                    id="edit-nombre"
                    className="form-control"
                    value={editingUser.nombre}
                    onChange={(e) => setEditingUser({ ...editingUser, nombre: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="edit-apellidos">Apellidos</label>
                  <input
                    type="text"
                    id="edit-apellidos"
                    className="form-control"
                    value={editingUser.apellidos}
                    onChange={(e) => setEditingUser({ ...editingUser, apellidos: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="edit-email">Email</label>
                  <input
                    type="email"
                    id="edit-email"
                    className="form-control"
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="edit-rol">Rol</label>
                  <select
                    id="edit-rol"
                    className="form-control"
                    value={editingUser.rol}
                    onChange={(e) => setEditingUser({ ...editingUser, rol: e.target.value })}
                  >
                    <option value="empleado">Empleado</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Guardar Cambios
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal de cambio de contraseña */}
        {showPasswordModal && passwordUser && (
          <div className="modal-overlay" onClick={() => setShowPasswordModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Cambiar Contraseña</h3>
                <button className="modal-close" onClick={() => setShowPasswordModal(false)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>

              <form onSubmit={handlePasswordChange}>
                <p>
                  Cambiar contraseña para:{" "}
                  <strong>
                    {passwordUser.nombre} {passwordUser.apellidos}
                  </strong>
                </p>

                <div className="form-group">
                  <label htmlFor="new-password">Nueva Contraseña</label>
                  <input
                    type="password"
                    id="new-password"
                    className="form-control"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength="6"
                    placeholder="Mínimo 6 caracteres"
                  />
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowPasswordModal(false)}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Cambiar Contraseña
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default UsuariosAdmin
