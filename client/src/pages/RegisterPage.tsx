import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ApiError } from "../services/api";
import { useAuth } from "../hooks/useAuth";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    if (cleanName.length < 2) return setError("El nombre debe tener al menos 2 caracteres.");
    if (!emailPattern.test(cleanEmail)) return setError("Escribe un correo electrónico válido.");
    if (password.length < 8) return setError("La contraseña debe tener al menos 8 caracteres.");

    setLoading(true);
    try {
      await register(cleanName, cleanEmail, password);
      navigate("/login");
    } catch (caughtError) {
      setError(caughtError instanceof ApiError || caughtError instanceof Error ? caughtError.message : "No se pudo crear la cuenta.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-showcase">
        <Link className="auth-brand" to="/register" aria-label="Legion Fit">
          <span className="auth-brand-mark">LF</span>
          <span className="auth-brand-name">LEGION <b>FIT</b></span>
        </Link>

        <div className="showcase-content">
          <span className="showcase-kicker">LEGION FIT / ESPACIO PERSONAL</span>
          <h2>Un lugar claro para organizar tus <em>metas.</em></h2>
          <p className="showcase-description">
            Crea tu cuenta para guardar tus tareas y consultar tu progreso cuando quieras.
          </p>
          <ul className="showcase-points">
            <li>Registra tus tareas personales</li>
            <li>Ten tus objetivos siempre a mano</li>
            <li>Avanza a tu propio ritmo</li>
          </ul>
        </div>
        <p className="showcase-footnote">LEGION FIT · ORGANIZACIÓN PERSONAL</p>
      </section>

      <section className="auth-panel">
        <div className="auth-form-wrap">
          <span className="form-kicker">NUEVA CUENTA</span>
          <h1>Crear una cuenta</h1>
          <p className="form-intro">Completa tus datos para empezar a organizar tus tareas.</p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label htmlFor="name">Nombre</label>
            <input className="auth-input" id="name" type="text" autoComplete="name" placeholder="Tu nombre" value={name} onChange={(event) => setName(event.target.value)} minLength={2} maxLength={80} required />

            <label htmlFor="email">Correo electrónico</label>
            <input className="auth-input" id="email" type="email" autoComplete="email" placeholder="nombre@correo.com" value={email} onChange={(event) => setEmail(event.target.value)} required />

            <label htmlFor="password">Contraseña</label>
            <input className="auth-input" id="password" type="password" autoComplete="new-password" placeholder="Mínimo 8 caracteres" value={password} onChange={(event) => setPassword(event.target.value)} minLength={8} required />
            <small className="password-hint">Usa al menos 8 caracteres.</small>

            {error && <p className="form-error" role="alert">{error}</p>}

            <button className="auth-submit" type="submit" disabled={loading}>
              {loading ? "Creando cuenta…" : "Crear cuenta"}
            </button>
          </form>

          <p className="auth-switch">¿Ya tienes cuenta? <Link to="/login">Iniciar sesión</Link></p>
        </div>
      </section>
    </main>
  );
}
