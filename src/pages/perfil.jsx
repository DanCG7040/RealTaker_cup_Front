import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaCamera, FaCheck, FaTimes, FaSpinner, FaUser, FaEnvelope, FaPen, FaLock, FaGamepad, FaMedal, FaStar, FaBook, FaUsers } from 'react-icons/fa';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PROFILE_ROUTES, ADMIN_ROUTES, GAMES_ROUTES, CATEGORY_ROUTES, LOGROS_ROUTES, COMODINES_ROUTES } from '../routes/api.routes';
import '../styles/perfil.css';

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
    nombre: '',
    descripcion: ''
  });
  const [comodinData, setComodinData] = useState({
    nombre: '',
    descripcion: ''
  });
  const [logroFile, setLogroFile] = useState(null);
  const [comodinFile, setComodinFile] = useState(null);
  const [logroImagePreview, setLogroImagePreview] = useState(null);
  const [comodinImagePreview, setComodinImagePreview] = useState(null);
  const [isSavingLogro, setIsSavingLogro] = useState(false);
  const [isSavingComodin, setIsSavingComodin] = useState(false);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const gameFileInputRef = useRef(null);
  const logroFileInputRef = useRef(null);
  const comodinFileInputRef = useRef(null);

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
      const response = await axios.get(LOGROS_ROUTES.GET_ALL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setLogros(response.data.data);
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
      const response = await axios.get(COMODINES_ROUTES.GET_ALL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setComodines(response.data.data);
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
  }, [activeSection]);

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

  const LogrosContent = () => {
    const handleDeleteLogro = async (idLogros) => {
      if (!window.confirm('¿Estás seguro de que deseas eliminar este logro?')) {
        return;
      }

      try {
        const response = await axios.delete(LOGROS_ROUTES.DELETE(idLogros), {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data.success) {
          setLogros(logros.filter(logro => logro.idLogros !== idLogros));
          toast.success('Logro eliminado exitosamente');
        }
      } catch (error) {
        console.error('Error al eliminar logro:', error);
        toast.error('Error al eliminar el logro');
      }
    };

    return (
      <div className="content-section">
        <div className="games-header">
          <h2>Logros</h2>
          <button className="add-game-button" onClick={() => {
            setLogroData({ nombre: '', descripcion: '' });
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
                {logros.map(logro => (
                  <tr key={logro.idLogros}>
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
                            idLogros: logro.idLogros,
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
                        onClick={() => handleDeleteLogro(logro.idLogros)}
                      >
                        <FaTimes />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    );
  };

  const ComodinesContent = () => {
    const handleDeleteComodin = async (id) => {
      if (!window.confirm('¿Estás seguro de que deseas eliminar este comodín?')) {
        return;
      }

      try {
        await axios.delete(COMODINES_ROUTES.DELETE(id), {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        toast.success('Comodín eliminado correctamente');
        await fetchComodines();
      } catch (error) {
        console.error('Error al eliminar comodín:', error);
        toast.error(error.response?.data?.error || 'Error al eliminar el comodín');
      }
    };

    return (
      <div className="content-section">
        <div className="games-header">
          <h2 className="games-title">Gestión de Comodines</h2>
          <button
            onClick={() => {
              setComodinData({ nombre: '', descripcion: '' });
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
                {comodines.map((comodin) => (
                  <tr key={comodin.idComodines}>
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
                          onClick={() => handleDeleteComodin(comodin.idComodines)}
                          className="text-red-600 hover:text-red-800 transition-colors p-2"
                          title="Eliminar comodín"
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
  };

  if (loading) return <div className="text-center py-8">Cargando perfil...</div>;
  if (!user) return null;

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
        </div>

        {isLoadingUsuarios ? (
          <div className="loading-spinner">
            <FaSpinner className="loading-spinner-icon" />
          </div>
        ) : (
          <div className="games-table-container">
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
        
        if (logroFile) {
          formData.append('foto', logroFile);
        } 
        else if (logroData.id && logroImagePreview) {
          formData.append('foto', logroImagePreview);
        }

        const config = {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        };

        let response;
        if (logroData.id) {
          response = await axios.put(LOGROS_ROUTES.UPDATE(logroData.id), formData, config);
          toast.success('Logro actualizado correctamente');
        } else {
          response = await axios.post(LOGROS_ROUTES.CREATE, formData, config);
          toast.success('Logro agregado correctamente');
        }

        setShowLogroModal(false);
        setLogroData({ nombre: '', descripcion: '' });
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
              {logroData.id ? 'Editar Logro' : 'Agregar Nuevo Logro'}
            </h3>
            <button
              onClick={() => {
                setShowLogroModal(false);
                setLogroData({ nombre: '', descripcion: '' });
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
                        {logroData.id ? 'Cambiar imagen' : 'Subir imagen'}
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
                  <span>{logroData.id ? 'Guardar Cambios' : 'Crear Logro'}</span>
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
        
        if (comodinFile) {
          formData.append('foto', comodinFile);
        } 
        else if (comodinData.id && comodinImagePreview) {
          formData.append('foto', comodinImagePreview);
        }

        const config = {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        };

        let response;
        if (comodinData.id) {
          response = await axios.put(COMODINES_ROUTES.UPDATE(comodinData.id), formData, config);
          toast.success('Comodín actualizado correctamente');
        } else {
          response = await axios.post(COMODINES_ROUTES.CREATE, formData, config);
          toast.success('Comodín agregado correctamente');
        }

        setShowComodinModal(false);
        setComodinData({ nombre: '', descripcion: '' });
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
              {comodinData.id ? 'Editar Comodín' : 'Agregar Nuevo Comodín'}
            </h3>
            <button
              onClick={() => {
                setShowComodinModal(false);
                setComodinData({ nombre: '', descripcion: '' });
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
                        {comodinData.id ? 'Cambiar imagen' : 'Subir imagen'}
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
                  <span>{comodinData.id ? 'Guardar Cambios' : 'Crear Comodín'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="app-container-perfil">
      {user.rol === 0 && <AdminMenu />}
      <div className="main-content">
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
            {showGameModal && <GameModal />}
            {showLogroModal && <LogroModal />}
            {showComodinModal && <ComodinModal />}
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