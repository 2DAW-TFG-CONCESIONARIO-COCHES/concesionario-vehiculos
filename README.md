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
- ✅ Carga de imágenes para vehículos y logos de marcas
- ✅ Dashboard administrativo
- ✅ Gestión de usuarios (solo Admin)

## Instalación y Configuración

### Prerrequisitos
- **Docker** v20.10+ y **Docker Compose** v2.0+ instalados
- **Git** para clonar el repositorio
- **Node.js** v18+ (opcional, para desarrollo sin Docker)

### Verificar instalaciones:
```bash
docker --version
docker-compose --version
git --version
```

### Pasos de instalación completos

#### 1. **Clonar el repositorio**
```bash
# Clonar el repositorio
git clone https://github.com/2DAW-TFG-CONCESIONARIO-COCHES/concesionario-vehiculos

# Navegar al directorio del proyecto
cd concesionario-vehiculos

# Verificar que tienes todos los archivos
ls -la
```

#### 2. **Configurar variables de entorno**
```bash
# Copiar archivos de configuración
cp .env.example .env
cp frontend/.env.example frontend/.env

# Generar JWT Secret seguro (recomendado)
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
# Copiar el resultado y reemplazar JWT_SECRET en .env
```

**Nota:** Los valores por defecto están configurados para funcionar inmediatamente con Docker.

#### 3. **Ejecutar con Docker**
```bash
# Limpiar contenedores anteriores (si existen)
docker-compose down -v

# Construir y ejecutar todos los servicios
docker-compose up --build

# O ejecutar en segundo plano
docker-compose up --build -d
```

#### 4. **Inicializar la base de datos**

**Opción A: Scripts automáticos (Recomendado)**
```bash
# Crear estructura completa de base de datos (tablas y relaciones)
docker-compose exec backend npm run create-structure

# Crear usuario administrador por defecto
docker-compose exec backend npm run create-admin

# Sembrar datos de ejemplo (marcas, modelos, vehículos)
docker-compose exec backend npm run seed-data

# O hacer todo de una vez
docker-compose exec backend npm run setup-db
```

**Opción B: Importación manual (En caso de errores)**
```bash
# Si los scripts automáticos fallan, puedes importar la base de datos directamente
docker-compose exec -T db mysql -u root -proot_password < concesionario_db.sql

# O usando phpMyAdmin:
# 1. Accede a http://localhost:8080
# 2. Usuario: root, Contraseña: root_password
# 3. Importa el archivo concesionario_db.sql
```

#### 5. **Acceder a la aplicación**
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **phpMyAdmin:** http://localhost:8080

## Scripts de Base de Datos Disponibles

### Scripts principales
```bash
# Crear solo la estructura (tablas vacías)
npm run create-structure

# Crear estructura forzando recreación
npm run create-structure-force

# Crear usuario administrador
npm run create-admin

# Sembrar datos de ejemplo
npm run seed-data

# Setup completo (estructura + admin + datos)
npm run setup-db

# Limpiar toda la base de datos
npm run clear-db

# Probar conexión a base de datos
npm run test-connection
```

### Credenciales por defecto
**Usuario Administrador:**
- **Email:** admin@concesionario.com
- **Contraseña:** admin123

**Base de Datos (phpMyAdmin):**
- **Servidor:** db
- **Usuario:** concesionario_user
- **Contraseña:** concesionario_pass
- **Base de datos:** concesionario_db

**Root MySQL:**
- **Usuario:** root
- **Contraseña:** root_password

## Estructura del Proyecto

```
concesionario-vehiculos/
├── backend/                 # API REST con Node.js y Express
│   ├── config/             # Configuración de base de datos
│   ├── controllers/        # Controladores de la API
│   ├── middleware/         # Middlewares (auth, cors, etc.)
│   ├── models/             # Modelos de Sequelize
│   ├── routes/             # Rutas de la API
│   ├── scripts/            # Scripts de utilidad y seeders
│   │   ├── create-database-structure.js  # Crear estructura BD
│   │   ├── create-admin.js               # Crear usuario admin
│   │   ├── seed-sample-data.js           # Datos de ejemplo
│   │   └── test-connection.js            # Probar conexión
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
│   └── concesionario_db.sql # Base de datos completa (backup)
├── scripts/                # Scripts de desarrollo
├── docker-compose.yml      # Configuración de Docker Compose
├── .env.example            # Variables de entorno de ejemplo
└── README.md               # Este archivo
```

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

## Desarrollo

### Comandos útiles

#### Docker Compose
```bash
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
```

#### Base de Datos
```bash
# Conectar a MySQL directamente
docker-compose exec db mysql -u root -proot_password

# Ejecutar scripts de utilidad
docker-compose exec backend node scripts/test-connection.js
docker-compose exec backend node scripts/create-database-structure.js
docker-compose exec backend node scripts/seed-sample-data.js

# Backup de base de datos
docker-compose exec db mysqldump -u root -proot_password concesionario_db > database/concesionario_db.sql

# Restaurar backup
docker-compose exec -T db mysql -u root -proot_password concesionario_db < database/concesionario_db.sql
```

#### Desarrollo sin Docker
```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (en otra terminal)
cd frontend
npm install
npm start
```

### Solución de Problemas

#### Problemas comunes
```bash
# Limpiar Docker completamente
docker-compose down -v
docker system prune -a
docker volume prune

# Reconstruir desde cero
docker-compose up --build
```

#### Actualizar proyecto
```bash
# Obtener últimos cambios
git pull origin main

# Reconstruir contenedores
docker-compose down
docker-compose up --build

# Actualizar base de datos si es necesario
docker-compose exec backend npm run setup-db
```

#### Error en inicialización de BD
Si los scripts automáticos fallan:
1. Accede a phpMyAdmin (http://localhost:8080)
2. Importa manualmente `database/concesionario_db.sql`
3. O ejecuta: `docker-compose exec -T db mysql -u root -proot_password < database/concesionario_db.sql`

## Notas Importantes

- **Primera ejecución:** Puede tardar 3-5 minutos en descargar imágenes Docker
- **Datos persistentes:** Los datos de MySQL se guardan en un volumen Docker
- **Hot reload:** Tanto frontend como backend tienen recarga automática
- **Imágenes:** Las imágenes de vehículos y logos se guardan en `backend/uploads/`
- **Puertos:** Asegúrate de que los puertos 3000, 5000, 3306 y 8080 estén libres
- **Campo logo:** Configurado como LONGTEXT para soportar imágenes base64 grandes
- **Backup incluido:** El archivo `database/concesionario_db.sql` contiene una copia completa de la BD

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
