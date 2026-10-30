import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { TasksPage } from "./pages/TasksPage";

function AppRoutes() {
  const { token } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to={token ? "/tasks" : "/login"} replace />}
      />
      <Route
        path="/login"
        element={token ? <Navigate to="/tasks" replace /> : <LoginPage />}
      />
      <Route
        path="/register"
        element={token ? <Navigate to="/tasks" replace /> : <RegisterPage />}
      />
      <Route
        path="/tasks"
        element={token ? <TasksPage /> : <Navigate to="/login" replace />}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
