"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { vehiculoService, modeloService, marcaService } from "../../services/api"
import { compressImage, blobToBase64 } from "../../utils/imageUtils"

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
    marcaId: "",
  })
  const [marcas, setMarcas] = useState([])
  const [modelos, setModelos] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [fieldErrors, setFieldErrors] = useState({})
  const [imagePreviewUrls, setImagePreviewUrls] = useState([])
  const [dragActive, setDragActive] = useState(false)
  const [uploadingImages, setUploadingImages] = useState(false)
  const isEditing = !!id

  const getEstadoLabel = (estado) => {
    const estados = {
      nuevo: "Nuevo",
      usado: "Usado",
      vendido: "Vendido",
    }
    return estados[estado] || estado
  }

  const getBadgeClass = (estado) => {
    const clases = {
      nuevo: "badge-nuevo",
      usado: "badge-usado",
      vendido: "badge-vendido",
    }
    return clases[estado] || ""
  }

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

          if (vehiculo.imagenes && vehiculo.imagenes.length > 0) {
            setImagePreviewUrls(vehiculo.imagenes)
          }

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

    // Limpiar errores del campo cuando el usuario empiece a escribir
    if (fieldErrors[name]) {
      setFieldErrors({
        ...fieldErrors,
        [name]: null,
      })
    }

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
      modeloId: "",
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

  const handleImageUpload = async (e) => {
    e.preventDefault()
    const files = e.target.files || (e.dataTransfer && e.dataTransfer.files)

    if (!files || files.length === 0) return

    setUploadingImages(true)
    const newImageUrls = [...imagePreviewUrls]
    const newImages = [...formData.imagenes]

    try {
      for (const file of Array.from(files)) {
        // Comprimir la imagen
        const compressedBlob = await compressImage(file, 800, 600, 0.8)

        // Crear URL para vista previa
        const imageUrl = URL.createObjectURL(compressedBlob)
        newImageUrls.push(imageUrl)

        // Convertir a base64
        const base64 = await blobToBase64(compressedBlob)
        newImages.push(base64)
      }

      setImagePreviewUrls(newImageUrls)
      setFormData({
        ...formData,
        imagenes: newImages,
      })
    } catch (error) {
      console.error("Error al procesar las imágenes:", error)
      setError("Error al procesar las imágenes")
    } finally {
      setUploadingImages(false)
    }
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleImageUpload(e)
    }
  }

  const removeImage = (index) => {
    const newImageUrls = [...imagePreviewUrls]
    const newImages = [...formData.imagenes]

    newImageUrls.splice(index, 1)
    newImages.splice(index, 1)

    setImagePreviewUrls(newImageUrls)
    setFormData({
      ...formData,
      imagenes: newImages,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setFieldErrors({})

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
      console.error("Error al guardar vehículo:", err)

      if (err.response?.data) {
        const errorData = err.response.data

        // Manejar errores específicos
        if (errorData.error === "DUPLICATE_ENTRY" || errorData.field) {
          setFieldErrors({
            [errorData.field]: errorData.message,
          })
          setError(`Error: ${errorData.message}`)
        } else if (errorData.errors && Array.isArray(errorData.errors)) {
          // Manejar múltiples errores de validación
          const errors = {}
          errorData.errors.forEach((err) => {
            errors[err.field] = err.message
          })
          setFieldErrors(errors)
          setError("Por favor, corrige los errores en el formulario")
        } else {
          setError(errorData.message || "Error al guardar el vehículo")
        }
      } else {
        setError("Error de conexión. Por favor, inténtalo de nuevo.")
      }

      setLoading(false)
    }
  }

  if (loading && isEditing) {
    return (
      <div className="vehiculo-form-container">
        <div className="container">
          <div className="text-center py-5">
            <div className="loading-spinner" style={{ width: "40px", height: "40px", borderWidth: "4px" }}></div>
            <p className="mt-3">Cargando datos...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="vehiculo-form-container">
      <div className="container">
        <div className="vehiculo-form-card">
          <div className="vehiculo-form-header">
            <div className="container">
              <h1 className="vehiculo-form-title">{isEditing ? "Editar Vehículo" : "Nuevo Vehículo"}</h1>
              <p className="vehiculo-form-subtitle">
                {isEditing ? "Actualiza la información del vehículo" : "Añade un nuevo vehículo al inventario"}
              </p>
              {isEditing && (
                <div className={`vehiculo-form-badge ${getBadgeClass(formData.estado)}`}>
                  {getEstadoLabel(formData.estado)}
                </div>
              )}
            </div>
          </div>

          <div className="vehiculo-form-body">
            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
              {/* Información básica */}
              <div className="form-section">
                <h3 className="form-section-title">
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
                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                  </svg>
                  Información Básica
                </h3>
                <div className="form-row">
                  <div className="form-group-enhanced">
                    <label htmlFor="vin">
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
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                      </svg>
                      VIN (Número de Identificación)
                    </label>
                    <input
                      type="text"
                      id="vin"
                      name="vin"
                      className={`form-control ${fieldErrors.vin ? "error" : ""}`}
                      value={formData.vin}
                      onChange={handleChange}
                      placeholder="Ej: 1HGBH41JXMN109186"
                      required
                    />
                    {fieldErrors.vin && <span className="error-message">{fieldErrors.vin}</span>}
                  </div>
                  <div className="form-group-enhanced">
                    <label htmlFor="color">
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
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M12 2a7 7 0 1 0 10 10"></path>
                      </svg>
                      Color
                    </label>
                    <input
                      type="text"
                      id="color"
                      name="color"
                      className="form-control"
                      value={formData.color}
                      onChange={handleChange}
                      placeholder="Ej: Rojo, Azul, Negro"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Marca y Modelo */}
              <div className="form-section">
                <h3 className="form-section-title">
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
                    <path d="M7 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
                    <path d="M17 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
                    <path d="M5 17h-2v-6l2-5h9l4 5h1a2 2 0 0 1 2 2v4h-2m-4 0h-6m-6 -6h15m-6 0v-5"></path>
                  </svg>
                  Marca y Modelo
                </h3>
                <div className="form-row">
                  <div className="form-group-enhanced">
                    <label htmlFor="marcaId">
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
                        <path d="M20 6L9 17l-5-5"></path>
                      </svg>
                      Marca
                    </label>
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
                  <div className="form-group-enhanced">
                    <label htmlFor="modeloId">
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
                        <path d="M20 6L9 17l-5-5"></path>
                      </svg>
                      Modelo
                    </label>
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
                </div>
              </div>

              {/* Precio y Características */}
              <div className="form-section">
                <h3 className="form-section-title">
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
                    <line x1="12" y1="1" x2="12" y2="23"></line>
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                  </svg>
                  Precio y Características
                </h3>
                <div className="form-row">
                  <div className="form-group-enhanced">
                    <label htmlFor="precio">
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
                        <line x1="12" y1="1" x2="12" y2="23"></line>
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                      </svg>
                      Precio (€)
                    </label>
                    <input
                      type="number"
                      id="precio"
                      name="precio"
                      className="form-control"
                      value={formData.precio}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      placeholder="Ej: 25000"
                      required
                    />
                  </div>
                  <div className="form-group-enhanced">
                    <label htmlFor="kilometraje">
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
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                      Kilometraje
                    </label>
                    <input
                      type="number"
                      id="kilometraje"
                      name="kilometraje"
                      className="form-control"
                      value={formData.kilometraje}
                      onChange={handleChange}
                      min="0"
                      placeholder="Ej: 50000"
                      required
                    />
                  </div>
                  <div className="form-group-enhanced">
                    <label htmlFor="estado">
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
                        <path d="M20 6L9 17l-5-5"></path>
                      </svg>
                      Estado
                    </label>
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
                </div>
              </div>

              {/* Motor y Transmisión */}
              <div className="form-section">
                <h3 className="form-section-title">
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
                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                  </svg>
                  Motor y Transmisión
                </h3>
                <div className="form-row">
                  <div className="form-group-enhanced">
                    <label htmlFor="combustible">
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
                        <line x1="3" y1="22" x2="21" y2="22"></line>
                        <line x1="6" y1="18" x2="6" y2="11"></line>
                        <line x1="10" y1="18" x2="10" y2="11"></line>
                        <line x1="14" y1="18" x2="14" y2="11"></line>
                        <line x1="18" y1="18" x2="18" y2="13"></line>
                        <line x1="6" y1="7" x2="6" y2="2"></line>
                        <line x1="10" y1="9" x2="10" y2="2"></line>
                        <line x1="14" y1="9" x2="14" y2="2"></line>
                        <line x1="18" y1="11" x2="18" y2="2"></line>
                      </svg>
                      Combustible
                    </label>
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
                  <div className="form-group-enhanced">
                    <label htmlFor="transmision">
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
                        <circle cx="12" cy="12" r="3"></circle>
                        <path d="M12 1v6m0 6v6"></path>
                        <path d="M21 12h-6m-6 0H3"></path>
                      </svg>
                      Transmisión
                    </label>
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
                </div>
              </div>

              {/* Descripción */}
              <div className="form-section">
                <h3 className="form-section-title">
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
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                  Descripción
                </h3>
                <div className="form-group-enhanced">
                  <label htmlFor="descripcion">
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
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                    Descripción adicional
                  </label>
                  <textarea
                    id="descripcion"
                    name="descripcion"
                    className="form-control"
                    value={formData.descripcion}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Describe las características especiales, equipamiento, historial, etc."
                  ></textarea>
                </div>
              </div>

              {/* Carga de imágenes */}
              <div className="form-section">
                <h3 className="form-section-title">
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
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                  </svg>
                  Imágenes del Vehículo
                </h3>
                <div
                  className={`image-upload-container ${dragActive ? "drag-active" : ""}`}
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById("image-upload").click()}
                >
                  <div className="image-upload-icon">
                    {uploadingImages ? (
                      <div
                        className="loading-spinner"
                        style={{ width: "48px", height: "48px", borderWidth: "4px" }}
                      ></div>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="48"
                        height="48"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <circle cx="8.5" cy="8.5" r="1.5"></circle>
                        <polyline points="21 15 16 10 5 21"></polyline>
                      </svg>
                    )}
                  </div>
                  <p className="image-upload-text">
                    {uploadingImages
                      ? "Procesando imágenes..."
                      : "Arrastra y suelta imágenes aquí o haz clic para seleccionar"}
                  </p>
                  <p className="image-upload-hint">
                    Las imágenes se comprimirán automáticamente para optimizar el tamaño
                  </p>
                  <input
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    style={{ display: "none" }}
                    disabled={uploadingImages}
                  />
                </div>

                {/* Vista previa de imágenes */}
                {imagePreviewUrls.length > 0 && (
                  <div className="image-preview-container">
                    {imagePreviewUrls.map((url, index) => (
                      <div key={index} className="image-preview-wrapper">
                        <img
                          src={url || "/placeholder.svg"}
                          alt={`Vista previa ${index + 1}`}
                          className="image-preview"
                        />
                        <button type="button" className="image-preview-remove" onClick={() => removeImage(index)}>
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
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={loading || uploadingImages}>
                  {loading ? (
                    <>
                      <span className="loading-spinner"></span>
                      {isEditing ? "Actualizando..." : "Guardando..."}
                    </>
                  ) : isEditing ? (
                    "Actualizar Vehículo"
                  ) : (
                    "Guardar Vehículo"
                  )}
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => navigate("/vehiculos")}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VehiculoForm
