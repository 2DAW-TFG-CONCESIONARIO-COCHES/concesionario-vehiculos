# Sistema de Gestión de Vehículos para Concesionarios

## Descripción
Sistema web para la gestión integral de un concesionario de vehículos, desarrollado como Trabajo de Fin de Grado (TFG).

## Tecnologías Utilizadas

### Backend
- **Node.js** con Express.js
- **MySQL** como base de datos
- **Sequelize** como ORM
- **JWT** para autenticación
- **bcryptjs** para encriptación de contraseñas

### Frontend
- **React.js** con React Router
- **Axios** para peticiones HTTP
- **CSS** personalizado

### DevOps
- **Docker** y **Docker Compose**
- **Git** para control de versiones

## Funcionalidades

- ✅ Sistema de autenticación (Admin/Empleado)
- ✅ Gestión de marcas de vehículos
- ✅ Gestión de modelos de vehículos
- ✅ Gestión completa de vehículos
- ✅ Búsqueda y filtrado avanzado
- ✅ Interfaz responsive

## Instalación y Configuración

### Prerrequisitos
- Docker y Docker Compose instalados
- Git

### Pasos de instalación

1. **Clonar el repositorio**
\`\`\`bash
git clone https://github.com/tu-usuario/concesionario-vehiculos.git
cd concesionario-vehiculos
\`\`\`

2. **Configurar variables de entorno**
\`\`\`bash
cp .env.example .env
# Editar .env con tus configuraciones
\`\`\`

3. **Ejecutar con Docker**
\`\`\`bash
docker-compose up --build
\`\`\`

4. **Acceder a la aplicación**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- phpMyAdmin: http://localhost:8080

## Estructura del Proyecto

\`\`\`
├── backend/          # API REST con Node.js y Express
├── frontend/         # Aplicación React
├── database/         # Scripts SQL y migraciones
├── docs/            # Documentación del proyecto
└── docker-compose.yaml
\`\`\`

## API Endpoints

### Autenticación
- `POST /api/auth/signin` - Iniciar sesión
- `POST /api/auth/signup` - Registrar usuario
- `GET /api/auth/profile` - Obtener perfil

### Marcas
- `GET /api/marcas` - Listar marcas
- `POST /api/marcas` - Crear marca (Admin)
- `PUT /api/marcas/:id` - Actualizar marca (Admin)
- `DELETE /api/marcas/:id` - Eliminar marca (Admin)

### Modelos
- `GET /api/modelos` - Listar modelos
- `GET /api/modelos/marca/:marcaId` - Modelos por marca
- `POST /api/modelos` - Crear modelo (Admin)
- `PUT /api/modelos/:id` - Actualizar modelo (Admin)
- `DELETE /api/modelos/:id` - Eliminar modelo (Admin)

### Vehículos
- `GET /api/vehiculos` - Listar vehículos
- `GET /api/vehiculos/search` - Buscar vehículos
- `GET /api/vehiculos/:id` - Obtener vehículo
- `POST /api/vehiculos` - Crear vehículo
- `PUT /api/vehiculos/:id` - Actualizar vehículo
- `DELETE /api/vehiculos/:id` - Eliminar vehículo (Admin)

## Credenciales por Defecto

### Base de Datos (phpMyAdmin)
- **Usuario**: concesionario_user
- **Contraseña**: concesionario_pass

## Desarrollo

### Comandos útiles
\`\`\`bash
# Ver logs
docker-compose logs

# Parar servicios
docker-compose down

# Reconstruir servicios
docker-compose up --build

# Ejecutar solo la base de datos
docker-compose up db phpmyadmin
\`\`\`

## Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Añadir nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## Autor

**Tu Nombre** - Pablo Marín

Proyecto desarrollado como Trabajo de Fin de Grado en el curso 2024/2025
