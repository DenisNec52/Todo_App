import React, { useEffect, useMemo, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Alert from "react-bootstrap/Alert";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Spinner from "react-bootstrap/Spinner";

import { useAuth } from "./context/AuthContext";
import AuthForms from "./components/AuthForms";
import TodoDashboard from "./components/TodoDashboard";
import RegisterPage from "./pages/RegisterPage";
import { getCurrentUser, logout } from "./api";

function AppShell({
  children,
  onLogout,
  isLoading,
  statusMessage,
  onDismissStatus,
  showLogout
}) {
  const hasStatus = Boolean(statusMessage);

  return (
    <BrowserRouter>
      <Navbar bg="dark" variant="dark" expand="md" className="mb-4 shadow-sm nav-blur">
        <Container>
          <Navbar.Brand className="fw-semibold">Todo App</Navbar.Brand>
          <Nav className="ms-auto">
            {showLogout ? (
              <Nav.Link onClick={onLogout} className="nav-link-animated">
                Logout
              </Nav.Link>
            ) : null}
          </Nav>
        </Container>
      </Navbar>
      <Container className="app-shell fade-in">
        {hasStatus ? (
          <Alert
            variant={statusMessage.variant}
            className="mb-3 fade-in"
            dismissible
            onClose={onDismissStatus}
          >
            {statusMessage.message}
          </Alert>
        ) : null}
        {isLoading ? (
          <div className="d-flex justify-content-center py-5">
            <Spinner animation="border" role="status" className="spinner-raise">
              <span className="visually-hidden">Caricamento…</span>
            </Spinner>
          </div>
        ) : (
          children
        )}
      </Container>
    </BrowserRouter>
  );
}

export default function App() {
  const { user, login, logout: clearAuth } = useAuth();
  const [bootstrapping, setBootstrapping] = useState(true);
  const [statusMessage, setStatusMessage] = useState(null);

  useEffect(() => {
    async function bootstrap() {
      try {
        const existingUser = await getCurrentUser();
        if (existingUser) {
          login(existingUser);
        }
      } catch (error) {
        setStatusMessage({
          variant: "danger",
          message: error.message
        });
      } finally {
        setBootstrapping(false);
      }
    }

    bootstrap();
  }, [login]);

  const handleLogout = async () => {
    try {
      await logout();
      clearAuth();
      setStatusMessage({ variant: "success", message: "Hai effettuato il logout." });
    } catch (error) {
      setStatusMessage({ variant: "danger", message: error.message });
    }
  };

  const routes = useMemo(
    () => (
      <Routes>
        <Route
          path="/login"
          element={user ? <Navigate to="/todos" replace /> : <AuthForms onLogin={login} />}
        />
        <Route
          path="/register"
          element={
            user ? <Navigate to="/todos" replace /> : <RegisterPage onLogin={login} />
          }
        />
        <Route
          path="/todos"
          element={user ? <TodoDashboard /> : <Navigate to="/login" replace />}
        />
        <Route path="*" element={<Navigate to={user ? "/todos" : "/login"} replace />} />
      </Routes>
    ),
    [login, user]
  );

  return (
    <AppShell
      onLogout={handleLogout}
      isLoading={bootstrapping}
      statusMessage={statusMessage}
      onDismissStatus={() => setStatusMessage(null)}
      showLogout={Boolean(user)}
    >
      {routes}
    </AppShell>
  );
}
