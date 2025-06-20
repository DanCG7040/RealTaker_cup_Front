import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaChevronLeft, FaChevronRight, FaUser, FaGamepad, FaTrophy, FaStar } from 'react-icons/fa';
import { ENTRADAS_ROUTES, CONFIGURACION_ROUTES, GAMES_ROUTES, TORNEO_ROUTES, RULETA_ROUTES, PARTIDAS_ROUTES, COMODINES_ROUTES } from '../routes/api.routes';
import './inicio.css';
import { toast } from 'react-hot-toast';

export const Inicio = () => {
  const [entradas, setEntradas] = useState([]);
  const [configuracion, setConfiguracion] = useState({
    mostrarTablaGeneral: true,
    ordenSecciones: ['novedades', 'tablaGeneral', 'jugadores', 'juegos', 'comodines', 'ruleta']
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
  
  // Estados para la ruleta
  const [ruletaActiva, setRuletaActiva] = useState(false);
  const [showRuleta, setShowRuleta] = useState(false);
  const [isGirandoRuleta, setIsGirandoRuleta] = useState(false);
  const [resultadoRuleta, setResultadoRuleta] = useState(null);
  const [showResultadoRuleta, setShowResultadoRuleta] = useState(false);

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
          setConfiguracion(configResponse.data.data);
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
    if (!localStorage.getItem('token')) {
      toast.error('Debes iniciar sesión para girar la ruleta');
      return;
    }

    setIsGirandoRuleta(true);
    try {
      const response = await axios.post(RULETA_ROUTES.GIRAR, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      if (response.data.success) {
        setResultadoRuleta(response.data.data);
        setShowResultadoRuleta(true);
        toast.success('¡Giro exitoso!');
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
        return (
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
              </div>
              <div className="ruleta-action">
                {ruletaActiva ? (
                  <>
                    <button 
                      className="ruleta-button"
                      onClick={girarRuleta}
                      disabled={isGirandoRuleta}
                    >
                      {isGirandoRuleta ? (
                        <>
                          <span className="spinner">🎰</span>
                          <span>Girando...</span>
                        </>
                      ) : (
                        <>
                          <span>🎰</span>
                          <span>¡Girar Ruleta!</span>
                        </>
                      )}
                    </button>
                    <p className="ruleta-nota">
                      * Solo para jugadores registrados
                    </p>
                  </>
                ) : (
                  <div className="ruleta-inactiva">
                    <p>🎰 La ruleta está temporalmente desactivada</p>
                    <p className="ruleta-nota">Vuelve más tarde para intentar tu suerte</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        );

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
            {configuracion.ordenSecciones.map((seccion, index) => (
              <div key={`${seccion}-${index}`}>
                {renderSeccion(seccion)}
              </div>
            ))}
          </div>
        </div>
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
