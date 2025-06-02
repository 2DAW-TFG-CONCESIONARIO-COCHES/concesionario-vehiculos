"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { vehiculoService, modeloService, marcaService } from "../../services/api"

const VehiculoForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    vin: "",
    color: "",
    precio: "",
    kilometraje: 0,
    combustible: "gasolina",
    transmision: "manual",
    estado: "nuevo",
    descripcion: "",
    imagenes: [],
    modeloId: "",
    marcaId: "", // Para seleccionar la marca primero
  })
  const [marcas, setMarcas] = useState([])
  const [modelos, setModelos] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const isEditing = !!id

  useEffect(() => {
    const fetchMarcas = async () => {
      try {
        const response = await marcaService.getAll()
        setMarcas(response.data)
      } catch (err) {
        setError("Error al cargar las marcas")
        console.error(err)
      }
    }

    fetchMarcas()

    if (isEditing) {
      const fetchVehiculo = async () => {
        try {
          setLoading(true)
          const response = await vehiculoService.getById(id)
          const vehiculo = response.data

          // Obtener el modelo y la marca
          const modeloResponse = await modeloService.getById(vehiculo.modeloId)
          const modelo = modeloResponse.data

          setFormData({
            vin: vehiculo.vin,
            color: vehiculo.color,
            precio: vehiculo.precio,
            kilometraje: vehiculo.kilometraje,
            combustible: vehiculo.combustible,
            transmision: vehiculo.transmision,
            estado: vehiculo.estado,
            descripcion: vehiculo.descripcion || "",
            imagenes: vehiculo.imagenes || [],
            modeloId: vehiculo.modeloId,
            marcaId: modelo.marcaId,
          })

          // Cargar los modelos de la marca
          const modelosResponse = await modeloService.getByMarca(modelo.marcaId)
          setModelos(modelosResponse.data)

          setLoading(false)
        } catch (err) {
          setError("Error al cargar los datos del vehículo")
          setLoading(false)
          console.error(err)
        }
      }

      fetchVehiculo()
    }
  }, [id, isEditing])

  const handleChange = (e) => {
    const { name, value, type } = e.target

    if (type === "number") {
      setFormData({
        ...formData,
        [name]: Number.parseFloat(value),
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  const handleMarcaChange = async (e) => {
    const marcaId = e.target.value
    setFormData({
      ...formData,
      marcaId,
      modeloId: "", // Resetear el modelo al cambiar la marca
    })

    if (marcaId) {
      try {
        const response = await modeloService.getByMarca(marcaId)
        setModelos(response.data)
      } catch (err) {
        setError("Error al cargar los modelos de la marca")
        console.error(err)
      }
    } else {
      setModelos([])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Extraer solo los campos necesarios para el vehículo
    const vehiculoData = {
      vin: formData.vin,
      color: formData.color,
      precio: formData.precio,
      kilometraje: formData.kilometraje,
      combustible: formData.combustible,
      transmision: formData.transmision,
      estado: formData.estado,
      descripcion: formData.descripcion,
      imagenes: formData.imagenes,
      modeloId: formData.modeloId,
    }

    try {
      if (isEditing) {
        await vehiculoService.update(id, vehiculoData)
      } else {
        await vehiculoService.create(vehiculoData)
      }
      navigate("/vehiculos")
    } catch (err) {
      setError("Error al guardar el vehículo")
      setLoading(false)
      console.error(err)
    }
  }

  if (loading && isEditing) return <div>Cargando datos...</div>

  return (
    <div className="vehiculo-form">
      <h2>{isEditing ? "Editar Vehículo" : "Nuevo Vehículo"}</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="vin">VIN (Número de Identificación del Vehículo)</label>
          <input
            type="text"
            id="vin"
            name="vin"
            className="form-control"
            value={formData.vin}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="marcaId">Marca</label>
          <select
            id="marcaId"
            name="marcaId"
            className="form-control"
            value={formData.marcaId}
            onChange={handleMarcaChange}
            required
          >
            <option value="">Selecciona una marca</option>
            {marcas.map((marca) => (
              <option key={marca.id} value={marca.id}>
                {marca.nombre}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="modeloId">Modelo</label>
          <select
            id="modeloId"
            name="modeloId"
            className="form-control"
            value={formData.modeloId}
            onChange={handleChange}
            required
            disabled={!formData.marcaId}
          >
            <option value="">Selecciona un modelo</option>
            {modelos.map((modelo) => (
              <option key={modelo.id} value={modelo.id}>
                {modelo.nombre} ({modelo.anio})
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="color">Color</label>
          <input
            type="text"
            id="color"
            name="color"
            className="form-control"
            value={formData.color}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="precio">Precio (€)</label>
          <input
            type="number"
            id="precio"
            name="precio"
            className="form-control"
            value={formData.precio}
            onChange={handleChange}
            min="0"
            step="0.01"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="kilometraje">Kilometraje</label>
          <input
            type="number"
            id="kilometraje"
            name="kilometraje"
            className="form-control"
            value={formData.kilometraje}
            onChange={handleChange}
            min="0"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="combustible">Combustible</label>
          <select
            id="combustible"
            name="combustible"
            className="form-control"
            value={formData.combustible}
            onChange={handleChange}
            required
          >
            <option value="gasolina">Gasolina</option>
            <option value="diesel">Diésel</option>
            <option value="electrico">Eléctrico</option>
            <option value="hibrido">Híbrido</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="transmision">Transmisión</label>
          <select
            id="transmision"
            name="transmision"
            className="form-control"
            value={formData.transmision}
            onChange={handleChange}
            required
          >
            <option value="manual">Manual</option>
            <option value="automatica">Automática</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="estado">Estado</label>
          <select
            id="estado"
            name="estado"
            className="form-control"
            value={formData.estado}
            onChange={handleChange}
            required
          >
            <option value="nuevo">Nuevo</option>
            <option value="usado">Usado</option>
            <option value="vendido">Vendido</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="descripcion">Descripción</label>
          <textarea
            id="descripcion"
            name="descripcion"
            className="form-control"
            value={formData.descripcion}
            onChange={handleChange}
            rows="4"
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Guardando..." : "Guardar"}
        </button>
      </form>
    </div>
  )
}

export default VehiculoForm
