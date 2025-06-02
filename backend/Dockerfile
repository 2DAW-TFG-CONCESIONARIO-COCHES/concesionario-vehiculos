# Usar la imagen oficial de Node.js
FROM node:18-alpine

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Instalar nodemon globalmente para desarrollo
RUN npm install -g nodemon

# Copiar el resto del código
COPY . .

# Exponer el puerto
EXPOSE 5000

# Comando por defecto
CMD ["npm", "run", "dev"]
