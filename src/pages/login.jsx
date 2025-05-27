import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Navbar } from "../Components/Navbar";
import {Footer} from "../Components/Footer";
import axios from "axios";
import "../style/login.css";
import { Eye, EyeOff } from "lucide-react"; // O cualquier ícono que uses
import { AUTH_ROUTES } from "../routes/api.routes";

export const Login = () => {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(AUTH_ROUTES.LOGIN, {
        nickname,
        password,
      });

      localStorage.setItem("token", res.data.token);
      navigate("/perfil");
       // Si la respuesta del backend es exitosa
       if (response.data.message === "Usuario registrado correctamente") {
        setRegistroExitoso(true); // Mostrar mensaje de registro exitoso
        setTimeout(() => {
          navigate("/login"); // Redirigir al login después de 2 segundos
        }, 2000);
      }
    } catch (err) {
      console.log(err);
      if (err.response && err.response.data.message) {
        setError(err.response.data.message); // Mostrar el mensaje de error del backend
      } else {
      setError("Usuario o contraseña incorrectos");
      }
    }

    
  };

  return (
    <>
    
    <div className="page-content">
      <h1>Iniciar Sesión</h1>

      <form className="login-form" onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Usuario" 
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />

<div className="password-container">
  <input 
    type={showPassword ? "text" : "password"} 
    placeholder="Contraseña" 
    value={password}
    onChange={(e) => setPassword(e.target.value)}
  />
  <button 
    type="button" 
    className="eye-button" 
    onClick={() => setShowPassword(!showPassword)}
  >
    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
  </button>
</div>

        <button type="submit">Ingresar</button>

        {error && <p className="error-message">{error}</p>}
        
        <Link to="/forgot-password" className="forgot-password-link">
          ¿Olvidaste tu contraseña?
        </Link>
      </form>
    </div>
  
    </>
  );
};

