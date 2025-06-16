# Sistema de Gestión de Vehículos para Concesionarios

## Descripción
Sistema web para la gestión integral de un concesionario de vehículos, desarrollado como Trabajo de Fin de Grado (TFG). Permite gestionar marcas, modelos, vehículos, usuarios y realizar operaciones CRUD completas con autenticación y autorización por roles.

## Tecnologías Utilizadas

### Backend
- **Node.js** v18+ con Express.js
- **MySQL** 8.0 como base de datos
- **Sequelize** como ORM
- **JWT** para autenticación
- **bcryptjs** para encriptación de contraseñas
- **multer** para carga de archivos
- **cors** para manejo de CORS

### Frontend
- **React.js** v18+ con React Router v6
- **Axios** para peticiones HTTP
- **CSS** personalizado con diseño responsive
- **Context API** para gestión de estado

### DevOps
- **Docker** y **Docker Compose** para containerización
- **phpMyAdmin** para administración de base de datos
- **Git** para control de versiones

## Funcionalidades

- ✅ Sistema de autenticación completo (Admin/Empleado)
- ✅ Gestión de marcas de vehículos (CRUD completo)
- ✅ Gestión de modelos de vehículos por marca
- ✅ Gestión completa de vehículos con imágenes
- ✅ Búsqueda y filtrado avanzado de vehículos
- ✅ Sistema de roles y permisos
- ✅ Interfaz responsive para todos los dispositivos
- ✅ Carga de imágenes para vehículos
- ✅ Dashboard administrativo
- ✅ Gestión de usuarios (solo Admin)

## Instalación y Configuración

### Prerrequisitos
- **Docker** v20.10+ y **Docker Compose** v2.0+ instalados
- **Git** para clonar el repositorio
- **Node.js** v18+ (opcional, para desarrollo sin Docker)

### Verificar instalaciones:
\`\`\`bash
docker --version
docker-compose --version
git --version
\`\`\`

### Pasos de instalación completos

#### 1. **Clonar el repositorio**
\`\`\`bash
# Clonar el repositorio
git clone https://github.com/2DAW-TFG-CONCESIONARIO-COCHES/concesionario-vehiculos

# Navegar al directorio del proyecto
cd concesionario-vehiculos

# Verificar que tienes todos los archivos
ls -la
\`\`\`

#### 2. **Configurar variables de entorno**
\`\`\`bash
# Copiar archivos de configuración
cp .env.example .env
cp frontend/.env.example frontend/.env

# Generar JWT Secret seguro (recomendado)
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
# Copiar el resultado y reemplazar JWT_SECRET en .env
\`\`\`

**Nota:** Los valores por defecto están configurados para funcionar inmediatamente con Docker.

#### 3. **Ejecutar con Docker**
\`\`\`bash
# Limpiar contenedores anteriores (si existen)
docker-compose down -v

# Construir y ejecutar todos los servicios
docker-compose up --build

# O ejecutar en segundo plano
docker-compose up --build -d
\`\`\`

#### 4. **Inicializar la base de datos**
\`\`\`bash

# Crear tablas y relaciones
docker-compose exec backend node scripts/seed-database.js

# Crear usuario administrador por defecto
docker-compose exec backend node scripts/create-admin.js
\`\`\`

#### 5. **Acceder a la aplicación**
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **phpMyAdmin:** http://localhost:8080

## Estructura del Proyecto

\`\`\`
concesionario-vehiculos/
├── backend/                 # API REST con Node.js y Express
│   ├── config/             # Configuración de base de datos
│   ├── controllers/        # Controladores de la API
│   ├── middleware/         # Middlewares (auth, cors, etc.)
│   ├── models/             # Modelos de Sequelize
│   ├── routes/             # Rutas de la API
│   ├── scripts/            # Scripts de utilidad y seeders
│   ├── uploads/            # Archivos subidos
│   └── server.js           # Servidor principal
├── frontend/               # Aplicación React
│   ├── public/             # Archivos públicos
│   ├── src/                # Código fuente React
│   │   ├── components/     # Componentes reutilizables
│   │   ├── context/        # Context API (AuthContext)
│   │   ├── pages/          # Páginas de la aplicación
│   │   ├── services/       # Servicios (API calls)
│   │   └── utils/          # Utilidades
│   └── package.json        # Dependencias del frontend
├── database/               # Scripts SQL y migraciones
├── scripts/                # Scripts de desarrollo
├── docker-compose.yml      # Configuración de Docker Compose
├── .env.example            # Variables de entorno de ejemplo
└── README.md               # Este archivo
\`\`\`

## API Endpoints

### Autenticación
- `POST /api/auth/signin` - Iniciar sesión
- `POST /api/auth/signup` - Registrar usuario (solo Admin)
- `GET /api/auth/profile` - Obtener perfil del usuario

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
- `GET /api/vehiculos` - Listar vehículos con paginación
- `GET /api/vehiculos/search` - Buscar vehículos con filtros
- `GET /api/vehiculos/:id` - Obtener vehículo específico
- `POST /api/vehiculos` - Crear vehículo
- `PUT /api/vehiculos/:id` - Actualizar vehículo
- `DELETE /api/vehiculos/:id` - Eliminar vehículo (Admin)

### Usuarios
- `GET /api/usuarios` - Listar usuarios (Admin)
- `PUT /api/usuarios/:id` - Actualizar usuario (Admin)
- `DELETE /api/usuarios/:id` - Eliminar usuario (Admin)

### Base de Datos (phpMyAdmin)
- **Servidor:** db
- **Usuario:** concesionario_user
- **Contraseña:** concesionario_pass
- **Base de datos:** concesionario_db

### Root MySQL
- **Usuario:** root
- **Contraseña:** root_password

## Desarrollo

### Comandos útiles

#### Docker Compose
\`\`\`bash
# Ver logs en tiempo real
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs backend
docker-compose logs frontend

# Parar servicios
docker-compose down

# Parar y eliminar volúmenes
docker-compose down -v

# Reconstruir servicios
docker-compose up --build

# Ejecutar solo la base de datos
docker-compose up db phpmyadmin

# Reiniciar un servicio específico
docker-compose restart backend
\`\`\`

#### Base de Datos
\`\`\`bash
# Conectar a MySQL directamente
docker-compose exec db mysql -u root -p

# Ejecutar scripts de utilidad
docker-compose exec backend node scripts/test-db-connection.js
docker-compose exec backend node scripts/clear-database.js
docker-compose exec backend node scripts/quick-seed.js

# Backup de base de datos
docker-compose exec db mysqldump -u root -p concesionario_db > backup.sql

# Restaurar backup
docker-compose exec -T db mysql -u root -p concesionario_db < backup.sql
\`\`\`

#### Error: Contenedores no se conectan
\`\`\`bash
# Limpiar Docker completamente
docker-compose down -v
docker system prune -a
docker volume prune

# Reconstruir desde cero
docker-compose up --build
\`\`\`

### Actualizar el Proyecto
\`\`\`bash
# Obtener últimos cambios
git pull origin main

# Reconstruir contenedores
docker-compose down
docker-compose up --build

# Actualizar base de datos si es necesario
docker-compose exec backend node scripts/seed-database.js
\`\`\`

## Notas Importantes

- **Primera ejecución:** Puede tardar 3-5 minutos en descargar imágenes Docker
- **Datos persistentes:** Los datos de MySQL se guardan en un volumen Docker
- **Hot reload:** Tanto frontend como backend tienen recarga automática
- **Imágenes:** Las imágenes de vehículos se guardan en `backend/uploads/`
- **Puertos:** Asegúrate de que los puertos 3000, 5000, 3306 y 8080 estén libres

## Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Añadir nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## Autor

**Pablo Marín** - [pablox2004x@gmail.com](mailto:pablox2004x@gmail.com)

Proyecto desarrollado como Trabajo de Fin de Grado en el curso 2024/2025

---

**¡Disfruta gestionando tu concesionario! 🚗**
