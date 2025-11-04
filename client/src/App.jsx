import React, { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';

import { useAuth } from './context/AuthContext';
import AuthForms from './components/AuthForms';
import TodoDashboard from './components/TodoDashboard';
import { getCurrentUser, logout } from './api';

function AppShell({ children, onLogout, isLoading, statusMessage }) {
  // Present a consistent layout with navigation and optional status messages.
  return (
    <BrowserRouter>
      <Navbar bg="dark" variant="dark" expand="md" className="mb-4">
        <Container>
          <Navbar.Brand>Todo App</Navbar.Brand>
          <Nav className="ms-auto">
            <Nav.Link onClick={onLogout}>Logout</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <Container>
        {statusMessage && (
          <Alert variant={statusMessage.variant} className="mb-3">
            {statusMessage.message}
          </Alert>
        )}
        {isLoading ? (
          <div className="d-flex justify-content-center py-5">
            <Spinner animation="border" />
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
    // Attempt to restore the session when the SPA first mounts.
    async function bootstrap() {
      try {
        const existingUser = await getCurrentUser();
        if (existingUser) {
          login(existingUser);
        }
      } catch (error) {
        setStatusMessage({
          variant: 'danger',
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
      setStatusMessage({ variant: 'success', message: 'Hai effettuato il logout.' });
    } catch (error) {
      setStatusMessage({ variant: 'danger', message: error.message });
    }
  };

  return (
    <AppShell onLogout={handleLogout} isLoading={bootstrapping} statusMessage={statusMessage}>
      <Routes>
        <Route
          path="/login"
          element={user ? <Navigate to="/todos" replace /> : <AuthForms onLogin={login} />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/todos" replace /> : <AuthForms onLogin={login} mode="register" />}
        />
        <Route
          path="/todos"
          element={user ? <TodoDashboard /> : <Navigate to="/login" replace />}
        />
        <Route path="*" element={<Navigate to={user ? '/todos' : '/login'} replace />} />
      </Routes>
    </AppShell>
  );
}
