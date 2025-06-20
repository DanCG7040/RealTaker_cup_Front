import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { FaSearch, FaTrophy, FaGamepad, FaUsers, FaCalendar, FaEye, FaSpinner, FaFilter, FaTimes, FaMedal } from 'react-icons/fa';
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

  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      // Cargar ediciones
      const edicionesResponse = await axios.get(EDICION_ROUTES.GET_ALL, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Cargar partidas
      const partidasResponse = await axios.get(PARTIDAS_ROUTES.GET_ALL, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Cargar ediciones históricas
      const historicoResponse = await axios.get(HISTORICO_ROUTES.GET_EDICIONES, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (edicionesResponse.data.success) {
        setEdiciones(edicionesResponse.data.data);
      }

      if (partidasResponse.data.success) {
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

    let filtered = [...allPartidas];

    switch (filterType) {
      case 'year':
        filtered = allPartidas.filter(partida => 
          partida.idEdicion.toString().includes(searchTerm)
        );
        break;
      
      case 'player':
        filtered = allPartidas.filter(partida => 
          partida.jugadores && partida.jugadores.some(jugador => 
            jugador.toLowerCase().includes(searchTerm.toLowerCase())
          )
        );
        break;
      
      case 'game':
        filtered = allPartidas.filter(partida => 
          partida.juego_nombre && 
          partida.juego_nombre.toLowerCase().includes(searchTerm.toLowerCase())
        );
        break;
      
      case 'phase':
        filtered = allPartidas.filter(partida => 
          partida.fase && 
          partida.fase.toLowerCase().includes(searchTerm.toLowerCase())
        );
        break;
      
      case 'type':
        filtered = allPartidas.filter(partida => 
          partida.tipo && 
          partida.tipo.toLowerCase().includes(searchTerm.toLowerCase())
        );
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
        const partidasFiltradas = allPartidas.filter(partida => 
          partida.idEdicion.toString().includes(searchTerm) ||
          (partida.jugadores && partida.jugadores.some(jugador => 
            jugador.toLowerCase().includes(searchTerm.toLowerCase())
          )) ||
          (partida.juego_nombre && 
           partida.juego_nombre.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (partida.fase && 
           partida.fase.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (partida.tipo && 
           partida.tipo.toLowerCase().includes(searchTerm.toLowerCase()))
        );

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

    setFilteredPartidas(filtered);
    
    if (filtered.length === 0) {
      toast.info(`No se encontraron resultados para "${searchTerm}"`);
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

  // Ver perfil de jugador
  const handleVerPerfil = async (nickname) => {
    setIsLoadingPerfil(true);
    try {
      const response = await axios.get(PARTIDAS_ROUTES.GET_PERFIL_JUGADOR(nickname), {
        headers: { Authorization: `Bearer ${token}` }
      });
      
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

  // Obtener resultado de partida
  const getResultadoPartida = async (partidaId) => {
    try {
      const response = await axios.get(PARTIDAS_ROUTES.GET_RESULTADO(partidaId), {
        headers: { Authorization: `Bearer ${token}` }
      });
      
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

  // Cargar tabla general histórica
  const cargarTablaHistorica = async (idEdicion) => {
    setIsLoadingTablaHistorica(true);
    try {
      const response = await axios.get(HISTORICO_ROUTES.GET_TABLA_GENERAL(idEdicion), {
        headers: { Authorization: `Bearer ${token}` }
      });
      
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
    <div className="historico-container">
      {/* Header */}
      <div className="historico-header">
        <h1 className="historico-title">
          <FaTrophy className="historico-icon" />
          Histórico de Torneos
        </h1>
        <p className="historico-subtitle">
          Explora el historial completo de torneos, partidas y resultados
        </p>
      </div>

     

      {/* Filtros avanzados */}
      <div className="filters-section">
        <div className="filters-header">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="filters-toggle"
          >
            <FaFilter />
            Filtros Avanzados
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
              <h4>Sugerencias de búsqueda:</h4>
              <div className="suggestions-grid">
                <div className="suggestion-item">
                  <strong>Años:</strong> 2024, 2023, 2022...
                </div>
                <div className="suggestion-item">
                  <strong>Fases:</strong> Grupos, Cuartos, Semifinal, Final
                </div>
                <div className="suggestion-item">
                  <strong>Tipos:</strong> PVP, TodosContraTodos
                </div>
                <div className="suggestion-item">
                  <strong>Jugadores:</strong> Nombre del jugador
                </div>
                <div className="suggestion-item">
                  <strong>Tablas Históricas:</strong> Año del torneo o "Nueva edición"
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
       {/* Sección de Tablas Generales Históricas */}
      {edicionesHistoricas.length > 0 && (
        <div className="historico-tablas-section">
          <h2 className="section-title">
            <FaTrophy className="section-icon" />
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

     

      {/* Resultados */}
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