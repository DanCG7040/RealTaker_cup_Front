import React, { useState, useEffect, useRef } from 'react';
import axios from '../axiosConfig.js';
import { useNavigate } from 'react-router-dom';
import { FaCamera, FaCheck, FaTimes, FaSpinner, FaUser, FaEnvelope, FaPen, FaLock, FaGamepad, FaMedal, FaStar, FaBook, FaUsers, FaTrophy, FaPlus, FaCheckCircle, FaEye, FaSave, FaVideo } from 'react-icons/fa';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PROFILE_ROUTES, ADMIN_ROUTES, GAMES_ROUTES, CATEGORY_ROUTES, LOGROS_ROUTES, COMODINES_ROUTES, EDICION_ROUTES, PUNTOS_ROUTES, PARTIDAS_ROUTES, ENTRADAS_ROUTES, CONFIGURACION_ROUTES, TORNEO_ROUTES, USUARIOS_ROUTES, RULETA_ROUTES } from '../routes/api.routes';
import '../styles/perfil.css';
import { Navbar } from '../Components/Navbar';
import { Footer } from '../Components/Footer';

export const Perfil = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({});
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [showGameModal, setShowGameModal] = useState(false);
  const [gameData, setGameData] = useState({
    nombre: '',
    categoria: ''
  });
  const [gameFile, setGameFile] = useState(null);
  const [gameImagePreview, setGameImagePreview] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [isLoadingCategorias, setIsLoadingCategorias] = useState(false);
  const [isSavingGame, setIsSavingGame] = useState(false);
  const [activeSection, setActiveSection] = useState('perfil');
  const [juegos, setJuegos] = useState([]);
  const [isLoadingJuegos, setIsLoadingJuegos] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  const [isLoadingUsuarios, setIsLoadingUsuarios] = useState(false);
  const [logros, setLogros] = useState([]);
  const [isLoadingLogros, setIsLoadingLogros] = useState(false);
  const [comodines, setComodines] = useState([]);
  const [isLoadingComodines, setIsLoadingComodines] = useState(false);
  const [showLogroModal, setShowLogroModal] = useState(false);
  const [showComodinModal, setShowComodinModal] = useState(false);
  const [logroData, setLogroData] = useState({
    idlogros: null,
    nombre: '',
    descripcion: ''
  });
  const [comodinData, setComodinData] = useState({
    idcomodines: null,
    nombre: '',
    descripcion: ''
  });
  const [logroFile, setLogroFile] = useState(null);
  const [comodinFile, setComodinFile] = useState(null);
  const [logroImagePreview, setLogroImagePreview] = useState(null);
  const [comodinImagePreview, setComodinImagePreview] = useState(null);
  const [isSavingLogro, setIsSavingLogro] = useState(false);
  const [isSavingComodin, setIsSavingComodin] = useState(false);
  
  // Estados para el torneo
  const [showTorneoModal, setShowTorneoModal] = useState(false);
  const [torneoData, setTorneoData] = useState({
    idEdicion: '',
    fecha_inicio: '',
    fecha_fin: ''
  });
  const [isSavingTorneo, setIsSavingTorneo] = useState(false);
  const [showJuegosModal, setShowJuegosModal] = useState(false);
  const [showJugadoresModal, setShowJugadoresModal] = useState(false);
  const [juegosSeleccionados, setJuegosSeleccionados] = useState([]);
  const [jugadoresSeleccionados, setJugadoresSeleccionados] = useState([]);
  const [isAsignandoJuegos, setIsAsignandoJuegos] = useState(false);
  const [isAsignandoJugadores, setIsAsignandoJugadores] = useState(false);
  const [edicionActual, setEdicionActual] = useState(null);
  const [jugadoresDisponibles, setJugadoresDisponibles] = useState([]);
  
  // Estados para listar torneos
  const [torneos, setTorneos] = useState([]);
  const [isLoadingTorneos, setIsLoadingTorneos] = useState(false);
  const [showEditTorneoModal, setShowEditTorneoModal] = useState(false);
  const [editingTorneo, setEditingTorneo] = useState(null);
  const [isCreatingNewTorneo, setIsCreatingNewTorneo] = useState(false);
  
  // Estados para el módulo de puntos
  const [puntosData, setPuntosData] = useState({
    tipoPartida: 'PVP',
    puntosPVP: {
      posicion1: 10,
      posicion2: 5
    },
    puntosTodosContraTodos: Array.from({ length: 10 }, (_, i) => ({
      posicion: i + 1,
      puntos: i < 5 ? 10 - (i * 2) : 0
    }))
  });
  const [isSavingPuntos, setIsSavingPuntos] = useState(false);
  const [puntosExistentes, setPuntosExistentes] = useState([]);
  const [isLoadingPuntos, setIsLoadingPuntos] = useState(false);
  const [showPuntosModal, setShowPuntosModal] = useState(false);
  
  // Estados para el módulo de partidas
  const [edicionesActivas, setEdicionesActivas] = useState([]);
  const [edicionSeleccionada, setEdicionSeleccionada] = useState(null);
  const [jugadoresEdicion, setJugadoresEdicion] = useState([]);
  const [isLoadingJugadores, setIsLoadingJugadores] = useState(false);
  const [showCrearPartidaModal, setShowCrearPartidaModal] = useState(false);
  const [partidaData, setPartidaData] = useState({
    tipo: 'PVP',
    fecha: '',
    jugadores: [],
    juego_id: null,
    fase: 'Grupos',
    video_url: ''
  });
  const [isSavingPartida, setIsSavingPartida] = useState(false);
  const [showPerfilModal, setShowPerfilModal] = useState(false);
  const [jugadorSeleccionado, setJugadorSeleccionado] = useState(null);
  const [partidas, setPartidas] = useState([]);
  const [isLoadingPartidas, setIsLoadingPartidas] = useState(false);
  const [serverError, setServerError] = useState(false);
  
  // Estados para resultados de partidas
  const [showResultadoModal, setShowResultadoModal] = useState(false);
  const [partidaResultado, setPartidaResultado] = useState(null);
  const [resultadosData, setResultadosData] = useState([]);
  const [isSavingResultado, setIsSavingResultado] = useState(false);
  
  // Estado para limpiar tabla general
  const [isLimpiandoTabla, setIsLimpiandoTabla] = useState(false);
  
  const [juegosEdicion, setJuegosEdicion] = useState([]);
  const [isLoadingJuegosEdicion, setIsLoadingJuegosEdicion] = useState(false);
  
  // Estados para el módulo de entradas
  const [entradas, setEntradas] = useState([]);
  const [isLoadingEntradas, setIsLoadingEntradas] = useState(false);
  const [showEntradaModal, setShowEntradaModal] = useState(false);
  const [entradaData, setEntradaData] = useState({
    id: null,
    titulo: '',
    contenido: '',
    imagen_url: '',
    orden: 0,
    visible: true
  });
  const [entradaFile, setEntradaFile] = useState(null);
  const [entradaImagePreview, setEntradaImagePreview] = useState(null);
  const [isSavingEntrada, setIsSavingEntrada] = useState(false);
  const [configuracionInicio, setConfiguracionInicio] = useState({
    mostrarTablaGeneral: true,
    ordenSecciones: ['novedades', 'tablaGeneral', 'jugadores', 'juegos', 'comodines']
  });
  const [isSavingConfiguracion, setIsSavingConfiguracion] = useState(false);
  
  // Estados para gestionar jugadores en el inicio
  const [jugadoresInicio, setJugadoresInicio] = useState([]);
  const [isLoadingJugadoresInicio, setIsLoadingJugadoresInicio] = useState(false);
  const [showJugadoresInicioModal, setShowJugadoresInicioModal] = useState(false);
  const [jugadoresDisponiblesInicio, setJugadoresDisponiblesInicio] = useState([]);
  const [jugadoresSeleccionadosInicio, setJugadoresSeleccionadosInicio] = useState([]);
  const [isSavingJugadoresInicio, setIsSavingJugadoresInicio] = useState(false);
  
  // Estados para la ruleta
  const [ruletaItems, setRuletaItems] = useState([]);
  const [isLoadingRuleta, setIsLoadingRuleta] = useState(false);
  const [showRuletaModal, setShowRuletaModal] = useState(false);
  const [ruletaData, setRuletaData] = useState({
    id: null,
    nombre: '',
    tipo: 'comodin',
    comodin_id: null,
    puntos: 0,
    activo: true
  });
  const [ruletaFile, setRuletaFile] = useState(null);
  const [ruletaImagePreview, setRuletaImagePreview] = useState(null);
  const [isSavingRuleta, setIsSavingRuleta] = useState(false);
  const [configuracionRuleta, setConfiguracionRuleta] = useState({
    ruleta_activa: false,
    max_giros_por_dia: 3
  });
  const [isSavingConfiguracionRuleta, setIsSavingConfiguracionRuleta] = useState(false);
  
  // Estados para gestionar logros y comodines de usuarios
  const [usuarioLogros, setUsuarioLogros] = useState([]);
  const [usuarioComodines, setUsuarioComodines] = useState([]);
  const [isLoadingUsuarioLogros, setIsLoadingUsuarioLogros] = useState(false);
  const [isLoadingUsuarioComodines, setIsLoadingUsuarioComodines] = useState(false);
  const [showAsignarLogroModal, setShowAsignarLogroModal] = useState(false);
  const [logroAsignacionData, setLogroAsignacionData] = useState({
    usuario_nickname: '',
    logro_id: null
  });
  const [isSavingLogroAsignacion, setIsSavingLogroAsignacion] = useState(false);
  
  // Estado para el canal de Twitch
  const [mensajeTwitch, setMensajeTwitch] = useState('');
  
  // Estado para videos históricos
  const [historicoVideos, setHistoricoVideos] = useState([]);
  const [nuevoVideo, setNuevoVideo] = useState({
    titulo: '',
    url: '',
    juego_id: '',
    partida_id: '',
    idEdicion: '',
    tipo_partida: ''
  });
  const [mensajeVideo, setMensajeVideo] = useState('');
  
  // Simulación de fetch de datos (debería venir del backend)
  const jugadoresHistorico = usuarios.map(u => u.nickname);
  const juegosHistorico = juegos.map(j => j.nombre);
  const partidasHistorico = partidas.map(p => p.id);
  const aniosHistorico = Array.from(new Set(torneos.map(t => new Date(t.fecha_inicio).getFullYear())));
  const tiposPartidaHistorico = ['PVP', 'TodosContraTodos'];
  
  const handleNuevoVideoChange = (e) => {
    const { name, value } = e.target;
    setNuevoVideo(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAddHistoricoVideo = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/videos-historicos', nuevoVideo, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMensajeVideo('¡Video añadido correctamente!');
      setNuevoVideo({ titulo: '', url: '', juego_id: '', partida_id: '', idEdicion: '', tipo_partida: '' });
      // Recargar lista
      const res = await axios.get('/api/videos-historicos');
      setHistoricoVideos(res.data.data);
      setTimeout(() => setMensajeVideo(''), 2000);
    } catch (err) {
      setMensajeVideo('Error al añadir video');
    }
  };
  
  // Sección de gestión de videos históricos
  const HistoricoVideosContent = () => (
    <div className="content-section">
      <h2 className="section-title">Añadir Video al Histórico</h2>
      <form className="historico-video-form" onSubmit={handleAddHistoricoVideo}>
        <div className="form-group">
          <label>Título del video</label>
          <input type="text" name="titulo" defaultValue={nuevoVideo.titulo} onBlur={e => setNuevoVideo(prev => ({ ...prev, titulo: e.target.value }))} required />
        </div>
        <div className="form-group">
          <label>URL del video</label>
          <input type="text" name="url" defaultValue={nuevoVideo.url} onBlur={e => setNuevoVideo(prev => ({ ...prev, url: e.target.value }))} required />
        </div>
        <div className="form-group">
          <label>Juego</label>
          <select name="juego_id" value={nuevoVideo.juego_id} onChange={handleNuevoVideoChange} required>
            <option value="">Selecciona un juego</option>
            {juegos.map(j => <option key={j.id} value={j.id}>{j.nombre}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Partida</label>
          <select name="partida_id" value={nuevoVideo.partida_id} onChange={handleNuevoVideoChange} required>
            <option value="">Selecciona una partida</option>
            {partidas.map(p => <option key={p.id} value={p.id}>{`#${p.id} - ${p.fecha}`}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Año de edición</label>
          <select name="idEdicion" value={nuevoVideo.idEdicion} onChange={handleNuevoVideoChange} required>
            <option value="">Selecciona un año</option>
            {torneos.map(t => <option key={t.idEdicion} value={t.idEdicion}>{t.idEdicion}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Tipo de partida</label>
          <select name="tipo_partida" value={nuevoVideo.tipo_partida} onChange={handleNuevoVideoChange} required>
            <option value="">Selecciona un tipo</option>
            <option value="PVP">PVP</option>
            <option value="TodosContraTodos">Todos Contra Todos</option>
          </select>
        </div>
        <button type="submit" className="profile-button profile-button-primary">Añadir Video</button>
        {mensajeVideo && <p style={{color:'green'}}>{mensajeVideo}</p>}
      </form>
      <h3 className="section-title" style={{marginTop:'2rem'}}>Videos añadidos</h3>
      <div className="historico-video-list">
        {historicoVideos.map(video => (
          <div key={video.id} className="historico-video-item">
            <strong>{video.titulo}</strong> - <a href={video.url} target="_blank" rel="noopener noreferrer">Ver video</a><br/>
            Jugador: {video.jugador_nickname} | Juego: {video.juego_nombre} | Partida: {video.partida_id} | Año: {video.idEdicion} | Tipo: {video.tipo_partida}
          </div>
        ))}
      </div>
    </div>
  );
  
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const gameFileInputRef = useRef(null);
  const logroFileInputRef = useRef(null);
  const comodinFileInputRef = useRef(null);
  const entradaFileInputRef = useRef(null);
  const ruletaFileInputRef = useRef(null);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await axios.get(PROFILE_ROUTES.GET_PROFILE, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        setUser(response.data.data);
        setFormData(response.data.data);
      } catch (error) {
        console.error('Error al obtener perfil', error);
        toast.error(error.response?.data?.error || 'Error al cargar el perfil');
        localStorage.removeItem('token');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token, navigate]);

  useEffect(() => {
    if (user && user.twitch_channel) {
      setTwitchChannel(user.twitch_channel);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
  
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('email', formData.email || '');
      formDataToSend.append('descripcion', formData.descripcion || '');
  
      if (file) {
        formDataToSend.append('foto', file);
      }

      // Obtener los valores actuales de los inputs de contraseña
      const newPasswordInput = document.querySelector('input[name="newPassword"]');
      const confirmPasswordInput = document.querySelector('input[name="confirmPassword"]');
      const newPassword = newPasswordInput ? newPasswordInput.value.trim() : '';
      const confirmPassword = confirmPasswordInput ? confirmPasswordInput.value.trim() : '';

      // Validar y agregar contraseña si se proporcionó
      if (newPassword || confirmPassword) {
        if (!newPassword || !confirmPassword) {
          toast.error('Por favor complete ambos campos de contraseña');
          setIsSaving(false);
          return;
        }
        
        if (newPassword !== confirmPassword) {
          toast.error('Las contraseñas no coinciden');
          setIsSaving(false);
          return;
        }

        if (newPassword.length < 6) {
          toast.error('La contraseña debe tener al menos 6 caracteres');
          setIsSaving(false);
          return;
        }

        formDataToSend.append('newPassword', newPassword);
      }
  
      const response = await axios.put(PROFILE_ROUTES.UPDATE_PROFILE, formDataToSend, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
  
      toast.success('Perfil actualizado correctamente');
      setUser(response.data.data);
      setFormData(response.data.data);
      
      if (file) {
        setFile(null);
        setImagePreview(null);
      }

      // Limpiar contraseñas después de guardar exitosamente
      if (newPassword) {
        setPasswordData({ newPassword: '', confirmPassword: '' });
        if (newPasswordInput) newPasswordInput.value = '';
        if (confirmPasswordInput) confirmPasswordInput.value = '';
        setShowNewPassword(false);
        setShowConfirmPassword(false);
      }
    } catch (error) {
      console.error('Error al guardar:', error);
      toast.error(error.response?.data?.error || 'Error al actualizar perfil');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith('image/')) {
        toast.error('Por favor selecciona una imagen');
        return;
      }

      if (selectedFile.size > 2 * 1024 * 1024) {
        toast.error('La imagen no puede ser mayor a 2MB');
        return;
      }

      setFile(selectedFile);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleGameImageClick = () => {
    gameFileInputRef.current.click();
  };

  const handleGameFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith('image/')) {
        toast.error('Por favor selecciona una imagen');
        return;
      }

      if (selectedFile.size > 2 * 1024 * 1024) {
        toast.error('La imagen no puede ser mayor a 2MB');
        return;
      }

      setGameFile(selectedFile);

      const reader = new FileReader();
      reader.onloadend = () => {
        setGameImagePreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const fetchCategorias = async () => {
    setIsLoadingCategorias(true);
    try {
      const response = await axios.get(CATEGORY_ROUTES.GET_ALL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setCategorias(response.data.data);
      } else {
        toast.error('Error al cargar las categorías');
      }
    } catch (error) {
      console.error('Error al obtener categorías:', error);
      toast.error(error.response?.data?.message || 'Error al cargar las categorías');
    } finally {
      setIsLoadingCategorias(false);
    }
  };

  const handleAddGame = async () => {
    const nombreJuego = gameData.nombre?.trim();
    const categoriaJuego = gameData.categoria;

    if (!nombreJuego || !categoriaJuego) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    if (nombreJuego.length < 3) {
      toast.error('El nombre del juego debe tener al menos 3 caracteres');
      return;
    }

    setIsSavingGame(true);
    try {
      const formData = new FormData();
      formData.append('nombre', nombreJuego);
      formData.append('categoria', categoriaJuego);
      
      // Si hay un archivo nuevo seleccionado
      if (gameFile) {
        formData.append('foto', gameFile);
      } 
      // Si estamos editando y hay una foto previa pero no se seleccionó una nueva
      else if (gameData.id && gameImagePreview) {
        formData.append('foto', gameImagePreview);
      }

      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      };

      let response;
      if (gameData.id) {
        // Actualizar juego existente
        response = await axios.put(GAMES_ROUTES.UPDATE(gameData.id), formData, config);
        toast.success('Juego actualizado correctamente');
      } else {
        // Crear nuevo juego
        response = await axios.post(GAMES_ROUTES.CREATE, formData, config);
        toast.success('Juego agregado correctamente');
      }

      // Limpiar el estado y cerrar el modal
      setShowGameModal(false);
      setGameData({ nombre: '', categoria: '' });
      setGameFile(null);
      setGameImagePreview(null);
      
      // Recargar la lista de juegos
      await fetchJuegos();
    } catch (error) {
      console.error('Error al guardar juego:', error);
      toast.error(error.response?.data?.error || 'Error al guardar el juego');
    } finally {
      setIsSavingGame(false);
    }
  };

  const handleAddUser = async () => {
    const nickname = prompt('Nuevo usuario: nickname');
    const password = prompt('Nuevo usuario: contraseña');

    if (nickname && password) {
      try {
        await axios.post(ADMIN_ROUTES.CREATE_USER, { nickname, password }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success('Usuario creado correctamente');
      } catch (error) {
        console.error('Error creando usuario', error);
        toast.error(error.response?.data?.message || 'Error al crear usuario');
      }
    }
  };

  const handleChangeRole = async () => {
    const nickname = prompt('Ingrese el nickname del usuario');
    const newRole = prompt('Ingrese el nuevo rol');

    if (nickname && newRole !== null) {
      try {
        // Validar que el rol sea un número válido
        const rolNumerico = parseInt(newRole);
        if (isNaN(rolNumerico) || rolNumerico < 0 || rolNumerico > 2) {
          toast.error('Rol inválido');
          return;
        }

        await axios.put(
          ADMIN_ROUTES.UPDATE_USER(nickname.trim()),
          { 
            rol: rolNumerico
          },
          { 
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            } 
          }
        );
        
        toast.success('Rol actualizado correctamente');
      } catch (error) {
        console.error('Error cambiando rol:', error);
        const mensajeError = error.response?.data?.message || error.response?.data?.error || 'Error al cambiar rol';
        toast.error(mensajeError);
      }
    }
  };

  const handleDeleteUser = async () => {
    const nickname = prompt('Nickname del usuario a eliminar');
    if (nickname) {
      try {
        await axios.delete(ADMIN_ROUTES.DELETE_USER(nickname), {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success('Usuario eliminado correctamente');
      } catch (error) {
        console.error('Error eliminando usuario', error);
        toast.error(error.response?.data?.message || 'Error al eliminar usuario');
      }
    }
  };

  const fetchJuegos = async () => {
    setIsLoadingJuegos(true);
    try {
      const response = await axios.get(GAMES_ROUTES.GET_ALL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setJuegos(response.data.data);
      }
    } catch (error) {
      console.error('Error al obtener juegos:', error);
      toast.error('Error al cargar los juegos');
    } finally {
      setIsLoadingJuegos(false);
    }
  };

  const fetchUsuarios = async () => {
    setIsLoadingUsuarios(true);
    try {
      console.log('Obteniendo usuarios...'); // Debug log
      const response = await axios.get(ADMIN_ROUTES.GET_ALL_USERS, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('Respuesta:', response.data); // Debug log
      
      if (response.data.success) {
        setUsuarios(response.data.data);
      } else {
        toast.error('Error al cargar los usuarios');
      }
    } catch (error) {
      console.error('Error al obtener usuarios:', error.response || error);
      toast.error(error.response?.data?.error || 'Error al cargar los usuarios');
    } finally {
      setIsLoadingUsuarios(false);
    }
  };

  const fetchLogros = async () => {
    setIsLoadingLogros(true);
    try {
      console.log('Obteniendo logros...'); // Debug log
      const response = await axios.get(LOGROS_ROUTES.GET_ALL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Respuesta de logros:', response.data); // Debug log
      if (response.data.success) {
        setLogros(response.data.data);
        console.log('Logros cargados:', response.data.data); // Debug log
      }
    } catch (error) {
      console.error('Error al obtener logros:', error);
      toast.error('Error al cargar los logros');
    } finally {
      setIsLoadingLogros(false);
    }
  };

  const fetchComodines = async () => {
    setIsLoadingComodines(true);
    try {
      console.log('Obteniendo comodines...'); // Debug log
      const response = await axios.get(COMODINES_ROUTES.GET_ALL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Respuesta completa de comodines:', response); // Debug log
      console.log('Respuesta de comodines:', response.data); // Debug log
      if (response.data.success) {
        console.log('Comodines antes de setState:', response.data.data); // Debug log
        setComodines(response.data.data);
        console.log('Comodines cargados:', response.data.data); // Debug log
      }
    } catch (error) {
      console.error('Error al obtener comodines:', error);
      toast.error('Error al cargar los comodines');
    } finally {
      setIsLoadingComodines(false);
    }
  };

  useEffect(() => {
    if (activeSection === 'juegos') {
      fetchJuegos();
    }
    if (activeSection === 'usuarios') {
      fetchUsuarios();
    }
    if (activeSection === 'logros') {
      fetchLogros();
    }
    if (activeSection === 'comodines') {
      fetchComodines();
    }
    if (activeSection === 'torneo') {
      fetchTorneos();
    }
    if (activeSection === 'puntos') {
      fetchPuntosExistentes();
    }
    if (activeSection === 'partidas') {
      fetchUltimaEdicion();
      fetchPartidas();
    }
    if (activeSection === 'entradas') {
      fetchEntradas();
      fetchConfiguracionInicio();
      fetchJugadoresInicio();
    }
    if (activeSection === 'ruleta') {
      fetchRuletaItems();
      fetchConfiguracionRuleta();
    }
    if (activeSection === 'usuarios') {
      fetchUsuarioLogros();
      fetchUsuarioComodines();
    }
    if (activeSection === 'historico_videos') {
      axios.get('/api/videos-historicos')
        .then(res => setHistoricoVideos(res.data.data))
        .catch(() => setHistoricoVideos([]));
      axios.get('/api/usuarios')
        .then(res => setUsuarios(res.data.data))
        .catch(() => setUsuarios([]));
      axios.get('/api/juegos')
        .then(res => setJuegos(res.data.data))
        .catch(() => setJuegos([]));
      axios.get('/api/partidas')
        .then(res => setPartidas(res.data.data))
        .catch(() => setPartidas([]));
      axios.get('/api/edicion')
        .then(res => setTorneos(res.data.data))
        .catch(() => setTorneos([]));
    }
  }, [activeSection]);

  // Cargar jugadores disponibles cuando se abre el modal de jugadores
  useEffect(() => {
    if (showJugadoresModal && jugadoresDisponibles.length === 0) {
      fetchJugadoresDisponibles();
    }
  }, [showJugadoresModal]);

  // Cargar juegos cuando se abre el modal de juegos
  useEffect(() => {
    if (showJuegosModal && juegos.length === 0) {
      fetchJuegos();
    }
  }, [showJuegosModal]);

  // Cargar juegos de la edición cuando se abre el modal de crear partida
  useEffect(() => {
    if (showCrearPartidaModal && edicionSeleccionada && juegosEdicion.length === 0) {
      fetchJuegosByEdicion(edicionSeleccionada);
    }
  }, [showCrearPartidaModal, edicionSeleccionada]);

  const handleDeleteGame = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este juego?')) {
      try {
        await axios.delete(GAMES_ROUTES.DELETE(id), {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Juego eliminado correctamente');
        await fetchJuegos();
      } catch (error) {
        console.error('Error al eliminar juego:', error);
        toast.error(error.response?.data?.error || 'Error al eliminar el juego');
      }
    }
  };

  const handleToggleGameVisibility = async (id, mostrar) => {
    try {
      await axios.put(GAMES_ROUTES.TOGGLE_VISIBILITY(id), 
        { mostrar_en_inicio: mostrar },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Juego ${mostrar ? 'mostrado' : 'ocultado'} en el inicio`);
      await fetchJuegos();
    } catch (error) {
      console.error('Error al cambiar visibilidad del juego:', error);
      toast.error('Error al cambiar la visibilidad del juego');
    }
  };

  const handleEditGame = (juego) => {
    setGameData({
      id: juego.id,
      nombre: juego.nombre,
      categoria: juego.categoria_id
    });
    setGameImagePreview(juego.foto);
    setShowGameModal(true);
  };

  // Cargar categorías al abrir el modal
  useEffect(() => {
    if (showGameModal && categorias.length === 0) {
      fetchCategorias();
    }
  }, [showGameModal]);

  // Cargar comodines cuando se abre el modal de ruleta
  useEffect(() => {
    if (showRuletaModal && comodines.length === 0) {
      fetchComodines();
    }
  }, [showRuletaModal]);

  const LogrosContent = () => {
    const handleDeleteLogro = async (idLogros) => {
      console.log('Intentando eliminar logro con ID:', idLogros); // Debug log
      
      if (!idLogros) {
        toast.error('ID del logro no válido');
        return;
      }

      if (!window.confirm('¿Estás seguro de que deseas eliminar este logro?')) {
        return;
      }

      try {
        console.log('Enviando DELETE a:', LOGROS_ROUTES.DELETE(idLogros)); // Debug log
        const response = await axios.delete(LOGROS_ROUTES.DELETE(idLogros), {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data.success) {
          setLogros(logros.filter(logro => logro.idlogros !== idLogros));
          toast.success('Logro eliminado exitosamente');
        } else {
          toast.error(response.data.message || 'Error al eliminar el logro');
        }
      } catch (error) {
        console.error('Error al eliminar logro:', error);
        const errorMessage = error.response?.data?.error || 
                           error.response?.data?.message || 
                           'Error al eliminar el logro';
        toast.error(errorMessage);
      }
    };

    return (
      <div className="content-section">
        <div className="games-header">
          <h2>Logros</h2>
          <button className="add-game-button" onClick={() => {
            setLogroData({ idlogros: null, nombre: '', descripcion: '' });
            setLogroFile(null);
            setLogroImagePreview(null);
            setShowLogroModal(true);
          }}>
            <FaMedal /> Agregar Logro
          </button>
        </div>
        <div className="games-table-container">
          {isLoadingLogros ? (
            <div className="loading-spinner">
              <FaSpinner className="spinner-icon" />
            </div>
          ) : logros.length === 0 ? (
            <div className="no-data">No hay logros registrados</div>
          ) : (
            <table className="games-table">
              <thead>
                <tr>
                  <th>Imagen</th>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {logros.map(logro => {
                  console.log('Renderizando logro:', logro); // Debug log
                  console.log('Campos del logro:', Object.keys(logro)); // Debug log
                  console.log('ID del logro:', logro.idlogros); // Debug log - corregido a minúsculas
                  return (
                    <tr key={logro.idlogros}>
                      <td>
                        <img 
                          src={logro.foto || '/default-achievement.png'} 
                          alt={logro.nombre}
                          className="game-image"
                        />
                      </td>
                      <td>{logro.nombre}</td>
                      <td>{logro.descripcion}</td>
                      <td>
                        <button 
                          className="edit-button"
                          onClick={() => {
                            setLogroData({
                              idlogros: logro.idlogros, // Mantener idLogros para el estado
                              nombre: logro.nombre,
                              descripcion: logro.descripcion
                            });
                            setLogroImagePreview(logro.foto);
                            setShowLogroModal(true);
                          }}
                        >
                          <FaPen />
                        </button>
                        <button 
                          className="delete-button"
                          onClick={() => {
                            console.log('Click en eliminar logro:', logro.idlogros); // Debug log - corregido
                            handleDeleteLogro(logro.idlogros);
                          }}
                        >
                          <FaTimes />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    );
  };

  const ComodinesContent = () => {
    const handleDeleteComodin = async (id) => {
      console.log('Intentando eliminar comodín con ID:', id); // Debug log
      
      if (!id) {
        toast.error('ID del comodín no válido');
        return;
      }

      if (!window.confirm('¿Estás seguro de que deseas eliminar este comodín?')) {
        return;
      }

      try {
        console.log('Enviando DELETE a:', COMODINES_ROUTES.DELETE(id)); // Debug log
        const response = await axios.delete(COMODINES_ROUTES.DELETE(id), {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.data.success) {
          setComodines(comodines.filter(comodin => comodin.idcomodines !== id));
          toast.success('Comodín eliminado correctamente');
        } else {
          toast.error(response.data.message || 'Error al eliminar el comodín');
        }
      } catch (error) {
        console.error('Error al eliminar comodín:', error);
        const errorMessage = error.response?.data?.error || 
                           error.response?.data?.message || 
                           'Error al eliminar el comodín';
        toast.error(errorMessage);
      }
    };

    return (
      <div className="content-section">
        <div className="games-header">
          <h2 className="games-title">Gestión de Comodines</h2>
          <button
            onClick={() => {
              setComodinData({ idcomodines: null, nombre: '', descripcion: '' });
              setComodinFile(null);
              setComodinImagePreview(null);
              setShowComodinModal(true);
            }}
            className="add-game-button"
          >
            <FaStar /> Agregar Comodín
          </button>
        </div>

        {isLoadingComodines ? (
          <div className="loading-spinner">
            <FaSpinner className="loading-spinner-icon" />
          </div>
        ) : comodines.length === 0 ? (
          <div className="no-data">No hay comodines registrados</div>
        ) : (
          <div className="games-table-container">
            <table className="games-table">
              <thead>
                <tr>
                  <th>Imagen</th>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {comodines.map((comodin) => {
                  console.log('Renderizando comodín:', comodin); // Debug log
                  console.log('Campos del comodín:', Object.keys(comodin)); // Debug log
                  console.log('ID del comodín:', comodin.idcomodines); // Debug log
                  return (
                    <tr key={comodin.idcomodines}>
                      <td>
                        <img
                          src={comodin.foto || '/default-powerup.png'}
                          alt={comodin.nombre}
                          className="game-image"
                        />
                      </td>
                      <td>{comodin.nombre}</td>
                      <td>{comodin.descripcion}</td>
                      <td>
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => {
                              setComodinData(comodin);
                              setComodinImagePreview(comodin.foto);
                              setShowComodinModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-800 transition-colors p-2"
                            title="Editar comodín"
                          >
                            <FaPen />
                          </button>
                          <button
                            onClick={() => {
                              console.log('Click en eliminar comodín:', comodin.idcomodines); // Debug log
                              handleDeleteComodin(comodin.idcomodines);
                            }}
                            className="text-red-600 hover:text-red-800 transition-colors p-2"
                            title="Eliminar comodín"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  if (loading) return <><Navbar /><div className="text-center py-8">Cargando perfil...</div><Footer /></>;
  if (!user) return <><Navbar /><div className="text-center py-8">No se encontró el usuario</div><Footer /></>;

  const ProfileContent = () => (
    <div className="space-y-6">
      <div className="profile-image-container">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/jpeg,image/png,image/gif"
          style={{ display: 'none' }}
        />
        <img
          src={imagePreview || formData.foto || '/default-profile.png'}
          alt="Foto de perfil"
          className="profile-image"
          onClick={handleImageClick}
          style={{ cursor: 'pointer' }}
          title="Haz clic para cambiar la foto"
        />
      </div>

      <div className="profile-inputs-container">
        <div className="profile-input">
          <input
            type="text"
            name="nickname"
            value={formData.nickname || ''}
            disabled
            className="bg-gray-100"
            placeholder="Nickname"
          />
          <FaUser className="profile-input-icon" />
        </div>

        <div className="profile-input">
          <input
            type="email"
            name="email"
            value={formData.email || ''}
            onChange={handleChange}
            placeholder="Email"
            autoComplete="email"
          />
          <FaEnvelope className="profile-input-icon" />
        </div>

        <div className="profile-input">
          <textarea
            name="descripcion"
            defaultValue={formData.descripcion || ''}
            onBlur={(e) => {
              setFormData(prev => ({
                ...prev,
                descripcion: e.target.value
              }));
            }}
            rows="4"
            placeholder="Describe tu perfil..."
          ></textarea>
          <FaPen className="profile-input-icon" style={{ top: '1.5rem' }} />
        </div>

        <div className="profile-input">
          <div className="password-container">
            <input
              type={showNewPassword ? "text" : "password"}
              name="newPassword"
              defaultValue={passwordData.newPassword}
              onBlur={(e) => {
                setPasswordData(prev => ({
                  ...prev,
                  newPassword: e.target.value
                }));
              }}
              placeholder="Nueva contraseña"
              autoComplete="new-password"
            />
            <button
              type="button"
              className="eye-button"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            <FaLock className="profile-input-icon" />
          </div>
        </div>

        <div className="profile-input">
          <div className="password-container">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              defaultValue={passwordData.confirmPassword}
              onBlur={(e) => {
                setPasswordData(prev => ({
                  ...prev,
                  confirmPassword: e.target.value
                }));
              }}
              placeholder="Confirmar nueva contraseña"
              autoComplete="new-password"
            />
            <button
              type="button"
              className="eye-button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            <FaLock className="profile-input-icon" />
          </div>
        </div>

        <div className="profile-input">
          <label>Canal de Twitch:</label>
          <textarea
            name="twitch_channel"
            defaultValue={formData.twitch_channel || ''}
            onBlur={(e) => {
              setFormData(prev => ({
                ...prev,
                twitch_channel: e.target.value
              }));
            }}
            rows="1"
            placeholder="Solo el nombre, ej: pepito_gamer"
            style={{resize: 'none'}}
          ></textarea>
          <button type="button" onClick={guardarTwitch} style={{marginLeft:'8px'}}>Guardar canal</button>
          {mensajeTwitch && <p style={{color:'green'}}>{mensajeTwitch}</p>}
        </div>
      </div>

      <div className="profile-buttons-container">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`profile-button profile-button-primary ${
            isSaving ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isSaving ? (
            <>
              <FaSpinner className="animate-spin" />
              Guardando...
            </>
          ) : (
            'Guardar Cambios'
          )}
        </button>

        <button
          onClick={handleLogout}
          className="profile-button profile-button-danger"
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
  );

  const JuegosContent = () => (
    <div className="content-section">
      <div className="games-header">
        <h2 className="games-title">Gestión de Juegos</h2>
        <button
          onClick={() => setShowGameModal(true)}
          className="add-game-button"
        >
          <FaGamepad /> Agregar Juego
        </button>
      </div>

      {isLoadingJuegos ? (
        <div className="loading-spinner">
          <FaSpinner className="loading-spinner-icon" />
        </div>
      ) : (
        <div className="games-table-container">
          <table className="games-table">
            <thead>
              <tr>
                <th>Imagen</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {juegos.map((juego) => (
                <tr key={juego.id}>
                  <td>
                    <img
                      src={juego.foto || '/default-game.png'}
                      alt={juego.nombre}
                      className="game-image"
                    />
                  </td>
                  <td>{juego.nombre}</td>
                  <td>{juego.categoria_nombre}</td>
                  <td>
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => handleEditGame(juego)}
                        className="text-blue-600 hover:text-blue-800 transition-colors p-2"
                        title="Editar juego"
                      >
                        <FaPen />
                      </button>
                      <button
                        onClick={() => handleToggleGameVisibility(juego.id, !juego.mostrar_en_inicio)}
                        className={`transition-colors p-2 ${
                          juego.mostrar_en_inicio 
                            ? 'text-green-600 hover:text-green-800' 
                            : 'text-gray-400 hover:text-gray-600'
                        }`}
                        title={juego.mostrar_en_inicio ? 'Ocultar del inicio' : 'Mostrar en inicio'}
                      >
                        {juego.mostrar_en_inicio ? <FaEye /> : <EyeOff size={16} />}
                      </button>
                      <button
                        onClick={() => handleDeleteGame(juego.id)}
                        className="text-red-600 hover:text-red-800 transition-colors p-2"
                        title="Eliminar juego"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const GameModal = () => (
    <div className="game-modal">
      <div className="game-modal-content">
        <div className="game-modal-header">
          <h3 className="game-modal-title">
            {gameData.id ? 'Editar Juego' : 'Agregar Nuevo Juego'}
          </h3>
          <button
            onClick={() => {
              setShowGameModal(false);
              setGameData({ nombre: '', categoria: '' });
              setGameFile(null);
              setGameImagePreview(null);
            }}
            className="game-modal-close"
          >
            <FaTimes />
          </button>
        </div>

        <div className="game-form-container">
          <div className="game-form-row">
            <div className="game-form-image-section">
              <label className="game-form-label">Imagen del juego</label>
              <div 
                className="game-image-preview cursor-pointer" 
                onClick={handleGameImageClick}
                style={{ 
                  height: '200px', 
                  position: 'relative', 
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'end',
                  borderRadius: '0.5rem',
                  border: '2px dashed #e5e7eb'
                }}
              >
                <input
                  type="file"
                  ref={gameFileInputRef}
                  onChange={handleGameFileChange}
                  accept="image/jpeg,image/png,image/gif"
                  className="hidden"
                />
                {gameImagePreview ? (
                  <img
                    src={gameImagePreview}
                    alt="Vista previa"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain'
                    }}
                  />
                ) : (
                  <div className="upload-placeholder">
                    <FaCamera className="text-gray-400 text-3xl mb-2" />
                    <span className="text-sm text-gray-500 text-center px-2">
                      {gameData.id ? 'Cambiar imagen' : 'Subir imagen'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="game-form-fields-section">
              <div className="game-form-group">
                <label className="game-form-label">Nombre del juego</label>
                <input
                  type="text"
                  className="game-form-input"
                  placeholder="Ej: Super Mario Bros"
                  defaultValue={gameData.nombre || ''}
                  onBlur={(e) => {
                    setGameData(prev => ({
                      ...prev,
                      nombre: e.target.value
                    }));
                  }}
                />
              </div>

              <div className="game-form-group">
                <label className="game-form-label">Categoría</label>
                <select
                  className="game-form-select"
                  value={gameData.categoria || ''}
                  onChange={(e) => setGameData(prev => ({ ...prev, categoria: e.target.value }))}
                >
                  <option value="">Selecciona una categoría</option>
                  {isLoadingCategorias ? (
                    <option disabled>Cargando categorías...</option>
                  ) : (
                    categorias.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.nombre}
                      </option>
                    ))
                  )}
                </select>
              </div>
            </div>
          </div>

          <button
            onClick={handleAddGame}
            disabled={isSavingGame}
            className="game-form-submit"
          >
            {isSavingGame ? (
              <>
                <FaSpinner className="spinner" />
                <span>Guardando...</span>
              </>
            ) : (
              <>
                <FaCheck />
                <span>{gameData.id ? 'Guardar Cambios' : 'Crear Juego'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  const AdminMenu = () => (
    <div className="admin-menu">
      <h2 className="admin-menu-title">Panel de Admin</h2>
      <nav className="admin-menu-buttons">
        <button
          onClick={() => setActiveSection('perfil')}
          className={`admin-menu-button ${
            activeSection === 'perfil' ? 'admin-menu-button-active' : ''
          }`}
        >
          <FaUser className="w-4 h-4 mr-2" />
          Mi Perfil
        </button>
        <button
          onClick={() => setActiveSection('juegos')}
          className={`admin-menu-button ${
            activeSection === 'juegos' ? 'admin-menu-button-active' : ''
          }`}
        >
          <FaGamepad className="w-4 h-4 mr-2" />
          Juegos
        </button>
        <button
          onClick={() => setActiveSection('logros')}
          className={`admin-menu-button ${
            activeSection === 'logros' ? 'admin-menu-button-active' : ''
          }`}
        >
          <FaMedal className="w-4 h-4 mr-2" />
          Logros
        </button>
        <button
          onClick={() => setActiveSection('comodines')}
          className={`admin-menu-button ${
            activeSection === 'comodines' ? 'admin-menu-button-active' : ''
          }`}
        >
          <FaStar className="w-4 h-4 mr-2" />
          Comodines
        </button>
        <button
          onClick={() => setActiveSection('usuarios')}
          className={`admin-menu-button ${
            activeSection === 'usuarios' ? 'admin-menu-button-active' : ''
          }`}
        >
          <FaUsers className="w-4 h-4 mr-2" />
          Usuarios
        </button>
        <button
          onClick={() => setActiveSection('puntos')}
          className={`admin-menu-button ${
            activeSection === 'puntos' ? 'admin-menu-button-active' : ''
          }`}
        >
          <FaStar className="w-4 h-4 mr-2" />
          Puntos por Partida
        </button>
        <button
          onClick={() => setActiveSection('partidas')}
          className={`admin-menu-button ${
            activeSection === 'partidas' ? 'admin-menu-button-active' : ''
          }`}
        >
          <FaGamepad className="w-4 h-4 mr-2" />
          Partidas
        </button>
        <button
          onClick={() => setActiveSection('entradas')}
          className={`admin-menu-button ${
            activeSection === 'entradas' ? 'admin-menu-button-active' : ''
          }`}
        >
          <FaBook className="w-4 h-4 mr-2" />
          Entradas
        </button>
        <button
          onClick={() => setActiveSection('ruleta')}
          className={`admin-menu-button ${
            activeSection === 'ruleta' ? 'admin-menu-button-active' : ''
          }`}
        >
          <FaStar className="w-4 h-4 mr-2" />
          Ruleta
        </button>
        <button
          onClick={() => setActiveSection('torneo')}
          className={`admin-menu-button ${
            activeSection === 'torneo' ? 'admin-menu-button-active' : ''
          }`}
        >
          <FaTrophy className="w-4 h-4 mr-2" />
          Torneos
        </button>
        <button
          onClick={() => setActiveSection('historico_videos')}
          className={`admin-menu-button ${
            activeSection === 'historico_videos' ? 'admin-menu-button-active' : ''
          }`}
        >
          <FaVideo className="w-4 h-4 mr-2" />
          Videos Histórico
        </button>
      </nav>
    </div>
  );

  const UsuariosContent = () => {
    const handleChangeRoleForUser = async (nickname) => {
      const newRole = prompt('Ingrese el nuevo rol (0: Admin, 1: Usuario, 2: Jugador)');
      if (newRole !== null) {
        try {
          const rolNumerico = parseInt(newRole);
          if (isNaN(rolNumerico) || rolNumerico < 0 || rolNumerico > 2) {
            toast.error('Rol inválido');
            return;
          }

          await axios.put(
            ADMIN_ROUTES.UPDATE_USER(nickname),
            { rol: rolNumerico },
            { 
              headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              } 
            }
          );
          
          toast.success('Rol actualizado correctamente');
          fetchUsuarios(); // Recargar la lista
        } catch (error) {
          console.error('Error cambiando rol:', error);
          toast.error(error.response?.data?.message || 'Error al cambiar rol');
        }
      }
    };

    const handleDeleteUserFromTable = async (nickname) => {
      if (window.confirm(`¿Estás seguro de que quieres eliminar al usuario ${nickname}?`)) {
        try {
          await axios.delete(ADMIN_ROUTES.DELETE_USER(nickname), {
            headers: { Authorization: `Bearer ${token}` }
          });
          toast.success('Usuario eliminado correctamente');
          fetchUsuarios(); // Recargar la lista
        } catch (error) {
          console.error('Error eliminando usuario:', error);
          toast.error(error.response?.data?.message || 'Error al eliminar usuario');
        }
      }
    };

    return (
      <div className="content-section">
        <div className="games-header">
          <h2 className="games-title">Gestión de Usuarios</h2>
          <button
            className="add-game-button"
            onClick={() => setShowAsignarLogroModal(true)}
          >
            <FaPlus /> Asignar Logro
          </button>
        </div>

        {/* Sección de Logros de Usuarios */}
        <div className="p-4 mb-4 bg-gray-100 rounded">
          <h3 className="text-lg font-semibold mb-3">Logros Asignados a Usuarios</h3>
          {isLoadingUsuarioLogros ? (
            <div className="loading-spinner">
              <FaSpinner className="spinner-icon" />
              <span>Cargando logros de usuarios...</span>
            </div>
          ) : usuarioLogros.length === 0 ? (
            <p className="text-gray-500">No hay logros asignados a usuarios</p>
          ) : (
            <div className="games-table-container">
              <table className="games-table">
                <thead>
                  <tr>
                    <th>Usuario</th>
                    <th>Logro</th>
                    <th>Imagen</th>
                    <th>Fecha Obtención</th>
                    <th>Asignado Por</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarioLogros.map((logroUsuario) => (
                    <tr key={logroUsuario.id}>
                      <td>{logroUsuario.usuario_nickname}</td>
                      <td>{logroUsuario.logro_nombre}</td>
                      <td>
                        {logroUsuario.logro_foto && (
                          <img
                            src={logroUsuario.logro_foto}
                            alt={logroUsuario.logro_nombre}
                            className="game-image"
                            style={{ width: '50px', height: '50px' }}
                          />
                        )}
                      </td>
                      <td>{new Date(logroUsuario.fecha_obtencion).toLocaleDateString()}</td>
                      <td>{logroUsuario.asignado_por || 'Sistema'}</td>
                      <td>
                        <button
                          onClick={() => handleEliminarLogroUsuario(logroUsuario.id)}
                          className="text-red-600 hover:text-red-800 transition-colors p-2"
                          title="Eliminar logro"
                        >
                          <FaTimes />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Sección de Comodines de Usuarios */}
        <div className="p-4 mb-4 bg-gray-100 rounded">
          <h3 className="text-lg font-semibold mb-3">Comodines Obtenidos por Usuarios</h3>
          {isLoadingUsuarioComodines ? (
            <div className="loading-spinner">
              <FaSpinner className="spinner-icon" />
              <span>Cargando comodines de usuarios...</span>
            </div>
          ) : usuarioComodines.length === 0 ? (
            <p className="text-gray-500">No hay comodines obtenidos por usuarios</p>
          ) : (
            <div className="games-table-container">
              <table className="games-table">
                <thead>
                  <tr>
                    <th>Usuario</th>
                    <th>Comodín</th>
                    <th>Imagen</th>
                    <th>Fecha Obtención</th>
                    <th>Obtenido Por</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarioComodines.map((comodinUsuario) => (
                    <tr key={comodinUsuario.id}>
                      <td>{comodinUsuario.usuario_nickname}</td>
                      <td>{comodinUsuario.comodin_nombre}</td>
                      <td>
                        {comodinUsuario.comodin_foto && (
                          <img
                            src={comodinUsuario.comodin_foto}
                            alt={comodinUsuario.comodin_nombre}
                            className="game-image"
                            style={{ width: '50px', height: '50px' }}
                          />
                        )}
                      </td>
                      <td>{new Date(comodinUsuario.fecha_obtencion).toLocaleDateString()}</td>
                      <td>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                          comodinUsuario.obtenido_por_ruleta 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {comodinUsuario.obtenido_por_ruleta ? 'Ruleta' : 'Asignación'}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => handleEliminarComodinUsuario(comodinUsuario.id)}
                          className="text-red-600 hover:text-red-800 transition-colors p-2"
                          title="Eliminar comodín"
                        >
                          <FaTimes />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Tabla de usuarios */}
        <div className="games-table-container">
          <h3 className="text-lg font-semibold mb-3">Lista de Usuarios</h3>
          {isLoadingUsuarios ? (
            <div className="loading-spinner">
              <FaSpinner className="loading-spinner-icon" />
            </div>
          ) : (
            <table className="games-table">
              <thead>
                <tr>
                  <th>Nickname</th>
                  <th>Email</th>
                  <th>Rol Actual</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((usuario) => (
                  <tr key={usuario.nickname}>
                    <td>{usuario.nickname}</td>
                    <td>{usuario.email}</td>
                    <td>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                        usuario.rol === 0 
                          ? 'bg-purple-100 text-purple-800'
                          : usuario.rol === 1
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {usuario.rol === 0 ? 'Admin' : usuario.rol === 1 ? 'Usuario' : 'Jugador'}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handleChangeRoleForUser(usuario.nickname)}
                          className="text-yellow-600 hover:text-yellow-800 transition-colors p-2"
                          title="Cambiar rol"
                        >
                          <FaPen />
                        </button>
                        <button
                          onClick={() => handleDeleteUserFromTable(usuario.nickname)}
                          className="text-red-600 hover:text-red-800 transition-colors p-2"
                          title="Eliminar usuario"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Modal para asignar logros */}
        {showAsignarLogroModal && (
          <div className="game-modal">
            <div className="game-modal-content">
              <div className="game-modal-header">
                <h3 className="game-modal-title">Asignar Logro a Usuario</h3>
                <button
                  onClick={() => setShowAsignarLogroModal(false)}
                  className="game-modal-close"
                >
                  <FaTimes />
                </button>
              </div>
              <div className="game-form-container">
                <div className="game-form-group">
                  <label className="game-form-label">Seleccionar Usuario</label>
                  <select
                    className="game-form-select"
                    value={logroAsignacionData.usuario_nickname}
                    onChange={e => setLogroAsignacionData(prev => ({ ...prev, usuario_nickname: e.target.value }))}
                  >
                    <option value="">Selecciona un usuario</option>
                    {usuarios.map(usuario => (
                      <option key={usuario.nickname} value={usuario.nickname}>
                        {usuario.nickname} ({usuario.email})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="game-form-group">
                  <label className="game-form-label">Seleccionar Logro</label>
                  <select
                    className="game-form-select"
                    value={logroAsignacionData.logro_id || ''}
                    onChange={e => setLogroAsignacionData(prev => ({ ...prev, logro_id: e.target.value }))}
                  >
                    <option value="">Selecciona un logro</option>
                    {logros.map(logro => (
                      <option key={logro.idlogros} value={logro.idlogros}>
                        {logro.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="game-form-actions" style={{display:'flex',gap:'1rem'}}>
                  <button
                    onClick={() => setShowAsignarLogroModal(false)}
                    className="game-form-cancel"
                    type="button"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleAsignarLogro}
                    disabled={isSavingLogroAsignacion}
                    className="game-form-submit"
                    type="button"
                  >
                    {isSavingLogroAsignacion ? (
                      <>
                        <FaSpinner className="spinner" />
                        <span>Asignando...</span>
                      </>
                    ) : (
                      <>
                        <FaCheck />
                        <span>Asignar Logro</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const LogroModal = () => {
    const handleLogroImageClick = () => {
      logroFileInputRef.current.click();
    };

    const handleLogroFileChange = (e) => {
      const selectedFile = e.target.files[0];
      if (selectedFile) {
        if (!selectedFile.type.startsWith('image/')) {
          toast.error('Por favor selecciona una imagen');
          return;
        }

        if (selectedFile.size > 2 * 1024 * 1024) {
          toast.error('La imagen no puede ser mayor a 2MB');
          return;
        }

        setLogroFile(selectedFile);

        const reader = new FileReader();
        reader.onloadend = () => {
          setLogroImagePreview(reader.result);
        };
        reader.readAsDataURL(selectedFile);
      }
    };

    const handleAddLogro = async () => {
      const nombreLogro = logroData.nombre?.trim();
      const descripcionLogro = logroData.descripcion?.trim();

      if (!nombreLogro) {
        toast.error('Por favor ingresa un nombre');
        return;
      }

      setIsSavingLogro(true);
      try {
        const formData = new FormData();
        formData.append('nombre', nombreLogro);
        formData.append('descripcion', descripcionLogro);
        
        // Solo agregar foto si hay un archivo nuevo seleccionado
        if (logroFile) {
          formData.append('foto', logroFile);
        }

        const config = {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        };

        let response;
        if (logroData.idlogros) {
          response = await axios.put(LOGROS_ROUTES.UPDATE(logroData.idlogros), formData, config);
          toast.success('Logro actualizado correctamente');
        } else {
          response = await axios.post(LOGROS_ROUTES.CREATE, formData, config);
          toast.success('Logro agregado correctamente');
        }

        setShowLogroModal(false);
        setLogroData({ idlogros: null, nombre: '', descripcion: '' });
        setLogroFile(null);
        setLogroImagePreview(null);
        
        await fetchLogros();
      } catch (error) {
        console.error('Error al guardar logro:', error);
        toast.error(error.response?.data?.error || 'Error al guardar el logro');
      } finally {
        setIsSavingLogro(false);
      }
    };

    return (
      <div className="game-modal">
        <div className="game-modal-content">
          <div className="game-modal-header">
            <h3 className="game-modal-title">
              {logroData.idlogros ? 'Editar Logro' : 'Agregar Nuevo Logro'}
            </h3>
            <button
              onClick={() => {
                setShowLogroModal(false);
                setLogroData({ idlogros: null, nombre: '', descripcion: '' });
                setLogroFile(null);
                setLogroImagePreview(null);
              }}
              className="game-modal-close"
            >
              <FaTimes />
            </button>
          </div>

          <div className="game-form-container">
            <div className="game-form-row">
              <div className="game-form-image-section">
                <label className="game-form-label">Imagen del logro</label>
                <div 
                  className="game-image-preview cursor-pointer" 
                  onClick={handleLogroImageClick}
                  style={{ 
                    height: '200px', 
                    position: 'relative', 
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'end',
                    borderRadius: '0.5rem',
                    border: '2px dashed #e5e7eb'
                  }}
                >
                  <input
                    type="file"
                    ref={logroFileInputRef}
                    onChange={handleLogroFileChange}
                    accept="image/jpeg,image/png,image/gif"
                    className="hidden"
                  />
                  {logroImagePreview ? (
                    <img
                      src={logroImagePreview}
                      alt="Vista previa"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain'
                      }}
                    />
                  ) : (
                    <div className="upload-placeholder">
                      <FaCamera className="text-gray-400 text-3xl mb-2" />
                      <span className="text-sm text-gray-500 text-center px-2">
                        {logroData.idlogros ? 'Cambiar imagen' : 'Subir imagen'}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="game-form-fields-section">
                <div className="game-form-group">
                  <label className="game-form-label">Nombre del logro</label>
                  <input
                    type="text"
                    className="game-form-input"
                    placeholder="Ej: Primer Victoria"
                    defaultValue={logroData.nombre || ''}
                    onBlur={(e) => {
                      setLogroData(prev => ({
                        ...prev,
                        nombre: e.target.value
                      }));
                    }}
                  />
                </div>

                <div className="game-form-group">
                  <label className="game-form-label">Descripción</label>
                  <textarea
                    className="game-form-input"
                    placeholder="Describe el logro..."
                    defaultValue={logroData.descripcion || ''}
                    onBlur={(e) => {
                      setLogroData(prev => ({
                        ...prev,
                        descripcion: e.target.value
                      }));
                    }}
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleAddLogro}
              disabled={isSavingLogro}
              className="game-form-submit"
            >
              {isSavingLogro ? (
                <>
                  <FaSpinner className="spinner" />
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <FaCheck />
                  <span>{logroData.idlogros ? 'Guardar Cambios' : 'Crear Logro'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const ComodinModal = () => {
    const handleComodinImageClick = () => {
      comodinFileInputRef.current.click();
    };

    const handleComodinFileChange = (e) => {
      const selectedFile = e.target.files[0];
      if (selectedFile) {
        if (!selectedFile.type.startsWith('image/')) {
          toast.error('Por favor selecciona una imagen');
          return;
        }

        if (selectedFile.size > 2 * 1024 * 1024) {
          toast.error('La imagen no puede ser mayor a 2MB');
          return;
        }

        setComodinFile(selectedFile);

        const reader = new FileReader();
        reader.onloadend = () => {
          setComodinImagePreview(reader.result);
        };
        reader.readAsDataURL(selectedFile);
      }
    };

    const handleAddComodin = async () => {
      const nombreComodin = comodinData.nombre?.trim();
      const descripcionComodin = comodinData.descripcion?.trim();

      if (!nombreComodin) {
        toast.error('Por favor ingresa un nombre');
        return;
      }

      setIsSavingComodin(true);
      try {
        const formData = new FormData();
        formData.append('nombre', nombreComodin);
        formData.append('descripcion', descripcionComodin);
        
        // Solo agregar foto si hay un archivo nuevo seleccionado
        if (comodinFile) {
          formData.append('foto', comodinFile);
        }

        const config = {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        };

        let response;
        if (comodinData.idcomodines) {
          response = await axios.put(COMODINES_ROUTES.UPDATE(comodinData.idcomodines), formData, config);
          toast.success('Comodín actualizado correctamente');
        } else {
          response = await axios.post(COMODINES_ROUTES.CREATE, formData, config);
          toast.success('Comodín agregado correctamente');
        }

        setShowComodinModal(false);
        setComodinData({ idcomodines: null, nombre: '', descripcion: '' });
        setComodinFile(null);
        setComodinImagePreview(null);
        
        await fetchComodines();
      } catch (error) {
        console.error('Error al guardar comodín:', error);
        toast.error(error.response?.data?.error || 'Error al guardar el comodín');
      } finally {
        setIsSavingComodin(false);
      }
    };

    return (
      <div className="game-modal">
        <div className="game-modal-content">
          <div className="game-modal-header">
            <h3 className="game-modal-title">
              {comodinData.idcomodines ? 'Editar Comodín' : 'Agregar Nuevo Comodín'}
            </h3>
            <button
              onClick={() => {
                setShowComodinModal(false);
                setComodinData({ idcomodines: null, nombre: '', descripcion: '' });
                setComodinFile(null);
                setComodinImagePreview(null);
              }}
              className="game-modal-close"
            >
              <FaTimes />
            </button>
          </div>

          <div className="game-form-container">
            <div className="game-form-row">
              <div className="game-form-image-section">
                <label className="game-form-label">Imagen del comodín</label>
                <div 
                  className="game-image-preview cursor-pointer" 
                  onClick={handleComodinImageClick}
                  style={{ 
                    height: '200px', 
                    position: 'relative', 
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'end',
                    borderRadius: '0.5rem',
                    border: '2px dashed #e5e7eb'
                  }}
                >
                  <input
                    type="file"
                    ref={comodinFileInputRef}
                    onChange={handleComodinFileChange}
                    accept="image/jpeg,image/png,image/gif"
                    className="hidden"
                  />
                  {comodinImagePreview ? (
                    <img
                      src={comodinImagePreview}
                      alt="Vista previa"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain'
                      }}
                    />
                  ) : (
                    <div className="upload-placeholder">
                      <FaCamera className="text-gray-400 text-3xl mb-2" />
                      <span className="text-sm text-gray-500 text-center px-2">
                        {comodinData.idcomodines ? 'Cambiar imagen' : 'Subir imagen'}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="game-form-fields-section">
                <div className="game-form-group">
                  <label className="game-form-label">Nombre del comodín</label>
                  <input
                    type="text"
                    className="game-form-input"
                    placeholder="Ej: Vida Extra"
                    defaultValue={comodinData.nombre || ''}
                    onBlur={(e) => {
                      setComodinData(prev => ({
                        ...prev,
                        nombre: e.target.value
                      }));
                    }}
                  />
                </div>

                <div className="game-form-group">
                  <label className="game-form-label">Descripción</label>
                  <textarea
                    className="game-form-input"
                    placeholder="Describe el comodín..."
                    defaultValue={comodinData.descripcion || ''}
                    onBlur={(e) => {
                      setComodinData(prev => ({
                        ...prev,
                        descripcion: e.target.value
                      }));
                    }}
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleAddComodin}
              disabled={isSavingComodin}
              className="game-form-submit"
            >
              {isSavingComodin ? (
                <>
                  <FaSpinner className="spinner" />
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <FaCheck />
                  <span>{comodinData.idcomodines ? 'Guardar Cambios' : 'Crear Comodín'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const fetchJugadoresDisponibles = async () => {
    try {
      const response = await axios.get(ADMIN_ROUTES.GET_ALL_USERS, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        // Filtrar solo usuarios con rol 2 (jugadores)
        const jugadores = response.data.data.filter(usuario => usuario.rol === 2);
        setJugadoresDisponibles(jugadores);
      }
    } catch (error) {
      console.error('Error al obtener jugadores disponibles:', error);
      toast.error('Error al cargar los jugadores disponibles');
    }
  };

  const fetchTorneos = async () => {
    setIsLoadingTorneos(true);
    try {
      const response = await axios.get(EDICION_ROUTES.GET_ALL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setTorneos(response.data.data);
      } else {
        toast.error('Error al cargar los torneos');
      }
    } catch (error) {
      console.error('Error al obtener torneos:', error);
      toast.error('Error al cargar los torneos');
    } finally {
      setIsLoadingTorneos(false);
    }
  };

  const handleDeleteTorneo = async (idEdicion) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este torneo? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      const response = await axios.delete(EDICION_ROUTES.DELETE(idEdicion), {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        toast.success('Torneo eliminado correctamente');
        await fetchTorneos(); // Recargar la lista
      } else {
        toast.error(response.data.message || 'Error al eliminar el torneo');
      }
    } catch (error) {
      console.error('Error al eliminar torneo:', error);
      toast.error(error.response?.data?.message || 'Error al eliminar el torneo');
    }
  };

  const handleEditTorneo = (torneo) => {
    setEditingTorneo(torneo);
    setTorneoData({
      idEdicion: torneo.idEdicion,
      fecha_inicio: torneo.fecha_inicio,
      fecha_fin: torneo.fecha_fin
    });
    setShowEditTorneoModal(true);
  };

  const handleUpdateTorneo = async () => {
    const { idEdicion, fecha_inicio, fecha_fin } = torneoData;

    if (!fecha_inicio || !fecha_fin) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    if (new Date(fecha_fin) <= new Date(fecha_inicio)) {
      toast.error('La fecha de fin debe ser posterior a la fecha de inicio');
      return;
    }

    setIsSavingTorneo(true);
    try {
      const response = await axios.put(EDICION_ROUTES.UPDATE(idEdicion), {
        fecha_inicio,
        fecha_fin
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        toast.success('Torneo actualizado exitosamente');
        setShowEditTorneoModal(false);
        setEditingTorneo(null);
        setTorneoData({ idEdicion: '', fecha_inicio: '', fecha_fin: '' });
        await fetchTorneos(); // Recargar la lista
      }
    } catch (error) {
      console.error('Error al actualizar torneo:', error);
      toast.error(error.response?.data?.message || 'Error al actualizar el torneo');
    } finally {
      setIsSavingTorneo(false);
    }
  };

  const handleCreateTorneo = async () => {
    const { idEdicion, fecha_inicio, fecha_fin } = torneoData;

    if (!idEdicion || !fecha_inicio || !fecha_fin) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    if (isNaN(idEdicion) || idEdicion < 2020 || idEdicion > 2030) {
      toast.error('El año debe ser un número válido entre 2020 y 2030');
      return;
    }

    if (new Date(fecha_fin) <= new Date(fecha_inicio)) {
      toast.error('La fecha de fin debe ser posterior a la fecha de inicio');
      return;
    }

    setIsSavingTorneo(true);
    try {
      const response = await axios.post(EDICION_ROUTES.CREATE, torneoData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        toast.success('Torneo creado exitosamente');
        // Guardar la edición creada para el flujo de asignación
        const torneoCreado = response.data.data;
        setEdicionActual(torneoCreado);
        setIsCreatingNewTorneo(true); // Marcar como torneo nuevo
        setShowTorneoModal(false);
        setShowJuegosModal(true);
        setTorneoData({ idEdicion: '', fecha_inicio: '', fecha_fin: '' });
        // Actualizar la lista de torneos automáticamente
        await fetchTorneos();
      }
    } catch (error) {
      console.error('Error al crear torneo:', error);
      toast.error(error.response?.data?.message || 'Error al crear el torneo');
    } finally {
      setIsSavingTorneo(false);
    }
  };

  const handleAsignarJuegos = async () => {
    if (juegosSeleccionados.length === 0) {
      toast.error('Debe seleccionar al menos un juego');
      return;
    }

    setIsAsignandoJuegos(true);
    try {
      const response = await axios.post(
        EDICION_ROUTES.ASIGNAR_JUEGOS(edicionActual.idEdicion),
        { juegos: juegosSeleccionados },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success('Juegos asignados exitosamente');
        setShowJuegosModal(false);
        setJuegosSeleccionados([]);
        
        // Actualizar la lista de torneos
        await fetchTorneos();
        
        // Si es un torneo nuevo, continuar con jugadores
        if (isCreatingNewTorneo) {
          setShowJugadoresModal(true);
        } else {
          setEdicionActual(null);
        }
      }
    } catch (error) {
      console.error('Error al asignar juegos:', error);
      toast.error(error.response?.data?.message || 'Error al asignar juegos');
    } finally {
      setIsAsignandoJuegos(false);
    }
  };

  const handleAsignarJugadores = async () => {
    if (jugadoresSeleccionados.length === 0) {
      toast.error('Debe seleccionar al menos un jugador');
      return;
    }

    setIsAsignandoJugadores(true);
    try {
      const response = await axios.post(
        EDICION_ROUTES.ASIGNAR_JUGADORES(edicionActual.idEdicion),
        { jugadores: jugadoresSeleccionados },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success('Jugadores asignados exitosamente');
        setShowJugadoresModal(false);
        setJugadoresSeleccionados([]);
        setEdicionActual(null);
        setIsCreatingNewTorneo(false); // Resetear el estado
        // Actualizar la lista de torneos
        await fetchTorneos();
        
        // Si es un torneo nuevo (recién creado), mostrar mensaje de éxito
        toast.success('¡Torneo configurado completamente!');
      }
    } catch (error) {
      console.error('Error al asignar jugadores:', error);
      toast.error(error.response?.data?.message || 'Error al asignar jugadores');
    } finally {
      setIsAsignandoJugadores(false);
    }
  };

  const handleJuegoToggle = (juegoId) => {
    setJuegosSeleccionados(prev => 
      prev.includes(juegoId) 
        ? prev.filter(id => id !== juegoId)
        : [...prev, juegoId]
    );
  };

  const handleJugadorToggle = (nickname) => {
    setJugadoresSeleccionados(prev => 
      prev.includes(nickname) 
        ? prev.filter(nick => nick !== nickname)
        : [...prev, nickname]
    );
  };

  const TorneoContent = () => (
    <div className="content-section">
      <div className="games-header">
        <h2 className="games-title">Gestión de Torneos</h2>
        <button
          onClick={() => {
            setTorneoData({ idEdicion: '', fecha_inicio: '', fecha_fin: '' });
            setShowTorneoModal(true);
          }}
          className="add-game-button"
        >
          <FaTrophy /> Crear Nuevo Torneo
        </button>
      </div>
      
      {isLoadingTorneos ? (
        <div className="loading-spinner">
          <FaSpinner className="spinner-icon" />
          <span>Cargando torneos...</span>
        </div>
      ) : torneos.length === 0 ? (
        <div className="no-data">
          <p>No hay torneos registrados</p>
          <p className="text-sm text-gray-500 mt-2">Crea tu primer torneo haciendo clic en "Crear Nuevo Torneo"</p>
        </div>
      ) : (
        <div className="games-table-container">
          <table className="games-table">
            <thead>
              <tr>
                <th>Año</th>
                <th>Fecha de Inicio</th>
                <th>Fecha de Fin</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {torneos.map((torneo) => {
                const fechaInicio = new Date(torneo.fecha_inicio);
                const fechaFin = new Date(torneo.fecha_fin);
                const hoy = new Date();
                let estado = 'Pendiente';
                let estadoClass = 'torneo-status pending';
                
                if (hoy >= fechaInicio && hoy <= fechaFin) {
                  estado = 'En Curso';
                  estadoClass = 'torneo-status active';
                } else if (hoy > fechaFin) {
                  estado = 'Finalizado';
                  estadoClass = 'torneo-status finished';
                }
                
                return (
                  <tr key={torneo.idEdicion}>
                    <td>
                      <span className="font-semibold text-lg">{torneo.idEdicion}</span>
                    </td>
                    <td>{fechaInicio.toLocaleDateString('es-ES')}</td>
                    <td>{fechaFin.toLocaleDateString('es-ES')}</td>
                    <td>
                      <span className={estadoClass}>
                        {estado}
                      </span>
                    </td>
                    <td>
                      <div className="torneo-actions">
                        <button
                          onClick={() => handleEditTorneo(torneo)}
                          className="torneo-action-btn edit"
                          title="Editar torneo"
                        >
                          <FaPen />
                        </button>
                        <button
                          onClick={async () => {
                            setEdicionActual(torneo);
                            setIsCreatingNewTorneo(false); // No es un torneo nuevo
                            setShowJuegosModal(true);
                            // Cargar juegos ya asignados
                            await fetchJuegosAsignados(torneo.idEdicion);
                          }}
                          className="torneo-action-btn games"
                          title="Gestionar juegos"
                        >
                          <FaGamepad />
                        </button>
                        <button
                          onClick={async () => {
                            setEdicionActual(torneo);
                            setIsCreatingNewTorneo(false); // No es un torneo nuevo
                            setShowJugadoresModal(true);
                            // Cargar jugadores ya asignados
                            await fetchJugadoresAsignados(torneo.idEdicion);
                          }}
                          className="torneo-action-btn players"
                          title="Gestionar jugadores"
                        >
                          <FaUsers />
                        </button>
                        <button
                          onClick={() => handleDeleteTorneo(torneo.idEdicion)}
                          className="torneo-action-btn delete"
                          title="Eliminar torneo"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const PuntosContent = () => (
    <div className="content-section">
      <div className="games-header">
        <h2 className="games-title">Asignar Puntos por Tipo de Partida</h2>
      </div>
      
      {isLoadingPuntos ? (
        <div className="loading-spinner">
          <FaSpinner className="spinner-icon" />
          <span>Cargando configuración de puntos...</span>
        </div>
      ) : (
        <div className="puntos-container">
          {/* Selector de tipo de partida */}
          <div className="tipo-partida-selector">
            <h3 className="text-lg font-semibold mb-4">Seleccionar Tipo de Partida</h3>
            <div className="tipo-partida-buttons">
              <button
                onClick={() => setPuntosData(prev => ({ ...prev, tipoPartida: 'PVP' }))}
                className={`tipo-partida-btn ${puntosData.tipoPartida === 'PVP' ? 'active' : ''}`}
              >
                <FaGamepad className="mr-2" />
                PVP (1 vs 1)
              </button>
              <button
                onClick={() => setPuntosData(prev => ({ ...prev, tipoPartida: 'TodosContraTodos' }))}
                className={`tipo-partida-btn ${puntosData.tipoPartida === 'TodosContraTodos' ? 'active' : ''}`}
              >
                <FaUsers className="mr-2" />
                Todos Contra Todos
              </button>
            </div>
          </div>

          {/* Formulario PVP */}
          {puntosData.tipoPartida === 'PVP' && (
            <div className="puntos-form-section">
              <h3 className="text-lg font-semibold mb-4">Configuración de Puntos - PVP</h3>
              <div className="puntos-pvp-form">
                <div className="punto-input-group">
                  <label className="punto-label">
                    <span className="punto-posicion">🥇 Posición 1 (Ganador)</span>
                    <input
                      type="number"
                      min="0"
                      value={puntosData.puntosPVP.posicion1}
                      onChange={(e) => setPuntosData(prev => ({
                        ...prev,
                        puntosPVP: {
                          ...prev.puntosPVP,
                          posicion1: parseInt(e.target.value) || 0
                        }
                      }))}
                      className="punto-input"
                      placeholder="Ej: 10"
                    />
                    <span className="punto-unidad">puntos</span>
                  </label>
                </div>
                
                <div className="punto-input-group">
                  <label className="punto-label">
                    <span className="punto-posicion">🥈 Posición 2 (Perdedor)</span>
                    <input
                      type="number"
                      min="0"
                      value={puntosData.puntosPVP.posicion2}
                      onChange={(e) => setPuntosData(prev => ({
                        ...prev,
                        puntosPVP: {
                          ...prev.puntosPVP,
                          posicion2: parseInt(e.target.value) || 0
                        }
                      }))}
                      className="punto-input"
                      placeholder="Ej: 5"
                    />
                    <span className="punto-unidad">puntos</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Formulario Todos Contra Todos */}
          {puntosData.tipoPartida === 'TodosContraTodos' && (
            <div className="puntos-form-section">
              <h3 className="text-lg font-semibold mb-4">Configuración de Puntos - Todos Contra Todos</h3>
              <p className="text-gray-600 mb-4">
                Define los puntos para cada posición. Las posiciones no definidas automáticamente valdrán 0 puntos.
              </p>
              
              <div className="puntos-tct-grid">
                {puntosData.puntosTodosContraTodos.map((punto, index) => (
                  <div key={punto.posicion} className="punto-tct-item">
                    <div className="punto-tct-header">
                      <div className="punto-tct-header-left">
                        <span className="punto-tct-posicion">
                          {punto.posicion === 1 && '🥇'}
                          {punto.posicion === 2 && '🥈'}
                          {punto.posicion === 3 && '🥉'}
                          {punto.posicion > 3 && `#${punto.posicion}`}
                        </span>
                        <span className="punto-tct-title">Posición {punto.posicion}</span>
                      </div>
                      {punto.posicion > 1 && (
                        <button
                          onClick={() => handleRemovePosicion(punto.posicion)}
                          className="remove-posicion-btn"
                          title="Eliminar posición"
                        >
                          <FaTimes />
                        </button>
                      )}
                    </div>
                    <div className="punto-tct-input-container">
                      <input
                        type="number"
                        min="0"
                        value={punto.puntos}
                        onChange={(e) => handlePuntosTodosContraTodosChange(punto.posicion, e.target.value)}
                        className="punto-tct-input"
                        placeholder="0"
                      />
                      <span className="punto-tct-unidad">pts</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="puntos-tct-actions">
                <button
                  onClick={handleAddPosicion}
                  className="add-posicion-btn"
                  title="Añadir nueva posición"
                >
                  <FaPlus />
                  <span>Añadir Posición</span>
                </button>
              </div>
            </div>
          )}

          {/* Botón de guardar */}
          <div className="puntos-actions">
            <button
              onClick={handleSavePuntos}
              disabled={isSavingPuntos}
              className="puntos-save-btn"
            >
              {isSavingPuntos ? (
                <>
                  <FaSpinner className="spinner" />
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <FaCheck />
                  <span>Guardar Puntos para {puntosData.tipoPartida}</span>
                </>
              )}
            </button>
          </div>

          {/* Vista previa de puntos existentes */}
          {puntosExistentes.length > 0 && (
            <div className="puntos-preview">
              <h3 className="text-lg font-semibold mb-4">Puntos Actualmente Configurados</h3>
              <div className="puntos-preview-grid">
                {['PVP', 'TodosContraTodos'].map(tipo => {
                  const puntosTipo = puntosExistentes.filter(p => p.tipo === tipo);
                  if (puntosTipo.length === 0) return null;
                  
                  return (
                    <div key={tipo} className="puntos-preview-section">
                      <h4 className="puntos-preview-title">{tipo}</h4>
                      <div className="puntos-preview-list">
                        {puntosTipo
                          .sort((a, b) => a.posicion - b.posicion)
                          .map(punto => (
                            <div key={`${punto.tipo}-${punto.posicion}`} className="punto-preview-item">
                              <span className="punto-preview-posicion">Posición {punto.posicion}:</span>
                              <span className="punto-preview-valor">{punto.puntos} pts</span>
                            </div>
                          ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const PartidasContent = () => (
    <div className="content-section">
      <div className="games-header">
        <h2 className="games-title">Gestión de Partidas</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'flex-start' }}>
          <button
            onClick={() => setShowCrearPartidaModal(true)}
            className="add-game-button"
            disabled={!edicionSeleccionada || serverError}
            style={{ marginBottom: '8px' }}
          >
            <FaGamepad /> Crear Nueva Partida
          </button>
          <button
            onClick={handleLimpiarTablaGeneral}
            disabled={isLimpiandoTabla}
            className="add-game-button"
            style={{ 
              backgroundColor: '#dc2626', 
              borderColor: '#dc2626',
              color: 'white',
              marginTop: '8px'
            }}
            title="Limpiar tabla general para el próximo torneo"
          >
            {isLimpiandoTabla ? (
              <>
                <FaSpinner className="animate-spin" />
                Limpiando...
              </>
            ) : (
              <>
                <FaTimes />
                Limpiar Tabla General
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* Selector de edición activa */}
      <div className="edicion-selector-section">
        <h3 className="text-lg font-semibold mb-4">Seleccionar Última Edición</h3>
        {serverError ? (
          <div className="no-data">
            <p>⚠️ Servidor no disponible</p>
            <p className="text-sm text-gray-500 mt-2">
              No se puede conectar al servidor backend para cargar las partidas.
              <br />
              Por favor, inicia el servidor ejecutando <code>npm start</code> en la carpeta backend.
            </p>
          </div>
        ) : edicionesActivas.length === 0 ? (
          <div className="no-data">
            <p>No hay ediciones disponibles</p>
            <p className="text-sm text-gray-500 mt-2">Crea una edición en la sección "Torneos" para poder crear partidas</p>
          </div>
        ) : (
          <div className="edicion-buttons">
            {edicionesActivas.map(edicion => (
              <button
                key={edicion.idEdicion}
                onClick={() => handleEdicionChange(edicion.idEdicion)}
                className={`edicion-btn ${edicionSeleccionada === edicion.idEdicion ? 'active' : ''}`}
              >
                <FaTrophy className="mr-2" />
                <span>Torneo {edicion.idEdicion}</span>
                <small className="block text-xs opacity-75">
                  {new Date(edicion.fecha_inicio).toLocaleDateString('es-ES')} - {new Date(edicion.fecha_fin).toLocaleDateString('es-ES')}
                </small>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lista de partidas */}
      <div className="partidas-section">
        <h3 className="text-lg font-semibold mb-4">Partidas Creadas</h3>
        {serverError ? (
          <div className="no-data">
            <p>⚠️ Servidor no disponible</p>
            <p className="text-sm text-gray-500 mt-2">
              No se puede conectar al servidor backend para cargar las partidas.
              <br />
              Por favor, inicia el servidor ejecutando <code>npm start</code> en la carpeta backend.
            </p>
          </div>
        ) : isLoadingPartidas ? (
          <div className="loading-spinner">
            <FaSpinner className="spinner-icon" />
            <span>Cargando partidas...</span>
          </div>
        ) : partidas.length === 0 ? (
          <div className="no-data">
            <p>No hay partidas registradas</p>
            <p className="text-sm text-gray-500 mt-2">Crea tu primera partida seleccionando una edición activa</p>
          </div>
        ) : (
          <div className="games-table-container">
            <table className="games-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Torneo</th>
                  <th>Juego</th>
                  <th>Tipo</th>
                  <th>Jugadores</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {partidas.map((partida) => (
                  <tr key={partida.id}>
                    <td>
                      <span className="font-semibold">#{partida.id}</span>
                    </td>
                    <td>
                      <span className="font-semibold text-lg">{partida.idEdicion}</span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <img
                          src={partida.juego_foto || '/default-game.png'}
                          alt={partida.juego_nombre}
                          className="game-image"
                        />
                        <span>{partida.juego_nombre}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                        partida.tipo === 'PVP' 
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {partida.tipo}
                      </span>
                    </td>
                    <td>
                      <div className="jugadores-participantes">
                        {partida.jugadores && partida.jugadores.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {partida.jugadores.map((jugador, index) => (
                              <span 
                                key={jugador} 
                                className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                                title={jugador}
                              >
                                {jugador}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">Sin jugadores</span>
                        )}
                      </div>
                    </td>
                    <td>{new Date(partida.fecha).toLocaleDateString('es-ES')}</td>
                    <td>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                        partida.tiene_resultado 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {partida.tiene_resultado ? 'Finalizada' : 'Pendiente'}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handleEditPartida(partida)}
                          className="text-blue-600 hover:text-blue-800 transition-colors p-2"
                          title="Editar/Actualizar partida"
                        >
                          <FaPen />
                        </button>
                        <button
                          onClick={() => partida.tiene_resultado ? handleVerResultado(partida) : handleRegistrarResultado(partida)}
                          className={`transition-colors p-2 ${
                            partida.tiene_resultado 
                              ? 'text-purple-600 hover:text-purple-800' 
                              : 'text-green-600 hover:text-green-800'
                          }`}
                          title={partida.tiene_resultado ? 'Ver resultado' : 'Registrar resultado'}
                        >
                          {partida.tiene_resultado ? <FaEye /> : <FaTrophy />}
                        </button>
                        <button
                          onClick={() => handleDeletePartida(partida.id)}
                          className="text-red-600 hover:text-red-800 transition-colors p-2"
                          title="Eliminar partida"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

  const TorneoModal = () => (
    <div className="game-modal">
      <div className="game-modal-content">
        <div className="game-modal-header">
          <h3 className="game-modal-title">Crear Nueva Edición del Torneo</h3>
          <button
            onClick={() => setShowTorneoModal(false)}
            className="game-modal-close"
          >
            <FaTimes />
          </button>
        </div>

        <div className="game-form-container">
          <div className="game-form-group">
            <label className="game-form-label">Año del Torneo</label>
            <input
              type="number"
              className="game-form-input"
              placeholder="Ej: 2025"
              min="2020"
              max="2030"
              defaultValue={torneoData.idEdicion}
              onBlur={(e) => setTorneoData(prev => ({ ...prev, idEdicion: e.target.value }))}
            />
          </div>

          <div className="game-form-group">
            <label className="game-form-label">Fecha de Inicio</label>
            <input
              type="date"
              className="game-form-input"
              defaultValue={torneoData.fecha_inicio}
              onBlur={(e) => setTorneoData(prev => ({ ...prev, fecha_inicio: e.target.value }))}
            />
          </div>

          <div className="game-form-group">
            <label className="game-form-label">Fecha de Fin</label>
            <input
              type="date"
              className="game-form-input"
              defaultValue={torneoData.fecha_fin}
              onBlur={(e) => setTorneoData(prev => ({ ...prev, fecha_fin: e.target.value }))}
            />
          </div>

          <button
            onClick={handleCreateTorneo}
            disabled={isSavingTorneo}
            className="game-form-submit"
          >
            {isSavingTorneo ? (
              <>
                <FaSpinner className="spinner" />
                <span>Creando...</span>
              </>
            ) : (
              <>
                <FaCheck />
                <span>Crear Torneo</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  const EditTorneoModal = () => (
    <div className="game-modal">
      <div className="game-modal-content">
        <div className="game-modal-header">
          <h3 className="game-modal-title">Editar Torneo {editingTorneo?.idEdicion}</h3>
          <button
            onClick={() => {
              setShowEditTorneoModal(false);
              setEditingTorneo(null);
              setTorneoData({ idEdicion: '', fecha_inicio: '', fecha_fin: '' });
            }}
            className="game-modal-close"
          >
            <FaTimes />
          </button>
        </div>

        <div className="game-form-container">
          <div className="game-form-group">
            <label className="game-form-label">Año del Torneo</label>
            <input
              type="number"
              className="game-form-input"
              value={torneoData.idEdicion}
              disabled
              style={{ backgroundColor: '#f3f4f6', cursor: 'not-allowed' }}
            />
            <small className="text-gray-500">El año no se puede modificar</small>
          </div>

          <div className="game-form-group">
            <label className="game-form-label">Fecha de Inicio</label>
            <input
              type="date"
              className="game-form-input"
              defaultValue={torneoData.fecha_inicio}
              onBlur={(e) => setTorneoData(prev => ({ ...prev, fecha_inicio: e.target.value }))}
            />
          </div>

          <div className="game-form-group">
            <label className="game-form-label">Fecha de Fin</label>
            <input
              type="date"
              className="game-form-input"
              defaultValue={torneoData.fecha_fin}
              onBlur={(e) => setTorneoData(prev => ({ ...prev, fecha_fin: e.target.value }))}
            />
          </div>

          <button
            onClick={handleUpdateTorneo}
            disabled={isSavingTorneo}
            className="game-form-submit"
          >
            {isSavingTorneo ? (
              <>
                <FaSpinner className="spinner" />
                <span>Actualizando...</span>
              </>
            ) : (
              <>
                <FaCheck />
                <span>Actualizar Torneo</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  const JuegosModal = () => {
    const [juegosAsignados, setJuegosAsignados] = useState([]);
    const [isLoadingAsignados, setIsLoadingAsignados] = useState(false);

    // Cargar juegos asignados cuando se abre el modal
    useEffect(() => {
      if (showJuegosModal && edicionActual?.idEdicion) {
        fetchJuegosAsignadosModal();
      }
    }, [showJuegosModal, edicionActual]);

    const fetchJuegosAsignadosModal = async () => {
      setIsLoadingAsignados(true);
      try {
        const response = await axios.get(EDICION_ROUTES.GET_JUEGOS_BY_EDICION(edicionActual.idEdicion), {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data.success) {
          setJuegosAsignados(response.data.data);
        }
      } catch (error) {
        console.error('Error al obtener juegos asignados:', error);
        setJuegosAsignados([]);
      } finally {
        setIsLoadingAsignados(false);
      }
    };

    return (
      <div className="game-modal">
        <div className="game-modal-content">
          <div className="game-modal-header">
            <h3 className="game-modal-title">
              {edicionActual?.idEdicion ? 
                `Gestionar Juegos del Torneo ${edicionActual.idEdicion}` : 
                'Seleccionar Juegos para el Torneo'
              }
            </h3>
            <button
              onClick={() => {
                setShowJuegosModal(false);
                setEdicionActual(null);
                setJuegosSeleccionados([]);
                setJuegosAsignados([]);
                setIsCreatingNewTorneo(false); // Resetear estado
              }}
              className="game-modal-close"
            >
              <FaTimes />
            </button>
          </div>

          <div className="game-form-container">
            {/* Sección de juegos ya asignados */}
            {edicionActual?.idEdicion && (
              <div className="juegos-asignados-section">
                <h4 className="text-lg font-semibold mb-3">Juegos Asignados Actualmente</h4>
                {isLoadingAsignados ? (
                  <div className="loading-spinner">
                    <FaSpinner className="spinner-icon" />
                    <span>Cargando juegos asignados...</span>
                  </div>
                ) : juegosAsignados.length === 0 ? (
                  <div className="no-data">No hay juegos asignados a este torneo</div>
                ) : (
                  <div className="juegos-asignados-grid">
                    {juegosAsignados.map(juego => (
                      <div key={juego.id} className="juego-asignado-item">
                        <img
                          src={juego.foto || '/default-game.png'}
                          alt={juego.nombre}
                          className="juego-thumbnail"
                        />
                        <span className="juego-nombre">{juego.nombre}</span>
                        <button
                          onClick={() => handleQuitarJuego(juego.id)}
                          className="quitar-juego-btn"
                          title="Quitar juego del torneo"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Sección para agregar nuevos juegos */}
            <div className="juegos-seleccion">
              <h4 className="text-lg font-semibold mb-3">
                {edicionActual?.idEdicion ? 'Agregar Nuevos Juegos' : 'Seleccionar Juegos'}
              </h4>
              <p className="text-gray-600 mb-4">
                Selecciona los juegos que se usarán en esta edición:
              </p>
              {isLoadingJuegos ? (
                <div className="loading-spinner">
                  <FaSpinner className="spinner-icon" />
                  <span>Cargando juegos...</span>
                </div>
              ) : juegos.length === 0 ? (
                <div className="no-data">No hay juegos disponibles</div>
              ) : (
                <div className="juegos-grid">
                  {juegos.map(juego => (
                    <div key={juego.id} className="juego-checkbox">
                      <input
                        type="checkbox"
                        id={`juego-${juego.id}`}
                        checked={juegosSeleccionados.includes(juego.id)}
                        onChange={() => handleJuegoToggle(juego.id)}
                        className="checkbox-input"
                      />
                      <label htmlFor={`juego-${juego.id}`} className="checkbox-label">
                        <img
                          src={juego.foto || '/default-game.png'}
                          alt={juego.nombre}
                          className="juego-thumbnail"
                        />
                        <span>{juego.nombre}</span>
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleAsignarJuegos}
                disabled={isAsignandoJuegos || juegos.length === 0}
                className="game-form-submit flex-1"
              >
                {isAsignandoJuegos ? (
                  <>
                    <FaSpinner className="spinner" />
                    <span>Asignando...</span>
                  </>
                ) : (
                  <>
                    <FaCheck />
                    <span>Asignar Juegos</span>
                  </>
                )}
              </button>
              
              {!edicionActual?.idEdicion && (
                <button
                  onClick={() => {
                    setShowJuegosModal(false);
                    setShowJugadoresModal(true);
                  }}
                  disabled={juegosSeleccionados.length === 0}
                  className="game-form-submit flex-1"
                  style={{ backgroundColor: '#10b981' }}
                >
                  <FaUsers />
                  <span>Siguiente: Jugadores</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const JugadoresModal = () => {
    const [jugadoresAsignados, setJugadoresAsignados] = useState([]);
    const [isLoadingAsignados, setIsLoadingAsignados] = useState(false);

    // Cargar jugadores asignados cuando se abre el modal
    useEffect(() => {
      if (showJugadoresModal && edicionActual?.idEdicion) {
        fetchJugadoresAsignadosModal();
      }
    }, [showJugadoresModal, edicionActual]);

    const fetchJugadoresAsignadosModal = async () => {
      setIsLoadingAsignados(true);
      try {
        const response = await axios.get(EDICION_ROUTES.GET_JUGADORES_BY_EDICION(edicionActual.idEdicion), {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data.success) {
          setJugadoresAsignados(response.data.data);
        }
      } catch (error) {
        console.error('Error al obtener jugadores asignados:', error);
        setJugadoresAsignados([]);
      } finally {
        setIsLoadingAsignados(false);
      }
    };

    return (
      <div className="game-modal">
        <div className="game-modal-content">
          <div className="game-modal-header">
            <h3 className="game-modal-title">
              {edicionActual?.idEdicion ? 
                `Gestionar Jugadores del Torneo ${edicionActual.idEdicion}` : 
                'Asignar Jugadores al Torneo'
              }
            </h3>
            <button
              onClick={() => {
                setShowJugadoresModal(false);
                setEdicionActual(null);
                setJugadoresSeleccionados([]);
                setJugadoresAsignados([]);
                setIsCreatingNewTorneo(false); // Resetear estado
              }}
              className="game-modal-close"
            >
              <FaTimes />
            </button>
          </div>

          <div className="game-form-container">
            {/* Sección de jugadores ya asignados */}
            {edicionActual?.idEdicion && (
              <div className="jugadores-asignados-section">
                <h4 className="text-lg font-semibold mb-3">Jugadores Asignados Actualmente</h4>
                {isLoadingAsignados ? (
                  <div className="loading-spinner">
                    <FaSpinner className="spinner-icon" />
                    <span>Cargando jugadores asignados...</span>
                  </div>
                ) : jugadoresAsignados.length === 0 ? (
                  <div className="no-data">No hay jugadores asignados a este torneo</div>
                ) : (
                  <div className="jugadores-asignados-grid">
                    {jugadoresAsignados.map(jugador => (
                      <div key={jugador.nickname} className="jugador-asignado-item">
                        <img
                          src={jugador.foto || '/default-profile.png'}
                          alt={jugador.nickname}
                          className="jugador-thumbnail"
                        />
                        <div className="jugador-info">
                          <span className="jugador-nickname">{jugador.nickname}</span>
                          <span className="jugador-email">{jugador.email}</span>
                        </div>
                        <button
                          onClick={() => handleQuitarJugador(jugador.nickname)}
                          className="quitar-jugador-btn"
                          title="Quitar jugador del torneo"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Sección para agregar nuevos jugadores */}
            <div className="jugadores-seleccion">
              <h4 className="text-lg font-semibold mb-3">
                {edicionActual?.idEdicion ? 'Agregar Nuevos Jugadores' : 'Seleccionar Jugadores'}
              </h4>
              <p className="text-gray-600 mb-4">
                Selecciona los jugadores que participarán (solo usuarios con rol de jugador):
              </p>
              {jugadoresDisponibles.length === 0 ? (
                <div className="loading-spinner">
                  <FaSpinner className="spinner-icon" />
                  <span>Cargando jugadores...</span>
                </div>
              ) : (
                <div className="jugadores-grid">
                  {jugadoresDisponibles.map(jugador => (
                    <div key={jugador.nickname} className="jugador-checkbox">
                      <input
                        type="checkbox"
                        id={`jugador-${jugador.nickname}`}
                        checked={jugadoresSeleccionados.includes(jugador.nickname)}
                        onChange={() => handleJugadorToggle(jugador.nickname)}
                        className="checkbox-input"
                      />
                      <label htmlFor={`jugador-${jugador.nickname}`} className="checkbox-label">
                        <img
                          src={jugador.foto || '/default-profile.png'}
                          alt={jugador.nickname}
                          className="jugador-thumbnail"
                        />
                        <div className="jugador-info">
                          <span className="jugador-nickname">{jugador.nickname}</span>
                          <span className="jugador-email">{jugador.email}</span>
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={handleAsignarJugadores}
              disabled={isAsignandoJugadores || jugadoresDisponibles.length === 0}
              className="game-form-submit"
            >
              {isAsignandoJugadores ? (
                <>
                  <FaSpinner className="spinner" />
                  <span>Asignando...</span>
                </>
              ) : (
                <>
                  <FaCheck />
                  <span>
                    {edicionActual?.idEdicion ? 'Actualizar Jugadores' : 'Asignar Jugadores'}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const fetchJuegosAsignados = async (idEdicion) => {
    try {
      const response = await axios.get(EDICION_ROUTES.GET_JUEGOS_BY_EDICION(idEdicion), {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        const juegosIds = response.data.data.map(juego => juego.id);
        setJuegosSeleccionados(juegosIds);
      }
    } catch (error) {
      console.error('Error al obtener juegos asignados:', error);
      // Si no hay juegos asignados, simplemente inicializar como array vacío
      setJuegosSeleccionados([]);
    }
  };

  const fetchJugadoresAsignados = async (idEdicion) => {
    try {
      const response = await axios.get(EDICION_ROUTES.GET_JUGADORES_BY_EDICION(idEdicion), {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        const jugadoresNicknames = response.data.data.map(jugador => jugador.nickname);
        setJugadoresSeleccionados(jugadoresNicknames);
      }
    } catch (error) {
      console.error('Error al obtener jugadores asignados:', error);
      // Si no hay jugadores asignados, simplemente inicializar como array vacío
      setJugadoresSeleccionados([]);
    }
  };

  const handleQuitarJuego = async (juegoId) => {
    if (!edicionActual?.idEdicion) return;

    try {
      // Obtener los juegos actualmente asignados
      const response = await axios.get(EDICION_ROUTES.GET_JUEGOS_BY_EDICION(edicionActual.idEdicion), {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        // Filtrar el juego que se quiere quitar
        const juegosRestantes = response.data.data
          .filter(juego => juego.id !== juegoId)
          .map(juego => juego.id);
        
        // Reasignar los juegos restantes
        const reasignarResponse = await axios.post(
          EDICION_ROUTES.ASIGNAR_JUEGOS(edicionActual.idEdicion),
          { juegos: juegosRestantes },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (reasignarResponse.data.success) {
          toast.success('Juego removido del torneo');
          // Actualizar la lista de juegos seleccionados
          setJuegosSeleccionados(prev => prev.filter(id => id !== juegoId));
          // Actualizar la lista de torneos
          await fetchTorneos();
        }
      }
    } catch (error) {
      console.error('Error al quitar juego:', error);
      toast.error('Error al quitar el juego del torneo');
    }
  };

  const handleQuitarJugador = async (nickname) => {
    if (!edicionActual?.idEdicion) return;

    try {
      // Obtener los jugadores actualmente asignados
      const response = await axios.get(EDICION_ROUTES.GET_JUGADORES_BY_EDICION(edicionActual.idEdicion), {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        // Filtrar el jugador que se quiere quitar
        const jugadoresRestantes = response.data.data
          .filter(jugador => jugador.nickname !== nickname)
          .map(jugador => jugador.nickname);
        
        // Reasignar los jugadores restantes
        const reasignarResponse = await axios.post(
          EDICION_ROUTES.ASIGNAR_JUGADORES(edicionActual.idEdicion),
          { jugadores: jugadoresRestantes },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (reasignarResponse.data.success) {
          toast.success('Jugador removido del torneo');
          // Actualizar la lista de jugadores seleccionados
          setJugadoresSeleccionados(prev => prev.filter(nick => nick !== nickname));
          // Actualizar la lista de torneos
          await fetchTorneos();
        }
      }
    } catch (error) {
      console.error('Error al quitar jugador:', error);
      toast.error('Error al quitar el jugador del torneo');
    }
  };

  // Funciones para el módulo de puntos
  const fetchPuntosExistentes = async () => {
    setIsLoadingPuntos(true);
    try {
      const response = await axios.get(PUNTOS_ROUTES.GET_ALL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setPuntosExistentes(response.data.data);
        // Cargar los puntos existentes en el formulario
        cargarPuntosExistentes(response.data.data);
      }
    } catch (error) {
      console.error('Error al obtener puntos:', error);
      // Si no hay puntos, usar valores por defecto
    } finally {
      setIsLoadingPuntos(false);
    }
  };

  const cargarPuntosExistentes = (puntos) => {
    const puntosPVP = puntos.filter(p => p.tipo === 'PVP');
    const puntosTodosContraTodos = puntos.filter(p => p.tipo === 'TodosContraTodos');

    // Cargar puntos PVP
    if (puntosPVP.length > 0) {
      const pvpData = {};
      puntosPVP.forEach(p => {
        pvpData[`posicion${p.posicion}`] = p.puntos;
      });
      setPuntosData(prev => ({
        ...prev,
        puntosPVP: {
          posicion1: pvpData.posicion1 || 10,
          posicion2: pvpData.posicion2 || 5
        }
      }));
    }

    // Cargar puntos TodosContraTodos
    if (puntosTodosContraTodos.length > 0) {
      const tctData = Array.from({ length: 10 }, (_, i) => ({
        posicion: i + 1,
        puntos: puntosTodosContraTodos.find(p => p.posicion === i + 1)?.puntos || 0
      }));
      setPuntosData(prev => ({
        ...prev,
        puntosTodosContraTodos: tctData
      }));
    }
  };

  const handleSavePuntos = async () => {
    setIsSavingPuntos(true);
    try {
      const { tipoPartida, puntosPVP, puntosTodosContraTodos } = puntosData;
      
      let puntosToSave = [];
      
      if (tipoPartida === 'PVP') {
        puntosToSave = [
          { tipo: 'PVP', posicion: 1, puntos: puntosPVP.posicion1 },
          { tipo: 'PVP', posicion: 2, puntos: puntosPVP.posicion2 }
        ];
      } else {
        puntosToSave = puntosTodosContraTodos.map(p => ({
          tipo: 'TodosContraTodos',
          posicion: p.posicion,
          puntos: p.puntos
        }));
      }

      const response = await axios.post(PUNTOS_ROUTES.CREATE_OR_UPDATE, {
        puntos: puntosToSave
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        toast.success(`Puntos guardados exitosamente para ${tipoPartida}`);
        await fetchPuntosExistentes(); // Recargar datos
      }
    } catch (error) {
      console.error('Error al guardar puntos:', error);
      toast.error(error.response?.data?.message || 'Error al guardar los puntos');
    } finally {
      setIsSavingPuntos(false);
    }
  };

  const handlePuntosTodosContraTodosChange = (posicion, puntos) => {
    setPuntosData(prev => ({
      ...prev,
      puntosTodosContraTodos: prev.puntosTodosContraTodos.map(p => 
        p.posicion === posicion ? { ...p, puntos: parseInt(puntos) || 0 } : p
      )
    }));
  };

  const handleAddPosicion = () => {
    setPuntosData(prev => ({
      ...prev,
      puntosTodosContraTodos: [
        ...prev.puntosTodosContraTodos,
        {
          posicion: prev.puntosTodosContraTodos.length + 1,
          puntos: 0
        }
      ]
    }));
  };

  const handleRemovePosicion = (posicion) => {
    if (posicion <= 1) {
      toast.error('No se puede eliminar la posición 1');
      return;
    }
    
    setPuntosData(prev => ({
      ...prev,
      puntosTodosContraTodos: prev.puntosTodosContraTodos
        .filter(p => p.posicion !== posicion)
        .map((p, index) => ({
          ...p,
          posicion: index + 1
        }))
    }));
  };

  // Funciones para el módulo de partidas
  const fetchEdicionesActivas = async () => {
    try {
      const response = await axios.get(PARTIDAS_ROUTES.GET_EDICIONES_ACTIVAS, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setEdicionesActivas(response.data.data);
      }
    } catch (error) {
      console.error('Error al obtener ediciones activas:', error);
      toast.error('Error al cargar las ediciones activas');
    }
  };

  const fetchJugadoresByEdicion = async (idEdicion) => {
    setIsLoadingJugadores(true);
    try {
      const response = await axios.get(PARTIDAS_ROUTES.GET_JUGADORES_BY_EDICION(idEdicion), {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setJugadoresEdicion(response.data.data);
      }
    } catch (error) {
      console.error('Error al obtener jugadores:', error);
      toast.error('Error al cargar los jugadores');
    } finally {
      setIsLoadingJugadores(false);
    }
  };

  const fetchPartidas = async () => {
    setIsLoadingPartidas(true);
    try {
      setServerError(false);
      const response = await axios.get(PARTIDAS_ROUTES.GET_ALL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setPartidas(response.data.data);
      }
    } catch (error) {
      console.error('Error al obtener partidas:', error);
      if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
        setServerError(true);
        toast.error('No se puede conectar al servidor. Verifica que el servidor backend esté corriendo.');
      } else {
        toast.error('Error al cargar las partidas');
      }
    } finally {
      setIsLoadingPartidas(false);
    }
  };

  const handleEdicionChange = (idEdicion) => {
    console.log('Cambiando edición a:', idEdicion);
    setEdicionSeleccionada(idEdicion);
    if (idEdicion) {
      fetchJugadoresByEdicion(idEdicion);
      fetchJuegosByEdicion(idEdicion);
    } else {
      setJugadoresEdicion([]);
      setJuegosEdicion([]);
    }
  };

  const handleJugadorPartidaToggle = (nickname) => {
    setPartidaData(prev => ({
      ...prev,
      jugadores: prev.jugadores.includes(nickname)
        ? prev.jugadores.filter(nick => nick !== nickname)
        : [...prev.jugadores, nickname]
    }));
  };

  const handleCrearPartida = async () => {
    const { id, tipo, fecha, jugadores, juego_id, fase, video_url } = partidaData;
    
    if (!edicionSeleccionada) {
      toast.error('Debe seleccionar una edición');
      return;
    }
    
    if (!fecha) {
      toast.error('Debe seleccionar una fecha');
      return;
    }
    
    if (!juego_id) {
      toast.error('Debe seleccionar un juego');
      return;
    }
    
    if (jugadores.length === 0) {
      toast.error('Debe seleccionar al menos un jugador');
      return;
    }
    
    if (tipo === 'PVP' && jugadores.length !== 2) {
      toast.error('Para PVP debe seleccionar exactamente 2 jugadores');
      return;
    }
    
    if (tipo === 'TodosContraTodos' && jugadores.length < 3) {
      toast.error('Para Todos Contra Todos debe seleccionar al menos 3 jugadores');
      return;
    }
    
    setIsSavingPartida(true);
    try {
      const partidaDataToSend = {
        torneo_id: edicionSeleccionada,
        juego_id: juego_id,
        fecha,
        tipo,
        jugadores,
        fase: fase || 'Grupos',
        video_url: video_url || ''
      };

      let response;
      if (id) {
        // Actualizar partida existente
        response = await axios.put(PARTIDAS_ROUTES.UPDATE(id), partidaDataToSend, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Partida actualizada exitosamente');
      } else {
        // Crear nueva partida
        response = await axios.post(PARTIDAS_ROUTES.CREATE, partidaDataToSend, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Partida creada exitosamente');
      }
      
      if (response.data.success) {
        setShowCrearPartidaModal(false);
        setPartidaData({ tipo: 'PVP', fecha: '', jugadores: [], juego_id: null, fase: 'Grupos', video_url: '' });
        await fetchPartidas();
      }
    } catch (error) {
      console.error('Error al guardar partida:', error);
      toast.error(error.response?.data?.message || 'Error al guardar la partida');
    } finally {
      setIsSavingPartida(false);
    }
  };

  const handleVerPerfil = async (nickname) => {
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
    }
  };

  const handleDeletePartida = async (id) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta partida?')) {
      return;
    }
    
    try {
      const response = await axios.delete(PARTIDAS_ROUTES.DELETE(id), {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        toast.success('Partida eliminada exitosamente');
        await fetchPartidas();
      }
    } catch (error) {
      console.error('Error al eliminar partida:', error);
      toast.error('Error al eliminar la partida');
    }
  };

  const handleLimpiarTablaGeneral = async () => {
    if (!window.confirm('¿Estás seguro de que quieres limpiar la tabla general? Esta acción eliminará todos los puntos acumulados de todos los jugadores y no se puede deshacer.')) {
      return;
    }
    
    setIsLimpiandoTabla(true);
    try {
      const response = await axios.delete(PARTIDAS_ROUTES.LIMPIAR_TABLA_GENERAL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        toast.success(`Tabla general limpiada exitosamente. Se eliminaron ${response.data.data.registrosEliminados} registros.`);
      }
    } catch (error) {
      console.error('Error al limpiar tabla general:', error);
      toast.error(error.response?.data?.message || 'Error al limpiar la tabla general');
    } finally {
      setIsLimpiandoTabla(false);
    }
  };

  const PuntosModal = () => (
    <div className="modal-overlay" onClick={() => setShowPuntosModal(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Configuración de Puntos</h2>
          <button
            onClick={() => setShowPuntosModal(false)}
            className="modal-close"
          >
            <FaTimes />
          </button>
        </div>
        <div className="modal-body">
          <p className="text-gray-600 mb-4">
            Los puntos se han guardado exitosamente para el tipo de partida: <strong>{puntosData.tipoPartida}</strong>
          </p>
          <div className="puntos-preview-modal">
            {puntosData.tipoPartida === 'PVP' ? (
              <div className="puntos-pvp-preview">
                <div className="punto-preview-item">
                  <span className="punto-preview-posicion">🥇 Posición 1:</span>
                  <span className="punto-preview-valor">{puntosData.puntosPVP.posicion1} puntos</span>
                </div>
                <div className="punto-preview-item">
                  <span className="punto-preview-posicion">🥈 Posición 2:</span>
                  <span className="punto-preview-valor">{puntosData.puntosPVP.posicion2} puntos</span>
                </div>
              </div>
            ) : (
              <div className="puntos-tct-preview">
                {puntosData.puntosTodosContraTodos.map(punto => (
                  <div key={punto.posicion} className="punto-preview-item">
                    <span className="punto-preview-posicion">
                      {punto.posicion === 1 && '🥇'}
                      {punto.posicion === 2 && '🥈'}
                      {punto.posicion === 3 && '🥉'}
                      {punto.posicion > 3 && `#${punto.posicion}`}
                      Posición {punto.posicion}:
                    </span>
                    <span className="punto-preview-valor">{punto.puntos} puntos</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="modal-footer">
          <button
            onClick={() => setShowPuntosModal(false)}
            className="modal-button primary"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );

  const CrearPartidaModal = () => (
    <div className="game-modal">
      <div className="game-modal-content" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="game-modal-header">
          <h3 className="game-modal-title">{partidaData.id ? 'Editar Partida' : 'Crear Nueva Partida'}</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {partidaData.id && (
              <button
                onClick={() => setEditandoPartida(prev => !prev)}
                className="game-modal-edit"
                title="Editar datos de la partida"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3b82f6', fontSize: '1.2rem' }}
              >
                <FaPen />
              </button>
            )}
            <button
              onClick={() => setShowCrearPartidaModal(false)}
              className="game-modal-close"
            >
              <FaTimes />
            </button>
          </div>
        </div>
        <div className="game-form-container">
          {/* Información de la edición seleccionada */}
          <div className="game-form-group">
            <label className="game-form-label">Torneo</label>
            <div className="edicion-card" style={{display:'flex',alignItems:'center',gap:'1rem'}}>
              <FaTrophy className="text-yellow-500 text-2xl" />
              <div>
                <span className="font-semibold text-lg">Torneo {edicionSeleccionada}</span>
                <p className="text-sm text-gray-600">
                  Última edición creada
                  {edicionesActivas.find(e => e.idEdicion === edicionSeleccionada)?.fecha_inicio && 
                   edicionesActivas.find(e => e.idEdicion === edicionSeleccionada)?.fecha_fin &&
                   ` • ${new Date(edicionesActivas.find(e => e.idEdicion === edicionSeleccionada).fecha_inicio).toLocaleDateString('es-ES')} - ${new Date(edicionesActivas.find(e => e.idEdicion === edicionSeleccionada).fecha_fin).toLocaleDateString('es-ES')}`
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Configuración de la partida */}
          <div className="game-form-group">
            <label className="game-form-label">Tipo de Partida</label>
            <div className="tipo-partida-buttons">
              <button
                onClick={() => setPartidaData(prev => ({ ...prev, tipo: 'PVP' }))}
                className={`tipo-partida-btn ${partidaData.tipo === 'PVP' ? 'active' : ''}`}
                type="button"
              >
                <FaGamepad className="mr-2" />
                PVP (1 vs 1)
              </button>
              <button
                onClick={() => setPartidaData(prev => ({ ...prev, tipo: 'TodosContraTodos' }))}
                className={`tipo-partida-btn ${partidaData.tipo === 'TodosContraTodos' ? 'active' : ''}`}
                type="button"
              >
                <FaUsers className="mr-2" />
                Todos Contra Todos
              </button>
            </div>
          </div>

          <div className="game-form-group">
            <label className="game-form-label">Fecha y Hora de la Partida</label>
            <input
              type="datetime-local"
              value={partidaData.fecha}
              onChange={(e) => setPartidaData(prev => ({ ...prev, fecha: e.target.value }))}
              className="game-form-input"
              min={new Date().toISOString().slice(0, 16)}
            />
            <small className="text-gray-500">Selecciona fecha y hora para la partida</small>
          </div>

          <div className="game-form-group">
            <label className="game-form-label">Juego</label>
            {console.log('Renderizando select de juegos. Estado:', { isLoadingJuegosEdicion, juegosEdicion: juegosEdicion.length, edicionSeleccionada })}
            {isLoadingJuegosEdicion ? (
              <div className="loading-spinner">
                <FaSpinner className="spinner-icon" />
                <span>Cargando juegos...</span>
              </div>
            ) : juegosEdicion.length === 0 ? (
              <div className="no-data">
                <p>❌ No hay juegos asignados a esta edición</p>
                <p className="text-sm text-gray-500 mt-2">Primero debes asignar juegos al torneo desde la sección "Torneos"</p>
              </div>
            ) : (
              <select
                value={partidaData.juego_id || ''}
                onChange={(e) => setPartidaData(prev => ({ ...prev, juego_id: e.target.value }))}
                className="game-form-select"
              >
                <option value="">Selecciona un juego</option>
                {juegosEdicion.map((juego) => (
                  <option key={juego.id} value={juego.id}>
                    {juego.nombre}
                  </option>
                ))}
              </select>
            )}
            <small className="text-gray-500">Selecciona el juego para la partida</small>
          </div>

          {/* Selección de jugadores */}
          <div className="game-form-group">
            <label className="game-form-label">Seleccionar Jugadores</label>
            {isLoadingJugadores ? (
              <div className="loading-spinner">
                <FaSpinner className="spinner-icon" />
                <span>Cargando jugadores...</span>
              </div>
            ) : jugadoresEdicion.length === 0 ? (
              <div className="no-data">
                <p>❌ No hay jugadores inscritos en esta edición</p>
                <p className="text-sm text-gray-500 mt-2">Primero debes asignar jugadores al torneo desde la sección "Torneos"</p>
              </div>
            ) : (
              <>
                <div className="info-card" style={{marginBottom:'1rem'}}>
                  <div className="info-item">
                    <span className="info-label">Jugadores disponibles:</span>
                    <span className="info-value">{jugadoresEdicion.length}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Jugadores seleccionados:</span>
                    <span className="info-value">{partidaData.jugadores.length}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Requeridos para {partidaData.tipo}:</span>
                    <span className="info-value">
                      {partidaData.tipo === 'PVP' ? '2 jugadores' : 'Mínimo 3 jugadores'}
                    </span>
                  </div>
                </div>
                <div className="jugadores-grid">
                  {jugadoresEdicion.map((jugador) => (
                    <div
                      key={jugador.nickname}
                      className={`jugador-card ${partidaData.jugadores.includes(jugador.nickname) ? 'selected' : ''}`}
                      onClick={() => handleJugadorPartidaToggle(jugador.nickname)}
                    >
                      <div className="jugador-avatar-container">
                        <img
                          src={jugador.foto || '/default-avatar.png'}
                          alt={jugador.nickname}
                          className="jugador-avatar"
                        />
                        <div className="jugador-selection-indicator">
                          {partidaData.jugadores.includes(jugador.nickname) && (
                            <FaCheck className="check-icon" />
                          )}
                        </div>
                      </div>
                      <div className="jugador-info">
                        <span className="jugador-nickname">{jugador.nickname}</span>
                        {jugador.descripcion && (
                          <span className="jugador-descripcion">{jugador.descripcion}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {partidaData.jugadores.length > 0 && (
                  <div className="jugadores-seleccionados-list" style={{marginTop:'1rem'}}>
                    {partidaData.jugadores.map((nickname) => {
                      const jugador = jugadoresEdicion.find(j => j.nickname === nickname);
                      return (
                        <div key={nickname} className="jugador-seleccionado-item">
                          <img
                            src={jugador?.foto || '/default-avatar.png'}
                            alt={nickname}
                            className="jugador-seleccionado-avatar"
                          />
                          <span className="jugador-seleccionado-nickname">{nickname}</span>
                          <button
                            onClick={() => handleJugadorPartidaToggle(nickname)}
                            className="remove-jugador-btn"
                            title="Quitar jugador"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
                <div className="validaciones mt-4">
                  {partidaData.tipo === 'PVP' && (
                    <div className={`validacion ${partidaData.jugadores.length === 2 ? 'valid' : 'invalid'}`}> 
                      <FaCheckCircle className={partidaData.jugadores.length === 2 ? 'text-green-500' : 'text-red-500'} />
                      <span>PVP requiere exactamente 2 jugadores</span>
                    </div>
                  )}
                  {partidaData.tipo === 'TodosContraTodos' && (
                    <div className={`validacion ${partidaData.jugadores.length >= 3 ? 'valid' : 'invalid'}`}>
                      <FaCheckCircle className={partidaData.jugadores.length >= 3 ? 'text-green-500' : 'text-red-500'} />
                      <span>Todos Contra Todos requiere al menos 3 jugadores</span>
                    </div>
                  )}
                  {!partidaData.fecha && (
                    <div className="validacion invalid">
                      <FaTimes className="text-red-500" />
                      <span>Debes seleccionar una fecha y hora para la partida</span>
                    </div>
                  )}
                  {!partidaData.juego_id && (
                    <div className="validacion invalid">
                      <FaTimes className="text-red-500" />
                      <span>Debes seleccionar un juego para la partida</span>
                    </div>
                  )}
                  {partidaData.juego_id && juegosEdicion.length === 0 && (
                    <div className="validacion invalid">
                      <FaTimes className="text-red-500" />
                      <span>No hay juegos disponibles en esta edición</span>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
          <div className="game-form-group">
            <label className="game-form-label">Fase</label>
            <select
              value={partidaData.fase}
              onChange={e => setPartidaData(prev => ({ ...prev, fase: e.target.value }))}
              className="game-form-select"
            >
              <option value="Grupos">Grupos</option>
              <option value="Cuartos">Cuartos</option>
              <option value="Semifinal">Semifinal</option>
              <option value="Final">Final</option>
            </select>
            <small className="text-gray-500">Selecciona la fase de la partida</small>
          </div>

          <div className="game-form-group">
            <label className="game-form-label">Video (opcional)</label>
            <input
              type="text"
              value={partidaData.video_url}
              onChange={e => setPartidaData(prev => ({ ...prev, video_url: e.target.value }))}
              className="game-form-input"
              placeholder="URL del video de la partida (opcional)"
            />
            <small className="text-gray-500">Puedes pegar un enlace de YouTube, Twitch, etc.</small>
          </div>

          <div className="game-form-actions" style={{display:'flex',gap:'1rem'}}>
            <button
              onClick={() => setShowCrearPartidaModal(false)}
              className="game-form-cancel"
              type="button"
            >
              Cancelar
            </button>
            <button
              onClick={handleCrearPartida}
              disabled={isSavingPartida || 
                !partidaData.fecha || 
                !partidaData.juego_id ||
                juegosEdicion.length === 0 ||
                partidaData.jugadores.length === 0 ||
                (partidaData.tipo === 'PVP' && partidaData.jugadores.length !== 2) ||
                (partidaData.tipo === 'TodosContraTodos' && partidaData.jugadores.length < 3)
              }
              className="game-form-submit"
              type="button"
            >
              {isSavingPartida ? (
                <>
                  <FaSpinner className="spinner" />
                  <span>{partidaData.id ? 'Guardando...' : 'Creando...'}</span>
                </>
              ) : (
                <>
                  <FaGamepad />
                  <span>{partidaData.id ? 'Guardar Cambios' : 'Crear Partida'}</span>
                </>
              )}
            </button>
            {/* Botón de actualizar datos eliminado */}
          </div>
        </div>
      </div>
    </div>
  );

  const PerfilJugadorModal = () => (
    <div className="modal-overlay" onClick={() => setShowPerfilModal(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Perfil del Jugador</h2>
          <button
            onClick={() => setShowPerfilModal(false)}
            className="modal-close"
          >
            <FaTimes />
          </button>
        </div>
        <div className="modal-body">
          {jugadorSeleccionado && (
            <div className="perfil-jugador-content">
              <div className="perfil-jugador-avatar">
                <img
                  src={jugadorSeleccionado.foto || '/default-avatar.png'}
                  alt={jugadorSeleccionado.nickname}
                  className="jugador-perfil-foto"
                />
              </div>
              <div className="perfil-jugador-info">
                <h3 className="perfil-jugador-nickname">{jugadorSeleccionado.nickname}</h3>
                <div className="perfil-jugador-descripcion">
                  <p>{jugadorSeleccionado.descripcion || 'Sin descripción disponible'}</p>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button
            onClick={() => setShowPerfilModal(false)}
            className="modal-button primary"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );

  const fetchUltimaEdicion = async () => {
    try {
      setServerError(false);
      const response = await axios.get(PARTIDAS_ROUTES.GET_EDICIONES_ACTIVAS, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setEdicionesActivas(response.data.data);
      }
    } catch (error) {
      console.error('Error al obtener la última edición:', error);
      if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
        setServerError(true);
        toast.error('No se puede conectar al servidor. Verifica que el servidor backend esté corriendo.');
      } else {
        toast.error('Error al cargar la última edición');
      }
    }
  };

  const fetchJuegosByEdicion = async (idEdicion) => {
    setIsLoadingJuegosEdicion(true);
    try {
      console.log('Cargando juegos para edición:', idEdicion);
      const response = await axios.get(EDICION_ROUTES.GET_JUEGOS_BY_EDICION(idEdicion), {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('Respuesta de juegos:', response.data);
      if (response.data.success) {
        setJuegosEdicion(response.data.data);
        console.log('Juegos cargados:', response.data.data);
      }
    } catch (error) {
      console.error('Error al obtener juegos de la edición:', error);
      toast.error('Error al cargar los juegos de la edición');
    } finally {
      setIsLoadingJuegosEdicion(false);
    }
  };

  const handleEditPartida = (partida) => {
    // Configurar la edición seleccionada
    setEdicionSeleccionada(partida.torneo_id);
    
    // Cargar los jugadores de la edición
    fetchJugadoresByEdicion(partida.torneo_id);
    
    // Cargar los juegos de la edición
    fetchJuegosByEdicion(partida.torneo_id);
    
    // Configurar los datos de la partida
    setPartidaData({
      id: partida.id,
      tipo: partida.tipo,
      fecha: partida.fecha ? partida.fecha.slice(0, 16) : '',
      jugadores: partida.jugadores || [], // Ahora sí tenemos los jugadores desde el backend
      juego_id: partida.juego_id,
      fase: partida.fase || 'Grupos',
      video_url: partida.video_url || ''
    });
    
    setShowCrearPartidaModal(true);
  };

  const handleRegistrarResultado = async (partida) => {
    setPartidaResultado(partida);
    
    try {
      // Cargar los puntos configurados para el tipo de partida
      const response = await axios.get(PUNTOS_ROUTES.GET_BY_TIPO(partida.tipo), {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      let puntosConfigurados = [];
      if (response.data.success) {
        puntosConfigurados = response.data.data;
      }
      
      // Inicializar los datos de resultados con los jugadores de la partida
      const resultadosIniciales = partida.jugadores.map((jugador, index) => {
        // Buscar los puntos correspondientes a la posición
        const puntosParaPosicion = puntosConfigurados.find(p => p.posicion === index + 1);
        const puntos = puntosParaPosicion ? puntosParaPosicion.puntos : 0;
        
        return {
          jugador_nickname: jugador,
          posicion: index + 1,
          gano: false,
          puntos: puntos
        };
      });
      
      setResultadosData(resultadosIniciales);
      setShowResultadoModal(true);
    } catch (error) {
      console.error('Error al cargar puntos configurados:', error);
      // Si no se pueden cargar los puntos, usar valores por defecto
      const resultadosIniciales = partida.jugadores.map((jugador, index) => ({
        jugador_nickname: jugador,
        posicion: index + 1,
        gano: false,
        puntos: 0
      }));
      
      setResultadosData(resultadosIniciales);
      setShowResultadoModal(true);
    }
  };

  const handleVerResultado = async (partida) => {
    try {
      const response = await axios.get(PARTIDAS_ROUTES.GET_RESULTADO(partida.id), {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setPartidaResultado(partida);
        setResultadosData(response.data.data.map(resultado => ({
          jugador_nickname: resultado.jugador_nickname,
          posicion: resultado.posicion,
          gano: resultado.gano === 1,
          puntos: resultado.puntos
        })));
        setShowResultadoModal(true);
      }
    } catch (error) {
      console.error('Error al obtener resultado:', error);
      toast.error('Error al cargar el resultado de la partida');
    }
  };

  const ResultadoModal = () => {
    const isViewingExisting = partidaResultado?.tiene_resultado;
    const [puntosConfigurados, setPuntosConfigurados] = useState([]);
    
    // Cargar puntos configurados cuando se abre el modal
    useEffect(() => {
      if (partidaResultado && !isViewingExisting) {
        cargarPuntosConfigurados();
      }
    }, [partidaResultado]);
    
    const cargarPuntosConfigurados = async () => {
      try {
        const response = await axios.get(PUNTOS_ROUTES.GET_BY_TIPO(partidaResultado.tipo), {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data.success) {
          setPuntosConfigurados(response.data.data);
        }
      } catch (error) {
        console.error('Error al cargar puntos configurados:', error);
        setPuntosConfigurados([]);
      }
    };
    
    const handleGanadorChange = (jugadorNickname) => {
      if (isViewingExisting) return; // No permitir cambios en modo vista
      setResultadosData(prev => prev.map(resultado => ({
        ...resultado,
        gano: resultado.jugador_nickname === jugadorNickname
      })));
    };

    const handlePosicionChange = (jugadorNickname, nuevaPosicion) => {
      if (isViewingExisting) return; // No permitir cambios en modo vista
      
      // Buscar los puntos para la nueva posición
      const puntosParaPosicion = puntosConfigurados.find(p => p.posicion === nuevaPosicion);
      const nuevosPuntos = puntosParaPosicion ? puntosParaPosicion.puntos : 0;
      
      setResultadosData(prev => prev.map(resultado => ({
        ...resultado,
        posicion: resultado.jugador_nickname === jugadorNickname ? nuevaPosicion : resultado.posicion,
        puntos: resultado.jugador_nickname === jugadorNickname ? nuevosPuntos : resultado.puntos
      })));
    };

    const handlePuntosChange = (jugadorNickname, puntos) => {
      if (isViewingExisting) return; // No permitir cambios en modo vista
      setResultadosData(prev => prev.map(resultado => ({
        ...resultado,
        puntos: resultado.jugador_nickname === jugadorNickname ? parseInt(puntos) || 0 : resultado.puntos
      })));
    };

    const handleGuardarResultado = async () => {
      if (!partidaResultado) return;

      // Validar que solo haya un ganador
      const ganadores = resultadosData.filter(r => r.gano);
      if (ganadores.length !== 1) {
        toast.error('Debe seleccionar exactamente un ganador');
        return;
      }

      // Validar que las posiciones sean únicas
      const posiciones = resultadosData.map(r => r.posicion);
      const posicionesUnicas = new Set(posiciones);
      if (posicionesUnicas.size !== posiciones.length) {
        toast.error('Las posiciones deben ser únicas');
        return;
      }

      setIsSavingResultado(true);
      try {
        const response = await axios.post(
          PARTIDAS_ROUTES.REGISTRAR_RESULTADO(partidaResultado.id),
          {
            resultados: resultadosData,
            fase: partidaResultado.fase
          },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        if (response.data.success) {
          toast.success('Resultado registrado exitosamente');
          setShowResultadoModal(false);
          setPartidaResultado(null);
          setResultadosData([]);
          await fetchPartidas(); // Recargar partidas para mostrar el estado actualizado
        }
      } catch (error) {
        console.error('Error al registrar resultado:', error);
        toast.error(error.response?.data?.message || 'Error al registrar el resultado');
      } finally {
        setIsSavingResultado(false);
      }
    };

    return (
      <div className="game-modal">
        <div className="game-modal-content" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
          <div className="game-modal-header">
            <h3 className="game-modal-title">
              {isViewingExisting ? 'Ver Resultado' : 'Registrar Resultado'} - Partida #{partidaResultado?.id}
            </h3>
            <button
              onClick={() => setShowResultadoModal(false)}
              className="game-modal-close"
            >
              <FaTimes />
            </button>
          </div>

          <div className="game-form-container">
            {/* Información de la partida */}
            <div className="partida-info-card">
              <h4 className="text-lg font-semibold mb-3">Información de la Partida</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-medium">Juego:</span>
                  <span className="ml-2">{partidaResultado?.juego_nombre}</span>
                </div>
                <div>
                  <span className="font-medium">Tipo:</span>
                  <span className="ml-2">{partidaResultado?.tipo}</span>
                </div>
                <div>
                  <span className="font-medium">Fase:</span>
                  <span className="ml-2">{partidaResultado?.fase}</span>
                </div>
                <div>
                  <span className="font-medium">Fecha:</span>
                  <span className="ml-2">{partidaResultado?.fecha ? new Date(partidaResultado.fecha).toLocaleDateString('es-ES') : 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Información de puntos configurados */}
            {!isViewingExisting && puntosConfigurados.length > 0 && (
              <div className="puntos-configurados-card">
                <h4 className="text-lg font-semibold mb-3">Puntos Configurados para {partidaResultado?.tipo}</h4>
                <div className="puntos-configurados-grid">
                  {puntosConfigurados
                    .sort((a, b) => a.posicion - b.posicion)
                    .map(punto => (
                      <div key={punto.posicion} className="punto-configurado-item">
                        <span className="punto-posicion">
                          {punto.posicion === 1 && '🥇'}
                          {punto.posicion === 2 && '🥈'}
                          {punto.posicion === 3 && '🥉'}
                          {punto.posicion > 3 && `#${punto.posicion}`}
                        </span>
                        <span className="punto-valor">{punto.puntos} pts</span>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Tabla de resultados */}
            <div className="resultados-section">
              <h4 className="text-lg font-semibold mb-3">Resultados de los Jugadores</h4>
              <div className="resultados-table-container">
                <table className="resultados-table">
                  <thead>
                    <tr>
                      <th>Jugador</th>
                      <th>Posición</th>
                      <th>Ganador</th>
                      <th>Puntos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resultadosData.map((resultado, index) => (
                      <tr key={resultado.jugador_nickname}>
                        <td>
                          <div className="flex items-center gap-2">
                            <img
                              src="/default-avatar.png"
                              alt={resultado.jugador_nickname}
                              className="jugador-avatar-small"
                            />
                            <span>{resultado.jugador_nickname}</span>
                          </div>
                        </td>
                        <td>
                          {isViewingExisting ? (
                            <span className="posicion-display">{resultado.posicion}</span>
                          ) : (
                            <select
                              value={resultado.posicion}
                              onChange={(e) => handlePosicionChange(resultado.jugador_nickname, parseInt(e.target.value))}
                              className="posicion-select"
                            >
                              {resultadosData.map((_, i) => (
                                <option key={i + 1} value={i + 1}>
                                  {i + 1}
                                </option>
                              ))}
                            </select>
                          )}
                        </td>
                        <td>
                          {isViewingExisting ? (
                            <span className={`ganador-display ${resultado.gano ? 'ganador' : 'no-ganador'}`}>
                              {resultado.gano ? '🥇 Ganador' : '-'}
                            </span>
                          ) : (
                            <input
                              type="radio"
                              name="ganador"
                              checked={resultado.gano}
                              onChange={() => handleGanadorChange(resultado.jugador_nickname)}
                              className="ganador-radio"
                            />
                          )}
                        </td>
                        <td>
                          {isViewingExisting ? (
                            <span className="puntos-display">{resultado.puntos} pts</span>
                          ) : (
                            <input
                              type="number"
                              value={resultado.puntos}
                              onChange={(e) => handlePuntosChange(resultado.jugador_nickname, e.target.value)}
                              className="puntos-input"
                              min="0"
                              placeholder="0"
                            />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Información sobre puntos */}
            {partidaResultado?.fase === 'Grupos' && (
              <div className="puntos-info">
                <p className="text-sm text-gray-600">
                  <strong>Nota:</strong> Los puntos se sumarán a la tabla general solo en la fase de Grupos.
                </p>
              </div>
            )}

            {/* Botones de acción */}
            <div className="game-form-actions" style={{display:'flex',gap:'1rem'}}>
              <button
                onClick={() => setShowResultadoModal(false)}
                className="game-form-cancel"
                type="button"
              >
                {isViewingExisting ? 'Cerrar' : 'Cancelar'}
              </button>
              {!isViewingExisting && (
                <button
                  onClick={handleGuardarResultado}
                  disabled={isSavingResultado}
                  className="game-form-submit"
                  type="button"
                >
                  {isSavingResultado ? (
                    <>
                      <FaSpinner className="spinner" />
                      <span>Guardando...</span>
                    </>
                  ) : (
                    <>
                      <FaTrophy />
                      <span>Guardar Resultado</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Funciones para el módulo de entradas
  const fetchEntradas = async () => {
    setIsLoadingEntradas(true);
    try {
      const response = await axios.get(ENTRADAS_ROUTES.GET_ALL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setEntradas(response.data.data);
      }
    } catch (error) {
      console.error('Error al obtener entradas:', error);
      toast.error('Error al cargar las entradas');
    } finally {
      setIsLoadingEntradas(false);
    }
  };

  const fetchConfiguracionInicio = async () => {
    try {
      const response = await axios.get(CONFIGURACION_ROUTES.GET_INICIO, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setConfiguracionInicio(response.data.data);
      }
    } catch (error) {
      console.error('Error al obtener configuración:', error);
      // Usar configuración por defecto si hay error
    }
  };

  const handleSaveEntrada = async () => {
    const { titulo, contenido, orden, visible } = entradaData;

    if (!titulo.trim() || !contenido.trim()) {
      toast.error('Por favor completa todos los campos obligatorios');
      return;
    }

    setIsSavingEntrada(true);
    try {
      const formData = new FormData();
      formData.append('titulo', titulo.trim());
      formData.append('contenido', contenido.trim());
      formData.append('orden', orden);
      formData.append('visible', visible);

      if (entradaFile) {
        formData.append('imagen', entradaFile);
      }

      let response;
      if (entradaData.id) {
        // Actualizar entrada existente
        response = await axios.put(ENTRADAS_ROUTES.UPDATE(entradaData.id), formData, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        toast.success('Entrada actualizada correctamente');
      } else {
        // Crear nueva entrada
        response = await axios.post(ENTRADAS_ROUTES.CREATE, formData, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        toast.success('Entrada creada correctamente');
      }

      setShowEntradaModal(false);
      setEntradaData({ id: null, titulo: '', contenido: '', imagen_url: '', orden: entradas.length + 1, visible: true });
      setEntradaFile(null);
      setEntradaImagePreview(null);
      await fetchEntradas();
    } catch (error) {
      console.error('Error al guardar entrada:', error);
      toast.error(error.response?.data?.message || 'Error al guardar la entrada');
    } finally {
      setIsSavingEntrada(false);
    }
  };

  const handleDeleteEntrada = async (id) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta entrada?')) {
      return;
    }

    try {
      await axios.delete(ENTRADAS_ROUTES.DELETE(id), {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Entrada eliminada correctamente');
      await fetchEntradas();
    } catch (error) {
      console.error('Error al eliminar entrada:', error);
      toast.error('Error al eliminar la entrada');
    }
  };

  const handleEditEntrada = (entrada) => {
    setEntradaData(entrada);
    setEntradaImagePreview(entrada.imagen_url);
    setShowEntradaModal(true);
  };

  const handleSaveConfiguracionInicio = async () => {
    setIsSavingConfiguracion(true);
    try {
      // Guardar configuración del inicio
      await axios.put(CONFIGURACION_ROUTES.UPDATE_INICIO, configuracionInicio, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Guardar configuración de la ruleta
      await axios.put(RULETA_ROUTES.UPDATE_CONFIGURACION, configuracionRuleta, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success('Configuración guardada correctamente');
    } catch (error) {
      console.error('Error al guardar configuración:', error);
      toast.error('Error al guardar la configuración');
    } finally {
      setIsSavingConfiguracion(false);
    }
  };

  // Funciones para gestionar jugadores en el inicio
  const fetchJugadoresInicio = async () => {
    setIsLoadingJugadoresInicio(true);
    try {
      const response = await axios.get(TORNEO_ROUTES.GET_JUGADORES_INICIO, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setJugadoresInicio(response.data.data);
      }
    } catch (error) {
      console.error('Error al obtener jugadores del inicio:', error);
      toast.error('Error al cargar los jugadores del inicio');
    } finally {
      setIsLoadingJugadoresInicio(false);
    }
  };

  const fetchJugadoresDisponiblesInicio = async () => {
    try {
      const response = await axios.get(ADMIN_ROUTES.GET_ALL_USERS, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        // Filtrar solo usuarios con rol 2 (jugadores)
        const jugadores = response.data.data.filter(usuario => usuario.rol === 2);
        setJugadoresDisponiblesInicio(jugadores);
      }
    } catch (error) {
      console.error('Error al obtener jugadores disponibles:', error);
      toast.error('Error al cargar los jugadores disponibles');
    }
  };

  const handleJugadorInicioToggle = (nickname) => {
    setJugadoresSeleccionadosInicio(prev => 
      prev.includes(nickname) 
        ? prev.filter(nick => nick !== nickname)
        : [...prev, nickname]
    );
  };

  const handleSaveJugadoresInicio = async () => {
    setIsSavingJugadoresInicio(true);
    try {
      const response = await axios.post(TORNEO_ROUTES.SET_JUGADORES_INICIO, {
        jugadores: jugadoresSeleccionadosInicio
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        toast.success('Jugadores del inicio actualizados correctamente');
        setShowJugadoresInicioModal(false);
        await fetchJugadoresInicio(); // Recargar la lista
      }
    } catch (error) {
      console.error('Error al guardar jugadores del inicio:', error);
      toast.error('Error al guardar los jugadores del inicio');
    } finally {
      setIsSavingJugadoresInicio(false);
    }
  };

  // Componente visual para Entradas
  const EntradasContent = () => (
    <div className="content-section">
      <div className="games-header">
        <h2 className="games-title">Gestión de Entradas de Inicio</h2>
        <button
          className="add-game-button"
          onClick={() => {
            setEntradaData({ id: null, titulo: '', contenido: '', orden: entradas.length + 1, visible: true });
            setShowEntradaModal(true);
          }}
        >
          <FaPlus /> Nueva Entrada
        </button>
      </div>

      {/* Configuración de inicio */}
      <div className="p-4 mb-4 bg-gray-100 rounded">
        <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input
            type="checkbox"
            checked={configuracionInicio.mostrarTablaGeneral}
            onChange={e => setConfiguracionInicio(prev => ({ ...prev, mostrarTablaGeneral: e.target.checked }))}
          />
          Mostrar tabla general en el inicio
        </label>
        
        {/* Configuración de la ruleta */}
        <div style={{ marginTop: 16, padding: 12, border: '1px solid #d1d5db', borderRadius: 8 }}>
          <h4 className="font-semibold mb-3">🎰 Configuración de la Ruleta</h4>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <input
              type="checkbox"
              checked={configuracionRuleta.ruleta_activa}
              onChange={e => setConfiguracionRuleta(prev => ({ ...prev, ruleta_activa: e.target.checked }))}
            />
            Activar ruleta en la página de inicio
          </label>
          <div style={{ marginTop: 8 }}>
            <label className="text-sm text-gray-600">Máximo de giros por día:</label>
            <input
              type="number"
              min="1"
              max="10"
              value={configuracionRuleta.max_giros_por_dia}
              onChange={e => setConfiguracionRuleta(prev => ({ ...prev, max_giros_por_dia: parseInt(e.target.value) }))}
              className="w-20 px-2 py-1 border border-gray-300 rounded ml-2"
            />
          </div>
        </div>
        
        <div style={{ marginTop: 12 }}>
          <label className="font-semibold">Orden de secciones en el inicio:</label>
          <ol style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 8 }}>
            {configuracionInicio.ordenSecciones.map((sec, idx) => (
              <li key={sec} style={{ background: '#e5e7eb', borderRadius: 8, padding: '4px 12px', display: 'flex', alignItems: 'center', gap: 4 }}>
                <span>{idx + 1}. {sec}</span>
                {idx > 0 && (
                  <button onClick={() => {
                    const nuevoOrden = [...configuracionInicio.ordenSecciones];
                    [nuevoOrden[idx - 1], nuevoOrden[idx]] = [nuevoOrden[idx], nuevoOrden[idx - 1]];
                    setConfiguracionInicio(prev => ({ ...prev, ordenSecciones: nuevoOrden }));
                  }} title="Subir" style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
                    ▲
                  </button>
                )}
                {idx < configuracionInicio.ordenSecciones.length - 1 && (
                  <button onClick={() => {
                    const nuevoOrden = [...configuracionInicio.ordenSecciones];
                    [nuevoOrden[idx + 1], nuevoOrden[idx]] = [nuevoOrden[idx], nuevoOrden[idx + 1]];
                    setConfiguracionInicio(prev => ({ ...prev, ordenSecciones: nuevoOrden }));
                  }} title="Bajar" style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
                    ▼
                  </button>
                )}
              </li>
            ))}
          </ol>
        </div>
        <button
          className="profile-button profile-button-primary mt-2"
          style={{ marginTop: 16 }}
          onClick={handleSaveConfiguracionInicio}
          disabled={isSavingConfiguracion}
        >
          {isSavingConfiguracion ? 'Guardando...' : 'Guardar Configuración'}
        </button>
      </div>

      {/* Gestión de jugadores en el inicio */}
      <div className="p-4 mb-4 bg-gray-100 rounded">
        <h3 className="text-lg font-semibold mb-3">Jugadores en la Página Principal</h3>
        <p className="text-gray-600 mb-3">
          Selecciona qué jugadores aparecerán en la sección "Jugadores del Torneo" en la página principal.
          Los usuarios podrán hacer clic en ellos para ver su información.
        </p>
        
        {isLoadingJugadoresInicio ? (
          <div className="loading-spinner">
            <FaSpinner className="spinner-icon" />
            <span>Cargando jugadores...</span>
          </div>
        ) : (
          <div className="jugadores-inicio-section">
            <div className="jugadores-actuales">
              <h4 className="font-semibold mb-2">Jugadores actualmente mostrados:</h4>
              {jugadoresInicio.length === 0 ? (
                <p className="text-gray-500">No hay jugadores configurados para mostrar en el inicio</p>
              ) : (
                <div className="jugadores-grid">
                  {jugadoresInicio.map(jugador => (
                    <div key={jugador.nickname} className="jugador-card-inicio">
                      <img
                        src={jugador.foto_perfil || '/default-profile.png'}
                        alt={jugador.nickname}
                        className="jugador-avatar-small"
                      />
                      <span className="jugador-nickname">{jugador.nickname}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <button
              className="add-game-button"
              onClick={() => {
                fetchJugadoresDisponiblesInicio();
                setJugadoresSeleccionadosInicio(jugadoresInicio.map(j => j.nickname));
                setShowJugadoresInicioModal(true);
              }}
              style={{ marginTop: 16 }}
            >
              <FaUsers /> Gestionar Jugadores del Inicio
            </button>
          </div>
        )}
      </div>

      {/* Tabla de entradas */}
      <div className="games-table-container">
        {isLoadingEntradas ? (
          <div className="loading-spinner">
            <FaSpinner className="spinner-icon" />
            <span>Cargando entradas...</span>
          </div>
        ) : entradas.length === 0 ? (
          <div className="no-data">No hay entradas registradas</div>
        ) : (
          <table className="games-table">
            <thead>
              <tr>
                <th>Orden</th>
                <th>Título</th>
                <th>Tipo</th>
                <th>Visible</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {entradas.sort((a, b) => a.orden - b.orden).map((entrada, idx) => (
                <tr key={entrada.id}>
                  <td>{entrada.orden}</td>
                  <td>{entrada.titulo}</td>
                  <td>{entrada.tipo}</td>
                  <td>
                    <button
                      onClick={() => handleSaveEntrada({ ...entrada, visible: !entrada.visible })}
                      className={`transition-colors p-2 ${entrada.visible ? 'text-green-600' : 'text-gray-400'}`}
                      title={entrada.visible ? 'Ocultar' : 'Mostrar'}
                    >
                      {entrada.visible ? <FaEye /> : <EyeOff size={16} />}
                    </button>
                  </td>
                  <td>
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => handleEditEntrada(entrada)}
                        className="text-blue-600 hover:text-blue-800 transition-colors p-2"
                        title="Editar entrada"
                      >
                        <FaPen />
                      </button>
                      <button
                        onClick={() => handleDeleteEntrada(entrada.id)}
                        className="text-red-600 hover:text-red-800 transition-colors p-2"
                        title="Eliminar entrada"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal para crear/editar entrada */}
      {showEntradaModal && (
        <div className="game-modal">
          <div className="game-modal-content">
            <div className="game-modal-header">
              <h3 className="game-modal-title">{entradaData.id ? 'Editar Entrada' : 'Nueva Entrada'}</h3>
              <button
                onClick={() => setShowEntradaModal(false)}
                className="game-modal-close"
              >
                <FaTimes />
              </button>
            </div>
            <div className="game-form-container">
              <div className="game-form-row">
                <div className="game-form-image-section">
                  <label className="game-form-label">Imagen de la entrada (opcional)</label>
                  <div 
                    className="game-image-preview cursor-pointer" 
                    onClick={handleEntradaImageClick}
                    style={{ 
                      height: '200px', 
                      position: 'relative', 
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '0.5rem',
                      border: '2px dashed #e5e7eb'
                    }}
                  >
                    <input
                      type="file"
                      ref={entradaFileInputRef}
                      onChange={handleEntradaFileChange}
                      accept="image/jpeg,image/png,image/gif"
                      className="hidden"
                    />
                    {entradaImagePreview ? (
                      <img
                        src={entradaImagePreview}
                        alt="Vista previa"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain'
                        }}
                      />
                    ) : (
                      <div className="upload-placeholder">
                        <FaCamera className="text-gray-400 text-3xl mb-2" />
                        <span className="text-sm text-gray-500 text-center px-2">
                          {entradaData.id ? 'Cambiar imagen' : 'Subir imagen'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="game-form-fields-section">
                  <div className="game-form-group">
                    <label className="game-form-label">Título</label>
                    <input
                      type="text"
                      className="game-form-input"
                      value={entradaData.titulo}
                      onChange={e => setEntradaData(prev => ({ ...prev, titulo: e.target.value }))}
                      placeholder="Título de la entrada"
                    />
                  </div>
                  <div className="game-form-group">
                    <label className="game-form-label">Contenido</label>
                    <textarea
                      className="game-form-input"
                      value={entradaData.contenido}
                      onChange={e => setEntradaData(prev => ({ ...prev, contenido: e.target.value }))}
                      placeholder="Contenido de la entrada"
                      rows={4}
                    />
                  </div>
                  <div className="game-form-group">
                    <label className="game-form-label">Orden</label>
                    <input
                      type="number"
                      className="game-form-input"
                      value={entradaData.orden}
                      onChange={e => setEntradaData(prev => ({ ...prev, orden: parseInt(e.target.value) }))}
                      min={1}
                    />
                  </div>
                  <div className="game-form-group">
                    <label className="game-form-label">
                      <input
                        type="checkbox"
                        checked={entradaData.visible}
                        onChange={e => setEntradaData(prev => ({ ...prev, visible: e.target.checked }))}
                        className="mr-2"
                      />
                      Visible
                    </label>
                  </div>
                </div>
              </div>
              <button
                onClick={handleSaveEntrada}
                disabled={isSavingEntrada}
                className="game-form-submit"
              >
                {isSavingEntrada ? (
                  <>
                    <FaSpinner className="spinner" />
                    <span>Guardando...</span>
                  </>
                ) : (
                  <>
                    <FaCheck />
                    <span>{entradaData.id ? 'Guardar Cambios' : 'Crear Entrada'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para gestionar jugadores del inicio */}
      {showJugadoresInicioModal && (
        <div className="game-modal">
          <div className="game-modal-content">
            <div className="game-modal-header">
              <h3 className="game-modal-title">Gestionar Jugadores del Inicio</h3>
              <button
                onClick={() => setShowJugadoresInicioModal(false)}
                className="game-modal-close"
              >
                <FaTimes />
              </button>
            </div>
            <div className="game-form-container">
              <p className="text-gray-600 mb-4">
                Selecciona los jugadores que aparecerán en la página principal. 
                Los usuarios podrán hacer clic en ellos para ver su información.
              </p>
              
              {jugadoresDisponiblesInicio.length === 0 ? (
                <div className="loading-spinner">
                  <FaSpinner className="spinner-icon" />
                  <span>Cargando jugadores disponibles...</span>
                </div>
              ) : (
                <div className="jugadores-grid">
                  {jugadoresDisponiblesInicio.map(jugador => (
                    <div key={jugador.nickname} className="jugador-checkbox">
                      <input
                        type="checkbox"
                        id={`jugador-inicio-${jugador.nickname}`}
                        checked={jugadoresSeleccionadosInicio.includes(jugador.nickname)}
                        onChange={() => handleJugadorInicioToggle(jugador.nickname)}
                        className="checkbox-input"
                      />
                      <label htmlFor={`jugador-inicio-${jugador.nickname}`} className="checkbox-label">
                        <img
                          src={jugador.foto || '/default-profile.png'}
                          alt={jugador.nickname}
                          className="jugador-thumbnail"
                        />
                        <div className="jugador-info">
                          <span className="jugador-nickname">{jugador.nickname}</span>
                          <span className="jugador-email">{jugador.email}</span>
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              )}

              <div className="game-form-actions" style={{display:'flex',gap:'1rem'}}>
                <button
                  onClick={() => setShowJugadoresInicioModal(false)}
                  className="game-form-cancel"
                  type="button"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveJugadoresInicio}
                  disabled={isSavingJugadoresInicio}
                  className="game-form-submit"
                  type="button"
                >
                  {isSavingJugadoresInicio ? (
                    <>
                      <FaSpinner className="spinner" />
                      <span>Guardando...</span>
                    </>
                  ) : (
                    <>
                      <FaSave />
                      <span>Guardar Jugadores</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const handleRuletaImageClick = () => {
    ruletaFileInputRef.current.click();
  };

  const handleRuletaFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith('image/')) {
        toast.error('Por favor selecciona una imagen');
        return;
      }

      if (selectedFile.size > 2 * 1024 * 1024) {
        toast.error('La imagen no puede ser mayor a 2MB');
        return;
      }

      setRuletaFile(selectedFile);

      const reader = new FileReader();
      reader.onloadend = () => {
        setRuletaImagePreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const fetchRuletaItems = async () => {
    setIsLoadingRuleta(true);
    try {
      const response = await axios.get('/api/ruleta', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setRuletaItems(response.data.data);
      }
    } catch (error) {
      console.error('Error al obtener elementos de ruleta:', error);
      toast.error('Error al cargar los elementos de ruleta');
    } finally {
      setIsLoadingRuleta(false);
    }
  };

  const fetchConfiguracionRuleta = async () => {
    try {
      const response = await axios.get('/api/ruleta/configuracion', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setConfiguracionRuleta(response.data.data);
      }
    } catch (error) {
      console.error('Error al obtener configuración de ruleta:', error);
    }
  };

  const handleSaveRuletaItem = async () => {
    const { nombre, tipo, comodin_id, puntos, activo } = ruletaData;

    if (!nombre.trim()) {
      toast.error('Por favor ingresa un nombre');
      return;
    }

    if (tipo === 'comodin' && !comodin_id) {
      toast.error('Por favor selecciona un comodín');
      return;
    }

    if (tipo === 'puntos' && puntos === 0) {
      toast.error('Por favor ingresa la cantidad de puntos');
      return;
    }

    setIsSavingRuleta(true);
    try {
      const data = {
        nombre: nombre.trim(),
        tipo: tipo,
        activo: activo
      };

      if (tipo === 'comodin') {
        data.comodin_id = comodin_id;
      } else if (tipo === 'puntos') {
        data.puntos = puntos;
      }

      let response;
      if (ruletaData.id) {
        response = await axios.put(`/api/ruleta/${ruletaData.id}`, data, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        toast.success('Elemento de ruleta actualizado correctamente');
      } else {
        response = await axios.post('/api/ruleta', data, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        toast.success('Elemento de ruleta creado correctamente');
      }

      setShowRuletaModal(false);
      setRuletaData({ id: null, nombre: '', tipo: 'comodin', comodin_id: null, puntos: 0, activo: true });
      await fetchRuletaItems();
    } catch (error) {
      console.error('Error al guardar elemento de ruleta:', error);
      toast.error(error.response?.data?.message || 'Error al guardar el elemento de ruleta');
    } finally {
      setIsSavingRuleta(false);
    }
  };

  const handleDeleteRuletaItem = async (id) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este elemento de la ruleta?')) {
      return;
    }

    try {
      await axios.delete(`/api/ruleta/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Elemento de ruleta eliminado correctamente');
      await fetchRuletaItems();
    } catch (error) {
      console.error('Error al eliminar elemento de ruleta:', error);
      toast.error('Error al eliminar el elemento de ruleta');
    }
  };

  const handleEditRuletaItem = (item) => {
    // Extraer puntos del texto_personalizado si es de tipo puntos
    let puntos = 0;
    if (item.tipo === 'puntos' && item.texto_personalizado) {
      puntos = parseInt(item.texto_personalizado) || 0;
    }
    
    setRuletaData({
      id: item.id,
      nombre: item.nombre,
      tipo: item.tipo,
      comodin_id: item.comodin_id,
      puntos: puntos,
      activo: item.activo
    });
    setShowRuletaModal(true);
    
    // Cargar comodines si no están cargados y el elemento es de tipo comodín
    if (item.tipo === 'comodin' && comodines.length === 0) {
      fetchComodines();
    }
  };

  const handleSaveConfiguracionRuleta = async () => {
    setIsSavingConfiguracionRuleta(true);
    try {
      await axios.put('/api/ruleta/configuracion', configuracionRuleta, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Configuración de ruleta guardada correctamente');
    } catch (error) {
      console.error('Error al guardar configuración de ruleta:', error);
      toast.error('Error al guardar la configuración de ruleta');
    } finally {
      setIsSavingConfiguracionRuleta(false);
    }
  };

  // Funciones para gestionar logros y comodines de usuarios
  const fetchUsuarioLogros = async () => {
    setIsLoadingUsuarioLogros(true);
    try {
      const response = await axios.get(USUARIOS_ROUTES.GET_LOGROS);
      
      if (response.data.success) {
        setUsuarioLogros(response.data.data);
      }
    } catch (error) {
      console.error('Error al obtener logros de usuarios:', error);
      toast.error('Error al cargar los logros de usuarios');
    } finally {
      setIsLoadingUsuarioLogros(false);
    }
  };

  const fetchUsuarioComodines = async () => {
    setIsLoadingUsuarioComodines(true);
    try {
      const response = await axios.get(USUARIOS_ROUTES.GET_COMODINES);
      
      if (response.data.success) {
        setUsuarioComodines(response.data.data);
      }
    } catch (error) {
      console.error('Error al obtener comodines de usuarios:', error);
      toast.error('Error al cargar los comodines de usuarios');
    } finally {
      setIsLoadingUsuarioComodines(false);
    }
  };

  const handleAsignarLogro = async () => {
    const { usuario_nickname, logro_id } = logroAsignacionData;

    if (!usuario_nickname || !logro_id) {
      toast.error('Por favor selecciona un usuario y un logro');
      return;
    }

    setIsSavingLogroAsignacion(true);
    try {
      await axios.post(USUARIOS_ROUTES.POST_LOGROS, logroAsignacionData);
      toast.success('Logro asignado correctamente');
      setShowAsignarLogroModal(false);
      setLogroAsignacionData({ usuario_nickname: '', logro_id: null });
      await fetchUsuarioLogros();
    } catch (error) {
      console.error('Error al asignar logro:', error);
      toast.error(error.response?.data?.message || 'Error al asignar el logro');
    } finally {
      setIsSavingLogroAsignacion(false);
    }
  };

  const handleEliminarLogroUsuario = async (id) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este logro del usuario?')) {
      return;
    }

    try {
      await axios.delete(USUARIOS_ROUTES.DELETE_LOGROS(id));
      toast.success('Logro eliminado correctamente');
      await fetchUsuarioLogros();
    } catch (error) {
      console.error('Error al eliminar logro:', error);
      toast.error('Error al eliminar el logro');
    }
  };

  const handleEliminarComodinUsuario = async (id) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este comodín del usuario?')) {
      return;
    }

    try {
      await axios.delete(USUARIOS_ROUTES.DELETE_COMODINES(id));
      toast.success('Comodín eliminado correctamente');
      await fetchUsuarioComodines();
    } catch (error) {
      console.error('Error al eliminar comodín:', error);
      toast.error('Error al eliminar el comodín');
    }
  };

  // Componente visual para Ruleta
  const RuletaContent = () => (
    <div className="content-section">
      <div className="games-header">
        <h2 className="games-title">Gestión de Ruleta</h2>
        <button
          className="add-game-button"
          onClick={() => {
            setRuletaData({ id: null, nombre: '', tipo: 'comodin', comodin_id: null, puntos: 0, activo: true });
            setShowRuletaModal(true);
            if (comodines.length === 0) {
              fetchComodines();
            }
          }}
        >
          <FaPlus /> Nuevo Elemento
        </button>
      </div>

      {/* Configuración de ruleta */}
      <div className="p-4 mb-4 bg-gray-100 rounded">
        <h3 className="text-lg font-semibold mb-3">Configuración General</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                type="checkbox"
                checked={configuracionRuleta.ruleta_activa}
                onChange={e => setConfiguracionRuleta(prev => ({ ...prev, ruleta_activa: e.target.checked }))}
              />
              Ruleta activa (visible para jugadores)
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Máximo de giros por día:
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={configuracionRuleta.max_giros_por_dia}
              onChange={e => setConfiguracionRuleta(prev => ({ ...prev, max_giros_por_dia: parseInt(e.target.value) }))}
              className="w-20 px-2 py-1 border border-gray-300 rounded"
            />
          </div>
        </div>
        <button
          className="profile-button profile-button-primary mt-3"
          onClick={handleSaveConfiguracionRuleta}
          disabled={isSavingConfiguracionRuleta}
        >
          {isSavingConfiguracionRuleta ? 'Guardando...' : 'Guardar Configuración'}
        </button>
      </div>

      {/* Lista de elementos de ruleta */}
      <div className="games-table-container">
        {isLoadingRuleta ? (
          <div className="loading-spinner">
            <FaSpinner className="spinner-icon" />
            <span>Cargando elementos de ruleta...</span>
          </div>
        ) : ruletaItems.length === 0 ? (
          <div className="no-data">No hay elementos de ruleta registrados</div>
        ) : (
          <table className="games-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Tipo</th>
                <th>Valor</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ruletaItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.nombre}</td>
                  <td>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                      item.tipo === 'comodin' 
                        ? 'bg-blue-100 text-blue-800'
                        : item.tipo === 'puntos'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {item.tipo === 'comodin' ? 'Comodín' : 
                       item.tipo === 'puntos' ? 'Puntos' : 'Personalizado'}
                    </span>
                  </td>
                  <td>
                    {item.tipo === 'comodin' && item.comodin_nombre && (
                      <span className="text-blue-600">{item.comodin_nombre}</span>
                    )}
                    {item.tipo === 'puntos' && item.texto_personalizado && (
                      <span className={`font-bold ${item.texto_personalizado.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                        {item.texto_personalizado} puntos
                      </span>
                    )}
                    {item.tipo === 'personalizado' && (
                      <span className="text-gray-600">{item.texto_personalizado || 'Sin texto'}</span>
                    )}
                  </td>
                  <td>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                      item.activo 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {item.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => handleEditRuletaItem(item)}
                        className="text-blue-600 hover:text-blue-800 transition-colors p-2"
                        title="Editar elemento"
                      >
                        <FaPen />
                      </button>
                      <button
                        onClick={() => handleDeleteRuletaItem(item.id)}
                        className="text-red-600 hover:text-red-800 transition-colors p-2"
                        title="Eliminar elemento"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal para crear/editar elemento de ruleta */}
      {showRuletaModal && (
        <div className="game-modal">
          <div className="game-modal-content">
            <div className="game-modal-header">
              <h3 className="game-modal-title">{ruletaData.id ? 'Editar Elemento' : 'Nuevo Elemento de Ruleta'}</h3>
              <button
                onClick={() => setShowRuletaModal(false)}
                className="game-modal-close"
              >
                <FaTimes />
              </button>
            </div>
            <div className="game-form-container">
              <div className="game-form-group">
                <label className="game-form-label">Tipo</label>
                <select
                  className="game-form-select"
                  value={ruletaData.tipo}
                  onChange={e => {
                    const newTipo = e.target.value;
                    let newNombre = '';
                    
                    // Generar nombre automático según el tipo
                    if (newTipo === 'puntos') {
                      newNombre = `${ruletaData.puntos > 0 ? '+' : ''}${ruletaData.puntos} puntos`;
                    } else if (newTipo === 'comodin' && ruletaData.comodin_id) {
                      const comodinSeleccionado = comodines.find(c => c.idcomodines == ruletaData.comodin_id);
                      newNombre = comodinSeleccionado ? comodinSeleccionado.nombre : '';
                    }
                    
                    setRuletaData(prev => ({ 
                      ...prev, 
                      tipo: newTipo, 
                      nombre: newNombre 
                    }));
                  }}
                >
                  <option value="comodin">Comodín existente</option>
                  <option value="puntos">Puntos (+/-)</option>
                  <option value="personalizado">Elemento personalizado</option>
                </select>
              </div>
              
              {ruletaData.tipo === 'comodin' && (
                <div className="game-form-group">
                  <label className="game-form-label">Seleccionar Comodín</label>
                  <select
                    className="game-form-select"
                    value={ruletaData.comodin_id || ''}
                    onChange={e => {
                      const comodinId = e.target.value;
                      const comodinSeleccionado = comodines.find(c => c.idcomodines == comodinId);
                      setRuletaData(prev => ({ 
                        ...prev, 
                        comodin_id: comodinId,
                        nombre: comodinSeleccionado ? comodinSeleccionado.nombre : ''
                      }));
                    }}
                    disabled={isLoadingComodines}
                  >
                    <option value="">
                      {isLoadingComodines ? 'Cargando comodines...' : 'Selecciona un comodín'}
                    </option>
                    {comodines.map(comodin => (
                      <option key={comodin.idcomodines} value={comodin.idcomodines}>
                        {comodin.nombre}
                      </option>
                    ))}
                  </select>
                  {isLoadingComodines && (
                    <div className="text-sm text-gray-500 mt-1">
                      <FaSpinner className="inline animate-spin mr-1" />
                      Cargando comodines...
                    </div>
                  )}
                </div>
              )}
              
              {ruletaData.tipo === 'puntos' && (
                <div className="game-form-group">
                  <label className="game-form-label">Cantidad de Puntos</label>
                  <input
                    type="number"
                    className="game-form-input"
                    value={ruletaData.puntos}
                    onChange={e => {
                      const puntos = parseInt(e.target.value) || 0;
                      setRuletaData(prev => ({ 
                        ...prev, 
                        puntos: puntos,
                        nombre: `${puntos > 0 ? '+' : ''}${puntos} puntos`
                      }));
                    }}
                    placeholder="Ej: 10, -5, 25, -15"
                  />
                  <small className="text-gray-500">
                    Usa números positivos para sumar puntos, negativos para restar. Ejemplos: 10, -5, 25
                  </small>
                </div>
              )}
              
              {ruletaData.tipo === 'personalizado' && (
                <div className="game-form-group">
                  <label className="game-form-label">Nombre</label>
                  <input
                    type="text"
                    className="game-form-input"
                    defaultValue={ruletaData.nombre}
                    onBlur={(e) => setRuletaData(prev => ({ ...prev, nombre: e.target.value }))}
                    placeholder="Nombre del elemento personalizado"
                  />
                </div>
              )}
              
              <div className="game-form-group">
                <label className="game-form-label">
                  <input
                    type="checkbox"
                    checked={ruletaData.activo}
                    onChange={e => setRuletaData(prev => ({ ...prev, activo: e.target.checked }))}
                    className="mr-2"
                  />
                  Activo
                </label>
              </div>
              
              <button
                onClick={handleSaveRuletaItem}
                disabled={isSavingRuleta}
                className="game-form-submit"
              >
                {isSavingRuleta ? (
                  <>
                    <FaSpinner className="spinner" />
                    <span>Guardando...</span>
                  </>
                ) : (
                  <>
                    <FaCheck />
                    <span>{ruletaData.id ? 'Guardar Cambios' : 'Crear Elemento'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Función para guardar el canal de Twitch
  const guardarTwitch = async () => {
    try {
      const res = await axios.put('/api/perfil/twitch', { nickname: user.nickname, twitch_channel: formData.twitch_channel });
      setMensajeTwitch(res.data.message);
    } catch (error) {
      setMensajeTwitch(error.response?.data?.message || 'Error al guardar');
    }
  };

  return (
    <div className="perfil-container">
      {user && user.rol === 0 && <AdminMenu className="admin-menu" />}
      <div className={user && user.rol === 0 ? 'main-content-admin' : 'main-content'}>
        {user.rol === 0 ? (
          <>
            {activeSection === 'perfil' && (
              <div className="profile-edit-section">
                <h2 className="section-title">Editar Perfil</h2>
                <ProfileContent />
              </div>
            )}
            {activeSection === 'juegos' && <JuegosContent />}
            {activeSection === 'logros' && <LogrosContent />}
            {activeSection === 'comodines' && <ComodinesContent />}
            {activeSection === 'usuarios' && <UsuariosContent />}
            {activeSection === 'torneo' && <TorneoContent />}
            {activeSection === 'puntos' && <PuntosContent />}
            {activeSection === 'partidas' && <PartidasContent />}
            {activeSection === 'entradas' && <EntradasContent />}
            {activeSection === 'ruleta' && <RuletaContent />}
            {showGameModal && <GameModal />}
            {showLogroModal && <LogroModal />}
            {showComodinModal && <ComodinModal />}
            {showTorneoModal && <TorneoModal />}
            {showJuegosModal && <JuegosModal />}
            {showJugadoresModal && <JugadoresModal />}
            {showEditTorneoModal && <EditTorneoModal />}
            {showPuntosModal && <PuntosModal />}
            {showCrearPartidaModal && <CrearPartidaModal />}
            {showResultadoModal && <ResultadoModal />}
            {showJugadoresInicioModal && (
              <div className="game-modal">
                <div className="game-modal-content">
                  <div className="game-modal-header">
                    <h3 className="game-modal-title">Gestionar Jugadores del Inicio</h3>
                    <button
                      onClick={() => setShowJugadoresInicioModal(false)}
                      className="game-modal-close"
                    >
                      <FaTimes />
                    </button>
                  </div>
                  <div className="game-form-container">
                    <p className="text-gray-600 mb-4">
                      Selecciona los jugadores que aparecerán en la página principal. 
                      Los usuarios podrán hacer clic en ellos para ver su información.
                    </p>
                    
                    {jugadoresDisponiblesInicio.length === 0 ? (
                      <div className="loading-spinner">
                        <FaSpinner className="spinner-icon" />
                        <span>Cargando jugadores disponibles...</span>
                      </div>
                    ) : (
                      <div className="jugadores-grid">
                        {jugadoresDisponiblesInicio.map(jugador => (
                          <div key={jugador.nickname} className="jugador-checkbox">
                            <input
                              type="checkbox"
                              id={`jugador-inicio-${jugador.nickname}`}
                              checked={jugadoresSeleccionadosInicio.includes(jugador.nickname)}
                              onChange={() => handleJugadorInicioToggle(jugador.nickname)}
                              className="checkbox-input"
                            />
                            <label htmlFor={`jugador-inicio-${jugador.nickname}`} className="checkbox-label">
                              <img
                                src={jugador.foto || '/default-profile.png'}
                                alt={jugador.nickname}
                                className="jugador-thumbnail"
                              />
                              <div className="jugador-info">
                                <span className="jugador-nickname">{jugador.nickname}</span>
                                <span className="jugador-email">{jugador.email}</span>
                              </div>
                            </label>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="game-form-actions" style={{display:'flex',gap:'1rem'}}>
                      <button
                        onClick={() => setShowJugadoresInicioModal(false)}
                        className="game-form-cancel"
                        type="button"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handleSaveJugadoresInicio}
                        disabled={isSavingJugadoresInicio}
                        className="game-form-submit"
                        type="button"
                      >
                        {isSavingJugadoresInicio ? (
                          <>
                            <FaSpinner className="spinner" />
                            <span>Guardando...</span>
                          </>
                        ) : (
                          <>
                            <FaSave />
                            <span>Guardar Jugadores</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {activeSection === 'historico_videos' && <HistoricoVideosContent />}
          </>
        ) : (
          <div className="profile-edit-section">
            <h2 className="section-title">Mi Perfil</h2>
            <ProfileContent />
          </div>
        )}
      </div>
    </div>
  );
};

export default Perfil;