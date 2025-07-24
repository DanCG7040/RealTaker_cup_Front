import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Navbar } from '../Components/Navbar';
import { Footer } from '../Components/Footer';
import { useLocation } from 'react-router-dom';
import { FaSearch, FaTrophy, FaGamepad, FaUsers, FaCalendar, FaEye, FaSpinner, FaFilter, FaTimes, FaMedal, FaBookOpen, FaHistory, FaChartBar, FaStar, FaVideo } from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { EDICION_ROUTES, PARTIDAS_ROUTES, HISTORICO_ROUTES } from '../routes/api.routes.js';
import '../styles/historico.css';

export const Historico = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('year'); // year, player, game, phase, type
  const [ediciones, setEdiciones] = useState([]);
  const [allPartidas, setAllPartidas] = useState([]);
  const [filteredPartidas, setFilteredPartidas] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEdicion, setSelectedEdicion] = useState(null);
  const [showPerfilModal, setShowPerfilModal] = useState(false);
  const [jugadorSeleccionado, setJugadorSeleccionado] = useState(null);
  const [isLoadingPerfil, setIsLoadingPerfil] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [edicionesHistoricas, setEdicionesHistoricas] = useState([]);
  const [showTablaHistorica, setShowTablaHistorica] = useState(false);
  const [tablaHistorica, setTablaHistorica] = useState(null);
  const [isLoadingTablaHistorica, setIsLoadingTablaHistorica] = useState(false);
  const [activeTab, setActiveTab] = useState('partidas'); // partidas, tablas, estadisticas
  const [historicoVideos, setHistoricoVideos] = useState([]);
  const location = useLocation();

  const token = localStorage.getItem('token');

  // Cargar datos iniciales
  useEffect(() => {
    loadInitialData();
  }, []);

  // Aplicar filtros recibidos desde la navegación
  useEffect(() => {
    if (location.state) {
      const { filterType, searchTerm: initialSearchTerm, juegoId } = location.state;
      
      if (filterType && initialSearchTerm) {
        setFilterType(filterType);
        setSearchTerm(initialSearchTerm);
        
        // Aplicar el filtro automáticamente cuando los datos estén cargados
        if (allPartidas.length > 0) {
          setTimeout(() => {
            handleSearchWithParams(filterType, initialSearchTerm, juegoId);
          }, 100);
        }
      }
    }
  }, [location.state, allPartidas]);

  useEffect(() => {
    if (activeTab === 'grabaciones') {
      axios.get('/api/videos-historicos')
        .then(res => setHistoricoVideos(res.data.data))
        .catch(() => setHistoricoVideos([]));
    }
  }, [activeTab]);

  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      // Cargar ediciones (público)
      const edicionesResponse = await axios.get(EDICION_ROUTES.GET_ALL);

      // Cargar partidas (público)
      const partidasResponse = await axios.get(PARTIDAS_ROUTES.GET_ALL);

      // Cargar ediciones históricas (público - sin token)
      const historicoResponse = await axios.get(HISTORICO_ROUTES.GET_EDICIONES);

      if (edicionesResponse.data.success) {
        setEdiciones(edicionesResponse.data.data);
      }

      if (partidasResponse.data.success) {
        console.log('📊 Datos de partidas recibidos:', partidasResponse.data.data);
        // Log de la primera partida para ver la estructura
        if (partidasResponse.data.data.length > 0) {
          console.log('🔍 Estructura de la primera partida:', partidasResponse.data.data[0]);
        }
        setAllPartidas(partidasResponse.data.data);
        setFilteredPartidas(partidasResponse.data.data);
      }

      if (historicoResponse.data.success) {
        setEdicionesHistoricas(historicoResponse.data.data);
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
      toast.error('Error al cargar los datos');
    } finally {
      setIsLoading(false);
    }
  };

  // Función de búsqueda y filtrado
  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredPartidas(allPartidas);
      return;
    }

    console.log('🔍 Búsqueda iniciada:', { filterType, searchTerm, totalPartidas: allPartidas.length });

    let filtered = [...allPartidas];

    switch (filterType) {
      case 'year':
        filtered = allPartidas.filter(partida => {
          const match = partida.idEdicion && partida.idEdicion.toString().includes(searchTerm);
          console.log(`Año ${partida.idEdicion}: ${match ? '✅' : '❌'}`);
          return match;
        });
        break;
      
      case 'player':
        filtered = allPartidas.filter(partida => {
          if (!partida.jugadores || !Array.isArray(partida.jugadores)) {
            console.log(`Partida ${partida.id}: sin jugadores`);
            return false;
          }
          const match = partida.jugadores.some(jugador => 
            jugador && jugador.toLowerCase().includes(searchTerm.toLowerCase())
          );
          console.log(`Jugadores ${partida.jugadores.join(', ')}: ${match ? '✅' : '❌'}`);
          return match;
        });
        break;
      
      case 'game':
        filtered = allPartidas.filter(partida => {
          if (!partida.juego_nombre) {
            console.log(`Partida ${partida.id}: sin nombre de juego`);
            return false;
          }
          const match = partida.juego_nombre.toLowerCase().includes(searchTerm.toLowerCase());
          console.log(`Juego ${partida.juego_nombre}: ${match ? '✅' : '❌'}`);
          return match;
        });
        break;
      
      case 'phase':
        filtered = allPartidas.filter(partida => {
          if (!partida.fase) {
            console.log(`Partida ${partida.id}: sin fase`);
            return false;
          }
          const match = partida.fase.toLowerCase().includes(searchTerm.toLowerCase());
          console.log(`Fase ${partida.fase}: ${match ? '✅' : '❌'}`);
          return match;
        });
        break;
      
      case 'type':
        filtered = allPartidas.filter(partida => {
          if (!partida.tipo) {
            console.log(`Partida ${partida.id}: sin tipo`);
            return false;
          }
          const match = partida.tipo.toLowerCase().includes(searchTerm.toLowerCase());
          console.log(`Tipo ${partida.tipo}: ${match ? '✅' : '❌'}`);
          return match;
        });
        break;

      case 'tabla_historica':
        // Filtrar ediciones históricas que coincidan con la búsqueda
        const edicionesFiltradas = edicionesHistoricas.filter(edicion => 
          edicion.idEdicion.toString().includes(searchTerm) ||
          edicion.motivo.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        // Si hay coincidencias en ediciones históricas, mostrar solo esa sección
        if (edicionesFiltradas.length > 0) {
          setEdicionesHistoricas(edicionesFiltradas);
          setFilteredPartidas([]); // Ocultar partidas para mostrar solo tablas históricas
          toast.success(`Se encontraron ${edicionesFiltradas.length} tablas históricas para "${searchTerm}"`);
          return;
        } else {
          setFilteredPartidas([]);
          toast.info(`No se encontraron tablas históricas para "${searchTerm}"`);
          return;
        }
      
      default:
        // Búsqueda general - incluir tablas históricas
        const partidasFiltradas = allPartidas.filter(partida => {
          const matchYear = partida.idEdicion && partida.idEdicion.toString().includes(searchTerm);
          const matchPlayer = partida.jugadores && Array.isArray(partida.jugadores) && 
            partida.jugadores.some(jugador => jugador && jugador.toLowerCase().includes(searchTerm.toLowerCase()));
          const matchGame = partida.juego_nombre && 
            partida.juego_nombre.toLowerCase().includes(searchTerm.toLowerCase());
          const matchPhase = partida.fase && 
            partida.fase.toLowerCase().includes(searchTerm.toLowerCase());
          const matchType = partida.tipo && 
            partida.tipo.toLowerCase().includes(searchTerm.toLowerCase());
          
          return matchYear || matchPlayer || matchGame || matchPhase || matchType;
        });

        // También buscar en ediciones históricas
        const edicionesHistoricasFiltradas = edicionesHistoricas.filter(edicion => 
          edicion.idEdicion.toString().includes(searchTerm) ||
          edicion.motivo.toLowerCase().includes(searchTerm.toLowerCase())
        );

        setFilteredPartidas(partidasFiltradas);
        
        // Si hay coincidencias en ediciones históricas, filtrarlas también
        if (edicionesHistoricasFiltradas.length > 0) {
          setEdicionesHistoricas(edicionesHistoricasFiltradas);
        }
        
        if (partidasFiltradas.length === 0 && edicionesHistoricasFiltradas.length === 0) {
          toast.info(`No se encontraron resultados para "${searchTerm}"`);
        }
        return;
    }

    console.log(`📊 Resultados encontrados: ${filtered.length} de ${allPartidas.length}`);
    setFilteredPartidas(filtered);
    
    if (filtered.length === 0) {
      toast.info(`No se encontraron resultados para "${searchTerm}"`);
    } else {
      toast.success(`Se encontraron ${filtered.length} partidas para "${searchTerm}"`);
    }
  };

  // Función para aplicar búsqueda con parámetros específicos (usada desde navegación)
  const handleSearchWithParams = (type, term, juegoId = null) => {
    let filtered = [...allPartidas];

    switch (type) {
      case 'game':
        if (juegoId) {
          // Filtrar por ID del juego si está disponible
          filtered = allPartidas.filter(partida => 
            partida.juego_id === juegoId
          );
        } else {
          // Filtrar por nombre del juego
          filtered = allPartidas.filter(partida => 
            partida.juego_nombre && 
            partida.juego_nombre.toLowerCase().includes(term.toLowerCase())
          );
        }
        break;
      
      default:
        // Usar la lógica normal de búsqueda
        handleSearch();
        return;
    }

    setFilteredPartidas(filtered);
    
    if (filtered.length === 0) {
      toast.info(`No se encontraron partidas para "${term}"`);
    } else {
      toast.success(`Se encontraron ${filtered.length} partidas para "${term}"`);
    }
  };

  // Ver perfil de jugador (público)
  const handleVerPerfil = async (nickname) => {
    setIsLoadingPerfil(true);
    try {
      const response = await axios.get(PARTIDAS_ROUTES.GET_PERFIL_JUGADOR(nickname));
      
      if (response.data.success) {
        setJugadorSeleccionado(response.data.data);
        setShowPerfilModal(true);
      }
    } catch (error) {
      console.error('Error al obtener perfil:', error);
      toast.error('Error al cargar el perfil del jugador');
    } finally {
      setIsLoadingPerfil(false);
    }
  };

  // Obtener resultado de partida (público)
  const getResultadoPartida = async (partidaId) => {
    try {
      const response = await axios.get(PARTIDAS_ROUTES.GET_RESULTADO(partidaId));
      
      if (response.data.success) {
        return response.data.data;
      }
    } catch (error) {
      console.error('Error al obtener resultado:', error);
    }
    return null;
  };

  // Limpiar filtros
  const clearFilters = () => {
    setSearchTerm('');
    setFilterType('year');
    setFilteredPartidas(allPartidas);
    setSelectedEdicion(null);
    // Restaurar ediciones históricas originales
    loadInitialData();
  };

  // Agrupar partidas por edición
  const groupPartidasByEdicion = () => {
    const grouped = {};
    filteredPartidas.forEach(partida => {
      if (!grouped[partida.idEdicion]) {
        grouped[partida.idEdicion] = [];
      }
      grouped[partida.idEdicion].push(partida);
    });
    return grouped;
  };

  const groupedPartidas = groupPartidasByEdicion();

  // Cargar tabla general histórica (público - sin token)
  const cargarTablaHistorica = async (idEdicion) => {
    setIsLoadingTablaHistorica(true);
    try {
      const response = await axios.get(HISTORICO_ROUTES.GET_TABLA_GENERAL(idEdicion));
      
      if (response.data.success) {
        setTablaHistorica(response.data.data);
        setShowTablaHistorica(true);
      }
    } catch (error) {
      console.error('Error al cargar tabla histórica:', error);
      toast.error('Error al cargar la tabla histórica');
    } finally {
      setIsLoadingTablaHistorica(false);
    }
  };

  return (
    <>
      <div className="historico-container">
        {/* Header modernizado */}
        <div className="historico-header">
          <h1 className="historico-title">
            <FaBookOpen className="historico-icon" />
            Historial de takercup
          </h1>
         
        </div>

        {/* Navegación por pestañas */}
        <div className="tabs-navigation">
          <button 
            className={`tab-button ${activeTab === 'partidas' ? 'active' : ''}`}
            onClick={() => setActiveTab('partidas')}
          >
            <FaGamepad />
            Partidas
          </button>
          <button 
            className={`tab-button ${activeTab === 'tablas' ? 'active' : ''}`}
            onClick={() => setActiveTab('tablas')}
          >
            <FaTrophy />
            Tablas Históricas
          </button>
          <button 
            className={`tab-button ${activeTab === 'estadisticas' ? 'active' : ''}`}
            onClick={() => setActiveTab('estadisticas')}
          >
            <FaChartBar />
            Estadísticas
          </button>
          <button 
            className={`tab-button ${activeTab === 'grabaciones' ? 'active' : ''}`}
            onClick={() => setActiveTab('grabaciones')}
          >
            <FaVideo />
            Grabaciones
          </button>
        </div>

        {/* Filtros avanzados */}
        <div className="filters-section">
          <div className="filters-header">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="filters-toggle"
            >
              <FaFilter />
              Búsqueda Avanzada
            </button>
            {filteredPartidas.length !== allPartidas.length && (
              <button onClick={clearFilters} className="clear-filters">
                <FaTimes />
                Limpiar Filtros
              </button>
            )}
          </div>

          {showFilters && (
            <div className="filters-content">
              <div className="filter-row">
                <div className="filter-group">
                  <label className="filter-label">Tipo de Búsqueda</label>
                  <select 
                    value={filterType} 
                    onChange={(e) => setFilterType(e.target.value)}
                    className="filter-select"
                  >
                    <option value="year">Por Año</option>
                    <option value="player">Por Jugador</option>
                    <option value="game">Por Juego</option>
                    <option value="phase">Por Fase</option>
                    <option value="type">Por Tipo de Partida</option>
                    <option value="tabla_historica">Por Tabla Histórica</option>
                    <option value="all">Búsqueda General</option>
                  </select>
                </div>

                <div className="filter-group">
                  <label className="filter-label">Término de Búsqueda</label>
                  <div className="search-input-group">
                    <input
                      type="text"
                      placeholder={getPlaceholderText(filterType)}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="search-input"
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <button
                      onClick={handleSearch}
                      disabled={isLoading}
                      className="search-button"
                    >
                      {isLoading ? <FaSpinner className="spinner" /> : <FaSearch />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="filter-suggestions">
                <h4>💡 Sugerencias de búsqueda:</h4>
                <div className="suggestions-grid">
                  <div className="suggestion-item">
                    <strong>📅 Años:</strong> 2024, 2023, 2022...
                  </div>
                  <div className="suggestion-item">
                    <strong>🏆 Fases:</strong> Grupos, Cuartos, Semifinal, Final
                  </div>
                  <div className="suggestion-item">
                    <strong>🎮 Tipos:</strong> PVP, TodosContraTodos
                  </div>
                  <div className="suggestion-item">
                    <strong>👤 Jugadores:</strong> Nombre del jugador
                  </div>
                  <div className="suggestion-item">
                    <strong>📊 Tablas Históricas:</strong> Año del torneo o "Nueva edición"
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Estadísticas */}
        <div className="stats-section">
          <div className="stats-grid">
            <div className="stat-card">
              <FaTrophy className="stat-icon" />
              <div className="stat-content">
                <span className="stat-number">{ediciones.length}</span>
                <span className="stat-label">Torneos</span>
              </div>
            </div>
            <div className="stat-card">
              <FaGamepad className="stat-icon" />
              <div className="stat-content">
                <span className="stat-number">{filteredPartidas.length}</span>
                <span className="stat-label">Partidas</span>
              </div>
            </div>
            <div className="stat-card">
              <FaMedal className="stat-icon" />
              <div className="stat-content">
                <span className="stat-number">
                  {filteredPartidas.filter(p => p.tiene_resultado).length}
                </span>
                <span className="stat-label">Finalizadas</span>
              </div>
            </div>
            <div className="stat-card">
              <FaUsers className="stat-icon" />
              <div className="stat-content">
                <span className="stat-number">
                  {new Set(filteredPartidas.flatMap(p => p.jugadores || [])).size}
                </span>
                <span className="stat-label">Jugadores Únicos</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contenido según pestaña activa */}
        {activeTab === 'partidas' && (
          <div className="results-section">
            {isLoading ? (
              <div className="loading-container">
                <FaSpinner className="spinner" />
                <span>Cargando datos...</span>
              </div>
            ) : filteredPartidas.length === 0 ? (
              <div className="no-data">
                <p>No se encontraron partidas con los filtros aplicados</p>
                <button onClick={clearFilters} className="clear-filters-btn">
                  Limpiar Filtros
                </button>
              </div>
            ) : (
              <div className="results-content">
                {Object.entries(groupedPartidas).map(([edicionId, partidas]) => {
                  const edicion = ediciones.find(e => e.idEdicion.toString() === edicionId);
                  return (
                    <div key={edicionId} className="edicion-section">
                      <div className="edicion-header-section">
                        <h2 className="edicion-title">
                          <FaTrophy className="edicion-icon" />
                          Torneo {edicionId}
                          {edicion && (
                            <span className="edicion-dates">
                              ({new Date(edicion.fecha_inicio).toLocaleDateString('es-ES')} - {new Date(edicion.fecha_fin).toLocaleDateString('es-ES')})
                            </span>
                          )}
                        </h2>
                        <span className="partidas-count">{partidas.length} partidas</span>
                      </div>
                      
                      <div className="partidas-grid">
                        {partidas.map((partida) => (
                          <PartidaCard
                            key={partida.id}
                            partida={partida}
                            onVerPerfil={handleVerPerfil}
                            getResultado={getResultadoPartida}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'tablas' && (
          <div className="historico-tablas-section">
            <h2 className="section-title">
              <FaHistory className="section-icon" />
              Tablas Generales Históricas
            </h2>
            <div className="historico-tablas-grid">
              {edicionesHistoricas.map((edicion) => (
                <div key={edicion.idEdicion} className="historico-tabla-card">
                  <div className="historico-tabla-header">
                    <h3 className="historico-tabla-title">
                      Torneo {edicion.idEdicion}
                    </h3>
                    <span className="historico-tabla-date">
                      {new Date(edicion.fecha_historico).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                  <div className="historico-tabla-info">
                    <p className="historico-tabla-motivo">{edicion.motivo}</p>
                    <p className="historico-tabla-jugadores">
                      {edicion.total_jugadores} jugadores
                    </p>
                    {edicion.fecha_inicio && edicion.fecha_fin && (
                      <p className="historico-tabla-periodo">
                        {new Date(edicion.fecha_inicio).toLocaleDateString('es-ES')} - {new Date(edicion.fecha_fin).toLocaleDateString('es-ES')}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => cargarTablaHistorica(edicion.idEdicion)}
                    className="ver-tabla-btn"
                    disabled={isLoadingTablaHistorica}
                  >
                    {isLoadingTablaHistorica ? (
                      <FaSpinner className="spinner" />
                    ) : (
                      <FaEye />
                    )}
                    Ver Tabla General
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'estadisticas' && (
          <div className="estadisticas-section">
            <h2 className="section-title">
              <FaChartBar className="section-icon" />
              Análisis y Estadísticas
            </h2>
            <div className="estadisticas-grid">
              <div className="estadistica-card">
                <h3>📈 Progreso del Torneo</h3>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{width: `${(filteredPartidas.filter(p => p.tiene_resultado).length / filteredPartidas.length) * 100}%`}}
                  ></div>
                </div>
                <p>{filteredPartidas.filter(p => p.tiene_resultado).length} de {filteredPartidas.length} partidas finalizadas</p>
              </div>
              
              <div className="estadistica-card">
                <h3>🎮 Juegos Más Jugados</h3>
                <div className="game-stats">
                  {Object.entries(
                    filteredPartidas.reduce((acc, partida) => {
                      const game = partida.juego_nombre || 'Sin nombre';
                      acc[game] = (acc[game] || 0) + 1;
                      return acc;
                    }, {})
                  )
                  .sort(([,a], [,b]) => b - a)
                  .slice(0, 5)
                  .map(([game, count]) => (
                    <div key={game} className="game-stat-item">
                      <span>{game}</span>
                      <span className="game-count">{count}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="estadistica-card">
                <h3>👥 Jugadores Más Activos</h3>
                <div className="player-stats">
                  {Object.entries(
                    filteredPartidas.flatMap(p => p.jugadores || [])
                      .reduce((acc, player) => {
                        acc[player] = (acc[player] || 0) + 1;
                        return acc;
                      }, {})
                  )
                  .sort(([,a], [,b]) => b - a)
                  .slice(0, 5)
                  .map(([player, count]) => (
                    <div key={player} className="player-stat-item">
                      <span>{player}</span>
                      <span className="player-count">{count} partidas</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'grabaciones' && (
          <div className="results-section">
            <h2 className="section-title">Grabaciones de Partidas y Torneos</h2>
            <div className="historico-video-list">
              {historicoVideos.length === 0 ? (
                <div>No hay videos históricos registrados.</div>
              ) : (
                historicoVideos.map(video => (
                  <div key={video.id} className="historico-video-item">
                    <strong>{video.titulo}</strong>
                    <br />
                    {video.url.includes('youtube.com') || video.url.includes('youtu.be') ? (
                      <iframe
                        width="360"
                        height="215"
                        src={getYoutubeEmbedUrl(video.url)}
                        title={video.titulo}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        style={{ margin: '1rem 0' }}
                      ></iframe>
                    ) : video.url.includes('twitch.tv') ? (
                      <iframe
                        src={`https://player.twitch.tv/?video=${getTwitchVideoId(video.url)}&parent=${window.location.hostname}`}
                        width="360"
                        height="215"
                        allowFullScreen
                        frameBorder="0"
                        style={{ margin: '1rem 0' }}
                        title={video.titulo}
                      ></iframe>
                    ) : video.url.match(/\.(mp4|webm)$/) ? (
                      <video width="360" height="215" controls style={{ margin: '1rem 0' }}>
                        <source src={video.url} />
                        Tu navegador no soporta la reproducción de video.
                      </video>
                    ) : (
                      <a href={video.url} target="_blank" rel="noopener noreferrer">Ver video</a>
                    )}
                    <br />
                    Juego: {video.juego_nombre} | Partida: {video.partida_id} | Año: {video.idEdicion} | Tipo: {video.tipo_partida}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Modal de perfil de jugador */}
        {showPerfilModal && (
          <PerfilJugadorModal
            jugador={jugadorSeleccionado}
            onClose={() => setShowPerfilModal(false)}
          />
        )}

        {/* Modal de tabla general histórica */}
        {showTablaHistorica && tablaHistorica && (
          <TablaHistoricaModal
            data={tablaHistorica}
            onClose={() => setShowTablaHistorica(false)}
          />
        )}
      </div>
    
    </>
  );
};

// Función auxiliar para obtener placeholder según tipo de filtro
const getPlaceholderText = (filterType) => {
  switch (filterType) {
    case 'year': return 'Ej: 2024, 2023...';
    case 'player': return 'Nombre del jugador';
    case 'game': return 'Nombre del juego';
    case 'phase': return 'Grupos, Cuartos, Semifinal, Final';
    case 'type': return 'PVP, TodosContraTodos';
    case 'tabla_historica': return 'Año del torneo o motivo del histórico';
    default: return 'Buscar en todos los campos...';
  }
};

// Funciones auxiliares para obtener el embed de YouTube y Twitch
function getYoutubeEmbedUrl(url) {
  let videoId = '';
  if (url.includes('youtube.com')) {
    const match = url.match(/[?&]v=([^&]+)/);
    videoId = match ? match[1] : '';
  } else if (url.includes('youtu.be')) {
    const match = url.match(/youtu\.be\/([^?&]+)/);
    videoId = match ? match[1] : '';
  }
  return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
}

function getTwitchVideoId(url) {
  const match = url.match(/videos\/(\d+)/);
  return match ? match[1] : '';
}

// Componente para mostrar una partida
const PartidaCard = ({ partida, onVerPerfil, getResultado }) => {
  const [resultado, setResultado] = useState(null);
  const [isLoadingResultado, setIsLoadingResultado] = useState(false);

  useEffect(() => {
    if (partida.tiene_resultado) {
      loadResultado();
    }
  }, [partida]);

  const loadResultado = async () => {
    setIsLoadingResultado(true);
    const resultadoData = await getResultado(partida.id);
    setResultado(resultadoData);
    setIsLoadingResultado(false);
  };

  return (
    <div className="partida-card">
      <div className="partida-header">
        <div className="partida-info">
          <h3 className="partida-title">Partida #{partida.id}</h3>
          <div className="partida-meta">
            <span className="partida-date">
              {new Date(partida.fecha).toLocaleDateString('es-ES')}
            </span>
            <span className={`partida-type ${partida.tipo.toLowerCase()}`}>
              {partida.tipo}
            </span>
            <span className={`partida-phase ${partida.fase?.toLowerCase()}`}>
              {partida.fase}
            </span>
          </div>
        </div>
        <div className="partida-status">
          {partida.tiene_resultado ? (
            <span className="status-badge completed">Finalizada</span>
          ) : (
            <span className="status-badge pending">Pendiente</span>
          )}
        </div>
      </div>

      <div className="partida-game">
        <img
          src={partida.juego_foto || '/default-game.png'}
          alt={partida.juego_nombre}
          className="game-thumbnail"
        />
        <span className="game-name">{partida.juego_nombre}</span>
      </div>

      <div className="partida-players">
        <h4 className="players-title">Jugadores Participantes</h4>
        <div className="players-list">
          {partida.jugadores && partida.jugadores.length > 0 ? (
            partida.jugadores.map((jugador, index) => (
              <div key={jugador} className="player-item">
                <span className="player-name">{jugador}</span>
                <button
                  onClick={() => onVerPerfil(jugador)}
                  className="view-profile-btn"
                  title="Ver perfil"
                >
                  <FaEye />
                </button>
              </div>
            ))
          ) : (
            <span className="no-players">Sin jugadores registrados</span>
          )}
        </div>
      </div>

      {/* Resultados si la partida está finalizada */}
      {partida.tiene_resultado && (
        <div className="partida-results">
          <h4 className="results-title">Resultados</h4>
          {isLoadingResultado ? (
            <div className="loading-results">
              <FaSpinner className="spinner" />
              <span>Cargando resultados...</span>
            </div>
          ) : resultado ? (
            <div className="results-list">
              {resultado
                .sort((a, b) => a.posicion - b.posicion)
                .map((resultadoItem) => (
                  <div key={resultadoItem.jugador_nickname} className="result-item">
                    <div className="result-position">
                      {resultadoItem.posicion === 1 && '🥇'}
                      {resultadoItem.posicion === 2 && '🥈'}
                      {resultadoItem.posicion === 3 && '🥉'}
                      {resultadoItem.posicion > 3 && `#${resultadoItem.posicion}`}
                    </div>
                    <div className="result-player">
                      <span className="player-name">{resultadoItem.jugador_nickname}</span>
                      {resultadoItem.gano && <span className="winner-badge">🥇 Ganador</span>}
                    </div>
                    <div className="result-points">
                      {resultadoItem.puntos} pts
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <span className="no-results">No se pudieron cargar los resultados</span>
          )}
        </div>
      )}
    </div>
  );
};

// Modal para mostrar perfil de jugador
const PerfilJugadorModal = ({ jugador, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Perfil del Jugador</h2>
          <button onClick={onClose} className="modal-close">
            ×
          </button>
        </div>
        <div className="modal-body">
          {jugador && (
            <div className="perfil-jugador-content">
              <div className="perfil-jugador-avatar">
                <img
                  src={jugador.foto || '/default-avatar.png'}
                  alt={jugador.nickname}
                  className="jugador-perfil-foto"
                />
              </div>
              <div className="perfil-jugador-info">
                <h3 className="perfil-jugador-nickname">{jugador.nickname}</h3>
                <div className="perfil-jugador-descripcion">
                  <p>{jugador.descripcion || 'Sin descripción disponible'}</p>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button onClick={onClose} className="modal-button primary">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

// Modal para mostrar tabla general histórica
const TablaHistoricaModal = ({ data, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content historico-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            Tabla General - Torneo {data.edicion?.idEdicion}
          </h2>
          <button onClick={onClose} className="modal-close">
            ×
          </button>
        </div>
        <div className="modal-body">
          <div className="historico-info">
            <p className="historico-fecha">
              <strong>Fecha del histórico:</strong> {new Date(data.fecha_historico).toLocaleDateString('es-ES')}
            </p>
            <p className="historico-motivo">
              <strong>Motivo:</strong> {data.motivo}
            </p>
            {data.edicion && (
              <p className="historico-periodo">
                <strong>Período:</strong> {new Date(data.edicion.fecha_inicio).toLocaleDateString('es-ES')} - {new Date(data.edicion.fecha_fin).toLocaleDateString('es-ES')}
              </p>
            )}
          </div>
          
          <div className="tabla-historica-container">
            <table className="tabla-historica">
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
                {data.tabla_general.map((jugador, index) => (
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
        </div>
        <div className="modal-footer">
          <button onClick={onClose} className="modal-button primary">
            Cerrar
          </button>
        </div>
      </div>
    
    </div>
    
  );
};

export default Historico; 