"use client"

import { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"

const Home = () => {
  const { isAuthenticated, user, isAdmin } = useContext(AuthContext)
  const [animateHero, setAnimateHero] = useState(false)
  const [animateCards, setAnimateCards] = useState(false)
  const [animateStats, setAnimateStats] = useState(false)

  useEffect(() => {
    // Activar animaciones con un pequeño retraso
    setTimeout(() => setAnimateHero(true), 100)
    setTimeout(() => setAnimateCards(true), 500)
    setTimeout(() => setAnimateStats(true), 900)
  }, [])

  return (
    <div className="home-container">
      {/* Hero Section */}
      <div className={`home-hero ${animateHero ? "animate" : ""}`}>
        <div className="home-hero-content">
          <h1 className="home-hero-title">
            Concesionario <span className="text-gradient">Batoi</span>
          </h1>
          <p className="home-hero-subtitle">Descubre nuestra exclusiva selección de vehículos de alta gama</p>
          <div className="home-hero-buttons">
            <Link to="/vehiculos" className="btn btn-primary btn-lg">
              Ver Catálogo
            </Link>
            {!isAuthenticated() && (
              <Link to="/login" className="btn btn-outline btn-lg">
                Iniciar Sesión
              </Link>
            )}
          </div>
        </div>
        <div className="home-hero-image">
          <div className="car-animation">
            <div className="car-body">
              <div className="car-top"></div>
              <div className="car-window"></div>
              <div className="car-light"></div>
              <div className="car-wheel car-wheel-left"></div>
              <div className="car-wheel car-wheel-right"></div>
            </div>
            <div className="car-shadow"></div>
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      <div className={`home-features ${animateCards ? "animate" : ""}`}>
        <div className="home-feature-card">
          <div className="feature-icon">
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
          </div>
          <h3>Amplio Catálogo</h3>
          <p>Explora nuestra selección de vehículos de las mejores marcas del mercado.</p>
          <Link to="/vehiculos" className="feature-link">
            Ver Vehículos
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
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </Link>
        </div>

        <div className="home-feature-card">
          <div className="feature-icon">
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
              <path d="M20 6L9 17l-5-5"></path>
            </svg>
          </div>
          <h3>Marcas Premium</h3>
          <p>Trabajamos con las marcas más prestigiosas y reconocidas a nivel mundial.</p>
          <Link to="/marcas" className="feature-link">
            Ver Marcas
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
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </Link>
        </div>

        <div className="home-feature-card">
          <div className="feature-icon">
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
              <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
            </svg>
          </div>
          <h3>Calidad Garantizada</h3>
          <p>Todos nuestros vehículos pasan por rigurosos controles de calidad.</p>
          <Link to="/vehiculos" className="feature-link">
            Más Información
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
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </Link>
        </div>
      </div>

      {/* Stats Section */}
      <div className={`home-stats ${animateStats ? "animate" : ""}`}>
        <div className="home-stat">
          <div className="stat-number">500+</div>
          <div className="stat-label">Vehículos</div>
        </div>
        <div className="home-stat">
          <div className="stat-number">20+</div>
          <div className="stat-label">Marcas</div>
        </div>
        <div className="home-stat">
          <div className="stat-number">15+</div>
          <div className="stat-label">Años de Experiencia</div>
        </div>
        <div className="home-stat">
          <div className="stat-number">1000+</div>
          <div className="stat-label">Clientes Satisfechos</div>
        </div>
      </div>

      {/* Admin/User Welcome Section */}
      {isAuthenticated() && (
        <div className="home-welcome">
          <div className="welcome-card">
            <h2>¡Bienvenido, {user?.nombre}!</h2>
            <p>¿Qué te gustaría hacer hoy?</p>
            <div className="welcome-actions">
              <Link to="/vehiculos" className="welcome-action">
                <div className="welcome-action-icon">
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
                </div>
                <span>Ver Vehículos</span>
              </Link>

              <Link to="/marcas" className="welcome-action">
                <div className="welcome-action-icon">
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
                    <path d="M20 6L9 17l-5-5"></path>
                  </svg>
                </div>
                <span>Ver Marcas</span>
              </Link>

              {isAdmin() && (
                <>
                  <Link to="/modelos" className="welcome-action">
                    <div className="welcome-action-icon">
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
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                      </svg>
                    </div>
                    <span>Gestionar Modelos</span>
                  </Link>

                  <Link to="/usuarios" className="welcome-action">
                    <div className="welcome-action-icon">
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
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                      </svg>
                    </div>
                    <span>Gestionar Usuarios</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home
