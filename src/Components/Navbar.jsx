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

  const handleHistoricoClick = () => {
    navigate('/historico');
  };

  const handleTransmisionesClick = () => {
    navigate('/transmisiones');
  };

  // Detectar si es móvil/tablet
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          {/* Izquierda */}
          <div onClick={handleHistoricoClick} style={{ cursor: 'pointer' }} className="navbar-title">
            Histórico
          </div>

          {/* Centro */}
          <div onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
            <img src={logo} alt="Real TakerCup" className="navbar-logo" />
          </div>

          {/* Izquierda */}
          <div onClick={handleTransmisionesClick} style={{ cursor: 'pointer' }} className="navbar-title">
            Transmisiones
          </div>

          {/* Botón hamburguesa para móvil/tablet */}
          <button
            className="navbar-hamburger"
            onClick={() => setOpen(!open)}
            aria-label="Abrir menú"
          >
            <span />
            <span />
            <span />
          </button>

          {/* Menú hamburguesa para móvil/tablet */}
          <div className={`navbar-menu${open ? ' open' : ''}`}>
            {user ? (
              <>
                <p className="navbar-menu-item" onClick={() => { setOpen(false); handleProfileClick(); }}>Ver Perfil</p>
                <p className="navbar-menu-item" onClick={() => { setOpen(false); handleLogout(); }}>Cerrar Sesión</p>
              </>
            ) : (
              <>
                <Link className="navbar-menu-item" to="/login" onClick={() => setOpen(false)}>Ingresar</Link>
                <Link className="navbar-menu-item" to="/registro" onClick={() => setOpen(false)}>Registrarse</Link>
              </>
            )}
          </div>

          {/* Perfil solo visible en escritorio */}
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

            {/* Menú de usuario solo para escritorio */}
            {open && (
              <div className="navbar-profile-menu">
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