import { Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import ConnectionStatus from "./components/ConnectionStatus"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import MarcasList from "./pages/marcas/MarcasList"
import MarcaForm from "./pages/marcas/MarcaForm"
import ModelosList from "./pages/modelos/ModelosList"
import ModeloForm from "./pages/modelos/ModeloForm"
import VehiculosList from "./pages/vehiculos/VehiculosList"
import VehiculoForm from "./pages/vehiculos/VehiculoForm"
import VehiculoDetail from "./pages/vehiculos/VehiculoDetail"
import PrivateRoute from "./components/PrivateRoute"
import AdminRoute from "./components/AdminRoute"
import NotFound from "./pages/NotFound"
import UsuariosAdmin from "./pages/usuarios/UsuariosAdmin"

function App() {
  return (
    <div className="App">
      <ConnectionStatus />
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Rutas públicas */}
          <Route path="/vehiculos" element={<VehiculosList />} />
          <Route path="/vehiculos/:id" element={<VehiculoDetail />} />

          {/* Rutas de vehículos - EMPLEADOS PUEDEN EDITAR, SOLO ADMINS PUEDEN CREAR */}
          <Route
            path="/vehiculos/nuevo"
            element={
              <AdminRoute>
                <VehiculoForm />
              </AdminRoute>
            }
          />
          <Route
            path="/vehiculos/editar/:id"
            element={
              <PrivateRoute>
                <VehiculoForm />
              </PrivateRoute>
            }
          />

          {/* Rutas de marcas - EMPLEADOS PUEDEN VER, SOLO ADMINS PUEDEN GESTIONAR */}
          <Route
            path="/marcas"
            element={
              <PrivateRoute>
                <MarcasList />
              </PrivateRoute>
            }
          />
          <Route
            path="/marcas/nueva"
            element={
              <AdminRoute>
                <MarcaForm />
              </AdminRoute>
            }
          />
          <Route
            path="/marcas/editar/:id"
            element={
              <AdminRoute>
                <MarcaForm />
              </AdminRoute>
            }
          />

          {/* Rutas de modelos - EMPLEADOS PUEDEN VER, SOLO ADMINS PUEDEN GESTIONAR */}
          <Route
            path="/modelos"
            element={
              <PrivateRoute>
                <ModelosList />
              </PrivateRoute>
            }
          />
          <Route
            path="/modelos/nuevo"
            element={
              <AdminRoute>
                <ModeloForm />
              </AdminRoute>
            }
          />
          <Route
            path="/modelos/editar/:id"
            element={
              <AdminRoute>
                <ModeloForm />
              </AdminRoute>
            }
          />

          {/* Rutas de administrador */}
          <Route
            path="/usuarios"
            element={
              <AdminRoute>
                <UsuariosAdmin />
              </AdminRoute>
            }
          />

          {/* Ruta 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
