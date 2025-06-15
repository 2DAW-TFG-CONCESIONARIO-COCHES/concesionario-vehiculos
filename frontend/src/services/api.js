import axios from "axios"

// Crear instancia de axios con la URL base correcta
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  timeout: 10000,
})

// Interceptor para añadir el token a las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    console.error("Error en la petición:", error)
    return Promise.reject(error)
  },
)

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    console.error("Error en la respuesta:", error)

    // Si el token ha expirado, redirigir al login
    if (error.response?.status === 401) {
      localStorage.removeItem("token")
      window.location.href = "/login"
    }

    return Promise.reject(error)
  },
)

// Servicios para marcas
export const marcaService = {
  getAll: () => api.get("/marcas"),
  getById: (id) => api.get(`/marcas/${id}`),
  create: (data) => api.post("/marcas", data),
  update: (id, data) => api.put(`/marcas/${id}`, data),
  delete: (id) => api.delete(`/marcas/${id}`),
}

// Servicios para modelos
export const modeloService = {
  getAll: () => api.get("/modelos"),
  getById: (id) => api.get(`/modelos/${id}`),
  getByMarca: (marcaId) => api.get(`/modelos/marca/${marcaId}`),
  create: (data) => api.post("/modelos", data),
  update: (id, data) => api.put(`/modelos/${id}`, data),
  delete: (id) => api.delete(`/modelos/${id}`),
}

// Servicios para vehículos
export const vehiculoService = {
  getAll: () => api.get("/vehiculos"),
  getById: (id) => api.get(`/vehiculos/${id}`),
  search: (params) => api.get("/vehiculos/search", { params }),
  create: (data) => api.post("/vehiculos", data),
  update: (id, data) => api.put(`/vehiculos/${id}`, data),
  delete: (id) => api.delete(`/vehiculos/${id}`),
}

// Servicios para usuarios
export const usuarioService = {
  getAll: () => api.get("/usuarios"),
  getById: (id) => api.get(`/usuarios/${id}`),
  getStats: () => api.get("/usuarios/stats"),
  create: (data) => api.post("/usuarios", data),
  update: (id, data) => api.put(`/usuarios/${id}`, data),
  delete: (id) => api.delete(`/usuarios/${id}`),
  updateRole: (id, rol) => api.put(`/usuarios/${id}/role`, { rol }),
  changePassword: (id, newPassword) => api.put(`/usuarios/${id}/password`, { newPassword }),
}

export default api
