import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { ApiError, api } from "../services/api";
import type { Task } from "../types";

export function TasksPage() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (!token) return;

    let active = true;

    void api
      .getTasks(token)
      .then((result) => {
        if (active) setTasks(result.tasks);
      })
      .catch((caughtError: unknown) => {
        if (active) {
          setError(
            caughtError instanceof Error
              ? caughtError.message
              : "No se pudieron cargar las tareas.",
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [token]);

  const pendingCount = tasks.filter((task) => task.status === "pending").length;
  const completedCount = tasks.filter(
    (task) => task.status === "completed",
  ).length;

  async function handleCreateTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) return;

    setError("");
    setNotice("");
    setSaving(true);

    try {
      const taskDescription = description.trim();
      const result = await api.createTask(
        token,
        title.trim(),
        taskDescription,
      );
      const createdTask = {
        ...result.task,
        description: result.task.description || taskDescription,
      };
      setTasks((current) => [createdTask, ...current]);
      setTitle("");
      setDescription("");
      setNotice("Tarea creada correctamente.");
    } catch (caughtError) {
      setError(
        caughtError instanceof ApiError || caughtError instanceof Error
          ? caughtError.message
          : "No se pudo crear la tarea.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteTask(task: Task) {
    if (!token) return;
    if (!window.confirm(`¿Eliminar la tarea "${task.title}"?`)) return;

    setError("");
    setNotice("");

    try {
      await api.deleteTask(token, task._id);
      setTasks((current) => current.filter((item) => item._id !== task._id));
      setNotice("Tarea eliminada.");
    } catch (caughtError) {
      setError(
        caughtError instanceof ApiError || caughtError instanceof Error
          ? caughtError.message
          : "No se pudo eliminar la tarea.",
      );
    }
  }

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <a className="brand" href="/tasks" aria-label="Legion Fit, inicio">
          <span className="brand-mark">LF</span>
          <span className="dashboard-brand-name">
            LEGION <b>FIT</b>
          </span>
        </a>

        <div className="account">
          <span className="account-name">{user?.name ?? "Mi cuenta"}</span>
          <button
            className="button button-quiet"
            onClick={handleLogout}
            type="button"
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      <section className="dashboard-content">
        <div className="welcome">
          <div>
            <p className="eyebrow">MIS TAREAS</p>
            <h1>Mis tareas</h1>
            <p className="muted">
              Revisa tus pendientes y agrega nuevas tareas cuando lo necesites.
            </p>
          </div>
        </div>

        <section className="stats" aria-label="Resumen de tareas">
          <article className="stat-card">
            <span>Total de tareas</span>
            <strong>{tasks.length}</strong>
          </article>
          <article className="stat-card">
            <span>Pendientes</span>
            <strong>{pendingCount}</strong>
          </article>
          <article className="stat-card">
            <span>Completadas</span>
            <strong>{completedCount}</strong>
          </article>
        </section>

        <section className="task-layout">
          <form className="task-form" onSubmit={handleCreateTask}>
            <p className="panel-kicker">NUEVA TAREA</p>
            <h2>Añadir una tarea</h2>
            <p className="muted">Completa los datos de la tarea.</p>

            <label htmlFor="task-title">Título</label>
            <input
              id="task-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              maxLength={120}
              placeholder="Ej. Revisar mi rutina de entrenamiento"
              required
            />

            <label htmlFor="task-description">Descripción</label>
            <textarea
              id="task-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              maxLength={1000}
              rows={4}
              placeholder="Agrega algún detalle (opcional)"
            />

            <button
              className="button button-primary"
              disabled={saving || !title.trim()}
              type="submit"
            >
              {saving ? "Guardando…" : "Crear tarea"}
            </button>
          </form>

          <section className="task-list-section">
            <div className="list-heading">
              <div>
                <h2>Tareas</h2>
                <p className="muted">
                  {tasks.length} {tasks.length === 1 ? "tarea" : "tareas"}
                </p>
              </div>
            </div>

            {error && <p className="form-error" role="alert">{error}</p>}
            {notice && <p className="form-success" role="status">{notice}</p>}

            {loading ? (
              <p className="empty-state">Cargando tareas…</p>
            ) : tasks.length === 0 ? (
              <div className="empty-state">
                <strong>Todavía no hay tareas</strong>
                <span>Usa el formulario para agregar la primera tarea.</span>
              </div>
            ) : (
              <ul className="task-list">
                {tasks.map((task) => (
                  <li className="task-card" key={task._id}>
                    <div className="task-card-content">
                      <div className="task-title-row">
                        <h3>{task.title}</h3>
                        <span className={`status status-${task.status}`}>
                          {task.status === "completed"
                            ? "Completado"
                            : "Pendiente"}
                        </span>
                      </div>

                      {task.description && <p className="task-description">{task.description}</p>}

                      <time dateTime={task.createdAt}>
                        Creada el{" "}
                        {new Date(task.createdAt).toLocaleDateString("es-PE")}
                      </time>
                    </div>

                    <button
                      className="button button-delete"
                      onClick={() => void handleDeleteTask(task)}
                      aria-label={`Eliminar ${task.title}`}
                      type="button"
                    >
                      Eliminar
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </section>
      </section>
    </main>
  );
}
