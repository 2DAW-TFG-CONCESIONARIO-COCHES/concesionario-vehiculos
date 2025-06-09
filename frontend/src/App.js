import { Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
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

// Importar las nuevas páginas de empleados
import EmpleadosList from "./pages/empleados/EmpleadosList"
import EmpleadoForm from "./pages/empleados/EmpleadoForm"
import ChangePassword from "./pages/empleados/ChangePassword"

function App() {
  return (
    <div className="App">
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Rutas públicas */}
          <Route path="/vehiculos" element={<VehiculosList />} />
          <Route path="/vehiculos/:id" element={<VehiculoDetail />} />

          {/* Rutas privadas (requieren autenticación) */}
          <Route
            path="/vehiculos/nuevo"
            element={
              <PrivateRoute>
                <VehiculoForm />
              </PrivateRoute>
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

          {/* Rutas de administrador */}
          <Route
            path="/marcas"
            element={
              <AdminRoute>
                <MarcasList />
              </AdminRoute>
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
          <Route
            path="/modelos"
            element={
              <AdminRoute>
                <ModelosList />
              </AdminRoute>
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
          <Route
            path="/empleados"
            element={
              <AdminRoute>
                <EmpleadosList />
              </AdminRoute>
            }
          />
          <Route
            path="/empleados/nuevo"
            element={
              <AdminRoute>
                <EmpleadoForm />
              </AdminRoute>
            }
          />
          <Route
            path="/empleados/editar/:id"
            element={
              <AdminRoute>
                <EmpleadoForm />
              </AdminRoute>
            }
          />
          <Route
            path="/empleados/password/:id"
            element={
              <AdminRoute>
                <ChangePassword />
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
