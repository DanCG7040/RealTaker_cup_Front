import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { Inicio } from "./pages/Inicio";
import { Login } from "./pages/Login";
import { Registro } from "./pages/Registro";
import { Perfil } from "./pages/perfil";
import { Historico } from "./pages/historico";
import  Transmisiones  from "./pages/transmisiones";
import { ForgotPassword } from "./pages/forgot-password";
import { ResetPassword } from "./pages/reset-password";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Importa los componentes Navbar y Footer
import { Navbar } from "./Components/Navbar";
import { Footer } from "./Components/Footer";

function App() {
  // Obtenemos la ruta actual
  const location = useLocation();

  // Condición para no mostrar la Navbar en ciertas páginas
  const noNavbarPages = ['/login', '/registro', '/forgot-password', '/reset-password']; // Rutas en las que no se debe mostrar el Navbar

  // Si estamos en la página de perfil, renderizamos un layout diferente
  if (location.pathname === '/perfil') {
    return (
      <>
        <Navbar />
        <Perfil />
        <Footer />
        <ToastContainer position="bottom-right" autoClose={3000} />
      </>
    );
  }

  // Si estamos en la página de transmisiones, renderizamos un layout diferente
  if (location.pathname === '/transmisiones') {
    return (
      <>
        <Navbar />
        <Transmisiones />
        <Footer />
        <ToastContainer position="bottom-right" autoClose={3000} />
      </>
    );
  }

  // Para el resto de las páginas, mantenemos el layout original
  return (
    <div className="app-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}> {/* Contenedor global */}
      <ToastContainer position="bottom-right" autoClose={3000} />
      
      {/* Muestra el Navbar solo si no estamos en las páginas de login y registro */}
      {!noNavbarPages.includes(location.pathname) && <Navbar />} 

      <div className="page-content" style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Navigate to="/inicio" />} />
          <Route path="/inicio" element={<Inicio />} />
          <Route path="/historico" element={<Historico />} />
          <Route path="/transmisiones" element={<Transmisiones />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Routes>
      </div>

      {/* Footer siempre visible al final */}
      <Footer />
    </div>
  );
}

export default App;
