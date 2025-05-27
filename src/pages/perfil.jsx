import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaCamera, FaCheck, FaTimes, FaSpinner, FaUser, FaEnvelope, FaPen, FaLock, FaGamepad, FaMedal, FaStar, FaBook } from 'react-icons/fa';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PROFILE_ROUTES, ADMIN_ROUTES, GAMES_ROUTES, CATEGORY_ROUTES } from '../routes/api.routes';
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
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const gameFileInputRef = useRef(null);

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

  useEffect(() => {
    if (activeSection === 'juegos') {
      fetchJuegos();
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
          onClick={() => setActiveSection('usuarios')}
          className={`admin-menu-button ${
            activeSection === 'usuarios' ? 'admin-menu-button-active' : ''
          }`}
        >
          <FaUser className="w-4 h-4 mr-2" />
          Usuarios
        </button>
      </nav>
    </div>
  );

  const UsuariosContent = () => (
    <div className="content-section">
      <h2 className="text-2xl font-bold mb-6">Gestión de Usuarios</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Cambiar Rol de Usuario</h3>
          <p className="text-gray-600 mb-4">Modifica el nivel de acceso de un usuario</p>
          <button
            onClick={handleChangeRole}
            className="w-full bg-yellow-600 text-white px-4 py-3 rounded-lg hover:bg-yellow-700 transition-colors flex items-center justify-center"
          >
            <FaPen className="mr-2" /> Cambiar Rol
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Eliminar Usuario</h3>
          <p className="text-gray-600 mb-4">Elimina permanentemente un usuario del sistema</p>
          <button
            onClick={handleDeleteUser}
            className="w-full bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
          >
            <FaTimes className="mr-2" /> Eliminar Usuario
          </button>
        </div>
      </div>
    </div>
  );

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
            {activeSection === 'usuarios' && <UsuariosContent />}
            {showGameModal && <GameModal />}
          </>
        ) : (
          <div className="profile-user-view">
            <h2 className="section-title">Mi Perfil</h2>
            <ProfileContent />
          </div>
        )}
      </div>
    </div>
  );
};

export default Perfil;