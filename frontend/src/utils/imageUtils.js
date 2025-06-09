// Utilidad para comprimir imágenes
export const compressImage = (file, maxWidth = 800, maxHeight = 600, quality = 0.8) => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      const img = new Image()
  
      img.onload = () => {
        // Calcular nuevas dimensiones manteniendo la proporción
        let { width, height } = img
  
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width
            width = maxWidth
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height
            height = maxHeight
          }
        }
  
        canvas.width = width
        canvas.height = height
  
        // Dibujar la imagen redimensionada
        ctx.drawImage(img, 0, 0, width, height)
  
        // Convertir a blob comprimido
        canvas.toBlob(resolve, "image/jpeg", quality)
      }
  
      img.src = URL.createObjectURL(file)
    })
  }
  
  // Convertir blob a base64
  export const blobToBase64 = (blob) => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result)
      reader.readAsDataURL(blob)
    })
  }
  