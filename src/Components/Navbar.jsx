import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../img/Logopode.png";
import { FaCircleUser } from "react-icons/fa6";
import axios from "axios";

export const Navbar = () => {
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      axios
        .get('http://localhost:3000/api/perfil', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          // Ajuste aquí: Accedemos a response.data.data
          setUser(response.data.data);
        })
        .catch((error) => {
          console.error('Error al cargar perfil', error);
          localStorage.removeItem('token');
          setUser(null);
        });
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/inicio');
  };

  const handleProfileClick = () => {
    navigate('/perfil');
  };

  const handleLogoClick = () => {
    navigate('/inicio'); 
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          {/* Izquierda */}
          <div className="navbar-title">Histórico</div>

          {/* Centro */}
          <div onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
            <img src={logo} alt="Real TakerCup" className="navbar-logo" />
          </div>

          {/* Derecha */}
          <div className="navbar-profile">
            <button onClick={() => setOpen(!open)} className="navbar-profile-button">
              {/* Mostrar foto si existe, sino mostrar ícono */}
              {user?.foto ? (
                <img 
                  src={user.foto} 
                  alt="Foto de perfil" 
                  className="navbar-profile-img rounded-full w-8 h-8 object-cover"
                />
              ) : (
                <FaCircleUser className="navbar-profile-img" />
              )}
              {user && <span className="navbar-username ml-2">{user.nickname}</span>}
            </button>

            {open && (
              <div className="navbar-menu">
                {user ? (
                  <>
                    <p className="navbar-menu-item" onClick={handleProfileClick}>Ver Perfil</p>
                    <p className="navbar-menu-item" onClick={handleLogout}>Cerrar Sesión</p>
                  </>
                ) : (
                  <>
                    <Link className="navbar-menu-item" to="/login">Ingresar</Link>
                    <Link className="navbar-menu-item" to="/registro">Registrarse</Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="page-content"></div>
    </>
  );
};