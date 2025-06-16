"use client"

const VehiculoPlaceholder = ({ tipo, color, marca, modelo }) => {
  const getVehiculoIcon = (tipo) => {
    const iconStyle = {
      width: "120px",
      height: "80px",
      fill: "currentColor",
    }

    switch (tipo) {
      case "sedan":
        return (
          <svg viewBox="0 0 200 120" style={iconStyle}>
            <path d="M20 80 L30 60 L50 50 L150 50 L170 60 L180 80 L180 90 L170 95 L165 90 L35 90 L30 95 L20 90 Z" />
            <path d="M40 50 L40 40 L160 40 L160 50" />
            <circle cx="50" cy="90" r="12" />
            <circle cx="150" cy="90" r="12" />
            <circle cx="50" cy="90" r="6" fill="white" />
            <circle cx="150" cy="90" r="6" fill="white" />
          </svg>
        )

      case "suv":
        return (
          <svg viewBox="0 0 200 120" style={iconStyle}>
            <path d="M15 85 L25 55 L45 45 L155 45 L175 55 L185 85 L185 95 L175 100 L170 95 L30 95 L25 100 L15 95 Z" />
            <path d="M35 45 L35 30 L165 30 L165 45" />
            <path d="M45 30 L45 20 L155 20 L155 30" />
            <circle cx="45" cy="95" r="14" />
            <circle cx="155" cy="95" r="14" />
            <circle cx="45" cy="95" r="7" fill="white" />
            <circle cx="155" cy="95" r="7" fill="white" />
          </svg>
        )

      case "hatchback":
        return (
          <svg viewBox="0 0 200 120" style={iconStyle}>
            <path d="M25 80 L35 60 L50 50 L130 50 L145 55 L155 70 L155 80 L155 90 L145 95 L140 90 L35 90 L30 95 L25 90 Z" />
            <path d="M40 50 L40 40 L130 40 L140 45 L145 55" />
            <circle cx="50" cy="90" r="12" />
            <circle cx="130" cy="90" r="12" />
            <circle cx="50" cy="90" r="6" fill="white" />
            <circle cx="130" cy="90" r="6" fill="white" />
          </svg>
        )

      case "pickup":
        return (
          <svg viewBox="0 0 200 120" style={iconStyle}>
            <path d="M20 80 L30 60 L50 50 L110 50 L110 40 L170 40 L180 60 L180 80 L180 90 L170 95 L165 90 L35 90 L30 95 L20 90 Z" />
            <path d="M40 50 L40 40 L110 40 L110 50" />
            <path d="M110 40 L110 80 L180 80" />
            <circle cx="50" cy="90" r="12" />
            <circle cx="150" cy="90" r="12" />
            <circle cx="50" cy="90" r="6" fill="white" />
            <circle cx="150" cy="90" r="6" fill="white" />
          </svg>
        )

      case "deportivo":
        return (
          <svg viewBox="0 0 200 120" style={iconStyle}>
            <path d="M25 85 L40 65 L60 55 L140 55 L160 65 L175 85 L175 90 L165 95 L160 90 L40 90 L35 95 L25 90 Z" />
            <path d="M50 55 L50 45 L150 45 L150 55" />
            <path d="M60 45 L60 35 L140 35 L140 45" />
            <circle cx="55" cy="90" r="10" />
            <circle cx="145" cy="90" r="10" />
            <circle cx="55" cy="90" r="5" fill="white" />
            <circle cx="145" cy="90" r="5" fill="white" />
          </svg>
        )

      default:
        return (
          <svg viewBox="0 0 200 120" style={iconStyle}>
            <path d="M20 80 L30 60 L50 50 L150 50 L170 60 L180 80 L180 90 L170 95 L165 90 L35 90 L30 95 L20 90 Z" />
            <path d="M40 50 L40 40 L160 40 L160 50" />
            <circle cx="50" cy="90" r="12" />
            <circle cx="150" cy="90" r="12" />
            <circle cx="50" cy="90" r="6" fill="white" />
            <circle cx="150" cy="90" r="6" fill="white" />
          </svg>
        )
    }
  }

  const getColorFromName = (colorName) => {
    const colorMap = {
      blanco: "#f8f9fa",
      negro: "#212529",
      gris: "#6c757d",
      plata: "#adb5bd",
      azul: "#0d6efd",
      rojo: "#dc3545",
      verde: "#198754",
      amarillo: "#ffc107",
      naranja: "#fd7e14",
      marrón: "#8b4513",
      beige: "#f5f5dc",
      violeta: "#6f42c1",
      rosa: "#e91e63",
    }

    return colorMap[colorName?.toLowerCase()] || "#667eea"
  }

  const vehicleColor = getColorFromName(color)
  const isLightColor = ["blanco", "amarillo", "beige", "plata"].includes(color?.toLowerCase())

  return (
    <div className="vehiculo-placeholder">
      <div
        className="vehiculo-placeholder-content"
        style={{
          background: `linear-gradient(135deg, ${vehicleColor} 0%, ${vehicleColor}dd 100%)`,
          color: isLightColor ? "#333" : "white",
        }}
      >
        <div className="vehiculo-icon">{getVehiculoIcon(tipo)}</div>
        <div className="vehiculo-placeholder-info">
          <div className="vehiculo-placeholder-marca">{marca}</div>
          <div className="vehiculo-placeholder-modelo">{modelo}</div>
          <div className="vehiculo-placeholder-color">{color}</div>
        </div>
      </div>
    </div>
  )
}

export default VehiculoPlaceholder
