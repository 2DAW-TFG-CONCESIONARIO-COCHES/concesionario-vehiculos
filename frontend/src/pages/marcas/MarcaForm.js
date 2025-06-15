"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { marcaService } from "../../services/api"
import { compressImage, blobToBase64 } from "../../utils/imageUtils"

const MarcaForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    nombre: "",
    pais: "",
    logo: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [logoPreview, setLogoPreview] = useState(null)
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const isEditing = !!id

  useEffect(() => {
    if (isEditing) {
      const fetchMarca = async () => {
        try {
          setLoading(true)
          const response = await marcaService.getById(id)
          setFormData({
            nombre: response.data.nombre,
            pais: response.data.pais || "",
            logo: response.data.logo || "",
          })

          // Solo establecer logoPreview si hay un logo real
          if (response.data.logo) {
            setLogoPreview(response.data.logo)
          }

          setLoading(false)
        } catch (err) {
          setError("Error al cargar los datos de la marca")
          setLoading(false)
          console.error(err)
        }
      }

      fetchMarca()
    }
  }, [id, isEditing])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleLogoUpload = async (e) => {
    e.preventDefault()
    const files = e.target.files || (e.dataTransfer && e.dataTransfer.files)

    if (!files || files.length === 0) return

    setUploadingLogo(true)

    try {
      const file = files[0]

      // Comprimir la imagen
      const compressedBlob = await compressImage(file, 400, 400, 0.8)

      // Crear URL para vista previa
      const imageUrl = URL.createObjectURL(compressedBlob)
      setLogoPreview(imageUrl)

      // Convertir a base64
      const base64 = await blobToBase64(compressedBlob)

      setFormData({
        ...formData,
        logo: base64,
      })
    } catch (error) {
      console.error("Error al procesar el logo:", error)
      setError("Error al procesar el logo")
    } finally {
      setUploadingLogo(false)
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
      handleLogoUpload(e)
    }
  }

  const removeLogo = () => {
    setLogoPreview(null)
    setFormData({
      ...formData,
      logo: "",
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (isEditing) {
        await marcaService.update(id, formData)
      } else {
        await marcaService.create(formData)
      }
      navigate("/marcas")
    } catch (err) {
      setError("Error al guardar la marca")
      setLoading(false)
      console.error(err)
    }
  }

  if (loading && isEditing) return <div>Cargando datos...</div>

  return (
    <div className="marca-form-container">
      <div className="container">
        <div className="marca-form-card">
          <div className="marca-form-header">
            <div className="container">
              <h1 className="marca-form-title">{isEditing ? "Editar Marca" : "Nueva Marca"}</h1>
              <p className="marca-form-subtitle">
                {isEditing ? "Actualiza la información de la marca" : "Añade una nueva marca al catálogo"}
              </p>
            </div>
          </div>

          <div className="marca-form-body">
            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
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
                  Información de la Marca
                </h3>
                <div className="form-row">
                  <div className="form-group-enhanced">
                    <label htmlFor="nombre">
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
                      Nombre
                    </label>
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      className="form-control"
                      value={formData.nombre}
                      onChange={handleChange}
                      placeholder="Ej: Toyota, BMW, Mercedes-Benz"
                      required
                    />
                  </div>
                  <div className="form-group-enhanced">
                    <label htmlFor="pais">
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
                        <circle cx="12" cy="10" r="3"></circle>
                        <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 7 8 11.7z"></path>
                      </svg>
                      País de Origen
                    </label>
                    <input
                      type="text"
                      id="pais"
                      name="pais"
                      className="form-control"
                      value={formData.pais}
                      onChange={handleChange}
                      placeholder="Ej: Japón, Alemania, Estados Unidos"
                    />
                  </div>
                </div>
              </div>

              {/* Carga de logo */}
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
                  Logo de la Marca
                </h3>

                {!logoPreview ? (
                  <div
                    className={`logo-upload-container ${dragActive ? "drag-active" : ""}`}
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById("logo-upload").click()}
                  >
                    <div className="logo-upload-icon">
                      {uploadingLogo ? (
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
                    <p className="logo-upload-text">
                      {uploadingLogo
                        ? "Procesando logo..."
                        : "Arrastra y suelta el logo aquí o haz clic para seleccionar"}
                    </p>
                    <p className="logo-upload-hint">El logo se comprimirá automáticamente para optimizar el tamaño</p>
                    <input
                      type="file"
                      id="logo-upload"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      style={{ display: "none" }}
                      disabled={uploadingLogo}
                    />
                  </div>
                ) : (
                  <div className="logo-preview-container">
                    <div className="logo-preview-wrapper">
                      <img src={logoPreview || "/placeholder.svg"} alt="Logo de la marca" className="logo-preview" />
                      <button type="button" className="logo-preview-remove" onClick={removeLogo}>
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
                  </div>
                )}
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={loading || uploadingLogo}>
                  {loading ? (
                    <>
                      <span className="loading-spinner"></span>
                      {isEditing ? "Actualizando..." : "Guardando..."}
                    </>
                  ) : isEditing ? (
                    "Actualizar Marca"
                  ) : (
                    "Guardar Marca"
                  )}
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => navigate("/marcas")}>
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

export default MarcaForm
