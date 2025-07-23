import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';
import { Navbar } from '../Components/Navbar';
import { Footer } from '../Components/Footer';
import './transmisiones.css';

const Transmisiones = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [canalSeleccionado, setCanalSeleccionado] = useState(null);

  useEffect(() => {
    axios.get('/api/usuarios/twitch-en-vivo')
      .then(res => setUsuarios(res.data.data))
      .catch(() => setUsuarios([]));
  }, []);

  return (
    <>
      <Navbar />
      <div className="transmisiones-bg">
        <h2 className="transmisiones-title">Transmisiones en vivo de jugadores</h2>
        <div className="transmisiones-grid">
          {usuarios.length === 0 ? (
            <div className="transmisiones-empty">
              No hay transmisiones en vivo en este momento
            </div>
          ) : (
            usuarios.map(u => (
              <div key={u.nickname} className="transmision-card">
                <img src={u.foto} alt={u.nickname} className="transmision-avatar" />
                <h4 className="transmision-nick">{u.nickname}</h4>
                <p className="transmision-desc">{u.descripcion}</p>
                <button onClick={() => setCanalSeleccionado(u.twitch_channel)} className="transmision-btn">
                  Ver transmisión
                </button>
              </div>
            ))
          )}
        </div>
        {canalSeleccionado && (
          <div className="transmision-player-container">
            <h3 className="transmision-player-title">Viendo: {canalSeleccionado}</h3>
            <div className="transmision-player-wrapper">
              <iframe
                src={`https://player.twitch.tv/?channel=${canalSeleccionado}&parent=${window.location.hostname}`}
                allowFullScreen
                frameBorder="0"
                className="transmision-player"
                title="Twitch Player"
              />
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Transmisiones; 