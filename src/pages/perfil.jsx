import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaCamera, FaCheck, FaTimes, FaSpinner, FaUser, FaEnvelope, FaPen, FaLock, FaGamepad, FaMedal, FaStar, FaBook } from 'react-icons/fa';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PROFILE_ROUTES, ADMIN_ROUTES } from '../routes/api.routes';

export const Perfil = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    nickname: '',
    email: '',
    descripcion: '',
    foto: ''
  });
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
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Cargar datos del perfil
  useEffect(() => {
    if (!token) {
      console.log('No hay token, redirigiendo a login');
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await axios.get(PROFILE_ROUTES.GET_PROFILE, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });
        
        const userData = response.data.data;
        setUser(userData);
        setFormData({
          nickname: userData.nickname || '',
          email: userData.email || '',
          descripcion: userData.descripcion || '',
          foto: userData.foto || ''
        });
      } catch (error) {
        console.error('Error al cargar el perfil:', error);
        toast.error(error.response?.data?.error || 'Error al cargar el perfil');
        
        if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSave = async () => {
    if (isSaving) return; // Prevenir múltiples envíos
    setIsSaving(true);
  
    try {
      // Crear una copia del estado actual para comparar cambios
      const currentFormData = {
        email: formData.email?.trim() || '',
        descripcion: formData.descripcion?.trim() || '',
      };

      const formDataToSend = new FormData();
      
      // Solo enviar campos que han sido modificados
      if (currentFormData.email !== user.email) {
        formDataToSend.append('email', currentFormData.email);
      }
      
      if (currentFormData.descripcion !== user.descripcion) {
        formDataToSend.append('descripcion', currentFormData.descripcion);
      }

      if (file) {
        formDataToSend.append('foto', file);
      }

      // Validar contraseñas si se proporcionaron
      if (passwordData.newPassword || passwordData.confirmPassword) {
        if (!passwordData.newPassword || !passwordData.confirmPassword) {
          toast.error('Por favor complete ambos campos de contraseña');
          setIsSaving(false);
          return;
        }
        
        if (passwordData.newPassword !== passwordData.confirmPassword) {
          toast.error('Las contraseñas no coinciden');
          setIsSaving(false);
          return;
        }

        if (passwordData.newPassword.trim().length < 6) {
          toast.error('La contraseña debe tener al menos 6 caracteres');
          setIsSaving(false);
          return;
        }

        formDataToSend.append('newPassword', passwordData.newPassword.trim());
      }

      // Verificar si hay datos para enviar
      if ([...formDataToSend.entries()].length === 0) {
        toast.info('No hay cambios para guardar');
        setIsSaving(false);
        return;
      }
  
      const response = await axios.put(
        PROFILE_ROUTES.UPDATE_PROFILE, 
        formDataToSend,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      const updatedData = response.data.data;

      // Actualizar el estado del usuario preservando datos existentes
      setUser(prevUser => ({
        ...prevUser,
        ...(updatedData.email && { email: updatedData.email }),
        ...(updatedData.descripcion !== undefined && { descripcion: updatedData.descripcion }),
        ...(updatedData.foto && { foto: updatedData.foto })
      }));

      // Actualizar formData preservando datos existentes
      setFormData(prevFormData => ({
        ...prevFormData,
        ...(updatedData.email && { email: updatedData.email }),
        ...(updatedData.descripcion !== undefined && { descripcion: updatedData.descripcion }),
        ...(updatedData.foto && { foto: updatedData.foto })
      }));

      // Resetear estados relacionados con la imagen solo si se actualizó correctamente
      if (file && updatedData.foto) {
        setFile(null);
        setImagePreview(null);
      }

      // Resetear estados de contraseña solo si se actualizó correctamente
      if (passwordData.newPassword && response.data.success) {
        setPasswordData({ newPassword: '', confirmPassword: '' });
      }
      
      toast.success('Perfil actualizado correctamente');
    } catch (error) {
      console.error('Error al guardar:', error);
      const errorMessage = error.response?.data?.error || 'Error al actualizar perfil';
      toast.error(errorMessage);
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

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validaciones de archivo
      if (!selectedFile.type.startsWith('image/')) {
        toast.error('Por favor selecciona una imagen');
        return;
      }

      if (selectedFile.size > 2 * 1024 * 1024) {
        toast.error('La imagen no puede ser mayor a 2MB');
        return;
      }

      setFile(selectedFile);

      // Crear preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  // Funciones de ADMIN
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
    const nickname = prompt('Nickname del usuario a cambiar rol');
    const newRole = prompt('Nuevo rol: (0=Admin, 1=Usuario, 2=Jugador)');

    if (nickname && newRole !== null) {
      try {
        await axios.put(ADMIN_ROUTES.UPDATE_ROLE, 
          { nickname, rol: parseInt(newRole) }, 
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success('Rol actualizado correctamente');
      } catch (error) {
        console.error('Error cambiando rol', error);
        toast.error(error.response?.data?.message || 'Error al cambiar rol');
      }
    }
  };

  if (loading) return <div className="text-center py-8">Cargando perfil...</div>;
  if (!user) return null;

  const ProfileContent = () => (
    <div className="space-y-6">
      {/* Imagen de perfil */}
      <div className="profile-image-container">
        <img
          src={imagePreview || formData.foto || '/default-profile.png'}
          alt="Foto de perfil"
          className="profile-image"
          onClick={handleImageClick}
        />
        <button
          onClick={handleImageClick}
          className="profile-image-button"
          title="Cambiar foto"
        >
          <FaCamera className="w-4 h-4" />
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/jpeg,image/png,image/gif"
        />
      </div>

      {/* Campos del formulario */}
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
            value={formData.descripcion || ''}
            onChange={handleChange}
            rows="4"
            placeholder="Describe tu perfil..."
          ></textarea>
          <FaPen className="profile-input-icon" style={{ top: '1.5rem' }} />
        </div>

        {/* Campos de contraseña */}
        <div className="profile-input">
          <div className="password-container">
            <input
              type={showNewPassword ? "text" : "password"}
              name="newPassword"
              value={passwordData.newPassword || ''}
              onChange={handlePasswordChange}
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
              value={passwordData.confirmPassword || ''}
              onChange={handlePasswordChange}
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

      {/* Botones de acción */}
      <div className="space-y-4">
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

  const AdminPanel = () => (
    <div className="admin-section">
      <h2 className="admin-panel-title">Panel de Administrador</h2>
      <div className="admin-buttons">
        <div className="admin-section-group">
          <h3 className="admin-section-title">Gestión de Juegos</h3>
          <button className="profile-button profile-button-primary">
            <FaGamepad className="w-4 h-4" />
            Agregar Juegos
          </button>
          <button className="profile-button profile-button-primary">
            <FaMedal className="w-4 h-4" />
            Agregar Logros
          </button>
        </div>

        <div className="admin-section-group">
          <h3 className="admin-section-title">Gestión de Sistema</h3>
          <button className="profile-button profile-button-warning">
            <FaStar className="w-4 h-4" />
            Agregar Comodines
          </button>
          <button className="profile-button profile-button-warning">
            <FaBook className="w-4 h-4" />
            Ajustar Reglas
          </button>
        </div>

        <div className="admin-section-group">
          <h3 className="admin-section-title">Gestión de Usuarios</h3>
          <button
            onClick={handleDeleteUser}
            className="profile-button profile-button-danger"
          >
            <FaTimes className="w-4 h-4" />
            Eliminar Usuario
          </button>
          <button
            onClick={handleChangeRole}
            className="profile-button profile-button-warning"
          >
            <FaPen className="w-4 h-4" />
            Cambiar Rol
          </button>
        </div>
      </div>
    </div>
  );

  // Vista diferenciada según el rol
  return (
    <div className="profile-container">
      {user.rol === 0 ? (
        <div className="profile-sections">
          <div className="profile-edit-section">
            <h2 className="section-title">Editar Perfil</h2>
            <ProfileContent />
          </div>
          <AdminPanel />
        </div>
      ) : (
        <div className="profile-user-view">
          <h2 className="section-title">Mi Perfil</h2>
          <ProfileContent />
        </div>
      )}
    </div>
  );
};

export default Perfil;