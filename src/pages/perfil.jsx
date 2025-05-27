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
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

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

      // Validar y agregar contraseña si se proporcionó
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
      if (passwordData.newPassword) {
        setPasswordData({ newPassword: '', confirmPassword: '' });
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