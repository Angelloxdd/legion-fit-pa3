import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email.trim().toLowerCase(), password);
      navigate("/tasks");
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "No se pudo iniciar sesión.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-showcase">
        <Link className="auth-brand" to="/login" aria-label="Legion Fit">
          <span className="auth-brand-mark">LF</span>
          <span className="auth-brand-name">LEGION <b>FIT</b></span>
        </Link>

        <div className="showcase-content">
          <span className="showcase-kicker">LEGION FIT / ESPACIO PERSONAL</span>
          <h2>Organiza tus objetivos. Avanza con <em>constancia.</em></h2>
          <p className="showcase-description">
            Reúne tus tareas y mantén a la vista lo que quieres completar.
          </p>
          <ul className="showcase-points">
            <li>Crea objetivos y pendientes</li>
            <li>Consulta el avance de tus tareas</li>
            <li>Administra tu lista desde una sola cuenta</li>
          </ul>
        </div>
        <p className="showcase-footnote">LEGION FIT · ORGANIZACIÓN PERSONAL</p>
      </section>

      <section className="auth-panel">
        <div className="auth-form-wrap">
          <span className="form-kicker">CUENTA</span>
          <h1>Iniciar sesión</h1>
          <p className="form-intro">Ingresa con tu correo y contraseña para ver tus tareas.</p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label htmlFor="email">Correo electrónico</label>
            <input className="auth-input" id="email" type="email" autoComplete="email" placeholder="nombre@correo.com" value={email} onChange={(event) => setEmail(event.target.value)} required />

            <label htmlFor="password">Contraseña</label>
            <input className="auth-input" id="password" type="password" autoComplete="current-password" placeholder="Ingresa tu contraseña" value={password} onChange={(event) => setPassword(event.target.value)} required />

            {error && <p className="form-error" role="alert">{error}</p>}

            <button className="auth-submit" type="submit" disabled={loading}>
              {loading ? "Ingresando…" : "Iniciar sesión"}
            </button>
          </form>

          <p className="auth-switch">¿No tienes cuenta? <Link to="/register">Crear una cuenta</Link></p>
        </div>
      </section>
    </main>
  );
}
