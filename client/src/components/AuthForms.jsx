import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Fade from 'react-bootstrap/Fade';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';

import { login as loginRequest, register as registerRequest } from '../api';

export default function AuthForms({ mode = 'login', onLogin }) {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const isRegister = mode === 'register';

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const payload = isRegister
        ? await registerRequest(formState)
        : await loginRequest({ email: formState.email, password: formState.password });

      onLogin(payload.user);
      navigate('/todos');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="mx-auto slide-up scale-on-hover shadow" style={{ maxWidth: '420px' }}>
      <Card.Body>
        <Card.Title className="mb-4 text-center fw-semibold">
          {isRegister ? 'Crea un nuovo account' : 'Accedi'}
        </Card.Title>
        <Fade in={!!error} mountOnEnter unmountOnExit>
          <div>
            <Alert variant="danger" className="mb-4 shadow-sm">
              {error}
            </Alert>
          </div>
        </Fade>
        <Form onSubmit={handleSubmit}>
          {isRegister && (
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Nome completo</Form.Label>
              <Form.Control
                name="name"
                placeholder="Mario Rossi"
                value={formState.name}
                onChange={handleChange}
                required
              />
            </Form.Group>
          )}
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="nome@esempio.com"
              value={formState.email}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Scegli una password sicura"
              value={formState.password}
              onChange={handleChange}
              required
            />
          </Form.Group>
          {isRegister && (
            <Form.Group className="mb-3" controlId="confirmPassword">
              <Form.Label>Conferma password</Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                placeholder="Ripeti la password"
                value={formState.confirmPassword}
                onChange={handleChange}
                required
              />
            </Form.Group>
          )}
          <div className="d-grid gap-2">
            <Button
              type="submit"
              variant="primary"
              disabled={submitting}
              className="scale-on-hover"
            >
              {submitting ? 'Invio in corso…' : isRegister ? 'Registrati' : 'Accedi'}
            </Button>
            <Button
              variant="link"
              onClick={() => navigate(isRegister ? '/login' : '/register')}
              className="text-decoration-none"
            >
              {isRegister ? 'Hai già un account? Accedi' : 'Non hai un account? Registrati'}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}
