import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaChevronLeft, FaChevronRight, FaUser, FaGamepad, FaTrophy, FaStar, FaUsers, FaCalendar, FaClock, FaMedal, FaChartLine } from 'react-icons/fa';
import { ENTRADAS_ROUTES, CONFIGURACION_ROUTES, GAMES_ROUTES, TORNEO_ROUTES, RULETA_ROUTES, PARTIDAS_ROUTES, COMODINES_ROUTES, PROFILE_ROUTES, LOGROS_ROUTES } from '../routes/api.routes';
import './inicio.css';
import { toast } from 'react-hot-toast';
import { Footer } from '../Components/Footer';

export const Inicio = () => {
  const [entradas, setEntradas] = useState([]);
  const [configuracion, setConfiguracion] = useState({
    mostrarTablaGeneral: true,
    ordenSecciones: ['novedades', 'ruleta', 'tablaGeneral', 'jugadores', 'juegos', 'comodines']
  });
  const [juegos, setJuegos] = useState([]);
  const [jugadores, setJugadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentGameIndex, setCurrentGameIndex] = useState(0);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const navigate = useNavigate();
  const [isGameCarouselPaused, setIsGameCarouselPaused] = useState(false);
  const [isPlayerCarouselPaused, setIsPlayerCarouselPaused] = useState(false);
  const [jugadoresInicio, setJugadoresInicio] = useState([]);
  const [isLoadingJugadoresInicio, setIsLoadingJugadoresInicio] = useState(false);
  const [showJugadorModal, setShowJugadorModal] = useState(false);
  const [jugadorSeleccionado, setJugadorSeleccionado] = useState(null);
  
  // Estados para tabla general
  const [tablaGeneral, setTablaGeneral] = useState([]);
  const [isLoadingTablaGeneral, setIsLoadingTablaGeneral] = useState(false);
  
  // Estados para comodines
  const [comodines, setComodines] = useState([]);
  const [isLoadingComodines, setIsLoadingComodines] = useState(false);
  
  // Estados para futuras partidas
  const [futurasPartidas, setFuturasPartidas] = useState([]);
  const [isLoadingFuturasPartidas, setIsLoadingFuturasPartidas] = useState(false);
  
  // Estados para estadísticas reales
  const [estadisticasReales, setEstadisticasReales] = useState({
    totalPartidas: 0,
    partidasJugadas: 0,
    partidasPendientes: 0,
    jugadoresActivos: 0,
    progresoTorneo: 0,
    progresoTemporal: 0,
    edicionActual: null
  });
  const [isLoadingEstadisticas, setIsLoadingEstadisticas] = useState(false);
  
  // Estados para logros destacados
  const [logrosDestacados, setLogrosDestacados] = useState([]);
  const [isLoadingLogros, setIsLoadingLogros] = useState(false);
  
  // Estados para la ruleta
  const [ruletaActiva, setRuletaActiva] = useState(false);
  const [showRuleta, setShowRuleta] = useState(false);
  const [isGirandoRuleta, setIsGirandoRuleta] = useState(false);
  const [resultadoRuleta, setResultadoRuleta] = useState(null);
  const [showResultadoRuleta, setShowResultadoRuleta] = useState(false);
  const [estadisticasRuleta, setEstadisticasRuleta] = useState({
    giros_hoy: 0,
    max_giros_por_dia: 1,
    giros_restantes: 1,
    total_giros: 0
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  // Animación automática para el carrusel de juegos
  useEffect(() => {
    if (juegos.length > 1 && !isGameCarouselPaused) {
      const interval = setInterval(() => {
        setCurrentGameIndex((prev) => (prev + 1) % juegos.length);
      }, 3000); // Cambia cada 3 segundos

      return () => clearInterval(interval);
    }
  }, [juegos.length, isGameCarouselPaused]);

  // Animación automática para el carrusel de jugadores
  useEffect(() => {
    if (jugadores.length > 1 && !isPlayerCarouselPaused) {
      const interval = setInterval(() => {
        setCurrentPlayerIndex((prev) => (prev + 1) % jugadores.length);
      }, 3000); // Cambia cada 3 segundos

      return () => clearInterval(interval);
    }
  }, [jugadores.length, isPlayerCarouselPaused]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      
      // Cargar configuración
      try {
        const configResponse = await axios.get(CONFIGURACION_ROUTES.GET_INICIO);
        if (configResponse.data.success) {
          const configBackend = configResponse.data.data;
          
          // Asegurar que la ruleta esté en el orden de secciones
          let ordenSecciones = configBackend.ordenSecciones || [];
          if (!ordenSecciones.includes('ruleta')) {
            ordenSecciones = ['novedades', 'ruleta', ...ordenSecciones.filter(s => s !== 'novedades')];
          }
          
          setConfiguracion({
            ...configBackend,
            ordenSecciones: ordenSecciones
          });
        }
      } catch (error) {
        console.error('Error al cargar configuración:', error);
      }

      // Cargar entradas
      try {
        const entradasResponse = await axios.get(ENTRADAS_ROUTES.GET_ALL);
        if (entradasResponse.data.success) {
          setEntradas(entradasResponse.data.data.filter(e => e.visible));
        }
      } catch (error) {
        console.error('Error al cargar entradas:', error);
      }

      // Cargar tabla general
      try {
        setIsLoadingTablaGeneral(true);
        const tablaResponse = await axios.get(PARTIDAS_ROUTES.GET_TABLA_GENERAL);
        if (tablaResponse.data.success) {
          setTablaGeneral(tablaResponse.data.data || []);
        }
      } catch (error) {
        console.error('Error al cargar tabla general:', error);
        // Si hay error, establecer tabla vacía
        setTablaGeneral([]);
      } finally {
        setIsLoadingTablaGeneral(false);
      }

      // Cargar comodines
      try {
        setIsLoadingComodines(true);
        const comodinesResponse = await axios.get(COMODINES_ROUTES.GET_ALL_PUBLIC);
        if (comodinesResponse.data.success) {
          setComodines(comodinesResponse.data.data);
        }
      } catch (error) {
        console.error('Error al cargar comodines:', error);
      } finally {
        setIsLoadingComodines(false);
      }

      // Cargar juegos del inicio
      try {
        const juegosResponse = await axios.get(GAMES_ROUTES.GET_INICIO);
        if (juegosResponse.data.success) {
          setJuegos(juegosResponse.data.data);
        }
      } catch (error) {
        console.error('Error al cargar juegos:', error);
      }

      // Cargar jugadores del inicio
      try {
        const jugadoresResponse = await axios.get(TORNEO_ROUTES.GET_JUGADORES_INICIO);
        if (jugadoresResponse.data.success) {
          setJugadores(jugadoresResponse.data.data);
          setJugadoresInicio(jugadoresResponse.data.data);
        }
      } catch (error) {
        console.error('Error al cargar jugadores:', error);
      }

      // Verificar estado de ruleta
      try {
        const ruletaResponse = await axios.get(RULETA_ROUTES.GET_ESTADO);
        if (ruletaResponse.data.success) {
          setRuletaActiva(ruletaResponse.data.data.ruleta_activa);
        }
      } catch (error) {
        console.error('Error al verificar ruleta:', error);
      }

      // Cargar futuras partidas
      try {
        setIsLoadingFuturasPartidas(true);
        const partidasResponse = await axios.get(PARTIDAS_ROUTES.GET_ALL);
        if (partidasResponse.data.success) {
          // Filtrar solo partidas futuras (fecha mayor a hoy)
          const hoy = new Date();
          const partidasFuturas = partidasResponse.data.data.filter(partida => {
            const fechaPartida = new Date(partida.fecha);
            return fechaPartida > hoy;
          }).sort((a, b) => new Date(a.fecha) - new Date(b.fecha)).slice(0, 5); // Solo las próximas 5
          setFuturasPartidas(partidasFuturas);
        }
      } catch (error) {
        console.error('Error al cargar futuras partidas:', error);
        setFuturasPartidas([]);
      } finally {
        setIsLoadingFuturasPartidas(false);
      }

      // Cargar estadísticas reales
      try {
        setIsLoadingEstadisticas(true);
        const statsResponse = await axios.get(PARTIDAS_ROUTES.GET_ESTADISTICAS_REALES);
        if (statsResponse.data.success) {
          setEstadisticasReales(statsResponse.data.data);
        }
      } catch (error) {
        console.error('Error al cargar estadísticas reales:', error);
      } finally {
        setIsLoadingEstadisticas(false);
      }

      // Cargar logros destacados
      try {
        setIsLoadingLogros(true);
        const logrosResponse = await axios.get(LOGROS_ROUTES.GET_DESTACADOS);
        if (logrosResponse.data.success) {
          setLogrosDestacados(logrosResponse.data.data);
        }
      } catch (error) {
        console.error('Error al cargar logros destacados:', error);
        setLogrosDestacados([]);
      } finally {
        setIsLoadingLogros(false);
      }

      // Cargar estadísticas de ruleta si el usuario está autenticado
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const statsResponse = await axios.get(RULETA_ROUTES.GET_ESTADISTICAS, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (statsResponse.data.success) {
            setEstadisticasRuleta(statsResponse.data.data);
          }
        } catch (error) {
          console.error('Error al cargar estadísticas de ruleta:', error);
        }
      }

    } catch (error) {
      console.error('Error general al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextGame = () => {
    setIsGameCarouselPaused(true);
    setCurrentGameIndex((prev) => (prev + 1) % juegos.length);
    // Reanudar la animación después de 5 segundos
    setTimeout(() => setIsGameCarouselPaused(false), 5000);
  };

  const prevGame = () => {
    setIsGameCarouselPaused(true);
    setCurrentGameIndex((prev) => (prev - 1 + juegos.length) % juegos.length);
    // Reanudar la animación después de 5 segundos
    setTimeout(() => setIsGameCarouselPaused(false), 5000);
  };

  const nextPlayer = () => {
    setIsPlayerCarouselPaused(true);
    setCurrentPlayerIndex((prev) => (prev + 1) % jugadores.length);
    // Reanudar la animación después de 5 segundos
    setTimeout(() => setIsPlayerCarouselPaused(false), 5000);
  };

  const prevPlayer = () => {
    setIsPlayerCarouselPaused(true);
    setCurrentPlayerIndex((prev) => (prev - 1 + jugadores.length) % jugadores.length);
    // Reanudar la animación después de 5 segundos
    setTimeout(() => setIsPlayerCarouselPaused(false), 5000);
  };

  const handleJuegoClick = (juego) => {
    // Navegar al histórico con filtro de juego específico
    navigate('/historico', { 
      state: { 
        filterType: 'game', 
        searchTerm: juego.nombre,
        juegoId: juego.id 
      } 
    });
  };

  const handleJugadorClick = async (jugador) => {
    setJugadorSeleccionado(jugador);
    setShowJugadorModal(true);
  };

  // Funciones para la ruleta
  const verificarRuletaActiva = async () => {
    try {
      const response = await axios.get(RULETA_ROUTES.GET_ESTADO);
      if (response.data.success) {
        setRuletaActiva(response.data.data.ruleta_activa);
      }
    } catch (error) {
      console.error('Error al verificar estado de ruleta:', error);
    }
  };

  const girarRuleta = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      toast.error('Debes iniciar sesión para girar la ruleta');
      navigate('/login');
      return;
    }

    // Verificar el rol del usuario de forma más simple
    try {
      const userResponse = await axios.get(PROFILE_ROUTES.GET_PROFILE, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (userResponse.data.success) {
        const userRole = userResponse.data.data.rol;
        
        // Solo admin (rol 0 y 1) y jugadores (rol 2) pueden girar la ruleta
        if (userRole !== 0 && userRole !== 1 && userRole !== 2) {
          toast.error('Solo administradores y jugadores pueden girar la ruleta');
          return; // No redirigir, solo mostrar error
        }
      } else {
        toast.error('Error al verificar permisos');
        return; // No redirigir, solo mostrar error
      }
    } catch (error) {
      console.error('Error al verificar rol del usuario:', error);
      toast.error('Error al verificar permisos. Intenta de nuevo.');
      return; // No redirigir, solo mostrar error
    }

    // Verificar si ya no quedan giros
    if (estadisticasRuleta.giros_restantes <= 0) {
      toast.error('Ya has usado todos tus giros de hoy. Vuelve mañana.');
      return;
    }

    setIsGirandoRuleta(true);
    try {
      const response = await axios.post(RULETA_ROUTES.GIRAR, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setResultadoRuleta(response.data.data);
        setShowResultadoRuleta(true);
        toast.success('¡Giro exitoso!');
        
        // Actualizar estadísticas
        if (response.data.data.giros_restantes !== undefined) {
          setEstadisticasRuleta(prev => ({
            ...prev,
            giros_hoy: prev.giros_hoy + 1,
            giros_restantes: response.data.data.giros_restantes
          }));
        }
      }
    } catch (error) {
      console.error('Error al girar ruleta:', error);
      toast.error(error.response?.data?.message || 'Error al girar la ruleta');
    } finally {
      setIsGirandoRuleta(false);
    }
  };

  const renderSeccion = (seccion) => {
    switch (seccion) {
      case 'novedades':
        return (
          <section key="novedades" className="seccion-inicio">
            <h2 className="titulo-seccion">
              <FaStar className="icono-seccion" />
              Novedades y Entradas
            </h2>
            <div className="entradas-container">
              {entradas.map(entrada => (
                <div key={entrada.id} className="entrada-card">
                  <h3>{entrada.titulo}</h3>
                  <p>{entrada.contenido}</p>
                </div>
              ))}
            </div>
          </section>
        );

      case 'tablaGeneral':
        return configuracion.mostrarTablaGeneral ? (
          <section key="tablaGeneral" className="seccion-inicio">
            <h2 className="titulo-seccion">
              <FaTrophy className="icono-seccion" />
              Tabla General
            </h2>
            {isLoadingTablaGeneral ? (
              <div className="loading-spinner">
                <FaGamepad className="spinner-icon" />
                <span>Cargando tabla general...</span>
              </div>
            ) : tablaGeneral.length > 0 ? (
              <div className="tabla-general-container">
                <table className="tabla-general">
                  <thead>
                    <tr>
                      <th>Posición</th>
                      <th>Jugador</th>
                      <th>Puntos</th>
                      <th>Partidas</th>
                      <th>Victorias</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tablaGeneral.map((jugador, index) => (
                      <tr key={jugador.jugador_nickname} className={index < 3 ? 'top-3' : ''}>
                        <td className="posicion">
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                        </td>
                        <td className="jugador-info">
                          <img 
                            src={jugador.foto || '/default-profile.png'} 
                            alt={jugador.jugador_nickname} 
                            className="jugador-avatar"
                          />
                          <span>{jugador.jugador_nickname}</span>
                        </td>
                        <td className="puntos">{jugador.puntos_totales}</td>
                        <td>{jugador.partidas_jugadas}</td>
                        <td>{jugador.partidas_ganadas}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="no-data">
                <p>No hay datos en la tabla general</p>
              </div>
            )}
          </section>
        ) : null;

      case 'jugadores':
        return (
          <div className="seccion-jugadores">
            <h2>Jugadores del Torneo</h2>
            <div className="jugadores-carousel">
              {jugadoresInicio.map((jugador, index) => (
                <div 
                  key={jugador.nickname} 
                  className={`jugador-card ${currentPlayerIndex === index ? 'active' : ''}`}
                  onClick={() => handleJugadorClick(jugador)}
                >
                  <img src={jugador.foto || '/default-profile.png'} alt={jugador.nickname} />
                  <h3>{jugador.nickname}</h3>
                </div>
              ))}
            </div>
            <div className="carousel-indicators">
              {jugadoresInicio.map((_, index) => (
                <button
                  key={index}
                  className={`indicator ${currentPlayerIndex === index ? 'active' : ''}`}
                  onClick={() => setCurrentPlayerIndex(index)}
                />
              ))}
            </div>
          </div>
        );

      case 'juegos':
        return (
          <section key="juegos" className="seccion-inicio">
            <h2 className="titulo-seccion">
              <FaGamepad className="icono-seccion" />
              Juegos Destacados
            </h2>
            {juegos.length > 0 ? (
              <div className="juegos-carousel">
                <button className="carousel-btn prev" onClick={prevGame}>
                  <FaChevronLeft />
                </button>
                
                <div className="juego-card" onClick={() => handleJuegoClick(juegos[currentGameIndex])}>
                  <div className="juego-imagen">
                    {juegos[currentGameIndex].foto ? (
                      <img src={juegos[currentGameIndex].foto} alt={juegos[currentGameIndex].nombre} />
                    ) : (
                      <FaGamepad />
                    )}
                  </div>
                  <h3>{juegos[currentGameIndex].nombre}</h3>
                  <p>Categoría: {juegos[currentGameIndex].categoria_nombre}</p>
                  <div className="juego-hover-info">
                    <span>Haz clic para ver partidas</span>
                  </div>
                </div>

                <button className="carousel-btn next" onClick={nextGame}>
                  <FaChevronRight />
                </button>
                
                {/* Indicadores de progreso */}
                {juegos.length > 1 && (
                  <div className="carousel-indicators">
                    {juegos.map((_, index) => (
                      <div
                        key={index}
                        className={`indicator ${index === currentGameIndex ? 'active' : ''}`}
                        onClick={() => {
                          setIsGameCarouselPaused(true);
                          setCurrentGameIndex(index);
                          setTimeout(() => setIsGameCarouselPaused(false), 5000);
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <p className="no-data">No hay juegos destacados</p>
            )}
          </section>
        );

      case 'comodines':
        return (
          <section key="comodines" className="seccion-inicio">
            <h2 className="titulo-seccion">
              <FaStar className="icono-seccion" />
              Comodines Disponibles
            </h2>
            {isLoadingComodines ? (
              <div className="loading-spinner">
                <FaGamepad className="spinner-icon" />
                <span>Cargando comodines...</span>
              </div>
            ) : comodines.length > 0 ? (
              <div className="comodines-grid">
                {comodines.map(comodin => (
                  <div key={comodin.idcomodines} className="comodin-card">
                    <div className="comodin-imagen">
                      {comodin.foto ? (
                        <img src={comodin.foto} alt={comodin.nombre} />
                      ) : (
                        <FaStar className="comodin-icon" />
                      )}
                    </div>
                    <h4>{comodin.nombre}</h4>
                    <p>{comodin.descripcion}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-data">
                <p>No hay comodines disponibles</p>
              </div>
            )}
          </section>
        );

      case 'ruleta':
        return ruletaActiva ? (
          <section key="ruleta" className="seccion-inicio">
            <h2 className="titulo-seccion">
              🎰 Ruleta de Premios
            </h2>
            <div className="ruleta-container">
              <div className="ruleta-info">
                <p className="ruleta-descripcion">
                  ¡Gira la ruleta y gana comodines, puntos para la tabla general y premios especiales!
                </p>
                <div className="ruleta-premios">
                  <h4>Premios disponibles:</h4>
                  <ul>
                    <li>🎁 Comodines especiales</li>
                    <li>⭐ Puntos para la tabla general (+/- puntos)</li>
                    <li>🏆 Premios personalizados</li>
                  </ul>
                </div>
                
                {/* Estadísticas de giros */}
                <div className="ruleta-estadisticas">
                  <h4>Tu progreso de hoy:</h4>
                  <div className="stats-grid">
                    <div className="stat-item">
                      <span className="stat-label">Giros usados:</span>
                      <span className="stat-value">{estadisticasRuleta.giros_hoy}/{estadisticasRuleta.max_giros_por_dia}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Giros restantes:</span>
                      <span className={`stat-value ${estadisticasRuleta.giros_restantes > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {estadisticasRuleta.giros_restantes}
                      </span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Total de giros:</span>
                      <span className="stat-value">{estadisticasRuleta.total_giros}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="ruleta-action">
                <button 
                  className={`ruleta-button ${estadisticasRuleta.giros_restantes <= 0 ? 'disabled' : ''}`}
                  onClick={girarRuleta}
                  disabled={isGirandoRuleta || estadisticasRuleta.giros_restantes <= 0}
                >
                  {isGirandoRuleta ? (
                    <>
                      <span className="spinner">🎰</span>
                      <span>Girando...</span>
                    </>
                  ) : estadisticasRuleta.giros_restantes <= 0 ? (
                    <>
                      <span>⏰</span>
                      <span>Sin giros disponibles</span>
                    </>
                  ) : (
                    <>
                      <span>🎰</span>
                      <span>¡Girar Ruleta!</span>
                    </>
                  )}
                </button>
                <p className="ruleta-nota">
                  * Solo para administradores y jugadores registrados
                </p>
                {estadisticasRuleta.giros_restantes <= 0 && (
                  <p className="ruleta-nota text-red-600">
                    * Ya has usado todos tus giros de hoy. Vuelve mañana.
                  </p>
                )}
              </div>
            </div>
          </section>
        ) : null;

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <FaGamepad className="spinner-icon" />
          <span>Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="inicio-page">
        <div className="inicio-container">
          <h1 className="titulo-principal">Bienvenido a la Real TakerCup</h1>
          
          <div className="secciones-container">
            {/* Columna izquierda - Widgets laterales */}
            <div className="columna-izquierda">
              {/* Widget de jugadores destacados */}
              <div className="widget-lateral">
                <h3>
                  <FaUsers />
                  Jugadores Destacados
                </h3>
                <div className="jugadores-destacados">
                  {jugadoresInicio.slice(0, 5).map((jugador, index) => (
                    <div 
                      key={jugador.nickname} 
                      className="jugador-destacado"
                      onClick={() => handleJugadorClick(jugador)}
                    >
                      <img src={jugador.foto || '/default-profile.png'} alt={jugador.nickname} />
                      <div className="info">
                        <div className="nombre">{jugador.nickname}</div>
                        <div className="puntos">Jugador activo</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Widget de estadísticas rápidas */}
              <div className="widget-lateral">
                <h3>
                  <FaTrophy />
                  Estadísticas
                </h3>
                <div className="estadisticas-rapidas">
                  <div className="stat-card">
                    <span className="numero">{juegos.length}</span>
                    <span className="label">Juegos</span>
                  </div>
                  <div className="stat-card">
                    <span className="numero">{jugadoresInicio.length}</span>
                    <span className="label">Jugadores</span>
                  </div>
                  <div className="stat-card">
                    <span className="numero">{comodines.length}</span>
                    <span className="label">Comodines</span>
                  </div>
                  <div className="stat-card">
                    <span className="numero">{tablaGeneral.length}</span>
                    <span className="label">En Tabla</span>
                  </div>
                </div>
              </div>

              {/* Widget de comodines rápidos */}
              <div className="widget-lateral">
                <h3>
                  <FaStar />
                  Comodines Disponibles
                </h3>
                <div className="comodines-rapidos">
                  {comodines.slice(0, 3).map(comodin => (
                    <div key={comodin.idcomodines} className="comodin-rapido">
                      <img src={comodin.foto || '/default-comodin.png'} alt={comodin.nombre} />
                      <div className="info">
                        <div className="nombre">{comodin.nombre}</div>
                        <div className="descripcion">{comodin.descripcion}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Columna central - Contenido principal */}
            <div className="columna-central">
              {/* Sección de novedades */}
              {configuracion.ordenSecciones.includes('novedades') && entradas.length > 0 && (
                <div className="seccion-inicio">
                  <h2 className="titulo-seccion">
                    <FaStar className="icono-seccion" />
                    Novedades y Entradas
                  </h2>
                  <div className="entradas-container">
                    {entradas.map(entrada => (
                      <div key={entrada.id} className="entrada-card">
                        <h3>{entrada.titulo}</h3>
                        <p>{entrada.contenido}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sección de ruleta */}
              {configuracion.ordenSecciones.includes('ruleta') && ruletaActiva && (
                <div className="seccion-inicio">
                  <div className="ruleta-container">
                    <div className="ruleta-info">
                      <h2 className="titulo-seccion" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.2)' }}>
                        🎰 Ruleta de Premios
                      </h2>
                      <p className="ruleta-descripcion">
                        ¡Gira la ruleta y gana comodines, puntos para la tabla general y premios especiales!
                      </p>
                      <div className="ruleta-premios">
                        <h4>Premios disponibles:</h4>
                        <ul>
                          <li>🎁 Comodines especiales</li>
                          <li>⭐ Puntos para la tabla general (+/- puntos)</li>
                          <li>🏆 Premios personalizados</li>
                        </ul>
                      </div>
                      
                      {/* Estadísticas de giros */}
                      <div className="ruleta-estadisticas">
                        <h4>Tu progreso de hoy:</h4>
                        <div className="stats-grid">
                          <div className="stat-item">
                            <span className="stat-label">Giros usados:</span>
                            <span className="stat-value">{estadisticasRuleta.giros_hoy}/{estadisticasRuleta.max_giros_por_dia}</span>
                          </div>
                          <div className="stat-item">
                            <span className="stat-label">Giros restantes:</span>
                            <span className={`stat-value ${estadisticasRuleta.giros_restantes > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {estadisticasRuleta.giros_restantes}
                            </span>
                          </div>
                          <div className="stat-item">
                            <span className="stat-label">Total de giros:</span>
                            <span className="stat-value">{estadisticasRuleta.total_giros}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="ruleta-action">
                      <button 
                        className={`ruleta-button ${estadisticasRuleta.giros_restantes <= 0 ? 'disabled' : ''}`}
                        onClick={girarRuleta}
                        disabled={isGirandoRuleta || estadisticasRuleta.giros_restantes <= 0}
                      >
                        {isGirandoRuleta ? (
                          <>
                            <span className="spinner">🎰</span>
                            <span>Girando...</span>
                          </>
                        ) : estadisticasRuleta.giros_restantes <= 0 ? (
                          <>
                            <span>⏰</span>
                            <span>Sin giros disponibles</span>
                          </>
                        ) : (
                          <>
                            <span>🎰</span>
                            <span>¡Girar Ruleta!</span>
                          </>
                        )}
                      </button>
                      <p className="ruleta-nota">
                        * Solo para administradores y jugadores registrados
                      </p>
                      {estadisticasRuleta.giros_restantes <= 0 && (
                        <p className="ruleta-nota text-red-600">
                          * Ya has usado todos tus giros de hoy. Vuelve mañana.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Sección de tabla general */}
              {configuracion.ordenSecciones.includes('tablaGeneral') && configuracion.mostrarTablaGeneral && (
                <div className="seccion-inicio">
                  <h2 className="titulo-seccion">
                    <FaTrophy className="icono-seccion" />
                    Tabla General
                  </h2>
                  {isLoadingTablaGeneral ? (
                    <div className="loading-spinner">
                      <FaGamepad className="spinner-icon" />
                      <span>Cargando tabla general...</span>
                    </div>
                  ) : tablaGeneral.length > 0 ? (
                    <div className="tabla-general-container">
                      <table className="tabla-general">
                        <thead>
                          <tr>
                            <th>Posición</th>
                            <th>Jugador</th>
                            <th>Puntos</th>
                            <th>Partidas</th>
                            <th>Victorias</th>
                          </tr>
                        </thead>
                        <tbody>
                          {tablaGeneral.map((jugador, index) => (
                            <tr key={jugador.jugador_nickname} className={index < 3 ? 'top-3' : ''}>
                              <td className="posicion">
                                {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                              </td>
                              <td className="jugador-info">
                                <img 
                                  src={jugador.foto || '/default-profile.png'} 
                                  alt={jugador.jugador_nickname} 
                                  className="jugador-avatar"
                                />
                                <span>{jugador.jugador_nickname}</span>
                              </td>
                              <td className="puntos">{jugador.puntos_totales}</td>
                              <td>{jugador.partidas_jugadas}</td>
                              <td>{jugador.partidas_ganadas}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="no-data">
                      <p>No hay datos en la tabla general</p>
                    </div>
                  )}
                </div>
              )}

              {/* Sección de juegos */}
              {configuracion.ordenSecciones.includes('juegos') && (
                <div className="seccion-inicio">
                  <h2 className="titulo-seccion">
                    <FaGamepad className="icono-seccion" />
                    Juegos Destacados
                  </h2>
                  {juegos.length > 0 ? (
                    <div className="juegos-grid">
                      {juegos.map((juego) => (
                        <div 
                          key={juego.id} 
                          className="juego-card"
                          onClick={() => handleJuegoClick(juego)}
                        >
                          <div className="juego-imagen">
                            {juego.foto ? (
                              <img src={juego.foto} alt={juego.nombre} />
                            ) : (
                              <FaGamepad />
                            )}
                          </div>
                          <h3>{juego.nombre}</h3>
                          <p>Categoría: {juego.categoria_nombre}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="no-data">No hay juegos destacados</p>
                  )}
                </div>
              )}

              {/* Sección de comodines */}
              {false && configuracion.ordenSecciones.includes('comodines') && (
                <div className="seccion-inicio">
                  <h2 className="titulo-seccion">
                    <FaStar className="icono-seccion" />
                    Comodines Disponibles
                  </h2>
                  {isLoadingComodines ? (
                    <div className="loading-spinner">
                      <FaGamepad className="spinner-icon" />
                      <span>Cargando comodines...</span>
                    </div>
                  ) : comodines.length > 0 ? (
                    <div className="comodines-grid">
                      {comodines.map(comodin => (
                        <div key={comodin.idcomodines} className="comodin-card">
                          <div className="comodin-imagen">
                            {comodin.foto ? (
                              <img src={comodin.foto} alt={comodin.nombre} />
                            ) : (
                              <FaStar className="comodin-icon" />
                            )}
                          </div>
                          <h4>{comodin.nombre}</h4>
                          <p>{comodin.descripcion}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="no-data">
                      <p>No hay comodines disponibles</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Columna derecha - Widgets adicionales */}
            <div className="columna-derecha">
              {/* Widget de futuras partidas */}
              <div className="widget-lateral">
                <h3>
                  <FaClock />
                  Futuras Partidas
                </h3>
                {isLoadingFuturasPartidas ? (
                  <div className="loading-spinner">
                    <FaGamepad className="spinner-icon" />
                    <span>Cargando partidas...</span>
                  </div>
                ) : futurasPartidas.length > 0 ? (
                  <div className="partidas-proximas">
                    {futurasPartidas.map(partida => {
                      const fechaPartida = new Date(partida.fecha);
                      const fechaFormateada = fechaPartida.toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'short'
                      });
                      const horaFormateada = fechaPartida.toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit'
                      });
                      
                      return (
                        <div key={partida.id} className="partida-item">
                          <div className="partida-fecha">
                            <div className="fecha-dia">{fechaFormateada}</div>
                            <div className="fecha-hora">{horaFormateada}</div>
                          </div>
                          <div className="partida-info">
                            <div className="partida-juego">
                              {partida.juego_foto ? (
                                <img src={partida.juego_foto} alt={partida.juego_nombre} className="juego-mini" />
                              ) : (
                                <FaGamepad className="juego-icon-mini" />
                              )}
                              <span>{partida.juego_nombre}</span>
                            </div>
                            <div className="partida-tipo">{partida.tipo}</div>
                            <div className="partida-fase">{partida.fase}</div>
                            {partida.jugadores && partida.jugadores.length > 0 && (
                              <div className="partida-jugadores">
                                {partida.jugadores.slice(0, 3).join(' vs ')}
                                {partida.jugadores.length > 3 && ` +${partida.jugadores.length - 3} más`}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="no-data">
                    <p>No hay partidas programadas</p>
                  </div>
                )}
              </div>

              {/* Widget de estadísticas reales */}
              <div className="widget-lateral">
                <h3>
                  <FaChartLine />
                  Estadísticas del Torneo
                </h3>
                {isLoadingEstadisticas ? (
                  <div className="loading-spinner">
                    <FaGamepad className="spinner-icon" />
                    <span>Cargando estadísticas...</span>
                  </div>
                ) : (
                  <div className="stats-avanzadas">
                    <div className="stat-avanzada">
                      <div className="stat-header">Progreso del Torneo</div>
                      <div className="stat-progress">
                        <div className="progress-bar" style={{ width: `${estadisticasReales.progresoTorneo}%` }}></div>
                      </div>
                      <div className="stat-value">{estadisticasReales.partidasJugadas}/{estadisticasReales.totalPartidas} partidas</div>
                    </div>
                    <div className="stat-avanzada">
                      <div className="stat-header">Jugadores Activos</div>
                      <div className="stat-progress">
                        <div className="progress-bar" style={{ width: '100%' }}></div>
                      </div>
                      <div className="stat-value">{estadisticasReales.jugadoresActivos} participantes</div>
                    </div>
                    {estadisticasReales.edicionActual && (
                      <div className="edicion-info">
                        <div className="edicion-titulo">Edición {estadisticasReales.edicionActual.id}</div>
                        <div className="edicion-fechas">
                          {new Date(estadisticasReales.edicionActual.fechaInicio).toLocaleDateString('es-ES')} - {new Date(estadisticasReales.edicionActual.fechaFin).toLocaleDateString('es-ES')}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Widget de logros destacados */}
              <div className="widget-lateral">
                <h3>
                  <FaMedal />
                  Logros Destacados
                </h3>
                {isLoadingLogros ? (
                  <div className="loading-spinner">
                    <FaGamepad className="spinner-icon" />
                    <span>Cargando logros...</span>
                  </div>
                ) : logrosDestacados.length > 0 ? (
                  <div className="logros-destacados">
                    {logrosDestacados.map(logro => (
                      <div key={logro.idlogros} className="logro-destacado">
                        <div className="logro-imagen">
                          {logro.foto ? (
                            <img src={logro.foto} alt={logro.nombre} />
                          ) : (
                            <FaMedal className="logro-icon" />
                          )}
                        </div>
                        <div className="logro-info">
                          <div className="logro-nombre">{logro.nombre}</div>
                          <div className="logro-descripcion">{logro.descripcion}</div>
                          <div className="logro-usuarios">{logro.usuarios_conseguidos} jugadores</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-data">
                    <p>No hay logros disponibles</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>

      {/* Modal para mostrar información del jugador */}
      {selectedPlayer && (
        <div className="modal-overlay" onClick={() => setSelectedPlayer(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Perfil del Jugador</h2>
              <button className="modal-close" onClick={() => setSelectedPlayer(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="jugador-perfil">
                <div className="jugador-avatar-large">
                  {selectedPlayer.foto ? (
                    <img src={selectedPlayer.foto} alt={selectedPlayer.nickname} />
                  ) : (
                    <FaUser />
                  )}
                </div>
                <h3>{selectedPlayer.nickname}</h3>
                <p className="jugador-email">{selectedPlayer.email}</p>
                <p className="jugador-descripcion">
                  {selectedPlayer.descripcion || 'Sin descripción disponible'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Jugador */}
      {showJugadorModal && jugadorSeleccionado && (
        <div className="modal-overlay" onClick={() => setShowJugadorModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Perfil del Jugador</h3>
              <button className="modal-close" onClick={() => setShowJugadorModal(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="jugador-perfil">
                <img 
                  src={jugadorSeleccionado.foto || '/default-profile.png'} 
                  alt={jugadorSeleccionado.nickname} 
                  className="jugador-foto"
                />
                <h4>{jugadorSeleccionado.nickname}</h4>
                <p>{jugadorSeleccionado.descripcion || 'Sin descripción'}</p>
                
                {/* Logros y comodines del jugador */}
                <div className="jugador-logros-comodines">
                  <h5>Logros y Comodines</h5>
                  <div className="logros-comodines-grid">
                    {/* Aquí se mostrarían los logros y comodines del jugador */}
                    <p>Logros y comodines se cargarán próximamente...</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Resultado de Ruleta */}
      {showResultadoRuleta && resultadoRuleta && (
        <div className="modal-overlay" onClick={() => setShowResultadoRuleta(false)}>
          <div className="modal-content resultado-ruleta" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>¡Resultado de la Ruleta!</h3>
              <button className="modal-close" onClick={() => setShowResultadoRuleta(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="resultado-content">
                {resultadoRuleta.imagen && (
                  <img 
                    src={resultadoRuleta.imagen} 
                    alt={resultadoRuleta.nombre} 
                    className="resultado-imagen"
                  />
                )}
                <h4>{resultadoRuleta.nombre}</h4>
                <p>{resultadoRuleta.descripcion}</p>
                {resultadoRuleta.texto_personalizado && (
                  <p className="texto-personalizado">{resultadoRuleta.texto_personalizado}</p>
                )}
                {resultadoRuleta.puntos && (
                  <div className="puntos-ganados">
                    <span className={`puntos-badge ${resultadoRuleta.puntos_numericos >= 0 ? 'positivo' : 'negativo'}`}>
                      {resultadoRuleta.puntos_numericos >= 0 ? '+' : ''}{resultadoRuleta.puntos_numericos} puntos
                    </span>
                    <p>
                      {resultadoRuleta.puntos_numericos >= 0 
                        ? '¡Se han agregado a tu puntuación en la tabla general!' 
                        : 'Se han restado de tu puntuación en la tabla general (mínimo 0 puntos)'}
                    </p>
                  </div>
                )}
                <div className="resultado-tipo">
                  <span className={`badge ${resultadoRuleta.tipo === 'comodin' ? 'comodin' : resultadoRuleta.tipo === 'puntos' ? 'puntos' : 'personalizado'}`}>
                    {resultadoRuleta.tipo === 'comodin' ? 'Comodín' : 
                     resultadoRuleta.tipo === 'puntos' ? 'Puntos' : 'Premio Personalizado'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      
      )}
    </>
  );
};
