import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../axiosConfig.js';
import { toast } from 'react-toastify';

const Participa = () => {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ nombre: '', telefono: '', consola: '' });
  const [isSending, setIsSending] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    axios.get('/api/perfil', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setUser(res.data.data))
      .catch(() => {
        toast.error('Debes iniciar sesión');
        navigate('/login');
      });
  }, [navigate]);

  if (!user) return null;

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setIsSending(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/usuarios/enviar-participacion', {
        nombre: form.nombre,
        telefono: form.telefono,
        consola: form.consola,
        nickname: user.nickname,
        email: user.email
      });
      // El backend ya actualiza el rol automáticamente, no necesitamos hacer PUT adicional
      toast.success('¡Solicitud enviada! Ahora eres jugador.');
      setUser({ ...user, rol: 2 });
    } catch (err) {
      toast.error('Error al enviar la solicitud');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="participa-container">
      <h2>Participa en la TakerCup</h2>
      {user.rol === 2 ? (
        <div className="ya-jugador">Ya eres jugador. ¡Nos vemos en el torneo!</div>
      ) : (
        <form className="participa-form" onSubmit={handleSubmit}>
          <div>
            <label>Nombre</label>
            <input name="nombre" value={form.nombre} onChange={handleChange} required 
              style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc', width: '100%', marginBottom: '10px' }}
            />
          </div>
          <div>
            <label>Número de teléfono</label>
            <input name="telefono" value={form.telefono} onChange={handleChange} required 
              style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc', width: '100%', marginBottom: '10px' }}
            />
          </div>
          <div>
            <label>Consola donde juega</label>
            <input name="consola" value={form.consola} onChange={handleChange} required 
              style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc', width: '100%', marginBottom: '10px' }}
            />
          </div>
          <button type="submit" disabled={isSending}>
            {isSending ? 'Enviando...' : 'Enviar solicitud'}
          </button>
        </form>
      )}
    </div>
  );
};

export default Participa; 