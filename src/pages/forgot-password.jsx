import { useState } from "react";
import axios from "axios";
import "../style/login.css";
import { AUTH_ROUTES } from "../routes/api.routes";

export const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(AUTH_ROUTES.FORGOT_PASSWORD, {
        email
      });

      setIsSuccess(true);
      setMessage(response.data.message);
    } catch (err) {
      setIsSuccess(false);
      setMessage(err.response?.data?.message || "Error al procesar la solicitud");
    }
  };

  return (
    <div className="page-content">
      <h1>Recuperar Contraseña</h1>

      <form className="login-form" onSubmit={handleSubmit}>
        <p className="instructions">
          Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
        </p>

        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button type="submit">Enviar enlace</button>

        {message && (
          <p className={isSuccess ? "success-message" : "error-message"}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
}; 