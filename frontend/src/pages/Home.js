import { Link } from "react-router-dom"

const Home = () => {
  return (
    <div className="home">
      <h1>Bienvenido al Sistema de Gestión de Vehículos</h1>
      <p>
        Esta aplicación te permite gestionar el inventario de vehículos de tu concesionario, incluyendo marcas, modelos
        y características detalladas de cada vehículo.
      </p>
      <div className="home-links">
        <Link to="/vehiculos" className="btn btn-primary">
          Ver vehículos
        </Link>
      </div>
    </div>
  )
}

export default Home
