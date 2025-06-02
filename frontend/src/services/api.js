import axios from "axios"

// Crear instancia de axios
const api = axios.create({
  baseURL: "/api",
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

export default api
